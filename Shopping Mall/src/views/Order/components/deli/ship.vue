<template>
  <el-dialog :title="'同意-'+title+'-发货'"
    :visible.sync="isDialog"
    :close-on-click-modal="false" 
		@close='close'
    width="25%"
    top="150px">
    <el-form :model="form" :rules="rules" ref="form"  label-width="130px">

      <el-form-item label="发货方式" prop="delivery_type">
        <!-- <el-input v-model="form.delivery_type" placeholder="请输入发货方式"></el-input> -->
        <el-select v-model="form.delivery_type"    placeholder="请选择发货方式" clearable>
          <el-option
            v-for="item in screen"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <div v-show="form.delivery_type=='express'">
        <el-form-item label="快递公司" prop="express_company">
        <el-input v-model="form.express_company" placeholder="请输入快递公司" clearable></el-input>
        </el-form-item>
        <el-form-item label="快递号" prop="express_number">
          <el-input v-model="form.express_number" type="number" placeholder="请输入快递号" clearable></el-input>
        </el-form-item>
      </div>

       <div v-show="form.delivery_type=='worker'">
         <el-form-item label="送货师傅名称"  prop="worker_name">
          <el-select v-model="form.worker_name"    placeholder="请选择发货方式" clearable>
            <el-option
              v-for="item in workerList"
              :key="item.worker_id"
              :label="item.label"
              :value="item.worker_id"
            ></el-option>
          </el-select>        
        </el-form-item>
        <!-- <el-form-item label="送货师傅联系方式"  prop="worker_contact">
          <el-input v-model="form.worker_contact" type="number" placeholder="请输入送货师傅联系方式" clearable></el-input>
        </el-form-item> -->
       </div>

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
    title: String,
    screen: Array
  },
  data() {
    var express_company = (rule, value, callback) => {
      if (this.form.delivery_type === 'express') {
        this.$refs.form.clearValidate('worker_name');
        if(value === ''){
          return callback(new Error('请输入快递公司'))
        }
        console.log(this.form);
        callback();
      }else{
        callback();
      }
    };
  var express_number = (rule, value, callback) => {
      if (this.form.delivery_type === 'express') {
        this.$refs.form.clearValidate('worker_contact');
        if(value === ''){
          return callback(new Error('请输入快递号'))
        }
        callback();      
      }else{
        callback();      
      }
    };
    var worker_name = (rule, value, callback) => {
      if (this.form.delivery_type === 'worker') {
        this.$refs.form.clearValidate('express_company');
        if(value === ''){
          return callback(new Error('请输入送货师傅名称'))
        }
        callback();
      }else{
        callback();
      }
    };
    var worker_contact = (rule, value, callback) => {
      if (this.form.delivery_type === 'worker') {
        this.$refs.form.clearValidate('express_number');
        if(value === ''){
          return callback(new Error('请输入送货师傅联系方式'))
        }
        callback();
      }else{
        callback();
      }
      
    };
    return {
      clas: '',
      isDialog: true,
      workerList: [],
      form: {
        delivery_type: '',
        express_company: '',
        express_number: '',
        worker_name: '',
        worker_contact: '',
      },
      rules: {
        delivery_type: [{ required: true, message: '请选择发货方式 ' }],
        express_company: [{ validator: express_company, message: '请输入快递公司' }],
        express_number: [{ validator: express_number, message: '请输入快递号' }],
        worker_name: [{ validator: worker_name, message: '请输入送货师傅名称' }],
        // worker_contact: [{ validator: worker_contact, message: '请输入送货师傅联系方式' }],
      },
      maxPage: 1,
      nowPage: 1,
    }
  },
  created() {
    console.log(this.id);
  },
  watch:{
    'form.delivery_type'(val){
      if(val === 'worker') this.getWorker();
    }
  },
  methods: {
    close(val) {
      this.$emit('close', val);
      this.$refs.form.resetFields();
    },
    async getWorker(){
      const {data: res} = await this.$http.get('/manage/worker/lists');
      this.workerList = res.list;
      console.log(res);
    },
    toSave(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let params = new URLSearchParams()
          params.append('order_id', this.id)
          params.append('delivery_type', this.form.delivery_type)
          if(this.form.delivery_type == 'express'){
            params.append('express_company', this.form.express_company)
            params.append('express_number', this.form.express_number)
          }else{
            // this.form.worker_contact = this.workerList.findIndex(item => {
            //   if(item.worker_id == this.form.worker_name){
            //     return item.contact
            //   }
            // });
            let index = this.workerList.findIndex(item =>item.worker_id == this.form.worker_name);
            params.append('worker_name', this.form.worker_name)
            params.append('worker_contact', this.workerList[index].contact)
          }
          this.$http.post('/manage/order/deliver', params).then(res => {
            this.close('1')
          })
        }
      })
    }
  },
  
  mounted() {}
}
</script>
<style module lang="scss">
</style>
