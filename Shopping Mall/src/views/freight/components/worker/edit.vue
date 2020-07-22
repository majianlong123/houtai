<template>
  <el-dialog :title="this.id>0?'修改师傅'+form.name+'信息':'新增师傅'" 
      :visible.sync="isDialog" :close-on-click-modal="false" width="30%" top="100px"
      @close="dialogClose">
    <el-form :model="form" ref="form" :rules="rules" label-position="right" label-width="100px">
      <el-form-item label="名称" prop="name">
        <el-input v-model="form.name" placeholder="请输入师傅名称"></el-input>
      </el-form-item> 
      <el-form-item label="电话" prop="contact">
        <el-input v-model="form.contact" placeholder="请输入师傅名称"></el-input>
      </el-form-item> 

      <!-- <el-form-item label="地区" prop="worker_id">
        <el-select v-model="form.worker_id" @change="filterData" placeholder="请选择地区" clearable>
            <el-option
              v-for="item in options"
              :key="item.worker_id"
              :label="item.name"
              :value="item.worker_id"
            ></el-option>
        </el-select>
      </el-form-item> -->

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
    item: Object,
    options: Array
  },
  data() {
    return {
      isDialog: true,
      // prop: {
      //   value: 'region_id',
      //   label: 'name',
      //   expandTrigger: 'hover',
      // },
      form: {
        name: '',
        contact: ''
      },
      rules: {
        name: [{ required: true, message: '请输入配送师傅名称'}],
        contact: [{ required: true, message: '请输入配送师傅电话'}],
        worker_id: [{ required: true, message: '请选择地区'}],
      }
    }
  },
  created(){
    if(this.id > 0) this.getInfo()
  },
  computed: {},
  methods: {
    getInfo() {
      this.form.contact = this.item.contact;
      this.form.name = this.item.name;
      console.log(this.item);
    },
    toSave(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.id > 0) {
            this.form.worker_id = this.id;
            this.$http.post('/manage/worker/edit', this.form).then(res => {
              console.log(this.form);
              this.$emit('close', '1')
            })
          } else {

            this.$http.post('/manage/worker/add', this.form).then(res => {
              this.$emit('close', '1')
            })
          }
        }
      })
    },
    dialogClose(){
      this.$refs.form.resetFields();
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
.good-img{
    width: 110px;
    padding: 10px;
  }
</style>