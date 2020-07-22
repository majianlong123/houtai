<template>
  <div>
    <el-card>
      <div slot="header" :class="$style.header">
        <div :class="$style.search">
          <span>搜索：</span>
          <el-input v-model="keywords" placeholder="请输入订单号" @change="filterData" clearable />
        </div>
        <div>
          <el-input v-model="member" placeholder="请输入会员信息" @change="filterData" clearable />
        </div>
        <div>
          <el-select v-model="state" @change="filterData" placeholder="请选择订单状态" clearable>
            <el-option
              v-for="item in state_screen"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
        <div>
          <el-select v-model="refund" @change="filterData" placeholder="请选择退款状态" clearable>
            <el-option
              v-for="item in refund_screen"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
        <div>
          <el-date-picker v-model="date" clearable @change="filterData"
            type="daterange" range-separator="至"
            value-format="yyyy-MM-dd"
            start-placeholder="开始日期" end-placeholder="结束日期">>
            </el-date-picker>
        </div>
        <el-button @click="filterData" type="primary">
          搜索
          <i class="el-icon-search"></i>
        </el-button>
        <div space></div>
        <el-button @click="excel()" class="excel" type="success">
          导出EXCEL
        </el-button>
      </div>

      <el-table :data="goodsData">

        <el-table-column type="expand">
            <template slot-scope="{row}">
              <el-form label-position="left" inline class="expand_form">
                <el-row>
                  <el-form-item label="备注: ">
                    <span>{{ row.note }}</span>
                  </el-form-item>
                </el-row>
              </el-form>
            </template>
          </el-table-column>

        <el-table-column label="订单号" align="center"  >
          <template slot-scope="{row}">{{row.order_sn}}</template>
        </el-table-column>

        <el-table-column label="昵称/手机号" align="center">
          <template slot-scope="{row}">{{row.member_info}}</template>
        </el-table-column>

        <el-table-column label="总金额" align="center">
          <template slot-scope="{row}">{{row.goods_fee}}</template>
        </el-table-column>

        <el-table-column label="提货点" align="center">
          <template slot-scope="{row}">{{row.store_name}}</template>
        </el-table-column>

        <el-table-column label="付款方式" align="center">
          <template slot-scope="{row}">{{row.payment_str}}</template>
        </el-table-column>

        <el-table-column label="订单状态" align="center">
          <template slot-scope="{row}">{{row.status_str}}</template>
        </el-table-column>

        <el-table-column label="是否退款" align="center" min-width="50">
          <template slot-scope="{row}">{{row.refund_str}}</template>
        </el-table-column>

        <el-table-column label="退款金额" align="center" min-width="50">
          <template slot-scope="{row}">{{row.refund_money}}</template>
        </el-table-column>


        
        <el-table-column label="创建时间" align="center">
          <template slot-scope="{row}">{{row.create_time}}
          </template>
        </el-table-column> 

        <el-table-column label="付款时间" align="center">
          <template slot-scope="{row}">{{row.update_time}}
          </template>
        </el-table-column> 

        <el-table-column label="操作" min-width="130" align="center">
          <template slot-scope="{row}">

            <el-button @click="showInfo(row)" size="mini" type="success" >
              详情
            </el-button>
            <el-button v-if="row.status=== 2" @click="ship(row)" size="mini" type="primary">
              配货
            </el-button>
            <el-button v-if="row.status_str=== '退款中'" @click="tuik(row)" size="mini" type="primary">
              查看退款清单
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 弹出对话框 -->
      <BasePagination :max="maxPage" :now.sync="nowPage"/>
      <info ref="info" v-if="infoVisible"  :id="id" :item="item" :title="title" @close="close"/>
      <fahuo v-if="fahuodia" :item="item"  @close="closeDia"></fahuo>
    </el-card>
  </div>
</template>
<script>
import info from './components/deli/info'
import fahuo from './components/ment/fahuo'
export default {
  components: {
    info,
    fahuo
  },
  created() {
    this.state = this.$route.query.data ? this.$route.query.data.status : ''  // 订单状态
    // this.refund = this.$route.query.data ? this.$route.query.data.store_id : '' // 退款状态
    this.store_id = this.$route.query.data ? this.$route.query.data.store_id : ''
    console.log(this.state)
    console.log(this.refund)
    this.getData()
  },
  data() {
    return {
      infoVisible: false,
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
      refund_screen:[],
      member_id:"",
      fahuodia:false,
      refund: null,
      store_id: null,
      // status: ''
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
        .get('/manage/order/lists', {
          params: {
            rows: 8,
            page: this.nowPage,
            keywords: this.keywords,
            member: this.member,  
            member_id: this.member_id,
            state: this.state,
            store_id: this.store_id,
            starttime: this.date?this.date[0]:"",
            endtime: this.date?this.date[1]:"",
          }
        })
        .then(res => {
          this.goodsData = res.data.list
          this.maxPage = res.data.page_total
          this.state_screen = res.data.state_screen,
          this.refund_screen = res.data.refund_screen,
          console.log(this.goodsData)
        })
    },
    filterData() {
      this.nowPage == 1 ? this.getData() : (this.nowPage = 1)
    },
    ship(row) {
        this.$confirm("确认配货吗?", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
            this.$http
            .post("/manage/order/deliver", {
              order_id: row.order_id,
            })
            .then(res => {
              this.getData();
            });
        })
        .catch(() => {
          this.$message("已取消！");
        });
    },
    closeDia(value) {
      this.fahuodia=false;
      if (value) this.getData();
    },
    showInfo(row){
      this.id = row.order_id;
      this.item['order_sn'] = row['order_sn'];
      this.item['linkman'] = row['linkman'];
      this.item['contact'] = row['contact'];
      this.item['address'] = row['address'];
      this.item['express_type_str'] = row['express_type_str'];
      this.item['express_company'] = row['express_company'];
      this.item['express_number'] = row['express_number'];
      this.item['worker_name'] = row['worker_name'];
      this.item['worker_contact'] = row['worker_contact'];
      // this.$refs.info.isDialog = true;
      this.infoVisible = true;
    },
    tuik(row) {
      // this.$router.replace('/order/MemberendPayout')
      this.$router.push({
        path: '/order/MemberendPayout',
        query: {
          order_id: row.order_id
        }
      });
    },
    async excel() {
      const {data: res} = await this.$http.get('/manage/order/excelOrder',{params:{
        keywords: this.keywords,
        member: this.member,
        member_id: this.member_id,
        type: this.type,
        state: this.state,
        starttime: this.date?this.date[0]:"",
        endtime: this.date?this.date[1]:"",
      }});
      window.open(res.url);
    },
    close(val) {
      if (val) this.getData()
      this.infoVisible = false
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
.img {
  width: 100px;
  height: 100px;
}
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