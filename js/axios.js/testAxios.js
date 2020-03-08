const axios = require('./myAxios')

axios.interceptors.request.use(function(config) {
  console.log('请求成功拦截器')
  console.time('响应时间')
  return config
}, function() {
  console.log('请求失败拦截器')
})
axios.interceptors.response.use(function(res) {
  console.log('响应成功拦截器')
  console.timeEnd('响应时间')
  return res + ' success'
}, function() {
  console.log('响应失败拦截器')
})
axios.post('api/test',{
  data: {
    a: '1'
  }
}).then(res => {
  console.log(res)
}).catch(er => {
  console.log(err)
})

// 也可以直接用axios请求
axios({
  url: 'api/test',
  method: 'post',
  data: {
    a: '1'
  }
}).then(res => {
  console.log(res)
}).catch(er => {
  console.log(err)
})

/*
请求成功拦截器
发送请求 { data: { a: '1' }, url: 'api/test', method: 'post' }
-----------------------
响应成功拦截器
响应时间: 1006.439ms
响应结果 success
*/