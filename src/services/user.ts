import request from '@/utils/request'
import qs from 'qs'

interface User {
  phone: string,
  password: string
}

export const login = (data: User) => {
  return request({
    method: 'POST',
    url: '/front/user/login',
    data: qs.stringify(data) // axios 默认发送的是 application/json 格式的数据
    // qs.stringify 转换的数据 (key=value&key=value) 这种类型的数据axios会自动转换成 'Content-Type': 'application/x-www-form-urlencoded'
    // 如果 data 是 FormData 对象 则 'Content-Type': 'multipart/form-data'
  })
}

export const getUserInfo = () => {
  return request({
    method: 'GET',
    url: '/front/user/getInfo'
  })
}
