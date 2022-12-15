<template>
  <div class="XZQHComponent-pannel" v-show="this.$store.getters._getDefaultXZQHComponentVisible">
    <div class="XZQHComponent-header">
      <span>行政区划导航</span>
      <i class="el-icon-close" @click="closeXZQHPannel"></i>
    </div>
    <div class="XZQH-select-pannel">
      <span class="XZQH-select-laber">省份：</span>
      <!-- v-model：实现表单元素和数据的双向绑定 -->
      <!-- @change :选中值发生变化时触发的函数 -->
      <!-- size:输入框尺寸为最小的 -->
      <!-- placeholder 占位符，默认显示的文字 -->
      <el-select
        v-model="provinceValue"
        @change="handleProvinceValueChang"
        size="mini"
        clearable
        placeholder="请选择省份"
      >
        <!-- v-for的值为当前被选中的el-option的value属性值 -->
        <el-option
          v-for="item in provinceOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
    </div>
    <div class="XZQH-content-pannel">
      <tbody>
        <tr v-for="item in cityAndCountyOptions" :key="item.label">
          <td style="min-width: 50px">
            <span class="city-item" :value="item.value" @click="handleItemClick(item.value, 'city')">
              {{ item.label }}
            </span>
          </td>
          <td>
            <span
              class="county-item"
              v-for="item2 in item.children"
              :key="item2.attributes.Name"
              :value="item2.attributes.Code"
              @click="handleItemClick(item2.attributes.Code, 'county')"
              >{{ item2.attributes.Name }}</span
            >
          </td>
        </tr>
      </tbody>
    </div>
  </div>
</template>

<script>
// 引入需要使用到的ArcGIS API模块
import QueryTask from '@arcgis/core/tasks/QueryTask'
import Query from '@arcgis/core/tasks/support/Query'
import Graphic from '@arcgis/core/Graphic'
let graphic = ''
export default {
  name: 'XZQHComponent',
  data() {
    return {
      provinceOptions: [],
      provinceValue: '',
      cityAndCountyOptions: [],
    }
  },
  mounted: function () {
    this.getProvinceData()
  },
  methods: {
    // 获取行政区划中的省份数据
    getProvinceData() {
      const queryTask = new QueryTask({
        // 之前发布的省份的FeatureLayer服务的链接
        url: 'http://localhost:6080/arcgis/rest/services/test/MyMapService/FeatureServer/0',
      })
      let query = new Query()
      query.returnGeometry = true //返回几何信息
      query.outFields = ['*'] //返回所有属性
      query.where = '1=1' //SQL查询语句,范围所有查询到的值
      // promise then 链式调用
      queryTask.execute(query).then((results) => {
        console.log(results)
        let currentData = []
        if (results.features.length > 0) {
          results.features.map((item) => {
            currentData.push({
              value: item.attributes.Code,
              label: item.attributes.Name,
            })
          })
          this.provinceOptions = currentData
        } else {
          this.$message({
            message: '暂时没有省份数据',
            type: 'warning',
          })
        }
      })
    },
    closeXZQHPannel() {
      let XZQHComponentPannel = this.$store.getters._getDefaultXZQHComponentVisible
      this.$store.commit('_setDefaultXZQHComponentVisible', !XZQHComponentPannel)
    },
    handleProvinceValueChang(value) {
      console.log(value)
      this.getCityAndCountyData(value)
    },
    async getCityAndCountyData(value) {
      // 这里要写成异步函数
      const _self = self
      console.log(value)
      const provinceCode = value.toString().substring(0, 2)
      const queryTask = new QueryTask({
        url: 'http://localhost:6080/arcgis/rest/services/test/MyMapService/FeatureServer/2',
      })
      let query = new Query()
      query.returnGeometry = false
      query.outFields = ['*']
      // code like '13%'
      query.where = "Code like '" + provinceCode + "%' "
      console.log('SQL语句：' + "Code like'" + provinceCode + '%')
      let results = await queryTask.execute(query) //异步，返回一个Promise对象
      console.log('queryTask.execute(query):results' + results) //queryTask.execute(query):results[object Promise]
      let currentCityData = []
      console.log(results.features)
      if (results.features.length > 0) {
        results.features.map((item) => {
          currentCityData.push({
            value: item.attributes.Code,
            label: item.attributes.Name,
          })
        })
        // 循环遍历 results.features,拿到每个市对应的区县数据
        Promise.all(
          currentCityData.map(async (item2) => {
            const cityCode = item2.value.toString().substring(0, 4)
            const queryTask2 = new QueryTask({
              url: 'http://localhost:6080/arcgis/rest/services/test/MyMapService/FeatureServer/1',
            })
            let query2 = new Query()
            query2.returnGeometry = false
            query2.outFields = ['*']
            query2.where = "Code like'" + cityCode + "%'"

            const result2 = await queryTask2.execute(query2)
            item2.children = result2.features
            return item2
          })
        ).then((res) => {
          console.log(res)
          this.cityAndCountyOptions = res
        })
      } else {
        _self.$message({
          message: '暂时没有市级数据',
          type: 'warning',
        })
      }
    },

    //点击跳转并高亮
    async handleItemClick(val, type) {
      console.log('type')

      // type判断点击的是市还是区县
      let serverUrl = ''
      let code = ''
      const view = this.$store.getters._getDefaultMapView //通过vuex获得view
      console.log(type)
      if (type === 'city') {
        code = val.toString().substring(0, 4)
        console.log(code)
        serverUrl = 'http://localhost:6080/arcgis/rest/services/test/MyMapService/FeatureServer/2'
      } else if (type === 'county') {
        code = val.toString().substring(0, 6)
        serverUrl = 'http://localhost:6080/arcgis/rest/services/test/MyMapService/FeatureServer/1'
      }
      const queryTask = new QueryTask({
        url: serverUrl,
      })
      let query = new Query()
      query.returnGeometry = true
      query.outFields = ['*']
      query.where = "Code like'" + code + "%'"

      let results = await queryTask.execute(query)
      console.log(results)
      // 符号化查询到的结果，并定位至结果
      const featuresResult = results.features[0]
      console.log(featuresResult)
      if (graphic) {
        view.graphics.remove(graphic)
      }
      const fillSymbol = {
        type: 'simple-fill',
        color: [188, 240, 234, 0.1],
        outline: {
          color: '#00FFFF',
          width: 2,
        },
      }
      graphic = new Graphic({
        geometry: featuresResult.geometry,
        symbol: fillSymbol,
      })
      view.graphics.add(graphic)
      console.log(graphic.geometry.extent)
      console.log(view.extent)

      // view.goto里面的duration参数可以使得跳转更加丝滑。
      view.goTo(
        {
          center: [graphic.geometry.extent.center.longitude, graphic.geometry.extent.center.latitude],
          zoom: 11,
        },
        {
          duration: 1000,
        }
      )
    },
  },
}
</script>

