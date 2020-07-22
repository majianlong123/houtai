<template>
  <el-dialog
    :title="item.name"
    :visible.sync="dialogVisible"
    width="25%"
    :center="true"
    :close-on-click-modal="false"
    @close="close"
  >
    <el-form label-position="left" label-width="100px" :model="item" ref="item" :rules="rules">
      <el-form-item label="参数ID" prop="id">
        <el-input class="inp" v-model="item.id" placeholder="请输入参数ID"></el-input>
      </el-form-item>
      <el-form-item label="参数名称" prop="name">
        <el-input class="inp" v-model="item.name" placeholder="请输入参数名称"></el-input>
      </el-form-item>
      <el-form-item label="参数值" prop="value">
        <el-input class="inp" v-model="item.value" placeholder="请输入参数值"></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input class="inp" v-model="item.remark" placeholder="请输入备注"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="submit">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: ["item"],
  data() {
    return {
      dialogVisible: true,
      rules: {
        name: [
          {
            required: true,
            message: "名称不能为空"
          }
        ],
        id: [
          {
            required: true,
            message: "ID不能为空"
          }
        ],
        value: [
          {
            required: true,
            message: "参数值不能为空"
          }
        ],
        remark: [
          {
            required: true,
            message: "备注不能为空"
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
        this.$http.post("/manage/param/edit", params).then(res => {
          if (res.code == 1) {
            this.dialogVisible = false;
          }
        });
      });
    }
  }
};
</script>