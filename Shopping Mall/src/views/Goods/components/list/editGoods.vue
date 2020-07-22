<template>
  <div>
    <el-form :model="form"
      ref="form"
      :rules="rules"
      label-position="right"
      label-width="100px"
      class="form">
      <el-form-item label="商品名称"
        prop="name">
        <el-input v-model="form.name"
          placeholder="请输入商品名称"
          maxlength="60"
          show-word-limit></el-input>
      </el-form-item>
      <el-row>
        <el-col :span="8">
          <el-form-item label="售价"
            prop="price">
            <el-input v-model="form.price"
              type="number"
              placeholder="请输入售价"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="8">
          <el-form-item label="市场价"
            prop="market_price">
            <el-input v-model="form.market_price"
              type="number"
              placeholder="请输入市场价"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="8">
          <el-form-item label="佣金"
            prop="reward">
            <el-input v-model="form.reward"
              type="number"
              placeholder="请输入佣金"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="商品属性">
        <div style="color:#97a8be">
          请准确填写属性，有利于商品在搜索和推荐中露出，错误填写可能面临商品下架或流量损失！
        </div>
        <el-card>

          <el-row style="margin-top: 20px">
            <el-col :span="8">
              <el-form-item label="供货商 "
                prop="supplier_id">
                <el-select v-model="form.supplier_id"
                  filterable
                  clearable
                  placeholder="请选择供货商"
                  style="margin-bottom:20px; width: 218px">
                  <el-option v-for="item in supplierSelect"
                    :key="item.id"
                    :label="item.name"
                    :value="item.supplier_id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item label="分类"
                prop="cate_id">
                <el-cascader v-model="form.cate_id"
                  :options="options"
                  filterable
                  placeholder="分类"
                  clearable
                  :show-all-levels="false"
                  @change="filterCascader">
                </el-cascader>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row style="margin-top: 20px">
            <el-col :span="12">
              <el-form-item label="商品缩略图"
                prop="thumb">
                <el-upload action="https://jsonplaceholder.typicode.com/posts/"
                  :show-file-list="false"
                  :http-request="uploadSectionFileB"
                  style="margin-left:20px">
                  <img v-if="form.thumb"
                    :src="form.thumb"
                    class="good-img">
                  <span v-else
                    class="myiclass"
                    style="font-size:20px; color:darkgray">+</span>
                </el-upload>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row style="margin-top:20px">
            <el-form-item label="权重"
              prop="sort">
              <el-slider v-model="form.sort"
                :max="255"
                show-input></el-slider>
            </el-form-item>
          </el-row>
        </el-card>
      </el-form-item>

      <el-form-item label="商品规格">
        <el-card>
          <el-row>
            <el-button type="primary"
              @click="addParams(1, index)"
              style="margin-left: 90%;">添加规格</el-button>
          </el-row>
          <el-row v-for="(item, index) in form.specarr"
            style="margin-bottom:20px">
            <el-col :span="6">
              <el-form-item label="缩略图"
                :prop="'thumb' + index">
                <el-upload action="https://jsonplaceholder.typicode.com/posts/"
                  @click.native="uploadClick(index)"
                  :show-file-list="false"
                  :http-request="uploadThumb"
                  list-type="picture-card">
                  <img v-if="form.specarr[index]['thumb']"
                    :src="form.specarr[index]['thumb']"
                    class="good-img"
                    @load="imgLoad('thumb')">
                  <i v-else
                    class="el-icon-plus"></i>
                </el-upload>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-row>
                <el-form-item label="规格名称"
                  :prop="'spec_name' + index"
                  style="margin-top:-10px">
                  <el-input v-model="form.specarr[index]['spec_name']"
                    clearable
                    placeholder="请输入规格名称" />
                </el-form-item>
                <el-form-item label="价格"
                  :prop="'price' + index"
                  style="margin-top:30px">
                  <el-input v-model="form.specarr[index]['price']"
                    clearable
                    placeholder="请输入价格" />
                </el-form-item>
                <el-form-item label="市场价"
                  :prop="'market_price' + index"
                  style="margin-top:30px">
                  <el-input v-model="form.specarr[index]['market_price']"
                    clearable
                    placeholder="请输入市场价" />
                </el-form-item>
              </el-row>
            </el-col>
            <el-col :span="6">
              <div style="display:flex;justify-content:center;align-items:center;margin-top:60px">
                <!-- <el-button type="primary" @click="addParams(1, index)">添加规格</el-button> -->
                <el-button type="success"
                  @click="addParams(0, index)">删除规格</el-button>
              </div>
            </el-col>
          </el-row>
        </el-card>
      </el-form-item>

      <el-form-item label="商品参数">
        <el-card>
          <el-row v-for="(item, index) in goodParameter"
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
                <el-button type="primary" @click="addNewParamRow" style="margin-left: 30px;">+</el-button>
                <el-button type="success" @click="deleteParamRow(index)" style="margin-left: 20px;">-</el-button>
              </el-col>
            </el-row>
          </el-row>

        </el-card>
      </el-form-item>

      <el-form-item label="商品相册"
        prop="picarr">
        <el-card>
          <el-row :gutter="20">
            <el-col :span="4"
              v-for="(item,index) in form.picarr"
              :key="index">
              <div style="position:relative;width:150px">
                <img class="imgPic"
                  :src="item.thumb">
                <div class="del el-icon-close"
                  @click="delPic(index)"></div>
              </div>
            </el-col>
            <el-col :span="4">
              <div class="imgPic img">
                <el-upload action="https://jsonplaceholder.typicode.com/posts/"
                  :show-file-list="false"
                  :on-success="picarrSuccess"
                  :http-request="upGoodImg">+
                </el-upload>
              </div>
            </el-col>
          </el-row>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%"
              :src="dialogImageUrl"
              alt="">
          </el-dialog>
        </el-card>
      </el-form-item>

      <el-form-item label="内容"
        prop="content">
        <editor id="ah"
          :content.sync="form.content"
          @changed="(value)=>{form.content=value}" />
      </el-form-item>
    </el-form>
    <span slot="footer"
      class="dialog-footer"
      style="float:right">
      <el-button @click="cancelSubmit">取 消</el-button>
      <el-button type="primary"
        @click="toSave('form')">确 定</el-button>
    </span>
    <div style="display:none;">{{goodParametertoObj}}</div>
  </div>

