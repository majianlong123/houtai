<template>
  <div :class="$style.body">
    <el-pagination background
      layout="prev, pager, next"
      :page-count="max"
      :current-page="now"
      @current-change="change">
    </el-pagination>
  </div>
</template>

<script>
export default {
  props: {
    max: {
      default: () => 1
    },
    now: {
      default: () => 1
    }
  },

  methods: {
    change(val) {
      this.$emit('update:now', val)
    }
  }
}
</script>

<style module lang="scss">
.body {
  padding-top: 10px;
  text-align: center;
}
</style>