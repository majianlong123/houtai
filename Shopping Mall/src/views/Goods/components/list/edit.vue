<template>
  <el-dialog :title="this.id>0?'修改商品-'+this.title+'信息':'新增商品'"
    :visible.sync="isDialog"
    :close-on-click-modal="false"
    width="50%"
    top="100px"
    @close="dialogClose">
    <el-form :model="form"
      ref="form"
      :rules="rules"
      label-position="right"
      label-width="100px">
      <el-form-item label="商品名称"
        prop="name">
        <el-input v-model="form.name"
          placeholder="请输入商品名称"></el-input>
      </el-form-item>

      <el-form-item label="分类"
        prop="cate_id">
        <el-cascader v-model="form.cate_id"
          :options="options"
          filterable
          placeholder="分类"
          clearable
          :show-all-levels="false"
          @change="filterCascader"
          style="margin-left:0px">
        </el-cascader>
      </el-form-item>

      <el-form-item label="缩略图"
        prop="thumb">
        <el-upload action="https://jsonplaceholder.typicode.com/posts/"
          :show-file-list="false"
          :http-request="uploadThumb"
          list-type="picture-card">
          <img v-if="form.thumb"
            :src="form.thumb"
            class="img"
            @load="imgLoad('thumb')">
          <i v-else
            class="el-icon-plus"></i>
        </el-upload>
        <div v-if="form.thumb">
          <span style="color:#2b232366">提示:点击图片重新上传640×320尺寸的图片</span>
        </div>
        <div v-else><span style="color:#2b232366">提示:请上传640×320尺寸的图片</span></div>
      </el-form-item>

      <el-row>
        <el-col :span="12">
          <el-form-item label="售价"
            prop="price">
            <el-input v-model="form.price"
              type="number"
              placeholder="请输入售价"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="市场价"
            prop="market_price">
            <el-input v-model="form.market_price"
              type="number"
              placeholder="请输入市场价"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="佣金"
            prop="reward">
            <el-input v-model="form.reward"
              type="number"
              placeholder="请输入佣金"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="权重"
            prop="sort">
            <el-slider v-model="form.sort"
              :max="255"></el-slider>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-form-item label="商品参数" >
          <el-row v-for="(item, index) in localParameter"
            style="margin-bottom:20px">
            <el-row>
              <el-col :span="8">
                <el-input v-model="item.name"
                  type="text"
                  placeholder="请输入商品参数"></el-input>
              </el-col>

              <el-col :span="8">
                <el-input v-model="item.value"
                  type="text"
                  placeholder="请输入参数值"
                  style="margin-left: 20px"></el-input>
              </el-col>

              <el-col :span="8">
                <el-button type="primary"
                  @click="addNewParamRow"
                  style="margin-left: 30px;">+</el-button>
                <el-button type="success"
                  @click="deleteParamRow(index)"
                  style="margin-left: 20px;">-</el-button>
              </el-col>
            </el-row>
          </el-row>
        </el-form-item>
      </el-row>

      <el-form-item label="内容"
        prop="content">
        <editor id="ah"
          :content.sync="form.content"
          @changed="(value)=>{form.content=value}" />
      </el-form-item>
    </el-form>
    <span slot="footer"
      class="dialog-footer">
      <el-button @click="isDialog = false">取 消</el-button>
      <el-button type="primary"
        @click="toSave('form')">确 定</el-button>
    </span>
    <div style="display:none;">{{goodParametertoObj}}</div>
  </el-dialog>
</template>
 
<script>
import editor from '@/components/editor'

