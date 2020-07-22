<template>
  <el-card>
    <el-dialog
      iconClass="el-icon-info"
      :close-on-click-modal="false"
      title="修改规格"
      width="30%"
      :visible.sync="isDialog"
      @close="close"
      :center="true"
    >
      <el-form :model="item1" :rules="rules" ref="item1" label-position="right" label-width="100px">
        <el-form-item class="duixiang" label="名称：" prop="spec_name">
            <el-input v-model="item1.spec_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button type @click="isDialog = false">取消</el-button>
        <el-button type="primary" @click="submit()">确 定</el-button>
      </span>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  props: ["item2"],
  created() {
    // this.item1 = this.item2
    this.item1.spec_id = this.item2.spec_id
    this.item1.spec_name = this.item2.spec_name
  },
  data() {
    return {
      item1:{
        spec_name:""
      },
      isDialog: true,
      rules: {
        spec_name:[{required: true,message: "请输入规格名称"}],
      },
    };
  },
  methods: {
    close() {
      this.$emit("close");
    },
    submit(item1) {
      
      this.$refs.item1.validate(valid => {
      console.log(valid);
        if(!valid)return
        let params = new URLSearchParams();
          params.append("spec_id", this.item1.spec_id);
          params.append("spec_name", this.item1.spec_name);
          this.$http.post("/manage/cash_goods_spec/edit", params).then(res => {
            if (res.code == 1) {
              this.$emit("close","1");
            }
          });
      })
    }
  }
};
</script>

<style>
.block {
  width: 70%;
  margin-left: 15px;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader {
  margin-left: 20px;
}
.avatar {
  width: 80%;
  height: 60%;
}
.u_editor {
  height: 500px;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 200px;
  height: 200px;
  line-height: 200px;
  text-align: center;
}
.leixing {
  width: 75%;
}
.duixiang {
  width: 80%;
}
</style>

