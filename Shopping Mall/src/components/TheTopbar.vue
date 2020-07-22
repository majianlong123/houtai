<template>
  <div>
    <div :class="$style.topBar">
      <div :class="$style.breadcrumb">
        <img svg :src="pic" @click="scrollNav">
        <img home src="@/assets/-svg/home.svg">

        <el-breadcrumb separator=">">
          <el-breadcrumb-item to="/">首 页</el-breadcrumb-item>
          <el-breadcrumb-item v-if="$route.meta.title"  style="cursor: pointer" @click.native="brandItemClick">{{ $route.meta.title }}</el-breadcrumb-item>
          <el-breadcrumb-item v-if="$route.meta.title == '商品列表'">{{ $store.state.goodsStatusStr}}</el-breadcrumb-item>
        </el-breadcrumb>  
      </div>

      <div :class="$style.user">
        <el-dropdown>
          <span class="el-dropdown-link">
            {{username}}
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="$router.push('/')">首 页</el-dropdown-item>
            <el-dropdown-item divided @click.native="isDialog = true">修改密码</el-dropdown-item>
            <el-dropdown-item @click.native="logout">登 出</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <img src="@/icons/png/logo.png" width="40" height="40" m-r-10>
      </div>
    </div>

    <!-- <TagsView></TagsView> -->

    <el-dialog :visible.sync="isDialog" title="修改密码" width="480px" :modal-append-to-body="false" :close-on-click-modal="false">
      <el-form
        :model="pwdData"
        label-position="left"
        label-width="120px"
        ref="pwd"
        :rules="pwdRules"
      >
        <el-form-item label="旧密码" prop="old">
          <el-input v-model="pwdData.old" placeholder="请输入旧密码"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="password">
          <el-input type="password" v-model="pwdData.password" placeholder="请输入新密码"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="repassword">
          <el-input type="password" v-model="pwdData.repassword" placeholder="请输入确认密码"></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer">
        <el-button @click="isDialog = false">取 消</el-button>
        <el-button type="primary" @click="changePwd">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
// import TagsView from "@/components/TagsView";

export default {
  components: {
    // TagsView
  },
  created() {
    this.$http.get("/manage/common/info").then(res => {
      this.username = res.data.info.nickname;
    });
    //this.username = this.$route.query.data;    
  },
  data() {
    const repassword = (rule, value, callback) => {
      if (value !== this.pwdData.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };

    return {
      username: "",
      isDialog: false,
      pwdData: {},

      pwdRules: {
        old: [{ required: true, message: "请输入旧密码", trigger: "blur" }],
        password: [
          { required: true, message: "请输入新密码", trigger: "blur" }
        ],
        repassword: [
          { required: true, message: "请确认新密码", trigger: "blur" },
          { validator: repassword, trigger: "change" }
        ]
      }
    };
  },

  computed: {
    ...mapState(["isNavShrink"]),

    pic() {
      if (this.isNavShrink) {
        return require("@/assets/-svg/展开.svg");
      } else {
        return require("@/assets/-svg/收缩.svg");
      }
    }
  },

  watch: {
    isDialog(val) {
      if (val) return;
      this.$refs.pwd.resetFields();
    }
  },

  methods: {
    ...mapMutations(["LOG_OUT"]),

    logout() {
      this.$confirm("确定退出登录 ?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true
      })
        .then(() => {
          this.$router.push("/login");
          this.LOG_OUT();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "您已取消登出"
          });
        });
    },

    scrollNav() {
      this.$store.commit("SCROLL_NAV");
    },
    changePwd() {
      this.$refs.pwd.validate(valid => {
        if (!valid) return false;
        let params = new URLSearchParams()
        params.append('oldpassword', this.pwdData.old)
        params.append('password', this.pwdData.password)
        this.$http.post("/manage/common/reset", params).then(res => {
          if (res.code == 1) {
            this.isDialog = false;
            this.$router.push("/login");
            this.LOG_OUT();
          }
        });
      });
    },
    brandItemClick(){
      if(this.$store.goodsStatusStr = '添加商品'){
        this.$store.commit('GOODS_STATE');
        console.log(this.$store.state.goodsStatusStr);
      }
    }
  }
};
</script>

<style module lang="scss">
.topBar {
  height: 60px;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.breadcrumb {
  display: flex;
  align-items: center;

  [svg] {
    width: 20px;
    height: 20px;
    cursor: pointer;
    margin-right: 20px;
  }

  [home] {
    margin-right: 10px;
    width: 20px;
    height: 20px;
  }

  span {
    color: #97a8be !important;
  }
}

.user {
  display: flex;
  align-items: center;

  img {
    margin-left: 10px;
    width: auto;
    height: 40px;
  }

  > *:first-child {
    cursor: pointer;
  }
}
</style>