export default {
  components: {
    editor
  },
  props: {
    id: Number,
    item: Object,
    title: String,
    cateSelect: Array,
    brandSelect: Array,
    kpSelect: Array
  },
  data() {
    // let param_name = (rule, value, callback) => {
    //   let self = this;
    //   // self.form.params.forEach((item, index)=>{
    //   //   if (self.form.params[index]['param_name' + index] === '') {
    //   //      callback(new Error('请输入参数名称'));
    //   //   } else {
    //   //     // if (self.form.params[index]['param_name' + index] !== '') {
    //   //       self.$refs.form.clearValidate('param_name' + index);
    //   //       // console.log('param_name' + index);
    //   //     // }
    //   //      callback();
    //   //   }
    //   // })
    // };
    // let param_value = (rule, value, callback) => {
    //   let self = this;
    //   // self.form.params.forEach((item, index)=>{
    //   //   if (self.form.params[index]['param_value' + index] === '') {
    //   //      callback(new Error('请输入参数值'));
    //   //   } else {
    //   //     // if (self.form.params[index]['param_value' + index] !== '') {
    //   //       self.$refs.form.clearValidate('param_value' + index);
    //   //       // console.log('param_value' + index);
    //   //     // }
    //   //      callback();
    //   //   }
    //   // })
    // };
    return {
      isDialog: true,
      // goodParameter: [{}],
      goodflag: true,
      goodParameterName: '',
      goodParameterValue: '',
      form: {
        cate_id: '',
        name: '',
        thumb: '',
        price: '',
        market_price: '',
        reward: '',
        sort: 0,
        content: '',
        params: [
          {
            ['param_name' + 0]: '1',
            ['param_value' + 0]: '2'
          }
        ],
        parameter: []
      },
      localParameter: [],
      loading: false,
      options: [],
      rules: {
        cate_id: [{ required: true, message: '请选择分类' }],
        thumb: [{ required: true, message: '请添加商品缩略图' }],
        name: [{ required: true, message: '请输入商品名称' }],
        price: [{ required: true, message: '请输入售价' }],
        market_price: [{ required: true, message: '请输入市场价' }],
        reward: [{ required: true, message: '请输入佣金' }],
        content: [{ required: true, message: '请输入商品内容' }]
        // goodParameterName: [{ required: true, message: '请输入商品内容'}],
        // param_name0: [{  validator: param_name ,  trigger: 'blur' }],
        // param_value0: [{  validator: param_value,  trigger: 'blur'}]
      }
      // param_name,
      // param_value,
    }
  },
  // watch:{
  //   'form.params'(newvalue,old){
  //     alert(JSON.stringify(newvalue))
  //     alert(JSON.stringify(old))
  //   }
  // },
  created() {
    if (this.id > 0) {
      this.getInfo()
    } else {
    }
    this.getclass()
  },
  computed: {
    // 让数组转换为对象
    goodParametertoObj() {
      let obj = {}
      this.localParameter.map(item => {
        obj[item.name] = item.value
      })
      this.form.parameter = obj
      return obj
    }
  },
  methods: {
    // 添加新的属性行
    addNewParamRow() {
      this.localParameter.push({})
    },
    //删除属性行
    deleteParamRow(index) {
      let len = this.localParameter.length
      if (len == 1) return
      this.localParameter.splice(index, 1)
    },
    async getInfo() {
      const {
        data,
        data:{parameter}
      } = await this.$http.get('/manage/goods/info', {
        params: { goods_id: this.id }
      })
      this.form = data
      console.log('data',parameter)
      // 如果属性不存在
      // if (JSON.stringify(parameter) ==='{}') {
      if (JSON.stringify(parameter) == '[]') {
        this.localParameter = [{}]
      }else {
        // 如果属性存在 将对象转换为本地数组用来显示
        Object.keys(parameter).forEach(itemkey => {
          let obj = {}
          obj.name = itemkey
          obj.value = parameter[itemkey]
          this.localParameter.push(obj)
        });
        // console.log('localParameter',this.localParameter)
      }
      // this.form.parameter = res.parameter
      console.log('data', data)
    },
    filterCascader(e) {
      const innerId = e
      this.form.cate_id = e[e.length - 1]
    },
    getclass() {
      this.$http.get('/manage/category/lists').then(res => {
        this.options = res.data.list
        console.log(res)
      })
    },
    toSave(formName) {
      this.$refs[formName].validate(valid => {
        console.log(this.form.content)
        if (valid) {
          if (this.id > 0) {
            this.$http.post('/manage/goods/edit', this.form).then(res => {
              // console.log(res)
              this.isDialog = false
              this.$emit('getData')
            })
          } else {
            this.$http.post('/manage/goods/add', this.form).then(res => {
              // alert(2)
              this.isDialog = false
              this.$emit('getData')
            })
          }
        }
      })
    },
    // addParams(key, index){
    //   let len = this.form.params.length;
    //   if(len ==1 && !key)return;
    //   if(key){
    //     this.form.params.push({
    //       ['param_name'+len]: '',
    //       ['param_value'+len]: '',
    //     });
    //     console.log(this.param_value);
    //     this.rules['param_name' + len] = [{ validator: this.param_name, trigger: 'blur'}]
    //     this.rules['param_value' + len] = [{ validator: this.param_value,  trigger: 'blur'}]
    //   }else{
    //     console.log(index);
    //     this.form.params.splice(index, 1);
    //     delete this.rules['param_name' + len];
    //     delete this.rules['param_value' + len];
    //   }
    // },
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
    dialogClose() {
      this.$refs.form.resetFields()
      this.$emit('close')
      this.form = {}
    },
    async remoteMethod(query) {
      this.loading = true
      console.log(this.form.parent_id)
      const { data: res } = await this.$http.get('/manage/member/lists', {
        params: { keywords: query }
      })
      console.log(res.lists)
      this.options = res.lists
      this.loading = false
    },
    uploadThumb(param) {
      console.log(param)
      let fileObj = param.file
      let form = new FormData()
      form.append('file', fileObj)
      this.$http.post('/manage/Image/upload', form).then(res => {
        this.form.thumb = res.data.fileurl
      })
    },
    imgLoad(str) {
      this.$refs.form.validateField(str)
    }
  },
  mounted() {}
}
</script>
<style scoped lang="scss">
.el-form-item__content {
  .el-select {
    width: 100%;
  }
}
.el-date-editor.el-input,
.el-date-editor.el-input__inner {
  width: 100%;
}
img {
  width: 125px;
  padding: 10px;
}
</style>