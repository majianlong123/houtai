<template>
  <el-dialog
    :title="title"
    :visible.sync="isDialog"
    :close-on-click-modal="false"
    @close="close"
    width="30%"
  >
    <el-form :model="form" :rules="rules" ref="form" label-position="right" label-width="100px">


      <el-form-item label="提货点名称" prop="name">
        <el-input v-model="form.name" placeholder="请输入提货点名称"  show-word-limit></el-input>
      </el-form-item>

      <el-form-item label="联系电话" prop="contact">
        <el-input v-model="form.contact" placeholder="请输入联系电话"  show-word-limit></el-input>
      </el-form-item>
      
      <el-form-item label="区域" prop="region_id">
        <el-cascader
          clearable
          :show-all-levels = "false"
          :options="options"
          @change="handleChange"
          placeholder="请选择区域"
        >
        </el-cascader>
      </el-form-item>

      <el-form-item label="详细地址" prop="address">
        <el-input v-model="form.address" placeholder="请输入详细地址"  show-word-limit></el-input>
      </el-form-item>

    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="isDialog = false">取 消</el-button>
      <el-button type="primary" @click="isOk('form')">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: {
    title: String,
    id: Number,
    member_id: Number
  },
  data() {
    return {
      value: [],
      options: [{}],
      loading: false,
      chanpin:[],
      isDialog: true,
      form: {
        contact: null,
        thumb: "",
        sort: null,
        region_id: '',
        member_id: '',
        name: '',
        contact: null,
        address: ''
      },
      rules: {
        name: [{ required: true, message: '请输入提货点名称' }],
        contact: [{ required: true, message: '请输入联系电话' }],
        region_id: [{ required: true, message: '请选择区域' }],
        address: [{ required: true, message: '请输入详细地址' }],
      }
    };
  },

  created() {

    this.Screen();
  },
  methods: {
    handleChange(value) {
      console.log(value);
      const quyuID = value[value.length-1]
      this.form.region_id = quyuID
      console.log(this.form.region_id)
    },
    Screen() {
      this.$http.get('/manage/region/idx',{})
      .then((res) => {
        this.value = res.data.regions
        this.options = res.data.regions
      })
    },
    close(val) {
      this.$emit("close", val);
    },
    isOk() {
      this.$http
        .post('/manage/store/set', {
            member_id: this.member_id,
            region_id: this.form.region_id,
            name: this.form.name,
            contact: this.form.contact,
            address: this.form.address,
        })
        .then((res) => {
          this.isDialog = false
        })
        .catch((err) => {
          console.log('参数不对')
        })
    }
  }
};
</script>

<style scoped>
.el-select {
  width:100%
}
div /deep/ .el-upload{
  width: 200px;
  height: 150px;
}
.good-img {
  width: 180px;
  height: 130px;
  padding: 10px;
}
.src {
  width: 150px;
  height: 150px;
}
img {
  width: 150px;
  height: 150px;
}
.img {
  width: 150px;
  height: 150px;
  border: 1px dashed black;
  line-height: 150px;
}
.test1{
  font-size: 10px;
}
</style>
