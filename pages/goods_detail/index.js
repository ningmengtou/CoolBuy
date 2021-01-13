import { request } from '../../request/index.js'
import regeneratorRuntime from '../../lib/runtime/runtime.js'
import { showToast } from "../../utils/asyncWX.js"

// 点击轮播图预览大图
// 1.给轮播图绑定点击事件 2调用 wx.previewImage()预览图片

// 点击加入购物车
// 1.点击绑定事件 2.获取缓存中的购物车数据 3判断当前商品是否在购物车中 4存在就修改商品数量加一并且重新把购物车数据填充回缓存中
// 5不存在就直接给购物车数数据添加新元素带上数量属性 并且把数据重新填充到缓存中 6弹出对应的提示

// 页面加载onshow时 加载缓存中的商品收藏数据 1判断当前商品是否被收藏  是则改变图标 
// 2点击商品收藏按钮判断商品是否在缓存中 在就商品删除 不在就把商品添加到收藏数组中并且存入缓存中



// pages/goods_detail/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        goodsDetail: {},
        // 当前商品是否被收藏
        isCollect: false
    },
    // 当前商品详情数据
    GoodsInfo: [],

    /**
     * 生命周期函数--监听页面加载
     */
    onShow: function(options) {
        // 通过页面栈获取到url的参数
        let pages = getCurrentPages()
        const { goods_id } = pages[pages.length - 1].options
        this.getGoodsDetail(goods_id)
    },
    // 获取商品详情数据
    async getGoodsDetail(goods_id) {
        // 这里的参数必须是对象形式 
        const res = await request({ url: "/goods/detail", data: { goods_id } })
        this.GoodsInfo = res
            // 获取缓存中的商品收藏数组
        let collect = wx.getStorageSync("collect") || []
            // 通过some方法遍历缓存中的collect查看当前商品是否在收藏数组中
        let isCollect = collect.some(item => item.goods_id === this.GoodsInfo.goods_id)
        this.setData({
            // 这里不直接赋值而是把需要渲染页面的数据赋值到goodsDetail中
            goodsDetail: {
                pics: res.pics,
                goods_price: res.goods_price,
                goods_name: res.goods_name,
                goods_introduce: res.goods_introduce
            },
            isCollect
        })
    },
    // 轮播图点击事件 放大预览图片
    handlePreviewImage(e) {
        // 获取当前被点击图片的http地址
        const { http } = e.currentTarget.dataset
            // 获取所有要预览的图片数组
        const arry = this.GoodsInfo.pics.map(item => item.pics_mid)
        console.log(this.GoodsInfo);
        // wx.previewImage() 图片预览api
        wx.previewImage({
            current: http, // 当前显示图片的http链接
            urls: arry // 需要预览的图片http链接列表
        })
    },
    // 点击加入购物车事件
    handleCartAdd() {
        // 获取本地缓存中的购物车数据 有则获取 没有则返回空数组
        let cart = wx.getStorageSync("cart") || []
            // findIndex() 在数组中查找 根据goods_id查看购物车缓存中是否有数据
        const index = cart.findIndex(item => item.goods_id === this.GoodsInfo.goods_id)
        if (index === -1) {
            // 商品不存在购物车中 先让商品详情数据中添加num属性为1 再把最新的数据添加到本地缓存cart中
            this.GoodsInfo.num = 1
                // 添加商品是否被选中
            this.GoodsInfo.status = true
            cart.push(this.GoodsInfo)
        } else {
            // 商品存在购物车中 让该商品的数量加一
            cart[index].num++
        }
        // 把最新的数据添加到缓存中
        wx.setStorageSync("cart", cart);
        wx.showToast({
            title: '添加成功',
            icon: 'success',
            // mask为true可以让屏幕停止其他操作
            mask: true
        })
    },
    // 商品收藏点击时间
    collectTap() {
        // 获取到缓存中的collect数组和是否收藏isCollect
        let collect = wx.getStorageSync("collect") || [];
        // 根据isCollect来判断当前商品是否被收藏
        let { isCollect } = this.data
        if (isCollect === false) {
            // 当前商品没有被收藏就让缓存中的collect数组添加当前商品并且把最新的collect添加到缓存中
            collect.push(this.GoodsInfo)
            wx.showToast({
                title: '收藏成功',
                icon: 'success',
                duration: 1000,
                mask: true
            });
        } else {
            // 当前商品被收藏过就从collect数组中删除
            const index = collect.findIndex(item => item.goods_id === this.GoodsInfo.goods_id)
            collect.splice(index, 1)
            wx.showToast({
                title: '取消收藏',
                icon: 'none',
                duration: 1000,
                mask: true
            });
        }
        // 重新设置data中的isCollect值并且更新缓存中的collect
        wx.setStorageSync("collect", collect)
        this.setData({
            isCollect: !isCollect
        })
    }
})