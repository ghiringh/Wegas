/*
YUI 3.7.2 (build 5639)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
YUI.add("get",function(a){var j=require("path"),b=require("vm"),f=require("fs"),e=require("request"),g=f.existsSync||j.existsSync;a.Get=function(){};a.config.base=j.join(__dirname,"../");YUI.require=require;YUI.process=process;var i=function(k){return k.replace(/\\/g,"\\\\");};a.Get._exec=function(q,m,k){var p=i(j.dirname(m));var r=i(m);if(p.match(/^https?:\/\//)){p=".";r="remoteResource";}var n="(function(YUI) { var __dirname = '"+p+"'; "+"var __filename = '"+r+"'; "+"var process = YUI.process;"+"var require = function(file) {"+" if (file.indexOf('./') === 0) {"+"   file = __dirname + file.replace('./', '/'); }"+" return YUI.require(file); }; "+q+" ;return YUI; })";var l=b.createScript(n,m);var o=l.runInThisContext(n);YUI=o(YUI);k(null,m);};a.Get._include=function(n,k){var m=this;if(n.match(/^https?:\/\//)){var l={url:n,timeout:m.timeout};e(l,function(r,q,p){if(r){k(r,n);}else{a.Get._exec(p,n,k);}});}else{if(a.config.useSync){if(g(n)){var o=f.readFileSync(n,"utf8");a.Get._exec(o,n,k);}else{k("Path does not exist: "+n,n);}}else{f.readFile(n,"utf8",function(q,p){if(q){k(q,n);}else{a.Get._exec(p,n,k);}});}}};var d=function(l,m,k){if(a.Lang.isFunction(l.onEnd)){l.onEnd.call(a,m,k);}},h=function(k){if(a.Lang.isFunction(k.onSuccess)){k.onSuccess.call(a,k);}d(k,"success","success");},c=function(k,l){l.errors=[l];if(a.Lang.isFunction(k.onFailure)){k.onFailure.call(a,l,k);}d(k,l,"fail");};a.Get.js=function(u,v){var n=a.Array,t=this,r=n(u),k,p,o=r.length,q=0,m=function(){if(q===o){h(v);}};for(p=0;p<o;p++){k=r[p];if(a.Lang.isObject(k)){k=k.url;}k=k.replace(/'/g,"%27");a.Get._include(k,function(s,l){if(!a.config){a.config={debug:true};}if(v.onProgress){v.onProgress.call(v.context||a,l);}if(s){c(v,s);}else{q++;m();}});}};a.Get.script=a.Get.js;a.Get.css=function(l,k){h(k);};},"3.7.2",{requires:["yui-base"]});