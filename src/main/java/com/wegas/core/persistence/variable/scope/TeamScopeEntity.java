/*
 * Wegas.
 * http://www.albasim.com/wegas/
 *
 * School of Business and Engineering Vaud, http://www.heig-vd.ch/
 * Media Engineering :: Information Technology Managment :: Comem
 *
 * Copyright (C) 2011
 */
package com.wegas.core.persistence.variable.scope;

import com.wegas.core.persistence.AbstractEntity;
import com.wegas.core.persistence.game.GameEntity;
import com.wegas.core.persistence.game.GameModelEntity;
import com.wegas.core.persistence.game.PlayerEntity;
import com.wegas.core.persistence.game.TeamEntity;
import com.wegas.core.persistence.variable.VariableDescriptorEntity;
import com.wegas.core.persistence.variable.VariableInstanceEntity;
import java.util.HashMap;
import java.util.Map;
import java.util.logging.Logger;
import javax.persistence.*;
import javax.xml.bind.annotation.XmlTransient;
import javax.xml.bind.annotation.XmlType;

/**
 *
 * @author Francois-Xavier Aeberhard <fx@red-agent.com>
 */
@Entity
@XmlType(name = "TeamScope", propOrder = {"@class", "id", "name"})
public class TeamScopeEntity extends ScopeEntity {

    private static final Logger logger = Logger.getLogger(TeamScopeEntity.class.getName());
    /*
     * FIXME Here we should use TeamEntity reference and add a key deserializer
     * module
     */
    @OneToMany(cascade = {CascadeType.PERSIST, CascadeType.REMOVE})
    /*
     * @JoinTable(joinColumns = @JoinColumn(name = "teamscope_id",
     * referencedColumnName = "id"), inverseJoinColumns = @JoinColumn(name =
     * "variableinstance_id", referencedColumnName = "variableinstance_id"))
     */
    @JoinColumn(name = "teamscope_id", referencedColumnName = "id")
    @XmlTransient
    private Map<Long, VariableInstanceEntity> teamVariableInstances = new HashMap<>();

    /**
     *
     * @return
     */
    @Override
    public Map<Long, VariableInstanceEntity> getVariableInstances() {
        return this.teamVariableInstances;
    }

    /**
     *
     * @param player
     * @return
     */
    @Override
    public VariableInstanceEntity getVariableInstance(PlayerEntity player) {
        return this.teamVariableInstances.get(player.getTeam().getId());
    }

    /**
     *
     * @param userId
     * @param v
     */
    @Override
    public void setVariableInstance(Long userId, VariableInstanceEntity v) {
        this.teamVariableInstances.put(userId, v);
        v.setScope(this);
    }

    /**
     *
     */
    @PrePersist
    public void prePersist() {
        this.propagateDefaultVariableInstance(false);
    }

    /**
     *
     * @param force
     */
    @XmlTransient
    @Override
    public void propagateDefaultVariableInstance(boolean force) {
        VariableDescriptorEntity vd = this.getVariableDescriptor();
        GameModelEntity gm = vd.getGameModel();
        for (GameEntity g : gm.getGames()) {
            for (TeamEntity t : g.getTeams()) {
                VariableInstanceEntity vi = this.teamVariableInstances.get(t.getId());
                if (vi == null) {
                    this.setVariableInstance(t.getId(), vd.getDefaultVariableInstance().clone());
                } else if (force) {
                    vi.merge(vd.getDefaultVariableInstance());
                }
            }
        }
    }

    /**
     *
     * @param a
     */
    @Override
    public void merge(AbstractEntity a) {
    }
}
