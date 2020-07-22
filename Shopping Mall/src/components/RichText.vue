

<template>
  <div>
    <vue-editor :id="id" v-model="localContent" :init="init"></vue-editor>
  </div>
</template>
<script>
  import tinymce from "tinymce/tinymce";
  import "tinymce/themes/silver/theme";
  import VueEditor from "@tinymce/tinymce-vue";

  import "tinymce/plugins/image";
  import "tinymce/plugins/link";
  import "tinymce/plugins/code";
  import "tinymce/plugins/table";
  import "tinymce/plugins/lists";
  import "tinymce/plugins/contextmenu";
  import "tinymce/plugins/wordcount";
  import "tinymce/plugins/colorpicker";
  import "tinymce/plugins/textcolor";
  import 'tinymce/icons/default/icons'


  export default {
    props:["content","id"],
    components:{
      VueEditor
    },
    data() {
      return {
        localContent:this.content,
        init: {
          language_url: "tinymce/zh_CN.js",
          language: "zh_CN",
          skin_url: 'tinymce/skins/lightgray',
          height: 500,
          width: 800,
          plugins: "link lists image code table colorpicker textcolor wordcount contextmenu",
          toolbar: "bold italic underline strikethrough | fontsizeselect | forecolor backcolor | alignleft aligncenter alignright alignjustify  | outdent indent blockquote | undo redo | link unlink image code | removeformat",
          branding: false,
          convert_urls: false,
          images_upload_handler: (blobInfo, success, failure) => {
            let formData = new FormData();
            formData.append("file", blobInfo.blob());
            this.$http.post("/manage/image/upload", formData).then(res => {
              success( res.data.fileurl_str);
              tinymce.editors[0].selection.collapse()
            });
          }
        }
      };
    },
    mounted() {
      tinymce.init({})
    },
    watch:{
      content(value){
        this.localContent =value
       
      },
      localContent(value){
        this.$emit("changed",value)
      }
    }    
  };
</script>
<style lang="scss" scoped>
</style>
