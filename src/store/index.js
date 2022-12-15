import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
  _defaultMapView: '', //默认地图view
  _defaultMapTreeVisible: '', //控制maptree控件的显隐
  _defaultXZQHComponentVisible: '', //控制行政区划导航控件的显隐
}

const getters = {
  _getDefaultMapView() {
    return state._defaultMapView
  },
  _getDefaultMapTreeVisible() {
    return state._defaultMapTreeVisible
  },
  _getDefaultXZQHComponentVisible() {
    //控件行政区划导航控件的显隐
    return state._defaultXZQHComponentVisible
  },
}

const mutations = {
  _setDefaultMapView(state, value) {
    state._defaultMapView = value
  },
  _setDefaultMapTreeVisible(state, value) {
    state._defaultMapTreeVisible = value
  },
  _setDefaultXZQHComponentVisible(state, value) {
    // 控件行政区划导航控件的
    state._defaultXZQHComponentVisible = value
  },
}

const store = new Vuex.Store({
  state,
  getters,
  mutations,
})

export default store
