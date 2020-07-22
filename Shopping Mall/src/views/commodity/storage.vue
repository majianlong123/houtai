<template>
  <div>
    <el-card>
      <div slot="header"
        :class="$style.header">
        <!-- <div :class="$style.search">
          <span>搜索：</span>
          <el-input v-model="keywords"
            placeholder="请输入储存条件"
            @change="filterData"
            clearable />
        </div>
        <div>
          <el-button @click="filterData"
            type="primary">
            搜索
            <i class="el-icon-search"></i> 
          </el-button>
        </div> -->
        <div space></div>
        <el-button @click="edit()"
          type="primary"
          style="margin-bottom: 5px;">添加储存条件</el-button>
    </div>
      <el-table :data="tableData">

      <el-table-column label="名称" align="center" prop="name"></el-table-column> 
      <!-- <el-table-column label="生产日期" align="center" prop="sort"></el-table-column>
      <el-table-column label="保证期" align="center" prop="name"></el-table-column> 
      <el-table-column label="储存条件" align="center" prop="name"></el-table-column>
      <el-table-column label="包装规格" align="center" prop="sort"></el-table-column>
      <el-table-column label="产地" align="center" prop="sort"></el-table-column>
      <el-table-column label="运费" align="center" prop="sort"></el-table-column> -->

        <el-table-column label="操作" min-width="100px" align="center">
          <template slot-scope="{row}">
            <el-button @click="edit(row)" size="mini" type="primary">
              编辑
            </el-button>
            <el-button @click="del(row)" size="mini" type="danger">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <edit v-if="dialogVisible"  :id="id" :item="item" @close="close"></edit>
      <!-- <BasePagination :max="maxPage" :now.sync="nowPage"></BasePagination> -->
    </el-card>
  </div>
</template>

<script>
import edit from './components/store/edit'
export default {
  components: {
    edit
  },
  data() {
    return {
      tableData: [],
      title: '',
      maxPage: 1,
      nowPage: 1,
      id: '',
      item: {},
      dialogVisible: false,
      keywords: ''
    }
  },
  watch: {
    nowPage() {
      this.getData()
    }
  },
  created() {
    this.getData()
  },
  methods: {
    getData() {
      this.$http
        .get('/manage/keep_condition/lists', {
          params: {
            page: 1,
            rows: 10,
            keywords: this.keywords
          }
        })
        .then(res => {
          console.log(res, 'aaa')
          this.tableData = res.data.list
          this.maxPage = Math.ceil(res.data.total / 10)
        })
    },
    async del(row) {
      const h = this.$createElement;
      const confirm = await this.$msgbox({
          title: '提示',
          message: h('p', null, [
            h('span', null, '是否删除'),
            h('b', { style: 'color: teal' }, row.name),
            h('span', null, `储存条件`),
          ]),
          type: 'warning',
          showCancelButton: true,
      }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
      })});
      if(!confirm) return;
      let params = new URLSearchParams();
      params.append('kp_id', row.kp_id);
      await this.$http.post('/manage/keep_condition/del',params);
      this.getData();
    },
    filterData() {
      this.nowPage == 1 ? this.getData() : (this.nowPage = 1);
    },
    close(val) {
      if(val) this.getData();
      this.dialogVisible = false;
    },
    edit(data) {
      if (data) {
        this.id = data.kp_id
        this.item = data
      } else {
        this.id = -1
      }
      console.log(this.id);
      this.dialogVisible = true;
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
img {
  height: 100px;
}
.tableImg {
  width: 75px;
  height: 75px;
}
</style>
<style>
.add {
  display: inline-block;
  position: absolute;
  right: 40px;
}
.tableImg {
  width: 75px;
  height: 75px;
}
</style>
<style>
.add {
  display: inline-block;
  position: absolute;
  right: 40px;
}
</style>
