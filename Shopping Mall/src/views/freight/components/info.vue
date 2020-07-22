<template>
  <div>
    <el-dialog :title="`${name}`" :visible.sync="isDialog" @close="close" width="50%" :center="true" :close-on-click-modal="false">
      <div style="text-align: right;margin-bottom:20px">
          <el-button @click="edit()" type="primary">
          添加地区
        </el-button>
      </div>
          <el-table border :data="tableData">

            <el-table-column label="区域" align="center">
              <template slot-scope="{row}">{{row.region_name}}</template>
            </el-table-column>
             <el-table-column label="运费" align="center">
              <template slot-scope="{row}">{{row.amount}}</template>
            </el-table-column>


            <el-table-column label="操作" align="center">
              <template slot-scope="{row}">
                <el-button type="primary" size="mini" @click="edit(row)">编辑</el-button>
                <el-button type="danger" size="mini" @click="del(row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button class="btn" @click="isDialog = false">取 消</el-button>
        <el-button class="btn" type="primary" @click="close">确 定</el-button>
      </span>

      <BasePagination :max="maxPage" :now.sync="nowPage"></BasePagination>
    </el-dialog>

    <addInfo  v-if="iseditShow" :title="title" :id="id" :item="item1" @close="addClose"></addInfo>
      
  </div>
</template>

<script>
import addInfo from "./addInfo";

export default {
  components: {
    addInfo
  },
  props: {
    name: String,
    id: Number
  },
  data() {
    return {
      iseditShow: false,
      tableData: [],
      item1:{},
      data: {},
      click_d: false,
      isDialog: true,
      title: '',
      maxPage: 1,
      nowPage: 1,
    };
  },
  created() {
    this.getData();
  },
  watch: {
    nowPage() {
      this.getData()
    }
  },
  methods: {
    getData() {
      this.$http.get("/manage/freight_template_bill/lists",{
        params:{
          rows: 8,
          page: this.nowPage,
          ft_id: this.id,
        }
      })
      .then(res => {
        this.tableData = res.data.list;
        this.maxPage = res.data.page_total;
      });
    },
    async del(row) {
      const h = this.$createElement;
      const confirm = await this.$msgbox({
          title: '提示',
          message: h('p', null, [
            h('span', null, '是否删除'),
            h('b', { style: 'color: teal' }, `${row.region_name}`),
            h('span', null, `地区`),
          ]),
          type: 'warning',
          showCancelButton: true,
      }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
      })});
      if(!confirm) return;
      let params = new URLSearchParams();
      params.append('ft_id', row.ft_id);
      params.append('region_id', row.region_id);

      await this.$http.post('/manage/freight_template_bill/del',params);
      this.getData();
    },
    close() {
      this.$emit("close");
    },
    addClose(val){
      this.iseditShow = false;
      if(val) this.getData();
    },
     filterData() {
      this.nowPage == 1 ? this.getData() : (this.nowPage = 1)
    },
    edit(data) {
      if(data){
        this.item1 = data;
        this.title = '修改地区'
      }else{
        this.title = '添加地区'
      }
      this.iseditShow = true;
    },
    
  }
};
</script>

<style  lang="scss">
 .tableImg  img{
  width: 70px;
  height: 70px;
}

</style>


