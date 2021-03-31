import axios from 'axios'
import store from '@/store'
import router from '@/router'
import qs from 'qs'
import { Message } from 'element-ui'

const request = axios.create()

let isRefreshing = false
let requests: any[] = []

function redirectLogin () {
  router.push({
    name: 'login',
    query: {
      redirect: router.currentRoute.fullPath
    }
  })
}

function refreshToken () {
  return axios.create()({
    method: 'POST',
    url: '/front/user/refresh_token',
    data: qs.stringify({
      // refresh_token 只能使用1次
      refreshtoken: store.state.user.refresh_token
    })
  })
}

request.interceptors.request.use(function (config) {
  // 在发送请求之前做某事
  const { user } = store.state
  if (user && user.access_token) {
    config.headers.Authorization = user.access_token
  }
  return config
}, function (error) {
  // 请求错误时做些事
  return Promise.reject(error)
})

// Add a response interceptor
request.interceptors.response.use(function (response) {
  // 处理自定义状态码错误
  return response
}, function (error) {
  // 处理 http 状态码错误
  if (error.response) { // 请求收到响应 但是状态码超出 2xx
    const { status } = error.response
    if (status === 400) {
      Message.error('请求参数错误')
    } else if (status === 401) {
      console.log('401', error.config.url)
      if (!store.state.user) {
        redirectLogin()
        return Promise.reject(error)
      }

      if (!isRefreshing) {
        isRefreshing = true
        return refreshToken().then(res => {
          if (!res.data.success) {
            throw new Error('刷新 Token 失败')
          }
          // 将重新获取到的 用户信息(token) 注入store中
          store.commit('setUser', res.data.content)
          // 把 requests 队列中的请求重新发出去
          requests.forEach(cb => cb())
          // 重置 requests 数组
          requests = []
          // 将之前发送失败的请求重新发送
          return request(error.config)
        }).catch(err => {
          // refresh token 失败，将用户登出
          console.log(err)
          store.commit('setUser', null)
          redirectLogin()
          return Promise.reject(error)
        }).finally(() => {
          isRefreshing = false
        })
      }
      // 刷新状态下，把请求挂起放到 requests 数组中
      return new Promise(resolve => {
        requests.push(() => {
          resolve(request(error.config))
        })
      })
    } else if (status === 403) {
      Message.error('没有权限')
    } else if (status === 404) {
      Message.error('请求资源不存在')
    } else if (status >= 500) {
      Message.error('服务端错误')
    }
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
  } else if (error.request) { // 请求未收到响应
    Message.error('请求超时')
    console.log(error.request)
  } else { // 设置请求时发生错误
    Message.error('请求失败')
    console.log('Error', error.message)
  }
  return Promise.reject(error)
})

export default request
