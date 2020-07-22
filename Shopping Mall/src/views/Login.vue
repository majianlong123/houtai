<template>
  <div class="login-container">
    <el-form
      ref="loginForm"
      :model="loginForm"
      class="login-form"
      :rules="rules"
      label-position="left"
    >
      <!-- <h3 class="title">潮π管理后台</h3> -->
      <img src="@/icons/png/logo.png" class="logo">
      <el-form-item prop="username">
        <el-input v-model="loginForm.username" placeholder="用户名"/>
      </el-form-item>

      <el-form-item prop="password">
        <el-input
          :type="pwdType"
          v-model="loginForm.password"
          placeholder="密码"
          @keyup.enter.native="handleLogin"
        />
      </el-form-item>

      <el-form-item>
        <el-button
          :loading="loading"
          type="primary"
          style="width:100%;"
          @click.native.prevent="handleLogin"
        >登 录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
  
<script>
import { mapState, mapMutations } from "vuex";

export default {
  name: "Login",
  created(){

  },
  data() {
    return {
      loginForm: {
        username: "",
        password: ""
      },

      loading: false,
      pwdType: "password",

      rules: {
        username: [{ required: true, message: "请填写用户名", trigger: "blur" }],
        password: [{ required: true, message: "请填写密码", trigger: "blur" }]
      }
    };
  },

  methods: {
    ...mapMutations(["LOG_IN"]),

    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true;
          this.login();
        } else {
          return false;
        }
      });
    },

    login() {
      let params = new FormData()
        params.append('account', this.loginForm.username)
        params.append('password', this.loginForm.password)
        this.$http.post("/manage/pub/login", params).then(res => {
          console.log(res)
          // this.$store.state.username = this.loginForm.username;
          if (res.code == 1) {
            this.LOG_IN({
              token: res.data.mytoken.token
            });
            this.$http.get("/manage/common/info").then(res => {
              this.$store.state.username = res.data.info.nickname;
            });
            this.$router.push({
              path:"/"
            });
          }
          this.loading = true;
        })
        .catch(err => {
          this.loading = false;
          this.$router.push("/login");
        });
    }
  }
};
</script>

<style lang="scss" scoped>
$dark_gray: #889aa4;
$light_gray: #eee;
$bg: #2d3a4b;

.login-container {
  position: fixed;
  height: 100%;
  width: 100%;
  background-color: $bg;
  overflow-y: auto;

  .login-form {
    position: absolute;
    left: 0;
    right: 0;
    width: 520px;
    max-width: 100%;
    min-height: 400px;
    padding: 35px 35px 15px 35px;
    margin: 120px auto;
  }

  .title {
    font-size: 26px;
    font-weight: 400;
    color: $light_gray;
    margin: 0px auto 40px auto;
    text-align: center;
    font-weight: bold;
  }
  .logo{
    margin: -40px 180px 50px 180px;
    width: 160px;
    height: 160px;
    border-radius: 10px;
  }
}

.img {
  width: 215px;
  height: 200px;
  border-radius: 30px;
  margin-left: 50%;
  transform: translateX(-50%);
  margin-bottom: 50px;
}
.login-container {
  /deep/ .el-input {
    height: 47px;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: #fff !important;
      }
    }
  }

  /deep/ .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>
