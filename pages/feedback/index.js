// 加号按钮添加图片  1调用小程序选择图片api 2获取到图片路径数组并且存在data中 3页面根据图片数组循环显示自定义组件

// 点击图标删除对应图片 1获取被点击图标的id和获取data中的数组 2根据索引来删除对应的元素 3把数组重新赋值到data中

// 提交功能 1获取到文本域的内容并且验证 2把用户选择的图片上传到服务器中会返回外网的链接 
// 3文本域和外网的图片路径一同提交到服务器 4清空当前页面并且返回上个页面


// pages/feedback/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        tabs: [{
            id: 0,
            value: "体验问题",
            isActive: true
        }, {
            id: 1,
            value: "商品，商家投诉",
            isActive: false
        }],
        // 图片路径
        imagePath: [],
        // 文本域的输入值
        textareaValue: "",
    },
    // 外网的图片路径
    UploadImages: [],
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
    // 添加图片事件
    addImage() {
        // chooseImage()添加图片的api
        wx.chooseImage({
            // 图片的数量
            count: 9,
            // 图片的格式  原图  压缩
            sizeType: ['original', 'compressed'],
            // 图片的来源  相册  照相机
            sourceType: ['album', 'camera'],
            success: (result) => {
                // 获取到所有图片路径
                const { tempFilePaths } = result
                // 这里不能直接赋值操作数组拼接 这样第二次点击才会依次增加图片
                this.setData({
                    imagePath: [...this.data.imagePath, ...tempFilePaths]
                })
            }
        });
    },
    // 删除图片事件
    removeTmg(e) {
        // 获取到被点击图片的索引和图片路径
        const { index } = e.currentTarget.dataset
        const { imagePath } = this.data
            // 通过splice删除对应索引的图片再重新赋值到data中
        imagePath.splice(index, 1)
        this.setData({
            imagePath
        })
    },
    // 文本域输入的值改变事件
    textareaChange(e) {
        // 获取到文本域最新的值并且更新到data中
        const { value } = e.detail
        this.setData({
            textareaValue: value
        })
    },
    // 点击提交事件
    sbmitTap() {
        // 点击提交时获取到文本域中的文本内容和图片路径
        const { textareaValue, imagePath } = this.data
            // 如果文本域内容为空就提示用户输入内容
        if (!textareaValue.trim()) {
            wx.showToast({
                title: '请输入问题内容',
                icon: 'none',
                duration: 1000,
                mask: true,
            });
            v, i
            return
        }
        // 显示等待的图标
        wx.showLoading({
            title: "正在上传",
        });
        // 判断用户是否有图片需要上传
        if (imagePath.length != 0) {
            // 遍历图片数组依次上传 
            imagePath.forEach((v, i) => {
                // 上传图片到后台调用uploadFile方法 这个方法只能上传一张图片
                wx.uploadFile({
                    // 后台地址 https://images.ac.cn/Home/Index/UploadAction/
                    url: 'https://imgchr.com/i/MjaXxU',
                    // 被上传的文件路径
                    filePath: v,
                    // 被上传的文件名称 file
                    name: "file",
                    // 顺带的文本信息
                    formData: {},
                    success: (result) => {
                        // 获取图片路径并且添加到UploadImages中
                        const url = result.cookies[0]
                        this.UploadImages.push(url)
                            // 所有图片上传完了才触发这个判断
                        if (imagePath.length - 1 === i) {
                            // 显示关闭提示信息
                            wx.hideLoading();
                            console.log('把文本和图片都提交到后台中了');
                            // 把data中的数据重置
                            this.setData({
                                    imagePath: [],
                                    textareaValue: "",

                                })
                                // 返回到上一级页面
                            wx.navigateBack({
                                delta: 1
                            });
                        }
                    }
                });
            })
        } else {
            wx.hideLoading();
            console.log('只是提交了文本');
            wx.navigateBack({
                delta: 1
            });
        }


    }


})