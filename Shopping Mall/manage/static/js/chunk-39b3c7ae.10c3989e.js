(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-39b3c7ae"],{"2b67":function(e,t,a){"use strict";var i=a("8890"),n=a.n(i);t["default"]=n.a},"334f":function(e,t,a){"use strict";var i=a("ef95"),n=a.n(i);n.a},8890:function(e,t,a){e.exports={header:"parameterAdmin_header_3xZKX",search:"parameterAdmin_search_GRRYR"}},a0d4:function(e,t,a){"use strict";a.r(t);var i=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",[a("el-card",[a("div",{class:e.$style.header,attrs:{slot:"header"},slot:"header"},[a("div",{class:e.$style.search},[a("el-button",{staticClass:"edit",attrs:{size:"medium",type:"primary"},on:{click:e.onNew}},[e._v("\n          新增参数\n        ")])],1),a("div",{attrs:{space:""}})]),a("el-table",{attrs:{data:e.sysData}},[a("el-table-column",{attrs:{label:"参数ID",align:"center"},scopedSlots:e._u([{key:"default",fn:function(t){var a=t.row;return[e._v(e._s(a.id))]}}])}),a("el-table-column",{attrs:{label:"参数名称",align:"center"},scopedSlots:e._u([{key:"default",fn:function(t){var a=t.row;return[e._v(e._s(a.name))]}}])}),a("el-table-column",{attrs:{label:"参数值",align:"center"},scopedSlots:e._u([{key:"default",fn:function(t){var i=t.row;return[1==i.isShow?a("el-input",{model:{value:i.value,callback:function(t){e.$set(i,"value",t)},expression:"row.value"}}):a("span",[e._v(e._s(i.value))])]}}])}),a("el-table-column",{attrs:{label:"备注",align:"center"},scopedSlots:e._u([{key:"default",fn:function(t){var a=t.row;return[e._v(e._s(a.remark))]}}])}),a("el-table-column",{attrs:{label:"操作","min-width":"100px",align:"center"},scopedSlots:e._u([{key:"default",fn:function(t){var i=t.row;return[i.isShow?a("div",[a("el-button",{attrs:{size:"mini",type:"success"},on:{click:function(t){return e.checkOne(i)}}},[e._v("\n              确定\n              "),a("i",{staticClass:"el-icon-check"})]),a("el-button",{attrs:{size:"mini",type:"warning"},on:{click:function(t){return e.cancel_s(i)}}},[e._v("\n              取消\n              "),a("i",{staticClass:"el-icon-close"})])],1):a("div",[a("el-button",{attrs:{size:"mini",type:"primary"},on:{click:function(t){return e.edite(i)}}},[e._v("\n              编辑\n              "),a("i",{staticClass:"el-icon-edit"})])],1)]}}])})],1),e.isNewInfo?a("NewInfo",{on:{close:e.add}}):e._e(),e.isEditShow?a("Edit",{attrs:{item:e.item},on:{close:e.editInfo}}):e._e(),a("BasePagination",{attrs:{max:e.maxPage,now:e.nowPage},on:{"update:now":function(t){e.nowPage=t}}})],1)],1)},n=[],l=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("el-dialog",{attrs:{title:"新增参数","close-on-click-modal":!1,visible:e.dialogVisible,width:"30%",center:!0},on:{"update:visible":function(t){e.dialogVisible=t},close:e.close}},[a("el-form",{ref:"item",attrs:{"label-position":"left","label-width":"100px",rules:e.rules,model:e.item}},[a("el-form-item",{attrs:{label:"参数ID：",prop:"id"}},[a("el-input",{staticClass:"inp",attrs:{placeholder:"请输入参数ID"},model:{value:e.item.id,callback:function(t){e.$set(e.item,"id",t)},expression:"item.id"}})],1),a("el-form-item",{attrs:{label:"参数名称：",prop:"name"}},[a("el-input",{staticClass:"inp",attrs:{placeholder:"请输入参数名称"},model:{value:e.item.name,callback:function(t){e.$set(e.item,"name",t)},expression:"item.name"}})],1),a("el-form-item",{attrs:{label:"参数值：",prop:"value"}},[a("el-input",{staticClass:"inp",attrs:{placeholder:"请输入参数值"},model:{value:e.item.value,callback:function(t){e.$set(e.item,"value",t)},expression:"item.value"}})],1),a("el-form-item",{attrs:{label:"备注：",prop:"remark"}},[a("el-input",{staticClass:"inp",attrs:{placeholder:"请输入备注"},model:{value:e.item.remark,callback:function(t){e.$set(e.item,"remark",t)},expression:"item.remark"}})],1)],1),a("span",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[a("el-button",{on:{click:function(t){e.dialogVisible=!1}}},[e._v("取 消")]),a("el-button",{attrs:{type:"primary"},on:{click:e.submit}},[e._v("确 定")])],1)],1)},s=[],o=(a("7f7f"),{data:function(){return{item:{id:"",name:"",remark:"",value:""},dialogVisible:!0,rules:{id:[{required:!0,message:"请输入参数ID"}],name:[{required:!0,message:"请输入参数名称"}],value:[{required:!0,message:"请输入参数值"}],remark:[{required:!0,message:"请输入备注"}]}}},methods:{close:function(){this.$emit("close")},submit:function(){var e=this;this.$refs.item.validate((function(t){if(t){var a=new URLSearchParams;a.append("id",e.item.id),a.append("name",e.item.name),a.append("value",e.item.value),a.append("remark",e.item.remark),e.$http.post("/manage/param/add",a).then((function(t){1==t.code&&e.$emit("close","1")}))}}))}}}),r=o,c=a("2877"),u=Object(c["a"])(r,l,s,!1,null,null,null),m=u.exports,d=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("el-dialog",{attrs:{title:e.item.name,visible:e.dialogVisible,width:"30%",center:!0,"close-on-click-modal":!1},on:{"update:visible":function(t){e.dialogVisible=t},close:e.close}},[a("el-form",{ref:"item",attrs:{"label-position":"left","label-width":"100px",model:e.item,rules:e.rules}},[a("el-form-item",{attrs:{label:"参数ID",prop:"id"}},[a("el-input",{staticClass:"inp",attrs:{placeholder:"请输入参数ID"},model:{value:e.item.id,callback:function(t){e.$set(e.item,"id",t)},expression:"item.id"}})],1),a("el-form-item",{attrs:{label:"参数名称",prop:"name"}},[a("el-input",{staticClass:"inp",attrs:{placeholder:"请输入参数名称"},model:{value:e.item.name,callback:function(t){e.$set(e.item,"name",t)},expression:"item.name"}})],1),a("el-form-item",{attrs:{label:"参数值",prop:"value"}},[a("el-input",{staticClass:"inp",attrs:{placeholder:"请输入参数值"},model:{value:e.item.value,callback:function(t){e.$set(e.item,"value",t)},expression:"item.value"}})],1),a("el-form-item",{attrs:{label:"备注",prop:"remark"}},[a("el-input",{staticClass:"inp",attrs:{placeholder:"请输入备注"},model:{value:e.item.remark,callback:function(t){e.$set(e.item,"remark",t)},expression:"item.remark"}})],1)],1),a("span",{attrs:{slot:"footer"},slot:"footer"},[a("el-button",{on:{click:function(t){e.dialogVisible=!1}}},[e._v("取 消")]),a("el-button",{attrs:{type:"primary"},on:{click:e.submit}},[e._v("确 定")])],1)],1)},p=[],f={props:["item"],data:function(){return{dialogVisible:!0,rules:{name:[{required:!0,message:"名称不能为空"}],id:[{required:!0,message:"ID不能为空"}],value:[{required:!0,message:"参数值不能为空"}],remark:[{required:!0,message:"备注不能为空"}]}}},methods:{close:function(){this.$emit("close")},submit:function(){var e=this;this.$refs.item.validate((function(t){if(t){var a=new URLSearchParams;a.append("id",e.item.id),a.append("name",e.item.name),a.append("value",e.item.value),a.append("remark",e.item.remark),e.$http.post("/manage/param/edit",a).then((function(t){1==t.code&&(e.dialogVisible=!1)}))}}))}}},h=f,v=Object(c["a"])(h,d,p,!1,null,null,null),b=v.exports,g=a("dd87"),w={components:{NewInfo:m,Edit:b,BasePagination:g["a"]},created:function(){this.getData()},data:function(){return{item:{},keywords:"",isEditShow:!1,isNewInfo:!1,sysData:[{id:3,name:"服务端地址",value:"http://app.jdbtoy888.com/",remark:"加http:///",isShow:!1}],maxPage:1,nowPage:1,text:!0}},watch:{nowPage:function(){this.getData()}},methods:{getData:function(){var e=this;this.$http.get("/Manage/param/lists",{params:{page:this.nowPage,rows:10,keywords:this.keywords}}).then((function(t){t.data.list.map((function(e){e.isShow=!1})),e.sysData=t.data.list,e.maxPage=Math.ceil(t.data.total/10)}))},filterChange:function(){1===this.nowPage?this.getData():this.nowPage=1},onNew:function(){this.isNewInfo=!0},edite:function(e){e.isShow=!0,console.log(this.sysData)},checkOne:function(e){var t=new URLSearchParams;t.append("id",e.id),t.append("value",e.value),this.$http.post("/manage/param/edit",t).then((function(t){1==t.code&&(e.isShow=!1)}))},cancel_s:function(e){e.isShow=!1,this.$message.info("已取消修改")},editInfo:function(){this.isEditShow=!1,this.getData()},add:function(){this.isNewInfo=!1,this.getData()}}},k=w,_=a("2b67");a("334f");function y(e){this["$style"]=_["default"].locals||_["default"]}var $=Object(c["a"])(k,i,n,!1,y,null,null);t["default"]=$.exports},ef95:function(e,t,a){}}]);