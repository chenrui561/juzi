// pages/user/team.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    time:['全部','近一周','近一个月','近三个月'],
    time_on:'全部',
    count_tj:'',
    count_qd:'',
    qr_img:'',
    shouyi:''
  },
b_phone:function(e){

  wx.makePhoneCall({
    phoneNumber: e.currentTarget.dataset.phone //仅为示例，并非真实的电话号码
  })
},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadOrderStatus();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  //确认订单，付费成为合作伙伴
  createProductOrder: function (e) {


    //创建订单
    var that = this;
    wx.showModal({//弹窗
      content: "确定成为桔子合作伙伴？",
      showCancel: true,
      confirmText: '确定',
      success: function (res) {
        if (res.cancel) {//点击了取消，去首页
          console.log(88);
        }
        if (res.confirm) {//点击了确定，去支付
          wx.request({
            url: app.d.anranUrl + '/index.php?m=default&c=indem&a=qd_done',
            method: 'post',
            data: {
              user_id: wx.getStorageSync('id'),//用户自己的ID，从缓存去取
              type_id: 4,//1为总监，2城市，3省创，4是从总监升级成为城市合伙人
              tid: wx.getStorageSync('id') //升级的时候推荐人是自己
            },
            header: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
              //--init data        
              var data = res.data;
              if (data.status == 1) {
                that.setData({// 写入返回的sn
                  re_tuan_sn: data.tuan_sn
                });
                //创建订单成功
                if (data.arr.pay_type == 'weixin') {
                  //微信支付
                  that.wxpay(data.arr);
                }
              } else {
                wx.showToast({
                  title: "下单失败!",
                  duration: 2500
                });
              }
            },
            fail: function (e) {
              wx.showToast({
                title: '网络异常',
                duration: 2000
              });
            }
          });
        }
      }
    })

  },
  //调起微信支付
  wxpay: function (order) {

    var that = this;
    var tuanid = that.data.tuanid;
    var goods_id = that.data.goods_id;
    wx.request({
      url: app.d.ceshiUrl + '/Api/Wxpay/wxpay',
      data: {
        order_id: order.order_id,
        log_id: order.log_id,
        anran_id: wx.getStorageSync('id'),
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }, // 设置请求的 header
      success: function (res) {

        wx.hideLoading()//关闭加载动画
        that.setData({// 把按钮开关变回来
          off: 1
        });
        if (res.data.status == 1) {
          console.log(res)
          var order = res.data.arr;

          wx.requestPayment({
            timeStamp: order.timeStamp,
            nonceStr: order.nonceStr,
            package: order.package,
            signType: 'MD5',
            paySign: order.paySign,
            success: function (res) {
              wx.showToast({
                title: "加入成功!",
                duration: 2500
              });
              setTimeout(function () {
                wx.reLaunch({//绑定成功之后重新加载小程序，并回到首页
                  url: '../index/index',
                })//要延时执行的代码
              }, 2500) //延迟时间 这里是1秒

            },
            fail: function (res) {
              wx.showToast({
                title: res,
                duration: 3000
              });
            }
          })
        } else {
          wx.showToast({
            title: res.data.err,
            duration: 2000
          });
        }
      },
      fail: function () {
        // fail
        wx.showToast({
          title: '网络异常！err:wxpay',
          duration: 2000
        });
      }
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.loadOrderStatus();
    wx.stopPullDownRefresh();//解决回弹问题
  },
  loadOrderStatus: function () {
    //获取用户订单数据
    var that = this;
    wx.request({
      url: app.d.anranUrl + '/index.php?m=default&c=indem&a=xcx_qd_user_info',
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
          that.setData({
            mobile_phone: u_info.mobile_phone,
            u_info: u_info,
            count_tj: res.data.count_tj,
            count_qd: res.data.count_qd,
            t_user_info: res.data.t_user_info,
            shouyi:res.data.xd
          });

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
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})