webpackJsonp([1],{"+vtA":function(t,e){},"7zck":function(t,e){},Ee8Q:function(t,e){},NHnr:function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r=a("7+uW"),n={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("v-flex",{attrs:{xs12:""}},[a("v-card",{attrs:{raised:""}},[a("v-container",{attrs:{fluid:"","grid-list-lg":""}},[a("v-layout",{attrs:{row:"",wrap:""}},[a("v-flex",{attrs:{xs12:""}},[a("v-layout",{attrs:{"align-center":"","justify-center":"",column:""}},[a("v-avatar",{attrs:{size:"200",color:"grey lighten-4"}},[a("img",{attrs:{src:"https://cdn.vuetifyjs.com/images/cards/desert.jpg",alt:"avatar"}})])],1)],1),t._v(" "),a("v-flex",{attrs:{xs12:""}},[a("v-layout",{attrs:{"align-center":"","justify-center":"",column:""}},[a("v-card-title",{attrs:{"primary-title":""}},[a("h1",{staticClass:"headline mb-1 font-weight-bold"},[t._v("About Me")])])],1),t._v(" "),a("v-card-text",[a("v-layout",{attrs:{"align-center":"","justify-center":"",column:""}},[a("div",{staticClass:"subheading mb-1"},[t._v(t._s(t.myIntro))]),t._v(" "),a("div",{staticClass:"subheading mb-1"},[t._v(t._s(t.myJobDescription))])])],1)],1)],1)],1)],1)],1)},staticRenderFns:[]};var s=a("VU/8")({props:["myIntro","myJobDescription"],name:"MyPublicData"},n,!1,function(t){a("+vtA")},"data-v-4dc9ebec",null).exports,o={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("v-flex",{attrs:{xs12:""}},[a("v-card",{attrs:{raised:""}},[a("v-container",{attrs:{fluid:"","grid-list-lg":""}},[a("v-layout",{attrs:{row:"",wrap:""}},[a("v-flex",{attrs:{xs12:""}},[a("v-layout",{attrs:{"align-center":"","justify-start":""}},[a("v-card-title",{attrs:{"primary-title":""}},[a("h1",{staticClass:"headline font-weight-bold"},[t._v("Download my RSA Public Key")])])],1),t._v(" "),a("v-card-text",[a("div",{staticClass:"subheading mb-1"},[t._v("You can see my public key and use it to encrypt some text and send it to me\n              safely.\n            ")])]),t._v(" "),a("v-layout",{attrs:{"align-center":"","justify-start":""}},[a("v-btn",{on:{click:t.downloadPub}},[t._v("Download")]),t._v(" "),a("a",{ref:"downloadKey",attrs:{href:t.dirname}})],1)],1)],1)],1)],1)],1)},staticRenderFns:[]};var i={components:{MyPublicData:s,MyRSAKey:a("VU/8")({props:["dirname"],data:function(){return{}},name:"MyRSAKey",methods:{downloadPub:function(){this.$refs.downloadKey.click()}}},o,!1,function(t){a("Ee8Q")},"data-v-4b9997d0",null).exports},data:function(){return{myIntro:"Computer Systems Engineer Student from Escuela Superior de Computo at the IPN",myJobDescription:"Business Analyst & Technology Integration Analyst at PAYBACK Mexico, an American Express Company",dirName:"https://drive.google.com/uc?export=download&id=1zl5v5DAOdK0VqPhLOMfq91w3r8Ne6ow6"}},name:"App"},l={render:function(){var t=this.$createElement,e=this._self._c||t;return e("v-app",[e("v-toolbar",{attrs:{app:"",color:"blue",dark:""}},[e("v-layout",{attrs:{"align-center":"","justify-center":"",column:""}},[e("v-toolbar-title",{attrs:{color:"red"}},[this._v("Brayan Ramos Reyes - My Public RSA Key")])],1)],1),this._v(" "),e("v-content",[e("v-card",[e("v-container",{attrs:{fluid:"","grid-list-lg":""}},[e("v-layout",{attrs:{row:"",wrap:""}},[e("my-public-data",{attrs:{myIntro:this.myIntro,myJobDescription:this.myJobDescription}}),this._v(" "),e("my-r-s-a-key",{attrs:{dirname:this.dirName}})],1)],1)],1)],1)],1)},staticRenderFns:[]},c=a("VU/8")(i,l,!1,null,null,null).exports,u=a("/ocq");r.default.use(u.a);var d=new u.a({routes:[{path:"/",name:"M",component:s}]}),v=a("3EgV"),y=a.n(v);a("7zck");r.default.use(y.a),r.default.config.productionTip=!1,new r.default({el:"#app",router:d,components:{App:c},template:"<App/>"})}},["NHnr"]);
//# sourceMappingURL=app.2632cb4c10dda480394e.js.map