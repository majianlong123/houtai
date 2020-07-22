<template>
  <el-dialog :title="this.id>0?'修改用户'+this.item.account+'个人信息':'新增用户'" 
      :visible.sync="isDialog" :close-on-click-modal="false" width="30%" top="100px"
      @close="dialogClose">
    <el-form :model="form" ref="form" :rules="rules" label-position="right" label-width="80px">
      <el-form-item label="推荐人" prop="parent_id" v-if="this.id<0">
         <el-select
          v-model="form.parent_id"
          filterable
          remote 
          clearable
          remote
          :remote-method="remoteMethod"
          placeholder="请输入手机号或昵称搜索选择"
          :loading="loading"
        >
          <el-option
            v-for="item in options"
            :key="item.member_id"
            :label="item.nickname"
            :value="item.member_id">
          </el-option>
        </el-select>
        <!-- <el-input v-model="form.parent_id" placeholder="请输入推荐人"></el-input> -->
      </el-form-item>
      <el-form-item label="手机号" prop="account" v-if="this.id<0">
        <el-input v-model="form.account" type="number" placeholder="请输入手机号"></el-input>
      </el-form-item> 
      <el-form-item label="账号" prop="account" v-if="this.id>0">
        <el-input v-model="form.account" placeholder="请输入账号"></el-input>
      </el-form-item>
      <el-form-item label="昵称" prop="nickname">
        <el-input v-model="form.nickname" placeholder="请输入昵称"></el-input>
      </el-form-item>
      <el-form-item label="级别" prop="level" v-if="this.id>0">
        <el-select
          v-model="form.level"
          filterable
          clearable
          placeholder="请选择级别"
          >
          <el-option
            v-for="item in level"
            :key="item.value"
            :label="item.label" 
            :value="item.value">
          </el-option>
        </el-select>       
      </el-form-item>
      
      
      
      
      <el-form-item label="登录密码" prop="password" v-if="this.id<0"> 
        <el-input v-model="form.password" placeholder="请输入登录密码"></el-input>
      </el-form-item>
      <!-- <el-form-item label="确认密码" prop="repassword" v-if="this.id<0">
        <el-input v-model="form.repassword" placeholder="请确认登录密码"></el-input>
      </el-form-item> -->
      <el-form-item label="支付密码" prop="pwdtwo" v-if="this.id<0">
        <el-input v-model="form.pwdtwo" placeholder="请输入支付密码"></el-input>
      </el-form-item>
      <!-- <el-form-item label="确认密码" prop="repwdtwo" v-if="this.id<0">
        <el-input v-model="form.repwdtwo" placeholder="请确认支付密码"></el-input>
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
    secret: Array,
    level: Array,
  },
  data() {
    return {
      isDialog: false,
      sex_screen: [
        { label: '男', value: '男' },
        { label: '女', value: '女' }
      ],
      form: {
        // member_id: '',
        account: '',
        nickname: '',
        password: '',
        pwdtwo: '',
        repwdtwo: '',
        repassword: '',
        num: '',
        parent_id:'',
        level: ''
      },
      loading: false,
      options:[],
      rules: {
        parent_id: [{ required: true, message: '请输入推荐人' }],
        // member_id: [{ required: true, message: '请输入用户ID' }],
        account: [{ required: true, message: '请输入手机号' }],
        nickname: [{ required: true, message: '请输入昵称' }],
        password: [{ required: true, message: '请输入登录密码' }],
        repassword: [{ required: true, message: '请确认登录密码' }],
        pwdtwo: [{ required: true, message: '请输入支付密码' }],
        repwdtwo: [{ required: true, message: '请确认支付密码' }],
        num: [{ required: true, message: '请输入账号'}],
        level: [{ required: true, message: '请输入级别'}],
      }
    }
  },
  watch: {
    isDialog(val) {
      if (val) {
        if (this.id > 0) {
          this.getInfo()
        }else{
          this.$refs.form.resetFields()
        // this.form.member_id = ''
          this.form.account = ''
          this.form.nickname = ''
          this.form.password = ''
          this.form.pwdtwo = ''
          this.form.repwdtwo = ''
          this.form.repassword = ''
          this.form.parent_id = ''
        }
          
      }
    }
  },
  computed: {},
  methods: {
    getInfo() { 
      this.form.account = this.item.account
      this.form.member_id = this.item.member_id
      this.form.nickname = this.item.nickname
      this.form.level = this.item.level > 99 ? 101 :  this.item.level + 1
      console.log(this.item.level);
    },
    toSave(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.id > 0) {
            let params = new URLSearchParams()
            params.append('member_id', this.form.member_id)
            params.append('account', this.form.account)
            params.append('nickname', this.form.nickname)
            params.append('level', this.form.level - 1)
            this.$http.post('/manage/member/edit', params).then(res => {
              this.isDialog = false
              console.log(this.form);
              this.$emit('getData')
            })
          } else {
            let params = new URLSearchParams()
            params.append('parent_id', this.form.parent_id)
            params.append('account', this.form.account)
            params.append('nickname', this.form.nickname)
            params.append('password', this.form.password)
            params.append('repassword', this.form.repassword)
            params.append('pwdtwo', this.form.pwdtwo)
            params.append('repwdtwo', this.form.repwdtwo)
            params.append('num', this.form.num)

            this.$http.post('/manage/member/add', params).then(res => {
              this.isDialog = false
              this.$emit('getData')
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
    dialogClose(){
      this.$refs.form.resetFields();
    },
    async remoteMethod(query){
      this.loading = true;
      console.log(this.form.parent_id);
      const {data: res} = await this.$http.get('/manage/member/lists',{params: {keywords: query}});
      console.log(res.lists);
      this.options = res.lists;
      this.loading = false
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
  
</style>