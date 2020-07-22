<template>
  <el-dialog :title="this.id>0?'修改储存条件':'添加储存条件'" 
      :visible.sync="isDialog" :close-on-click-modal="false" width="30%" top="100px"
      @close="dialogClose">
    <el-form :model="form" ref="form" :rules="rules" label-position="right" label-width="100px">
      <el-form-item label="名称" prop="name">
        <el-input v-model="form.name" placeholder="请输入储存名称"></el-input>
      </el-form-item> 

      
      <!-- <el-form-item label="排序"  prop="y">
        <el-slider v-model="form.sort"  show-input>
        </el-slider>      
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
  },
  data() {
    return {
      isDialog: true,
      form: {
        name: '',
        // sort: 0,
      },
      rules: {
        name: [{ required: true, message: '请输入储存名称'}],
        // sort: [{ required: true, message: '请输入运费'}],
      }
    }
  },
  created(){
    if(this.id > 0) this.getInfo()
  },
  computed: {},
  methods: {
    getInfo() {
      this.form.name = this.item.name;
      this.form.kp_id = this.item.kp_id;
      // console.log(this.form.name);
    },
    toSave(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.id > 0) {
            this.$http.post('/manage/keep_condition/edit', this.form).then(res => {
              console.log(this.form);
              this.$emit('close', '1')
            })
          } else {

            this.$http.post('/manage/keep_condition/add', this.form).then(res => {
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