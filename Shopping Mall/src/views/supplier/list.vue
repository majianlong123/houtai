<template>
  <div>
    <el-card>
      <div slot="header" :class="$style.header">
        <div :class="$style.search">
          <span>搜索：</span>
          <el-input v-model="keywords" placeholder="请输入名称" @change="filterData" clearable />

        </div>
        <el-button @click="filterData" type="primary">
          搜索
          <i class="el-icon-search"></i>
        </el-button>
        <div space></div>
        <div>
          <el-button @click="edit()" type="primary">
            添加供货商
          </el-button>
        </div>

      </div>
      <el-table :data="articleData">

        <el-table-column label="供货商名称" align="center" min-width="100">
          <template slot-scope="{row}">{{row.name}}</template>
        </el-table-column>

        <el-table-column label="商品数量" align="center" min-width="100">
          <template slot-scope="{row}">{{row.goods_num}}</template>
        </el-table-column>
        
        <el-table-column label="供货数量" align="center" min-width="100">
          <template slot-scope="{row}">{{row.buy_num}}</template>
        </el-table-column>

        <el-table-column label="创建时间" align="center">
          <template slot-scope="{row}">{{row.create_time}}</template>
        </el-table-column>

        <el-table-column label="供货商状态"
          align="center">
          <template slot-scope="{row}">
            <el-button @click="states(row, '正常')"
              size="mini"
              :type="row.status == 1?'success':'danger'">
              {{row.status_str}}
            </el-button>
          </template>
        </el-table-column>

        <el-table-column label="操作" min-width="100px" align="center">
          <template slot-scope="{row}">
            <el-button @click="edit(row)" size="mini" type="primary">
              编辑
            </el-button>
            <el-button @click="showInfo(row)" size="mini" type="success" >
              统计
            </el-button>
            <el-button @click="go(row, '1')" size="mini" style="margin-bottom: 5px;margin-left: 10px;" type="success">
              期次{{row.order_delivery_num}}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <edit v-if="showEditDialog" ref="edit" @close="closeEditDialog" @getData="getData" :id="id" :nickName="nickName"></edit>
      <info ref="info" v-if="infoVisible"  :id="id" :item="item" :title="supplier_name" @close="closeEditDialog" :supplier_id="supplier_id"/>
      <BasePagination :max="maxPage" :now.sync="nowPage"></BasePagination>
    </el-card>
  </div>
</template>

<script>
import edit from './components/list/edit'
import info from './components/list/info'
export default {
  components: {
    edit,
    info
  },
  data() {
    return {
      keywords: '',
      tableData: [],
      articleData: [],
      types: [],
      title: '',
      maxPage: 1,
      nowPage: 1,
      id: null,
      nickName: null,
      showVisible: false,
      showEditDialog:false,
      infoVisible: false,
      item: {},
      supplier_name: '',
      supplier_id: null
    }
  },
  watch: {
    nowPage() {
      this.getData()
    }
  },
  methods: {
    closeEditDialog(){
       this.showEditDialog = false
       this.infoVisible = false
    },
    edit(data) {
      if (data) {
        this.id = data.supplier_id
        this.nickName = data.name
        // this.$refs.edit.isDialog = true
      } else {
        this.id = 0
        // this.$refs.edit.isDialog = true
        this.nickName = ''
      }
        this.showEditDialog = true
    },
    close(){
      this.showVisible = false;
    },
    getData() {
      this.$http
        .get('/manage/supplier/lists', {
          params: {
            page: this.nowPage,
            rows: 10,
            cate: 'notice',
            keywords: this.keywords
          }
        })
        .then(res => {
          this.articleData = res.data.list
          this.maxPage = res.data.page_total
          console.log(this.articleData)
        })
    },
    filterData() {
      this.nowPage === 1 ? this.getData() : (this.nowPage = 1)
    },
    go(row) {
        this.$router.push({
          path: '/order/mention',
          query: {
            data:{
              store_id: row.store_id,
              status: 4
            }
          }
        })
    },
    async states(row, str) {
      const h = this.$createElement
      const confirm = await this.$msgbox({
        title: '提示',
        message: h('p', null, [
          h('span', null, '是否切换'),
          h('b', { style: 'color: teal' }, `${row.name}`),
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
      params.append('supplier_id', row.supplier_id)
      if (str == '正常') {
        params.append('newstate', row.status == 1 ? 0 : 1)
        console.log(row.status)
        await this.$http.post('/manage/supplier/state', params)
      } else {
        // console.log(222);
        // params.append('newstate', row.is_pick == 1 ? 0 : 1)
        // await this.$http.post('/manage/goods/pick', params)
      }
      this.getData()
    },
    showInfo(row){
      this.infoVisible = true;
      this.supplier_name = row.name
      this.supplier_id = row.supplier_id
      console.log(this.supplier_name)
    },
  },
  created() {
    this.getData()
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
      margin-right: 20px;
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
.tableImg {
  width: 65px;
  height: 65px;
}
</style>
