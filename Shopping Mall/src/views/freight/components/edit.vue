<template>
  <el-dialog :title="this.id>0?'修改模板'+form.name+'信息':'新增模板'" 
      :visible.sync="isDialog" :close-on-click-modal="false" width="40%" top="100px"
      @close="dialogClose">
    <el-form :model="form" ref="form" :rules="rules" label-position="right" label-width="100px">
      <el-form-item label="名称" prop="name" class="name">
        <el-input v-model="form.name" placeholder="请输入模板名称"></el-input>
      </el-form-item> 

      <el-form-item label="地区" prop="region_id">
        <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
        <div style="margin: 15px 0;"></div>
        <el-checkbox-group v-model="checkList" @change="handleCheckedCitiesChange">
              <el-checkbox v-for=" (item,index) in regionList" :checked="item.is_check === 1" :label="item.name" :key="item.region_id">{{item.name}}
                <el-tag
                  :disable-transitions="false"
                  v-show="!item.inputVisible"
                  @mouseenter.native="tagMouseenter(item)"
                  >
                  {{item.amount}}
                </el-tag>
              <el-input
                class="input-new-tag"
                v-show="item.inputVisible"
                v-model="item.amount"
                ref="saveTagInput"
                size="small"
                @keyup.enter.native="handleInputConfirm(item, index)"
                @blur="handleInputConfirm(item, index)"
              />
            </el-checkbox>
          
        </el-checkbox-group>
        <!-- <el-select v-model="form.region_id"placeholder="请选择地区" clearable>
            <el-option
              v-for="item in options"
              :key="item.region_id"
              :label="item.name"
              :value="item.region_id"
            ></el-option>
        </el-select> -->
        <!-- <el-cascader
          :options="options"
          :props="prop"
          placeholder="请选择地区"
          clearable></el-cascader> -->
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
        region: []
      },
      regionList: [],
      checkList: [],
      checkAll: false,
      isIndeterminate: true,
      index: '',
      rules: {
        name: [{ required: true, message: '请输入模板名称'}],
        region: [{ required: true, message: '请选择地区'}],
      }
    }
  },
  created(){
    if(this.id > 0)this.getInfo();
    else this.getRegion()
  },
  computed: {},
  methods: {
    async getInfo() {
      this.form.ft_id = this.item.ft_id;
      this.form.name = this.item.name;
      const {data: res} = await this.$http.get('/manage/freight_template/info?ft_id=' +this.form.ft_id);
      this.regionList = res.info.region;
    },
    async getRegion(){
      const {data: res} = await this.$http.get('/manage/region/lists');
      res.list.map(item =>{
        item.is_check = 0;
        item.amount = 0;
        item.inputVisible = false;
      });
      this.regionList = res.list;
    },
     handleCheckAllChange(val) {
      this.checkList =  [];
      if(val){
        this.regionList.map(item=> {
          this.checkList.push(item.name);
        })
        console.log(this.checkList);
      }
      this.isIndeterminate = false;
    },
    handleCheckedCitiesChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.regionList.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.regionList.length;
    },
    tagMouseenter(row){
      // this.index = this.regionList.indexOf(item);
      this.regionList.map((item, index) => {
        if(item.name == row.name){
          item.inputVisible = true;
          this.regionList.splice(index,1,item)
        }else{
          item.inputVisible = false
        }
      })
      // console.log(this.index);
      // this.regionList[this.index].inputVisible = true;
      // this.$nextTick(_ => {
        // this.$refs.saveTagInput.$refs.input.focus();
      // });
    },
    handleInputConfirm(item, index){
      item.inputVisible=false ;
      this.regionList.splice(index,1,item)
    },
    toSave(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let len = this.checkList.length - 1;
          this.checkList.forEach((item, index)=>{
            this.regionList.forEach((item2, indey)=>{
              if(item2.name === this.checkList[index]){
              console.log(item2.name === this.checkList[index]);
                item2.is_check = 1;
              }
              if(index === len){
                this.form.region.push({
                  region_id: item2.region_id,
                  is_check: item2.is_check,
                  amount: item2.amount,
                });
              }
            })
          })
          console.log(this.form.region);
          if (this.id > 0) {
            this.form.ft_id = this.id;
            this.$http.post('/manage/freight_template/edit', this.form).then(res => {
              this.$emit('close', '1')
            })
          } else {
            this.$http.post('/manage/freight_template/add', this.form).then(res => {
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
  .name .el-input{
    width: 500px;
  }
  // .el-tag{
  //   width: 40px;
  // }
  .el-checkbox-group .el-input{
    width: 45px;
  }
  .el-checkbox{
    width: 160px;
  }
</style>