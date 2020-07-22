<template>
  <el-dialog :title="title + form.name"
    :visible.sync="isDialog"
    :close-on-click-modal="false"
		@close="close"
    width="30%">
    <el-form :model="form"
      :rules="rules"
      ref="form"
      label-position="right"
      label-width="100px">
      
      <el-form-item label="ID" prop="id" v-if="this.id < 0">
        <el-input v-model="form.id"  type="number"
          placeholder="请输入ID"></el-input>
      </el-form-item>

      <el-form-item label="名称" prop="name">
        <el-input v-model="form.name" 
          placeholder="请输入名称"></el-input>
      </el-form-item>

      <el-form-item label="配置值" prop="value">
        <el-input v-model="form.value" 
          placeholder="请输入配置值"></el-input>
      </el-form-item> 
    
      <el-form-item label="权重"
        prop="sort">
        <el-slider v-model="form.sort"
          :max="255"
          show-input>
        </el-slider>
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
      isDialog: true,
      form: {
        name:'',
        sort:0,
        id:"",
        value:"",
      },
      rules: {
        id:[{ required: true, message: '请输入ID' ,}],
        name:[{ required: true, message: '请输入名称' ,}],
        value:[{ required: true, message: '请输入配置值' ,}],
        sort: [{ required: true, message: '请选择权重',  trigger: 'change' }],
      },
    }
  },
  
	created(){
    this.Screen()
	},
  methods: {
    Screen(){
      if(this.id > 0){
        this.form = this.item
      }else{
      }
		},
		close(val) {
      this.$emit("close",val);
    },
    isOk(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.id > 0){
            this.$http.post('/manage/goods_param/edit', this.form).then(res => {
              this.isDialog = false
              this.close('1')
            })
          } else {
            this.$http.post('/manage/goods_param/add', this.form).then(res => {
              this.isDialog = false
              this.close('1')
            })
          }
        }
      })
    }
  }
}
</script>

<style>
</style>
