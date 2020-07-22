<template>
  <div>
    <el-card v-if="!$store.state.isShowEditGoods">
      <div slot="header"
        :class="$style.header">
        <div :class="$style.search">
          <span>搜索：</span>

        </div>


        <div>
          <el-select v-model="type"
            @change="filterData"
            placeholder="请选择佣金类型"
            clearable>
            <el-option v-for="item in type_screen"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div>
          <el-select v-model="state"
            @change="filterData"
            placeholder="请选择佣金状态"
            clearable>
            <el-option v-for="item in state_screen"
              :key="item.value"
              :label="item.label"
              :value="item.value"></el-option>
          </el-select>
        </div>
        <div>
          <el-button @click="filterData"
            type="primary">
            搜索
            <i class="el-icon-search"></i>
          </el-button>
        </div>
        <div space></div>
      </div>
      <el-table :data="goodsData">
        <el-table-column label="订单号"
          align="center"
          min-width="50"
          prop="order_sn">
        </el-table-column>
        <el-table-column label="会员信息"
          align="center"
          min-width="40"
          prop="member_info" />
        <el-table-column label="佣金类型"
          align="center"
          min-width="50"
          prop="type_str">
        </el-table-column>
        <el-table-column label="金额"
          align="center"
          min-width="60"
          prop="amount" />
        <el-table-column label="佣金状态"
          align="center"
          min-width="40"
          prop="status_str" />
        <el-table-column label="创建时间"
          align="center"
          min-width="40"
          prop="create_time" />
        <el-table-column label="发放时间"
          align="center"
          min-width="40"
          prop="grant_time" />
      </el-table>
      <!-- 弹出对话框 -->
      <BasePagination :max="maxPage"
        :now.sync="nowPage" />

    </el-card>
    <editGoods :item="item"
      v-else
      @close="close"
      :cateSelect="cateSelect"
      :supplierSelect="supplierSelect" />
  </div>
</template>
<script>


export default {
  components: {

  },
  created() {

    this.getData()
    // this.getSelect();
    this.ghs()
    this.getclass()
  },
  data() {
    return {
      isShowEditGoods: false,
      isShowRecharge: false,
      isShowPass: false,
      isShowRelease: false,
      status: '',
      type_screen: [],
      pick_screen: [],
      level: '',
      member_id: '',
      goodsData: [],
      maxPage: 1,
      nowPage: 1,
      id: 0,
      title: '',
      item: {},
      pick: '',
      dialogVisible: false,
      cateSelect: [],
      brandSelect: [],
      kpSelect: [],
      starttime: '',
      brand_id: '',
      kp_id: '',
      albumDialog: false,
      guigeDialog: false,
      supplierSelect: [],
      state_screen: [],
      options: [],
      timeArr:[],
      type: '',
      state: ''
    }
  },
  watch: {
    nowPage() {
      this.getData()
    }
  },
  methods: {
    filterCascader(e){
      console.log('ccc',e)
      const innerId = e?e[e.length-1]:''
      this.cate_id = innerId
      this.filterData()
    },
    getData() {
      this.$http
        .get('/manage/reward_bill/lists', {
          params: {
            rows: 7,
            page: this.nowPage,
            member_id: this.member_id,
            starttime: this.timeArr?this.timeArr[0]:'' ,
            endtime: this.timeArr?this.timeArr[1]:'',
            type: this.type,
            state: this.state
          }
        })
        .then(res => {
          this.goodsData = res.data.list
          this.maxPage = res.data.page_total
          this.type_screen = res.data.type_screen
          this.state_screen = res.data.state_screen
          console.log(res)
        })
    },
    // getSelect() {
    //   this.$http
    //     .get("/manage/category/lists", {

    //     })
    //     .then(res => {
    //       this.cateSelect = res.data.list
    //     });
    // },
    getclass() {
      this.$http.get('/manage/category/lists').then(res => {
        this.options = res.data.list
        console.log(res)
      })
    },
    ghs() {
      this.$http.get('/manage/supplier/lists', {}).then(res => {
        this.supplierSelect = res.data.list
      })
    },
    filterData() {
      this.nowPage == 1 ? this.getData() : (this.nowPage = 1)
    },
    addGoods() {
      this.$store.commit('CHANGE_GOODS_STATE')
      // console.log( this.$store.state.goodsStatusStr);
      // console.log(this.$store.state.isShowEditGoods);
    },
    destroyed() {
      this.$store.commit('GOODS_STATE')
    },
    edit(data) {
      if (data) {
        this.id = data.goods_id
        this.title = data.name
      } else {
        this.id = -1
      }
      this.dialogVisible = true
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
      let params = new URLSearchParams() // 不知道什么鬼
      params.append('goods_id', row.goods_id)
      if (str == '商品') {
        params.append('newstate', row.status == 1 ? 0 : 1)
        console.log(row.status)
        await this.$http.post('/manage/goods/state', params)
      } else {
        // console.log(222);
        params.append('newstate', row.is_pick == 1 ? 0 : 1)
        await this.$http.post('/manage/goods/pick', params)
      }
      this.getData()
    },
    async del(row) {
      const h = this.$createElement
      const confirm = await this.$msgbox({
        title: '提示',
        message: h('p', null, [
          h('span', null, '是否删除商品'),
          h('b', { style: 'color: teal' }, `${row.name}`)
        ]),
        type: 'danger',
        showCancelButton: true
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
      if (!confirm) return
      let params = new URLSearchParams()
      params.append('goods_id', row.goods_id)
      await this.$http.post('/manage/goods/del', params)
      this.getData()
    },
    close(val) {
      if (val) this.getData()
      this.dialogVisible = false
      this.albumDialog = false
      this.guigeDialog = false
      this.$store.commit('GOODS_STATE')
    },
    album(data) {
      this.item = data
      this.albumDialog = true
    },
    guige(data) {
      this.item = data
      this.guigeDialog = true
    }
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
<style scoped lang="scss">
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
[custom] .cell {
  height: 85px;
}
// .el-table-column a  img
.img {
  height: 80px;
}
.col_name div .name-wrapper p {
  width: 100px;
  white-space: nowrap;
  overflow: hidden;
  cursor: pointer;
  text-overflow: ellipsis;
}
</style>

<style lang="scss">
.el-popover.popper {
  padding: 0px 5px;
  line-height: 1;
  border-radius: 15px;
  // background: #333;
  // color:#F0F8FF;
}
</style>
