<template>
  <div>
    <el-card>
      <div slot="header"
        :class="$style.header">
        <div :class="$style.search">
        </div>
        <div>
          <el-input v-model="goods"
            placeholder="请输入商品名称"
            @change="filterData"
            clearable />
        </div>
        <div>
          <el-input v-model="order"
            placeholder="请输入订单号"
            @change="filterData"
            clearable />
        </div>
        <div>
          <el-select v-model="refund"
            @change="filterData"
            placeholder="请选择退款状态"
            clearable>
            <el-option v-for="item in refund_screen"
              :key="item.value"
              :label="item.label"
              :value="item.value"></el-option>
          </el-select>
        </div>

        <el-button @click="filterData"
          type="primary">
          搜索
          <i class="el-icon-search"></i>
        </el-button>
        
      </div>

      <el-table :data="orderData"
        @expand-change="testExpand"
        ref="orderData"
        style="width: 100%">

        <el-table-column type="expand">
            <template slot-scope="{row}">
              <el-form label-position="left" inline class="expand_form">
                <el-row>
                  <el-form-item label="退款原因：">
                    <span>{{ row.refund_reason }}</span>
                  </el-form-item>
                </el-row>
              </el-form>
            </template>
          </el-table-column>

        <el-table-column label="订单号"
          align="center"
          min-width="130">
          <template slot-scope="{row}">{{row.order_sn}}</template>
        </el-table-column>
        <el-table-column label="商品名称"
          align="center"
          min-width="150">
          <template slot-scope="{row}">{{row.goods_name}}</template>
        </el-table-column>
        <el-table-column label="规格名称"
          align="center"
          min-width="150">
          <template slot-scope="{row}">{{row.spec_name}}</template>
        </el-table-column>
        <el-table-column label="购买数量"
          align="center"
          min-width="140">
          <template slot-scope="{row}">{{row.buy_num}}</template>
        </el-table-column>
        <el-table-column label="成交价"
          align="center"
          min-width="130">
          <template slot-scope="{row}">{{row.final_price}}元</template>
        </el-table-column>
        <el-table-column label="退货数量"
          align="center"
          min-width="130">
          <template slot-scope="{row}">{{row.refund_num}}</template>
        </el-table-column>
        <el-table-column label="退款金额"
          align="center"
          min-width="130">
          <template slot-scope="{row}">{{row.refund_money}}元</template>
        </el-table-column>
        <el-table-column label="申请时间"
          align="center"
          min-width="130">
          <template slot-scope="{row}">{{row.refund_time}}</template>
        </el-table-column>
        <el-table-column label="审核时间"
          align="center"
          min-width="130">
          <template slot-scope="{row}">{{row.check_time}}</template>
        </el-table-column>

        <el-table-column label="审核状态"
          align="center"
          min-width="150">
          <template slot-scope="{row}">{{row.refund_str}}</template>
        </el-table-column>

        <el-table-column label="操作"
          min-width="220"
          align="left"
          fixed="right">
          <template slot-scope="{row}" v-if="row.refund_str === '退款中'">
            <el-button @click="succes(row)"
              type="success"
              size="mini">同意</el-button>
            <el-button @click="err(row)"
              size="mini"
              type="danger">拒绝</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog title="退款"
        :visible.sync="diashow"
        width="30%"
        center>

        <span slot="footer"
          class="dialog-footer">

          <el-button @click="diashow = false">取 消</el-button>
          <el-button type="primary"
            @click="submit">确 定</el-button>
        </span>
      </el-dialog>
      <!-- <List :item="item" v-if="diasshow" @close="closeDia"></List> -->
      <BasePagination :max="maxPage" :totalCount="totalCount" :now.sync="nowPage"></BasePagination>
    </el-card>
  </div>
</template>
<script>

export default {
  components: {

  },
  data() {
    return {
      id: '',
      refund: '',
      item: {},
      orderData: [],
      time: [],
      maxPage: 1,
      nowPage: 1,
      pageSize: 10,
      totalCount: 1,
      starttime: '',
      endtime: '',
      diashow: false,
      order_id: '',
      order: '',
      goods: '',
      refund_screen: []
    }
  },
  watch: {
    nowPage() {
      this.getData()
    }
  },
  created() {
    this.refund = this.$route.query.data ? this.$route.query.data.refund : ''
    this.order_id = this.$route.query.data ? this.$route.query.data.order_id : ''

    // if (this.$route.query.order_sn) this.keywords = this.$route.query.order_sn
    // console.log(this.$route.query)
    this.getData()
  },
  methods: {
    testExpand(row) {
      console.log(row)
    },
    succes(row) {
      this.$confirm('确认退款?', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$http
            .post('/manage/order_refund/agree', {
              id: row.id
            })
            .then(res => {
              this.getData()
            })
        })
        .catch(() => {
          this.$message('已取消！')
        })
    },
    //拒绝退款
    err(row) {
      this.$confirm('确认拒绝退款?', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$http
            .post('manage/order_refund/refuse', {
              id: row.id
            })
            .then(res => {
              this.getData()
            })
        })
        .catch(() => {
          this.$message('已取消！')
        })
    },
    // 同意提交
    submit() {
      this.$http
        .post('/manage/order_refund/agree', {
          id: this.order_id
        })
        .then(res => {
          this.getData()
          this.diashow = false
        })
    },
    getData() {
      this.orderData = []
      if (this.$route.query.data) {
        // if (this.$route.query.data.status) this.pay = this.$route.query.data.status;
        if (this.$route.query.data.status1)
          this.state = this.$route.query.data.status1
      }

      this.$http
        .get('/manage/order_refund/lists', {
          params: {
            page: this.nowPage,
            rows: this.pageSize,
            // keywords: this.keywords,
            // member: this.member,
            refund: this.refund,
            order_id: this.order_id,
            order: this.order,
            goods: this.goods,
            starttime: this.time != null ? String(this.time.splice(0, 1)) : '',
            endtime: this.time != null ? String(this.time.splice(0, 1)) : ''
          }
        })
        .then(res => {
          this.orderData = res.data.list
          this.refund_screen = res.data.refund_screen
          this.maxPage = 6
          this.totalCount = res.data.total
          console.log(res)
        })
    },
    filterData() {
      this.nowPage === 1 ? this.getData() : (this.nowPage = 1)
    }
  }
}
</script>


<style lang="scss" module>
.header {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  > div {
    flex-grow: 0;
    flex-shrink: 0;
    margin: 10px 0;
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

.demo-table-expand {
  width: 50%;
  > * {
    width: 100%;
    margin-bottom: 0px;
    label {
      width: 100px;
      color: #99a9bf;
    }
  }
}
</style>
<style lang="scss" scoped>
.inp {
  margin-right: 10px;
  /* margin-top: -10px */
}
.tui {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  span {
    display: block;
    width: 20%;
  }
}
</style>

<style scoped>
.cont {
  display: flex;
}
.cont .el-form-item {
  width: 30%;
}
</style>