<style>
.XZQHComponent-pannel {
  position: absolute;
  top: 90px;
  left: 80px;
  height: 500px;
  width: 300px;
  /* 给它一个背景色，方便查看 */
  background-color: antiquewhite;
}
.XZQHComponent-header {
  width: 100%;
  height: 35px;
  border-bottom: 1px solid #e4e7ed;
  padding: 0 5px;
  box-sizing: border-box;
  display: flex;
  /* 均匀排列每个元素，首个元素放置于起点，末尾元素放置于终点 */
  justify-content: space-between;
}
.XZQHComponent-header > span {
  line-height: 35px;
  font-size: 16px;
  font-weight: 600;
}
.XZQHComponent-header > i {
  line-height: 35px;
  /* 鼠标移动到按钮上面是为一只手 */
  cursor: pointer;
}

.XZQH-select-pannel {
  width: 100%;
  height: 30px;
  padding: 0 5px;
  box-sizing: border-box;
  margin: 5px 0;
}
.XZQH-select-label {
  font-size: 13px;
}
.XZQH-content-pannel {
  width: 100%;
  height: 425px;
  overflow: auto; /*  属性规定当内容溢出元素框时发生的事情,auto：如果内容被修剪，则浏览器会显示滚动条以便查看其余的内容 */
  padding: 0 5px;
  box-sizing: border-box; /*想要设置的边框和内边距的值包含再width内 */
}
.city-item {
  font-size: 12px;
  color: #5f6477;
  font-weight: 600;
  cursor: pointer; /* 鼠标的形状是一只手 */
}
.county-item {
  font-size: 12px;
  color: #999;
  margin: 0 10px 5px 0;
  cursor: pointer;
}
.county-item:hover {
  color: #409eff;
}
tr {
  display: block; /* 将tr设置为块元素 */
  margin-bottom: 15px; /* 设置tr间距为15px */
}
</style>
