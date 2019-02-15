// pages/user/user.js
var app = getApp()


Page( {
  data: {
    userInfo: {},
    u_info:{},
    cart_num:'',
    user_money:'',
    b_count:'',
    b_user_name:'',
    mobile_phone:'',
  },
  onLoad: function () {
      var that = this
      //调用应用实例的方法获取全局数据
      app.getUserInfo(function(userInfo){
        //更新数据
        that.setData({
          userInfo:userInfo,
          loadingHidden: true
        })
        //console.log(app.globalData.aaa);
      });

      this.loadOrderStatus();
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onPullDownRefresh: function () {
    this.loadOrderStatus();
    wx.stopPullDownRefresh();//解决回弹问题
  },
  loadOrderStatus:function(){
    //获取用户订单数据
    var that = this;
    wx.request({
      url: app.d.anranUrl + '/index.php?m=default&c=indem&a=xcx_user_info',
      method: 'post',
      data: {
        anran_id: wx.getStorageSync('id'),
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        //--init data        
        var status = res.data.status;
        if (status == 1) {

          var u_info = res.data.user_info;
          var cart_info = res.data.cart_goods;
          var b_count = res.data.b_count;
          if (u_info == null) {
            that.setData({
              b_user_name: 0,
            });
          } else {
            wx.setStorageSync('user_lei', res.data.user_info.user_lei)//把自己的用户类型写入缓存
            wx.setStorageSync('choujiang', res.data.user_info.choujiang)//判断弹窗是否出现
            that.setData({
              all_money: res.data.all_money,
              count_car: res.data.count_car,
              mobile_phone: u_info.mobile_phone,
              u_info: u_info,
              cart_num: cart_info.total_number,
              user_money: u_info.user_money,
              b_count: b_count,
              b_user_name: res.data.user_name,
              count1: res.data.count1,
              count2: res.data.count2,
              count3: res.data.count3,
              count4: res.data.count4,
            });
          }
        } else {
          wx.showToast({
            title: '非法操作.',
            duration: 2000
          });
        }
      },
      error: function (e) {
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      }
    });
  },
  /*生成二维码 */
  qr: function (e) {
    var that = this;
    wx.showLoading();//加载动画 
    wx.request({
      url: app.d.anranUrl + '/index.php?m=default&c=indem&a=testcode',
      method: 'post',
      data: {
        anran_id: wx.getStorageSync('id'),
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        that.setData({
          qr_img: res.data.qr_img,
          qr_arr: res.data.qr_arr
        });

        wx.previewImage({
          current: res.data.qr_img,
          urls: res.data.qr_arr
        })
        wx.hideLoading()//关闭加载动画
      },
      error: function (e) {
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
        wx.hideLoading()//关闭加载动画
      }
    });
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