// 引入 request 模块方法来调用异步请求
import { request } from '../../request/index.js'
import regeneratorRuntime from '../../lib/runtime/runtime.js'
//Page Object
Page({
    data: {
        // 轮播图数组
        swiperList: [],
        // 分类导航数组
        catitemsList: [],
        // 楼层数据
        floordataList: []
    },
    // 页面开始加载触发事件
    onLoad() {
        // wx.request({
        //     url: "https://api-hmugo-web.itheima.net/api/public/v1/home/swiperdata",
        //     success: res => {
        //         console.log(res.data);
        //         
        //     }
        // })
        // 请求轮播图数据

        // request({ url: "https://api-hmugo-web.itheima.net/api/public/v1/home/catitems" })
        //     .then((result) => {
        //         console.log(result);
        //         this.setData({
        //             catitemsList: result.data.message
        //         })
        //     })
        // 执行获取数据函数
        this.getswiperList()
        this.getcatitemsList()
        this.getfloordataList()


    },
    // 获取轮播图数据函数
    async getswiperList() {
        const res = await request({ url: "/home/swiperdata" })
        res.forEach(item => {
            item.navigator_url = item.navigator_url.replace("main", "index")

        })
        this.setData({
            swiperList: res
        })
    },
    // 获取分类图数据
    async getcatitemsList() {
        const res = await request({ url: "/home/catitems" })
        this.setData({
            catitemsList: res
        })
    },
    // 获取楼层数据
    async getfloordataList() {
        const res = await request({ url: "/home/floordata" })
        res.forEach(item => {
            item.product_list.forEach(v => {
                const arr = v.navigator_url.split("?")
                arr[0] = arr[0] + "/index?"
                v.navigator_url = arr.join("")
            })
        })
        this.setData({
            floordataList: res
        })
    }
});