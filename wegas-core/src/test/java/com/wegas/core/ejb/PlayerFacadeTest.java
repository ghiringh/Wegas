/*
 * Wegas
 * http://wegas.albasim.ch
 *
 * Copyright (c) 2013, 2014, 2015 School of Business and Engineering Vaud, Comem
 * Licensed under the MIT License
 */
package com.wegas.core.ejb;

import com.wegas.core.persistence.game.DebugTeam;
import com.wegas.core.persistence.game.Game;
import com.wegas.core.persistence.game.Player;
import com.wegas.core.persistence.game.Team;
import com.wegas.core.persistence.variable.VariableInstance;
import com.wegas.core.persistence.variable.primitive.TextDescriptor;
import com.wegas.core.persistence.variable.primitive.TextInstance;
import com.wegas.core.persistence.variable.scope.GameModelScope;
import com.wegas.core.persistence.variable.scope.GameScope;
import com.wegas.core.persistence.variable.scope.PlayerScope;
import com.wegas.core.persistence.variable.scope.TeamScope;
import com.wegas.core.security.ejb.UserFacade;
import com.wegas.core.security.persistence.Permission;
import com.wegas.core.security.persistence.User;
import java.util.List;
import javax.naming.NamingException;
import org.junit.Assert;
import org.junit.BeforeClass;
import org.junit.Test;

/**
 *
 * @author Francois-Xavier Aeberhard (fx at red-agent.com)
 */
public class PlayerFacadeTest extends AbstractEJBTest {

    private static GameFacade gameFacade;
    private static TeamFacade teamFacade;
    private static UserFacade userFacade;
    private static PlayerFacade playerFacade;

    @BeforeClass
    public static void init() throws NamingException {
        gameFacade = lookupBy(GameFacade.class);
        teamFacade = lookupBy(TeamFacade.class);
        playerFacade = lookupBy(PlayerFacade.class);
        userFacade = lookupBy(UserFacade.class);
    }

    /**
     * Test registeredGames
     */
    @Test
    public void testRemovePlayer() throws Exception {
        User currentUser = userFacade.getCurrentUser();

        Assert.assertEquals(1, currentUser.getPlayers().size());

        final Game g = new Game("game");
        g.setGameModel(gameModel);
        gameFacade.create(g);
        Team t = new Team("team");
        t.setGame(g);
        teamFacade.create(t);
        final Player p1 = new Player("player");
        p1.setTeam(t);
        p1.setUser(currentUser);
        playerFacade.create(p1);
        final Player p2 = new Player("player1");
        p2.setTeam(t);
        playerFacade.create(p2);

        Game ng = gameFacade.find(g.getId());
        currentUser = userFacade.find(currentUser.getId());
        Assert.assertEquals(2, ng.getTeams().size());
        Assert.assertEquals(2, ng.getTeams().get(1).getPlayers().size());
        Assert.assertEquals(2, currentUser.getPlayers().size());

        playerFacade.remove(p1.getId());

        ng = gameFacade.find(g.getId());
        Assert.assertEquals(2, ng.getTeams().size());
        Assert.assertEquals(1, ng.getTeams().get(1).getPlayers().size());

        teamFacade.remove(t.getId());

        ng = gameFacade.find(g.getId());
        currentUser = userFacade.find(currentUser.getId());
        Assert.assertEquals(1, ng.getTeams().size());

        Assert.assertEquals(1, currentUser.getPlayers().size());

        gameFacade.remove(g.getId());                                           // Clean up
    }

    @Test
    public void getInstances() {
        TextDescriptor gmScoped = new TextDescriptor();
        gmScoped.setName("gmScoped");
        gmScoped.setScope(new GameModelScope());
        gmScoped.setDefaultInstance(new TextInstance());

        TextDescriptor gScoped = new TextDescriptor();
        gScoped.setName("gScoped");
        gScoped.setScope(new GameScope());
        gScoped.setDefaultInstance(new TextInstance());

        TextDescriptor tScoped = new TextDescriptor();
        tScoped.setName("tScoped");
        tScoped.setScope(new TeamScope());
        tScoped.setDefaultInstance(new TextInstance());

        TextDescriptor pScoped = new TextDescriptor();
        pScoped.setName("pScoped");
        pScoped.setScope(new PlayerScope());
        pScoped.setDefaultInstance(new TextInstance());

        descriptorFacade.create(gameModel.getId(), gmScoped);
        descriptorFacade.create(gameModel.getId(), gScoped);
        descriptorFacade.create(gameModel.getId(), tScoped);
        descriptorFacade.create(gameModel.getId(), pScoped);

        List<VariableInstance> instances = playerFacade.getInstances(player.getId());

        Assert.assertEquals(1, gameModelFacade.find(gameModel.getId()).getPrivateInstances().size());
        Assert.assertEquals(1, gameFacade.find(game.getId()).getPrivateInstances().size());
        Assert.assertEquals(1, teamFacade.find(team.getId()).getPrivateInstances().size());
        Assert.assertEquals(1, playerFacade.find(player.getId()).getPrivateInstances().size());

        Assert.assertEquals(4, instances.size());
    }

    private Team createTeam(Game g, String name) {
        Team t = new Team(name);
        t.setGame(g);
        teamFacade.create(g.getId(), t);
        return t;
    }

    private Player createPlayer(Team t) {
        User u = new User();
        userFacade.create(u);

        return gameFacade.joinTeam(t.getId(), u.getId());
    }

    /**
     * Test registeredGames
     */
    @Test
    public void testMassiveJoin() throws Exception {
        int nbTeam = 100;
        int nbPlayer = 10;
        Game g = new Game("game");
        g.setGameModel(gameModel);
        gameFacade.create(g);

        for (int i = 0; i < nbTeam; i++) {
            Team t = createTeam(g, "T" + i);
            for (int j = 0; j < nbPlayer; j++) {
                createPlayer(t);
            }
        }

        g = gameFacade.find(g.getId());

        Assert.assertEquals(nbTeam + 1, g.getTeams().size()); // + 1 to count debug team
        for (Team t : g.getTeams()) {
            t = teamFacade.find(t.getId());
            if (t instanceof DebugTeam == false) {
                Assert.assertEquals(nbPlayer, t.getPlayers().size());
                for (Player p : t.getPlayers()) {
                    Assert.assertEquals(1, p.getUser().getPermissions().size());
                    Permission perm = p.getUser().getPermissions().get(0);
                    Assert.assertEquals("Game:View:g" + g.getId(), perm.getValue());
                    Assert.assertEquals("GameModel:View:gm" + g.getGameModel().getId(), perm.getInducedPermission());
                }
            }
        }

    }

}
