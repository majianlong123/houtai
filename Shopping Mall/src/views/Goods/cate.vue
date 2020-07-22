<template>
  <div>
    <el-card>
      <div class="btn1">
         <el-button type="primary"  @click="addCarouselSet('a')">添加一级分类</el-button>
      </div>  
     

      <el-table :data="tableData" m-b-10  row-key="cate_id" :tree-props="{children: 'children', hasChildren: 'hasChildren'}" >

        <el-table-column label="名称" align="center">
          <template slot-scope="{ row }">{{row.name}}</template>
        </el-table-column>
        <el-table-column label="分类图片" align="center">-
          <template slot-scope="{ row }">
            <img :src="row.picurl" class="imp">
          </template>
        </el-table-column>
        
        <el-table-column label="排序" align="center">
          <template slot-scope="{ row }">{{row.sort}}</template>
        </el-table-column>
         <el-table-column label="显示状态" align="center">
           
          <template slot-scope="{ row }">
            <el-button type="success" @click="changeStutes(row)" size="mini" v-if="row.status_str=='显示'">{{row.status_str}}</el-button>
            <el-button type="danger" @click="changeStutes(row)" size="mini" v-else>{{row.status_str}}</el-button>
            </template>
        </el-table-column>
        <el-table-column label="操作"  align="left">
          <template slot-scope="{row}">
            <el-button type="primary" size="mini" @click="addCarouselSet('b',row)" v-if="row.children">添加子分类</el-button>
            <el-button size="mini" @click="edit('c',row)" type="success" >
              编辑
              <i class="el-icon-edit"></i>
            </el-button>
            <el-button size="mini" @click="delCarousel(row.cate_id)" type="danger">
              删除
              <i class="el-icon-delete"></i>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <edit v-if="isEditShow" @close="closeDia" :item="item" :types="type"></edit>
  </div>
</template>
<script>
import edit from './components/cate/edit'

export default {
  components: {
    edit
  },
  created() {
    this.getData()
  },
  data() {
    return {
      item: {},
      isEditShow: false, //新增/编辑轮播图
      tableData: [],
      maxPage: 1,
      nowPage: 1,
      type:"",
      // flag: 1
    }
  },

  watch: {
    nowPage() {
      this.getData()
    }
  },

  methods: {
    getData() {
      this.$http.get('/manage/category/lists').then(res => {
        console.log(res)
          this.tableData = res.data.list
        
      })
    },
    // 跳转商品详情
    // jumpGood(data) {
    //   this.$router.push({
    //     path: '/mallManage/GoodsManage',
    //     query: { data: data }
    //   })
    // },
    // 修改状态
    changeStutes(row){
      if (row.status != 0) {
        row.status = 0
      } else {
        row.status = 1
      }
      this.$http
      .post('/manage/category/state', {
        id: row.cate_id,
        newstate: row.status
      })
      .then(res => {         
        this.getData()    
      })
    },
    filterChange() {
      this.nowPage === 1 ? this.getData() : (this.nowPage = 1)
    },
    edit(a,row) {
      this.item = row
      this.type=a;
      this.isEditShow = true
    },
    // 新增轮播图
    addCarouselSet(a,row) {
      this.isEditShow = true
      this.item = {}
      this.type=a;
      if(a!='a'){
        this.item=row.cate_id
      }
    },
    delCarousel(id) {
      this.$confirm('确定要删除吗？', '提示？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        closeOnClickModal: false,
        type: 'warning',
        center: true
      })
        .then(() => {
          this.$http
            .post('/manage/category/del', {
              id: id
            })
            .then(res => {         
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

    closeDia(value) {
      this.isEditShow = false; 
      if (value){
       
       this.getData()
      } 
    }
  }
}
</script>

<style scoped>
.imp {
  width: 4rem;
  height: 4rem;
}
</style>
<style>
.el-table .cell{
  display: flex;
    justify-content: left;
    align-items: center;
}
.el-table th>.cell {
  text-align: left;
}
.btn1{
  text-align: right;
}
</style>