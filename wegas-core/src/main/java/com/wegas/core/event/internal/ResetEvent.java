/*
 * Wegas
 * http://wegas.albasim.ch
 *
 * Copyright (c) 2013, 2014, 2015 School of Business and Engineering Vaud, Comem
 * Licensed under the MIT License
 */
package com.wegas.core.event.internal;

import com.wegas.core.persistence.BroadcastTarget;
import com.wegas.core.persistence.game.Player;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

/**
 *
 * Reset event can be bound to a specific context:
 * <ul>
 * <li>GameModel: reset everything</li>
 * <li>Game: do not reset gameModel scoped variables and also skip game scoped
 * instance belonging to others game</li>
 * <li>Team: do not reset gameModel and game scoped variables and also skip team
 * scoped instance belonging to others teams</li>
 * <li>Player: Only reset player scoped variables belonging to the placer</li>
 * </ul>
 *
 * @author Maxence Laurent (maxence.laurent at gmail.com)
 * @author Cyril Junod (cyril.junod at gmail.com)
 */
public class ResetEvent implements Serializable {

    private static final long serialVersionUID = -837744356172473317L;

    private BroadcastTarget context;

    public ResetEvent() {
    }

    /**
     *
     * @param context
     */
    public ResetEvent(BroadcastTarget context) {
        this.context = context;
    }

    /**
     *
     * @return this reset event context
     */
    public BroadcastTarget getContext() {
        return context;
    }

    /**
     *
     * @return all players touched by this event context
     */
    public List<Player> getConcernedPlayers() {
        if (context != null) {
            return context.getPlayers();
        } else {
            return new ArrayList<>();
        }
    }
}
