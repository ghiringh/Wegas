/*
 * Wegas
 * http://wegas.albasim.ch
 *
 * Copyright (c) 2013, 2014, 2015, 2016, 2017 School of Business and Engineering Vaud, Comem
 * Licensed under the MIT License
 */
package com.wegas.core.persistence.variable.statemachine;

import com.wegas.core.persistence.variable.primitive.*;
import com.wegas.core.persistence.Orderable;
import java.io.Serializable;
import javax.persistence.Column;
import javax.persistence.Embeddable;

/**
 *
 * @author maxence
 */
@Embeddable
public class TransitionHistoryEntry implements Serializable, Orderable {

    private static final long serialVersionUID = -7711310789110595582L;

    @Column(name = "transitionid")
    private Long tansitionId;

    @Column(name = "transition_order")
    private Integer order;

    public TransitionHistoryEntry() {
    }

    public TransitionHistoryEntry(Long tansitionId, Integer order) {
        this.tansitionId = tansitionId;
        this.order = order;
    }

    @Override
    public Integer getOrder() {
        return order;
    }

    public void setOrder(Integer order) {
        this.order = order;
    }

    public Long getTansitionId() {
        return tansitionId;
    }

    public void setTansitionId(Long tansitionId) {
        this.tansitionId = tansitionId;
    }
}
