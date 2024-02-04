!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?module.exports=e():"function"==typeof define&&define.amd?define(e):(t="undefined"!=typeof globalThis?globalThis:t||self).fsm=e()}(this,(function(){"use strict";function t(t){let o,r=!1;return t?(o=function(t){let o=t.map((t=>e())),r=o.map((t=>t.promise));return o.promises=r,o.onComplete=n(Promise.all(r)),o}(t),r=!0):o=e(),o.timeout=function(t,e){let o;return o=t?Promise.all(e.promises):e.promise,function(t,r){let a,s=new Promise(((e,n)=>{a=setTimeout((()=>{e(r),Promise.resolve(o)}),t)}));return o.then((()=>clearTimeout(a))),e.onComplete=n(Promise.race([o,s])),e}}(r,o),o}function e(){let t,e;const o=new Promise(((n,o)=>{t=n,e=o}));return{promise:o,done:t,cancel:e,onComplete:n(o)}}function n(t){return function(e){t.then((t=>e(t)))}}function o(t){return null==t||t.nodeType?"simple":t instanceof Array?"array":"object"==typeof t?"object":"simple"}function r(t,e,n,r,s,...c){let[i,u]=r;Object.keys(t).forEach((l=>{let f=o(t[l]),d=t[l],p="array"===o(e),h=!isNaN(l),m=Symbol("ignore___");if("simple"!==f&&u){if(d=u({value:d,key:l,breadcrumbs:`${s}/${l}`,IGNORE:m},...c),d===m)return;f=o(d)}if("simple"===f){if(!i)return void(e[l]=d);let t=i({value:d,key:l,breadcrumbs:`${s}/${l}`,IGNORE:m},...c);if(t===m)return;const n=function(t,e){return e instanceof Array&&!isNaN(t)}(l,e);n?e.push(t):e[l]=t}if("object"===f){const t={};p&&h?e.push(t):e[l]=t,n.push(a(d,t,n,r,`${s}/${l}`,c))}if("array"===f){const t=[];p&&h?e.push(t):e[l]=t,n.push(a(d,t,n,r,`${s}/${l}`,c))}}))}function*a(t,e,n,o,a,s){yield r(t,e,n,o,a,...s)}function s({data:t,keyCallback:e,objectCallback:n},...a){let s,c=[],i="root",u=[e,n];switch(o(t)){case"array":s=[],r(t,s,c,u,i,...a);break;case"object":s={},r(t,s,c,u,i,...a);break;case"simple":return t}for(const t of c)t.next();return s}function c(t,e){return function(n,o){const{convert:r,isDTO:a,isDTM:s,walk:c}=t();let i,u;a(o)?(i=o.export(),u=o.copy()):s(o)?(i=c({data:o}),u=c({data:o})):([u,,i]=r.from("std").toFlat(t,o),console.warn('A non "dt-object" data segment was inserted. Autoconverted to "dt-object".'));const l=new RegExp("^root/");i.forEach((t=>{t[0]===t[2]&&(t[0]=n,t[2]=n),t[2]=t[2].replace(l,`${n}/`),t[3].forEach(((e,o)=>t[3][o]=e.replace(l,`${n}/`)))})),e.insert([u,,i])}}function i(t,e){return t=>e.export(t)}function u(t,e){return function(n="root"){const o=e.getCopy(n),{walk:r}=t();return o?r({data:o}):null}}function l(t,e,n){return function(){let o=[],r={};const{convert:a,draft:s,INIT_DATA_TYPES:c,main:{load:i}}=t(),u={set:s.set(o,r),connect:s.connect(r),save:s.save(r),push:s.push(r)},[l,...f]=arguments,{as:d}=l({...n,...u},...f)||{},p=0===o.length?e.export():o,h=!!d&&c.includes(d);let m;return"dt-object"===d?i(p):d&&!h?(console.error(`Model '${d}' is unknown data-model.`),null):(m=d?a.to(d,t,p):i(p),e.resetScan(),m)}}function f(t,e,n){return function(){const{main:{load:o},draft:r}=t(),[a,...s]=arguments;let c=[],i={};const u={set:r.set(c,i),connect:r.connect(i),save:r.save(i),push:r.push(i)};return a({...n,...u},...s),e.resetScan(),0===c.length?this:o(c)}}function d(t){return function(e,n){t.setupFilter(e,n)}}function p(t,e){const{flatData:n}=t(),[o,r]=n(t,e),a={insertSegment:c(t,o),export:i(0,o),copy:u(t,o),model:l(t,o,r),query:f(t,o,r),setupFilter:d(o),listSegments:()=>Object.keys(o.getIndexes()).reduce(((t,e)=>(e.includes("/")||t.push(e),t)),[]),index:s};function s(t){if(null==t)return null;let e=o.getLine(t);if(e){let t,[n,o,r,a]=e;return t=o instanceof Array?[...o]:{...o},[n,t,r,[...a]]}return null}return a.extractList=function(t,e,n){return function(o,r){const a=n("root"),{main:{load:s},INIT_DATA_TYPES:c}=t(),i=[...c,"dt-object"];let u=!1,l="";if(r&&(r.as||(u=!0,l='Options should be an object and property "as" is required'),u||i.includes(r.as)||(u=!0,l=`Invalid option "as" value: ${r.as}.`),u))throw new Error(l);return o.map((t=>{let n=e.export(t);return 0===n.length?a[1].hasOwnProperty(t)?a[1][t]:null:n})).map((t=>null==t?null:t instanceof Array?s(t).model((()=>r)):t))}}(t,o,s),a}function h(t,e,n){return function(o){const[r,,a]=o,s=a[0][0],[c,i,u]=t,l=n();c[s]=r,a.forEach((t=>{const[,,n]=t;i[n]=t,u.push(t),l.forEach((n=>e(n,t)))}))}}function m(t){return function(e){const[,n,o]=t;if(e&&!n[e])return[];if(!e){const t=[];return o.forEach((e=>{const[n,o,r,a]=e,s=o instanceof Array?[...o]:{...o};t.push([n,s,r,[...a]])})),t}const r=[];return o.forEach((t=>{const[n,o,a,s]=t,c=new RegExp(`^${e}/`);if(a===e||a.match(c)){let t=n===a?"root":n,e=o instanceof Array?[...o]:{...o},i=a.includes("/")?a.replace(c,"root/"):"root",u=s.map((t=>t.replace(c,"root/")));r.push([t,e,i,u])}})),r}}function b(t,e,n,o){return function(r,a){const s=o(),[,,c]=t;if(s.includes(r))return console.error(`Filter name "${r}" is already defined`),this;e[r]=a,c.forEach((t=>n(r,t)))}}function y(t){return function(e){const n=t.getIndexes(),o=n[e],r=[];return o?(r.push(o),g(n,r,o[3]),t.setupScanList(r),this):(t.setupScanList([]),this)}}function g(t,e,n){n.forEach((n=>{const o=t[n];o&&(e.push(o),g(t,e,o[3]))}))}function _(t){return function(e){const n=[];return t.getScanList().forEach((t=>{t[0]===e&&n.push(t)})),t.setupScanList(n),this}}function $(t){return function(e){const n=[],o=e instanceof Array?e:[e];return t.getScanList().forEach((t=>{const e=t[0];o.forEach((o=>{e.includes(o)&&n.push(t)}))})),t.setupScanList(n),this}}function k(t){return function(e){t.getScanList().forEach((n=>{const[o,r,a,s]=n,c=r instanceof Array,i=()=>"$__NEXT__LOOK_",u=()=>"$__FINISH__WITH__THE__LOOKING_";let l=!1;const f=s.map((t=>{let e=t.replace(`${a}/`,"");return[o,e]}));if(c)0===r.length?d([]):r.every(((t,n)=>{if(l)return!1;const s=e({value:t,key:n,name:o,flatData:r,breadcrumbs:a,links:f,next:i,finish:u});return"$__FINISH__WITH__THE__LOOKING_"===s&&(l=!0),!["$__FINISH__WITH__THE__LOOKING_","$__NEXT__LOOK_"].includes(s)}));else{const t=Object.entries(r);0===t.length?d({}):t.every((([t,n])=>{if(l)return!1;const s=e({value:n,key:t,name:o,flatData:r,breadcrumbs:a,links:f,next:i,finish:u});return"$__FINISH__WITH__THE__LOOKING_"===s&&(l=!0),!["$__FINISH__WITH__THE__LOOKING_","$__NEXT__LOOK_"].includes(s)}))}function d(t){e({value:null,key:null,name:o,flatData:t,breadcrumbs:a,links:f,empty:!0,next:i,finish:u})}t.resetScan()}))}}function E(t){return function(e){const n=[];return t.getScanList().every((t=>t[2]!==e||(n.push(t),!1))),t.setupScanList(n),this}}function j({flatData:t}){return t instanceof Array}function S({name:t,flatData:e}){return!(e instanceof Array||isNaN(t))}function v({flatData:t}){return!(t instanceof Array)}function O({name:t,breadcrumbs:e}){return t===e}function x(t,e){const[n,o,r]=e,a=[n,o,r],s={},c={list:j,listObject:S,object:v,root:O};let i=r;const u=()=>Object.keys(c),l=(t,e)=>{if(c[t]){const[n,r,a,i]=e;if(s[t]||(s[t]=[]),c[t]({name:n,flatData:r,breadcrumbs:a,edges:i})){const e=o[a];s[t].push(e)}}};u().forEach((t=>r.forEach((e=>l(t,e)))));const f={insert:h(a,l,u),export:m(a),getCopy:t=>n[t]?n[t]:null,getIndexes:()=>o,getLine:t=>o[t]?o[t]:null,getFilters:()=>s,getScanList:()=>i,setupScanList:t=>i=t,setupFilter:b(a,c,l,u),resetScan:()=>{i=r}};var d;return[f,{from:y(f),use:(d=f,function(t){const e=d.getFilters()[t];return e&&d.setupScanList(e),this}),get:E(f),find:_(f),like:$(f),look:k(f)}]}t.sequence=function(e,...n){const o=t(),r=[],a=function*(t){for(const e of t)yield e}(e);return function t(e,...n){e.done?o.done(r):e.value(...n).then((e=>{r.push(e),t(a.next(),...n,e)}))}(a.next(),...n),o},t.all=function(e,...n){const o=t(),r=[],a=e.map(((t,e)=>"function"==typeof t?t(...n).then((t=>r[e]=t)):t.then((t=>r[e]=t))));return Promise.all(a).then((()=>o.done(r))),o};var D=function(t,e){const n=e instanceof Array?[]:{},{walk:o}=t(),r=[["root",n,"root",[]]],a={root:r[0]},s=o({data:e,keyCallback:function({value:t,key:e,breadcrumbs:n}){const o=new RegExp(`/${e}$`),r=n.replace(o,"");return a[r][1][e]=t,t},objectCallback:function({value:t,key:e,breadcrumbs:n}){const o=t instanceof Array?[]:{},s=e,c=new RegExp(`/${e}$`),i=n.replace(c,""),u=[s,o,n,[]];return a[i][3].push(n),r.push(u),a[n]=r.at(-1),t}});return[{root:s},a,r]},A=function(t){let e={};return t.reverse().forEach((([t,n,o,r])=>{const a=n instanceof Array?[...n]:{...n};e[o]=a,r.forEach((t=>{if(e[t]){const n=t.replace(`${o}/`,"");e[o][n]=e[t]}}))})),e.root},T=function(t,e){const n=Object.entries(e),{walk:o}=t(),r={},a=[],s={},c={};function i(t){s[t]||(s[t]="object");const e=t.split("/");1!=e.length&&(e.pop(),1!=e.length&&i(e.join("/")))}return n.forEach((([t,e])=>{t.startsWith("root")||(t=`root/${t}`),i(t),function(t,e){Object.keys(e).forEach((e=>{isNaN(e)||(s[t]="array")}))}(t,e),c[t]=e})),Object.entries(s).forEach((([t,e])=>{if("object"===c[t])return;if(c[t]){const n=c[t]instanceof Array;if("array"===e&&!n){const e=Object.values(c[t]);c[t]=e}return}const n="object"===e?{}:[];c[t]=n})),Object.entries(c).sort().forEach((([t,e])=>{const n=t.split("/").pop(),o=t.replace(`/${n}`,""),s=[n,e instanceof Array?[...e]:{...e},t,[]];r[t]=s,a.push(s),"root"!==t&&o&&r[o]&&r[o][3].push(t)})),[o({data:e}),r,a]},w=function(t){const e={};return t.forEach((t=>{const[,n,o]=t;if(0===Object.keys(n).length)return;const r=o.replace("root/",""),a=n instanceof Array?[...n]:{...n};e[r]=a})),e},N=function(t,e){const{walk:n}=t(),o={},r={root:[]},a=[];function s(t){if("root"===t)return;const e=t.split("/");e.pop();const n=e.join("/");r[n]||(r[n]=[]),n.includes("/")&&s(n)}e.forEach((t=>{const[e,n]=t,o="root"===e?"root":`root/${e}`;r[o]?r[o].push(n):r[o]=[n],s(o)}));let c=Object.entries(r).sort();const i={root:"object"};return c.forEach((([t,e])=>{if("root"===t)return;const n=t.split("/"),o=n.pop(),r=n.join("/");"array"!==i[r]&&!isNaN(o)&&(i[r]="array"),0===e.length&&(i[t]="object")})),c=Object.entries(r).sort(),c.forEach((([t,e])=>{const[n,r,s]=function(t){let e,n,o;if("root"==t)return e="root",n="root",o=null,[e,n,o];const r=t.split("/");return 2===r.length&&(e="root",n="root",o=r.pop()),r.length>2&&(o=r.pop(),e=r.pop(),n=0===r.length?`root/${e}`:`${r.join("/")}/${e}`),[e,n,o]}(t),c=0===e.length,u=1===e.length;let l,f;if(c){if(o[`${r}/${s}`])return;return null==s?(f="object"===i.root?{}:[],l=["root",f,"root",[]],o.root=l,void a.push(l)):(f="object"===i[`${r}/${s}`]?{}:[],l=[s,f,`${r}/${s}`,[]],o[`${r}/${s}`]=l,void a.push(l))}if(!u)return l=[s,e,`${r}/${s}`,[]],o[`${r}/${s}`]=l,void a.push(l);if(o[`${r}`])o[r][1][s]=e[0];else{const t={};t[s]=e[0],l=[n,t,r,[]],o[r]=l,a.push(l)}})),a.reverse(),a.forEach((t=>{const[e,n,r]=t,a=r.replace(`/${e}`,""),s=o[a];a!==r&&s&&s[3].push(r)})),a.reverse(),[n({data:e}),o,a]},I=function(t){let e=[];return t.forEach((t=>{const[n,o,r]=t,a=o instanceof Array;let s="";"root"!==n&&(s=r.replace("root/","")),a?0==s.length?o.forEach(((t,n)=>e.push(["root",t]))):o.forEach((t=>e.push([s,t]))):Object.entries(o).forEach((([t,n])=>{0==s.length?e.push([t,n]):e.push([`${s}/${t}`,n])}))})),e};const F=t=>(e,n)=>{switch(t){case"std":case"standard":return D(e,n);case"tuple":case"tuples":return N(e,n);case"breadcrumb":case"breadcrumbs":const t=Object.entries(n);return N(e,t);case"file":case"files":const o=n.map((t=>{let e=t.split("/");1===e.length&&(e=["root"].concat(e));const n=e.pop();return[e.join("/"),n]}));return N(e,o);case"midFlat":return T(e,n)}return[["object",0],{}]};var L={from:function(t){return{toFlat:F(t)}},to:function(t,e,n){const o={},{walk:r}=e(),a=new Set,s=new Set;let c,i=0;switch(t){case"flat":case"dt-model":return r({data:n});case"std":case"standard":return A(n);case"midflat":case"midFlat":return w(n);case"tuple":case"tuples":return I(n);case"files":return c=I(n),c.map((([t,e])=>"function"==typeof e?`${t}/function:${e.name}`:e?.nodeType?`${t}/HtmlElement:${e.tagName?e.tagName.toLowerCase():"notSpecified"}`:"root"===t?e:`${t}/${e}`));case"breadcrumb":case"breadcrumbs":let t;return c=I(n),c.forEach((([t,e])=>a.has(t)?s.add(t):a.add(t))),c.forEach((([e,n])=>{s.has(e)?(t!==e&&(t=e,i=0),o["root"===e?i:`${e}/${i}`]=n,i++):o[e]=n})),o}}};function P(t,e,n){const o=t[e],r=o[2];o[2]=n,t[r]=o,o[3].forEach(((e,o)=>{const a=new RegExp(`^${r}/`),s=e.replace(a,`${n}/`);P(t[e],e,s)}))}var C={push:function(t){return function(e,n){const o=!!t[e]&&t[e][1];return o&&o instanceof Array?("object"==typeof value||o.push(n),this):this}},set:function(t,e){return function(n,o){const r=o instanceof Array,a=[];return a.push(n),r?a.push([...o]):a.push({...o}),a.push(n),a.push([]),t.push(a),e[n]=a,this}},connect:function(t){return function(e){e.forEach((e=>{let n=e.split("/");const o=n.pop(),r=n.pop(),a=t[r];if(!t[o])return this;if(!a)return this;if(a[1][o])return this;let s=`${a[2]}/${o}`;return P(t,o,s),a[3].includes(s)||a[3].push(s),this}))}},save:function(t){return function(e,n,o){const r=!!t[e]&&t[e][1];return r?(r[n]||(r[n]=o),this):this}}};const q=["std","standard","tuple","tuples","breadcrumb","breadcrumbs","file","files","midFlat","midflat","flat","dt-model"],H={dependencies:()=>({walk:s,flatData:x,flatObject:p,convert:L,INIT_DATA_TYPES:q,main:{load:H.load},isDTO:t=>"function"==typeof t.insertSegment,isDTM:t=>t instanceof Array&&t[0]instanceof Array&&4===t[0].length&&"root"===t[0][0],draft:C}),init(t,e={}){let{model:n}=Object.assign({},{model:"std"},e),o=H.dependencies;return q.includes(n)?p(o,["flat","dt-model"].includes(n)?H.load(t):L.from(n).toFlat(o,t)):(console.error(`Can't understand your data-model: ${n}. Please, find what is possible on https://github.com/PeterNaydenov/dt-toolbox`),null)},load(t){const e={};t.forEach((t=>{const[,,n]=t;e[n]=t}));const n=s({data:t});return p(H.dependencies,[n,e,t])},flating(t,e={}){let{model:n}=Object.assign({},{model:"std"},e);if(!q.includes(n))return null;let[,,o]=L.from("std").toFlat(H.dependencies,t);return o},converting(t,e={}){let{model:n,as:o}=Object.assign({},{model:"std",as:"std"},e);if(!q.includes(n))return null;if(!q.includes(o))return null;let[,,r]=L.from("std").toFlat(H.dependencies,t);return L.to(o,H.dependencies,r)},getWalk:()=>s},{init:W,load:R,flating:K,converting:G,getWalk:U}=H,M={init:W,load:R,flat:K,convert:G,getWalk:U};function X(t){const e={};t.look((({name:n,flatData:o,breadcrumbs:r,links:a,next:s})=>{if(t.set(n,o),"root"===n)return s();if(n===r&&t.connect([`root/${n}`]),a.forEach((([t,n])=>e[n]=[t,n])),e[n]){const[o,r]=e[n];t.connect([`${o}/${r}`])}return s()}))}function Y(t){const e={};t.look((({name:n,flatData:o,links:r,next:a})=>{if(r.forEach((([t,n])=>{"root"!==t&&(e[n]=[t,n])})),t.set(n,o),e[n]){const[o,r]=e[n];t.connect([`${o}/${r}`])}return a()}))}function z(t,e){const n=e.export("root")[0][1],o=[];let r=null;t.use("root").look((({flatData:t,breadcrumbs:e,next:n})=>"root"===e?(r=t,n()):(o.push(e),n()))),r instanceof Array?t.set("root",[]):t.set("root",{}),o.forEach((o=>{let a=!1;const s={};e.query((e=>{e.from(o).look((({name:e,flatData:n,breadcrumbs:o,links:r,next:c})=>{if(a=!0,t.set(e,n),s.hasOwnProperty(o)){const[e,n]=s[o];t.connect([`${e}/${n}`])}return r.forEach((([t,e])=>s[`${o}/${e}`]=[t,e])),c()}))})),!a&&n.hasOwnProperty(o)&&(a=!0,t.save("root",o,r[o])),a||t.from(o).look((({name:e,flatData:n,breadcrumbs:o,links:r,next:a})=>{if(t.set(e,n),s.hasOwnProperty(o)){const[e,n]=s[o];t.connect([`${e}/${n}`])}return r.forEach((([t,e])=>s[`${o}/${e}`]=[t,e])),a()}))})),Object.entries(r).forEach((([o,r])=>{const a={};let s=!1;e.query((e=>{e.from(o).look((({name:e,flatData:n,breadcrumbs:o,links:r,next:c})=>{if(s=!0,t.set(e,n),a.hasOwnProperty(o)){const[e,n]=a[o];t.connect([`${e}/${n}`])}return r.forEach((([t,e])=>a[`${o}/${e}`]=[t,e])),c()}))})),!s&&n.hasOwnProperty(o)&&(s=!0,t.save("root",o,n[o])),s||t.save("root",o,r)}))}const B={_setTransitions:function(){return function(t,e){let n={},o={},r={};return t.forEach((t=>{const[a,s,c,i,u]=t,l=e[i],f=`${a}/${s}`;n[f]=l||null,o[f]=c,function(t){return t instanceof Array&&(2==t.length&&(t.forEach((t=>{if(!1!==t||"string"!=typeof t)return!1})),!0))}(u)&&(r[f]=[],r[f][0]=u[0],r[f][1]=u[1])})),{transitions:n,nextState:o,chainActions:r}}},_updateStateData:function(t){return function(e){const{dtbox:n,query:o}=t.dependencies;let r="javascriptObject";return e.export&&(r="dt-object"),e instanceof Array&&e[0][0]===e[0][2]&&e.every((t=>4===t.length))&&(r="dt-model"),"javascriptObject"===r&&e instanceof Array?(console.error("State update failed. Reason: Received an array. Expectation: Object where top-level property name is the name of the data segment."),t.stateData):(["javascriptObject"].includes(r)&&(e=n.init(e).export()),["javascriptObject","dt-model"].includes(r)&&(e=n.load(e)),["javascriptObject","dt-model","dt-object"].includes(r)&&(e=e.query(o.splitSegments)),t.stateData.query(o.updateState,e))}},_updateStep:function(t){return function(e,n,o){const{askForPromise:r}=t.dependencies,a=r(),s=`${t.state}/${n}`,c=t.callback;t.lock=!0,t._transit(a,s,o),a.onComplete((n=>{let o=t._getChain(s),r=n.response;if(n.success){if(t.state=t.nextState[s],null!=n.stateData&&(t.stateData=t._updateStateData(n.stateData)),c.positive.forEach((e=>e(t.state,r))),c.transition.forEach((e=>e(t.state,r))),o&&o[0])return void t._updateStep(e,o[0],r)}else if(c.negative.forEach((e=>e(t.state,r))),c.transition.forEach((e=>e(t.state,r))),o&&o[1])return void t._updateStep(e,o[1],r);e.done(r)})),a.promise.catch((()=>console.log(`Failed in step ${s}`)))}},_warn:function(t){return function(t){Object.entries(t).forEach((([t,e])=>{null==e&&console.log(`Warning: Transition for ${t} is not defined`)}))}},_transit:function(t){return function(){const[e,n,...o]=arguments,{state:r,stateData:a,dependencies:s}=t,c=t.transitions[n],i=t.api.extractList;"function"==typeof c?c({task:e,state:r,extractList:i,dependencies:s},...o):e.done({success:!1})}},_getChain:function(t){return function(e){const n=t.chainActions;return!!n[e]&&n[e]}},_triggerCacheUpdate:function(t){return function(){if(0!==t.cache.length){const{updateTask:e,action:n,dt:o}=t.cache[0];t.cache=t.cache.reduce(((t,e,n)=>(0!=n&&t.push(e),t)),[]),t._updateStep(e,n,o),e.onComplete((e=>t._onUpdateTask(e)))}}},_onUpdateTask:function(t){return function(e){const n=t.callback,o=t.dependencies.askForPromise(n.update);n.update.forEach(((n,r)=>{n(t.state,e),o[r].done()})),o.onComplete((e=>{t.lock=!1,t._triggerCacheUpdate()}))}},setDependencies:function(t){return function(e){t.dependencies={...t.dependencies,...e}}},getDependencies:function(t){return function(){return t.dependencies}},on:function(t){return function(e,n){const o=t.callback;o[e]&&o[e].push(n)}},off:function(t){return function(e){t.callback[e]&&(t.callback[e]=[])}},importState:function(t){return function({state:e,stateData:n}){const{dtbox:o,query:r}=t.dependencies;if(e&&(t.state=e,n)){const e=o.load(n).query(r.splitSegments);t.stateData=t.stateData.query(r.updateState,e)}}},exportState:function(t){return function(){const{query:e}=t.dependencies;return{state:t.state,stateData:t.stateData.query(e.joinSegments).export()}}},update:function(t){return function(e,n){const{askForPromise:o}=t.dependencies,r=o();return t.lock?(t.cache.push({updateTask:r,action:e,dt:n}),r.promise):(t._updateStep(r,e,n),r.onComplete((e=>t._onUpdateTask(e))),r.promise)}},reset:function(t){return function(){const{dtbox:e}=t.dependencies;t.state=t.initialState,t.stateData=e.load(t.initialStateData.export())}},ignoreCachedUpdates:function(t){return function(){t.cache.forEach((({updateTask:t,action:e,dt:n})=>t.cancel(`Action '${e}' was ignored`))),t.cache=[]}},getState:function(t){return function(){return t.state}},extractList:function(t){return function(e,n=!1){const o=t.dependencies.query;return 0==arguments.length?t.stateData.query(o.joinSegments).model((()=>({as:"std"}))):n?t.stateData.extractList(e,n):t.stateData.extractList(e,t.stateDataFormat)}}},J=M.getWalk();function Q({init:e,behavior:n,stateData:o={},debug:r,stateDataFormat:a={as:"std"}},s={}){const c=this,i={};c.state=e||"N/A",c.initialState=e||"N/A",c.stateDataFormat=a,c.lock=!1,c.cache=[],c.dependencies={walk:J,dtbox:M,askForPromise:t,query:{splitSegments:Y,joinSegments:X,updateState:z}},c.callback={update:[],transition:[],positive:[],negative:[]};for(let t in B)t.startsWith("_")?c[t]=B[t](c):i[t]=B[t](c);c.api=i,c.stateData=M.init(o).query(Y),c.initialStateData=M.init(o).query(Y);const{transitions:u,nextState:l,chainActions:f}=c._setTransitions(n,s);return r&&(c._warn(u),global.debugFSM=c),c.transitions=u,c.nextState=l,c.chainActions=f,i}return Q.dependencies={walk:J,dtbox:M,askForPromise:t,query:{splitSegments:Y,joinSegments:X,updateState:z}},Q}));
