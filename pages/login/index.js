// pages/login/index.js
Page({
  // 登录按钮事件
  handleGetUserInfo(e) {
    // 根据事件源获取到userInfo并且存在缓存中
    const {userInfo} = e.detail
    wx.setStorageSync("userInfo", userInfo)
    wx.navigateBack({
      delta: 1
    })
  }
})