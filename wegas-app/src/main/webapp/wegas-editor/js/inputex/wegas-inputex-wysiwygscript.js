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

YUI.add("wegas-inputex-wysiwygscript", function(Y) {
    "use strict";
    var inputEx = Y.inputEx;
    inputEx.WysiwygScript = function(options) {
        inputEx.WysiwygScript.superclass.constructor.call(this, options);
    };
    Y.extend(inputEx.WysiwygScript, inputEx.Script, {
        /**
         *
         */
        setOptions: function(options) {
            inputEx.WysiwygScript.superclass.setOptions.call(this, options);
            this.options.className = options.className || 'inputEx-Field inputEx-WysiwigScript';
            this.options.mode = options.mode || "wysiwyg"; // wysywig / text
            this.options.expects = options.expects || "statement"; // conditon/statement/getter
            this.options.classFilter = options.classFilter;
            this.options.messages.invalid = ""; //Invalid message should appear near invalid fields
        },
        /**
         *
         */
        getValue: function() {
            if (this.options.mode === "wysiwyg") {
                var ct = "";
                if (this.exprList.getArray().length > 0) {
                    if (this.options.expects === "condition") {
                        ct = this.exprList.getArray().join(" && ");
                    } else {
                        ct = this.exprList.getArray().join(";\n");
                    }
                }
                return {
                    '@class': "Script",
                    //language: "JavaScript",
                    content: ct
                };
            } else {
                return inputEx.WysiwygScript.superclass.getValue.apply(this, arguments);
            }
        },
        /**
         *
         */
        setValue: function(val, sendUpdated) {
            if (val && val.name) {                                              // @backwardcompatibility Convert old format to new one (for flexitests)
                val = {
                    content: "Variable.find('" + val.name + "');"
                };
            }
            inputEx.WysiwygScript.superclass.setValue.call(this, val, sendUpdated);
            this.updateExpressionList();
        },
        validate: function() {
            var val = this.getValue();
            if (val.content.trim() === "") { // accept empty if not required.
                return !this.options.required;
            }
            if (this.options.mode === "wysiwyg") {
                return this.exprList.validate() && inputEx.WysiwygScript.superclass.validate.call(this);
            }
            return inputEx.WysiwygScript.superclass.validate.call(this);
        },
        isEmpty: function() {
            return this.options.mode === "wysiwyg" ?
                this.exprList.getArray().join("").trim() === "" :
                this.getValue().content.trim() === "";

        },
        // *** Private Methods *** //
        /**
         *
         */
        renderComponent: function() {
            inputEx.Script.superclass.renderComponent.call(this);
            var field = (new Y.Node(this.fieldContainer));
            // Add the "view src" button
            this.viewSrc = new Y.Wegas.Button({
                label: "<span class=\"wegas-icon wegas-icon-viewsrc\"></span>",
                tooltip: "View source",
                cssClass: "inputEx-WysiwigScript-viewsrc",
                on: {
                    click: Y.bind(function() {
                        if (!this.viewSrc.get("disabled") && (this.validate() || this.isEmpty())) {
                            if (this.options.mode === "wysiwyg") { // If current mode is wysiwyg
                                this.updateTextarea(); // update textatea content
                            } else if (!this.updateExpressionList()) {
                                return;
                            }
                            this.setMode((this.options.mode === "wysiwyg") ? "text" : "wysiwyg");
                        }
                    }, this)
                }
            }).render(field);
            this.addButton = new Y.Wegas.Button({
                label: "<span class=\"wegas-icon wegas-icon-add\"></span>",
                tooltip: "Add",
                cssClass: "inputEx-WysiwigScript-add",
                on: {
                    click: Y.bind(function(e) {
                        if (!this.addButton.get("disabled")) {
                            this.exprList.onAdd();
                        }
                    }, this)
                }
            }).render(field);
            (new Y.Node(this.fieldContainer))
                .prepend(this.viewSrc.get("boundingBox"))
                .prepend(this.addButton.get("boundingBox"))                 // Move view src and add buttons to the top of the the wysiwyg list 
                .append("<em class=\"msg\"></em>"); // Add a div for messages

            this.on("updated", function() {
                if (this.options.mode === "text") {
                    this.updateExpressionList();
                }
//                this.setClassFromState();
            }, this); // Whenever the value is updated, we synchronize the UI

            this.updateExpressionList(); // Synchronize the wysiwig list      
            this.setMode(this.options.mode); // Set the default mode (wysiwyg or source)
        },
        /**
         *
         */
        destroy: function() {
            this.exprList.destroy();
            this.viewSrc.destroy();
            this.addButton.destroy();
            inputEx.WysiwygScript.superclass.destroy.call(this);
        },
        /**
         *
         */
        setMode: function(mode) {
            var wysiwygmode = (mode === "wysiwyg");
            this.options.mode = mode;
            this.viewSrc.set("selected", wysiwygmode ? 0 : 1);
            this.el.toggleView(!wysiwygmode);
            //this.wrapEl.style.display = (wysiwygmode) ? "none" : "block";
            this.addButton.set("disabled", !wysiwygmode);
            if (wysiwygmode) {
                this.exprList.show();
            } else {
                this.exprList.hide();
            }
        },
        updateTypeInvite: function() {
            //nothing to do, let other do that
        },
        /**
         *
         */
        updateTextarea: function() {
            if (this.options.mode === "wysiwyg") {                              // If current mode is wysiwyg
                inputEx.AceField.prototype.setValue.call(this, this.getValue().content); // update textatea content
            }
        },
        updateExpressionList: function() {
            var i, tree,
                container = new Y.Node(this.fieldContainer),
                fields = [];
            container.one(".msg").setContent(""); // Reset layout

            try { // Generate the syntaxic tree using esprima    
                tree = window.esprima.parse(inputEx.WysiwygScript.superclass.getValue.call(this).content, {
                    raw: true,
                    range: true
                });
                for (i = 0; i < tree.body.length; i = i + 1) {
                    if (tree.body[i].type !== "EmptyStatement") {
                        try {
                            fields = fields.concat(this.generateExpression(tree.body[i].expression));
                            fields[i].raw = String.prototype.substring.apply(inputEx.WysiwygScript.superclass.getValue.call(this).content, tree.body[i].expression.range);
                        } catch (e) {
                            fields.push({
                                raw: String.prototype.substring.apply(inputEx.WysiwygScript.superclass.getValue.call(this).content, tree.body[i].expression.range),
                                type: this.options.expects
                            });
                        }
                    }
                }

                this.viewSrc.set("disabled", false);
                if (this.exprList) {
                    this.exprList.destroy();
                }
                this.exprList = Y.inputEx({//                                   // Render the expression as a Y.inputEx.Wegas.ListField
                    type: "listfield",
                    fields: fields,
                    useButtons: true,
                    parentEl: this.fieldContainer,
                    addType: {
                        type: this.options.expects, // conditon/statement/getter,
                        classFilter: this.options.classFilter
                    }
                });
                this.exprList.on("updated", function() {                        // Whenever the list is update,
                    if (this.options.mode === "wysiwyg") {
                        this.fireUpdatedEvt(); // fire updated event
                    }
//                    if(this.validate()){
//                        this.setClassFromState();
//                    }
                }, this);
                if (this.options.mode !== "wysiwyg") {
                    this.exprList.hide();
                }
                return true;
            } catch (ex) {
                //Y.error("Error evaluating line: " + window.escodegen.generate(tree.body[i].expression, {indent: true}));
                this.setMode("text");
                //this.viewSrc.set("disabled", true);
                container.one(".msg").setContent("Unable to read impact, displaying sources");
                return;
            }
        },
        /**
         *
         */
        generateExpression: function(expression) {
            var args, vdSelect, ret;
            //Y.log("generateExpression(" + expression.type + ")");
            switch (expression.type) {

                case "Identifier":
                    return expression.name;
                case "Literal":
                    return expression.value;
                case "UnaryExpression":
                    return expression.operator + this.generateExpression(expression.argument);
                case "ObjectExpression":
                    args = {};
                    Y.Array.each(expression.properties, function(i) {
                        args[i.key.value] = this.generateExpression(i.value);
                    }, this);
                    return args;
                case "ArrayExpression":
                    args = [];
                    Y.Array.each(expression.elements, function(i) {
                        args.push(this.generateExpression(i));
                    }, this);
                    return args;
                case "BinaryExpression":
                    vdSelect = this.generateExpression(expression.left)[0];
                    args = [];
                    vdSelect.type = "condition";
                    vdSelect.operator = expression.operator;
                    vdSelect.rightValue = this.generateExpression(expression.right);
                    return [vdSelect];
                case "LogicalExpression":
                    if (expression.operator === "&&") {
                        return this.generateExpression(expression.left).
                            concat(this.generateExpression(expression.right));
                    }
                    break;
                case "CallExpression":
                    switch (expression.callee.object.type) {
                        case "Identifier":
                            switch (expression.callee.object.name) {
                                case "Variable": // @backwardcompatibility
                                case "VariableDescriptorFacade":
                                    return {
                                        type: this.options.expects,
                                        classFilter: this.options.classFilter,
                                        value: (expression["arguments"][1]) ? expression["arguments"][1].value : expression["arguments"][0].value // First argument (gameModel) is optional
                                    };
                                case "RequestManager":
                                case "Event":
                                    args = [];
                                    Y.Array.each(expression["arguments"], function(i) {
                                        args.push(this.generateExpression(i));
                                    }, this);
                                    ret = {
                                        type: this.options.expects,
                                        classFilter: this.options.classFilter,
                                        value: "GLOBAL" + expression.callee.object.name + "." + expression.callee.property.name,
                                        "arguments": args
                                    };
                                    if (expression.callee.property.name === "fired") {
                                        return [ret];
                                    } else {
                                        return ret;
                                    }
                            }
                            break;
                        default:
                            vdSelect = this.generateExpression(expression.callee.object);
                            args = [];
                            Y.Array.each(expression["arguments"], function(i) {
                                args.push(this.generateExpression(i));
                            }, this);
                            Y.mix(vdSelect, {
                                method: expression.callee.property.name,
                                "arguments": args

                            });
                            return [vdSelect];
                    }
                    break;
            }
            throw new Error("Unable to parse expression.");
        }
    });
    inputEx.registerType('script', inputEx.WysiwygScript); // Register this class as "script" type

    /**
     *
     */
    inputEx.SingleLineWysiwygScript = function(options) {
        inputEx.SingleLineWysiwygScript.superclass.constructor.call(this, options);
    };
    Y.extend(inputEx.SingleLineWysiwygScript, inputEx.WysiwygScript, {
        setOptions: function(options) {
            options.defaultValue = [{}];
            options.expects = options.expects || "getter";
            options.className = options.className || 'inputEx-Field inputEx-WysiwigScript inputEx-singleLineWysiwygScript';
            inputEx.SingleLineWysiwygScript.superclass.setOptions.apply(this, arguments);
        },
        updateExpressionList: function() {
            inputEx.SingleLineWysiwygScript.superclass.updateExpressionList.apply(this, arguments);
            Y.later(10, this, function() {
                if (this.exprList.inputs.length === 0) {
                    this.exprList.onAdd();
                }
            });
        }
    });
    inputEx.registerType("variableselect", inputEx.SingleLineWysiwygScript); // Register this class as "variableselect"
});
