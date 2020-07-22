<template>
  <el-dialog title="新增参数" :close-on-click-modal="false" :visible.sync="dialogVisible" width="30%" :center="true" @close="close">
    <el-form label-position="left" label-width="100px" :rules="rules" :model="item" ref="item">
      <el-form-item label="参数ID：" prop="id">
        <el-input class="inp" v-model="item.id" placeholder="请输入参数ID"></el-input>
      </el-form-item>
      <el-form-item label="参数名称：" prop="name">
        <el-input class="inp" v-model="item.name" placeholder="请输入参数名称"></el-input>
      </el-form-item>
      <el-form-item label="参数值：" prop="value">
        <el-input class="inp" v-model="item.value" placeholder="请输入参数值"></el-input>
      </el-form-item>
      <el-form-item label="备注：" prop="remark">
        <el-input class="inp" v-model="item.remark" placeholder="请输入备注"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="submit">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      item: {
        id: "",
        name: "",
        remark: "",
        value: ""
      },
      dialogVisible: true,
      rules: {
        id: [
          {
            required: true,
            message: "请输入参数ID"
          }
        ],
        name: [
          {
            required: true,
            message: "请输入参数名称"
          }
        ],
        value: [
          {
            required: true,
            message: "请输入参数值"
          }
        ],
        remark: [
          {
            required: true,
            message: "请输入备注"
          }
        ]
      }
    };
  },
  methods: {
    close() {
      this.$emit("close");
    },
    submit() {
      this.$refs.item.validate(valid => {
        if (!valid) return;
        let params = new URLSearchParams();
        params.append("id", this.item.id);
        params.append("name", this.item.name);
        params.append("value", this.item.value);
        params.append("remark", this.item.remark);
        this.$http.post("/manage/param/add", params).then(res => {
          if (res.code == 1) {
            this.$emit('close','1')
          }
        });
      });
    }
  }
};
</script>

