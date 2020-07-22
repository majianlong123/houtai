<template>
  <el-dialog :title="this.id>0?'修改':'新增'" :visible.sync="isDialog" :close-on-click-modal="false" width="20%" top="30px" @close="closeDialog">
    <el-form :model="form" ref="form" :rules="rules" label-position="right" label-width="120px">

      <el-form-item label="姓名" prop="name" style="width: 300px">
        <el-input v-model="form.name" placeholder="请输入名称"></el-input>
      </el-form-item>

    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="closeDialog">取 消</el-button>
      <el-button type="primary" @click="toSave('form')">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>

export default {
  props: {
    id: Number,
    nickName:String
  },
  data() {
    return {
      isDialog: true,
      disabled: 'false',
      form: {
        title: '',
        sort: 0,
        thumb: '',
        content: '',
        name: '',
        supplier_id: ''
      },
      rules: {
        name: [{ required: true, message: '请输入姓名' }],
      }
    }
  },
  created(){
    this.form.name = this.nickName,
    this.form.supplier_id = this.id
  },
  watch: {
    isDialog(val) {
      if (val) {
        if (this.id > 0) {
          this.getInfo()
        }
      } else {
        this.$refs.form.resetFields()
      }
    }
  },
  computed: {},
  methods: {
    closeDialog(){
      this.$emit('close')
    },
    toSave(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.id > 0) {
            let params = new FormData()
            params.append('supplier_id', this.form.supplier_id)
            params.append('name', this.form.name)
            this.$http.post('/manage/supplier/edit', params).then(res => {
              // this.isDialog = false
              this.$emit('getData')
              this.$emit('close')
            })
          } else {
            let params = new FormData()
            params.append('name', this.form.name)
            this.$http.post('/manage/supplier/add', params).then(res => {
              this.$emit('getData')
              this.$emit('close')
            })
          }
        }
      })
    },
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
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
<style lang="scss">
// .my-up.el-upload{
//     width: 300px;
//     height: 150px;
// }
.good-img {
 width: 138px;
  height: 138px;
  padding: 5px;
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
</style>