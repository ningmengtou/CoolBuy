import { request } from '../../request/index.js'
import regeneratorRuntime from '../../lib/runtime/runtime.js'
// pages/category/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        // 左侧的菜单数据
        leftMenuList: [],
        // 右侧的商品数据
        rightContent: [],
        // 左侧标题被激活的类
        current: 0,
        // 右侧商品分类的头部距离
        scrollTop: 0,

    },
    // 分类商品的总体数据
    Cates: [],

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        // 因为该页面请求的数据太大所以要增加缓存效果
        // 判断本地存储中是否有旧数据,有旧数据并且没有过期就使用旧数据

        // 获取本地存储数据
        const Cates = wx.getStorageSync("cates");
        // 判断数据是否存在
        if (!Cates) {
            // 数据不在就发送请求
            this.getCategoriesList()
        } else {
            // 有数据再判断是否过期 
            if (Date.now() - Cates.time > 10000) {
                // 时间超过10s就重新发送请求
                this.getCategoriesList()
            } else {
                // 没有过期就可以使用旧数据 把本地的值复制到this.Cates
                this.Cates = Cates.data
                    // 构造左侧菜单的数据
                let leftMenuList = this.Cates.map(item => item.cat_name)
                    // 构造右侧商品的数据
                let rightContent = this.Cates[0].children
                this.setData({
                    leftMenuList,
                    rightContent
                })
            }
        }
    },
    // 获取分类信息数据
    async getCategoriesList() {
        const res = await request({ url: "/categories" })
            // 把获取到的全部数据保存到Cates数组中
        this.Cates = res
            // 把数据保存到本地中
        wx.setStorageSync("cates", { time: Date.now(), data: this.Cates });
        // 构造左侧菜单的数据
        let leftMenuList = this.Cates.map(item => item.cat_name)
            // 构造右侧商品的数据
        let rightContent = this.Cates[0].children
        this.setData({
            leftMenuList,
            rightContent
        })
    },
    // 左侧菜单的点击事件
    handleItemTap(e) {
        // 获取到被点击的索引
        const { index } = e.currentTarget.dataset
            // 根据索引的新值来获取数据
        let rightContent = this.Cates[index].children
            // 通过this.setData() 来更改被点击的样式和被点击的数据
        this.setData({
            current: index,
            rightContent,
            scrollTop: 0
        })
    }
})