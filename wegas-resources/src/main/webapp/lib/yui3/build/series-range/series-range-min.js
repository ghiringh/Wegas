/*
YUI 3.10.1 (build 8bc088e)
Copyright 2013 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/

YUI.add("series-range",function(e,t){function n(){n.superclass.constructor.apply(this,arguments)}n.NAME="rangeSeries",n.ATTRS={type:{value:"range"},ohlckeys:{valueFn:function(){return{open:"open",high:"high",low:"low",close:"close"}}}},e.extend(n,e.CartesianSeries,{drawSeries:function(){var e=this.get("xcoords"),t=this.get("ycoords"),n=this.get("styles"),r=n.padding,i=e.length,s=this.get("width")-(r.left+r.right),o=this.get("ohlckeys"),u=t[o.open],a=t[o.high],f=t[o.low],l=t[o.close],c=s/i,h=c/2;this._drawMarkers(e,u,a,f,l,i,c,h,n)}}),e.RangeSeries=n},"3.10.1",{requires:["series-cartesian"]});
