import { showToast, requestPayment } from '../../utils/asyncWX.js'
import regeneratorRuntime from '../../lib/runtime/runtime.js'
import { request } from '../../request/index.js'

// 页面加载的时候 1.从缓存中获取到商品状态为true的商品数据 2再把最新值更新到data中来渲染页面

// 支付功能 1必须是企业appID 本功能无法实现

// 支付按钮功能 1先判断缓存中是否有token 2没有就跳转到授权页面获取token 3有token就创建订单 4完成微信支付后删除被选中的商品再填充到缓存中

Page({

    /**
     * 页面的初始数据
     */
    data: {
        // 收货地址
        address: {},
        // 购物车数据
        cart: [],
        // 商品总价
        totalPrice: 0,
        // 商品总数
        totalNum: 0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {

    },
    onShow() {
        // 获取缓存中的收货地址
        const address = wx.getStorageSync("address")
            // 获取缓存中购物车的数据
        let cart = wx.getStorageSync("cart") || []
            // 使用filter方法把选中的商品过滤出来给到新数组cart
        cart = cart.filter(item => item.status === true)
            // 申明总价和总数量还有全选的变量 totalPrice totalNum 
        let totalPrice = 0
        let totalNum = 0
            // 再遍历被选中的商品求出总价和总数量值再赋值给到data中
        cart.forEach(item => {
                totalPrice += item.goods_price * item.num
                totalNum += item.num
            })
            // 把最新的值更新到data中
        this.setData({
            cart,
            totalPrice,
            totalNum,
            address
        })
    },
    // 支付按钮事件
    async handleOrderPay() {
        try {
            // 从缓存中获取token
            const token = wx.getStorageSync("token");
            // 如果token不存在就跳转到授权页面获取token
            if (!token) {
                wx.navigateTo({
                    url: "/pages/auth/index"
                })
                return
            }
            // 如果有token开始准备请求参数
            // 设置好请求头参数
            // const header = { Authorization: token }
            // 设置好收获地址
            const { provinceName, cityName, countyName, detailInfo } = this.data.address
            const consignee_addr = `${provinceName}${cityName}${countyName}${detailInfo}`
                // 设置好商品总价
            const order_price = this.data.totalPrice
                // 设置好商品字段
            const { cart } = this.data
            let goods = []
                // 遍历cart数组(数组是被过滤过都是被选中的商品) 把商品字段以对象的形式push到goods数组中
            cart.forEach(item => {
                    goods.push({
                        goods_id: item.goods_id,
                        goods_number: item.num,
                        goods_price: item.goods_price
                    })
                })
                // 把所有请求参数放在params对象中
            const params = { consignee_addr, order_price, goods }
                // 发送请求获取到订单编号
            const { order_number } = await request({ url: "/my/orders/create", data: params, method: "post" })
                // 发送请求获取支付参数 参数必须是对象对象对象对象对象对象！！！！！
            const { pay } = await request({ url: "/my/orders/req_unifiedorder", data: { order_number }, method: "post" })
            console.log(pay);
            // 发起微信支付 requestPayment 因为没有企业id 所有支付失败
            await requestPayment(pay)
                // 发送查询订单请求
            const res = await request({ url: "/my/orders/chkOrder", data: { order_number }, method: "post" })
                // 使用showToast方法调用微信弹窗提示
            await showToast({ title: "支付成功" })
                // 支付成功后在缓存中拿到cart数组进行过滤再存在缓存中
            let newCart = wx.getStorageSync("cart");
            newCart = newCart.filter(item => !item.status)
            wx.setStorageSync("cart", newCart);
            // 支付成功后跳转到订单页面
            wx.navigateTo({
                url: "/pages/order/index"
            })
        } catch (error) {
            await showToast({ title: "支付失败" })
            console.log(error)
        }
    }
})