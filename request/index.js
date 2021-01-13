// 设置请求次数
let ajaxTime = 0;


// 封装promise方法来进行异步请求
export const request = (params) => {
    // 创建一个header变量 其中的值是参数中解构出来的header
    let header = { ...params.header }
    // 判断url中是否有 /my/路径 有就让header带上token
    if (params.url.includes("/my/")) {
        header["Authorization"] = wx.getStorageSync("token");
    }


    // 在发送请求之前就出现 加载中 效果
    wx.showLoading({
        title: "加载中",
        mask: true,
    });
    // 请求一次就让请求次数加一
    ajaxTime++


    // 定义公共的url
    const baseUrl = "https://api-hmugo-web.itheima.net/api/public/v1"
    return new Promise((resolve, reject) => {
        wx.request({
            // 展开参数
            ...params,
            // url参数由公共url和参数的url拼接
            url: baseUrl + params.url,
            header: header,
            success: (result) => {
                resolve(result.data.message)
            },
            fail: (err) => {
                reject(err)
            },
            complete: () => {
                // 请求结束就让请求次数减一
                ajaxTime--;
                // 当请求次数为0才关闭加载效果
                if (ajaxTime == 0) {
                    // complete方法是不管请求成功还是失败都会调用  关闭加载中效果
                    wx.hideLoading();
                }
            }
        })
    })
}