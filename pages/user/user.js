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
      method:'post',
      data: {
        anran_id: wx.getStorageSync('id'),
      },
      header: {
        'Content-Type':  'application/x-www-form-urlencoded'
      },
      success: function (res) {
        //--init data        
        var status = res.data.status;
        if(status==1){
          
          var u_info = res.data.user_info;
          var cart_info = res.data.cart_goods;
          var b_count = res.data.b_count;
          that.setData({
            mobile_phone: u_info.mobile_phone,
            u_info: u_info,
            cart_num: cart_info.total_number,
            user_money: u_info.user_money,
            vip: u_info.vip,
            b_count: b_count,
            b_user_name:res.data.user_name
          });
          console.log(998);
        }else{
          wx.showToast({
            title: '非法操作.',
            duration: 2000
          });
        }
      },
      error:function(e){
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
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