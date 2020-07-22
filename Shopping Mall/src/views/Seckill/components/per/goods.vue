<template>
  <div>
    <el-dialog :title="title+'期次'" 
    :visible.sync="isDialog"
    :close-on-click-modal="false"
		@close="dialogClose"
    width="50%"
    top="50px">
      <div :class="$style.header" >
        <div :class="$style.search">
          <span>搜索：</span>
          <el-input v-model="goods" placeholder="请输入商品名称" @change="getData" clearable/>
        </div>
        <!-- <div>
          <el-select
            v-model="period_id"
            filterable
            clearable
            placeholder="请选择期次" 
             @change="filterData"
            >
            <el-option
              v-for="item in period_screen"
              :key="item.id"
              :label="item.name" 
              :value="item.value">
            </el-option>
          </el-select>
        </div>     -->
        <div>
          <el-button @click="filterData"
            type="primary">
            搜索
            <i class="el-icon-search"></i>
          </el-button>
        </div>
        <div space></div>
        <el-button @click="edit()" type="primary">
          添加商品
        </el-button>
      </div>

      <el-table :data="goodsData" border stripe>
        <el-table-column label="缩略图" align="center" >
          <template slot-scope="{row}">
            <a :href="row.goods_thumb" target="_blank">
              <img style="width:80px" :src="row.goods_thumb" />
            </a>
          </template>
        </el-table-column>

        <el-table-column label="名称"  align="center"  width="120" class-name="col_name">
           <template slot-scope="{row}">
            <el-popover trigger="hover" placement="top" popper-class="popper" > 
              <p> {{row.goods_name }}</p>
              <div slot="reference" class="name-wrapper">
                <p size="medium">{{row.goods_name }}</p>
              </div>
            </el-popover>
          </template>
        </el-table-column>

        <!-- <el-table-column label="名称" align="center"  class-name="col_name" prop="goods_name"/> -->
<!--         
        <el-table-column label="秒杀期次"min-width="120"  align="center">
          <template slot-scope="{row}">{{row.seckill_period_name}}
          </template>
        </el-table-column> -->
        <el-table-column label="秒杀价" align="center">
          <template slot-scope="{row}">{{row.price}}
          </template>
        </el-table-column>

        <el-table-column label="秒杀佣金" align="center">
          <template slot-scope="{row}">{{row.reward}}</template>
        </el-table-column>

        <el-table-column label="限量" align="center">
          <template slot-scope="{row}">{{row.number}}</template>
        </el-table-column>

        <el-table-column label="剩余数量" align="center">
          <template slot-scope="{row}">{{row.res_num}}</template>
        </el-table-column>

        <el-table-column label="操作" min-width="150" align="center">
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
      <!-- 弹出对话框 -->
      <BasePagination :max="maxPage" :now.sync="nowPage"></BasePagination>
      <edit :id="gid"
      :pid="pid"
        :item="item"
        @getData="getData" 
        v-if="dialogVisible"
        @close="close" />
    </el-dialog>
  </div>
</template>
<script>
import edit from "../goods/edit";
import BasePagination from "@/components/BasePagination";

export default {
  props:{
    id:Number,
    title:String,
  },
  components: {
    edit
  },
  data() {
    return {
      gid: 0,
      pid: 0,
      item: {},
      dialogVisible: false,
      goods: "",
      goodsData: [],
      maxPage: 1,
      nowPage: 1,
      state: "",
      period_id: 0,
      state_screen: [],
      isDialog: true
    };
  },
   created() {
    if(this.$route.query){
      console.log(this.$route.query)
      this.period_id =this.$route.query.period_id;
    }
    this.getData();
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
        .get("/manage/seckill/lists", {
          params: {
            rows: 5,
            page: this.nowPage,
            goods: this.goods,
            period_id: this.id,
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
    edit(data) {
      if (data) {
        this.gid = data.seckill_id;
        this.item = data;
      } else {
        this.gid = -1;
        this.pid = this.id;
      }
      this.dialogVisible = true;
    },
    async del(row){
      const h = this.$createElement;
      const confirm = await this.$msgbox({
        title: '提示',
        message: h('p', null, [
          h('span', null, '是否删除秒杀商品'),
          h('b', { style: 'color: teal' }, `${row.goods_name}`),
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
      params.append('seckill_id', row.seckill_id);
      await this.$http.post('/manage/seckill/del',params);
      this.getData()
    },
    dialogClose(){
      this.$emit('close');
      this.isDialog = false;
    },
    close(value) {
      if(value)this.getData();
      this.dialogVisible = false;
    },
  }
};
</script>


<style lang="scss" module>
.header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;

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
<style lang="scss">
.col_name div .name-wrapper p{
  width: 100px;
  white-space:nowrap;
  overflow: hidden;
  cursor: pointer;
  text-overflow:ellipsis;
}
 .el-popover.popper{
  padding: 0px 5px;
  line-height: 1;
  border-radius: 15px;
  // background: #333;
  // color:#F0F8FF;
}
// .popper__arrow {
//   filter:drop-shadow(0 2px 12px rgba(0, 0, 0,1))
// }
</style>

