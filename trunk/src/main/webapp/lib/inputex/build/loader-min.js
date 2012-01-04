YUI().use(function(e){var a={groups:{inputex:{base:"inputex/src/",combine:false,modules:{inputex:{requires:["node","intl"],skinnable:true,lang:["en","fr","de","es","fr","it","nl"]},"inputex-field":{requires:["inputex"]},"inputex-visus":{requires:["inputex","dump"]},"inputex-jsonschema":{requires:["inputex"]},"inputex-rpc":{requires:["json","inputex","io","inputex-jsonschema","jsonp"]},"inputex-smdtester":{requires:["inputex-rpc","inputex-jsontreeinspector"]},"inputex-choice":{requires:["inputex"]},"inputex-base":{requires:["inputex","widget","widget-stdmod"]},"inputex-panel":{requires:["inputex","panel","inputex-base"]},"inputex-datatable":{requires:["inputex-group","inputex-panel","datatable"]},"inputex-jsontreeinspector":{requires:["inputex"],skinnable:true},"inputex-button":{requires:["inputex"]},"inputex-group":{requires:["inputex-field"],ix_provides:"group"},"inputex-form":{requires:["io-base","inputex-group","json","inputex-button"],ix_provides:"form"},"inputex-list":{requires:["inputex-field","anim"],skinnable:true,ix_provides:"list"},"inputex-tree":{requires:["inputex-string","inputex-list","inputex-inplaceedit"],ix_provides:"tree"},"inputex-combine":{requires:["inputex-group"],ix_provides:"combine"},"inputex-inplaceedit":{requires:["inputex-field","inputex-button","anim","inputex-visus"],ix_provides:"inplaceedit"},"inputex-lens":{requires:["inputex-group","inputex-inplaceedit"],ix_provides:"lens"},"inputex-serialize":{requires:["inputex-string","json"],ix_provides:"serialize"},"inputex-object":{requires:["inputex-list","inputex-combine","inputex-string"],ix_provides:"object"},"inputex-string":{requires:["inputex-field","event-key"],ix_provides:"string"},"inputex-uppercase":{requires:["inputex-string"],ix_provides:"uppercase"},"inputex-autocomplete":{requires:["inputex-string","autocomplete","autocomplete-filters","autocomplete-highlighters","datasource"],ix_provides:"autocomplete"},"inputex-checkbox":{requires:["inputex-field"],ix_provides:"boolean"},"inputex-color":{requires:["inputex-field","node-event-delegate","overlay"],skinnable:true,ix_provides:"color"},"inputex-colorpicker":{requires:["inputex-field","yui2-colorpicker","yui2-container","yui2-menu","yui2-button"],skinnable:true,ix_provides:"colorpicker"},"inputex-date":{requires:["inputex-string"],ix_provides:"date"},"inputex-datepicker":{requires:["inputex-date","node-event-delegate","overlay","calendar"],ix_provides:"datepicker"},"inputex-dateselectmonth":{requires:["inputex-combine"],ix_provides:"dateselectmonth"},"inputex-integer":{requires:["inputex-string"],ix_provides:"integer"},"inputex-datesplit":{requires:["inputex-combine","inputex-integer"],ix_provides:"datesplit"},"inputex-select":{requires:["inputex-field","inputex-choice"],ix_provides:"select"},"inputex-time":{requires:["inputex-combine","inputex-select"],ix_provides:"time"},"inputex-datetime":{requires:["inputex-datepicker","inputex-combine","inputex-time"],ix_provides:"datetime"},"inputex-timeinterval":{requires:["inputex-combine","inputex-select"],ix_provides:"timeinterval"},"inputex-dsselect":{requires:["inputex-select","datasource"],ix_provides:"dsselect"},"inputex-email":{requires:["inputex-string"],ix_provides:"email"},"inputex-hidden":{requires:["inputex-field"],ix_provides:"hidden"},"inputex-keyvalue":{requires:["inputex-combine"],ix_provides:"keyvalue"},"inputex-keyopvalue":{requires:["inputex-keyvalue"],ix_provides:"keyopvalue"},"inputex-multiautocomplete":{requires:["inputex-autocomplete","json","sortable"],ix_provides:"multiautocomplete"},"inputex-multiselect":{requires:["inputex-select","sortable"],ix_provides:"multiselect"},"inputex-number":{requires:["inputex-string"],ix_provides:"number"},"inputex-password":{requires:["inputex-string"],ix_provides:"password"},"inputex-radio":{requires:["selector","event-delegate","inputex-field","inputex-choice","inputex-string"],ix_provides:"radio"},"inputex-rte":{requires:["inputex-field","yui2-editor"],ix_provides:"html"},"inputex-slider":{requires:["inputex-field","slider"],ix_provides:"slider"},"inputex-textarea":{requires:["inputex-string"],ix_provides:"text"},"inputex-type":{requires:["inputex-field","inputex-group","inputex-select","inputex-list","inputex-string","inputex-checkbox","inputex-integer"],skinnable:true,ix_provides:"type"},"inputex-uneditable":{requires:["inputex-field","inputex-visus"],ix_provides:"uneditable"},"inputex-url":{requires:["inputex-string"],ix_provides:"url"},"inputex-dateselectmonth":{requires:["inputex-combine","inputex-string","inputex-select"],ix_provides:"dateselectmonth"},"inputex-ipv4":{requires:["inputex-string"],ix_provides:"ipv4"},"inputex-vector":{requires:["inputex-combine"],ix_provides:"vector"},"inputex-map":{requires:["inputex-field"],ix_provides:"map"},"inputex-ratingstars":{requires:["inputex-field"],skinnable:true,ix_provides:"ratingstars"},"inputex-ratingstarsform":{requires:["inputex-ratingstars","inputex-form"],ix_provides:"ratingstarsform"},"inputex-menu":{requires:["inputex-field","yui2-menu"],ix_provides:"menu"},"inputex-file":{requires:["inputex-field"],ix_provides:"file"},"inputex-tinymce":{requires:["inputex-field"],ix_provides:"tinymce"}}}}};if(typeof YUI_config==="undefined"){YUI_config={groups:{}}}e.mix(YUI_config.groups,a.groups);var c=YUI_config.groups.inputex.modules,f=[],d={};for(var b in c){if(c.hasOwnProperty(b)){f.push(b);if(c[b].ix_provides){d[c[b].ix_provides]=b}}}YUI_config.groups.inputex.allModules=f;YUI_config.groups.inputex.modulesByType=d});