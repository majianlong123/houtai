<template>
  <el-card>
   <div slot="header"
        :class="$style.header">
        <!-- <div :class="$style.search">
          <span>搜索：</span>
          <el-input v-model="keywords"
            placeholder="请输入品牌名称"
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
          style="margin-bottom: 5px;">添加品牌</el-button>
    </div>

    <el-table :data="tableData">
      <!-- <el-table-column label="缩略图" align="center">
        <template slot-scope="prop">
          <img :src="prop.row.picurl" style=" width: 75px;height: 75px;">
        </template>
      </el-table-column> -->
      <el-table-column label="品牌" align="center" prop="name"></el-table-column>
      <el-table-column label="排序" align="center" prop="sort"></el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="edit(row)">
            编辑
          </el-button>
          <el-button type="danger" size="mini" @click="del(row)" >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <edit v-if="dialogVisible"  :id="id" :item="item" @close="close"></edit>
    <!-- <BasePagination :max="maxPage"
      :now.sync="nowPage"></BasePagination> -->
  </el-card>
</template>

<script>
import edit from './components/brand/edit'
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
        .get('/manage/brand/lists', {
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
            h('span', null, `品牌`),
          ]),
          type: 'warning',
          showCancelButton: true,
      }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
      })});
      if(!confirm) return;
      let params = new FormData();
      params.append('brand_id', row.brand_id);
      await this.$http.post('/manage/brand/del',params);
      this.getData();
    },
    close(val) {
      if(val) this.getData();
      this.dialogVisible = false;
    },
    edit(data) {
      if (data) {
        this.id = data.brand_id
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
  height: 70px;
  width: 131px;
}
</style>
