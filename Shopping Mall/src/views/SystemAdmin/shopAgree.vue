<template>
  <el-card>
    <el-form :model="form"
      label-position="right"
      label-width="100px">
      <el-form-item label="栏目名称：">
        <div>
          <h4>{{form.title}}</h4>
        </div>
      </el-form-item>
      <el-form-item label="内容：">
          <editor id="af" :content="form.ctx"  @changed="(value)=>{form.ctx=value}" ></editor>
      </el-form-item>
    </el-form>

    <div class="btnBox">
      <el-button type="primary"
      @click="editor()">提交</el-button>
    </div>
  </el-card>
</template>

<script>
import editor from '@/components/editor'
export default {
  components: {
    editor
  },
  data() {
    return {
      form: {
        ctx:''
      },
    }
  },
  methods: {
    getData() {
      this.$http
        .get('/manage/article/info', {
          params: {
            id: 1
          }
        })
        .then(res => {
          this.form = res.data.info
          this.form.ctx = res.data.info.content
        })
    },
    editor(){
      let params = new URLSearchParams()
      params.append('id',1)
      params.append('content',this.form.ctx)
      params.append('cate',1)
      params.append('title',this.form.title)
      params.append('thumb',this.form.thumb)
      params.append('summary',this.form.summary)
      this.$http.post('manage/article/edit',params).then(res => {
        this.getData()
      })
    }
  },
  created() {
    this.getData()
  }
}
</script>

<style scoped lang="scss">
h4 {
  margin: 0;
}
.btnBox {
  margin-left: 100px;
}
</style>
