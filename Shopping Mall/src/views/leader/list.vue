<template>
  <div>
    <el-card>
      <div slot="header" :class="$style.header">
        <div :class="$style.search">
          <span>搜索：</span>
          <el-input v-model="keywords" placeholder="请输入昵称/手机号" @change="filterData" clearable />
        </div>
        <!-- <div>
          <el-select v-model="level" @change="filterData" placeholder="选择身份" clearable>
            <el-option
              v-for="item in level_screen"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div> -->
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

        <!-- <el-table-column label="微信头像 " align="center" class="imgbox" min-width="60">
          <template slot-scope="{row}">
            <img :src="row.thumb" class="imgs">
          </template>
        </el-table-column> -->
        <el-table-column el-table-column label="昵称/手机号" align="center" min-width="100">
          <template slot-scope="{row}">{{row.member_info}}</template>
        </el-table-column>
        <el-table-column label="真实姓名" align="center" min-width="100">
          <template slot-scope="{row}">{{row.realname}}</template>
        </el-table-column>
        <el-table-column label="联系电话" align="center" min-width="100">
          <template slot-scope="{row}">{{row.contact}}</template>
        </el-table-column>
        

        <el-table-column label="身份证号" align="center" min-width="75">
          <template slot-scope="{row}">{{row.idcard}}</template>
        </el-table-column>

        <el-table-column label="注册时间" align="center" min-width="80">
          <template slot-scope="{row}">{{row.create_time}}</template>
        </el-table-column>
 
        <!-- <el-table-column label="最后一次下单" align="center" min-width="80">
          <template slot-scope="{row}">
            <el-button @click="states(row)" size="mini" :type="row.status == 1?'success':'danger'">
              {{row.status_str}}
            </el-button>
          </template>
        </el-table-column> -->
        

        <el-table-column label="操作"  width="330" align="center">
          <template slot-scope="{row}">
            <el-button @click="jump(row, '1')" size="mini" style="margin-bottom: 5px;margin-left: 10px;" type="success">
              查看配送{{row.order_delivery_num}}
            </el-button>
            <el-button @click="jump(row)" size="mini" style="margin-bottom: 5px;margin-left: 10px;" type="success">
              查看自提{{row.order_pickup_num}}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 弹出对话框 -->
      <BasePagination :max="maxPage" :now.sync="nowPage"></BasePagination>
   
    </el-card>
  </div>
</template>
<script>

export default {
  components: {
  },
  created() {
    this.getData()
  },
  data() {
    return {
      refundShow: false,
      level: '',
      level_screen: [],
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
      type_screen:[]
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
        .get('/manage/team/lists', {
          params: {
            rows: 8,
            page: this.nowPage,
            keywords: this.keywords,
            level: this.level,
          }
        })
        .then(res => {
          this.goodsData = res.data.list
          this.maxPage = res.data.page_total
          this.level_screen = res.data.level_screen
          console.log(this.goodsData)
        })
    },
    jump(row, str){
    let url;
    if(str === '1' && row.order_delivery_num > 0){
        url = '/order/delivery';
    }else if(str !== '1' && row.order_pickup_num > 0){
        url = '/order/mention';
    }else{
      return;
    }
      this.$router.push({
        path: url,
        query: {
          data:{
            team_id: row.team_id
          }
        }
      })
    },
    filterData() {
      this.nowPage == 1 ? this.getData() : (this.nowPage = 1)
    },
    close(val) {
      if (val) this.getData()
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