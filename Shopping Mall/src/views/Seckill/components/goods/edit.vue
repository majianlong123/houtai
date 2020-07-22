<template>
  <el-dialog :title="this.id>0?'修改商品'+item.goods_name+'信息':'新增商品'"  append-to-body
    :visible.sync="isDialog"
    :close-on-click-modal="false"
		@close="close"
    width="30%">
    <el-form :model="form"
      :rules="rules"
      ref="form"
      label-position="right"
      label-width="100px">
      
      <!-- <el-form-item label="名称" prop="name">
        <el-input v-model="form.name" 
          placeholder="请输入名称"></el-input>
      </el-form-item> -->
      
      <!-- <el-form-item label="秒杀期次" prop="period_id" >
        <el-select
          v-model="form.period_id"
          filterable
          clearable
          placeholder="请选择秒杀期次"
          >
          <el-option
            v-for="item in periodSelect"
            :key="item.period_id"
            :label="item.name" 
            :value="item.period_id">
          </el-option>
        </el-select>       
      </el-form-item> -->

      <el-form-item label="商品" prop="goods_id" v-cloak v-if="this.id<0">
        <el-select
          v-model="form.goods_id"
          filterable
          clearable
          placeholder="请选择商品"
          @change="requestSpec"
          remote
          :remote-method="remoteMethod"
          >
          <el-option
            v-for="item in goodsSelect"
            :key="item.goods_id"
            :label="item.name" 
            :value="item.goods_id">
          </el-option>
        </el-select>       
      </el-form-item>

      <el-form-item label="规格" prop="spec_id" >
        <el-select
          v-model="form.spec_id"
          filterable
          clearable
          placeholder="请选择规格"
          >
          <el-option
            v-for="item in specSelect"
            :key="item.spec_id"
            :label="item.spec_name" 
            :value="item.spec_id">
          </el-option>
        </el-select>       
      </el-form-item> 

      <el-form-item label="秒杀价" prop="price">
        <el-input v-model="form.price"  type="number"
          placeholder="请输入秒杀价"></el-input>
      </el-form-item>

      <el-form-item label="佣金" prop="reward">
        <el-input v-model="form.reward"  type="number"
          placeholder="请输入佣金"></el-input>
      </el-form-item>

      <el-form-item label="秒杀数量" prop="number">
        <el-input v-model="form.number"  type="number"
          placeholder="请输入秒杀数量"></el-input>
      </el-form-item>

      <!-- <el-form-item label="备注" prop="remark">
        <el-input v-model="form.remark"  type="textarea" :rows="2" placeholder="请输入备注"></el-input>
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
    pid: Number,
    item:Object
  },
  data() {
    return {
      isDialog: true,
      form: {
      },
      goodsSelect: [],
      periodSelect: [],
      specSelect: [],
      rules: {
        goods_id:[{ required: true, message: '请选择商品' ,}],
        period_id:[{ required: true, message: '请选择秒杀期次' ,}],
        spec_id:[{ required: true, message: '请选择规格' ,}],
        price:[{ required: true, message: '请输入秒杀价' ,}],
        reward:[{ required: true, message: '请输入佣金' ,}],
        number:[{ required: true, message: '请输入秒杀数量' ,}],
        // remark:[{ required: true, message: '请输入备注' ,}],
      },
    }
  },
  
	created(){
    if(this.id > 0){
      this.getInfo();
    }
    this.getSelect();
	},
  methods: {
    getInfo(){
        this.form = this.item;
        this.form.goods_id = this.item.goods_name;
        this.form.spec_id = this.item.spec_name;
        console.log(this.item);
    },
    async getSelect(){
      const {data: res} = await this.$http.get('manage/seckill_period/lists');
      this.periodSelect = res.list;  
    }, 
    async remoteMethod(query){
      query = query.trim();
      if(!query) return;
      const {data: res} = await this.$http.get('/manage/goods/lists' , {params:{keywords:query}});
      this.goodsSelect = res.list;
    },
    async requestSpec(){
      const {data: res} = await this.$http.get('/manage/goods_spec/lists',{params:{goods_id:this.form.goods_id}});
      this.specSelect = res.list;
      console.log(res.list);
    },
		close(val) {
      this.$emit("close",val);
    },
    isOk(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.id > 0){
            let params = new URLSearchParams()
            params.append('seckill_id',  this.form.seckill_id);
            params.append('reward',  this.form.reward);
            params.append('number',  this.form.number);
            params.append('price',  this.form.price);
            // params.append('goods_id',  this.item.goods_id);
            this.$http.post('/manage/seckill/edit', params).then(res => {
                this.close('1')
            })
          } else {
            this.form.period_id = this.pid;
            console.log(this.form);
            this.$http.post('/manage/seckill/add', this.form).then(res => {
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
.el-select{
  width: 100%
}
.good-img{
  width: 138px;
  height: 138px;
  padding: 5px;
  }
</style>
