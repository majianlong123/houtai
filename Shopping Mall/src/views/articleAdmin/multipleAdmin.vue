<template>
  <div>
    <el-card>
      <div slot="header" :class="$style.header">
        <div :class="$style.search">
          <span>搜索：</span>
          <el-input v-model="keywords" placeholder="请输入公告名称" @change="filterData" clearable />

        </div>
        <el-button @click="filterData" type="primary">
          搜索
          <i class="el-icon-search"></i>
        </el-button>
        <div space></div>
        <div>
          <el-button @click="edit()" type="primary">
            添加公告
          </el-button>
        </div>

      </div>
      <el-table :data="articleData">

        <el-table-column label="缩略图" align="center" label-class-name="pic">
          <template slot-scope="{ row }">
            <a :href="row.picurl" target="_blank">
              <img :src="row.picurl" alt="" class="tableImg">
            </a>
          </template>
        </el-table-column>
        <el-table-column label="标题" align="center" min-width="100">
          <template slot-scope="{row}">{{row.title}}</template>
        </el-table-column>
        <el-table-column label="权重" align="center">
          <template slot-scope="{row}">{{row.sort}}</template>
        </el-table-column>
        <el-table-column label="创建时间" align="center">
          <template slot-scope="{row}">{{row.create_time}}</template>
        </el-table-column>
        <el-table-column label="操作" min-width="100px" align="center">
          <template slot-scope="{row}">
            <el-button @click="edit(row)" size="mini" type="primary">
              编辑
            </el-button>
            <el-button @click="del(row)" size="mini" type="danger">
              删除
            </el-button>
             <!-- <el-button @click="show(row)" size="mini" type="primary">
              查看详情
            </el-button> -->
          </template>
        </el-table-column>
      </el-table>
      <edit ref="edit" @getData="getData" :id="id"></edit>
      <!-- <show ref="show" v-if="showVisible" @close="close"  :id="id"></show> -->
      <BasePagination :max="maxPage" :now.sync="nowPage"></BasePagination>
    </el-card>
  </div>
</template>

<script>
import edit from './components/multiple/edit'
// import show from './components/multiple/show'
export default {
  components: {
    edit,
    // show
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
      showVisible: false,
    }
  },
  watch: {
    nowPage() {
      this.getData()
    }
  },
  methods: {
    edit(data) {
      if (data) {
        this.id = data.id
        this.$refs.edit.isDialog = true
      } else {
        this.id = -1
        this.$refs.edit.isDialog = true
      }
    },
    // show(row){
    //   this.id = row.id;
    //   this.showVisible = true;
    // },
    close(){
      this.showVisible = false;

    },
    getData() {
      this.$http
        .get('/manage/article/lists', {
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
    async del(row){
      const h = this.$createElement;
      const confirm = await this.$msgbox({
        title: '提示',
        message: h('p', null, [
          h('span', null, '是否确认删除公告'),
          h('b', { style: 'color: teal' }, `${row.title}`),
        ]),
        type: 'danger', 
        showCancelButton: true,
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })});
      if(!confirm) return;
      let params = new URLSearchParams();
      params.append('id', row.id)
      await this.$http.post('/manage/article/del',params);
      this.getData()
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
