<template>
  <el-dialog title="退款原因"
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
      
      <el-form-item label="退款原因" prop="reason">
        <el-input v-model="form.reason"
          placeholder="请输入退款原因"></el-input>
      </el-form-item>
      
    </el-form>
    <span slot="footer"
      class="dialog-footer">
      <el-button @click="isDialog = false">取 消</el-button>
      <el-button type="primary"
        @click="isOk('form')">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: {
    id:Number,
    reason: String
  },
  data() {
    return {
      isDialog: true,
      form:{
        reason: this.reason
      },
      rules:{
        reason: [{required: true, message: '请输入回复内容' }],
      }
		}
  },
  methods: {
	close(val){
		this.$emit('close',val)
	},
  isOk(formName) {
    this.$refs[formName].validate(valid => {
      if (valid) {
        if (this.id) {
          // console.log(this.form.target_id);
          let params = new FormData();
          params.append("id", this.id);
          params.append("reason", this.form.reason);
          this.$http.post("/manage/reason/edit", params).then(res => {
            this.isDialog = false;
            this.close("1");
          });
        } else {
          let params = new FormData();
          // params.append("thumb", this.form.thumb);
          // params.append("sort", this.form.sort);
          // params.append("goods_id", this.form.goods_id);
          params.append("reason", this.form.reason);
          this.$http.post("/manage/reason/add", params).then(res => {
            this.isDialog = false;
            this.close("1");
          });
        }
      }
    });
  },
  },
  created() {},
  mounted() {}
}
</script>
<style module lang="scss">
</style>