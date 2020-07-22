<template>
  <div class="home">
    <!-- <h1>您有<span class="num">{{num}}</span>工单待处理</h1> -->
    <el-divider><h2>统计列表:</h2></el-divider>
    <div class="cardBody">
      <!-- <h2>统计列表:</h2> -->
      <div v-for="(item, index) in infoList" :key="index">
        <div>{{ item.title }}</div>
        <div @click="push(item.path, item.data)" class="route">{{ item.number }}</div>
      </div>
    </div>
    <el-divider><h2>订单统计:</h2></el-divider>

    <div>
      <span>请选择时间: </span>

      <el-date-picker v-model="date" clearable @change="filterData"
        type="daterange" range-separator="至"
        value-format="yyyy-MM-dd"
        start-placeholder="开始日期" end-placeholder="结束日期">>
      </el-date-picker>

      <el-button @click="filterData" type="primary" style="margin-left:30px">
        搜索
        <i class="el-icon-search"></i>
      </el-button>
    </div>

    <div class="cardBody">
      <div v-for="(item, index) in dingdanList" :key="index">
        <div>{{ item.title }}</div>
        <div @click="push(item.path, item.data)" class="route">{{ item.number }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "home",
  data() {
    return {
      num: 0,
      dataMsg:{},
      dataMsg2: {},
      date: [],
    };
  },
  created(){
  },
  computed: {
    infoList() {
      return [
        { ...this.dataMsg.member_num, path: '/vipAdmin/vipAdmin',data:{reward:1}},//跳转到会员列表,筛选（reward>0）
        { ...this.dataMsg.refund_num, path: '/order/MemberendPayout',data:{refund:'2'}},//跳转到跳转到退款列表，筛选（refund=1）
        // { ...this.dataMsg.goods_num,path: '/goods/list'},//"跳转到积分商品列表，无筛选
        // { ...this.dataMsg.cash_apply_num,path: '/withdraw/withdraw',data:{state: 1}},//"跳转到积分商品列表，无筛选
        // { ...this.dataMsg.un_delivery_num,path: '/order/delivery',data:{state:3}},
        // { ...this.dataMsg.un_reply,path: '/evaluate/evaluate', data: {reply: 1}},
      ];
      console.log()
    },
    dingdanList() {
      return [
        { ...this.dataMsg2.order_num},//跳转到会员列表,筛选（reward>0）
        { ...this.dataMsg2.order_amount},//跳转到跳转到退款列表，筛选（refund=1）
        { ...this.dataMsg2.refund_amount},//跳转到跳转到退款列表，筛选（refund=1）
      ]
    }
  },

  mounted() {
    this.getData();
    this.getData2();
  },
  methods: {
    getData() {
      this.$http.get("/manage/common/census").then(res => {
          // console.log(res)
          this.dataMsg = res.data;
        }).catch(err=>{
          this.$router.push("/login");
        });
    },
    getData2() {
      this.$http.get("/manage/common/order_census",{
        params: {
          starttime: this.date?this.date[0]:"",
          endtime: this.date?this.date[1]:"",
        }
      }).then(res => {
        console.log(res)
        // console.log(this.date)
        this.dataMsg2 = res.data;
      })
    },
    filterData() {
      this.nowPage == 1 ? this.getData2() : (this.nowPage = 1)
    },
    push(path, data) {
      this.$router.push({
        path: path,
        query: {
          data: data
        }
      });
    }
  }
};
</script>

<style scoped lang="scss">
.num {
  color: red;
  display: inline-block;
  margin: 0 10px;
}
.cardBody {
  // display: flex;
  // flex-wrap: wrap;
  // justify-content: space-between;

  > div {
    display: inline-block;
    width: 19%;
    margin: 20px 3%;
    height: 200px;
    border-radius: 12px;
    margin-bottom: 15px;
    box-shadow: 6px 6px 6px rgba(0, 0, 0, 0.1);
    background: white;

    > div {
      &:first-child {
        font-size: 16px;
        padding: 10px 20px;
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);
      }

      &:last-child {
        text-align: center;
        padding: 40px 0;
        font-size: 40px;
        &:hover {
          cursor: pointer;
        }
      }
    }

    > img {
      width: 100px;
      height: 100px;
      top: 50%;
      right: 8%;
      transform: translateY(-50%);
    }
  }

  > div[space] {
    height: 0;
    margin: 0;
  }
}
.home {
  background: white;
  padding: 25px;
  border-radius: 8px;
}
</style>

