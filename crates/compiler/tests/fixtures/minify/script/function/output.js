//index.js:
 window['__farm_default_namespace__'] = {__FARM_TARGET_ENV__: 'browser'};var e,s;e=(e,s)=>{"use strict";console.log("runtime/index.js"),window.__farm_default_namespace__.__farm_module_system__.setPlugins([]);},()=>(s||(s={exports:{}},"function"==typeof e?e(s,s.exports):e[Object.keys(e)[0]](s,s.exports)),s.exports);(function(_){for(var r in _){_[r].__farm_resource_pot__='index_ddf1.js';window['__farm_default_namespace__'].__farm_module_system__.register(r,_[r])}})({"05ee5ec7":function t(t,e,n,i){function h(t){return"number"==typeof t&&!isNaN(t);}function r(t,e,n,i){var r=n,a=i;if(e){var d,o=(d=getComputedStyle(t),{width:(t.clientWidth||parseInt(d.width,10))-parseInt(d.paddingLeft,10)-parseInt(d.paddingRight,10),height:(t.clientHeight||parseInt(d.height,10))-parseInt(d.paddingTop,10)-parseInt(d.paddingBottom,10)});r=o.width?o.width:r,a=o.height?o.height:a;}return{width:Math.max(h(r)?r:1,1),height:Math.max(h(a)?a:1,1)};}function a(t){var e=t.parentNode;e&&e.removeChild(t);}t._m(e),t.o(e,"getChartSize",function(){return r;}),t.o(e,"removeDom",function(){return a;});},"b5d64806":function e(e,o,c,m){e._m(o);var n=c("05ee5ec7");console.log(n.getChartSize,n.removeDom);},});window['__farm_default_namespace__'].__farm_module_system__.setInitialLoadedResources([]);window['__farm_default_namespace__'].__farm_module_system__.setDynamicModuleResourcesMap([],{  });var farmModuleSystem = window['__farm_default_namespace__'].__farm_module_system__;farmModuleSystem.bootstrap();var entry = farmModuleSystem.require("b5d64806");
