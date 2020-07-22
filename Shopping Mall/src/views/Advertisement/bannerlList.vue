<template>
  <el-card>
    <div slot="header"
      class="header">
      <div space></div>
      <el-button type="primary"
        @click="editorOradd('add')">新增轮播图</el-button>
    </div>

    <el-table :data="tableData">
      <el-table-column label="轮播图"
        align="center" width="350px">
        <template slot-scope="prop">
          <a :href="prop.row.thumb" target="_blank">
            <img :src="prop.row.thumb"
              style="width:100%;height:150px"> 
          </a>
        </template>
      </el-table-column>
      <el-table-column label="跳转对象" align="center">
        <template slot-scope="{row}">
          {{row.goods_name}}
        </template>
      </el-table-column>
      <el-table-column label="排序" align="center" 
        prop="sort"></el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="prop">
          <!-- <el-button type="success"
            size="mini"
            @click="jump(prop.row)">
            跳转入口<i class="el-icon-edit"></i>
          </el-button> -->
          <el-button type="primary"
            size="mini"
            @click="editorOradd('editor',prop.row)">
            编辑<i class="el-icon-edit"></i>
          </el-button>
          <el-button type="danger"
            size="mini"
            @click="delGift(prop.row.id)">删除
            <i class="el-icon-delete"></i>
          </el-button>
        </template>
      </el-table-column>
    </el-table>

		<addAndeditor v-if="add" 
			:title="title"
      :id="id"
      :item="item"
      :fenlei="fenlei"
      :goods_name="goods_name"
			@close="closeDia"></addAndeditor>
    <BasePagination :max="maxPage"
      :now.sync="nowPage"></BasePagination>
  </el-card>
</template>

<script>
import addAndeditor from './components/banner/addAndeditor'
export default {
  components: {
    addAndeditor
  },
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
      goods_name: ''
    }
  },
  watch: {
    nowPage() {
      this.getData()
    }
  },
  methods: {
    editorOradd(type, row) {
      if (type === 'add') {
        this.title = '新增轮播图'
				// this.$refs.addAndeditor.isDialog = true
				this.add = true
        this.id = null
        this.item = {}
      } else {
				// this.$refs.addAndeditor.isDialog = true
				this.add = true
        this.title = '修改轮播图'
        this.id = row.id
        this.item = row
        this.goods_id = row.goods_id
      }
    },
    getData() {
      this.$http
        .get('/manage/slider/lists', {
          params: {
            page: 1,
            rows: 10,
          }
        })
        .then(res => {
          this.tableData = res.data.list
          this.maxPage = Math.ceil(res.data.total / 10)
          console.log(res)
        })
    },
    delGift(id) {
      this.$confirm("是否确认删除该轮播图?", '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let params = new URLSearchParams()
          params.append('id', id)
          this.$http.post('/manage/slider/del', params).then(res => {
            this.getData()
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
		},
    jump(data, url) {
      console.log(data)
      this.$router.push({
        name: url,
        params: {
          data: data
        }
      })
    },
		closeDia(val){
			if(val)this.getData();
			this.add = false
    },
  },
  created() {
    this.getData()
  }
}
</script>

<style>
</style>
