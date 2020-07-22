<template>
  <el-dialog :title="'商品清单'"
    :visible.sync="isDialog"
    :close-on-click-modal="false"
		@close='close'
    width="60%"
    top="150px">

      <div :class="$style.header">
        <div :class="$style.search">
          <span>搜索：</span>
        </div>

        <div>
          <el-input v-model="keywords" placeholder="请输入商品名称" @change="filterData" clearable />
        </div>
        <!-- <div>
          <el-date-picker v-model="date" clearable @change="filterData"
            type="daterange" range-separator="至"
            value-format="yyyy-MM-dd"
            start-placeholder="开始日期" end-placeholder="结束日期">>
          </el-date-picker>
        </div> -->

        <el-button @click="filterData" type="primary">
          搜索
          <i class="el-icon-search"></i>
        </el-button>
        <div space></div>
      </div>

        <el-table  :data="Checklist" >
          <!-- <el-table-column label="供货商名称" align="center" prop="supplier_name"/> -->
          <!-- <el-table-column label="商品图片" align="center" >
             <template slot-scope="prop">
              <a :href="prop.row.thumb" target="_blank">
                <img :src="prop.row.thumb"
                  style="width:100%;height:150px"> 
              </a>
            </template>
          </el-table-column> -->
          <el-table-column label="商品名称" align="center" prop="goods_name"/>
          <el-table-column label="商品规格" align="center" prop="spec_name"/>
          <el-table-column label="数量" align="center" prop="buy_num"/>
          <!-- <el-table-column label="成交价格" align="center" prop="final_price"/> -->
        </el-table>
      <!-- </el-tab-pane> -->

    <!-- </el-tabs> -->
    <BasePagination :max="maxPage" :now.sync="nowPage"/>
  </el-dialog>
</template>

<script>
export default {
  props: {
    id:Number,
    title:String,
    item:Object,
    period: String,
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
      activeName: 'first',
      keywords: '',
      date: []
		}
  },

  created() {
    this.getList();
  },
  watch: {
    nowPage() {
      this.getList()
    }
  },
  methods: {
		close(){
			this.$emit('close')
		},

    getList() {
      this.$http.get('/manage/invoice_bill/lists',{
        params: {
          rows: 6,
          page: this.nowPage,
          period: this.period,
          supplier_id: this.supplier_id,
          keywords: this.keywords,
          starttime: this.date?this.date[0]:"",
          endtime: this.date?this.date[1]:"",
        }
      }).then(res => {
        this.tableData = res.data.list
        this.Checklist = res.data.list;
        this.maxPage = res.data.page_total
        console.log(res)
      })
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
<style lang="scss" module>
.header {
  display: flex;
  align-items: center;

  > div {
    flex-grow: 0;
    flex-shrink: 0;

    &:not(:last-child) {
      margin-right: 10px;
    }

    > span {
      margin-right: 5px;
    }
  }

  .search {
    display: flex;
    align-items: center;

    > div {
      width: 200px;
    }
  }

  [space] {
    flex-grow: 1;
  }
}
</style>
<style  lang="scss">
 .tableImg  img{
  width: 70px;
  height: 70px;
}
</style>