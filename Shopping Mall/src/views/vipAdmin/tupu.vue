<template>
  <el-card>
      <div slot="header" :class="$style.header">
        <div :class="$style.search">
          <span>搜索：</span>
          <el-input v-model="keywords" placeholder="请输入昵称" @change="filterData" clearable />
        </div>
        <el-button @click="filterData" type="primary">
          搜索
          <i class="el-icon-search"></i>
        </el-button>
      </div>

    <el-table :data="tableData" row-key="member_id"  lazy :load="load" :tree-props="{children: 'children', hasChildren: 'child_num'}">
      <el-table-column label="昵称" align="center" prop="nickname"></el-table-column>
      <el-table-column label="手机" align="center" prop="phone"></el-table-column>
      <el-table-column label="是否提货点" align="center" prop="store_str"></el-table-column>
      <el-table-column label="直推人数" align="center" prop="child_num"></el-table-column>
    </el-table>
    <BasePagination :max="maxPage" :now.sync="nowPage"></BasePagination>
  </el-card>
</template>

<script>

export default {
  data() {
    return {
      tableData: [],
      title: '',
      maxPage: 1,
      nowPage: 1,
      id: null,
      item:{},
			fenlei:[],
      add:false,
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
        .get('/manage/member_ship/lists', {
          params: {
            page: 1,
            rows: 10,
            keywords: this.keywords
          }
        })
        .then(res => {
          this.tableData = res.data.list
          // this.maxPage = Math.ceil(res.data.total / 10)
          console.log(res)
        })
    },
    filterData() {
      this.nowPage == 1 ? this.getData() : (this.nowPage = 1)
    },
    //懒加载子类
    load(row, treeNode, resolve) {
      console.log('row',row)
      this.getChildren(row).then(res => {
        resolve(res)
      }).catch(err=>{})
    },
    //获取子类
    getChildren(row) {
      return new Promise((resolve, reject) => {
        if(row.child_num > 0) {
          this.$http.get('/manage/member_ship/lists', {
            params: {
              id: row.member_id
            }
          }).then(res => {
            resolve(res.data.list)
          }).catch(err => {
            this.$message({
              showClose: true,
              message: '获取子账户失败',
              type: 'warning'
            })
          })
        }
      })
    }
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
