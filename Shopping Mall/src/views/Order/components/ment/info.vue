<template>
  <el-dialog :title="'订单-'+item.order_sn+'-详情'"
    :visible.sync="isDialog"
    :close-on-click-modal="false"
		@close='close'
    width="60%"
    top="150px">
      <!-- <div>
        <el-select v-model="clas" @change="filterData"   placeholder="选择类型" clearable>
          <el-option
            v-for="item in class_screen"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>

        <el-date-picker v-model="timeArr"
          value-format="yyyy-MM-dd"
          type="daterange" clearable
          @change="filterData"
          :unlink-panels="true"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          style="margin-left: 20px;">
        </el-date-picker>
      </div> -->
      <!-- <el-table :data="tableData" border> -->
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="订单信息" name="first" key="first">

        <el-table border :data="tableData" v-if="activeName == 'first'" >
          <el-table-column label="订单号" align="center" prop="order_sn"/>
        </el-table>
      </el-tab-pane>
      <!-- <el-tab-pane label="配送信息" name="second" key="second">
        <el-table border :data="tableData" v-if="activeName == 'second'">
          <el-table-column label="收货人" align="center" prop="linkman">
            <template slot-scope="{row}">
              {{row.linkman}}
            </template>
          </el-table-column>
          <el-table-column label="联系电话  " align="center" prop="contact"/>
          <el-table-column label="收货地址" align="center" prop="address"/>
          <el-table-column label="配送方式 " align="center" prop="order_sn"/>
          <el-table-column label="快递公司" align="center" prop="order_sn"/>
          <el-table-column label="快递单号" align="center" prop="order_sn"/>
          <el-table-column label="配送师傅" align="center" prop="order_sn"/>
          <el-table-column label="师傅电话" align="center" prop="order_sn"/>
           
        </el-table>
      </el-tab-pane> -->
      <el-tab-pane label="订单清单" name="second" key="second">
        <el-table border :data="Checklist" v-if="activeName == 'second'">
          <el-table-column label="商品名称" align="center" prop="goods_name"/>
          <el-table-column label="购买数量" align="center" prop="buy_num"/>
          <el-table-column label="商品图片" align="center" >
             <template slot-scope="prop">
              <a :href="prop.row.thumb" target="_blank">
                <img :src="prop.row.thumb"
                  style="width:100%;height:150px"> 
              </a>
            </template>
          </el-table-column>
          <el-table-column label="成交价格" align="center" prop="final_price"/>
          <el-table-column label="规格名称" align="center" prop="spec_name"/>
          <el-table-column label="是否评论过" align="center" prop="is_comment"/>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="订单日志" name="third" key="third">
        <el-table border :data="logsData" v-if="activeName == 'third'">
          <el-table-column label="操作内容" align="center" prop="content"/>
          <el-table-column label="备注" align="center" prop="remark"/>
          <el-table-column label="创建时间" align="center" prop="createtime"/>

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
      activeName: 'first'
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
      this.logsData = item.data.list;
      this.tableData[0] = this.item;
      // this.tableData.push(Object.assign(item.data.list[0], logs.data.list[0], this.item));
      console.log(this.tableData);
      },
    handleClick(tab) {
      this.activeName = tab.name;
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