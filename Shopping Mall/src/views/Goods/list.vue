<template>
  <div>
    <el-card v-if="!$store.state.isShowEditGoods">
      <div slot="header"
        :class="$style.header">
        <div :class="$style.search">
          <span>搜索：</span>
          <el-input v-model="keywords"
            placeholder="请输入商品名称"
            @change="filterData"
            clearable />
        </div>
        <div>
          <el-cascader v-model="cate_id"
            :options="options"
            filterable
            placeholder="分类"
            clearable
            :show-all-levels="false"
            @change="filterCascader"
            style="margin-left:20px">
          </el-cascader>
        </div>
        <div>
          <el-select v-model="status"
            @change="filterData"
            placeholder="请选择商品状态"
            clearable>
            <el-option v-for="item in state_screen"
              :key="item.value"
              :label="item.label"
              :value="item.value"></el-option>
          </el-select>
        </div>
        <div>
          <el-select v-model="pick"
            @change="filterData"
            placeholder="请选择推荐状态"
            clearable>
            <el-option v-for="item in pick_screen"
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
        <el-button @click="addGoods()"
          type="primary"
          style="margin-bottom: 0;">
          添加商品
        </el-button>
      </div>
      <el-table :data="goodsData">

        <el-table-column label="缩略图"
          align="center">
          <template slot-scope="{row}">
            <a :href="row.thumb"
              target="_blank">
              <img  :src="row.thumb" class="img"/>
            </a>
          </template>
        </el-table-column>
        <el-table-column label="名称"
          align="center"
          >
          <template slot-scope="{row}">
            <el-popover trigger="hover"
              placement="top"
              popper-class="popper">
              <p> {{row.name }}</p>
              <div slot="reference"
                class="name-wrapper">
                <p size="medium">{{row.name }}</p>
              </div>
            </el-popover>
          </template>
        </el-table-column>

        <el-table-column label="分类"
          align="center"
          prop="cate_name">
        </el-table-column>
        <el-table-column label="市场价"
          align="center"
          prop="market_price" />
        <el-table-column label="售价"
          align="center"
          prop="price" />
        <el-table-column label="佣金"
          align="center"
          prop="reward" />
        <el-table-column label="权重"
          align="center"
          prop="sort" />
        <el-table-column label="商品状态"
          align="center">
          <template slot-scope="{row}">
            <el-button @click="states(row, '商品')"
              size="mini"
              :type="row.status == 1?'success':'danger'">
              {{row.status_str}}
            </el-button>
          </template>
        </el-table-column>

        <el-table-column label="推荐状态"
          align="center">
          <template slot-scope="{row}">
            <el-button @click="states(row, '推荐')"
              size="mini"
              :type="row.is_pick == 1?'success':'primary'">
              {{row.pick_str}}
            </el-button>
          </template>
        </el-table-column>

        <el-table-column label="操作" min-width="200"
          align="center">
          <template slot-scope="{row}">
            <el-button @click="edit(row)"
              size="mini"
              type="success"
              style="margin-bottom: 5px;margin-left: 10px;">编辑</el-button>

            <el-button @click="del(row)"
              v-if="row.level !== 100"
              size="mini"
              type="danger"
              style="margin-bottom: 5px;margin-left: 10px;">删除</el-button>

            <el-button @click="guige(row)"
              size="mini"
              type="warning"
              style="margin-bottom: 5px;margin-left: 10px;">规格</el-button>

            <el-button @click="album(row)"
              size="mini"
              type="primary"
              style="margin-bottom: 5px;margin-left: 10px;">相册</el-button>

          </template>
        </el-table-column>
      </el-table>
      <!-- 弹出对话框 -->
      <BasePagination :max="maxPage"
        :now.sync="nowPage" />
      <edit ref="edit"
        :id="id"
        :title="title"
        @getData="getData"
        v-if="dialogVisible"
        @close="close"
        :cateSelect="cateSelect"
        :brandSelect="brandSelect"
        :kpSelect="kpSelect" />
      <album :item="item"
        v-if="albumDialog"
        @close="close" />
      <guige :item="item"
        v-if="guigeDialog"
        @close="close" />

    </el-card>
    <editGoods :item="item"
      v-else
      @close="close"
      :cateSelect="cateSelect"
      :supplierSelect="supplierSelect" />
  </div>
</template>
<script>
// supplier_id 供货商id
// cate_id     商品分类id
import edit from './components/list/edit'
import editGoods from './components/list/editGoods'
// import editGoods from './components/list/editgood'
import album from './components/list/album'
import guige from './components/list/guige'

export default {
  components: {
    edit,
    album,
    guige,
    editGoods
  },
  created() {
    // if(this.$route.query.data){
    //   console.log(this.$route.query.data)
    //   this.role =this.$route.query.data.role;
    //   this.level =this.$route.query.data.level;
    // }
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
      state_screen: [],
      pick_screen: [],
      level: '',
      keywords: '',
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
      cate_id: '',
      brand_id: '',
      kp_id: '',
      albumDialog: false,
      guigeDialog: false,
      supplierSelect: [],
      options: []
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
        .get('/manage/goods/lists', {
          params: {
            rows: 7,
            page: this.nowPage,
            keywords: this.keywords,
            state: this.status,
            cate_id: this.cate_id,
            brand_id: this.brand_id,
            kp_id: this.kp_id,
            pick: this.pick
          }
        })
        .then(res => {
          this.goodsData = res.data.list
          this.maxPage = res.data.page_total
          this.state_screen = res.data.state_screen
          this.pick_screen = res.data.pick_screen
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
.img {
  width: 70px; 
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
// .el-table--enable-row-transition .el-table__body td {
//   height: 132px;
// }
</style>
