import regeneratorRuntime from '../../lib/runtime/runtime.js'
import { request } from '../../request/index.js'

// 输入框绑定值改变事件 input事件 1获取输入框的值 2合法性判断 3检验通过把输入框的值发送到后台并且打印在页面上

// 发抖函数(定时器) 一般用于输入框重复输入 重复发送请求
// 节流 一般用于页面下拉和上拉

// pages/search/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        goods: [],
        // 取消按钮显示隐藏
        isBtnShow: false,
        // 输入框的值 
        inputValue: ""
    },
    // 自定义定时器
    TimeId: -1,
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {

    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {

    },
    // 输入框的值改变就触发的事件
    changeInput(e) {
        // 获取到输入框最新的值
        let { value } = e.detail
        if (!value.trim()) {
            this.setData({
                goods: [],
                isBtnShow: false
            })
            return
        }
        this.setData({
                isBtnShow: true
            })
            // 拿到合格的搜索字段先清除定时器
        clearTimeout(this.TimeId)
            // 隔一秒后再发送请求
        this.TimeId = setTimeout(() => {
            this.querySearch(value)
        }, 1000)
    },
    // 发起输入框请求
    async querySearch(query) {
        const res = await request({ url: "/goods/qsearch", data: { query } })
        this.setData({
            goods: res
        })
    },
    // 按钮点击事件
    handleBtn() {
        // 让数组为空 input绑定的值为空 隐藏取消按钮
        this.setData({
            goods: [],
            inputValue: "",
            isBtnShow: false
        })
    }
})