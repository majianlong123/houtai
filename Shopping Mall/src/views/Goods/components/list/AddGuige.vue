<template>
  <el-dialog :title="this.title" 
      :visible.sync="isDialog" :close-on-click-modal="false" width="40%" top="100px"
      @close="dialogClose">
    <el-form :model="form" ref="form" :rules="rules" label-position="right" label-width="100px">

      <el-form-item label="名称" prop="spec_name">
        <el-input v-model="form.spec_name" placeholder="请输入名称"></el-input>
      </el-form-item> 

      <el-form-item label="缩略图"  prop="thumb" >
        <el-upload action="https://jsonplaceholder.typicode.com/posts/"   :show-file-list="false" :http-request="uploadThumb" list-type="picture-card">
            <img v-if="form.thumb" :src="form.thumb" class="good-img" @load="imgLoad('thumb')">
            <i v-else class="el-icon-plus"></i>
          </el-upload>
          <div v-if="form.thumb">
          <span style="color:#2b232366">提示:点击图片重新上传640×320尺寸的图片</span>
        </div>
        <div v-else><span style="color:#2b232366">提示:请上传640×320尺寸的图片</span></div>
      </el-form-item>
      
      <el-form-item label="单价"  prop="price" >
        <el-input v-model="form.price" type="number" placeholder="请输入规格单价"></el-input>
      </el-form-item>

      <el-form-item label="市场价"  prop="market_price" >
        <el-input v-model="form.market_price" type="number" placeholder="请输入规格市场价"></el-input>
      </el-form-item>
      
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="isDialog = false">取 消</el-button>
      <el-button type="primary" @click="toSave('form')">确 定</el-button>
    </span>
  </el-dialog>
</template>
 
<script>
import editor from '@/components/editor'

export default {
  components:{
    editor
  },
  props: {
    id: Number,
    title: String,
    item: Object,
  },
  data() {
    return {
      isDialog: true,
      form: {
        thumb: '',
        spec_name: '',
        price: '',
        goods_id: '',
        market_price: ''
      },
      loading: false,
      rules: {
        thumb: [{ required: true, message: '请添加规格缩略图' }],
        spec_name: [{ required: true, message: '请输入规格名称' }],
        price: [{ required: true, message: '请输入规格单价' }],
        market_price: [{ required: true, message: '请输入规格市场价' }],
      }
    }
  },
  created(){
    if (this.title == '修改规格') {
      this.getInfo()
    }
  },
  methods: {
    getInfo() { 
      this.form = this.item; 
      console.log(this.form);
    },
    toSave(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let params = new URLSearchParams();
          params.append('spec_name', this.form.spec_name);
          params.append('price', this.form.price);
          params.append('market_price', this.form.market_price);
          params.append('thumb', this.form.thumb);
          if (this.title == '修改规格') {
            params.append('spec_id', this.form.spec_id);
            this.$http.post('/manage/goods_spec/edit', params).then(res => {
              this.$emit('close')
            })
          } else {
            console.log(this.id);
            params.append('goods_id', this.id);
            this.$http.post('/manage/goods_spec/add', params).then(res => {
              this.$emit('close')
            })
          }
        }
      })
    },
    fileChange(e) {
      let file = document.getElementById('files').files[0]
      const params = new FormData()
      params.append('file', file)
      this.$http.post('/manage/image/upload', params).then(res => {
        if (res.code === 1) {
          this.form.thumb = res.data.fileurl
        }
      })
    },
    dialogClose(){
      this.$refs.form.resetFields();
      this.$emit('close');
    },
    async remoteMethod(query){
      this.loading = true;
      console.log(this.form.parent_id);
      const {data: res} = await this.$http.get('/manage/member/lists',{params: {keywords: query}});
      console.log(res.lists);
      this.options = res.lists;
      this.loading = false
    },
    uploadThumb(param) {
      console.log(param);
      let fileObj = param.file
      let form = new FormData()
      form.append('file', fileObj)
      this.$http.post('/manage/Image/upload', form).then(res => {
        this.form.thumb = res.data.fileurl
      })
    },
    imgLoad(str){
     this.$refs.form.validateField(str);
    }
  },
  mounted() {}
}
</script>
<style scoped lang="scss">
  .el-form-item__content{
    .el-select{
      width: 100%;
    }  
  }
  .el-date-editor.el-input, .el-date-editor.el-input__inner{
    width: 100%;
  }
.good-img{
    width: 130px;
    height:130px;
    padding: 10px;
  }

</style>