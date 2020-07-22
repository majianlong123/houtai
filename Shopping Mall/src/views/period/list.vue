<template>
  <div>
    <el-card>
      <div slot="header" :class="$style.header">
        <div :class="$style.search">
          <span>搜索：</span>
          <!-- <el-input v-model="supplier_id" placeholder="请输入供货商名称" @change="filterData" clearable /> -->
        </div>
        <div>
          <el-input v-model="period" placeholder="请输入期次" @change="filterData" clearable />
        </div>
        <div>
          <el-select v-model="state" @change="filterData" placeholder="请选择配货状态" clearable>
            <el-option
              v-for="item in state_screen"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>

        <el-button @click="filterData" type="primary">
          搜索
          <i class="el-icon-search"></i>
        </el-button>
        <div space></div>
        <el-button @click="excel()" class="excel" type="success">
          导出EXCEL
        </el-button>
      </div>

      <el-table :data="goodsData">
        
        <el-table-column label="期次" align="center">
          <template slot-scope="{row}">{{row.period}}</template>
        </el-table-column>

        <el-table-column label="供货商" align="center"  >
          <template slot-scope="{row}">{{row.supplier_name}}</template>
        </el-table-column>

        <el-table-column label="供货种类" align="center">
          <template slot-scope="{row}">{{row.goods_num}}</template>
        </el-table-column>

        <el-table-column label="供货数量" align="center">
          <template slot-scope="{row}">{{row.goods_buy_num}}</template>
        </el-table-column>

        <el-table-column label="状态" align="center">
          <template slot-scope="{row}">{{row.status_str}}</template>
        </el-table-column>

        <el-table-column label="操作" min-width="130" align="center">
          <template slot-scope="{row}">

            <el-button @click="showInfo(row)" size="mini" type="success" >
              清单
            </el-button>
            <el-button @click="states(row, '商品')" size="mini" :type="row.status == 1?'success':'danger'">
              {{row.status_str}}
            </el-button>
            <!-- <el-button v-if="row.refund=== 0" @click="ship(row)" size="mini" type="primary">
              发货
            </el-button> -->
          </template>
        </el-table-column>
      </el-table>
      <!-- 弹出对话框 -->
      <BasePagination :max="maxPage" :now.sync="nowPage"/>
       <info ref="info" v-if="infoVisible"  :id="id" :item="item" :title="title" @close="close"  :supplier_id="supplier_id"/>
    </el-card>
  </div>
</template>
<script>
import info from './compinents/list/info'
export default {
  components: {
    info,
  },
  created() {
    if(this.$route.query.data){ 
    console.log(this.$route.query.data);
      this.state = this.$route.query.data.state;
       this.team_id = this.$route.query.data.team_id;
      this.store_id = this.$route.query.data.store_id;
    }
    this.getData()
  },
  data() {
    return {
      infoVisible: false,
      state: '',
      state_screen: [],
      goodsData: [],
      date:[],
      maxPage: 1,
      nowPage: 1, 
      id: null,
      title: '',
      item: {},
      manage: '',
      artist: '',
      period:'',
      supplier_id: null,
      member: '',
      express_screen:[],
      fahuodia:false,
      keywords: ''
    }
  },
  watch: {
    nowPage() {
      this.getData()
    }
  },
  methods: {
    getData() {
      this.$http
        .get('/manage/invoice/lists', {
          params: {
            rows: 10,
            page: this.nowPage,
            period: this.period,
            supplier_id: this.supplier_id,
            state: this.state,
          }
        })
        .then(res => {
          this.goodsData = res.data.list
          this.state_screen = res.data.state_screen,
          console.log(this.goodsData)
        })
    },
    filterData() {
      this.nowPage == 1 ? this.getData() : (this.nowPage = 1)
    },
    closeDia(value) {
      this.fahuodia=false;
      if (value) this.getData();
    },
    showInfo(row){
      this.title = row.supplier_name
      this.infoVisible = true;
      // this.period = row.period
      this.supplier_id = row.supplier_id
      console.log(this.title)
    },
    async excel() {
      const {data: res} = await this.$http.get('/manage/invoice/excel',{params:{
        keywords: this.keywords,
        member: this.member,
        member_id: this.member_id,
        type: this.type,
        state: this.state,
        period: this.period
        // starttime: this.date?this.date[0]:"",
        // endtime: this.date?this.date[1]:"",
      }});
      window.open(res.url);
    },
    close(val) {
      if (val) this.getData()
      this.infoVisible = false
    },
    async states(row, str) {
      const h = this.$createElement
      const confirm = await this.$msgbox({
        title: '提示',
        message: h('p', null, [
          h('span', null, '是否切换'),
          h('b', { style: 'color: teal' }, `${row.supplier_name}`),
          h('span', null, `${str}状态`)
        ]),
        type: 'warning',
        showCancelButton: true
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消切换'
        })
      })
      if (!confirm) return
      let params = new FormData() // 不知道什么鬼
      params.append('goods_id', row.goods_id)
      if (str == '商品') {
        params.append('newstate', row.status == 1 ? 0 : 1)
        params.append('period', row.period)
        params.append('supplier_id', row.supplier_id)
        // console.log(row.status)
        await this.$http.post('/manage/invoice/state', params)
      } else {
        // console.log(222);
        params.append('newstate', row.is_pick == 1 ? 0 : 1)
        await this.$http.post('/manage/goods/pick', params)
      }
      this.getData()
    },
  }
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
<style scoped>
.inp {
  width: 80%;
}
.slider {
  flex: 1;
}
.add {
  display: inline-block;
  position: absolute;
  right: 40px;
}
img {
  height: 50px;
  width: 50px;
}
.tiplink {
  width: 100px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  text-decoration: underline solid;
}
.box{
  display: block 
}
.boxx{
  margin-left: 80px;
  display: flex;
  align-items: center;
}
.el-form--inline .el-form-item{
  margin-right: 60px;
  width: 300px;
}
</style>