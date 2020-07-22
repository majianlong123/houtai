<template>
  <div>
    <el-card>
      <div slot="header" :class="$style.header">
        <div :class="$style.search">
          <span>搜索：</span>
          <el-input v-model="member" placeholder="请输入昵称或手机号" clearable @change="getData" />
        </div>
        <div>
          <el-select v-model="reply" placeholder="请选择回复状态" @change="getData" clearable>
            <el-option v-for="item in reply_screen" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </div>
        <div>
          <el-select v-model="show" placeholder="请选择显示状态" @change="getData" clearable>
            <el-option v-for="item in show_screen" :key="item.value" :label="item.label" :value="item.value" />
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
                <el-row>
                  <el-form-item label="评论内容：">
                    <span>{{ row.content }}</span>
                  </el-form-item>
                </el-row>
                <el-row>
                <el-form-item label="回复内容：">
                  <span>{{ row.reply }}</span>
                </el-form-item>
                </el-row>
                <el-row>
                <el-form-item label="相册：">
                  <template v-for="items in row.picurls">
                    <a :href="items"
                      target="_blank"  >
                      <img :src="items" style="width:70px;height:70px;margin-right:20px"
                        class="img" />
                    </a>
                  </template>
                </el-form-item>
                </el-row>
              </el-form>
            </template>
          </el-table-column>  

        <el-table-column  label="昵称/手机号" align="center">
          <template slot-scope="{row}">{{row.member_info}}</template>
        </el-table-column>
        <el-table-column label="商品名称"
          align="center"
          width="120" class-name="col_name">
            <template slot-scope="{row}">
            <el-popover trigger="hover" placement="top" popper-class="popper">
              <p> {{row.goods_name }}</p>
              <div slot="reference" class="name-wrapper">
                <p size="medium">{{row.goods_name }}</p>
              </div>
            </el-popover>
          </template>
          </el-table-column>
        <el-table-column  label="规格名称" align="center">
          <template slot-scope="{row}">{{row.spec_name}}</template>
        </el-table-column>
        <el-table-column  label="评价时间" align="center">
          <template slot-scope="{row}">{{row.create_time}}</template>
        </el-table-column>

        <el-table-column label="是否回复" align="center">
          <template slot-scope="{row}">{{row.reply_str}}</template>
        </el-table-column>
        
        <el-table-column label="是否显示" align="center">
           <template slot-scope="{row}">
            <el-button @click="states(row)"
              size="mini"
              :type="row.is_show == 1?'success':'info'">
              {{row.show_str}}
            </el-button>
          </template>
        </el-table-column>

        <el-table-column label="审核时间" min-width="110" align="center">
          <template slot-scope="{row}">{{row.create_time}}</template>
        </el-table-column>
        
        <el-table-column label="操作"  align="center">
          <template slot-scope="{row}">
            <el-button @click="refuse(row)" size="mini" v-if="row.is_reply == 0" type="success">
              回复
            </el-button>
            <!-- <el-button @click="album(row)" size="mini" v-if="row.status !== 0" type="primary">
              相册
            </el-button> -->
          </template>
        </el-table-column>
      </el-table>
      <BasePagination :max="maxPage" :now.sync="nowPage"></BasePagination>
      <refund v-if="refundShow" :id="id" :title="title" @close="close"></refund>
      <!-- <album  v-if="albumDialog" :pics="pics" :title="title" @close="close"/> -->

    </el-card>

  </div>
</template>

<script>
import refund from './components/refund'
// import album from "./components/album";

export default {
  components: {
    refund,
    // album
  },
  created() {
    if (this.$route.query.data) {
      console.log(this.$route.query)
      this.reply = this.$route.query.data.reply
    }
    this.getData()
  },
  data() {
    return {
      reply: 1,
      reply_screen: [],
      type: '',
      type_screen: [],
      member: '',
      withdrawData: [],
      maxPage: 1,
      nowPage: 1,
      refundShow: false,
      show_screen: [],
      show: '',
      albumDialog: false,
      title: '',
      id: '',
      pics: [],
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
        .get('/manage/comment/lists', {
          params: {
            page: this.nowPage,
            rows: 10,
            member: this.member,
            show: this.show,
            reply: this.reply
          }
        })
        .then(res => {
          this.withdrawData = res.data.list
          this.reply_screen = res.data.reply_screen
          this.show_screen = res.data.show_screen
          this.maxPage = Math.ceil(res.data.total / 10)
        })
    },
    filterData() {
      this.nowPage === 1 ? this.getData() : (this.nowPage = 1)
    },
    open(data) {
      this.$confirm('确定拒绝吗?', '拒绝', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(res => {
        let params = new URLSearchParams()
        params.append('id', data.id)
        this.$http.post('/manage/cash/agree', params).then(res => {
          if (res.code == 1) {
            this.getData()
          }
        })
      })
    },
    async states(row) {
      const h = this.$createElement;
      const confirm = await this.$msgbox({
          title: '提示',
          message: h('p', null, [
            h('span', null, '是否切换'),
            // h('b', { style: 'color: teal' }, `${row.name}`),
            h('span', null, `状态`),
          ]),
          type: 'warning',
          showCancelButton: true,
      }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消切换'
          })});
      if(!confirm) return;
      let params = new URLSearchParams();
      params.append('id', row.id);
      params.append('newstate', row.is_show == 1 ? 0 : 1);
      console.log(row.status);
      this.$http.post('/manage/comment/state',params);
      this.getData();
    },
    refuse(row) {
      this.id = row.id
      this.refundShow = true
    },
    album(data) {
      this.pics = data.picurls;
      this.title = data.id;
      this.albumDialog = true;
      console.log(this.title);
    },
    close(val) {
      if (val) this.getData()
      this.refundShow = false;
      this.albumDialog = false;
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



<style lang="scss" scoped>
div /deep/ .col_name div .name-wrapper p{
  width: 100px;
  white-space:nowrap;
  overflow: hidden;
  cursor: pointer;
  text-overflow:ellipsis;
}
</style>