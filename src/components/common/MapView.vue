<template>
  <div class="mapview-pannel">
    <div id="mapview"></div>
    <div id="scale_Bar"></div>
  </div>
</template>

<script>
// 引入loadMondules
// import { loadModules } from 'esri-loader'
// const options = {
//   // 引入ArcGIS API
//   url: 'https://js.arcgis.com/4.18/init.js',
//   css: 'https://js.arcgis.com/4.18/esri/themes/light/main.css',
//   // url: 'https://js.arcgis.com/4.21/',
//   // css: 'https://js.arcgis.com/4.21/esri/themes/light/main.css',
// }

import Map from '@arcgis/core/Map'
import MapView from '@arcgis/core/views/MapView'
import Basemap from '@arcgis/core/Basemap'
import TileLayer from '@arcgis/core/layers/TileLayer' // 地图图层
import BasemapToggle from '@arcgis/core/widgets/BasemapToggle' //地图切换控件
import ScaleBar from '@arcgis/core/widgets/ScaleBar' //比例尺
export default {
  name: 'MapView',
  components: {},
  // mounted 生命周期函数，在Map View组件创建完成之后就会执行里面的函数
  mounted: function () {
    this._createMapView()
  },
  methods: {
    // 创建地图视图
    //async await是成对出现的，意思是把那些模块加载完成之后才可以执行后面的代码
    _createMapView() {
      //   const [Map, MapView, Basemap, TileLayer, BasemapToggle, ScaleBar] = await loadModules(
      //     [
      //       'esri/Map',
      //       'esri/views/MapView',
      //       'esri/Basemap',
      //       'esri/layers/TileLayer',
      //       'esri/widgets/BasemapToggle',
      //       'esri/widgets/ScaleBar',
      //     ],
      //     options
      //   )
      let basemap = new Basemap({
        baseLayers: [
          new TileLayer({
            // 捷泰底图
            url: 'http://map.geoq.cn/arcgis/rest/services/ChinaOnlineStreetPurplishBlue/MapServer',
            title: 'Basemap',
          }),
          // new TileLayer({
          //   //影像地图
          //   url: 'http://map.geoq.cn/arcgis/rest/services/ChinaOnlineStreetwarm/MapServer',
          //   title: 'Basemap2',
          // }),
        ],
        title: 'basemap',
        id: 'basemap',
      })
      const map = new Map({ basemap: basemap })
      const view = new MapView({
        container: 'mapview',
        center: [108, 32],
        map: map,
        zoom: 5,
      })
      // 实例化底图切换控件
      const basemapToggle = new BasemapToggle({
        view: view,
        nextBaxemap: 'hybrid',
      })
      view.ui.add(basemapToggle, {
        position: 'bottom-right',
      })

      // 实例化比例尺控件
      const scaleBar = new ScaleBar({
        view: view,
        container: 'scale_Bar',
        unit: 'metric', //更改单位为：千米
      })
      view.ui.add(scaleBar)

      // 将 MapView 中实例化的 view 传到 vuex 中去
      this.$store.commit('_setDefaultMapView', view)
      // console.log(this.$store.getters._getDefaultMapView)
      console.log(view)
    },
  },
}
</script>

<style>
.mapview-pannel,
#mapview {
  position: relative;
  width: 100%;
  height: 100%;
}
#scale_Bar {
  position: absolute;
  bottom: 15px;
  left: 15px;
}
</style>
