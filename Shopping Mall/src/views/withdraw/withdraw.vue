<template>
  <div>
    <el-card>
      <div slot="header" :class="$style.header">
        <div :class="$style.search">
          <span>搜索：</span>
          <el-input v-model="member" placeholder="请输入用户名称" clearable @change="getData" />
        </div>
        <div>
          <el-select v-model="type" placeholder="请选择提现方式" @change="getData" clearable>
            <el-option v-for="item in type_screen" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </div>
        <div>
          <el-select v-model="state" placeholder="请选择审核状态" @change="getData" clearable>
            <el-option v-for="item in state_screen" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </div>
        <el-button @click="filterData" type="primary">
          搜索
          <i class="el-icon-search"></i>
        </el-button>
      </div>
      <el-table :data="withdrawData">
        <el-table-column type="expand">
          <template slot-scope="{row}">
            <el-form label-position="left" inline class="expand_form">
              <el-form-item label="备注：">
                <span>{{ row.reply }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column> 
        <el-table-column min-width="130" label="账户/昵称" align="center">
          <template slot-scope="{row}" v-if="row.member_info">{{row.member_info}}</template>
        </el-table-column>

        <el-table-column label="提现方式" align="center">
          <template slot-scope="{row}">{{row.type=="AMT"?"银行卡":"支付宝"}}</template>
        </el-table-column>

        <el-table-column label="申请金额" align="center">
          <template slot-scope="{row}">{{row.apply_amount}}</template>
        </el-table-column>

        <el-table-column label="手续费" align="center">
          <template slot-scope="{row}">{{row.taxfee}}</template>
        </el-table-column>
        <el-table-column label="到账金额" align="center">
          <template slot-scope="{row}">{{row.real_amount}}</template>
        </el-table-column>

        <el-table-column label="真实姓名" align="center">
          <template slot-scope="{row}">{{row.realname}}</template>
        </el-table-column>

        <el-table-column label="开户行" align="center" >
          <template slot-scope="{row}">{{row.bank}}</template>
        </el-table-column>
     
        <el-table-column label="提现账号" align="center">
          <template slot-scope="{row}">{{row.account}}</template>
        </el-table-column>        
         <el-table-column label="申请时间" min-width="110" align="center">
          <template slot-scope="{row}">{{row.apply_time}}</template>
        </el-table-column>

        <el-table-column label="审核时间" min-width="110" align="center">
          <template slot-scope="{row}">{{row.check_time}}</template>
        </el-table-column>

        <el-table-column label="状态" align="center">
          <template slot-scope="{row}">{{row.status_str}}</template>
        </el-table-column>

        <el-table-column label="操作" width="160px" align="center">
          <template slot-scope="{row}">
            <el-button @click="open(row)" size="mini" v-if="row.status == 0" type="success">
              同意
            </el-button>
            <el-button @click="refuse(row)" size="mini" v-if="row.status == 0" type="danger">
              拒绝
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <BasePagination :max="maxPage" :now.sync="nowPage"></BasePagination>
      <refund v-if="refundShow" :id="id" @close="close"></refund>
    </el-card>

  </div>
</template>

<script>
import refund from './components/refund'
export default {
  components: {
    refund
  },
  created() {
    if (this.$route.query.data) {
      console.log(this.$route.query.data)
      this.state = this.$route.query.data.state
    }
    
    this.getData()
  },
  data() {
    return {
      state: 1,
      state_screen: [],
      type: '',
      type_screen: [],
      member_id: '',
      member: '',
      withdrawData: [],
      maxPage: 1,
      nowPage: 1,
      refundShow: false,
      date:[]
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
        .get('/manage/cash/lists', {
          params: {
            page: this.nowPage,
            rows: 10,
            member: this.member,
            member_id: this.member_id,
            type: this.type,
            state: this.state,
            // starttime: this.date?this.date[0]:"",
            // endtime: this.date?this.date[1]:"",
          }
        })
        .then(res => {
          this.withdrawData = res.data.list
          this.state_screen = res.data.state_screen
          this.type_screen = res.data.type_screen
          this.maxPage = Math.ceil(res.data.total / 10)
        })
    },
    filterData() {
      this.nowPage === 1 ? this.getData() : (this.nowPage = 1)
    },
    async open(row, str){
      console.log(row);
      const h = this.$createElement;
      const confirm = await this.$msgbox({
          title: '提示',
          message: h('p', null, [
            h('span', null, `是否同意`),
            h('b', { style: 'color: teal' }, `${row.realname}`),
            h('span', null, `提现`),
          ]),
          type: 'warning',
          showCancelButton: true,
      }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作'
          })});
      if(!confirm) return;
      let params = new URLSearchParams();
      params.append('id', row.id);
      await this.$http.post('/manage/cash/agree',params);
      this.getData();
    },
    refuse(row) {
      this.id = row.id
      this.refundShow = true
    },
    close(val) {
      if (val) this.getData()
      this.refundShow = false
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