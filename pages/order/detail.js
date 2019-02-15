var app = getApp();
// pages/order/detail.js
Page({
  data:{
    orderId:0,
    orderData:{},
    proData:[],
    fanli:[],
    user_lei:'',
    user_id:'',
    log_id:'',
    price_change:0 //价格编辑状态,0为不可编辑，1为可编辑
  },
  onLoad:function(options){
    this.setData({
      orderId: options.orderId,
      user_lei: wx.getStorageSync('user_lei'),
      HeadUrl: wx.getStorageSync('HeadUrl'),
      user_id: wx.getStorageSync('id'),
    })
    this.loadProductDetail();
  },
  price_change:function(){
    this.setData({
      price_change:1
    })
  },
  baocun: function (e) {
    var that = this;
    var rec_id = e.currentTarget.dataset.recid
    wx.request({
      url: app.d.anranUrl + '/index.php?m=default&c=indem&a=price_change',
      method: 'post',
      data: {
        rec_id: rec_id,
        price: e.detail.value.input
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        that.loadProductDetail();
        that.setData({
          price_change: 0,
        })
      },
      fail: function () {
        // fail
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      }
    });
   
  },
  del:function(e){
    var that = this;
    var aid = e.currentTarget.dataset.aid;
    wx.request({
      url: app.d.anranUrl + '/index.php?m=default&c=indem&a=xcx_del_xiangmu_genjin',
      method: 'post',
      data: {
        aid:aid,
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        that.loadProductDetail();
      },
      fail: function () {
        // fail
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      }
    });
  },
  daoyuan: function (e) {
    var that = this;
    var rec_id = e.currentTarget.dataset.recid
    wx.request({
      url: 'https://www.juziyimei.com/admin/order.php?act=operate_post',
      method: 'post',
      data: {
        operation: 'split',
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        that.loadProductDetail();
        that.setData({
          price_change: 0,
        })
      },
      fail: function () {
        // fail
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      }
    });

  },
  /*微信支付 */
  payOrderByWechat: function (e) {
    var that = this;
    //console.log(999);
    var order_id = that.data.orderId;
    var log_id = that.data.log_id;
    if (!order_id || !log_id) {
      wx.showToast({
        title: "订单异常!",
        duration: 2000,
      });

      return false;
    }

    wx.request({
      url: app.d.ceshiUrl + '/Api/Wxpay/wxpay',
      data: {
        order_id: order_id,
        log_id: log_id,
        uid: wx.getStorageSync('id'),
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }, // 设置请求的 header
      success: function (res) {
        if (res.data.status == 1) {
          var order = res.data.arr;
          wx.requestPayment({
            timeStamp: order.timeStamp,
            nonceStr: order.nonceStr,
            package: order.package,
            signType: 'MD5',
            paySign: order.paySign,
            success: function (res) {
              wx.showToast({
                title: "支付成功!",
                duration: 2000,
              });
              setTimeout(function () {
                wx.navigateTo({
                  url: '../user/dingdan?currentTab=1&otype=deliver',
                });
              }, 3000);
            },
            fail: function (res) {
              wx.showToast({
                title: res,
                duration: 3000
              })
            }
          })
        } else {
          wx.showToast({
            title: res.data.err,
            duration: 2000
          });
        }
      },
      fail: function (e) {
        // fail
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      }
    })
  },

  //取消订单
  removeOrder: function (e) {
    var that = this;
    var orderid = that.data.orderId;
    wx.showModal({
      title: '提示',
      content: '你确定要取消订单吗？',
      success: function (res) {
        res.confirm && wx.request({
          url: app.d.anranUrl + '/index.php?m=default&c=indem&a=xcx_cancel_order',
          method: 'post',
          data: {
            order_id: orderid,
            anran_id: wx.getStorageSync('id'),
          },
          header: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          success: function (res) {
            //--init data
            var status = res.data.status;
            if (status == 1) {
              wx.showToast({
                title: '操作成功！',
                duration: 2000
              });
              setTimeout(function () {
                wx.navigateTo({
                  url: '../user/dingdan?currentTab=1&otype=deliver',
                });
              }, 3000);
            } else if (status == 4) {
              wx.showToast({
                title: '已确认无法取消',
                duration: 2000
              });
            }else {
              wx.showToast({
                title: res.data.err,
                duration: 2000
              });
            }
          },
          fail: function () {
            // fail
            wx.showToast({
              title: '网络异常！',
              duration: 2000
            });
          }
        });

      }
    });
  },
  searchValueInput: function (e) {
    var value = e.detail.value;
    this.setData({
      searchValue: value,
    });
    if (!value && this.data.productData.length == 0) {
      this.setData({
        hotKeyShow: true,
        historyKeyShow: true,
      });
    }
  },
  dopl: function (e) {
    var that = this;
    if (that.data.searchValue == '') {
      wx.showToast({
        title: '跟进不能为空',
        icon: 'none',
        duration: 2000
      });
      return
    }
    wx.request({
      url: app.d.anranUrl + '/index.php?m=default&c=indem&a=xcx_xiangmu_genjin',
      method: 'post',
      data: {
        content: that.data.searchValue,
        user_id: wx.getStorageSync('id'),//提交人信息
        order_id: that.data.orderId
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {

        that.loadProductDetail();

      },
      fail: function (e) {
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      },
    });


  },

  loadProductDetail:function(){
    var that = this;
    wx.request({
      url: app.d.anranUrl + '/index.php?m=default&c=indem&a=xcx_get_order_info',
      method:'post',
      data: {
        order_id: that.data.orderId,
      },
      header: {
        'Content-Type':  'application/x-www-form-urlencoded'
      },
      success: function (res) {

        var status = res.data.status;
        if(status==1){
          var pro = res.data.order_info;
          var ord = res.data.order_goods;
          var log_id = res.data.log_id;
          that.setData({
            orderData: pro,
            proData: ord,
            log_id: log_id,
            genjin: res.data.genjin,
            fanli:res.data.fanli
          });
        }else{
          wx.showToast({
            title: res.data.err,
            duration: 2000
          });
        }
      },
      fail: function () {
          // fail
          wx.showToast({
            title: '网络异常！',
            duration: 2000
          });
      }
    });
  },

})