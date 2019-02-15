// pages/huodong/huodong2.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  //确认订单，付费成为合作伙伴
  createProductOrder: function (e) {
    //创建订单
    var that = this;

    wx.showModal({//弹窗
      content: "确定缴费100元参加？",
      showCancel: true,
      confirmText: '确定',
      success: function (res) {
        if (res.cancel) {//点击了取消
          console.log(88);
        }
        if (res.confirm) {//点击了确定，去支付
          wx.request({
            url: app.d.anranUrl + '/index.php?m=default&c=indem&a=qd_done',
            method: 'post',
            data: {
              user_id: wx.getStorageSync('id'),//用户自己的ID，从缓存去取
              type_id: 5,//表示活动
              tid: 99999999 //tid为自己表示来自活动
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
                title: "报名成功!",
                duration: 2500
              });
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
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    wx.request({
      url: app.d.anranUrl + '/index.php?m=default&c=indem&a=huodong_canjia',
      method: 'post',
      data: {
        user_id: wx.getStorageSync('id'),//用户自己的ID，从缓存去取
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        //--init data        
        that.setData({
          count:res.data.count.count
        })
        console.log(res.data.count.count)
      },
      fail: function (e) {
        wx.showToast({
          title: '网络异常',
          duration: 2000
        });
      }
    });
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})