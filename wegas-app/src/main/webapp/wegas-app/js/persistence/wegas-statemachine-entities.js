YUI.add("wegas-statemachine-entities", function(Y) {


    var STRING = "string", HIDDEN = "hidden", SELF = "self", BOOLEAN = "boolean",
            NUMBER = "number", BUTTON = "Button", SCRIPT = "script", TEXT = "text",
            STATES = "states", ID = "id";
    /*******************************/
    /******** STATEMACHINE *********/
    /*******************************/

    /*
     * FSMInstance Entity
     */
    Y.Wegas.persistence.FSMInstance = Y.Base.create("FSMInstance", Y.Wegas.persistence.VariableInstance, [], {}, {
        ATTRS: {
            "@class": {
                value: "FSMInstance"
            },
            currentStateId: {
                value: 1,
                type: NUMBER,
                _inputex: {
                    label: "Current state id"
                }
            },
            enabled: {
                type: BOOLEAN,
                value: true,
                _inputex: {
                    label: 'Active'
                }
            },
            transitionHistory: {
                value: [],
                writeOnce: "initOnly",
                type: "uneditable",
                _inputex: {
                    label: "Transition History"
                            //,
                            //elementType:{
                            //    type:NUMBER,
                            //    readonly:true
                            //}
                }
            }
        }
    });
    /*
     * FSMDescriptor Entity
     */
    Y.Wegas.persistence.FSMDescriptor = Y.Base.create("FSMDescriptor", Y.Wegas.persistence.VariableDescriptor, [], {
        // *** Lifecycle methods *** //
        /**
         * Find a transition by it's id
         * @param {Integer} id The queried transition's id
         * @return {Transition|null} the transition if it exists
         */
        getTransitionById: function(id) {
            var i, t, states = this.get(STATES),
                    trs;
            for (i in states) {
                trs = states[i].get("transitions");
                for (t in trs) {
                    if (+trs[t].get(ID) === +id) {
                        return trs[t];
                    }
                }
            }
            return null;
        },
        /**
         *  Succession of State - transition representing the path
         *  for current user.
         *  @return {Array} An array containing alternatively state/transition.
         */
        getFullHistory: function() {
            var i, transitionHistory = this.getInstance().get("transitionHistory"),
                    fullHistory = [],
                    tmpTransition = null;
            //TODO :Currently assuming it begins with initialState. May be wrong?
            fullHistory.push(this.getState(this.getInitialStateId()));
            for (i = 0; i < transitionHistory.length; i += 1) {
                tmpTransition = this.getTransitionById(transitionHistory[i]);
                fullHistory.push(tmpTransition);
                fullHistory.push(this.getState(tmpTransition.get("nextStateId")));
            }
            return fullHistory;
        },
        // *** Private methods *** //
        getCurrentState: function() {
            return this.get(STATES)[this.getInstance().get("currentStateId")];
        },
        getInitialStateId: function() {
            return this.get("defaultInstance").get("currentStateId");
        },
        setInitialStateId: function(initialStateId) {
            this.get("defaultInstance").set("currentStateId", initialStateId);
        },
        getState: function(identifier) {
            return this.get(STATES)[identifier];
        }
    }, {
        ATTRS: {
            "@class": {
                value: "FSMDescriptor"
            },
            defaultInstance: {
                valueFn: function() {
                    return new Y.Wegas.persistence.FSMInstance();
                },
                validator: function(o) {
                    return o instanceof Y.Wegas.persistence.FSMInstance;
                },
                properties: {
                    '@class': {
                        type: STRING,
                        _inputex: {
                            _type: HIDDEN,
                            value: 'FSMInstance'
                        }
                    },
                    id: {
                        type: NUMBER,
                        optional: true, // The id is optional for entites that have not been persisted
                        _inputex: {
                            _type: HIDDEN
                        }
                    },
                    currentStateId: {
                        type: NUMBER,
                        optional: true,
                        _inputex: {
                            label: 'Initial state id',
                            value: 1
                        }
                    },
                    enabled: {
                        type: BOOLEAN,
                        _inputex: {
                            label: 'Active by default'
                        }
                    }
                }
            },
            states: {
                value: {},
                writeOnce: "initOnly",
                _inputex: {
                    _type: HIDDEN
                }
            }
        },
        EDITMENU: [{
                type: "EditEntityButton",
                plugins: [{
                        fn: "EditFSMAction"
                    }]
            }, {
                type: BUTTON,
                label: "Duplicate",
                plugins: [{
                        fn: "DuplicateEntityAction"
                    }]
            }, {
                type: "DeleteEntityButton"
            }],
        METHODS: {
            enable: {
                label: "activate",
                arguments: [{
                        type: HIDDEN,
                        value: SELF
                    }]
            },
            disable: {
                label: "desactivate",
                arguments: [{
                        type: HIDDEN,
                        value: SELF
                    }]
            },
            isEnabled: {
                label: "is active",
                arguments: [{
                        type: HIDDEN,
                        value: SELF
                    }],
                returns: BOOLEAN
            }
        }
    });
    /*
     * State Entity
     */
    Y.Wegas.persistence.State = Y.Base.create("State", Y.Wegas.persistence.Entity, [], {
        // *** Lifecycle methods *** //
        initializer: function() {
        }

        // *** Private methods *** //
    }, {
        ATTRS: {
            "@class": {
                value: "State"
            },
            label: {
                value: null
            },
            onEnterEvent: {
                value: null,
                _inputex: {
                    _type: "script",
                    label: "Impact"
                }
            },
            transitions: {
                value: []
            },
            editorPosition: {
                valueFn: function() {
                    return new Y.Wegas.persistence.Coordinate({
                        x: 30,
                        y: 30
                    });
                }
            }
        }
    });
    /*
     * TransitionDescriptor Entity
     */
    Y.Wegas.persistence.Transition = Y.Base.create("Transition", Y.Wegas.persistence.Entity, [], {}, {
        ATTRS: {
            "@class": {
                value: "Transition",
                _inputex: {
                    _type: HIDDEN
                }
            },
            triggerCondition: {
                _inputex: {
                    _type: SCRIPT,
                    label: 'Condition',
                    expects: "condition"
                }
            },
            preStateImpact: {
                value: null,
                _inputex: {
                    _type: SCRIPT,
                    label: 'Impact'
                }
            },
            nextStateId: {
                value: null,
                _inputex: {
                    _type: HIDDEN
                }
            }
        }
    });
    /**************************/
    /******** TRIGGER *********/
    /**************************/

    /*
     * TriggerDescriptor Entity
     */
    Y.Wegas.persistence.TriggerDescriptor = Y.Base.create("TriggerDescriptor", Y.Wegas.persistence.FSMDescriptor, [], {}, {
        ATTRS: {
            "@class": {
                value: "TriggerDescriptor"
            },
            defaultInstance: {
                valueFn: function() {
                    return new Y.Wegas.persistence.TriggerInstance();
                },
                properties: {
                    '@class': {
                        type: STRING,
                        _inputex: {
                            _type: HIDDEN,
                            value: 'TriggerInstance'
                        }
                    },
                    currentStateId: {
                        type: NUMBER,
                        optional: true,
                        _inputex: {
                            label: 'Initial state id',
                            _type: HIDDEN
                        }
                    },
                    enabled: {
                        type: BOOLEAN,
                        _inputex: {
                            label: 'Active by default'
                        }
                    }
                }
            },
            triggerEvent: {
                _inputex: {
                    _type: SCRIPT,
                    label: 'Condition',
                    expects: "condition"
                }
            },
            postTriggerEvent: {
                _inputex: {
                    _type: SCRIPT,
                    label: 'Impact'
                }
            },
            oneShot: {
                type: BOOLEAN,
                value: true,
                _inputex: {
                    label: 'Only once'
                }
            },
            states: {
                "transient": true
            }
        },
        EDITMENU: [{
                type: "EditEntityButton"

            }, {
                type: BUTTON,
                label: "Duplicate",
                plugins: [{
                        fn: "DuplicateEntityAction"
                    }]
            }, {
                type: "DeleteEntityButton"
            }]
    });
    /*
     * TriggerInstance Entity
     */
    Y.Wegas.persistence.TriggerInstance = Y.Base.create("TriggerInstance", Y.Wegas.persistence.FSMInstance, [], {}, {
        ATTRS: {
            "@class": {
                value: "TriggerInstance"
            },
            currentStateId: {
                type: STRING,
                optional: true,
                _inputex: {
                    label: "Trigger state",
                    disabled: true
                }
            }
        }
    });
    /**********************************/
    /******** DIALOGUE ENTITY *********/
    /**********************************/

    /**
     * DialogueDescriptor Entity
     */

    Y.Wegas.persistence.DialogueDescriptor = Y.Base.create("DialogueDescriptor", Y.Wegas.persistence.FSMDescriptor, [], {
        /**
         * Triggers a Dialogue Transition programmatically
         * @param {DialogueTransition} transition - the transition object to trigger.
         * @param {Object} callbacks - {success:Function|String, failure:Function|String} - the callback functions to execute.
         */
        doTransition: function(transition, callbacks) {
            var request;
            if (transition instanceof Y.Wegas.persistence.DialogueTransition) {
                if (!this.get(ID) || !transition.get(ID)) {
                    Y.error("Trying to call an unpersisted transition", new Error("Calling a detached entity"), "Y.Wegas.persistence.DialogueDescriptor");
                    return false;
                }
                request = "/StateMachine/" + this.get(ID)
                        + "/Player/" + Y.Wegas.app.get("currentPlayer")
                        + "/Do/" + transition.get(ID);
                try {
                    Y.Wegas.Facade.VariableDescriptor.sendRequest({
                        request: request,
                        on: callbacks
                    });
                } catch (e) {
                    //TODO : that
                }
                return true;

            } else {
                return false;
            }
        }
    }, {
        ATTRS: {
            "@class": {
                value: "DialogueDescriptor"
            }
        },
        EDITMENU: [{
                type: "EditEntityButton",
                plugins: [{
                        fn: "EditFSMAction",
                        cfg: {
                            viewerCfg: {
                                availableStates: [/*"State",*/ "DialogueState"],
                                availableTransitions: [/*"Transition",*/ "DialogueTransition"]
                            }
                        }
                    }]
            }, {
                type: BUTTON,
                label: "Duplicate",
                plugins: [{
                        fn: "DuplicateEntityAction"
                    }]
            }, {
                type: "DeleteEntityButton"
            }]
    });
    /**
     * DialogueTransition Entity
     */
    Y.Wegas.persistence.DialogueTransition = Y.Base.create("DialogueTransition", Y.Wegas.persistence.Transition, [], {
        /**
         * Builds the REST request to trigger this specifique transition
         * @param {Integer} id The dialogue's id
         * @return {String} an url to GET.
         */
        //getTriggerURL: function (id) {
        //    return Y.Wegas.app.get("base") + "rest/GameModel/" +
        //    Y.Wegas.app.get("currentGame")
        //    + "/VariableDescriptor/StateMachine/" + id
        //    + "/Player/" + Y.Wegas.app.get("currentPlayer")
        //    + "/Do/" + this.get(ID);
        //}
    }, {
        EDITORNAME: "choice",
        ATTRS: {
            "@class": {
                value: "DialogueTransition"
            },
            actionText: {
                type: "string",
                format: "html",
                value: null,
                validator: function(s) {
                    return s === null || Y.Lang.isString(s);
                },
                _inputex: {
                    index: -1,
                    label: "Text"
                }
            }
        }
    });
    /**
     * DialogueState Entity
     */
    Y.Wegas.persistence.DialogueState = Y.Base.create("DialogueState", Y.Wegas.persistence.State, [], {
        /*
         *
         */
        getAvailableActions: function(callback) {
            var i, transitions = this.get("transitions"),
                    ctrlObj = {
                availableActions: [],
                toEval: 0
            };
            for (i in transitions) {
                if (transitions[i] instanceof Y.Wegas.persistence.DialogueTransition) {
                    if (!transitions[i].get("triggerCondition")) {
                        ctrlObj.availableActions.push(transitions[i]);
                    } else {
                        transitions[i].get("triggerCondition").once("Script:evaluated", function(e, o, ctrlObj, transition, callback) {
                            ctrlObj.toEval -= 1;
                            if (o === true) {
                                ctrlObj.availableActions.push(transition);
                            }
                            if (ctrlObj.toEval === 0) {
                                callback(ctrlObj.availableActions);
                            }
                        }, this, ctrlObj, transitions[i], callback);
                        ctrlObj.toEval += 1;
                        transitions[i].get("triggerCondition").localEval();
                    }
                }
            }
            if (ctrlObj.toEval === 0) {
                callback(ctrlObj.availableActions);
            }
        },
        /**
         * Get an array of texts from the state's text, split by a token
         * @param {String} token The token to split by
         */
        getTexts: function(token) {
            return this.get(TEXT).split(token);
        },
        /**
         * Set the text with an array and a token
         *
         * @param {Array} a Strings to join
         * @param {String} token Token to join the array
         */
        setText: function(a, token) {
            this.set(TEXT, a.join(token));
        }
    }, {
        EDITORNAME: "server text",
        ATTRS: {
            "@class": {
                value: "DialogueState"
            },
            text: {
                type: "string",
                format: "html",
                value: null,
                validator: function(s) {
                    return s === null || Y.Lang.isString(s);
                },
                _inputex: {
                    index: -1
                }
            }
        }
    });
    /**
     * Coordinate embeddable mapper
     **/
    Y.Wegas.persistence.Coordinate = Y.Base.create("Coordinate", Y.Wegas.persistence.Entity, [], {}, {
        ATTRS: {
            "@class": {
                value: "Coordinate"
            },
            x: {
                value: null
            },
            y: {
                value: null
            }
        }
    });
});
