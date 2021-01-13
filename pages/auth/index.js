// 引入 request 模块方法来调用异步请求
import { request } from '../../request/index.js'
import regeneratorRuntime from '../../lib/runtime/runtime.js'
import { login } from '../../utils/asyncWX.js'


// pages/order/index.js
Page({
    // 授权按钮接受授权事件
    async handleGetuserinfo(e) {
        try {
            // 从事件源中获取到请求需要的字段
            const { encryptedData, rawData, iv, signature } = e.detail
                // wx.login() 获取到code
            const { code } = await login()
                // 把参数都放在obj对象中
            const obj = { encryptedData, rawData, iv, signature, code }
                // 请求数据
            const res = await request({ url: "/users/wxlogin", data: obj, method: "post" })
                // 非企业账户获取不到token值  这里自己设定token值
            const token = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo"
                // 把token存在缓存中并且返回上一级页面
            wx.setStorageSync("token", token);
            // delta 1 表示返回上一级页面
            wx.navigateBack({
                delta: 1
            })
        } catch (error) {
            console.log(error);
        }


    }
})