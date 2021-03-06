package com.wegas.core.security.aai;

/**
 * Wegas
 * http://wegas.albasim.ch
 *
 * Copyright (c) AlbaSim, School of Business and Engineering of Western Switzerland
 * Licensed under the MIT License
 * Created by jarle.hulaas@heig-vd.ch on 06.03.2017.
 */

public class AaiUserDetails {

    private String persistentId;
    private String homeOrg;
    private String firstname;
    private String lastname;
    private String email;
    private String secret;
    private boolean rememberMe;

    public AaiUserDetails(){ }

    public String getHomeOrg(){
        return homeOrg;
    }

    public void setHomeOrg(String homeOrg){
        this.homeOrg = homeOrg;
    }

    public String getPersistentId(){
        return persistentId;
    }

    public void setPersistentId(String persistentId){
        this.persistentId = persistentId;
    }

    public String getFirstname() {
        return firstname;
    }

    public void setFirstname(String firstname){
        this.firstname = firstname;
    }

    public String getLastname() {
        return lastname;
    }

    public void setLastname(String lastname) {
        this.lastname = lastname;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getSecret() {
        return secret;
    }

    public void setSecret(String secret) {
        this.secret = secret;
    }

    public boolean isRememberMe() {
        return rememberMe;
    }

    public void setRememberMe(boolean rememberMe) {
        this.rememberMe = rememberMe;
    }
}
