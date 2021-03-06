/*
 * Wegas
 *
 * http://wegas.albasim.ch
 *
 * Copyright (c) 2013, 2014, 2015 School of Business and Engineering Vaud, Comem
 * Licensed under the MIT License
 */
package com.wegas.core.rest;

import com.wegas.core.ejb.AbstractFacade;
import com.wegas.core.persistence.AbstractEntity;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import java.io.IOException;
import java.util.Collection;

/**
 * @param <T>
 * @param <U>
 * @author Francois-Xavier Aeberhard (fx at red-agent.com)
 */
public interface AbstractRestControllerI<T extends AbstractFacade, U extends AbstractEntity> {

    /**
     * Index: get all entities this controller is designed for
     *
     * @return all entities this controller is designed for
     */
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    Collection<U> index();

    /**
     * Retrieve a specific entity
     *
     * @param entityId
     * @return entity matching given id
     */
    @GET
    @Path("{entityId : [1-9][0-9]*}")
    @Produces(MediaType.APPLICATION_JSON)
    U get(@PathParam("entityId") Long entityId);

    /**
     * Create a new entity
     *
     * @param entity
     * @return new entity
     */
    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    U create(U entity);

    /**
     * Update an entity
     *
     * @param entityId
     * @param entity
     * @return up to date entity
     */
    @PUT
    @Path("{entityId: [1-9][0-9]*}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    U update(@PathParam("entityId") Long entityId, U entity);

    /**
     * Duplicate an entity
     *
     * @param entityId
     * @return entity copy
     * @throws IOException
     */
    @POST
    @Path("{entityId: [1-9][0-9]*}/Duplicate")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    U duplicate(@PathParam("entityId") Long entityId) throws IOException;

    /**
     * Delete an entity
     *
     * @param entityId id of entity to delete
     * @return the just destroyed entity
     */
    @DELETE
    @Path("{entityId: [1-9][0-9]*}")
    @Produces(MediaType.APPLICATION_JSON)
    U delete(@PathParam("entityId") Long entityId);
}
