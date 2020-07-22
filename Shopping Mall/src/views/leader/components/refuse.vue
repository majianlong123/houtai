<template>
  <el-dialog title="拒绝原因" 
      :visible.sync="isDialog" :close-on-click-modal="false" width="30%" top="100px"
      @close="dialogClose">
    <el-form :model="form" ref="form" :rules="rules" label-position="right" label-width="80px">
      
      <el-form-item label="拒绝原因" prop="refuse"> 
        <el-input v-model="form.refuse" placeholder="请输入拒绝原因"></el-input>
      </el-form-item>
     
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="isDialog = false">取 消</el-button>
      <el-button type="primary" @click="toSave('form')">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: {
    id: Number,
  },
  data() {
    return {
      isDialog: false,
      form: {
        refuse:'',
      },
      loading: false,
      rules: {
        refuse: [{ required: true, message: '请输入拒绝原因' }],
      }
    }
  },
  methods: {
    toSave(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let params = new URLSearchParams();
          params.append('id', this.id);
          params.append('reply', this.form.refuse);
          this.$http.post('/manage/team_apply/deny', params).then(res => {
          this.isDialog = false
          this.$emit('getData')
        })
      }
      })
    },
    dialogClose(){
      this.$refs.form.resetFields();
      this.isDialog = false;
      this.$emit('close');
    },
  },
}
</script>
<style scoped lang="scss">
  .el-form-item__content{
    .el-select{
      width: 100%;
    }  
  }
  
</style>