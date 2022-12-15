<template>
  <!-- v-show: 用于控制目录树控件的显示和隐藏 -->
  <div class="maptree-pannel" v-show="this.$store.getters._getDefaultMapTreeVisible">
    <el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
  </div>
</template>

<script>
// 引入loadMondules
// import { loadModules } from 'esri-loader'
// const options = {
//   // 引入ArcGIS API
//   url: 'https://js.arcgis.com/4.18/init.js',
//   css: 'https://js.arcgis.com/4.18/esri/themes/light/main.css',
// }
import TileLayer from '@arcgis/core/layers/TileLayer'
import FeatureLayer from '@arcgis/core/layers/FeatureLayer'
export default {
  name: 'MapTree',
  data() {
    return {
      data: [
        {
          label: '捷泰天域服务',
          children: [
            {
              label: '英文底图',
              children: [
                {
                  label: '彩色英文底图',
                  layerid: 'layerid',
                  layerurl: 'http://map.geoq.cn/arcgis/rest/services/ChinaOnlineCommunityENG/MapServer',
                },
              ],
            },
            {
              label: '中文底图',
              children: [
                {
                  label: '暖色中文底图',
                  layerid: 'layerid',
                  layerurl: 'http://map.geoq.cn/arcgis/rest/services/ChinaOnlineStreetWarm/MapServer',
                },
              ],
            },
          ],
        },
        {
          label: '一级 2',
          children: [
            {
              label: '二级 2-1',
              children: [
                {
                  label: '三级 2-1-1',
                },
              ],
            },
          ],
        },
      ],
      defaultProps: {
        children: 'children',
        label: 'label',
      },
    }
  },
  methods: {
    async handleNodeClick(data) {
      if (data.layerurl) {
        // 删除已添加的图层
        const view = this.$store.getters._getDefaultMapView
        const resultLayer = view.map.findLayerById('layerid')
        // 如果结果图层已经添加,那就移除它,保证地图上只有一个目录树的图层
        if (resultLayer) view.map.remove(resultLayer)
        // 处理不同服务类型
        // const [TileLayer, FeatureLayer] = await loadModules(
        //   ['esri/layers/TileLayer', 'esri/layers/FeatureLayer'],
        //   options
        // )
        // 解析layerurl,拿到服务的类型,比如MapServer或者FeatureServer
        const c = data.layerurl.split('/')
        const serverType = c[c.length - 1]
        let layer = ''
        switch (serverType) {
          case 'MapServer':
            layer = new TileLayer({ url: data.layerurl, id: data.layerid })
            break
          case 'FeatureServer':
            layer = new FeatureLayer({ url: data.layerurl, id: data.layerid })
            break
          default:
            break
        }
        view.map.add(layer)
      }
    },
  },
}
</script>

<style>
.maptree-pannel {
  position: absolute;
  top: 90px;
  left: 80px;
  width: 200px;
  height: 300px;
  /* background-color: antiquewhite; */
}
</style>
