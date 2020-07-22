<template>
  <el-dialog title="回复"
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
      
      <el-form-item label="回复内容" prop="reply">
        <el-input v-model="form.reply"
          placeholder="请输入回复"></el-input>
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
      form:{},
      rules:{
        reply: [{required: true, message: '请输入回复内容' }],
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
            this.$http.post('/manage/comment/reply', params).then(res => {
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