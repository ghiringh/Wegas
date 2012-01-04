/*
 * MetAlbasim is super koool. http://www.albasim.com
 * 
 * School of Business and Engineering Vaud, http://www.heig-vd.ch/
 * Media Engineering :: Information Technology Managment :: Comem⁺
 *
 * Copyright (C) 2010, 2011 
 *
 * MetAlbasim is distributed under the ??? license
 *
 */
package com.albasim.wegas.ejb;

import com.albasim.wegas.comet.Terminal;
import com.albasim.wegas.exception.InvalidContent;
import com.albasim.wegas.persistance.AnonymousAlbaEntity;


import java.util.ArrayList;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.ejb.EJB;
import javax.ejb.LocalBean;

import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.PersistenceException;

import javax.validation.ConstraintViolation;
import javax.validation.ConstraintViolationException;
import javax.xml.bind.annotation.XmlType;
import org.eclipse.persistence.exceptions.DatabaseException;

/**
 *
 * @author maxence
 */
@Stateless
@LocalBean
public class AlbaEntityManager {

    private static final Logger logger = Logger.getLogger("EJB_GM");

    @EJB
    Dispatcher dispatcher;


    @PersistenceContext(unitName = "metaPU")
    private EntityManager em;


    private void processConstraintViolationException(AnonymousAlbaEntity ae,
                                                     ConstraintViolationException ex,
                                                     Terminal terminal) {

        logger.log(Level.INFO, "ContrainViolationException on {0} [{1}]", new Object[]{ae.getClass().getSimpleName(), ae.getId()});

        ArrayList<String> errors = new ArrayList<String>();
        for (ConstraintViolation c : ex.getConstraintViolations()) {
            logger.log(Level.SEVERE, "Message:      {0}", c.getMessage());
            logger.log(Level.SEVERE, "Descriptor:   {0}", c.getConstraintDescriptor().toString());
            logger.log(Level.SEVERE, "PropertyPath: {0}", c.getPropertyPath());
            XmlType annotation = c.getLeafBean().getClass().getAnnotation(XmlType.class);
            String name = annotation.name();
            logger.log(Level.SEVERE, "Class (json): {0}", name);
            AnonymousAlbaEntity leafBean = (AnonymousAlbaEntity) c.getLeafBean();
            logger.log(Level.SEVERE, "ID:           {0}", leafBean.getId());
            StringBuilder builder = new StringBuilder();
            builder.append(name);
            builder.append("[");
            builder.append(((AnonymousAlbaEntity) c.getLeafBean()).getId());
            builder.append("]");
            builder.append(".");
            builder.append(c.getPropertyPath());
            builder.append(" ");
            builder.append(c.getMessage());
            errors.add(builder.toString());
        }
        ae.setErrors(errors);

        if (terminal != null) {
            logger.log(Level.INFO, "ROLLBACK after constraint validation error");
            dispatcher.rollback();
            logger.log(Level.INFO, "ROLLBACK done");
        }
        throw new InvalidContent(ex, ae);
    }


    private void processPersistenceException(AnonymousAlbaEntity ae,
                                             PersistenceException ex,
                                             Terminal terminal) {
        logger.log(Level.INFO, "Persistence Exception");
        
        ArrayList<String> errors = new ArrayList<String>();
        
        errors.add("Exception is " + ex.getClass().getSimpleName());

        errors.add(ex.getMessage());
        
        ae.setErrors(errors);
        
        Throwable cause = ex.getCause();
        if (cause instanceof DatabaseException){
            processDatabaseException(ae, (DatabaseException)cause, terminal);
        }

        
        if (terminal != null) {
            dispatcher.rollback();
        }
        throw new InvalidContent(ex, ae);
    }

    private void processDatabaseException(AnonymousAlbaEntity ae,
                                             DatabaseException ex,
                                             Terminal terminal) {
        logger.log(Level.INFO, "Database Exception");
        List<String> errors = ae.getErrors();
        if (errors == null){
            errors = new ArrayList<String>();
            ae.setErrors(errors);
        }
        
        errors.add("Exception is " + ex.getClass().getSimpleName());

        errors.add(ex.getMessage());
        
        logger.log(Level.INFO, "Accessor: " + ex.getAccessor());
        logger.log(Level.INFO, "ErrorCode: " + ex.getDatabaseErrorCode());
        logger.log(Level.INFO, "Message: " + ex.getMessage());
        logger.log(Level.INFO, "Record: " + ex.getQueryArgumentsRecord());
        logger.log(Level.INFO, "Query: " + ex.getQuery());
        
        throw new InvalidContent(ex, ae);
    }


    /**
     * Common method that persist the provided entity
     * 
     * @todo error management !
     * 
     * @param ae 
     */
    public void create(AnonymousAlbaEntity ae, Terminal terminal) {
        try {
            em.persist(ae);
            flush();
            if (terminal != null) {
                commit();
            }
        } catch (PersistenceException ex) {
            processPersistenceException(ae, ex, terminal);
        } catch (ConstraintViolationException ex) {
            processConstraintViolationException(ae, ex, terminal);
        } catch (RuntimeException ex) {
            logger.log(Level.INFO, "RuntimeException: " + ex);
            if (terminal != null) {
                dispatcher.rollback();
            }
            throw new InvalidContent(ex, ae);

        }
    }


    /**
     * Common method that propagateUpdate the provided entity
     * @param ae 
     */
    public <T extends AnonymousAlbaEntity> T update(T ae, Terminal terminal) {
        try {
            T merge = em.merge(ae);
            flush();

            em.refresh(merge);

            dispatcher.update(merge);

            if (terminal != null) {
                commit();
            }
            return merge;

        } catch (PersistenceException ex) {
            processPersistenceException(ae, ex, terminal);
        } catch (ConstraintViolationException ex) {
            processConstraintViolationException(ae, ex, terminal);
        }
        return null;
    }


    /**
     * Destroy an entity 
     * 
     * @param entity  the entity to propagateDestroy
     */
    public void destroy(Object entity, Terminal terminal) {
        em.remove(entity);
        flush();

        if (terminal != null) {
            commit();
        }
    }


    /**
     * Flushing changes make sure validation exceptions are thrown as soon as possible !
     */
    private void flush() {
        em.flush();
    }

    private void commit(){
        dispatcher.commit();
    }
}