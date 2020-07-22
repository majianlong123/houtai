<template>
  <!-- <el-card> -->
    <el-dialog iconClass="el-icon-info" :title="'订单号'+item.order_sn+'发货信息'" width="500px" :visible.sync="isDialog" 
    :close-on-click-modal="false" @close="close">
      <el-form :model="innerItem" :rules="rules" ref="innerItem" label-position="right" label-width="100px">
      <el-form-item label="单号" prop="express_number">
        <el-input class="inp" placeholder="请输入单号" v-model="innerItem.express_number"></el-input>
      </el-form-item>
       
      </el-form>
      <span slot="footer">
        <el-button type @click="close">取消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </span>
    </el-dialog>
  <!-- </el-card> -->
</template>

<script>
// import { constants } from 'crypto'
export default {
  props: ['item'],
  data() {
    return {
      searchPage: 1,
      searchPageSize: 10000,
      searchList: [],
      searchGoodName: '',
      chanpin: [],
      isDialog: true,
      innerItem: {
        id: '',  
        express_number:"",
      },
      rules: {
        express_number: [{ required: true, message: '请输入单号' }],

      }
    }
  },
  created() {
      console.log(this.item)
    this.innerItem.id=this.item.order_id; 
  },
  methods: {
    close() {
      this.$emit('close')
    },
    submit() {
      this.$refs.innerItem.validate(valid => {
        if (!valid) return
          this.$http.post('/manage/order/deliver', {order_id:this.innerItem.id,express:this.innerItem.express,express_number:this.innerItem.express_number}).then(res => {    
            this.$emit('close', '1')
          }).catch(()=>{})
        
      })
    }
  }
}
</script>

<style scoped>
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
  width: 100%;
  height: 100%;
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
  width: 90%;
}
.duixiang {
  width: 80%;
}
.img {
  width: 150px;
  height: 150px;
  border: 1px dashed black;
  line-height: 150px;
}
img {
  width: 200px;
  height: 200px;
  cursor: pointer;
}
.src {
  width: 150px;
  height: 150px;
}
.test1 {
  font-size: 10px;
}
</style>