</template>
 
<script>
import editor from '@/components/editor'
import { darksalmon } from 'color-name'

export default {
  components: {
    editor
  },
  props: {
    id: Number,
    item: Object,
    title: String,
    supplierSelect: Array,
    brandSelect: Array
  },
  data() {
    let spec_name = (rule, value, callback) => {
      let self = this
      self.form.specarr.forEach((item, index) => {
        if (self.form.specarr[index]['spec_name' + index] === '') {
          callback(new Error('请输入规格名称'))
        } else {
          self.$refs.form.clearValidate('spec_name' + index)
          callback()
        }
      })
    }
    let price = (rule, value, callback) => {
      let self = this
      self.form.specarr.forEach((item, index) => {
        if (self.form.specarr[index]['price' + index] === '') {
          callback(new Error('请输入参数值'))
        } else {
          self.$refs.form.clearValidate('price' + index)
          callback()
        }
      })
    }
    let thumb = (rule, value, callback) => {
      let self = this
      self.form.specarr.forEach((item, index) => {
        if (self.form.specarr[index]['thumb' + index] === '') {
          callback(new Error('请添加商品缩略图'))
        } else {
          self.$refs.form.clearValidate('thumb' + index)
          callback()
        }
      })
    }
    return {
      isDialog: false,
      form: {
        supplier_id: '',
        cate_id: '',
        name: '',
        thumb: '',
        price: '',
        market_price: '',
        reward: '',
        sort: 0,
        content: '',
        specarr: [
          {
            spec_name: '',
            market_price: '',
            price: '',
            thumb: ''
          }
        ],
        parameter: [{}],
        picarr: []
        // goodParameter: [{}],
      },
      goodParameter: [{}],
      goodflag: true,
      goodParameterName: '',
      goodParameterValue: '',
      loading: false,
      dialogVisible: false,
      dialogImageUrl: '',
      options: [],
      index: '',
      spec_name: spec_name,
      price: price,
      thumb: thumb,
      picarr: [],
      rules: {
        cate_id: [{ required: true, message: '请选择分类' }],
        supplier_id: [{ required: true, message: '请选择供货商' }],
        thumb: [{ required: true, message: '请添加商品缩略图' }],
        name: [{ required: true, message: '请输入商品名称' }],
        price: [{ required: true, message: '请输入售价' }],
        market_price: [{ required: true, message: '请输入市场价' }],
        reward: [{ required: true, message: '请输入佣金' }],
        content: [{ required: true, message: '请输入商品内容' }],
        picarr: [{ required: true, message: '请添加相册' }],
        spec_name0: [{ validator: spec_name, trigger: 'blur' }],
        market_price0: [{ validator: spec_name, trigger: 'blur' }],
        price0: [{ validator: price, trigger: 'blur' }],
        thumb0: [{ validator: thumb, trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getclass()
  },
  watch: {
    goodParameter() {
      // alert(1)
    }
  },
  computed: {
    goodParametertoObj() {
      let obj = {}
      console.log(this.form.parameter)
      this.goodParameter.map(item => {
        obj[item.name] = item.value
        console.log(obj[item.name])
        console.log(obj)
      })
      this.form.parameter = obj
      return this.form.parameter
    }
  },
  methods: {
    // 添加新的属性行
    addNewParamRow() {
      // this.form.goodParameter.push({})
      this.goodParameter.push({})
      this.goodflag = !this.goodflag
    },
    //删除属性行
    deleteParamRow(index) {
      let len = this.goodParameter.length
      if (len == 1) return
      this.goodParameter.splice(index, 1)
      this.goodflag = !this.goodflag
    },
    // showdemo() {
    //   console.log('goodParameter', this.form.goodParameter)
    // },
    cancelSubmit() {
      this.$store.commit('GOODS_STATE')
    },
    filterCascader(e) {
      const innerId = e
      this.form.cate_id = e[e.length - 1]
    },
    // 上传图片
    uploadSectionFileB(param) {
      var fileObj = param.file
      var form = new FormData()
      form.append('file', fileObj)
      this.$http
        .post('/manage/image/upload', form)
        .then(res => {
          this.form.thumb = res.data.fileurl
          console.log(res)
        })
        .catch(() => {})
    },
    // 商品相册上传图片
    upGoodImg: function(param) {
      var fileObj = param.file
      var form = new FormData()
      form.append('file', fileObj)
      this.$http.post('/manage/image/upload', form).then(res => {
        this.form.picarr.push({
          thumb: res.data.fileurl,
          picUrl: res.data.fileurl_str
        })
        console.log('商品相册上传图片', this.form.picarr)
      })
    },
    // 删除商品相册图片
    delPic(index) {
      console.log('删除商品相册图片',this.form.picarr,index)
      // let index = this.form.picarr.findIndex(item => item == item)
      // console.log(this.form.picarr[index])
      // console.log(id)
      this.form.picarr.splice(index, 1)
      // console.log(this.form.picarr)
    },
    toSave() {
      this.$http
        .post('/manage/goods/add', this.form)
        .then(res => {
          this.isDialog = false
          this.$emit('close', 1)
        })
        .catch(err => {
          console.log(err)
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
    dialogClose() {
      this.$refs.form.resetFields()
      this.$emit('close')
      this.form = {}
    },
    getclass() {
      this.$http.get('/manage/category/lists').then(res => {
        this.options = res.data.list
        console.log(res)
      })
    },
    uploadThumb(param) {
      let fileObj = param.file
      let form = new FormData()
      form.append('file', fileObj)
      this.$http.post('/manage/Image/upload', form).then(res => {
        this.form.specarr[this.index]['thumb'] = res.data.fileurl
        console.log(this.form.specarr[this.index])
      })
    },
    imgLoad(str) {
      this.$refs.form.validateField(str)
    },
    picarrSuccess(res, file, fileList) {},

    addParams(key, index) {
      console.log('form', this.form)
      let len = this.form.specarr.length
      if (len == 1 && !key) return
      if (key) {
        this.form.specarr.push({
          ['spec_name']: '',
          ['market_price']: '',
          ['price']: '',
          ['thumb']: ''
        })
        this.rules['spec_name' + len] = [
          { validator: this.spec_name, trigger: 'blur' }
        ]
        this.rules['market_price' + len] = [
          { validator: this.market_price, trigger: 'blur' }
        ]
        this.rules['price' + len] = [{ validator: this.price, trigger: 'blur' }]
        this.rules['thumb' + len] = [{ validator: this.thumb, trigger: 'blur' }]
      } else {
        this.form.specarr.splice(index, 1)
        delete this.rules['spec_name' + len]
        delete this.rules['market_price' + len]
        delete this.rules['price' + len]
        delete this.rules['thumb' + len]
      }
    },
    add(key, index) {},
    uploadClick(index) {
      this.index = index
    }

    // delPic(id){
    //   this.$http
    //     .post("/manage/goods_picarr/del",{"id":id})
    //     .then(res => {
    //       this.getclass()
    //     });
    // },
  }
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
.good-img {
  width: 138px;
  height: 138px;
  padding: 5px;
}
.btn {
  margin-left: 20px;
  display: flex;
  button span {
    font-size: 20px;
  }
}

.btn {
  position: relative;
  margin-left: 30px;
}
.imgPic {
  width: 150px;
  height: 150px;
  position: relative;
  margin: 10px 0;
  border-radius: 10px;
  .el-upload:hover {
    border-color: #409eff;
  }
}
.del {
  position: absolute;
  font-size: 20px;
  width: 20px;
  height: 20px;
  color: #4e6e24;
  // top: 10px;
  // right: 20px;
  z-index: 100;
}
.img {
  border: 1px dashed gray;
  font-size: 50px;
  color: lightgray;
  text-align: center;
  line-height: 140px;
  cursor: pointer;
}
.myiclass {
  width: 150px;
  height: 150px;
  line-height: 150px;
  border: 1px dashed darkgray;
  display: block;
}
.form {
  width: 70%;
}
</style>