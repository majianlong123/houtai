<template>
  <div>
    <el-card>
      <div slot="header" :class="$style.header">
        <div :class="$style.search">
        </div>
        <div space></div>
        <el-button @click="edit('add')"
          type="primary"
          style="margin-bottom: 0;">
          添加退款原因
        </el-button>
      </div>

      <el-table :data="goodsData">
        <el-table-column label="退款原因" align="center" min-width="100">
          <template slot-scope="{row}">{{row.reason}}</template>
        </el-table-column>

        <el-table-column label="操作"  width="330" align="center">
          <template slot-scope="{row}">
            <el-button @click="edit('editor', row)"
              size="mini"
              type="success"
              style="margin-bottom: 5px;margin-left: 10px;">编辑</el-button>

            <el-button @click="del(row)"
              v-if="row.level !== 100"
              size="mini"
              type="danger"
              style="margin-bottom: 5px;margin-left: 10px;">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 弹出对话框 -->
      <BasePagination :max="maxPage" :now.sync="nowPage"></BasePagination>
      <edit ref="edit"  :id="id" @getData="getData" v-if="refundShow" @close="close" :reason="reason" />
    </el-card>
  </div>
</template>
<script>
import edit from './components/ref/edit'
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
      level: '',
      level_screen: [],
      goodsData: [],
      date:[],
      maxPage: 1,
      nowPage: 1,
      id: null,
      title: '',
      manage: '',
      artist: '',
      keywords:'',
      isShowshezhi:false,
      isShowRecharge:false,
      type_screen:[],
      region_id: '',
      reason: ''
    }
  },
  watch: {
    nowPage() {
      this.getData()
    }
  },
  methods: {
    edit(type, row) {
      if (type === 'add') {
        // this.title = '新增轮播图'
        this.id = null
        this.refundShow = true
      } else {
        // this.title = '修改轮播图'
        this.id = row.id
        this.reason = row.reason
        this.refundShow = true
      }
    },
    getData() {
      this.$http
        .get('/manage/reason/lists', {})
        .then(res => {
          this.goodsData = res.data.list
          // this.maxPage = res.data.page_total
          // this.level_screen = res.data.level_screen
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
      params.append('id', row.id)
      await this.$http.post('/manage/reason/del', params)
      this.getData()
    },
    filterData() {
      this.nowPage == 1 ? this.getData() : (this.nowPage = 1)
    },
    close(value) {
      this.refundShow = false; 
      // if (value){
       
       this.getData()
      // } 
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