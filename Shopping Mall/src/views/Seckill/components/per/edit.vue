<template>
  <el-dialog :title="this.id>0?'修改期次'+form.name+'信息':'添加期次'" 
    :visible.sync="isDialog"
    :close-on-click-modal="false"
		@close="close"
    width="30%">
    <el-form :model="form"
      :rules="rules"
      ref="form"
      label-position="right"
      label-width="100px">
      
      <el-form-item label="名称" prop="name">
        <el-input v-model="form.name" 
          placeholder="请输入名称"></el-input>
      </el-form-item>

      <el-form-item label="时间" prop="time">
       <div>
          <el-date-picker
            v-model="form.time"
             type="datetimerange"
             align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="['12:00:00', '08:00:00']"    
            value-format="yyyy-MM-dd HH:mm:ss"/>
        </div>
      </el-form-item>
      <!-- <el-form-item label="权重"
        prop="sort">
        <el-slider v-model="form.sort"
          :max="255"
          show-input>
        </el-slider>
      </el-form-item> -->
    </el-form>
    <span slot="footer"
      class="dialog-footer">
      <el-button @click="isDialog = false">取 消</el-button>
      <el-button type="primary"
        @click="isOk('form')">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: {
    title:String,
    id: Number,
    item:Object
  },
  data() {
    return {
      isDialog: true,
      form: {
        name:'',
        time:[]
      },
      rules: {
        name:[{ required: true, message: '请输入名称' ,}],
        time: [{ required: true, message: '请选择时间'}],
      },
    }
  },
  
	created(){
    if(this.id > 0){
      this.getInfo();
    }
	},
  methods: {
    getInfo(){
        this.form.time[0] = this.item.start_time;
        this.form.time[1] = this.item.end_time;
        this.form.name = this.item.name;
        console.log(this.item);
        console.log(this.form);
		},
		close(val) {
      this.$emit("close", val);
      this.form = {};
    },
    isOk(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          console.log(this.id);
          if (this.id > 0){
            let params = new URLSearchParams()
            params.append('period_id', this.item.period_id)
            params.append('name', this.form.name)
            params.append('start_time', this.form.time[0])
            params.append('end_time', this.form.time[1])
            this.$http.post('/manage/seckill_period/edit', params).then(res => {
              this.close('1')
            })
          } else {
            let params = new URLSearchParams()
            params.append('name', this.form.name)
            params.append('start_time', this.form.time[0])
            params.append('end_time', this.form.time[1])
            this.$http.post('/manage/seckill_period/add', params).then(res => {
              this.close('1')
            })
          }
        }
      })
    },
  }
}
</script>

<style scoped lang="scss">
.good-img{
  width: 138px;
  height: 138px;
  padding: 5px;
  }
  div /deep/ .el-range-editor.el-input__inner{
    width: 100%
  }
</style>
