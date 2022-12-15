<template>
  <div class="maptools-view">
    <span class="maptools-item" @click="handelMapToolsItemClick" id="xzqh">行政区划导航</span>
    <span class="maptools-item" @click="handelMapToolsItemClick" id="maptree">目录树管理</span>
    <span class="maptools-item" @click="handelMapToolsItemClick">距离测量</span>
    <span class="maptools-item" @click="handelMapToolsItemClick">面积测量</span>
    <span class="maptools-item" @click="handelMapToolsItemClick" id="clear">清屏</span>
  </div>
</template>

<script>
export default {
  name: 'MapTools',
  methods: {
    handelMapToolsItemClick(e) {
      console.log(e.target.id)
      switch (e.target.id) {
        case 'xzqh':
          // 如果“行政区划导航”按钮被点击，就执行openXZQHComponentPannel函数，来切换组件的显示和隐藏状态
          this.openXZQHComponentPannel()
          break
        case 'maptree':
          this.openMapTreePannel()
          break
        case 'clear':
          break
        default:
          break
      }
    },
    // 目录树的显示/隐藏
    openMapTreePannel() {
      let mapTreePannelVisible = this.$store.getters._getDefaultMapTreeVisible
      console.log(mapTreePannelVisible)
      this.$store.commit('_setDefaultMapTreeVisible', !mapTreePannelVisible)
      console.log(this.$store.getters._getDefaultMapTreeVisible)
    },
    openXZQHComponentPannel() {
      // 使用getters方法获取存在vuex中的行政区划导航组件的显示状态
      let XZQHComponentpannel = this.$store.getters._getDefaultXZQHComponentVisible
      // 对显示状态取反，然后使用commit方法将取反后的显示状态传递给vuex
      this.$store.commit('_setDefaultXZQHComponentVisible', !XZQHComponentpannel)
    },
  },
}
</script>

<style>
.maptools-view {
  position: absolute;
  padding: 0 15px;
  height: 30px;
  top: 20px;
  right: 15px;
  background-color: aliceblue;
}
.maptools-item {
  line-height: 30px;
  margin-left: 15px;
  color: black;
  cursor: pointer;
}
.maptools-item:first-child {
  margin-left: 0;
}
</style>
