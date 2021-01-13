// components/Tabs/Tabs.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        tabs: {
            type: Array,
            value: []
        }
    },

    /**
     * 组件的初始数据
     */
    data: {

    },

    /**
     * 组件的方法列表
     */
    methods: {
        // 触发点击事件
        handleTap(e) {
            // 获取被点击元素索引并且自定义事件
            const { index } = e.currentTarget.dataset
            this.triggerEvent("changeActive", index)
        }
    }
})