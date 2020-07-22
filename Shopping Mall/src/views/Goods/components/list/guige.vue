<template>
  <div>
    <el-dialog :title="`${item.name}-规格管理`" :visible.sync="isDialog" @close="close" width="50%" :center="true" :close-on-click-modal="false">
      <div style="text-align: right;margin-bottom:20px">
          <el-button @click="edit()" type="primary">
          新增规格
        </el-button>
      </div>
          <el-table border :data="form">
            <el-table-column label="缩略图"
              align="center" >
              <template slot-scope="{row}">
                <a :href="row.thumb" target="_blank" class="tableImg">
                  <img :src="row.thumb" />
                </a>
              </template>
            </el-table-column>

            <el-table-column label="规格名称" align="center">
              <template slot-scope="{row}">{{row.spec_name}}</template>
            </el-table-column>

            <el-table-column label="市场价" align="center">
              <template slot-scope="{row}">{{row.market_price}}</template>
            </el-table-column>

            <el-table-column label="售价" align="center">
              <template slot-scope="{row}">{{row.price}}</template>
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
        <el-button class="btn" type="primary" @click="submit">确 定</el-button>
      </span>
    </el-dialog> 

    <AddGuige style="z-index:100" v-if="iseditShow" :title="title" :id="id" :item="item1" @close="addClose"></AddGuige>
  </div>
</template>

<script>
import AddGuige from "./AddGuige";
export default {
  components: {
    AddGuige,
  },
  props: {
    item: Object,
  },
  data() {
    return {
      iseditShow: false,
      form: [],
      item1:{},
      data: {},
      click_d: false,
      isDialog: true,
      id: 0,
      title: ''
    };
  },
  created() {
    this.getData();
  },
  methods: {
    getData() {
      this.$http.get("/manage/goods_spec/lists?goods_id=" + this.item.goods_id)
      .then(res => {
        this.form = res.data.list;
        console.log(res)
      });
    },
    async del(row) {
      const h = this.$createElement;
      const confirm = await this.$msgbox({
          title: '提示',
          message: h('p', null, [
            h('span', null, '是否删除'),
            h('b', { style: 'color: teal' }, `${row.spec_name}`),
            h('span', null, `规格`),
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
      params.append('spec_id', row.spec_id);
      console.log(row.status);
      await this.$http.post('/manage/goods_spec/del',params);
      this.getData();
    },
    close() {
      this.$emit("close");
    },
    addClose(){
      this.iseditShow = false;
      this.getData();
    },
    submit() {
      this.isDialog = false;
    },
    edit(data) {
      if(data){
        this.id = data.goods_id;
        this.item1 = data;
        console.log(this.item1);
        this.title = '修改规格'
      }else{
        this.id = this.item.goods_id;
        this.title = '添加规格'
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


