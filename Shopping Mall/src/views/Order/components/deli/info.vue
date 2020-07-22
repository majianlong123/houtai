<template>
  <el-dialog :title="'订单-'+item.order_sn+'-详情'"
    :visible.sync="isDialog"
    :close-on-click-modal="false"
		@close='close'
    width="60%"
    top="150px">

    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="订单信息" name="first" key="first">

        <el-table border :data="tableData" v-if="activeName == 'first'" >
          <el-table-column label="订单号" align="center" prop="order_sn"/>
        </el-table>
      </el-tab-pane>

      <el-tab-pane label="订单清单" name="third" key="third">
        <el-table border :data="Checklist" v-if="activeName == 'third'">
          <el-table-column label="商品名称" align="center" prop="goods_name"/>
          <el-table-column label="规格名称" align="center" prop="spec_name"/>
          <el-table-column label="购买数量" align="center" prop="buy_num"/>
          <el-table-column label="商品图片" align="center" >
             <template slot-scope="prop">
              <a :href="prop.row.thumb" target="_blank">
                <img :src="prop.row.thumb"
                  style="height:100px"> 
              </a>
            </template>
          </el-table-column>
          <el-table-column label="成交价格" align="center" prop="final_price"/>
          <el-table-column label="退货数量" align="center" prop="refund_num"/>
          <el-table-column label="退款金额" align="center" prop="refund_money"/>
          <el-table-column label="退款状态" align="center" prop="refund_str"/>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="订单日志" name="fourth" key="fourth">
        <el-table border :data="logsData" v-if="activeName == 'fourth'">
          <el-table-column label="操作内容" align="center" prop="content"/>
          <el-table-column label="备注" align="center" prop="remark"/>
          <el-table-column label="创建时间" align="center" prop="create_time"/>
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
      activeName: ''
		}
  },
  // watch: {
  //   isDialog(val){
  //     if(val){
  //       this.getList();
  //     }
  //   }
  // },
  created() {
      this.getList();
  },
  methods: {
		close(){
			this.$emit('close')
		},
    async getList(){
      const [item, logs] = await Promise.all([
        this.$http.get('/manage/order_item/lists',{params:{order_id: this.id}}),
        this.$http.get('/manage/order_logs/lists',{params:{order_id: this.id}}),
      ]);
      this.Checklist = item.data.list;
      this.logsData = logs.data.list;
      this.tableData[0] = this.item;
      this.activeName = 'first';
      // this.tableData.push(Object.assign(item.data.list[0], logs.data.list[0], this.item));
      console.log(this.tableData);
      },
    handleClick(tab) {
      this.activeName = tab.name;
      console.log(this.activeName);
    },
    filterData() {
      this.nowPage == 1 ? this.getList() : (this.nowPage = 1);
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