<template>
  <el-dialog
    :title="title"
    :visible.sync="isDialog"
    :close-on-click-modal="false"
    @close="close"
    width="30%"
  >
    <el-form :model="form" :rules="rules" ref="form" label-position="right" label-width="100px">
      <el-form-item label="跳转对象" prop="goods_id">
          <el-select v-model="form.goods_id" placeholder="跳转对象" clearable 
            filterable remote  :loading="loading" reserve-keyword>
            <el-option 
              v-for="item in chanpin"
              :key="item.goods_id"
              :label="item.name"
              :value="item.goods_id"
            ></el-option>
          </el-select>
        </el-form-item>

      <el-form-item label="轮播图"  prop="thumb" >
        <el-upload action="https://jsonplaceholder.typicode.com/posts/"   :show-file-list="false" :http-request="uploadThumb" list-type="picture-card">
            <img v-if="form.thumb" :src="form.thumb" class="good-img" @load="imgLoad('thumb')">
            <i v-else class="el-icon-plus"></i>
          </el-upload>
          <div v-if="form.thumb">
          <span style="color:#2b232366">提示:点击图片重新上传640×320尺寸的图片</span>
        </div>
        <div v-else><span style="color:#2b232366">提示:请上传640×320尺寸的图片</span></div>
      </el-form-item>
      
      <el-form-item label="权重" prop="sort">
        <el-slider v-model="form.sort" :max="255" show-input></el-slider>
      </el-form-item>

      
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="isDialog = false">取 消</el-button>
      <el-button type="primary" @click="isOk('form')">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: {
    title: String,
    id: Number,
    item: Object,
    goods_name: String
  },
  data() {
    return {
      loading: false,
      chanpin:[],
      isDialog: true,
      form: {
        goods_name: this.goods_name,
        thumb: "",
        sort: null,
        goods_id: null
      },
      rules: {
        sort: [{ required: true, message: "请选择权重" }],
        thumb: [{ required: true, message: "请上传缩略图", trigger: "change" }],
        goods_name:[{ required: true, message: "请选择跳转对象" }],
      }
    };
  },

  created() {
    if(this.chanpin.length == 0 && this.item.target_id){
        this.chanpin.push({value: this.item.target_id, label: this.item.target_name})
    }
    this.Screen();
    this.getSelect();
  },
  methods: {
    Screen() {
      if (this.id) {
        this.form.sort = this.item.sort;
        this.form.thumb = this.item.thumb;
        this.form.target_id = this.item.goods_id == 0 ? '' : this.item.goods_id;
      }
    },
    close(val) {
      this.$emit("close", val);
    },
   getSelect(){
      this.$http.get(
        "/manage/goods/lists"
      ).then(res => {
        console.log(res)
        this.chanpin = res.data.list.filter(item => {
          //  if(item.status === 1) return { value: item.goods_id, label: item.name };
          return item.status === 1
        });
        console.log(this.chanpin);
      });
    },
    // remoteMethod(query) {
    //   console.log(query)
    //   if (query) {
    //     this.loading = true;
    //     setTimeout(() => {
    //       this.loading = false;
    //         this.$http.get(
    //           "/manage/goods/lists?keywords=" +query
    //         ).then(res => {
    //           this.chanpin = res.data.list.map(item => {
    //             return { value: item.goods_id, label: item.name };
    //           });
    //           console.log(this.chanpin);
    //         });
    //     }, 100);
    //   } else {
    //     this.chanpin = [];
    //   }
    // },
    isOk(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.id) {
            console.log(this.form.target_id);
            let params = new FormData();
            params.append("id", this.id);
            params.append("thumb", this.form.thumb);
            params.append("sort", this.form.sort);
            params.append("goods_id", this.form.goods_id);
            this.$http.post("/manage/slider/edit", params).then(res => {
              this.isDialog = false;
              this.close("1");
            });
          } else {
            let params = new FormData();
            params.append("thumb", this.form.thumb);
            params.append("sort", this.form.sort);
            params.append("goods_id", this.form.goods_id);
            this.$http.post("/manage/slider/add", params).then(res => {
              this.isDialog = false;
              this.close("1");
            });
          }
        }
      });
    },
    uploadThumb(param) {
      console.log(param);
      let fileObj = param.file
      let form = new FormData()
      form.append('file', fileObj)
      this.$http.post('/manage/image/upload', form).then(res => {
        this.form.thumb = res.data.fileurl
      })
    },
    imgLoad(str){
     this.$refs.form.validateField(str);
    }
  }
};
</script>

<style scoped>
.el-select {
  width:100%
}
div /deep/ .el-upload{
  width: 350px;
  height: 160px;
}
.good-img {
  width: 330px;
  height: 140px;
  padding: 10px;
}
.src {
  width: 150px;
  height: 150px;
}
img {
  width: 150px;
  height: 150px;
}
.img {
  width: 150px;
  height: 150px;
  border: 1px dashed black;
  line-height: 150px;
}
.test1{
  font-size: 10px;
}
.el-icon-plus {
  margin: 65px auto;
}
</style>
