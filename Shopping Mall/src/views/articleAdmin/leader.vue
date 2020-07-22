<template>
  <div>
    <el-card>
      <el-form :model="form"
      label-position="right"
      label-width="100px">
        <el-form-item label="栏目名称："> <div> <h4>{{form.title}}</h4> </div> </el-form-item>
        <el-form-item label="文章内容：" prop="content">
          <editor id="ah" :content="form.content" @changed="(value)=>{form.content=value}"></editor>
        </el-form-item>
      </el-form>
      <div class="btnBox">
      <el-button type="primary"
      @click="editor()">提交</el-button>
    </div>
    </el-card>
  </div>
</template>

<script>
import editor from '@/components/editor'

export default {
  components: {
    editor
  },
  data() {
    return {
      keywords: '',
      form: {
        content: '',
        title:'',
        thumb: '',
        sort: '',

      },
      title: '',
      id: null,
      rules: {
        content: [{ required: true, message: '请输入文章内容' }],
      }
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
          this.form = res.data;
          console.log(this.form);
        })
    },
    editor(){
      let params = new URLSearchParams()
      params.append('id',1)
      params.append('content',this.form.content)
      params.append('title',this.form.title)
      params.append('thumb',this.form.thumb)
      params.append('sort',this.form.sort)
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
