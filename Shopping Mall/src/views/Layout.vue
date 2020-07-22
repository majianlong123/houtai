<template>
  <div>

    <div :class="navStyle">
      <TheNav></TheNav>
    </div>

    <div :class="bodyStyle">
      <div :class="$style.topBar">
        <TheTopbar></TheTopbar>
      </div>

      <div :class="$style.view">
        <keep-alive :include="cachedViews">
          <router-view></router-view>
        </keep-alive>
      </div>
    </div>

  </div>
</template>

<script>
import TheNav from '@/components/TheNav'
import TheTopbar from '@/components/TheTopbar'

export default {
  components: {
    TheNav,
    TheTopbar
  },

  computed: {
    isNavShrink() {
      return this.$store.state.isNavShrink
    },

    navStyle() {
      return {
        [this.$style.nav]: true,
        [this.$style.navShrink]: this.isNavShrink
      }
    },

    bodyStyle() {
      return {
        [this.$style.body]: true,
        [this.$style.bodyExpand]: this.isNavShrink
      }
    },

    cachedViews() {
      return this.$store.state.tagsView.cachedViews
    }
  }
}
</script>

<style lang="scss" module>
$navWidth: 200px;
$navShrinkWidth: 64px;
$barHeight: 60px;
$tagHeight: 35px;
$topHeight: $barHeight + $tagHeight;

.nav {
  position: fixed;
  left: 0;
  top: 0;
  height: 100%;
  width: $navWidth;
  background: #304156;
  transition: all 0.3s;
  overflow-x: hidden;
  z-index: 10;
}

.body {
  padding-left: $navWidth;
  transition: all 0.3s;
  position: relative;
}

.view {
  padding: 15px 15px 30px 15px;
  background: #f0f2f5;
  min-height: calc(100vh - #{$topHeight});
}

.topBar {
  position: sticky;
  top: 0;
  background: white;
  z-index: 10;
}

.navShrink {
  width: $navShrinkWidth !important;
}

.bodyExpand {
  padding-left: $navShrinkWidth !important;
}
</style>
