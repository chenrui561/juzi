// pages/user/user.js
var app = getApp()


Page( {
  data: {
    userInfo: {},
    orderInfo:{},
    count:'',
    goods_list: [],
    projectSource: 'https://github.com/liuxuanqiang/wechat-weapp-mall',
   
       loadingText: '加载中...',
       loadingHidden: false,
  },
  onLoad: function () {
    
      var that = this;
      var userid = app.d.userId;

      wx.request({//请求数据，获取我的优享清单
        url: app.d.ceshiUrl + '/Api/Index/my_goods_list',
        method: 'post',
        data: {
          id: userid
        },
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {

          that.setData({
            goods_list: res.data.goods_list,
            count: res.data.count,
          
          });
        },
        fail: function (e) {
         
        }
      })
      

    
  },
 
  // 弹窗
  setModalStatus: function (e) {
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })

    this.animation = animation
    animation.translateY(300).step();

    this.setData({
      animationData: animation.export()
    })

    if (e.currentTarget.dataset.status == 1) {

      this.setData(
        {
          showModalStatus: true
        }
      );
    }
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation
      })
      if (e.currentTarget.dataset.status == 0) {
        this.setData(
          {
            showModalStatus: false
          }
        );
      }
    }.bind(this), 200)
  },

 
  // 提交创建清单
  formSubmit: function (e) {
    var that = this;
    var userid = app.d.userId;
    var title = e.detail.value;//提交的title值
    console.log(title.input)
    wx.request({//请求数据，获取我的优享清单
      url: app.d.ceshiUrl + '/Api/Index/insert_goods_list',
      method: 'post',
      data: {
        id: userid,
        title: title.input
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log(res.data)
        that.setData({
          goods_list: res.data
        });
      },
      fail: function (e) {

      }
    })
  },  
 
  onShareAppMessage: function () {
    var abc = app.globalData.userInfo.id;
    console.log(abc);
    return {
      title: '享你优选' + abc,
      path: '/pages/index/index',
      success: function (res) {
        // 分享成功
      },
      fail: function (res) {
        // 分享失败
      }
    }
  }
})