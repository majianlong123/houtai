<template>
  <el-dialog :title="this.title" 
      :visible.sync="isDialog" :close-on-click-modal="false" width="40%" top="100px"
      @close="dialogClose">
    <el-form :model="form" ref="form" :rules="rules" label-position="right" label-width="100px">

      <el-form-item label="地区" prop="region_id" v-if="this.title=='添加地区'">
        <el-select
          v-model="form.region_id"
          filterable
          clearable
          placeholder="请选择地区"
          >
          <el-option
            v-for="item in selectData"
            :key="item.region_id"
            :label="item.name" 
            :value="item.region_id">
          </el-option>
        </el-select>       
      </el-form-item>

      <el-form-item label="运费" prop="amount">
        <el-input v-model="form.amount" type="number" placeholder="请输入运费"></el-input>
      </el-form-item> 
      
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="isDialog = false">取 消</el-button>
      <el-button type="primary" @click="toSave('form')">确 定</el-button>
    </span>
  </el-dialog>
</template>
 
<script>
import editor from '@/components/editor'

export default {
  components:{
    editor
  },
  props: {
    id: Number,
    title: String,
    item: Object,
  },
  data() {
    return {
      isDialog: true,
      form: {
        region_id: '',
        amount: ''
      },
      selectData: [],
      loading: false,
      rules: {
        region_id: [{ required: true, message: '请选择地区' }],
        amount: [{ required: true, message: '请输入运费' }],
      }
    }
  },
  created(){
    this.getSelect();
    if (this.title == '修改地区') {
      this.getInfo()
    }
  },
  methods: {
    getInfo() { 
      this.form.amount = this.item.amount;
      this.form.region_id = this.item.region_id;
      console.log(this.form);
    },
    async getSelect(){
      const{data: res} = await this.$http.get('/manage/region/lists');
      this.selectData = res.list
    },
    toSave(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let params = new URLSearchParams();
          params.append('ft_id', this.id);
          params.append('region_id', this.form.region_id);
          params.append('amount', this.form.amount);
          if (this.title == '修改地区') {
            this.$http.post('/manage/freight_template_bill/edit', params).then(res => {
              this.$emit('close', '1')
            })
          } else {
            this.$http.post('/manage/freight_template_bill/add', params).then(res => {
              this.$emit('close', '1')
            })
          }
        }
      })
    },
    fileChange(e) {
      let file = document.getElementById('files').files[0]
      const params = new FormData()
      params.append('file', file)
      this.$http.post('/manage/image/upload', params).then(res => {
        if (res.code === 1) {
          this.form.thumb = res.data.fileurl
        }
      })
    },
    dialogClose(val){
      this.$refs.form.resetFields();
      this.$emit('close', val);
    },
    imgLoad(str){
     this.$refs.form.validateField(str);
    }
  },
  mounted() {}
}
</script>
<style scoped lang="scss">
  .el-form-item__content{
    .el-select{
      width: 100%;
    }  
  }
  .el-date-editor.el-input, .el-date-editor.el-input__inner{
    width: 100%;
  }
.good-img{
    width: 130px;
    padding: 10px;
  }

</style>