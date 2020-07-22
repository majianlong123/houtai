<template>
  <div>
    <el-card>
      <div slot="header" :class="$style.header">
        <div :class="$style.search">
          <span>搜索：</span>
          <el-input v-model="keywords" placeholder="请输入提货点名称" @change="filterData" clearable />
        </div>
        <el-button @click="filterData" type="primary">
          搜索
          <i class="el-icon-search"></i>
        </el-button>
      </div>

      <el-table :data="goodsData">
        <el-table-column label="提货点名称" align="center" min-width="100">
          <template slot-scope="{row}">{{row.name}}</template>
        </el-table-column>

        <el-table-column label="用户信息" align="center" min-width="75">
          <template slot-scope="{row}">{{row.member_info}}</template>
        </el-table-column>

        <el-table-column label="代理区域" align="center" min-width="100">
          <template slot-scope="{row}">{{row.region_name}}</template>
        </el-table-column>

        <el-table-column label="联系方式" align="center" min-width="100">
          <template slot-scope="{row}">{{row.contact}}</template>
        </el-table-column>

        <el-table-column label="提货点地址" align="center" min-width="100">
          <template slot-scope="{row}">{{row.address}}</template>
        </el-table-column>

        <el-table-column label="提货总量" align="center" min-width="75">
          <template slot-scope="{row}">
            <el-button @click="go(row, '1')" size="mini" style="margin-bottom: 5px;margin-left: 10px;" type="success">
              {{row.tihuo}}
            </el-button>
          </template>
        </el-table-column>

        <el-table-column label="创建时间" align="center" min-width="80">
          <template slot-scope="{row}">{{row.create_time}}</template>
        </el-table-column>

        <el-table-column label="操作"  width="330" align="center">
          <template slot-scope="{row}">
            <el-button @click="go(row, '1')" size="mini" style="margin-bottom: 5px;margin-left: 10px;" type="success">
              查看订单{{row.order_delivery_num}}
            </el-button>
            <el-button @click="edit(row)" size="mini" type="success" style="margin-bottom: 5px;margin-left: 10px;">
              编辑
            </el-button>
            <el-button @click="del(row)"  size="mini" type="danger" style="margin-bottom: 5px;margin-left: 10px;">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 弹出对话框 -->
      <BasePagination :max="maxPage" :now.sync="nowPage"></BasePagination>
      <edit ref="edit"  
        @close="close" 
        v-if="refundShow" 
        :store_id="store_id" 
        :name="name"
        :contact="contact"
        :address="address"
      ></edit>
    </el-card>
  </div>
</template>
<script>
import edit from './components/list/edit'
export default {
  components: {
    edit
  },
  created() {
    this.getData()
  },
  data() {
    return {
      refundShow: false,
      name: '',
      contact: '',
      goodsData: [],
      date:[],
      maxPage: 1,
      nowPage: 1,
      store_id: null,
      title: '',
      manage: '',
      artist: '',
      keywords:'',
      isShowshezhi:false,
      isShowRecharge:false,
      type_screen:[],
      region_id: ''
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
        .get('/manage/store/lists', {
          params: {
            rows: 8,
            page: this.nowPage,
            keywords: this.keywords,
            region_id: this.region_id
          }
        })
        .then(res => {
          this.goodsData = res.data.list
          this.maxPage = res.data.page_total
          this.level_screen = res.data.level_screen
          console.log(res)
        })
    },
    async del(row) {
      const h = this.$createElement
      const confirm = await this.$msgbox({
        title: '提示',
        message: h('p', null, [
          h('span', null, '是否删除'),
          h('b', { style: 'color: teal' }, ``)
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
      let params = new FormData()
      params.append('store_id', row.store_id)
      await this.$http.post('/manage/store/del', params)
      this.getData()
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
    filterData() {
      this.nowPage == 1 ? this.getData() : (this.nowPage = 1)
    },
    edit(data) {
      // if (data) {
      //   this.id = data.goods_id
      //   this.title = data.name
      // } else {
      //   this.id = -1
      // }
      console.log(data)
      this.name = data.name
      this.contact = data.contact
      this.address = data.address
      this.store_id = data.store_id
      this.refundShow = true
    },
    close() {
      // if (val) this.getData()
      this.refundShow = false
      // this.albumDialog = false
      // this.guigeDialog = false
      // this.$store.commit('GOODS_STATE')
    },
    // edit(data) {
    //   if (data) {
    //     this.id = data.id
    //     this.$refs.edit.isDialog = true
    //   } else {
    //     this.id = -1
    //     this.$refs.edit.isDialog = true
    //   }
    // },
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
.imgs {
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
</style>