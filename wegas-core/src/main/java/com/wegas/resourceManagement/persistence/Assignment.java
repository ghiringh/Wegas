/*
 * Wegas
 * http://wegas.albasim.ch
 *
 * Copyright (c) 2013, 2014, 2015 School of Business and Engineering Vaud, Comem
 * Licensed under the MIT License
 */
package com.wegas.resourceManagement.persistence;

import com.wegas.core.persistence.AbstractEntity;
import com.wegas.core.rest.util.Views;
import javax.persistence.*;
//import javax.xml.bind.annotation.XmlTransient;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonView;
import com.wegas.core.exception.client.WegasIncompatibleType;
import com.wegas.core.persistence.Broadcastable;
import java.util.List;
import java.util.Map;

/**
 *
 * @author Benjamin Gerber <ger.benjamin@gmail.com>
 */
@Table(indexes = {
    @Index(columnList = "variableinstance_id"),
    @Index(columnList = "taskdescriptor_id")
})
@NamedQueries({
    @NamedQuery(
        name = "Assignment.findByResourceInstanceAndTaskDescriptor",
        query = "SELECT a FROM Assignment a where a.resourceInstance = :resourceInstance AND a.taskDescriptor = :taskDescriptor"
    )
})
@Entity
public class Assignment extends AbstractAssignement implements Broadcastable {

    private static final long serialVersionUID = 1L;
    /**
     *
     */
    @Id
    @GeneratedValue
    @JsonView(Views.IndexI.class)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "taskdescriptor_id", nullable = false)
    private TaskDescriptor taskDescriptor;
    /**
     *
     */
    @ManyToOne(optional = false)
    @JoinColumn(name = "variableinstance_id", nullable = false)
    @JsonBackReference
    @JsonIgnore
    private ResourceInstance resourceInstance;

    /**
     *
     */
    public Assignment() {
    }

    /**
     *
     * @param taskDescriptor
     */
    public Assignment(TaskDescriptor taskDescriptor) {
        this.taskDescriptor = taskDescriptor;
    }

    /**
     *
     * @param a
     */
    @Override
    public void merge(AbstractEntity a) {
        if (a instanceof Assignment) {
            Assignment other = (Assignment) a;
            this.setResourceInstance(other.getResourceInstance());
            this.setTaskDescriptor(other.getTaskDescriptor());
        } else {
            throw new WegasIncompatibleType(this.getClass().getSimpleName() + ".merge (" + a.getClass().getSimpleName() + ") is not possible");
        }
    }

    /*
     @PostPersist
     @PostUpdate
     @PostRemove
     private void onUpdate() {
     this.getResourceInstance().onInstanceUpdate();
     }
     */
    /**
     *
     * @return parent resource entities or null if assignment has been removed
     * @todo do no use other entity through this method...
     */
    @Override
    public Map<String, List<AbstractEntity>> getEntities() {
        if (this.getResourceInstance() != null) {
            return this.getResourceInstance().getEntities();
        } else {
            return null;
        }
    }

    @Override
    public Long getId() {
        return this.id;
    }

    /**
     * @return the MCQDescriptor
     */
    //@XmlTransient
    @JsonIgnore
    @JsonBackReference
    public ResourceInstance getResourceInstance() {
        return resourceInstance;
    }

    /**
     * @param resourceInstance
     */
    @JsonBackReference
    public void setResourceInstance(ResourceInstance resourceInstance) {
        this.resourceInstance = resourceInstance;
    }

    /**
     *
     * @return
     */
    public Long getTaskDescriptorId() {
        return this.getTaskDescriptor().getId();
    }

    /**
     * @return the taskInstance
     */
    //@XmlTransient
    @JsonIgnore
    public TaskDescriptor getTaskDescriptor() {
        return taskDescriptor;
    }

    /**
     * @param taskDescriptor
     */
    @JsonProperty
    public void setTaskDescriptor(TaskDescriptor taskDescriptor) {
        this.taskDescriptor = taskDescriptor;
    }
}
