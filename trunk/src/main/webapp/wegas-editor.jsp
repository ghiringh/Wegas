<!DOCTYPE html >
<html lang="en"> 
    <head>  
        <title>Wegas - 0.2</title> 
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" /> 
        <meta name="description" content="" /> 
        <meta name="keywords" content="" />     
        <meta name="robots" content="index, follow" /> 
        <meta name="contact" content="fx@red-agent.com" /> 
        <meta name="audience" content="General" /> 
        <meta name="distribution" content="Global" /> 
        <meta name="revisit-after" content="30 days" /> 
        <link rel="icon" type="image/ico" href="/favicon.ico" /> 

        <!-- YUI -->
        <!-- CDN  -->
        <!--<link rel="stylesheet" type="text/css" 
                        href="http://yui.yahooapis.com/combo?3.3.0/build/cssfonts/fonts-min.css&3.3.0/build/cssreset/reset-min.css&3.3.0/build/cssgrids/grids-min.css&3.3.0/build/cssbase/base-min.css&3.3.0pr3/build/widget/assets/skins/sam/widget.css&3.3.0pr3/build/node-menunav/assets/skins/sam/node-menunav.css&" charset="utf-8" /> 
            <link rel="stylesheet" type="text/css" href="http://yui.yahooapis.com/2.7.0/build/assets/skins/sam/skin.css">   -->

        <!-- Self hosted -->
        <link rel="stylesheet" type="text/css" href="lib/yui3/build/cssfonts/fonts-min.css" />
        <link rel="stylesheet" type="text/css" href="lib/yui3/build/cssreset/reset-min.css" />

        <!-- WireIt -->
        <link rel="stylesheet" type="text/css" href="lib/wireit/css/WireIt.css" /> 

        <!-- InputEx -->
        <!-- <link type='text/css' rel='stylesheet' href='lib/inputex/css/inputEx.css' />-->

        <meta id="customstyles" /> 
        <link rel="stylesheet" type="text/css" href="wegas-editor/assets/wegas-editor.css" />

    </head> 
    <body class="yui3-skin-sam yui-skin-sam " > 

        <!-- YUI Base -->
        <!-- CDN -->
        <!--<script type="text/javascript" src="http://yui.yahooapis.com/combo?3.5.0pr1/build/yui/yui-min.js&3.5.0pr1/build/loader/loader-min.js"></script> 
        -->
        <!-- Self hosted -->
        <script type="text/javascript" src="lib/yui3/build/yui/yui.js"></script> 
        <script type="text/javascript" src="lib/yui3/build/loader/loader.js"></script>

        <!-- inputEx Base -->
        <script src="lib/inputex/build/loader.js"  type='text/javascript'></script>

        <!-- Atmosphere jquery -->
        <script type="text/javascript" src="jquery/jquery-1.6.4.js"></script>
        <!-- <script type="text/javascript" src="jquery/jquery.form.js"></script>-->
        <script type="text/javascript" src="jquery/jquery.atmosphere.js"></script>


        <script type="text/javascript" >
            YUI_config.groups.inputex.base = 'lib/inputex/build/';		// Hack fix inputex loading path so it uses local files
	    
            var Config = {
                base : 'http://localhost:8080/Wegas/',
                layoutSrc: 'data/editor-layout.json',
                lang : 'en-US',
                debug : true,
                currentGameModel: 1,
                currentTeamId: 1,
                currentUserId: 1,
                css: ['wegas-projectmanagementgame/assets/wegas-projectmanagementgame.css'],
                dataSources: {
                    gameModel: {
                        source: "rs/gm",
                        plugins: [
                            {
                                fn: "DataSourceJSONSchema", 
                                cfg: {
                                    schema: {
                                        resultListLocator: ".",
                                        resultFields: ["name", "id", "@class", "errors"]
                                    }
                                }
                            }, { fn: "DataSourceREST" }
                        ]
                    },
                    "User": {
                        source: "rs/user",
                        plugins: [
                            {
                                fn: "DataSourceJSONSchema", 
                                cfg: {
                                    schema: {
                                        resultListLocator: "."
                                    }
                                }
                            }, { fn: "DataSourceREST" }
                        ]
                    },
                    "Team": {
                        source: "rs/gm/1/team",
                        plugins: [
                            {
                                fn: "DataSourceJSONSchema", 
                                cfg: {
                                    schema: {
                                        resultListLocator: "."
                                    }
                                }
                            }, { fn: "DataSourceREST" }
                        ]
                    },
                    "VariableDescriptor": {
                        source: "rs/gm/1/vardesc",
                        plugins: [
                            {
                                fn: "DataSourceJSONSchema", 
                                cfg: {
                                    schema: {
                                        resultListLocator: "."
                                    }
                                }
                            }, { fn: "DataSourceVariableDescriptorREST" }
                        ]
                    }
                },
		
                loggedIn : true,
                forms: {

                    /*********************************************************** Types Forms */

                    "GameModel" : [ 
                        { name: 'id', label:'Id', type: 'hidden'/*, required: true*/ },
                        { name: 'name', label:'Name'},
                        { name: '@class', value:'GameModel', type: 'hidden'}
                    ],
                    "Team" : [ 
                        { name: 'id', label:'Id', type: 'hidden'},
                        { name: '@class', value:'Team', type: 'hidden'},
                        { name: 'name', label:'Name'},
                        // { name: 'token', label:'Token'},
                    ],
                    "VariableDescriptor" : [
                        { name: 'id', label:'Id', type: 'hidden'},
                        { name: '@class', type: 'hidden', value: 'StringVariableDescriptor'},
                        { name: 'name', label:'Name'},
                        { name: 'scope', type:'group', fields: [
                                { name: 'id', label:'Id', type: 'hidden'},
                                { type: 'select', 
                                    name: '@class',
                                    label: 'Variable is',
                                    choices: [
                                        { value: "UserScope", label: 'different for each user' }, 
                                        { value: "TeamScope", label: 'different for each team' }, 
                                        { value: "GameScope", label: 'the same for everybody' }
                                    ]
                                }
                            ]},
                        { type: 'select', 
                            name: '@class',
                            label: 'Variable is',
                            choices: [
                                { value: "StringVariableDescriptor", label: 'a string' },
                                { value: "ListVariableDescriptor", label: 'a list of variables'}
                            ],
                            interactions: [
                                {
                                    valueTrigger: "StringVariableDescriptor",
                                    actions: [
                                        { id: "defaultStringVariableInstance", action: "show" },
                                        { id: "defaultListVariableInstance", action: "hide" }
                                    ]
                                },
                                {
                                    valueTrigger: "ListVariableDescriptor",
                                    actions: [
                                        { id: "defaultListVariableInstance", action: "show" },
                                        { id: "defaultStringVariableInstance", action: "hide" }
                                    ]
                                }
                            ]
                        },
                        { name:'defaultStringVariableInstance', type:'group', fields: [
                                { name: '@class', value:'StringVariableInstance', type: 'hidden'},
                                { name: 'id', label:'Id', type: 'hidden'},
                                { name: 'content', label: 'DefaultValue'}
                            ]},
                        { name:'defaultListVariableInstance', type:'group', fields: [
                                { name: '@class', value:'ListVariableInstance', type: 'hidden'},
                                { name: 'id', label:'Id', type: 'hidden'}
                            ]}
                    ],
                    "StringVariableDescriptor" : [
                        { name: 'id', label:'Id', type: 'hidden'},
                        { name: '@class', type: 'hidden', value: 'StringVariableDescriptor'},
                        { name: 'name', label:'Name'},
                        { name: 'scope', type:'group', fields: [
                                { name: 'id', label:'Id', type: 'hidden'},
                                { name: '@class', value:'UserScope', type: 'hidden'}
                            ]},
                        { name: 'defaultVariableInstance', type:'group', fields: [
                                { name: '@class', value:'StringVariableInstance', type: 'hidden'},
                                { name: 'id', label:'Id', type: 'hidden'},
                                { name: 'content', label: 'DefaultValue'}
                            ]}
                    ],
                    
                    "StringVariableInstance" : [
                        { name: 'id', type: 'hidden'},
                        { name: '@class', type: 'hidden', value: 'StringVariableInstance'},
                        { name: 'content', label:'Value'}
                    ],
                    "User" : [ 
                        { name: 'id', label:'Id', type: 'hidden'},
                        { name: 'name', label:'Name'},
                        { name: 'email', label:'E-mail'},
                        { name: 'password', type: 'password', label: 'New password', showMsg: true,  id: 'firstPassword', strengthIndicator: true, capsLockWarning: true },
                        { type: 'password', label: 'Confirmation', showMsg: true, confirm: 'firstPassword' },
                        { name: '@class', label:'Class', type: 'hidden'}
                    ],
                    "VarDesc" : [ 
                        { name: 'id', label:'Id', required: true },
                        { name: 'name', label:'Name'},
                        { name: '@class', label:'Class'},
                        {type: 'group',
                            name: 'cardinality',
                            label: 'cardinality',
                            fields: [
                                { name: '@class', label:'Cardinality class'},
                                { name: 'enumName', label:'Cardinality enum name', invite:"optional"},
                            ]
                        }
                    ],
                    "Var" : [
                        { name: 'id', label:'Id', required: true },
                        { name: 'name', label:'Name'},
                        { name: '@class', label:'Class'},
                        { type: 'list',
                            name: 'instanceIndex', 
                            listLabel: 'Items',
                            elementType: 
                                {type: 'group',
                                fields: [
                                    { name: '@class', label:'Instance class'},
                                    { name: 'id', label:'Instance id', invite:"optional"},
                                    { name: 'name', label:'Instance name', invite:"optional"},
                                ]
                            }	
                        }
                    ],
                    "Integer" : [ 
                        { name: 'id', label:'Id', required: true },
                        { name: 'name', label:'Name'},
                        { name: 'min', label:'Min'},
                        { name: 'max', label:'Max'}, 
                        { name: 'minIncluded', label:'minIncluded', type: 'boolean'}, 
                        { name: 'maxIncluded', label:'maxIncluded', type: 'boolean'}, 
                        { name: 'default', label:'default'},
                        { name: '@class', label:'Class'}
                    ],
                    "String" : [ 
                        { name: 'id', label:'Id', required: true },
                        { name: 'name', label:'Name'},
                        { name: 'pattern', label:'pattern'},
                        { name: '@class', label:'Class'}
                    ],
                    "Text" : [ 
                        { name: 'id', label:'Id', required: true },
                        { name: 'name', label:'Name'},
                        { name: '@class', label:'Class'}
                    ],
                    "Enum" : [ 
                        { name: 'id', label:'Id', required: true },
                        { name: 'name', label:'Name'},
                        { type: 'list',
                            name: 'items', 
                            listLabel: 'Items',
                            elementType: {
                                type: 'group',
                                name: 'fields',
                                //collapsible: true,
                                //legend: 'Phone number',
                                fields: [
                                    { name: 'id', label:'Item id', required: true },
                                    { name: 'name', label:'Item name'},
                                    { name: '@class', label:'Class', value: "EnumItem"}
                                ]
                            }
                        },
                        { name: '@class', label:'Class'}
                    ],
                    "Double" : [ 
                        { name: 'id', label:'Id', required: true },
                        { name: 'name', label:'Name'},
                        { name: '@class', label:'Class'}
                    ],
                    "Boolean" : [ 
                        { name: 'id', label:'Id', required: true },
                        { name: 'name', label:'Name'},
                        { name: '@class', label:'Class'}
                    ],
                    "Media" : [ 
                        { name: 'id', label:'Id', required: true },
                        { name: 'name', label:'Name'},
                        { name: 'mediaType', label:'mediaType'},
                        { name: '@class', label:'Class'}
                    ],
                    "Complex" : [ 
                        { name: 'id', label:'Id', required: true },
                        { name: 'name', label:'Name'},
                        { name: '@class', label:'Class'}
                    ],

                    /*********************************************************** Widgets Forms */
                    AlbaPageWidget: [
                        { name: 'id', label: 'ID', required: true },
                        { name: 'name', label: 'Name'},
                        /*{ name: 'uri', label: 'Uri'},*/
                        { name: 'type', value:'AlbaPageWidget', type: 'hidden'},
                        { name: 'cssClass', label: 'CSS class'}
                    ],
                    AlbaStateMachine: [
                        { name: 'id', label: 'ID', required: true },
                        { name: 'name', label: 'Name'},
                        { name: 'type', value:'AlbaStateMachine', type: 'hidden'}
                    ],
                    AlbaState: [ 
                        { name: 'id', label: 'ID', required: true },
                        { name: 'name', label: 'Name'},
                        { name: 'active', type:'boolean', label: 'Active'},
                        { name: 'enterAction', type:'text', label: 'On node enter', rows: 3, cols: 60},
                        { name: 'exitAction', type:'text', label: 'On node exit', rows: 3, cols: 60},
                        { name: 'type', value:'AlbaState', type: 'hidden'}
                        /*
                        { name: 'condition', type:'text', label: 'Condition', rows: 3, cols: 60},
                        { name: 'text',  type:'text', label: 'Description', cols: 60},
                        {type: 'select', label: 'Title', name: 'title', choices: ['Mr','Mrs','Ms'] },
                        {type:'email', label: 'Email', name: 'email'},
                        {type:'url', label: 'Website',name:'website'},
                        {type:'datetime', label: 'Date', name: 'date'},
                        {type:'colorpicker', label: 'Color', name: 'color'},
                        {type:'html', label: 'Text', name: 'any'},
                        {type: 'list', label: 'Test',	listLabel: 'Websites', elementType: { type: 'select', choices:  ['http://www.neyric.com', 'http://www.ajaxian.com', 'http://www.google.com', 'http://www.yahoo.com', 'http://javascript.neyric.com/blog', 'http://javascript.neyric.com/wireit', 'http://neyric.github.com/inputex']	}, value: ['http://www.neyric.com', 'http://www.ajaxian.com', 'http://www.google.com', 'http://www.yahoo.com'], useButtons: true  }
                         */
                    ],
                    AlbaTransition: [
                        { name: 'inputTrigger', label: 'Triggering link element',  metatype: 'widgetselect', targetType: 'AlbaLinkWidget,AlbaProjectTab'},
                        { name: 'transitionCondition', type:'text', label: 'Transition condition',rows: 3, cols: 60},
                        { name: 'transitionAction', type:'text', label: 'On transition', rows: 8, cols: 60},
                        { name: 'type', value:'AlbaTransition', type: 'hidden'}

                    ],
                    AlbaVariable: [
                        { name: 'id', label: 'ID', required: true },
                        // name: 'name', label: 'Nom', required: true },
                        { name: 'value', label: 'Valeur', required: true },
                        { name: 'type', value:'AlbaVariable', type: 'hidden'}
                    ],
                    AlbaText: [
                        { name: 'id', label: 'ID', required: true },
                        { name: 'text', label: 'Texte', type: 'html', opts: {width:'100%'} },
                        //	{ name: 'text', type:'text', label: 'Texte',rows: 8, cols: 60}
                        { name: 'type', value:'AlbaText', type: 'hidden'}
                    ],

                    /***************************************************************************** WIDGETS FORMS *******************************/
                    AlbaListWidget: [
                        { name: 'id', label: 'ID', required: true },
                        { name: 'direction', label: 'Direction', type: 'select', choices: [  
                                { value: 'vertical', label: 'Vertical' }, 
                                { value: 'horizontal', label: 'Horizontal' } 
                            ] }, 
                        { name: 'cssClass', label: 'CSS class'},
                        { name: 'type', value:'AlbaListWidget', type: 'hidden'}
                    ],
                    AlbaVariableWidget: [
                        { name: 'id', label: 'ID', required: true },
                        { name: 'label', label: 'Label'},
                        { name: 'variable', label: 'Target variable'},		
                        { name: 'view', label: 'Display mode', type: 'select', choices: [  
                                { value: 'text', label: 'Text' }, 
                                { value: 'button', label: 'Boxes' } 
                            ] }, 
                        { name: 'cssClass', label: 'CSS class'},
                        { name: 'type', value:'AlbaVariableWidget', type: 'hidden'}
                    ],
                    AlbaLinkWidget: [
                        { name: 'id', label: 'ID', required: true },
                        /*{ name: 'name', label: 'Name'},*/
                        { name: 'label', label: 'Label'},
                        { name: 'targetArea', label: 'Targeted dynamic area element', metatype: 'widgetselect', targetType: 'AlbaDisplayAreaWidget' },
                        { name: 'targetSubpageId', label: 'Page fragment to display', metatype: 'subpageselect'},
                        /*{ name: 'isStoryEvent', label: 'Sends story event', type: 'boolean'},*/
                        { name: 'inputAction', label: 'On click', type:'text', rows: 8, cols: 60 },
                        { name: 'view', label: 'Display mode', type: 'select', choices: [  
                                { value: 'text', label: 'Text' }, 
                                { value: 'button', label: 'Button' } 
                            ] }, 
                        { name: 'cssClass', label: 'CSS class'},
                        { name: 'type', value:'AlbaLinkWidget', type: 'hidden'}
                    ],
                    AlbaTextWidget: [
                        { name: 'id', label: 'ID', required: true },
                        //{ name: 'content', label: 'Content', type: 'text'},
                        { name: 'content', label: 'Content', type: 'html', opts: {width:'100%'} },
                        { name: 'cssClass', label: 'CSS class'},
                        { name: 'type', value:'AlbaTextWidget', type: 'hidden'}
                    ],
                    AlbaDisplayAreaWidget:[
                        { name: 'id', label: 'ID', required: true },
                        { name: 'cssClass', label: 'CSS class'},
                        { name: 'type', value:'AlbaDisplayAreaWidget', type: 'hidden'}
                    ],
                    AlbaTabView: [
                        { name: 'id', label: 'ID', required: true },
                        { name: 'cssClass', label: 'CSS class'},
                        { name: 'type', value:'AlbaTabView', type: 'hidden'}
                    ],
                    AlbaTab: [
                        { name: 'id', label: 'ID', required: true },
                        { name: 'cssClass', label: 'CSS class'},
                        { name: 'type', value:'AlbaTab', type: 'hidden'}
                    ],
                    AlbaProjectTab: [
                        { name: 'id', label: 'ID', required: true },
                        /*{ name: 'name', label: 'Nom', required: true },*/
                        { name: 'label', label: 'Label', required: true },
                        //{ name: 'text', label: 'Texte', type:'text', rows: 8, cols: 60 },
                        { name: 'text', label: 'Texte',  type: 'html', opts: {width:'100%'} },

                        { name: 'inputAction', label: 'On click', type:'text', rows: 8, cols: 60 },
                        { name: 'cssClass', label: 'CSS class'},
                        { name: 'type', value:'AlbaProjectTab', type: 'hidden'}
                    ]
                }
                
		
                // DEPRECATED FROM HERE
                /*gameDesigns: [
                    { name: 'Empty Project', scenarios: ["Default"], dataSrc: './data/alba-emptyproject-data.json', url: './alba-prototype-emptyproject.html'},
                    { name: 'Alba-ProjectManagment', scenarios: ["Artos"], dataSrc: './data/alba-project-data.json', url: './alba-prototype-projectmanagment.html'},
                    { name: 'Alba-Ladder&Snakes', scenarios: ["Default"], dataSrc: './data/alba-laddergame-data.json', url: './alba-prototype-ladder&snakes.html'}
                ],*/
            }
               
        </script> 

        <script type="text/javascript" src="wegas-base/js/wegas-bootstrap.js"></script>

    </body>
</html> 

