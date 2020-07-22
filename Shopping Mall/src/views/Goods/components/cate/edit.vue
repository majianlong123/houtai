<template>
  <!-- <el-card> -->
    <el-dialog iconClass="el-icon-info" :title="types!='a'&&types!='b'?'编辑分类':'新增分类'" width="500px" :visible.sync="isDialog" 
    :close-on-click-modal="false" @close="close">
      <el-form :model="innerItem" :rules="rules" ref="innerItem" label-position="right" label-width="100px">
    <el-form-item label="名称：" prop="name">
        <el-input class="inp" placeholder="请输入名称"  style="width:300px" v-model="innerItem.name"></el-input>
      </el-form-item>
       
        <el-form-item label="缩略图：" prop="thumb">
          <el-upload action="https://jsonplaceholder.typicode.com/posts/" :show-file-list="false" :http-request="uploadSectionFile">
            <div class="src" v-if="innerItem.thumb">
              <img :src="innerItem.thumb" class="avatar">
            </div>
            <div class="img" v-else>
               <span style="font-size:20px; color:darkgray">+</span>
            </div>
          </el-upload>
          <span class="test1">提示: 请选择(宽: 320, 高: 320) 的图片</span>
        </el-form-item>
         <el-form-item label="权重：" prop="sort">
          <el-slider style="width:300px" :max="255" v-model="innerItem.sort" show-input></el-slider>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button type @click="close">取消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </span>
    </el-dialog>
  <!-- </el-card> -->
</template>

<script>
// import { constants } from 'crypto'
export default {
  props: ['item','types'],
  data() {
    return {
      searchPage: 1,
      searchPageSize: 10000,
      searchList: [],
      searchGoodName: '',
      chanpin: [],
      isDialog: true,
      innerItem: {
        id: '',  
        name:"",
        thumb: '',
        sort: 0,
        thumb1:""
      },
      rules: {
        thumb: [{ required: true, message: '请上传缩略图' }],
        name: [{ required: true, message: '请输入名称' }],
        sort:[{ required: true, message: '请输入权重' }]
      }
    }
  },
  created() {
    console.log(this.types)
    if(this.item.cate_id){
    this.innerItem.id=this.item.cate_id;
    this.innerItem.name=this.item.name;
    this.innerItem.thumb=this.item.thumb;
    this.innerItem.sort=this.item.sort;
     this.innerItem.parent_id=this.item.parent_id;
    }else if(typeof(this.item)!='object'){
      this.innerItem.parent_id=this.item
    }else{
      this.innerItem.parent_id=0;
    }
  },
  methods: {

    close() {
      this.$emit('close')
    },

    // 图片上传函数
    uploadSectionFile: function(param) {
      var fileObj = param.file
      var form = new FormData()
      form.append('file', fileObj)
      this.$http
        .post('/manage/image/upload', form)
        .then(res => {
          this.innerItem.thumb = res.data.fileurl,
          console.log(res);
        }).catch(()=>{})
    },

    submit() {
      this.$refs.innerItem.validate(valid => {
        if (!valid) return
        if (this.innerItem.id) {
          this.$http.post('/manage/category/edit', {thumb:this.innerItem.thumb,sort:this.innerItem.sort,name:this.innerItem.name,parent_id:this.innerItem.parent_id,id:this.innerItem.id}).then(res => {    
            this.$emit('close', '1')
          }).catch(()=>{})
        } else {
          this.$http.post('/manage/category/add', {thumb:this.innerItem.thumb,sort:this.innerItem.sort,name:this.innerItem.name,parent_id:this.innerItem.parent_id}).then(res => {
              this.$emit('close', '1')
          }).catch(()=>{})
        }
      })
    }
  }
}
</script>

<style scoped>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader {
  margin-left: 20px;
}
.avatar {
  width: 100%;
  height: 100%;
}
.u_editor {
  height: 500px;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 200px;
  height: 200px;
  line-height: 200px;
  text-align: center;
}
.leixing {
  width: 90%;
}
.duixiang {
  width: 80%;
}
.img {
  width: 150px;
  height: 150px;
  border: 1px dashed darkgray;
  line-height: 150px;
}
img {
  width: 150px;
  height: 150px;
  cursor: pointer;
}
.src {
  width: 150px;
  height: 150px;
}
.test1 {
  font-size: 10px;
}
</style>

