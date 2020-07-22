<template>
  <div>
    <el-card>
      <div slot="header" :class="$style.header">
        <div :class="$style.search">
          <span>搜索：</span>
          <el-input v-model="keywords" placeholder="输入活动名称" @change="filterData" clearable/>
        </div>
        <div>
          <el-select v-model="state" @change="getData" placeholder="选择状态" clearable>
            <el-option v-for="item in state_screen"
              :key="item.value" :label="item.label" :value="item.value" >
              </el-option>
          </el-select>
        </div> 
        <!-- <div>
          <el-date-picker v-model="value16" type="datetimerange"
          range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions" clearable @change="filterData" >
          </el-date-picker>
        </div> -->
        <el-button @click="filterData" type="primary">
          搜索
          <i class="el-icon-search"></i>
        </el-button>
        <el-button @click="edit()" class="add" type="primary">
          添加期次
        </el-button>
      </div>

      <el-table :data="goodsData">
        <el-table-column label="名称" align="center" class="imgbox">
          <template slot-scope="{row}">{{row.name}}
          </template>
        </el-table-column>
        <el-table-column label="开始时间" align="center" class="imgbox">
          <template slot-scope="{row}">{{row.start_time}}
          </template>
        </el-table-column>

        <el-table-column label="结束时间" align="center">
          <template slot-scope="{row}">{{row.end_time}}</template>
        </el-table-column>

        <!-- <el-table-column label="购买数量" align="center">
          <template slot-scope="{row}">{{row.num}}</template>
        </el-table-column> -->

        <el-table-column label="状态" align="center">
          <template slot-scope="{row}">{{row.status_str}}</template>
        </el-table-column>
        <!-- <el-table-column label="状态" align="center">
          <template slot-scope="{row}">
            <el-button size="mini" :type="row.status == 1 ? 'success' : 'info'" @click="changeStatus(row)">{{row.status_str}}</el-button>
          </template>
        </el-table-column> -->
        <el-table-column label="操作" min-width="150" align="center">
          <template slot-scope="{row}" >
            <el-button @click="edit(row)" v-if="row.status === 1" size="mini" type="primary">
              编辑
            </el-button>
            <el-button @click="del(row)" v-if="row.status === 1" size="mini" type="danger">
              删除
            </el-button>
            <el-button  @click="jump(row)" size="mini" type="success">
              查看商品{{row.seckill_num}}
            </el-button>
          </template> 
        </el-table-column> 
      </el-table>
      <!-- 弹出对话框 -->

      <BasePagination :max="maxPage" :now.sync="nowPage"></BasePagination>
      <edit :id="id"
        :item="item"
        @getData="getData" 
        v-if="dialogVisible"
        @close="close" />
        <goods ref="goods" :id="id"
        v-if="goodsDialog"
        :item="item"
        :title="title"
        @getData="getData" 
        @close="close" />
    </el-card>
  </div>
</template> 
<script>
import edit from "./components/per/edit";
import goods from "./components/per/goods";

import BasePagination from "@/components/BasePagination";

export default {
  components: {
    edit,
    goods
  },
  created() {
    this.getData();
  },
  data() {
    let self = this;
    return {
      prop_good:{ 
        value: 'id',
        label:'name'
      },
      dialogVisible: false,
      goodsDialog: false,
      value: "",
      id:0,
      item: {},
      keywords: "",
      goodsData: [],
      maxPage: 1,
      nowPage: 1,
      state: "",
      state_screen: [],
      title: ''
    };
  },
  watch: {
    nowPage() {
      this.getData();
    }
  },
  methods: {
    getData() {
      this.goodsData = [];
      this.$http
        .get("/manage/seckill_period/lists", {
          params: {
            rows: 10,
            page: this.nowPage,
            keywords: this.keywords,
            state: this.state,
          }
        })
        .then(res => {
          this.goodsData = res.data.list;
          this.maxPage = res.data.page_total;
          this.state_screen = res.data.state_screen;
          console.log(res)
        });
    },
    filterData() {
      this.nowPage === 1 ? this.getData() : (this.nowPage = 1);
    },
    edit(data){
      if(data){
        this.id = data.period_id
        this.item = data;
        console.log(data);
      }else{
        this.id = -1
      }
      this.dialogVisible = true
		},
    async del(row){
      const h = this.$createElement;
      const confirm = await this.$msgbox({
        title: '提示',
        message: h('p', null, [
          h('span', null, '是否删除秒杀期次'),
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
      params.append('period_id', row.period_id);
      await this.$http.post('/manage/seckill_period/del',params);
      this.getData()
    },
    // changeStatus(row){
    //   let params = new URLSearchParams();
    //   params.append("id", row.id);
    //   this.$http.post("/manage/limit_activity/state", params)
    //     .then(res => {
    //         this.getData();
    //     }); 
    // },
    //添加报单商品
    jump(row){
    if(row.seckill_num <= 0 )return;
    this.id = row.period_id;
    this.title = row.name;
    this.goodsDialog = true;
    console.log(this.goodsDialog);
    // this.$router.push({
    //       path: '/seckill/goods',
    //       query: {
    //         period_id: row.period_id
    //       }
    //     })
  },
   close(val) {
      if (val) this.getData();
      this.dialogVisible = false;
      this.goodsDialog = false;
    },
  }
};
</script>


<style lang="scss" module>
.header {
  display: flex;
  align-items: center;
  padding: 10px;
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
.inp {
  width: 80%;
}
.sliderbox {
  display: flex;
}
.slider {
  flex: 1;
}
.avatar {
  width: 100px;
  height: 250px;
  border: 1px solid black;
}
.add {
  display: inline-block;
  position: absolute;
  right: 40px;
}

</style>

