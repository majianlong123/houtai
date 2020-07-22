<template>
  <el-dialog :title="this.id>0?'修改文章':'新增文章'" :visible.sync="isDialog" :close-on-click-modal="false" width="50%" top="30px">
    <el-form :model="form" ref="form" :rules="rules" label-position="right" label-width="120px">
      <el-form-item label="文章标题" prop="title">
        <el-input v-model="form.title" placeholder="请输入文章标题"></el-input>
      </el-form-item>

      <!-- <el-form-item label="缩略图" prop="thumb">
        <label for="files" style="width:150px;height:100px">
          <img
            :src="form.thumb?form.thumb:require('@/assets/-svg/add.svg')"
            alt
            style="width:150px;height:100px"
          /> 
        </label>
        <input type="file" id="files" style="display:none" @change="fileChange()" />
        
        <div v-if="form.thumb">
          <span style="color:#2b232366">提示:点击图片重新上传640×320尺寸的图片</span>
        </div>
        <div v-else><span style="color:#2b232366">提示:请上传640×320尺寸的图片</span></div>
      </el-form-item> -->

      <!-- <el-form-item label="权重" prop="sort">
        <el-slider v-model="form.sort" :max="255" show-input>
        </el-slider>
      </el-form-item> -->

      <el-form-item label="文章内容" prop="content">
        <editor id="ah" :content="form.content" @changed="(value)=>{form.content=value}"></editor>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="isDialog = false">取 消</el-button>
      <el-button type="primary" @click="toSave('form')">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import editor from '@/components/editor'
export default {
  components: {
    editor
  },
  props: {
    id: Number
  },
  data() {
    return {
      isDialog: false,
      disabled: 'false',
      form: {
        title: '',
        sort: null,
        content: ''
      },
      rules: {
        title: [{ required: true, message: '请输入公告标题' }],
        sort: [{ required: true, message: '请选择权重', trigger: 'change' }],
        content: [{ required: true, message: '请输入文章内容' }]
      }
    }
  },
  watch: {
    isDialog(val) {
      if (val) {
        if (this.id > 0) {
          this.getInfo()
        }
      } else {
        this.$refs.form.resetFields()
      }
    }
  },
  computed: {},
  methods: {
    getInfo() {
      this.$http
        .get('/manage/article/info', {
          params: {
            id: this.id
          }
        })
        .then(res => {
          this.form = res.data
        })
    },
    toSave(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.id > 0) {
            let params = new URLSearchParams()
            params.append('id', this.id)
            params.append('content', this.form.content)
            params.append('title', this.form.title)
            params.append('sort', this.form.sort)
            params.append('thumb', this.form.thumb)
            this.$http.post('/manage/article/edit', params).then(res => {
              this.isDialog = false
              this.$emit('getData')
            })
          } else {
            let params = new URLSearchParams()
            params.append('cate', 'one')
            params.append('sort', this.form.sort)
            params.append('content', this.form.content)
            params.append('title', this.form.title)
            params.append('thumb', this.form.thumb)
            this.$http.post('/manage/article/add', params).then(res => {
              this.isDialog = false
              this.$emit('getData')
            })
          }
        }
      })
    },
    fileChange(e) {
      let file = document.getElementById('files').files[0]
      const params = new FormData()
      params.append('file', file)
      this.$http.post('/manage/image/upload', params).then(res => {
        if (res.code === 1) {
          this.form.thumb = res.data.fileurl
        }
      })
    }
  },
  mounted() {}
}
</script>
<style module lang="scss">
</style>