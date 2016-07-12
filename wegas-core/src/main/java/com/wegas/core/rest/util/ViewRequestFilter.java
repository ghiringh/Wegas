/*
 * Wegas
 * http://wegas.albasim.ch
 *
 * Copyright (c) 2013, 2014, 2015 School of Business and Engineering Vaud, Comem
 * Licensed under the MIT License
 */
package com.wegas.core.rest.util;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.ObjectWriter;
import com.fasterxml.jackson.jaxrs.cfg.EndpointConfigBase;
import com.fasterxml.jackson.jaxrs.cfg.ObjectWriterInjector;
import com.fasterxml.jackson.jaxrs.cfg.ObjectWriterModifier;
import com.wegas.core.ejb.RequestFacade;
import com.wegas.core.exception.client.WegasNotFoundException;
import com.wegas.core.persistence.game.Player;
import com.wegas.core.persistence.game.Team;
import com.wegas.core.security.ejb.UserFacade;
import com.wegas.core.security.persistence.User;
import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.Locale;
import javax.ejb.EJB;
import javax.ws.rs.container.ContainerRequestContext;
import javax.ws.rs.container.ContainerRequestFilter;
import javax.ws.rs.container.PreMatching;
import javax.ws.rs.core.MultivaluedMap;
import javax.ws.rs.ext.Provider;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 *
 * This filters takes the first path segment (first line of code) and uses it as
 * the current View in for jackson serialization.
 *
 * @see com.wegas.core.ejb.RequestManager . Available view are
 * "Public"(default), "Export", "Editor", "Extended", "EditorExtended"
 *
 * @author Francois-Xavier Aeberhard (fx at red-agent.com)
 */
@Provider
@PreMatching
public class ViewRequestFilter implements ContainerRequestFilter {

    @EJB
    RequestIdentifierGenerator idGenerator;

    @EJB
    UserFacade userFacade;

    private final static Logger logger = LoggerFactory.getLogger(ViewRequestFilter.class);

    /**
     * Handle view parameter
     *
     * @param cr
     */
    @Override
    public void filter(ContainerRequestContext cr) throws IOException {
        RequestFacade rmf = RequestFacade.lookup();

        String uniqueIdentifier = idGenerator.getUniqueIdentifier();
        Long timestamp = System.currentTimeMillis();

        rmf.getRequestManager().setRequestId(uniqueIdentifier);
        rmf.getRequestManager().setTimestamp(timestamp);

        //String userAgent = cr.getHeaderString("user-agent");
        User currentUser = null;
        try {
            currentUser = userFacade.getCurrentUser();
        } catch (WegasNotFoundException e) {
        }

        Class<?> view;

        // Handle language parameter
        if (cr.getHeaderString("lang") != null
                && !cr.getHeaderString("lang").isEmpty()) {
            rmf.setLocale(new Locale(cr.getHeaderString("lang")));
        } else if (cr.getHeaderString("Accept-Language") != null && !cr.getHeaderString("Accept-Language").isEmpty()) {
            rmf.setLocale(new Locale(cr.getHeaderString("Accept-Language")));
        } else {
            rmf.setLocale(Locale.getDefault());
        }

        String newUri = cr.getUriInfo().getRequestUri().toASCIIString();
        String firstPathSeg = cr.getUriInfo().getPathSegments().get(0).getPath();

        switch (firstPathSeg) {
            case "Public":
            case "Extended":
            case "Export":
            case "Editor":
            case "EditorExtended":
                //rmf.setView(this.stringToView(firstPathSeg));
                view = this.stringToView(firstPathSeg);
                newUri = newUri.replace(firstPathSeg + "/", "");
                break;

            default:
                //rmf.setView(Views.Public.class);
                view = Views.Public.class;
                break;
        }

        Player currentPlayer = rmf.getPlayer();
        Team currentTeam = null;
        if (currentPlayer != null) {
            currentTeam = currentPlayer.getTeam();
        }

        logger.info("Start Request Processing [" + uniqueIdentifier
                + "] for user::player::team("
                + (currentUser != null ? userFacade.getCurrentUser().getId() : "anonymous") + "::"
                + (currentPlayer != null ? currentPlayer.getId() : "n/a") + "::"
                + (currentTeam != null ? currentTeam.getId() : "n/a") + "::"
                + "): " /* + userAgent */ + " " + cr.getMethod() + ": "
                + cr.getUriInfo().getPath());

        try {
            cr.setRequestUri(new URI(newUri));
        } catch (URISyntaxException ex) {
            logger.error(null, ex);
        }

        if (cr.getUriInfo().getQueryParameters().get("view") != null) {
            // If the view is given through a query parameter
            //rmf.setView(this.stringToView(cr.getUriInfo().getQueryParameters().get("view").get(0)));
            view = this.stringToView(cr.getUriInfo().getQueryParameters().get("view").get(0));
        }

        // Propadate new view to ObjectWriter
        ObjectWriterInjector.set(new JsonViewModifier(view));
    }

    /**
     *
     * @param str
     * @return Views.Class matching str or public
     */
    public Class stringToView(String str) {
        switch (str) {
            case "Extended":
                return Views.Extended.class;

            case "Export":
                return Views.Export.class;

            case "Editor":
                return Views.Editor.class;

            case "EditorExtended":
                return Views.EditorExtended.class;

            case "Public":
            default:
                return Views.Public.class;
        }
    }

    private static class JsonViewModifier extends ObjectWriterModifier {

        Class<?> view;

        public JsonViewModifier(Class<?> view) {
            this.view = view;
        }

        @Override
        public ObjectWriter modify(EndpointConfigBase<?> ecb, MultivaluedMap<String, Object> mm, Object o, ObjectWriter writer, JsonGenerator jg) throws IOException {
            //Class view = RequestFacade.lookup().getView();
            return writer.withView(view);
        }
    }

}
