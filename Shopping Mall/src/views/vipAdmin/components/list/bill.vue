<template>
  <el-dialog :title="'会员'+title+'-账单'"
    :visible.sync="isDialog"
    :close-on-click-modal="false"
		@close='close'
    width="50%"
    top="150px">
      <div  style="margin-bottom: 30px;">
        
        <el-select v-model="clas" @change="filterData"   placeholder="选择变动类型" clearable>
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
      </div>
      <el-table :data="tableData" border>

        <el-table-column label="变动类型" align="center" min-width="100">
          <template slot-scope="{row}">{{row.class_str}}</template>
        </el-table-column>

				<el-table-column label="充值金额" align="center" min-width="100">
          <template slot-scope="{row}">{{row.amount}}</template>
        </el-table-column>

        <el-table-column label="创建时间" align="center" min-width="100">
          <template slot-scope="{row}">{{row.create_time}}</template>
        </el-table-column>

        <el-table-column label="备注" align="center" min-width="100">
          <template slot-scope="{row}">{{row.remark}}</template>
        </el-table-column>
      </el-table>

    <BasePagination :max="maxPage" :now.sync="nowPage"></BasePagination>
  </el-dialog>
</template>

<script>
import BasePagination from "@/components/BasePagination";
export default {
  props: {
    id:Number,
    title:String
  },
  data() {
    return {
      isDialog: false,
      maxPage:1,
      nowPage:1,
      tableData:[],
      class_screen:[],
      clas:'',
      account: '',
      account_screen: [],
      timeArr:[]
		}
  },
  watch: {
    nowPage() {
      this.getList();
    },
    isDialog(val){
      if(val){
        this.getList();
      }else{
        this.timeArr = []
        this.tableData = []
        this.clas=''
        this.nowPage = 1
      }
    }
	},
  methods: {
		close(val){
			this.$emit('close',val)
		},
    getList(){
      this.$http
        .get('/manage/member_bill/lists', {
          params: {
            rows: 5,
            page: this.nowPage,
            member_id: this.id,
            class:this.clas,
            account:this.account,
            starttime: this.timeArr?this.timeArr[0]:'' ,
            endtime: this.timeArr?this.timeArr[1]:'',
          }
        })
        .then(res => {
          this.tableData = res.data.list
          this.class_screen = res.data.class_screen
          this.account_screen = res.data.account_screen
					this.maxPage = res.data.page_total;
					console.log(res)
        })
    },
    filterData() {
      this.nowPage == 1 ? this.getList() : (this.nowPage = 1);
    },
  },
  created() {},
  mounted() {}
}
</script>
<style module lang="scss">

</style>