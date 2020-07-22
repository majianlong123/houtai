<template>
  <el-dialog :title="'统计-' + this.title + '供货商'"
    :visible.sync="isDialog"
    :close-on-click-modal="false"
		@close='close'
    width="60%"
    top="150px">
    <div>
      <el-date-picker v-model="date" clearable @change="filterData"
        type="daterange" range-separator="至"
        value-format="yyyy-MM-dd"
        start-placeholder="开始日期" end-placeholder="结束日期">>
      </el-date-picker>

      <el-button @click="filterData" type="primary" style="margin-left:30px">
        搜索
        <i class="el-icon-search"></i>
      </el-button>
    </div>
    <el-tabs  >
      <el-tab-pane label="订单清单" >
        <el-table border :data="Checklist" >
          <el-table-column label="商品名称" align="center" prop="goods_name"/>
          <el-table-column label="商品规格" align="center" prop="spec_name"/>
          <el-table-column label="销售数量" align="center" prop="buy_num"/>
        </el-table>
      </el-tab-pane>
    </el-tabs>

  </el-dialog>
</template>

<script>
export default {
  props: {
    id:Number,
    title:String,
    item:Object,
    supplier_id: Number
  },
  data() {
    return {
      isDialog: true,
      maxPage:1,
      nowPage:1,
      tableData:[],
      class_screen:[],
      clas:'',
      timeArr:[],
      Checklist: [],
      logsData: [],
      // activeName: '',
      endtime: '',
      date: []
		}
  },
  created() {
    this.getList();
    this.getTime()
  },
  methods: {
		close(){
			this.$emit('close')
    },
    getTime() {
      this.$http.get('/manage/supplier/goods',{
        params: {
          supplier_id: this.supplier_id,
          starttime: this.date?this.date[0]:"",
          endtime: this.date?this.date[1]:"",
        }
      }).then(res => {
        this.Checklist = res.data.list
      })
    },
    filterData() {
      this.nowPage == 1 ? this.getList() : (this.nowPage = 1)
    },
    async getList(){
      const [item, logs] = await Promise.all([
        this.$http.get('/manage/supplier/goods',{
          params:{
            supplier_id: this.supplier_id
          }
        }).then(res => {
          console.log(res)
          this.Checklist = res.data.list
          // this.activeName = 'first'
          // console.log(this.Checklist)
        }),
      ]);
      },
  },
}
</script>
<style  lang="scss">
 .tableImg  img{
  width: 70px;
  height: 70px;
}

</style>