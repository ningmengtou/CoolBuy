import regeneratorRuntime from '../../lib/runtime/runtime.js'
import { request } from '../../request/index.js'
// 页面被打开时 onShow 0先判断缓存中是否有token值 1获取到参数type 2根据type参数获取到订单数据并且改变标题被选中的样式 3渲染页面

// 点击不同的标题渲重新发送请求来渲染页面



Page({
    data: {
        tabs: [{
            id: 0,
            value: "全部",
            isActive: true
        }, {
            id: 1,
            value: "待付款",
            isActive: false
        }, {
            id: 2,
            value: "待发货",
            isActive: false
        }, {
            id: 3,
            value: "退款/退货",
            isActive: false
        }],
        // 订单列表
        orders: []
    },
    //options(Object)
    onLoad: function(options) {

    },

    onShow: function() {
        const token = wx.getStorageSync("token")
        if (!token) {
            wx.navigateTo({
                url: "/pages/auth/index"
            });
            return
        }
        // 获取到小程序的页面栈(数组) 最多只能有10个页面 
        // 数组中索引最大的页面就是当前页面 当前页面的options有curl参数
        let pages = getCurrentPages()
            // 获取到url对应的type参数
        const { type } = pages[pages.length - 1].options
            // type值比index多1 所以这里的参数是type-1
        this.changeTitleStyle(type - 1)
            // 调用请求函数来获取数据
        this.getOrderList(type)
    },
    // 监听到的子组件的标题点击事件
    handleItemChange(e) {
        // 获取到参数索引来改变标题样式
        const index = e.detail
        this.changeTitleStyle(index)
            // 并且根据type的不同来重新发送请求
        this.getOrderList(index + 1)
    },
    // 更改标题样式
    changeTitleStyle(index) {
        // 把tabs数组从data中解构出来
        const { tabs } = this.data
            // 循环遍历tabs
        tabs.forEach((v, i) => i == index ? v.isActive = true : v.isActive = false)
            // 把处理好的tabs数组重新赋值到tabs
        this.setData({
            tabs
        })
    },
    // 网络请求获取订单列表
    async getOrderList(type) {
        const { orders } = await request({ url: "/my/orders/all", data: { type } })
            // 把事件处理好的orders数组更新到data中
        this.setData({
            orders: orders.map(item => ({
                // 遍历元素结构每一个属性再添加create_time_cn属性 为我们需要的时间样式
                ...item,
                create_time_cn: (new Date(item.create_time * 1000).toLocaleString())
            }))
        })
    }
});