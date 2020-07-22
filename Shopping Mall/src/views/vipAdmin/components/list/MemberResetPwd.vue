<template>
  <div>
    <el-dialog @close="close"
      title="重置密码"
      :visible.sync="isDialog"
      :close-on-click-modal="false"
      width="500px"
      class="btnbox">

          <el-form :model="form"
            ref="form"
            :rules="rules"
            label-position="right"
            label-width="80px">
            <el-form-item label="登录密码"
              prop="newPwd">
              <el-input class="inp"
                v-model="form.newPwd"
                type="password"
                placeholder="请输入新的登录密码"></el-input>
            </el-form-item>
             
          </el-form>
          <el-button slot="footer"
        type
        @click="close">取消</el-button>
      <el-button slot="footer"
        type="primary"
        @click="edit('form')">确 定</el-button>
    </el-dialog>
  </div>
</template>
<script>
export default {
  props: ['item'],
  created() {
    console.log(this.item);
  },
  data() {
    return {
      activeName: 'first',
      isDialog: true,
      newPwdPass: false,
      newPayPwdPass: false,
      form: {
        newPwd: ''
      },
      form2: {
        newPayPwd: ''
      },
      rules: {
        newPwd: [
          { required: true, message: '请输入新密码' } ]
      },
    }
  },
  methods: {
    close() {
      this.$emit('close')
    },
    edit() {
      // 登录密码校验和重置
      this.$refs.form.validate(valid => {
        if (!valid) return
        if (this.form.newPwd) {
          this.$http
            .post('/manage/member/reset', {
              id: this.item.member_id,
              password: this.form.newPwd
            })
            .then(res => {
              this.$emit('close','1');
            })
        }
      })
     
    }
  }
}
</script>
<style scoped>
.inp {
  width: 95%;
}
.btnbox {
  text-align: center;
}
.btn {
  display: inline-block;
  width: 70%;
}
.btn.pay {
  position: relative;
  margin-left: -3px;
}
.btn:nth-of-type(2) {
  margin-top: 10px;
}
</style>

