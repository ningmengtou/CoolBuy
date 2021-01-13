// pages/user/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        userInfo: {},
        // 收藏商品的数量
        collectNum: 0
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
        // 获取到缓存中collect数组并且把数组长度更新到collectNum
        const collect = wx.getStorageSync("collect") || []
        let collectNum = collect.length
        const userInfo = wx.getStorageSync("userInfo");
        this.setData({
            userInfo,
            collectNum
        })
    },

})