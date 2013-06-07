/*
YUI 3.10.1 (build 8bc088e)
Copyright 2013 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/

if (typeof __coverage__ === 'undefined') { __coverage__ = {}; }
if (!__coverage__['build/anim-color/anim-color.js']) {
   __coverage__['build/anim-color/anim-color.js'] = {"path":"build/anim-color/anim-color.js","s":{"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0,"8":0,"9":0,"10":0,"11":0,"12":0,"13":0,"14":0,"15":0},"b":{"1":[0,0],"2":[0,0,0,0],"3":[0,0]},"f":{"1":0,"2":0,"3":0,"4":0,"5":0},"fnMap":{"1":{"name":"(anonymous_1)","line":1,"loc":{"start":{"line":1,"column":22},"end":{"line":1,"column":41}}},"2":{"name":"(anonymous_2)","line":12,"loc":{"start":{"line":12,"column":30},"end":{"line":13,"column":0}}},"3":{"name":"(anonymous_3)","line":29,"loc":{"start":{"line":29,"column":9},"end":{"line":29,"column":62}}},"4":{"name":"(anonymous_4)","line":34,"loc":{"start":{"line":34,"column":9},"end":{"line":34,"column":29}}},"5":{"name":"(anonymous_5)","line":47,"loc":{"start":{"line":47,"column":8},"end":{"line":47,"column":20}}}},"statementMap":{"1":{"start":{"line":1,"column":0},"end":{"line":53,"column":42}},"2":{"start":{"line":10,"column":0},"end":{"line":10,"column":17}},"3":{"start":{"line":12,"column":0},"end":{"line":26,"column":2}},"4":{"start":{"line":14,"column":4},"end":{"line":14,"column":62}},"5":{"start":{"line":15,"column":4},"end":{"line":15,"column":58}},"6":{"start":{"line":17,"column":4},"end":{"line":19,"column":5}},"7":{"start":{"line":18,"column":8},"end":{"line":18,"column":63}},"8":{"start":{"line":21,"column":4},"end":{"line":25,"column":23}},"9":{"start":{"line":28,"column":0},"end":{"line":39,"column":2}},"10":{"start":{"line":30,"column":8},"end":{"line":30,"column":95}},"11":{"start":{"line":35,"column":8},"end":{"line":35,"column":51}},"12":{"start":{"line":36,"column":8},"end":{"line":36,"column":67}},"13":{"start":{"line":37,"column":8},"end":{"line":37,"column":19}},"14":{"start":{"line":41,"column":0},"end":{"line":50,"column":2}},"15":{"start":{"line":48,"column":12},"end":{"line":48,"column":57}}},"branchMap":{"1":{"line":17,"type":"if","locations":[{"start":{"line":17,"column":4},"end":{"line":17,"column":4}},{"start":{"line":17,"column":4},"end":{"line":17,"column":4}}]},"2":{"line":17,"type":"binary-expr","locations":[{"start":{"line":17,"column":8},"end":{"line":17,"column":18}},{"start":{"line":17,"column":22},"end":{"line":17,"column":42}},{"start":{"line":17,"column":46},"end":{"line":17,"column":54}},{"start":{"line":17,"column":58},"end":{"line":17,"column":76}}]},"3":{"line":36,"type":"cond-expr","locations":[{"start":{"line":36,"column":40},"end":{"line":36,"column":60}},{"start":{"line":36,"column":63},"end":{"line":36,"column":66}}]}},"code":["(function () { YUI.add('anim-color', function (Y, NAME) {","","/**"," * Adds support for color properties in <code>to</code>"," * and <code>from</code> attributes."," * @module anim"," * @submodule anim-color"," */","","var NUM = Number;","","Y.Anim.getUpdatedColorValue = function(fromColor, toColor, elapsed, duration,  fn)","{","    fromColor = Y.Color.re_RGB.exec(Y.Color.toRGB(fromColor));","    toColor = Y.Color.re_RGB.exec(Y.Color.toRGB(toColor));","","    if (!fromColor || fromColor.length < 3 || !toColor || toColor.length < 3) {","        Y.error('invalid from or to passed to color behavior');","    }","","    return 'rgb(' + [","        Math.floor(fn(elapsed, NUM(fromColor[1]), NUM(toColor[1]) - NUM(fromColor[1]), duration)),","        Math.floor(fn(elapsed, NUM(fromColor[2]), NUM(toColor[2]) - NUM(fromColor[2]), duration)),","        Math.floor(fn(elapsed, NUM(fromColor[3]), NUM(toColor[3]) - NUM(fromColor[3]), duration))","    ].join(', ') + ')';","};","","Y.Anim.behaviors.color = {","    set: function(anim, att, from, to, elapsed, duration, fn) {","        anim._node.setStyle(att, Y.Anim.getUpdatedColorValue(from, to, elapsed, duration, fn));","    },","","    // TODO: default bgcolor const","    get: function(anim, att) {","        var val = anim._node.getComputedStyle(att);","        val = (val === 'transparent') ? 'rgb(255, 255, 255)' : val;","        return val;","    }","};","","Y.each(['backgroundColor',","        'borderColor',","        'borderTopColor',","        'borderRightColor',","        'borderBottomColor',","        'borderLeftColor'],","        function(v) {","            Y.Anim.behaviors[v] = Y.Anim.behaviors.color;","        }",");","","","}, '3.10.1', {\"requires\": [\"anim-base\"]});","","}());"]};
}
var __cov_4lkXVKJvhKUU$6wddd5n2Q = __coverage__['build/anim-color/anim-color.js'];
__cov_4lkXVKJvhKUU$6wddd5n2Q.s['1']++;YUI.add('anim-color',function(Y,NAME){__cov_4lkXVKJvhKUU$6wddd5n2Q.f['1']++;__cov_4lkXVKJvhKUU$6wddd5n2Q.s['2']++;var NUM=Number;__cov_4lkXVKJvhKUU$6wddd5n2Q.s['3']++;Y.Anim.getUpdatedColorValue=function(fromColor,toColor,elapsed,duration,fn){__cov_4lkXVKJvhKUU$6wddd5n2Q.f['2']++;__cov_4lkXVKJvhKUU$6wddd5n2Q.s['4']++;fromColor=Y.Color.re_RGB.exec(Y.Color.toRGB(fromColor));__cov_4lkXVKJvhKUU$6wddd5n2Q.s['5']++;toColor=Y.Color.re_RGB.exec(Y.Color.toRGB(toColor));__cov_4lkXVKJvhKUU$6wddd5n2Q.s['6']++;if((__cov_4lkXVKJvhKUU$6wddd5n2Q.b['2'][0]++,!fromColor)||(__cov_4lkXVKJvhKUU$6wddd5n2Q.b['2'][1]++,fromColor.length<3)||(__cov_4lkXVKJvhKUU$6wddd5n2Q.b['2'][2]++,!toColor)||(__cov_4lkXVKJvhKUU$6wddd5n2Q.b['2'][3]++,toColor.length<3)){__cov_4lkXVKJvhKUU$6wddd5n2Q.b['1'][0]++;__cov_4lkXVKJvhKUU$6wddd5n2Q.s['7']++;Y.error('invalid from or to passed to color behavior');}else{__cov_4lkXVKJvhKUU$6wddd5n2Q.b['1'][1]++;}__cov_4lkXVKJvhKUU$6wddd5n2Q.s['8']++;return'rgb('+[Math.floor(fn(elapsed,NUM(fromColor[1]),NUM(toColor[1])-NUM(fromColor[1]),duration)),Math.floor(fn(elapsed,NUM(fromColor[2]),NUM(toColor[2])-NUM(fromColor[2]),duration)),Math.floor(fn(elapsed,NUM(fromColor[3]),NUM(toColor[3])-NUM(fromColor[3]),duration))].join(', ')+')';};__cov_4lkXVKJvhKUU$6wddd5n2Q.s['9']++;Y.Anim.behaviors.color={set:function(anim,att,from,to,elapsed,duration,fn){__cov_4lkXVKJvhKUU$6wddd5n2Q.f['3']++;__cov_4lkXVKJvhKUU$6wddd5n2Q.s['10']++;anim._node.setStyle(att,Y.Anim.getUpdatedColorValue(from,to,elapsed,duration,fn));},get:function(anim,att){__cov_4lkXVKJvhKUU$6wddd5n2Q.f['4']++;__cov_4lkXVKJvhKUU$6wddd5n2Q.s['11']++;var val=anim._node.getComputedStyle(att);__cov_4lkXVKJvhKUU$6wddd5n2Q.s['12']++;val=val==='transparent'?(__cov_4lkXVKJvhKUU$6wddd5n2Q.b['3'][0]++,'rgb(255, 255, 255)'):(__cov_4lkXVKJvhKUU$6wddd5n2Q.b['3'][1]++,val);__cov_4lkXVKJvhKUU$6wddd5n2Q.s['13']++;return val;}};__cov_4lkXVKJvhKUU$6wddd5n2Q.s['14']++;Y.each(['backgroundColor','borderColor','borderTopColor','borderRightColor','borderBottomColor','borderLeftColor'],function(v){__cov_4lkXVKJvhKUU$6wddd5n2Q.f['5']++;__cov_4lkXVKJvhKUU$6wddd5n2Q.s['15']++;Y.Anim.behaviors[v]=Y.Anim.behaviors.color;});},'3.10.1',{'requires':['anim-base']});
