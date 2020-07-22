 <template>
  <el-dialog title="拒绝原因"
    :visible.sync="isDialog"
    :close-on-click-modal="false"
    width="25%"
    top="300px" >
    <el-form :model="form"
      :rules="rules"
      ref="form"
      label-position="right"
      label-width="80px">

      <el-form-item label="拒绝原因" prop="reject"
        placeholder="请输入拒绝原因">
        <el-input v-model="form.reject" />
      </el-form-item>
      
    </el-form>
    <span slot="footer" class="dialog-footer">
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
    title:String
  },
  data() {
    return {
      isDialog: false,
      form:{
        reject: ''
      },
      rules:{
        reject: [{required: true, message: '请输入拒绝原因' }],
      },
		}
  },
  watch:{
     isDialog(val){
      if(!val){
        this.$refs.form.resetFields();
        this.form.reject = ''
      }
    }
  },
  methods: {
    async getSelect(){
      const params = {
        page: 1,
        rows: 10
      }
      const {data: res} = await this.$http.get('/manage/member_bill/lists',params);
      this.type_screen = res.type_screen
      console.log(res);
    },
    toSave(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
				let params = new URLSearchParams()
            params.append('id', this.id)
            params.append('reply', this.form.reject)
            this.$http.post('/manage/account_apply/deny', params).then(res => {
              this.isDialog = false;
              this.$emit('getData');
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