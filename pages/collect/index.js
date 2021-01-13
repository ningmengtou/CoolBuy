// pages/collect/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        tabs: [{
            id: 0,
            value: "收藏收藏",
            isActive: true
        }, {
            id: 1,
            value: "品牌收藏",
            isActive: false
        }, {
            id: 2,
            value: "店铺收藏",
            isActive: false
        }, {
            id: 3,
            value: "浏览足迹",
            isActive: false
        }],
        collect: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {

    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
        const collect = wx.getStorageSync("collect") || [];
        this.setData({
            collect
        })
    },
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

})