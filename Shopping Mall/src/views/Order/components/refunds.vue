<template>
  <el-dialog title="发货" :visible.sync="isDialog" :close-on-click-modal="false" @close="close()" width="30%" top="300px">
    <el-form :model="form" :rules="rules" ref="form" label-position="right" label-width="120px">

      <el-form-item label="姓名：" prop="express_name">
        <el-input v-model="form.express_name" placeholder="请输入姓名"></el-input>
      </el-form-item>

      <el-form-item label="电话：" prop="express_number">
        <el-input v-model="form.express_number" placeholder="请输入电话"></el-input>
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
    id: Number
  },
  data() {
    return {
      isDialog: true,
      form: {},
      rules: {
        express_name: [{ required: true, message: '请输入姓名' }],
        express_number: [{ required: true, message: '请输入电话' }],
      }
    }
  },
  methods: {
    close(val) {
      this.$emit('close', val)
    },
    toSave(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let params = new URLSearchParams()
          params.append('order_id', this.id)
          params.append('express_name', this.form.express_name)
          params.append('express_number', this.form.express_number)
          this.$http.post('/manage/cash_order/deliver?order_id', params).then(res => {
            this.isDialog = false
            this.close('1')
          })
        }
      })
    }
  },
  created() {},
  mounted() {}
}
</script>
<style module lang="scss">
</style>
