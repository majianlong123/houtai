<template>
  <div>
    <el-card>
      <div slot="header" :class="$style.header">
        <div :class="$style.search">
          <span>搜索：</span>
          <el-input v-model="keywords" placeholder="请输入昵称或者手机号" @change="filterData" clearable />
        </div>
        <div>
          <el-button @click="filterData" type="primary">
          搜索
          <i class="el-icon-search"></i>
        </el-button>
        </div>
        <div space></div>
        <el-button type="primary"
        @click="edit()">新增师傅</el-button>
      </div>
 
      <el-table :data="goodsData">
        
        <el-table-column label="名称" align="center" min-width="50">
          <template slot-scope="{row}">{{row.name}}</template>
        </el-table-column>

        <el-table-column label="手机号" align="center">
          <template slot-scope="{row}">{{row.contact}}</template>
        </el-table-column>

        <el-table-column label="操作" min-width="130" align="center">
          <template slot-scope="{row}">

            <el-button @click="edit(row)" size="mini" type="success" >
              编辑
            </el-button>
            <!-- <el-button @click="setUp(row)" v-if="row.status !== 1" size="mini" type="warning" >
              设为默认
            </el-button> -->
            <el-button @click="del(row)" size="mini" type="danger" >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 弹出对话框 -->
      <!-- <BasePagination :max="maxPage" :now.sync="nowPage"/> -->
      <edit ref="edit" v-if="editVisible"  :id="id" :item="item" :title="title" :options="regionList" @close="close"/>
    </el-card>
  </div>
</template>
<script>
import edit from './components/worker/edit'

export default {
  components: {
    edit,
  },
  created() {
    if(this.$route.query){
    console.log(this.$route.query);
      this.state = this.$route.query.data
    }
    this.getData();
    this.getRegion();
  },
  data() {
    return {
      editVisible: false,
      state: '',
      state_screen: [],
      goodsData: [],
      date:[],
      maxPage: 1,
      nowPage: 1,
      id: null,
      title: '',
      item: {},
      manage: '',
      artist: '',
      keywords:'',
      member:'',
      express:"",
      express_screen:[],
      member_id:"",
      infoVisible: false,
      regionList: []
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
        .get('/manage/worker/lists', {
          params: {
            keywords: this.keywords,
          }
        })
        .then(res => {
          this.goodsData = res.data.list
          this.maxPage = res.data.page_total
          this.state_screen = res.data.state_screen,
          this.express_screen = res.data.express_screen,
          console.log(this.goodsData)
        })
    },
    async getRegion(){
      const {data: res} = await this.$http.get('/manage/region/lists');
      this.regionList = res.list;
    },
    filterData() {
      this.nowPage == 1 ? this.getData() : (this.nowPage = 1)
    },
    edit(row){
      if(row){
        this.id = row.worker_id;
        this.item = row;
      }else{
        this.id = -1;
      }
      this.editVisible = true;
      
    },
    async del(row){
      const h = this.$createElement;
      const confirm = await this.$msgbox({
        title: '提示',
        message: h('p', null, [
          h('span', null, '是否删除师傅'),
          h('b', { style: 'color: teal' }, `${row.name}`),
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
      params.append('worker_id', row.worker_id);
      await this.$http.post('manage/worker/del',params);
      this.getData()
    },
    showInfo(row){
      this.id = row.ft_id;
      this.title = row.name;
      // this.$refs.info.isDialog = true;
      this.infoVisible = true;
    },
    close(val) {
      if (val) this.getData();
      this.editVisible = false;
      this.infoVisible = false;

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
img {
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
.box{
  display: block 
}
.boxx{
  margin-left: 80px;
  display: flex;
  align-items: center;
}
.el-form--inline .el-form-item{
  margin-right: 60px;
  width: 300px;
}
</style>