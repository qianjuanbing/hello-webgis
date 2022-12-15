import Vue from 'vue'
import VueRouter from 'vue-router'
import DataVisual from './../src/components/pages/DataVisual.vue'
import OneMap from './../src/components/pages/OneMap.vue'

Vue.use(VueRouter)
const originalPush = VueRouter.prototype.push
// 修改 原型对象中的push方法
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err)
}

export default new VueRouter({
  routes: [
    {
      path: '/',
      component: DataVisual,
    },
    {
      path: '/onemap',
      component: OneMap,
    },
  ],
  mode: 'history',
})
