<template>
  <el-card>
    <div slot="header" :class="$style.header">
      <!-- <div :class="$style.search">
          <span>搜索：</span>
          <el-input v-model="keywords"
            placeholder="请输入参数名称"
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
      <el-button type="primary" @click="edit('add')">新增参数</el-button>
    </div>

    <el-table :data="tableData">
      <!-- <el-table-column label="缩略图" align="center">
        <template slot-scope="prop">
          <img :src="prop.row.picurl" style=" width: 75px;height: 75px;">
        </template>
      </el-table-column> -->
      <el-table-column label="名称" align="center" prop="name"/>
      <el-table-column label="权重" align="center" prop="sort"/>
      <el-table-column label="配置值" align="center" prop="value"/>
      <el-table-column label="操作" align="center">
        <template slot-scope="prop">
          <el-button type="primary" size="mini" @click="edit('editor',prop.row)">
            编辑
          </el-button>
          <el-button type="danger" size="mini" @click="del(prop.row)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <edit v-if="add" :title="title" :id="id" :item="item" :fenlei="fenlei" @close="closeDia"></edit>
    <!-- <BasePagination :max="maxPage" :now.sync="nowPage"></BasePagination> -->
  </el-card>
</template>

<script>
import edit from './components/integ/edit'
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
      id: null,
      item: {},
      fenlei: [],
      add: false,
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
    edit(type, row) {
      if (type === 'add') {
        this.title = '新增参数'
        this.add = true
        this.id = null
        this.item = {}
      } else {
        this.add = true
        this.title = '修改参数'
        this.id = row.id
        this.item = row
      }
    },
    getData() {
      this.$http
        .get('/manage/goods_param/lists', )
        .then(res => {
          console.log(res, 'aaa')
          this.tableData = res.data.list 
          this.fenlei = res.data.jump_screen
          this.maxPage = Math.ceil(res.data.total / 10)
        })
    },
    async del(row) {
      console.log(row);
      const h = this.$createElement;
      const confirm = await this.$msgbox({
          title: '提示',
          message: h('p', null, [
            h('span', null, '是否删除'),
            h('b', { style: 'color: teal' }, row.name),
            h('span', null, `参数`),
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
      params.append('id', row.id);
      await this.$http.post('/manage/goods_param/del',params);
      this.getData();
    },
    closeDia(val) {
      if (val) this.getData()
      this.add = false
    },
    filterData() {
      this.nowPage == 1 ? this.getData() : (this.nowPage = 1);
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