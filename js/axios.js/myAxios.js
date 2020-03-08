// 绑定this函数
function bind(fn, thisArg) {
  return function wrap() {
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }
    return fn.apply(thisArg, args);
  };
};

// 扩展对象属性方法并绑定函数的this
function extend(a, b, thisArg) {
  Object.keys(b).forEach(function assignValue(key) {
    var val = b[key]
    if (thisArg && typeof val === 'function') {
      a[key] = bind(val, thisArg);
    } else {
      a[key] = val;
    }
  });
  
  return a;
}

// 拦截器类
function InterceptorManager () {
  this.handlers = []
}

InterceptorManager.prototype.use = function (fulfilled, rejected) {
  this.handlers.push({
    fulfilled: fulfilled,
    rejected: rejected
  })
}
// 遍历handlers
InterceptorManager.prototype.forEach = function (fn) {
  this.handlers.forEach(function (handler) {
    if (handler) {
      fn(handler)
    }
  })
}
// 模拟发送请求
function sendRequest (config) {
  console.log('发送请求', config)
  console.log('-----------------------')
  return new Promise(function(resolve, reject) {
    setTimeout(function () {
      resolve('响应结果')
    }, 1000);
  })
}
// Axios类
function Axios () {
  // 拦截器
  this.interceptors = {
    request: new InterceptorManager(),
    response: new InterceptorManager()
  }
}

Axios.prototype.request = function request (config) {
  // primise 队列，包括请求拦截器（成功，失败），发送请求，失败拦截器（成功，失败）
  var queue = [sendRequest, undefined]
  var promise = Promise.resolve(config)

  this.interceptors.request.forEach(function (interceptor) {
    // 请求拦截器放在队列最前边
    queue.unshift(interceptor.fulfilled, interceptor.rejected)
  })
  this.interceptors.response.forEach(function (interceptor) {
    // 相应拦截器放在队列最后边
    queue.push(interceptor.fulfilled, interceptor.rejected)
  })

  // 循环调用队列函数
  while(queue.length) {
    promise = promise.then(queue.shift(), queue.shift())
  }

  return promise
}
// 绑定具体请求方法
var methods = ['get', 'post', 'head', 'delete']
methods.forEach(function (method) {
  Axios.prototype[method] = function (url, config) {
    return this.request(Object.assign(config, {url: url, method: method}))
  }
});

// 工厂函数返回实例（一个绑定了axios实例属性和方法的函数）
function createInstance() {
  var context = new Axios()
  var instance = bind(Axios.prototype.request, context) // 返回一个可以用context执行request的函数

  extend(instance, Axios.prototype, context)
  extend(instance, context)

  // console.log(instance)
  /*
  [Function: wrap] {
    request: [Function: wrap],
    get: [Function: wrap],
    post: [Function: wrap],
    head: [Function: wrap],
    delete: [Function: wrap],
    interceptors: {
      request: InterceptorManager { handlers: [] },
      response: InterceptorManager { handlers: [] }
    }
  }
  */

  return instance
}

var axios = createInstance()
module.exports = axios
