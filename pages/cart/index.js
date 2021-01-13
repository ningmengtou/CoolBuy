import { getSetting, chooseAddress, openSetting, showModal,showToast } from '../../utils/asyncWX.js'
import regeneratorRuntime from '../../lib/runtime/runtime.js'

// 获取用户的收货地址
// 1绑定点击事件  2获取用户对小程序授予获取地址的权限状态 scope  wx.getSetting()获取
// 假设用户点击获取收货地址提示 确定  scope为true  直接获取用户的收货地址
// 假设用户没有点击过获取收货地址提示   scope为undefined  直接获取用户的收货地址
// 假设用户点击获取收货地址提示 取消  scope为false  引导用户打开授权设置页面 当用户给予获取地址权限后再获取收货地址
// 4把获取到的收货地址存在缓存中

// 页面加载完毕onShow 0回到商品详情页面第一次添加手动添加属性 num=1 status=true  1获取本地缓存中的收货地址并且把数据存在data变量中 
// 全选按钮的实现onShow 1onShow获取到缓存中的cart数组根据商品是否都是被选中来改变状态

// 总价和总数量的计算(都需要商品被选中才可以计算)

// 商品单选功能 1绑定change事件并且获取到商品对象让status取反 2重新填充到data和缓存中 3重新计算总价和总数

// 全选和返回功能 1绑带change事件给全选按钮 2获取到data中的allchecked并且取反 3遍历购物车数组中的商品让状态跟随allchecked
// 4把购物车数组和allchecked重新设置到data中  把购物车数据重新设置到缓存中

// 商品数量的编辑功能 1在+和-上绑定一个事件根据自定义属性来区分(还有商品id) 2获取到data中的cart根据id进行数量的更改 
// 3当商品数量等于1用户再点减一时弹出信息问用户是否要删除商品   4把数据更改回data和缓存中

// 结算功能 1判断是否有收货地址和选购商品 2经过以上验证跳转到支付页面

// pages/cart/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 收货地址数据
    address: {},
    // 购物车数据
    cart: [],
    // 全选按钮的状态
    allChecked: false,
    totalPrice: 0,
    totalNum: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  onShow() {
    // 获取缓存中的收货地址
    const address = wx.getStorageSync("address")
    // 获取缓存中购物车的数据
    const cart = wx.getStorageSync("cart") || []
    // 更新data中address的值
    this.setData({
      address
    })
    // 调用setCart方法
    this.setCart(cart)
  },
  // 收货地址按钮点击事件
  async handleChooseAddress() {

    // // wx.getSetting() 获取权限状态
    // wx.getSetting({
    //   success: (result) => {
    //     // 查看权限状态 获取到scope.address的值
    //     const scopeAddress = result.authSetting["scope.address"]
    //     // 如果权限状态为 true 或者 undefined 则直接获取收货地址
    //     if (scopeAddress === true || scopeAddress === undefined) {
    //       wx.chooseAddress({
    //         success: (result1) => {
    //           console.log(result1);
    //         }
    //       });
    //     } else {
    //       // 用户没有授权过收货地址获取拒绝过 要引导用户打开授权页面
    //       // wx.openSetting() 用户打开授权页面
    //       wx.openSetting({
    //         success: (result2) => {
    //           // 用户授权成功再次获取收货地址
    //           wx.chooseAddress({
    //             success: (result3) => {
    //               console.log(result3);
    //             }
    //           });
    //         }
    //       });
    //     }
    //   }
    // });

    try {
      // 利用封装好的peomise形式的微信api来实现
      // 1.获取权限状态
      const res1 = await getSetting()
      const scopeAddress = res1.authSetting["scope.address"]
      // 2.判断权限状态
      if (scopeAddress === false) {
        // 引导用户打开授权页面
        await openSetting()
      }
      // 再获取收货地址
      const address = await chooseAddress()
      // 把获取到的收货地址存在缓存中
      wx.setStorageSync("address", address);
    } catch (error) {
      console.log(error);
    }

  },
  // 商品单选事件
  handleItemChange(e) {
    // 获取到被更改状态的商品id 根据id找到需要修改的商品索引 再更改商品的状态
    const { id } = e.currentTarget.dataset
    let { cart } = this.data
    let index = cart.findIndex(item => item.goods_id === id)
    cart[index].status = !cart[index].status
    // 最后调用setCart方法
    this.setCart(cart)
  },
  // 商品全选事件
  handleAllChange() {
    // 获取allChecked和cart值
    let { cart, allChecked } = this.data
    // 把allChecked取反 并且遍历cart数组让每项的status值等于allChecked
    allChecked = !allChecked
    cart.forEach(item => item.status = allChecked)
    // 再调用setCart方法把最新的值设置到data和缓存中
    this.setCart(cart)
  },
  // 设置商品状态并且计算总价和总和 更新data和缓存中的值
  setCart(cart) {
    // 申明总价和总数量还有全选的变量 totalPrice totalNum allChecked
    let allChecked = true
    let totalPrice = 0
    let totalNum = 0
    // 再遍历被选中的商品求出总价和总数量值再赋值给到data中
    cart.forEach(item => {
      if (item.status) {
        totalPrice += item.goods_price * item.num
        totalNum += item.num
      } else {
        // 有遍历项没有被选中就让allChecked为false
        allChecked = false
      }
    })
    // 判断数组的长度是否是空数组 是就返回false 不是就返回它本身
    allChecked = cart.length != 0 ? allChecked : false
    this.setData({
      cart,
      allChecked,
      totalPrice,
      totalNum
    })
    // 再把最新的cart添加到缓存中
    wx.setStorageSync("cart", cart);
  },
  // 商品数量更改事件
  async numberChange(e) {
    // 根据事件源获取到被点击商品的id和更改操作(加一还是减一)
    const { info, id } = e.currentTarget.dataset
    // 获取购物车数组并且找到要修改的商品索引
    let { cart } = this.data
    let index = cart.findIndex(item => item.goods_id === id)
    // 判断当商品数量为1并且用户点击减一时弹出微信提示
    if (cart[index].num === 1 && info == "-1") {
      // 使用封装好的showModal方法来调用微信模态框
      const res = await showModal({ content: "你确定要删除该商品吗？" })
      if (res.confirm) {
        // 点击了确定就删除该商品并且更新值到data
        cart.splice(index, 1)
        this.setCart(cart)
      }
    } else {
      cart[index].num += parseInt(info)
      this.setCart(cart)
    }
  },
  // 结算商品事件
  async handlePay() {
    // 获取data中的收货地址和商品总数
    let {totalNum,address} = this.data
    // 判断用户是否有设置收货地址和选购商品
    if (!address.userName) {
      await showToast({title:'你还没有选择收货地址'})
      return
    }
    if (totalNum === 0) {
      await showToast({title:"你还没有选购商品"})
      return
    }
    // 跳转到支付页面
    wx.navigateTo({
      url: '/pages/pay/index'
    })
  }
})