<template>
  <div>
    <el-card>
      <div slot="header" :class="$style.header">
        <div :class="$style.search">
          <span>搜索：</span>
          <el-input v-model="member" placeholder="请输入昵称/手机号" clearable @change="getData" />
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

      <el-table :data="articleData">
        <!-- <el-table-column type="expand">
          <template slot-scope="{row}">
            <el-form label-position="left" inline>
              <el-form-item label="审核回复："  class="expand_form">
                <span>{{ row.reply }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column> -->
        <el-table-column label="昵称/手机号" align="center" min-width="100">
          <template slot-scope="{row}">{{row.member_info}}</template>
        </el-table-column>
        <el-table-column label="真实姓名" align="center" min-width="100">
          <template slot-scope="{row}">{{row.realname}}</template>
        </el-table-column>
        <el-table-column label="联系电话" align="center" min-width="100">
          <template slot-scope="{row}">{{row.contact}}</template>
        </el-table-column>
        

        <el-table-column label="身份证号" align="center" min-width="100">
          <template slot-scope="{row}">{{row.idcard}}</template>
        </el-table-column>

        <el-table-column label="申请时间" align="center" min-width="100">
          <template slot-scope="{row}">{{row.apply_time}}</template>
        </el-table-column>
        <el-table-column label="审核时间" align="center" min-width="100">
          <template slot-scope="{row}">{{row.check_time}}</template>
        </el-table-column>
        <el-table-column label="审核状态" align="center" min-width="100">
          <template slot-scope="{row}">{{row.status_str}}</template>
        </el-table-column>

        <el-table-column label="操作" min-width="100px" align="center">
          <template slot-scope="{row}" v-if="row.status !== 2">
            <el-button @click="confirm(row, '同意')" size="mini" type="primary">
              同意
            </el-button>
            <el-button @click="refuse(row, '拒绝')" size="mini" type="warning">
              拒绝
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <BasePagination :max="maxPage" :now.sync="nowPage"></BasePagination>
         <refuse ref="refuse" @getData="getData"
        :id="id"
        :title="title" />
    </el-card>
  </div>
</template>

<script>
import refuse from "./components/refuse";

export default {
  components: {
    refuse
  },
  data() {
    return {
      keywords: '',
      articleData: [],
      title: '',
      maxPage: 1,
      nowPage: 1,
      id: null,
      item: {},
      dialogVisible: false,
      member: '',
      state: 1,
      state_screen: [],

    }
  },
   created() {
    if (this.$route.query.data) {
      console.log(this.$route.query.data)
      this.state = this.$route.query.data.state
    }
    this.getData()
    },
  watch: {
    nowPage() {
      this.getData()
    }
  },
  methods: {
    getData() {
      this.$http.get('/manage/team_apply/lists', {
        params: {
          page: this.nowPage,
          rows: 10,
          state: this.state,
          member: this.member,
        }
      }).then(res => {
        this.articleData = res.data.list;
        this.state_screen = res.data.state_screen
        console.log(this.articleData)
      })
    },
    filterData() {
      this.nowPage === 1 ? this.getData() : (this.nowPage = 1)
    },
    refuse(row){
      this.id = row.id;
      this.$refs.refuse.isDialog = true;
    },
    async confirm(row, str){
      console.log(row);
      const h = this.$createElement;
      const confirm = await this.$msgbox({
          title: '提示',
          message: h('p', null, [
            h('span', null, `是否${str}`),
            h('b', { style: 'color: teal' }, `${row.realname}`),
            h('span', null, `申请`),
          ]),
          type: 'warning',
          showCancelButton: true,
      }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消申请'
          })});
      if(!confirm) return;
      let params = new URLSearchParams();
      params.append('id', row.id);
      let url = str == '同意' ? '/manage/team_apply/agree' : '/manage/team_apply/deny';
      await this.$http.post(url,params);
      this.getData();
    },
    close(val){
      if(val) this.getData();
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
img {
  height: 100px;
}
.tableImg {
  width: 75px;
  height: 75px;
}
</style>
<style>
.add {
  display: inline-block;
  position: absolute;
  right: 40px;
}
.tableImg {
  width: 75px;
  height: 75px;
}
</style>
<style>
.add {
  display: inline-block;
  position: absolute;
  right: 40px;
}
</style>
