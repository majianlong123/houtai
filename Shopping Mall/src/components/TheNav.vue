<template>
  <div>
    <div :class="$style.logo">
      <div>
      <img src="../icons/png/logo.png" :class="$style.img"/>
      </div>
    </div>

    <el-menu :default-active="active"
      @select="select"
      background-color="#304156"
      text-color="#bfcbd9"
      active-text-color="#409eff"
      :collapse="isCollapse"
      :collapse-transition="false"
      unique-opened>

      <template v-for="(item, index) in navList">

        <el-submenu v-if="item.children"
          :key="index"
          :index="item.index">
          <template slot="title">
            <img v-if="item.icon"
              :src="item.icon"
              :class="$style.navIcon">
            <i v-else
              class="el-icon-menu"></i>
            <span>{{ item.title }}</span>
          </template>
          <el-menu-item v-for="(Item, index) in item.children"
            :key="index"
            :index="Item.index">
            {{ Item.title }}
          </el-menu-item>
        </el-submenu>

        <el-menu-item v-else
          :key="index"
          :index="item.index">

          <img v-if="item.icon"
            :src="item.icon"
            :class="$style.navIcon">
          <i v-else
            class="el-icon-menu"></i>
          <span slot="title">{{ item.title }}</span>
        </el-menu-item>

      </template>

    </el-menu>
  </div>
</template>

<script>
export default {
  computed: {
    isCollapse() {
      return this.$store.state.isNavShrink
    },

    active() {
      return this.$route.path
    },

    navList() {
      return this.$store.getters.navList
    }
  },

  methods: {
    select(index) {
      this.$router.push(index)
    }
  }
}
</script>

<style module lang="scss">
.navIcon {
  width: 15px;
  height: 15px;
  margin-right: 20px;
}

.logo {
  margin: 30px 26% 10px 27%;  
}
.img{
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }
</style>

