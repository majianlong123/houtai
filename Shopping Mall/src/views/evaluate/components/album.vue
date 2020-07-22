<template>
  <div>
    <el-dialog :title="`${title} 相册`" :visible.sync="isDialog" :close-on-click-modal="false" @close="close" width="60%" :center="true">
      <el-row :gutter="20">
        <el-col :span="4" v-for="(item,index) in pics" :key="index">
          <div style="position:relative">
            <img class="imgPic" :src="item" style="border:1px solid">
            <!-- <div class="del el-icon-close" @click="delPic(item.id)"></div> -->
          </div>
        </el-col>
        <!-- <el-col :span="4">
          <div class="imgPic img">
            <el-upload
              action="https://jsonplaceholder.typicode.com/posts/"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :http-request="uploadSectionFile"
            >+
            </el-upload>
          </div>
        </el-col> -->
      </el-row>
    </el-dialog>
  </div>
</template>

<script>

export default {
  components: {
  },
  props: ["title", 'pics'],
  data() {
    return {
      isUploadShow: false,
      isAddShow: false,
      isDialog: true,
      item1:{},
      form: []
    };
  },
  created() {
    this.getData();
    console.log(this.title);
    console.log(this.pics);
  },
  methods: {
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
    },
    getData() {
      // this.$http
      //   .get("/manage/goods_picarr/lists?goods_id=" + this.item.goods_id)
      //   .then(res => {
      //     this.form = res.data.list;
      //   });
    },
    close() {
      this.$emit("close");
    },
    upClose() {
      this.getData();
      this.isUploadShow = false;
    },
    add() {
      this.isAddShow = true;
    },
    uploadSectionFile: function(param) {
      this.item1 = {}
      var fileObj = param.file;
      var form = new FormData();
      form.append("file", fileObj);
      this.$http.post("/manage/image/upload", form).then(res => {
        this.item1.thumb = res.data.fileurl;
        this.$http.post("/manage/goods_picarr/add", {"goods_id":this.item.goods_id, "thumb":this.item1.thumb}).then(ress => {
          this.getData()          
        });
      });
    },
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
  color: #000;
  top: 15px;
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
