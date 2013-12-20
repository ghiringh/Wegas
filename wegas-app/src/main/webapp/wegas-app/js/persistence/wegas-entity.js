/*
 * Wegas
 * http://wegas.albasim.ch
 *
 * Copyright (c) 2013 School of Business and Engineering Vaud, Comem
 * Licensed under the MIT License
 */
/**
 * @fileoverview
 * @author Francois-Xavier Aeberhard <fx@red-agent.com>
 */
YUI.add('wegas-entity', function(Y) {
    "use strict";

    var STRING = "string", HIDDEN = "hidden", ARRAY = "array", NAME = "name",
            SELF = "self", BOOLEAN = "boolean", NUMBER = "number",
            BUTTON = "Button", VALUE = "value", TEXT = "text", HTML = "html",
            GROUP = "group",
            IDATTRDEF = {
        type: STRING,
        optional: true, // The id is optional for entites that have not been persisted
        _inputex: {
            _type: HIDDEN
        }
    }, Wegas = Y.namespace("Wegas"), Entity;

    /**
     * @class Entity is used to represent db objects
     * @name Y.Wegas.persistence.Entity
     * @extends Y.Base
     * @augments Y.Wegas.Editable
     * @constructor
     */
    Entity = Y.Base.create("Entity", Y.Base, [Wegas.Editable], {}, {
        _buildCfg: {
            //statics: ["EDITMENU"],
            custom: {
                //HASH: function (prop, Receiver, Supplier) {
                //Entity.ENTITIES_HASH[Receiver.name] = true;
                //var c = Supplier.constructor;
                //while (!Receiver.EDITMENU && c) {
                //    if (c.EDITMENU) {                                         // Add to attributes
                //        Receiver.EDITMENU = c.EDITMENU
                //    }
                //    c = c.superclass ? c.superclass.constructor : null;
                //}
                //}
            }
        },
        ATTRS: {
            initialized: {
                "transient": true
            },
            destroyed: {
                "transient": true
            },
            id: {
                type: STRING,
                optional: true, // The id is optional for entites that have not been persisted
                writeOnce: "initOnly",
                setter: function(val) {
                    return val * 1;
                },
                _inputex: {
                    wrapperClassName: 'wegas-advanced-feature',
                    index: -2,
                    disable: true
                }
            },
            '@class': {
                value: "null",
                writeOnce: "initOnly",
                type: STRING,
                _inputex: {
                    _type: HIDDEN
                }
            },
            label: {
                "transient": true,
                getter: function(val) {
                    return val || this.get(NAME);
                }
            }
        },
        /**
         *  Defines edition menu to be used in editor
         */
        EDITMENU: [],
        /**
         * Defines methods available in wysiwyge script editor
         */
        METHODS: {}
    });
    Y.namespace('Wegas.persistence').Entity = Entity;

    /**
     *
     */
    Wegas.persistence.DefaultEntity = Y.Base.create("DefaultEntity", Entity, [], {
        initializer: function(cfg) {
            this.set("val", cfg);
        },
        toJSON: function() {
            return this.get("val");
        }
    }, {
        ATTRS: {
            val: {}
        }
    });
    Wegas.persistence.RestException = Wegas.persistence.DefaultEntity;

    /**
     * Page response mapper
     */
    Wegas.persistence.WidgetEntity = Y.Base.create("WidgetEntity", Entity, [], {
        initializer: function(cfg) {
            Wegas.persistence.WidgetEntity.superclass.initializer.apply(this, arguments);
            this.__cfg = cfg;
        },
        toJSON: function() {
            return this.__cfg;
        }
    });

    /**
     * ServerResponse mapper
     */
    Wegas.persistence["ManagedModeResponseFilter$ServerResponse"] = Y.Base.create("ManagedModeResponseFilter$ServerResponse", Entity, [], {}, {
        ATTRS: {
            entities: {
                value: []
            },
            events: {
                value: []
            }
        }
    });
    Wegas.persistence.EntityUpdatedEvent = Y.Base.create("EntityUpdatedEvent", Wegas.persistence.Entity, [], {}, {
        ATTRS: {
            updatedEntities: {
                value: []
            }
        }
    });

    /**
     * GameModel mapper
     */
    Wegas.persistence.GameModel = Y.Base.create("GameModel", Wegas.persistence.Entity, [], {}, {
        EDITORNAME: "Game model",
        ATTRS: {
            name: {
                type: STRING
            },
            games: {
                type: ARRAY,
                value: [],
                "transient": true
            },
            scriptLibrary: {
                value: {},
                "transient": true
            },
            clientScriptLibrary: {
                value: {},
                "transient": true
            },
            cssLibrary: {
                value: {},
                "transient": true
            },
            properties: {
                value: {},
                getter: function(value, name) {
                    var key = name.split(".")[1];
                    if (Y.Lang.isString(value[key]) &&
                            (key === "freeForAll"
                                    || key === "allowCreateTeam"
                                    || key === "allowJoinTeam")) {
                        value[key] = (value[key] === "true") ? true : false;
                    }
                    return value;
                },
                _inputex: {
                    _type: "object",
                    useButtons: true,
                    required: false,
                    wrapperClassName: 'inputEx-fieldWrapper wegas-advanced-feature'
                }
            },
            description: {
                type: STRING,
                format: HTML,
                optional: true,
                _inputex: {
                    wrapperClassName: 'inputEx-fieldWrapper wegas-advanced-feature'
                }
            },
            canView: {
                "transient": true
            },
            canEdit: {
                "transient": true
            },
            canDuplicate: {
                "transient": true
            },
            canInstantiate: {
                "transient": true
            },
            createdTime: {
                "transient": true
            },
            createdByName: {
                "transient": true
            }
        },
        EDITMENU: [{
                type: BUTTON,
                label: "Edit",
                cssClass: "editor-exploreGameModel-button",
                plugins: [{
                        fn: "EditEntityAction"
                    }, {
                        fn: "OpenTabActionSec",
                        cfg: {
                            label: "Share",
                            tabSelector: '#rightTabView',
                            wchildren: [{
                                    type: "ShareUser",
                                    permsList: [{
                                            rightLabel: "Edit",
                                            value: "GameModel:View,Edit,Delete,Duplicate,Instantiate"
                                        }, {
                                            rightLabel: "Duplicate",
                                            value: "GameModel:Duplicate"
                                        }, {
                                            rightLabel: "Host",
                                            value: "GameModel:Instantiate"
                                        }]
                                }]
                        }
                    }]
            }, {
                type: BUTTON,
                label: "Open in editor",
                plugins: [{
                        fn: "OpenGameAction"
                    }]
            }, {
                type: "DeleteEntityButton",
                label: "Delete",
                cssClass: "editor-deleteGameModel-button"
            }, {
                type: BUTTON,
                label: "More",
                plugins: [{
                        fn: "WidgetMenu",
                        cfg: {
                            menuCfg: {
                                //points: ["tr", "br"]
                            },
                            children: [{
                                    type: BUTTON,
                                    label: "Make a copy",
                                    cssClass: "editor-duplicateGameModel-button",
                                    plugins: [{
                                            fn: "DuplicateEntityAction"
                                        }]
                                }, {
                                    type: BUTTON,
                                    label: "Permissions",
                                    cssClass: "wegas-advanced-feature",
                                    plugins: [{
                                            fn: "OpenTabAction",
                                            cfg: {
                                                emptyTab: true,
                                                wchildren: [{
                                                        type: "RolePermissionList",
                                                        permsList: [{
                                                                name: "GameModel:View"
                                                            }, {
                                                                name: "GameModel:Edit",
                                                                value: "GameModel:View,Edit,Delete"
                                                            }, {
                                                                name: "GameModel:Duplicate",
                                                                value: "GameModel:Duplicate"
                                                            }, {
                                                                name: "GameModel:Instantiate",
                                                                value: "GameModel:Instantiate"
                                                            }]
                                                    }],
                                                tabSelector: '#rightTabView'
                                            }
                                        }]
                                }]
                        }
                    }]
            }]
    });

    /**
     * Game mapper
     */
    Wegas.persistence.Game = Y.Base.create("Game", Wegas.persistence.Entity, [], {}, {
        ATTRS: {
            gameModelId: {
                type: STRING,
                _inputex: {
                    _type: "hidden"
                }
            },
            gameModel: {//                                                      // Extended-view only
                "transient": true
            },
            name: {
                type: STRING
            },
            description: {
                type: STRING,
                format: HTML,
                optional: true,
                _inputex: {
                    wrapperClassName: 'inputEx-fieldWrapper wegas-advanced-feature'
                }
            },
            createdBy: {
                "transient": true
            },
            teams: {
                "transient": true,
                value: []
            },
            createdTime: {
                "transient": true
            },
            updatedTime: {
                "transient": true
            },
            visibility: {
                "transient": true,
                type: STRING,
                choices: [
                    //{value: 'Private', label: 'Only people in the list s join'},
                    {value: 'Public', label: 'Game is visible in the lobby.'},
                    {value: 'Link', label: 'Player need the link to join. '}],
                _inputex: {
                    wrapperClassName: 'inputEx-fieldWrapper wegas-advanced-feature'
                }
            },
            access: {
                type: STRING,
                value: "ENROLMENTKEY",
                choices: [{
                        value: "URL",
                        label: "Public game"
                    }, {
                        value: "OPEN",
                        label: "Anyone with the link can join"
                    }, {
                        value: "ENROLMENTKEY",
                        label: "Players need an enrolment key to join"
                    }, {
                        value: "SINGLEUSAGEENROLMENTKEY",
                        label: "Each player/team needs an unique enrolment key to join"
                    }, {
                        value: "CLOSE",
                        label: "Game does not accept new players"
                    }],
                _inputex: {
                    value: "ENROLMENTKEY",
                    interactions: [{
                            valueTrigger: "OPEN", // this action will run when this field value is set to OPEN
                            actions: [
                                {name: 'key', action: 'hide'},
                                {name: 'keys', action: 'hide'}]
                        }, {
                            valueTrigger: "URL", // this action will run when this field value is set to OPEN
                            actions: [
                                {name: 'key', action: 'hide'},
                                {name: 'keys', action: 'hide'}]
                        }, {
                            valueTrigger: "ENROLMENTKEY",
                            actions: [
                                {name: 'key', action: 'show'},
                                {name: 'keys', action: 'hide'}]
                        }, {
                            valueTrigger: "SINGLEUSAGEENROLMENTKEY",
                            actions: [
                                {name: 'key', action: 'hide'},
                                {name: 'keys', action: 'show'}]
                        }, {
                            valueTrigger: "CLOSE",
                            actions: [
                                {name: 'key', action: 'hide'},
                                {name: 'keys', action: 'hide'}]
                        }]
                }
            },
            key: {
                type: STRING,
                optional: true,
                _inputex: {
                    label: "Enrolment key",
                    description: "Player can join this game by using the enrolment key in the lobby or using <br />the link below.<br />"
                            + "The key can be used to join multiple times."
                }
            },
            keys: {
                type: ARRAY,
                value: [],
                _inputex: {
                    label: "Enrolment keys",
                    _type: "enrolementkeylist",
                    description: "Player can join this game using an enrolment key as user name/password<br /> on the log in screen or by entering it in the lobby.<br />"
                            + "Each key can be used by only one team/player."
                }
            },
            token: {
                type: STRING,
                optional: true,
                _inputex: {
                    description: "Leave blank for automatic generation",
                    wrapperClassName: 'inputEx-fieldWrapper wegas-advanced-feature'
                }
            },
            playersCount: {
                "transient": true,
                getter: function() {
                    var count = 0;
                    Y.Array.each(this.get("teams"), function(t) {
                        count += t.get("players").length;
                    });
                    return count;
                }
            }
        },
        EDITMENU: [{
                type: BUTTON,
                label: "Edit",
                plugins: [
                    //{
                    //    fn: "EditEntityAction"
                    //},
                    {
                        fn: "OpenTabAction",
                        cfg: {
                            label: "Game",
                            emptyTab: true,
                            tabSelector: '#rightTabView',
                            wchildren: [{
                                    type: "List",
                                    children: [{
                                            type: "EditEntityForm"
                                        }, {
                                            type: "ShareRole",
                                            permsList: [{
                                                    name: "Public",
                                                    value: "Game:View"
                                                }, {
                                                    name: "Link",
                                                    value: "Game:Token"
                                                }
                                                //, {
                                                //    name: "TeamToken",
                                                //    value: "Game:TeamToken"
                                                //}
                                            ]
                                        }
                                    ]
                                }]
                        }
                    },
                    {
                        fn: "OpenTabActionThi",
                        cfg: {
                            label: "Teams",
                            tabSelector: '#rightTabView',
                            wchildren: [{
                                    type: "TeamTreeView"
                                }]
                        }
                    },
                    {
                        fn: "OpenTabActionSec",
                        cfg: {
                            label: "Share",
                            tabSelector: '#rightTabView',
                            wchildren: [{
                                    type: "ShareUser",
                                    "plugins": [{
                                            "fn": "WidgetToolbar",
                                            "cfg": {
                                                "children": [{type: "Text"}]
                                            }
                                        }],
                                    permsList: [{
                                            rightLabel: "Play",
                                            value: "Game:View"
                                        }, {
                                            rightLabel: "Admin",
                                            value: "Game:View,Edit"
                                        }
                                        //, {
                                        //    label: "Token",
                                        //    value: "Game:Token"
                                        //}
                                    ]
                                }]
                        }
                    }]
            }, {
                type: BUTTON,
                label: "Open",
                plugins: [{
                        fn: "OpenGameAction",
                        cfg: {
                            editorUrl: "wegas-app/view/host.html?"
                        }
                    }]
            }, {
                type: "DeleteEntityButton",
                label: "Delete"
            }, {
                type: BUTTON,
                label: "More",
                cssClass: "wegas-advanced-feature",
                plugins: [{
                        fn: "WidgetMenu",
                        cfg: {
                            menuCfg: {
                                //points: ["tr", "br"]
                            },
                            children: [{
                                    type: BUTTON,
                                    label: "Create a model based on this game",
                                    disabled: true
                                }, {
                                    type: "JoinOrResumeButton",
                                    label: "Join",
                                    cssClass: "wegas-advanced-feature"
                                }, {
                                    type: BUTTON,
                                    label: "Permissions",
                                    cssClass: "editor-shareGame-button wegas-advanced-feature",
                                    plugins: [{
                                            fn: "OpenTabAction",
                                            cfg: {
                                                emptyTab: true,
                                                wchildren: [{
                                                        type: "RolePermissionList",
                                                        permsList: [{
                                                                name: "Game:View"
                                                            }, {
                                                                name: "Game:Edit",
                                                                value: "Game:Edit,View"
                                                            }]
                                                    }],
                                                tabSelector: '#rightTabView'
                                            }
                                        }]
                                }, {
                                    type: "AddEntityChildButton",
                                    label: "Add team",
                                    targetClass: "Team",
                                    cssClass: "wegas-advanced-feature"
                                }, {
                                    type: "Linkwidget"
                                }]
                        }
                    }]
            }
        ]
    });

    Wegas.persistence.DebugGame = Wegas.persistence.Game;

    /**
     * Team mapper
     */
    Wegas.persistence.Team = Y.Base.create("Team", Wegas.persistence.Entity, [], {}, {
        ATTRS: {
            '@class': {
                value: "Team"
            },
            name: {
                type: STRING
            },
            players: {
                value: [],
                _inputex: {
                    _type: HIDDEN
                }
            },
            gameId: IDATTRDEF
        },
        EDITMENU: [{
                type: BUTTON,
                label: "Open",
                plugins: [{
                        fn: "OpenGameAction",
                        cfg: {
                            editorUrl: "wegas-app/view/host.html?"
                        }
                    }]
            }, {
                type: "DeleteEntityButton"
            }, {
                type: "JoinOrResumeButton",
                cssClass: "wegas-advanced-feature",
                label: "Join"
            }, {
                type: "EditEntityButton",
                label: "Edit",
                cssClass: "wegas-advanced-feature"
            }, {// We allow the player to open its pages with the widget
                type: BUTTON,
                label: "View as",
                cssClass: "wegas-advanced-feature",
                plugins: [{
                        fn: "OpenGameAction",
                        cfg: {
                            editorUrl: "wegas-app/view/play.html?"
                        }
                    }]
            }, {
                type: BUTTON,
                label: "Add player",
                cssClass: "wegas-advanced-feature",
                plugins: [{
                        fn: "AddEntityChildAction",
                        cfg: {
                            targetClass: "Player"
                        }
                    }]
            }
            //, {
            //    type: "Linkwidget"
            //}
        ]
    });

    /**
     * Player mapper
     */
    Wegas.persistence.Player = Y.Base.create("Player", Wegas.persistence.Entity, [], {}, {
        ATTRS: {
            name: {
                type: STRING
            },
            teamId: IDATTRDEF,
            userId: {
                "transient": true
            }
        },
        EDITMENU: [{
                type: BUTTON,
                label: "Open",
                plugins: [{
                        fn: "OpenGameAction",
                        cfg: {
                            editorUrl: "wegas-app/view/host.html?"
                        }
                    }]
            }, {
                type: "DeleteEntityButton",
                cssClass: "editor-deletePlayer-button"
            }, {
                type: "EditEntityButton",
                label: "Edit",
                cssClass: "editor-playerProperties-button"
            }]
    });

    /**
     * User mapper
     */
    Wegas.persistence.User = Y.Base.create("User", Wegas.persistence.Entity, [], {
        getMainAccount: function() {
            return this.get("accounts")[0];
        }
    }, {
        ATTRS: {
            name: {
                type: STRING,
                "transient": true,
                getter: function(val) {
                    if (this.getMainAccount()) {
                        return this.getMainAccount().getPublicName();
                    }
                    return val;
                }
            },
            password: {
                type: STRING
            },
            accounts: {
                type: ARRAY
            }
        }
    });
    /**
     * Role mapper
     */
    Wegas.persistence.Role = Y.Base.create("Role", Wegas.persistence.Entity, [], {}, {
        ATTRS: {
            name: {
                type: STRING
            },
            description: {
                "transient": true,
                type: STRING,
                format: TEXT,
                optional: true
            },
            permissions: {
                optional: true,
                type: ARRAY,
                items: {
                    _inputex: {
                        _type: GROUP,
                        fields: [{
                                name: "id",
                                type: HIDDEN,
                                value: null
                            }, {
                                name: "@class",
                                type: HIDDEN,
                                value: "Permission"
                            }, {
                                name: "value"
                            }, {
                                name: "inducedPermission",
                                value: null
                            }]
                    }
                },
                _inputex: {
                    useButtons: true,
                    wrapperClassName: 'inputEx-fieldWrapper wegas-advanced-feature'
                }
            }
        },
        EDITMENU: [{
                type: "EditEntityButton",
                label: "Edit group"
            }, {
                type: "DeleteEntityButton"
            }]
    });
    /**
     * JpaAccount mapper
     */
    Wegas.persistence.JpaAccount = Y.Base.create("JpaAccount", Wegas.persistence.Entity, [], {
        getPublicName: function() {
            if (this.get("firstname") || this.get("lastname")) {
                return this.get("firstname") + " " + (this.get("lastname") || "");

            } else {
                return this.get("email");
            }
        }

    }, {
        ATTRS: {
            "@class": {
                type: STRING,
                value: "JpaAccount",
                _inputex: {
                    _type: HIDDEN
                }
            },
            firstname: {
                type: STRING,
                _inputex: {
                    label: "First name"
                }
            },
            lastname: {
                label: "Last name",
                type: STRING,
                _inputex: {
                    label: "Last name"
                }
            },
            email: {
                type: STRING,
                _inputex: {
                    label: "Email",
                    _type: "email"
                }
            },
            hash: {
                "transient": true
            },
            password: {
                type: STRING,
                optional: true,
                _inputex: {
                    _type: "password",
                    label: "Password",
                    strengthIndicator: true,
                    capsLockWarning: true,
                    id: "password",
                    typeInvite: null,
                    description: "Leave blank for no change"
                }
            },
            passwordConfirm: {
                type: STRING,
                //"transient": true,
                optional: true,
                _inputex: {
                    _type: "password",
                    label: "Confirm password",
                    showMsg: true,
                    confirm: "password",
                    typeInvite: null
                }
            },
            roles: {
                optional: true,
                type: ARRAY,
                items: {
                    type: STRING,
                    choices: [],
                    _inputex: {
                        label: "",
                        _type: "roleselect"
                    }
                },
                _inputex: {
                    label: "Groups",
                    useButtons: true
                }
            },
            permissions: {
                optional: true,
                type: ARRAY,
                items: {
                    _inputex: {
                        _type: GROUP,
                        fields: [{
                                name: "id",
                                type: HIDDEN,
                                value: null
                            }, {
                                name: "@class",
                                type: HIDDEN,
                                value: "Permission"
                            }, {
                                name: "value"
                            }, {
                                name: "inducedPermission",
                                value: ""
                            }]
                    }
                },
                _inputex: {
                    useButtons: true,
                    wrapperClassName: 'inputEx-fieldWrapper wegas-advanced-feature'
                }
            }
        },
        EDITMENU: [{
                type: "EditEntityButton",
                label: "Edit user"
            }, {
                type: BUTTON,
                disabled: true,
                label: "Permissions"
            }, {
                type: "DeleteEntityButton"
            }]
    });

    /**
     * JpaAccount mapper
     */
    Wegas.persistence.GuestJpaAccount = Y.Base.create("JpaAccount", Wegas.persistence.Entity, [], {
        getPublicName: function() {
            return "Guest";
        }
    }, {
        ATTRS: {
            "@class": {
                type: STRING,
                value: "GuestJpaAccount",
                _inputex: {
                    _type: HIDDEN
                }
            },
            permissions: {
                "transient": true,
                value: []
            }
        },
        EDITMENU: [{
                type: "DeleteEntityButton"
            }]
    });

    /**
     * VariableDescriptor mapper
     */
    Wegas.persistence.VariableDescriptor = Y.Base.create("VariableDescriptor", Wegas.persistence.Entity, [], {
        getInstance: function(playerId) {
            playerId = playerId || Wegas.app.get('currentPlayer');
            return this.get("scope").getInstance(playerId);
        },
        getLabel: function() {
            return this.get("label");
        }
    }, {
        ATTRS: {
            label: {
                type: STRING,
                "transient": false,
                getter: function(val) {
                    return val || this.get(NAME);
                },
                _inputex: {
                    label: "Name",
                    index: -1
                }
            },
            name: {
                value: null,
                type: STRING,
                optional: true,
                _inputex: {
                    wrapperClassName: 'wegas-advanced-feature',
                    label: "Script alias",
                    index: -1,
                    //regexp: /^[a-zA-Z_$][0-9a-zA-Z_$]*$/,
                    description: "Alphanumeric characters,'_','$'. Without a digit as first character.<br/>Changing this may break your scripts."
                },
                validator: function(s) {
                    return s === null || Y.Lang.isString(s);
                }
            },
            scope: {
                valueFn: function() {
                    return new Wegas.persistence.TeamScope();                 // Should the default scope be set server or client side?
                },
                validator: function(o) {
                    return o instanceof Wegas.persistence.Scope;
                },
                properties: {
                    "@class": {
                        type: STRING,
                        choices: [{
                                value: "TeamScope",
                                label: 'different for each team'
                            }, {
                                value: "PlayerScope",
                                label: 'different for each user'
                            }, {
                                value: "GameScope",
                                label: 'different for each game'
                            }, {
                                value: "GameModelScope",
                                label: 'the same for everybody'
                            }],
                        _inputex: {
                            wrapperClassName: 'inputEx-fieldWrapper wegas-advanced-feature',
                            label: 'Variable is'
                        }
                    },
                    broadcastScope: {
                        type: STRING,
                        choices: [{
                                value: "TeamScope",
                                label: 'anyone in the player\'s team'
                            }, {
                                value: "PlayerScope",
                                label: 'the current player only'
                            }, {
                                value: "GameScope",
                                label: 'anybody in the game'
                            }],
                        _inputex: {
                            wrapperClassName: 'inputEx-fieldWrapper wegas-advanced-feature',
                            label: 'Variable is visible by'
                        }
                    }
                }
            },
            defaultInstance: {
                value: null,
                validator: function(o) {
                    return o instanceof Wegas.persistence.VariableInstance;
                }
            }
        },
        EDITMENU: [{
                type: "EditEntityButton"
            }, {
                type: BUTTON,
                label: "Copy",
                plugins: [{
                        fn: "DuplicateEntityAction"
                    }]
            }, {
                type: "DeleteEntityButton"
            }]
    });


    /**
     * Scope mapper
     */
    Wegas.persistence.Scope = Y.Base.create("Scope", Wegas.persistence.Entity, [], {
        getInstance: function() {
            Y.error("SHOULD BE OVERRIDDEN, abstract!", new Error("getInstance, abstract"), "Wegas.persistance.Scope");
        }
    }, {
        ATTRS: {
            variableInstances: {
                "transient": true,
                getter: function(val) {
                    if (!val) {
                        return this.get("privateInstances");
                    }
                    return val;
                }
            },
            privateInstances: {
                value: {},
                "transient": true
            },
            broadcastScope: {}
        }
    });
    /**
     * GameModelScope mapper
     */
    Wegas.persistence.GameModelScope = Y.Base.create("GameModelScope", Wegas.persistence.Scope, [], {
        getInstance: function() {
            return this.get("variableInstances")[0];
        }
    }, {
        ATTRS: {
            "@class": {
                value: "GameModelScope"
            }
        }
    });
    /**
     * GameScope mapper
     */
    Wegas.persistence.GameScope = Y.Base.create("GameScope", Wegas.persistence.Scope, [], {
        getInstance: function() {
            return this.get("variableInstances")["" + Wegas.app.get('currentGame')];
        }
    }, {
        ATTRS: {
            "@class": {
                value: "GameScope"
            }
        }
    });

    /**
     * TeamScope mapper
     */
    Wegas.persistence.TeamScope = Y.Base.create("TeamScope", Wegas.persistence.Scope, [], {
        getInstance: function(playerId) {
            return this.get("variableInstances")[Wegas.app.get('currentTeam')];
        }
    }, {
        ATTRS: {
            "@class": {
                value: "TeamScope"
            }
        }
    });

    /**
     * PlayerScope mapper
     */
    Wegas.persistence.PlayerScope = Y.Base.create("PlayerScope", Wegas.persistence.Scope, [], {
        getInstance: function(playerId) {
            return this.get("variableInstances")[playerId];
        }
    }, {
        ATTRS: {
            "@class": {
                value: "PlayerScope"
            }
        }
    });

    /**
     * VariableInstance mapper
     */
    Wegas.persistence.VariableInstance = Y.Base.create("VariableInstance", Wegas.persistence.Entity, [], {}, {
        ATTRS: {
            descriptorId: {
                type: STRING,
                _inputex: {
                    _type: HIDDEN
                }
            }
        },
        EDITMENU: [{
                type: "EditEntityButton"
            }]
    });
    /**
     * Meant to augment primitive Descriptors (Number, Text, String) with some functions
     */
    Wegas.persistence.PrimitiveDescriptor = Y.Base.create("Primitive", Y.Base, [], {
        getValue: function(playerId) {
            playerId = playerId instanceof Y.Wegas.persistence.Player ? playerId.get("id") : playerId;
            return this.getInstance(playerId).get("value");
        }
    }, {
    });
    /**
     * StringDescriptor mapper
     */
    Wegas.persistence.StringDescriptor = Y.Base.create("StringDescriptor", Wegas.persistence.VariableDescriptor, [Wegas.persistence.PrimitiveDescriptor], {}, {
        ATTRS: {
            "@class": {
                value: "StringDescriptor"
            },
            defaultInstance: {
                properties: {
                    "@class": {
                        type: STRING,
                        _inputex: {
                            value: 'StringInstance',
                            _type: HIDDEN
                        }
                    },
                    id: IDATTRDEF,
                    value: {
                        type: STRING,
                        _inputex: {
                            label: 'Default value'
                        }
                    }

                }
            }
        }
    });
    /**
     * StringInstance mapper
     */
    Wegas.persistence.StringInstance = Y.Base.create("StringInstance", Wegas.persistence.VariableInstance, [Wegas.persistence.PrimitiveDescriptor], {}, {
        ATTRS: {
            "@class": {
                value: "StringInstance"
            },
            value: {
                type: STRING
            }
        }
    });
    /**
     * StringDescriptor mapper
     */
    Wegas.persistence.TextDescriptor = Y.Base.create("TextDescriptor", Wegas.persistence.VariableDescriptor, [Wegas.persistence.PrimitiveDescriptor], {}, {
        ATTRS: {
            "@class": {
                value: "TextDescriptor"
            },
            defaultInstance: {
                properties: {
                    "@class": {
                        type: STRING,
                        _inputex: {
                            value: 'TextInstance',
                            _type: HIDDEN
                        }
                    },
                    id: IDATTRDEF,
                    value: {
                        type: HTML,
                        optional: true,
                        _inputex: {
                            label: 'Default value'
                        }
                    }

                }
            }
        },
        METHODS: {
            setValue: {
                label: "set",
                arguments: [{
                        type: HIDDEN,
                        value: SELF
                    }, {
                        type: HTML,
                        value: "",
                        scriptType: STRING
                    }]
            },
            getValue: {
                label: VALUE,
                returns: STRING,
                arguments: [{
                        type: HIDDEN,
                        value: SELF
                    }]
            }
        }
    });
    /**
     * TextInstance mapper
     */
    Wegas.persistence.TextInstance = Y.Base.create("TextInstance", Wegas.persistence.VariableInstance, [], {}, {
        ATTRS: {
            "@class": {
                value: "TextInstance"
            },
            value: {
                type: STRING,
                format: HTML,
                optional: true
            }
        }
    });
    /**
     * NumberDescriptor mapper
     */
    Wegas.persistence.NumberDescriptor = Y.Base.create("NumberDescriptor", Wegas.persistence.VariableDescriptor, [Wegas.persistence.PrimitiveDescriptor], {}, {
        ATTRS: {
            "@class": {
                value: "NumberDescriptor"
            },
            minValue: {
                type: STRING,
                optional: true,
                _inputex: {
                    label: 'Minimum'
                }
            },
            maxValue: {
                type: STRING,
                optional: true,
                _inputex: {
                    label: 'Maximum'
                }
            },
            defaultValue: {
                type: STRING,
                "transient": true
            },
            defaultInstance: {
                properties: {
                    "@class": {
                        type: STRING,
                        _inputex: {
                            value: 'NumberInstance',
                            _type: HIDDEN
                        }
                    },
                    id: IDATTRDEF,
                    value: {
                        type: STRING,
                        _inputex: {
                            label: 'Default value',
                            regexp: /^[0-9]*$/
                        }
                    }

                }
            }
        },
        /**
         * Defines methods available in wysiwyge script editor
         */
        METHODS: {
            add: {
                arguments: [{
                        type: HIDDEN,
                        value: SELF
                    }, {
                        type: STRING,
                        value: 1
                    }]
            },
            sub: {
                label: "substracte",
                arguments: [{
                        type: HIDDEN,
                        value: SELF
                    }, {
                        type: STRING,
                        value: 1
                    }]
            },
            setValue: {
                label: "set",
                arguments: [{
                        type: HIDDEN,
                        value: SELF
                    }, {
                        type: STRING,
                        value: 1
                    }]
            },
            getValue: {
                label: VALUE,
                returns: NUMBER,
                arguments: [{
                        type: HIDDEN,
                        value: SELF
                    }]
            }
        }
    });
    /**
     * NumberInstance mapper
     */
    Wegas.persistence.NumberInstance = Y.Base.create("NumberInstance", Wegas.persistence.VariableInstance, [], {}, {
        ATTRS: {
            "@class": {
                value: "NumberInstance"
            },
            value: {
                type: STRING,
                _inputex: {
                    regexp: /^[0-9]*$/
                }
            },
            history: {
                type: ARRAY,
                _inputex: {
                    _type: "list",
                    useButtons: true,
                    wrapperClassName: 'inputEx-fieldWrapper wegas-advanced-feature'
                }
            }
        }
    });
    /**
     * ListDescriptor mapper
     */
    Wegas.persistence.ListDescriptor = Y.Base.create("ListDescriptor", Wegas.persistence.VariableDescriptor, [], {
        /**
         * Extend clone to add transient childs
         */
        clone: function() {
            var object = Wegas.Editable.prototype.clone.call(this), i;
            object.items = [];
            for (i in this.get("items")) {
                object.items.push(this.get("items")[i].clone());
            }
            return object;
        },
        flatten: function() {
            var acc = [],
                    doFlatten = function(items) {
                var i, it;
                for (i = 0; i < items.length; i += 1) {
                    it = items[i];
                    if (it instanceof Wegas.persistence.QuestionDescriptor) {
                        acc.push(it);
                    } else if (it instanceof Wegas.persistence.ListDescriptor) {
                        doFlatten(it.get("items"));
                    } else {
                        acc.push(it);
                    }
                }
            };
            doFlatten(this.get("items"));
            return acc;

        },
        find: function(id) {
            return this.depthFirstSearch(id);
        },
        depthFirstSearch: function(id) {
            var needle,
                    filterFn = function(it) {
                if (it.get("id") === +id) {
                    needle = it;
                    return false;
                } else if (it instanceof Y.Wegas.persistence.ListDescriptor) {
                    return Y.Array.every(it.get("items"), filterFn);
                } else {
                    return true;
                }
            };
            Y.Array.every(this.get("items"), filterFn);
            return needle;
        }
    }, {
        ATTRS: {
            "@class": {
                value: "ListDescriptor"
            },
            items: {
                type: ARRAY,
                value: [],
                "transient": true,
                _inputex: {
                    _type: HIDDEN
                },
                setter: function(val) {
                    var i;
                    for (i = 0; i < val.length; i = i + 1) {                // We set up a back reference to the parent
                        val[i].parentDescriptor = this;
                    }
                    return val;
                }
            },
            /**
             * The currently selected element based on current ListInstance.
             */
            currentItem: {
                "transient": true,
                getter: function() {
                    var inst = this.getInstance();
                    if (!Y.Lang.isUndefined(inst)
                            && this.get("items")[inst.get(VALUE)]) {

                        return this.get("items")[inst.get(VALUE)];
                    } else {
                        return null;
                    }
                }
            },
            defaultInstance: {
                properties: {
                    "@class": {
                        type: STRING,
                        _inputex: {
                            value: 'ListInstance',
                            _type: HIDDEN
                        }
                    },
                    id: IDATTRDEF
                }
            }
        },
        EDITORNAME: "Folder",
        EDITMENU: [{
                type: "EditEntityButton"
            }, {
                type: BUTTON,
                label: "New",
                plugins: [{
                        "fn": "WidgetMenu",
                        "cfg": {
                            //"menuCfg": {
                            //    points: ["tl", "tr"]
                            //},
                            //"event": "mouseenter",
                            "children": [{
                                    type: "AddEntityChildButton",
                                    label: "Number",
                                    targetClass: "NumberDescriptor"
                                }, {
                                    type: "AddEntityChildButton",
                                    label: "Text",
                                    targetClass: "TextDescriptor"
                                }, {
                                    type: "AddEntityChildButton",
                                    label: "Folder",
                                    targetClass: "ListDescriptor"
                                }, {
                                    type: "AddEntityChildButton",
                                    label: "Question",
                                    targetClass: "QuestionDescriptor"
                                }, {
                                    type: "AddEntityChildButton",
                                    label: "Trigger",
                                    targetClass: "TriggerDescriptor"
                                }, {
                                    type: "AddEntityChildButton",
                                    label: "Object",
                                    targetClass: "ObjectDescriptor"
                                }, {
                                    type: "NewEntityButton",
                                    label: "State machine",
                                    targetClass: "FSMDescriptor",
                                    cssClass: "experimental"
                                }, {
                                    type: "NewEntityButton",
                                    label: "Dialogue",
                                    targetClass: "DialogueDescriptor",
                                    cssClass: "experimental wegas-advaned-feature"
                                }, {
                                    type: "AddEntityChildButton",
                                    label: "String",
                                    targetClass: "StringDescriptor",
                                    cssClass: "wegas-advanced-feature"
                                }, {
                                    type: "NewEntityButton",
                                    label: "Object",
                                    targetClass: "ObjectDescriptor",
                                    cssClass: "wegas-advanced-feature"
                                }, {
                                    type: "NewEntityButton",
                                    label: "Inbox",
                                    targetClass: "InboxDescriptor",
                                    cssClass: "wegas-advanced-feature"
                                }]
                        }
                    }]
            }, {
                type: BUTTON,
                label: "Copy",
                plugins: [{
                        fn: "DuplicateEntityAction"
                    }]
            }, {
                type: "DeleteEntityButton"
            }]
    });
    /*
     * ListInstance mapper
     */
    Wegas.persistence.ListInstance = Y.Base.create("ListInstance", Wegas.persistence.VariableInstance, [], {}, {
        ATTRS: {
            "@class": {
                value: "ListInstance"
            }
        }
    });


    Wegas.persistence.InboxDescriptor = Y.Base.create("InboxDescriptor", Wegas.persistence.VariableDescriptor, [], {
        isEmpty: function(playerId) {
            playerId = playerId instanceof Y.Wegas.persistence.Player ? playerId.get("id") : playerId;
            return this.getInstance(playerId).get("messages").length < 1;
        }
    }, {
        ATTRS: {
            "@class": {
                value: "InboxDescriptor"
            },
            defaultInstance: {
                properties: {
                    '@class': {
                        type: STRING,
                        _inputex: {
                            _type: HIDDEN,
                            value: 'InboxInstance'
                        }
                    },
                    id: IDATTRDEF
                }
            }
        },
        METHODS: {
            sendMessage: {
                label: "send message",
                className: "wegas-method-sendmessage",
                arguments: [{
                        type: HIDDEN,
                        value: SELF
                    }, {
                        type: STRING,
                        label: "from",
                        scriptType: STRING
                    }, {
                        type: STRING,
                        label: "title",
                        scriptType: STRING
                    }, {
                        type: HTML,
                        label: "Content",
                        scriptType: STRING
                    }, {
                        type: "list",
                        label: "Attachements",
                        scriptType: STRING,
                        useButtons: true,
                        /*sortable: true*/
                        elementType: {
                            type: "wegasurl",
                            label: "",
                            required: true
                        }
                    }]
            },
            isEmpty: {
                label: "is empty",
                returns: BOOLEAN,
                arguments: [{
                        type: HIDDEN,
                        value: SELF
                    }]
            }

        }
    });

    /**
     * InboxInstance mapper
     */
    Wegas.persistence.InboxInstance = Y.Base.create("InboxInstance", Wegas.persistence.VariableInstance, [], {}, {
        ATTRS: {
            "@class": {
                value: "InboxInstance",
                _inputex: {
                    disabled: true,
                    label: "Nothing to edit"
                }
            },
            messages: {
                type: ARRAY,
                "transient": true,
                value: []
            }
        }
    });

    /**
     * Message mapper
     */
    Wegas.persistence.Message = Y.Base.create("Message", Wegas.persistence.Entity, [], {}, {
        ATTRS: {
            "@class": {
                value: "Message"
            },
            subject: {},
            body: {},
            unread: {
                value: false,
                type: BOOLEAN
            },
            from: {},
            attachements: {}
        }
    });

    /**
     * Script mapper
     */
    Wegas.persistence.Script = Y.Base.create("Script", Wegas.persistence.Entity, [], {
        initializer: function() {
            this.publish("evaluated");
            this._inProgress = false;
            this._result = null;
        },
        isValid: function() {
            // @todo : FX a greffer :)
        },
        /*
         * evaluated event contains response. true or false. False if script error.
         */
        localEval: function() {
            if (Wegas.Facade.VariableDescriptor.script.eval) {
                if (this._result) {
                    this.fire("evaluated", this._result);
                    return;
                }
                if (!this._inProgress) {
                    this._inProgress = true;
                    Wegas.Facade.VariableDescriptor.script.eval(this.get("content"), {success: Y.bind(function(result) {
                            if (result === true) {
                                this._result = true;
                            } else {
                                this._result = false;
                            }
                            this._inProgress = false;
                            this.fire("evaluated", this._result);
                        }, this), failure: Y.bind(function(result) {
                            this._result = false;
                            this._inProgress = false;
                            this.fire("evaluated", false);
                        }, this)});
                } else {
                    Y.log("evaluation in progress");
                }
            }
        },
        isEmpty: function() {
            return (this.content === null || this.content === "");
        }
    }, {
        ATTRS: {
            id: {
                value: undefined, // An Embeddable has no ID !!! Forcing it
                readOnly: true,
                "transient": true
            },
            "@class": {
                value: "Script",
                type: STRING
            },
            language: {
                value: "JavaScript",
                type: STRING,
                choices: [{
                        value: "JavaScript"
                    }],
                _inputex: {
                    //type:"select",
                    _type: HIDDEN
                }
            },
            content: {
                type: STRING,
                format: TEXT,
                _inputex: {
                    _type: "script"
                },
                setter: function(v) {
                    this._result = null;
                    return v;
                }
            }
        }
    });
});
