<template>
  <div>
    <el-card>
      <div slot="header" :class="$style.header">
        <div :class="$style.search">
          <span>搜索：</span>
          <el-input v-model="keywords" placeholder="请输入昵称或者手机号" @change="filterData" clearable />
        </div>
        <div>
          <el-select v-model="state" @change="filterData" placeholder="请选择状态" clearable>
            <el-option
              v-for="item in state_screen"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
        <div>
          <el-select v-model="store" @change="filterData" placeholder="请选择是否为提货点" clearable>
            <el-option
              v-for="item in store_screen"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
        <el-button @click="filterData" type="primary">
          搜索
          <i class="el-icon-search"></i>
        </el-button>
      </div>

      <el-table :data="goodsData">
        <!-- 微信头像   昵称   身份（会员/团长/提货点）  推荐人数   订单量   佣金   已提现   注册时间    最后一次下单 -->
        <!-- <el-table-column label="会员ID" align="center" min-width="60">
          <template slot-scope="{row}">{{row.manage}}</template>
        </el-table-column> -->

        <el-table-column label="微信头像 " align="center" min-width="60">
          <template slot-scope="{row}">
            <img :src="row.thumb" class="imgs">
          </template>
        </el-table-column>

        <el-table-column label="昵称" align="center" min-width="75">
          <template slot-scope="{row}">{{row.nickname}}</template>
        </el-table-column>
        <el-table-column label="手机号" align="center" prop="phone"/>

        <el-table-column label="提货点" align="center" min-width="100">
          <template slot-scope="{row}">{{row.store_str}}</template>
        </el-table-column>

        <el-table-column label="余额" align="center" prop="amount"/>
        <el-table-column label="创建时间" align="center" prop="create_time"/>

        <el-table-column label="状态" align="center" prop="status_str">
          <template slot-scope="{row}">
            <!-- <el-button
              v-if="row.status_str=='封号'"
              size="mini"
              type="danger"
            >封号</el-button>
            <el-button
              v-if="row.status_str=='正常'"
              size="mini"
              type="success"
            >正常</el-button>
             <span >{{row.status_str}}</span> -->
            <el-button v-if="row.status_str=='禁用'" @click="states(row)" size="mini" type="success">正常</el-button>
            <el-button v-if="row.status_str=='正常'" @click="states(row)" size="mini" type="danger">封号</el-button>
            <!-- <el-button v-if="row.status_str=='正常'" @click="states(row)" size="mini" type="danger">封号</el-button> -->
            <!-- <el-button @click="states(row, '正常')"
              size="mini"
              :type="row.status == 1?'success':'primary'">
              {{row.status_str}}
            </el-button> -->
          </template>
        </el-table-column>

        <el-table-column label="操作"  width="330" align="center">
          <template slot-scope="{row}">
            
            <!-- <el-button @click="disabled(row)" type="danger" size="mini" style="margin-bottom: 5px;margin-left: 10px;">
              禁用
            </el-button> -->

            <el-button @click="topUp(row)"  type="success" size="mini" style="margin-bottom: 5px;margin-left: 10px;">
              充值
            </el-button>
            <el-button @click="bill(row)" size="mini" type="primary" style="margin-bottom: 5px;margin-left: 10px;">
              账单
            </el-button>
            <el-button @click="comm(row)" v-if="row.store_str=== '否'" size="mini" type="warning" style="margin-bottom: 5px;margin-left: 10px;">
              设置提货点
            </el-button>
            <!-- <el-button @click="resetPwd(row)" size="mini" type="warning">重置密码</el-button> -->
            <!-- <el-button v-if="row.status_str=='禁用'" @click="states(row)" size="mini" type="success">正常</el-button>
            <el-button v-if="row.status_str=='正常'" @click="states(row)" size="mini" type="danger">封号</el-button> -->
          </template>
        </el-table-column>
      </el-table>
      <!-- 弹出对话框 -->
      <BasePagination :max="maxPage" :now.sync="nowPage"></BasePagination>
      <topUp ref="topUp" @close="close" :id="id" :title="title" />
      <bill ref="bill" @close="close" :id="id" :title="title" />
      <comm ref="comm" v-if="isShowshezhi" @close="close" :id="id" :title="title" :member_id = "member_id"/>
      <ResetPwd :item="item" v-if="showResetPwd" @close="showResetPwd = false"></ResetPwd>
    </el-card>
  </div>
</template>
<script>
import topUp from "./components/list/topUp";
import bill from "./components/list/bill";
import comm from "./components/list/comm";
import ResetPwd from "./components/list/MemberResetPwd"
export default {
  components: {
    topUp,
    bill,
    comm,
    ResetPwd,
  },
  created() {
    this.reward = this.$route.query.data ? this.$route.query.data.reward : ''

    // const rewardFlag = this.$route.query.data.reward
    // if(rewardFlag){

    // }
    this.getData()
    // this.getType()
  },
  data() {
    return {
      refundShow: false,
      reward: '',
      goodsData: [],
      date:[],
      maxPage: 1,
      nowPage: 1,
      id: null,
      title: '',
      manage: '',
      artist: '',
      keywords:'',
      isShowshezhi:false,
      isShowRecharge:false,
      state_screen:[],
      team_screen: [],
      store_screen: [],
      store: '',
      team: '',
      state: '',
      item: {},
      showResetPwd: false
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
        .get('/manage/member/lists', {
          params: {
            rows: 8,
            page: this.nowPage,
            keywords: this.keywords,
            state: this.state,
            team: this.team,
            store: this.store,
            reward: this.reward,
          }
        })
        .then(res => {
          console.log(res)
          this.goodsData = res.data.list
          this.maxPage = res.data.page_total
          this.state_screen = res.data.state_screen
          this.team_screen = res.data.team_screen
          this.store_screen = res.data.store_screen
          console.log(this.goodsData)
        })
    },
    filterData() {
      this.nowPage == 1 ? this.getData() : (this.nowPage = 1)
    },
    async states(row){
      console.log(row);
      const h = this.$createElement;
      const confirm = await this.$msgbox({
          title: '提示',
          message: h('p', null, [
            h('span', null, '是否切换用户'),
            h('b', { style: 'color: teal' }, `${row.nickname}`),
            h('span', null, '状态'),
          ]),
          type: 'warning',
          showCancelButton: true,
      }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消禁用'
          })});
      if(!confirm) return;
      let params = new URLSearchParams();
      params.append('member_id', row.member_id);
      params.append('newstate', row.status === 0 ? 1: 0);
      await this.$http.post('/manage/member/state',params);
      this.getData();
    },
    resetPwd(row) {
      this.item = row;
      this.showResetPwd = true;
    },
    bill(row) {
      console.log(row);
      this.id = row.member_id;
      this.title = row.nickname;
      this.$refs.bill.isDialog = true;
    },
    topUp(row){
      this.id = row.member_id;
      this.title = row.nickname;  
      this.$refs.topUp.isDialog = true;
    },
    comm(row) {
      console.log(row);
      this.id = row.member_id;
      this.title = row.nickname;
      this.isShowshezhi= true
      this.member_id = row.member_id
    },
    close(val) {
      if (val) this.getData()
      this.refundShow = false
      this.isShowRecharge = false
      this.isShowshezhi=false
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
.imgs {
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
</style>