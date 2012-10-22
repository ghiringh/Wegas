/*
 * Wegas
 * http://www.albasim.com/wegas/
 *
 * School of Business and Engineering Vaud, http://www.heig-vd.ch/
 * Media Engineering :: Information Technology Managment :: Comem
 *
 * Copyright (C) 2012
 */

/**
 * @author Francois-Xavier Aeberhard <fx@red-agent.com>
 */

YUI.add('wegas-pageloader', function (Y) {
    "use strict";

    var CONTENTBOX = 'contentBox', PageLoader;

    PageLoader = Y.Base.create("wegas-pageloader", Y.Widget, [Y.WidgetChild, Y.WidgetParent, Y.Wegas.Widget, Y.Wegas.persistence.Editable], {

        // *** Lifecycle Methods ***/
        initializer: function () {
            PageLoader.pageLoaderInstances[this.get("id")] = this;              // We keep a references of all loaded PageLoaders
        },

        bindUI: function () {
            Y.Wegas.PageFacade.rest.after("pageUpdated", function(e){
                if(e.page && e.page["@pageId"] == this.get("pageId")){
                    this.syncUI();
                }
            }, this);
        //Y.Wegas.app.dataSources.Page.after("response", this.syncUI, this);
        },

        syncUI: function () {
            if( this.get("pageId")){
                this.set( "pageId", this.get( "pageId" ) );
            }else{
                this.set( "pageId", this.get("variableDesc"));
            }
        }
    }, {
        ATTRS : {
            variableName:{},
            id:{
                "transient":false
            },
            children: {
                "transient": true
            },
            pageId: {
                setter: function (val) {
                    if (!val) {
                        return val;
                    }

                    var widgetCfg = Y.Wegas.PageFacade.rest.getPage(val),
                    oldWidget = this.get("widget");
                    //                    if (widgetCfg && widgetCfg.id && this.widgetCfg             // If the widget is currently being loaded, escape
                    //                        && this.widgetCfg.id && this.widgetCfg.id == widgetCfg.id) {
                    //                        return val;
                    //                    }
                    this.widgetCfg = widgetCfg;

                    if (oldWidget) {                                            // If there is already a widget, we destroy it
                        //                        if (oldWidget.get("id") == val) {                       // If the widget is the same as the one currently loaded, exit
                        //                            return val;
                        //                        }
                        oldWidget.destroy();                                    // @fixme we should remove the widget instead of destroying it
                        this.get(CONTENTBOX).empty();
                    }
                    this.hideOverlay();
                    if(widgetCfg == null){
                        this.showOverlay();
                    }
                    widgetCfg = widgetCfg || {
                        // id: Y.Wegas.App.genId(),
                        type: "Text",
                        content: "Loading..."
                    };

                    try {
                        Y.Wegas.Widget.use(widgetCfg, Y.bind( function (cfg) {  // Load the subwidget dependencies
                            var widget = Y.Wegas.Widget.create( cfg );// Render the subwidget
                            widget.render(this.get(CONTENTBOX));
                            this.set("widget", widget);
                        }, this, widgetCfg));
                    } catch (e) {
                        Y.log('renderUI(): Error rendering widget: ' + (e.stack || e), 'error', 'Wegas.PageLoader');
                    }
                    return val;
                }
            },

            variableDesc:{
                "transient": true,
                getter: function () {
                    var variable;

                    if ( !this.get("variableName") ) {
                        return null;
                    }

                    variable = Y.Wegas.VariableDescriptorFacade.rest.find( 'name', this.get("variableName") );
                    if(!variable || !variable.getInstance().get("value")){
                        return null;
                    }else{
                        return variable.getInstance().get("value");
                    }
                }
            },
            widget: {
                "transient":true
            }
        },

        pageLoaderInstances: [],
        find: function (id) {
            return PageLoader.pageLoaderInstances[id];
        }
    });

    Y.namespace('Wegas').PageLoader = PageLoader;
});
