class RouteState {
  constructor () {
    // 记录当前路由
    this.current = ''
  }
}
class VueRouter {
  constructor ({mode = 'hash', routes = []}) {
    this.mode = mode
    this.routes = routes
    this.routeState = new RouteState()
    this.routesMap = this.createRoutesMap()
    this.init()
  }

  init () {
    function setCurrent () {
      if (this.mode === 'hash') {
        if (!window.location.hash) {
          window.location.hash = '/'
        }
        this.routeState.current = window.location.hash.slice(1)
      } else {
        this.routeState.current = window.location.pathname
      }
    }

    // 监听路由改变，hash模式用hashchange事件，history模式用popstate事件
    window.addEventListener('load', setCurrent.bind(this))
    window.addEventListener(this.mode === 'hash' ? 'hashchange' : 'popstate', setCurrent.bind(this))
  }

  // 将路由数组转换成{path: componet}格式
  createRoutesMap () {
    return this.routes.reduce((pre, current) => {
      pre[current.path] = current.component
      return pre
    }, {})
  }
}

// Vue.use() 就是执行install方法
VueRouter.install = function (Vue) {
  Vue.mixin({
    beforeCreate () {
      // console.log(this) // this指的是当前组件
      // this.$options 是new Vue时传入的参数
      if (this.$options && this.$options.router) {
        this._root = this
        // router实例挂载到全局
        this._router = this.$options.router
        // Define a reactive property on an Object.
        console.log('current' in this._router.routeState)
        Vue.util.defineReactive(this._router.routeState, 'current')
      } else {
        // 子组件中的router从父组件中找
        this._root = this.$parent._root
      }
    }
  })
  Vue.component('router-view', {
    render (h) {
      console.log('router-view rander')
      // console.log(this._root, this._root._router)
      let component = this._root._router.routesMap[this._root._router.routeState['current']]
      return h(component)
    }
  })
}

export default VueRouter
