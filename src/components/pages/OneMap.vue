<template>
  <div class="onemap-page">
    <MapView />
    <MapTools />
    <MapTree />
    <XZQHComponent />
  </div>
</template>

<script>
import MapView from './../common/MapView.vue'
import MapTools from './../MapTools.vue'
import MapTree from './../MapTree.vue'
import XZQHComponent from './../XZQHComponent.vue'
export default {
  name: 'OneMap',
  components: {
    MapView,
    MapTools,
    MapTree,
    XZQHComponent,
  },
}
</script>

<style>
.onemap-page {
  height: 100%;
  width: 100%;
  background-color: cadetblue;
}
</style>
