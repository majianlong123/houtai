<template>
  <el-dialog title="拒绝原因"
    :visible.sync="isDialog"
    :close-on-click-modal="false"
	@close="close()"
    width="30%"
    top="300px">
    <el-form :model="form"
      :rules="rules"
      ref="form"
      label-position="right"
      label-width="120px">
      
      <el-form-item label="拒绝原因" prop="reply">
        <el-input v-model="form.reply"
          placeholder="请输入拒绝原因"></el-input>
      </el-form-item>
      
    </el-form>
    <span slot="footer"
      class="dialog-footer">
      <el-button @click="isDialog = false">取 消</el-button>
      <el-button type="primary"
        @click="toSave('form')">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: {
    id:Number,
  },
  data() {
    return {
      isDialog: true,
      form:{
        reply: ''
      },
      rules:{
        reply: [{required: true, message: '请输入拒绝原因' }],
      }
		}
  },
  methods: {
	close(val){
		this.$emit('close',val)
	},
    toSave(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
			      let params = new URLSearchParams()
            params.append('id', this.id)
            params.append('reply', this.form.reply)
            this.$http.post('/manage/cash/refuse', params).then(res => {
              this.isDialog = false
              this.close('1')
            })
        }
			})
    },
  },
  created() {},
  mounted() {}
}
</script>
<style module lang="scss">
</style>