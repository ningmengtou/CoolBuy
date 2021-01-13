// pages/goods_list/index.js
import regeneratorRuntime from '../../lib/runtime/runtime.js'
import { request } from '../../request/index.js'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        tabs: [{
            id: 0,
            value: "综合",
            isActive: true
        }, {
            id: 1,
            value: "销量",
            isActive: false
        }, {
            id: 2,
            value: "价格",
            isActive: false
        }],
        goodsList: [],

    },
    // 接口请求的参数
    QueryParams: {
        // 关键字
        query: '',
        // 分类id
        cid: '',
        // 页码
        pagenum: 1,
        // 页容量
        pagesize: 10
    },
    // 数据总页数 默认一页
    totalPage: 1,

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        // options 可以获取到页面参数信息 把页面参数cid赋值给到queryParams的cid
        this.QueryParams.cid = options.cid || ""
        this.QueryParams.query = options.query || ""
        this.getGoodsList()
    },
    // 请求数据事件
    async getGoodsList() {
        const res = await request({ url: "/goods/search", data: this.QueryParams })
            // 获取数据总数
        const total = res.total
            // 获取总页数 总页数=Math.ceil(总条数/页容量)
        this.totalPage = Math.ceil(total / this.QueryParams.pagesize)
            // 这里不直接对goodsList赋值，而是使用数据拼接
        this.setData({
            goodsList: [...this.data.goodsList, ...res.goods]
        })
    },
    // 监听到的子组件的标题点击事件
    handleItemChange(e) {
        // 获取到参数索引
        const index = e.detail
            // 把tabs数组从data中解构出来
        const { tabs } = this.data
            // 循环遍历tabs
        tabs.forEach((v, i) => i == index ? v.isActive = true : v.isActive = false)
            // 把处理好的tabs数组重新赋值到tabs
        this.setData({
            tabs
        })
    },
    // 页面上滑 滚动条触底事件
    onReachBottom() {
        // 判断还有没有下一页数据  当前页码值大于或者等于总页码则表示没有下一页了
        if (this.QueryParams.pagenum >= this.totalPage) {
            // 如果没有数据了弹出一个提示
            // wx.showToast() 可以出现提示框
            wx.showToast({
                title: '没有数据了',
            })
        } else {
            // 页面数加一 再请求数据
            this.QueryParams.pagenum++
                this.getGoodsList()
        }
    },
    // 用户下拉刷新页面 刷新数据
    onPullDownRefresh() {
        // 把页码值重置为1 把goodsList重置为空数组 再重新请求数据
        this.QueryParams.pagenum = 1
        this.setData({
            goodsList: []
        })
        this.getGoodsList()
            // 请求数据回到页面需要手动关闭等待效果  wx.stopPullDownRefresh()关闭刷新窗口
        wx.stopPullDownRefresh()
    }

})