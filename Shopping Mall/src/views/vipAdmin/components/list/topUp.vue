<template>
  <el-dialog :title="title+'充值'" 
    :visible.sync="isDialog"
    :close-on-click-modal="false"
		@close="close"
    width="25%">
    <el-form :model="form"
      :rules="rules"
      ref="form"
      label-position="right"
      label-width="100px">

      <el-form-item label="充值类型" prop="type">
        <el-select v-model="form.type"   placeholder="请选择充值类型" clearable>
          <el-option
            v-for="item in type_screen"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="金额" prop="money">
        <el-input v-model="form.money"  type="number"
          placeholder="请输入充值金额"></el-input>
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
    title:String,
    id: Number,
    item:Object
  },
  data() {
    return {
      isDialog: false,
      form: {
        type:'',
        money:null 
      },
      type_screen: [{
        label: '余额',
        value: 'amount'
      }],
      specSelect: [],
      rules: {
        type:[{ required: true, message: '请选择充值类型' ,}],
        money:[{ required: true, message: '请输入充值金额' ,}],
      },
    }
  },
  methods: {
		close(val) {
      this.$emit("close",val);
      this.$refs.form.resetFields();
    },
    isOk(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let params = new URLSearchParams();
          params.append('member_id', this.id);
          params.append('type', this.form.type);
          params.append('money', this.form.money);
          this.$http.post('/manage/member/recharge', params).then(res => {
              this.isDialog = false;
              this.close('1')
          })
        }
      })
    },
  }
}
</script>

<style scoped lang="scss">
.el-select{
  width: 100%
}
.good-img{
  width: 138px;
  height: 138px;
  padding: 5px;
  }
</style>
