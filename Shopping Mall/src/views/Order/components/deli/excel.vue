<template>
    <el-dialog title="导入EXCEL" :visible.sync="isDialog" :close-on-click-modal="false" @close="close" width="21.5%" :center="true"
      style="margin:0 auto" 
    >
     <el-upload
        class="upload-demo"
        drag  
        action="https://jsonplaceholder.typicode.com/posts/"
        multiple
        :http-request="uploadFile"
 >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip" slot="tip">只能上传excel文件，且不超过500kb</div>
      </el-upload>
    </el-dialog>
</template>

<script>

export default {
  components: {
  },
  props: ["item"],
  data() {
    return {
      isUploadShow: false,
      isAddShow: false,
      isDialog: true,
      item1:{},
      form: []
    };
  },
  methods: {
    close() {
      this.$emit("close");
    },
    uploadFile(param){
      var fileObj = param.file;
      console.log(param);
      var form = new FormData();
      form.append("file", fileObj);
      this.$http.post("/manage/files/uploadFile", form).then(res => {
        this.item1.file = res.data.fileurl;
        this.$http.post("manage/order/import",{filepath: this.item1.file}).then(res2 => {
          this.$message.success('导入成功');
          this.close(),

          console.log(res2);
          // this.getData()          
        });
      });
    }
  }
};
</script>
<style>
.sliderbox {
  display: flex;
  margin-left: 20px;
}
.inp {
  width: 85%;
}
.slider {
  width: 445px;
}
.textinp {
  width: 85%;
}
.quillEditor {
  margin-bottom: 50px;
  height: 100px;
}
</style>
<style scoped>
.quillEditor {
  height: 500px;
  margin-bottom: 50px;
}
.i {
  width: 30px;
  height: 30px;
  display: inline-block;
  font-size: 30px;
  color: white;
  line-height: 30px;
  background-color: #666;
  border-radius: 50%;
  margin-left: 30px;
  text-align: center;
  cursor: pointer;
}
.btn {
  position: relative;
  margin-left: 30px;
}
.imgPic{
  width: 150px;
  height: 150px;
  position: relative;
  margin: 10px 0;
  border-radius: 10px;
}
.del{
  position: absolute;
  font-size: 20px;
  width: 20px;
  height: 20px;
  color: #4E6E24;
  top: 10px;
  right: 20px;
  z-index: 100;
}
.img {
  border: 1px dashed gray;
  font-size: 50px;
  color: lightgray;
  text-align: center;
  line-height: 140px;
  cursor: pointer;
}
</style>
