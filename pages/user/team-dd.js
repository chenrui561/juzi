// pages/user/dingdan.js
//index.js  
//获取应用实例  
var app = getApp();
var util = require('../../utils/util.js');
var common = require("../../utils/common.js");
Page({
  data: {
    winWidth: 0,
    winHeight: 0,
    now:'',
    // tab切换  
    currentTab: 0,
    isStatus: 'deliver',//10待付款，20待发货，30待收货 40、50已完成
    page: 0,
    type:1,
    more0:'点击加载更多',
    more1: '点击加载更多',
    more2: '点击加载更多',
    more3: '点击加载更多',
    more4: '点击加载更多',
    user_lei:'',
    genjin:0,//根据跟进时间排序
    dy_date:0,//到院时间
    refundpage: 0,
    genjin_states: ['全部状态', '需跟进', '无需跟进'],
    genjin_states_id:0,
    daoyuan_states_list:['全部','待到院','未到院'],
    daoyuan_states:0,
    jiesuan_states_list: ['全部', '已成交', '未成交'],
    jiesuan2_states_list: ['全部'],
    quxiao_states_list: ['全部'],
    jiesuan_states:0,
    orderList0: [],
    orderList1: [],
    orderList2: [],
    orderList3: [],
    orderList4: [],
    yy_time_start:'0',//预约时间开始
    yy_time_end: '0',//预约时间结束
    dy_time_start: '0',//到院时间开始
    dy_time_end: '0',//到院时间结束
    next_gj_time_start: '0',
    next_gj_time_end: '0',
    last_gj_time_start: '0',
    last_gj_time_end: '0',
    js_time_start: '0',
    js_time_end: '0',
  },
  /**清空 */
  qingkong:function(e){
    this.setData({
      yy_time_start: '0',//预约时间开始
      yy_time_end: '0',//预约时间结束
      dy_time_start: '0',//到院时间开始
      dy_time_end: '0',//到院时间结束
      next_gj_time_start: '0',
      next_gj_time_end: '0',
      last_gj_time_start: '0',
      last_gj_time_end: '0',
      js_time_start: '0',
      js_time_end: '0',
    })
    this.loadOrderList();
  },
  /*预约时间查询 */
  yy_time_start:function(e){
    this.setData({
      yy_time_start: e.detail.value
    })
    this.loadOrderList();
  },
  yy_time_end: function (e) {
    this.setData({
      yy_time_end: e.detail.value
    })
    this.loadOrderList();
  },
  dy_time_start: function (e) {
    this.setData({
      dy_time_start: e.detail.value
    })
    this.loadOrderList();
  },
  dy_time_end: function (e) {
    this.setData({
      dy_time_end: e.detail.value
    })
    this.loadOrderList();
  },
  next_gj_time_start: function (e) {
    this.setData({
      next_gj_time_start: e.detail.value
    })
    this.loadOrderList();
  },
  next_gj_time_end: function (e) {
    this.setData({
      next_gj_time_end: e.detail.value
    })
    this.loadOrderList();
  },
  last_gj_time_start: function (e) {
    this.setData({
      last_gj_time_start: e.detail.value
    })
    this.loadOrderList();
  },
  last_gj_time_end: function (e) {
    this.setData({
      last_gj_time_end: e.detail.value
    })
    this.loadOrderList();
  },
  js_time_start: function (e) {
    this.setData({
      js_time_start: e.detail.value
    })
    this.loadOrderList();
  },
  js_time_end: function (e) {
    this.setData({
      js_time_end: e.detail.value
    })
    this.loadOrderList();
  },
  onLoad: function (options) {
    var now = util.formatTime(new Date());
    this.initSystemInfo();
    this.setData({
      currentTab: parseInt(options.currentTab),
      isStatus: options.otype,
      type:options.id,
      now:now,
      user_lei: wx.getStorageSync('user_lei')
    });

    this.loadOrderList();
  },
  genjin:function(){
    if(this.data.genjin == 0){
      this.setData({
        genjin: 1
      })
      this.loadOrderList();
    }else{
      this.setData({
        genjin: 0
      })
      this.loadOrderList();
    }
  },
  genjin_states: function (e) {
    this.setData({
      genjin_states_id: e.detail.value
    })
      this.loadOrderList();
    
  },
  getOrderStatus: function () {
    return this.data.currentTab == 0 ? 1 : this.data.currentTab == 2 ? 2 : this.data.currentTab == 3 ? 3 : 0;
  },
  bindDateChange:function(e){
    var that = this;
    this.setData({
      dy_date: e.detail.value
    })
    this.loadOrderList();
  },
  //取消订单
  removeOrder: function (e) {
    var that = this;
    var orderid = e.currentTarget.dataset.orderid;
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
              that.loadOrderList();
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
              title: '网络异常！',
              duration: 2000
            });
          }
        });

      }
    });
  },

  //确认收货
  recOrder: function (e) {
    var that = this;
    var orderId = e.currentTarget.dataset.orderId;
    wx.showModal({
      title: '提示',
      content: '你确定已收到宝贝吗？',
      success: function (res) {
        res.confirm && wx.request({
          url: app.d.ceshiUrl + '/Api/Order/orders_edit',
          method: 'post',
          data: {
            id: orderId,
            type: 'receive',
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
              that.loadOrderList();
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
              title: '网络异常！',
              duration: 2000
            });
          }
        });

      }
    });
  },
//筛选已预约的到院状态
daoyuan_states:function(e){
  var that = this;
  this.setData({
    daoyuan_states: e.detail.value,
    jiesuan_states: 0
  })
  this.loadOrderList();
},
//筛选已到院的结算状态
  jiesuan_states: function (e) {
    var that = this;
    this.setData({
      daoyuan_states: 0,
      jiesuan_states: e.detail.value
    })
    this.loadOrderList();
  },

  loadOrderList: function () {
    wx.showLoading();//加载动画
    var that = this;
    wx.request({
      url: app.d.anranUrl + '/index.php?c=indem&a=xcx_order_list',
      method: 'post',
      data: {
        uid: wx.getStorageSync('id'),
        order_type: that.data.isStatus,
        daoyuan_states: that.data.daoyuan_states,
        jiesuan_states: that.data.jiesuan_states,
        page: 1,
        genjin_states_id: that.data.genjin_states_id,
        genjin:that.data.genjin,
        type: that.data.type,
        dy_time:that.data.dy_date,
        yy_time_start: that.data.yy_time_start,//预约时间开始
        yy_time_end: that.data.yy_time_end,
        dy_time_start: that.data.dy_time_start,
        dy_time_end: that.data.dy_time_end,
        next_gj_time_start: that.data.next_gj_time_start,
        next_gj_time_end: that.data.next_gj_time_end,
        last_gj_time_start: that.data.last_gj_time_start,
        last_gj_time_end: that.data.last_gj_time_end,
        js_time_start: that.data.js_time_start,
        js_time_end: that.data.js_time_end,
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      
      success: function (res) {
        //--init data        
        wx.hideLoading()//关闭加载动画
        var status = res.data.status;
        var list = res.data;
        that.setData({
          page:1
        })
        switch (that.data.currentTab) {
          case 0:
            that.setData({
              orderList0: list,
              count0:list.length
            });
            break;
          case 1:
            that.setData({
              orderList1: list,
              count1: list.length
            });
            break;
          case 2:
            that.setData({
              orderList2: list,
              count2: list.length
            });
            break;
          case 3:
            that.setData({
              orderList3: list,
              count3: list.length
            });
            break;
          case 4:
            that.setData({
              orderList4: list,
              count4: list.length
            });
            break;
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
  /**
  * 页面上拉触底事件的处理函数
  */
  onReachBottom: function () {
    this.loadOrderList2();


  },

  loadOrderList2: function () {//下拉加载
    wx.showLoading();//加载动画
    var that = this;
    wx.request({
      url: app.d.anranUrl + '/index.php?c=indem&a=xcx_order_list',
      method: 'post',
      data: {
        uid: wx.getStorageSync('id'),
        order_type: that.data.isStatus,
        daoyuan_states: that.data.daoyuan_states,
        jiesuan_states: that.data.jiesuan_states,
        page: that.data.page + 1,
        genjin: that.data.genjin,
        type: that.data.type,
        dy_time: that.data.dy_date,
        yy_time_start: that.data.yy_time_start,//预约时间开始
        yy_time_end: that.data.yy_time_end,
        dy_time_start: that.data.dy_time_start,
        dy_time_end: that.data.dy_time_end,
        next_gj_time_start: that.data.next_gj_time_start,
        next_gj_time_end: that.data.next_gj_time_end,
        last_gj_time_start: that.data.last_gj_time_start,
        last_gj_time_end: that.data.last_gj_time_end,
        js_time_start: that.data.js_time_start,
        js_time_end: that.data.js_time_end,
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },

      success: function (res) {
        //--init data        
        wx.hideLoading()//关闭加载动画
        var status = res.data.status;
        var list = res.data;
        console.log(list.length);
        that.setData({
          page: that.data.page + 1
        })
        switch (that.data.currentTab) {
          case 0:
            that.setData({
              orderList0: that.data.orderList0.concat(list),
            });
            if(list.length == 0){
              that.setData({
                more0: '没有更多'
              })
            }
            break;
          case 1:
            that.setData({
              orderList1: that.data.orderList1.concat(list),
            });
            if (list.length == 0) {
              that.setData({
                more1: '没有更多'
              })
            }
            break;
          case 2:
            that.setData({
              orderList2: that.data.orderList2.concat(list),
            });
            if (list.length == 0) {
              that.setData({
                more2: '没有更多'
              })
            }
            break;
          case 3:
            that.setData({
              orderList3: that.data.orderList3.concat(list),
            });
            if (list.length == 0) {
              that.setData({
                more3: '没有更多'
              })
            }
            break;
          case 4:
            that.setData({
              orderList4: that.data.orderList4.concat(list),
            });
            if (list.length == 0) {
              that.setData({
                more4: '没有更多'
              })
            }
            break;
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
  // returnProduct:function(){
  // },
  initSystemInfo: function () {
    var that = this;

    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }
    });
  },
  bindChange: function (e) {
    var that = this;
    that.setData({ currentTab: e.detail.current });
  },
  swichNav: function (e) {
    var that = this;
    if (that.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      var current = e.target.dataset.current;
      that.setData({
        currentTab: parseInt(current),
        isStatus: e.target.dataset.otype,
      });
      console.log(current)
      //进行加载
      switch (that.data.currentTab) {
        case 0:
          that.loadOrderList();
          break;
        case 1:
          that.loadOrderList();
          break;
        case 2:
          that.loadOrderList();
          break;
        case 3:
          that.loadOrderList();
          break;
        case 4:
          that.loadOrderList();
          break;
      }
    };
  },
  /**
   * 微信支付订单
   */
  // payOrderByWechat: function(event){
  //   var orderId = event.currentTarget.dataset.orderId;
  //   this.prePayWechatOrder(orderId);
  //   var successCallback = function(response){
  //     console.log(response);
  //   }
  //   common.doWechatPay("prepayId", successCallback);
  // },

  payOrderByWechat: function (e) {
    var order_id = e.currentTarget.dataset.orderid;
    var log_id = e.currentTarget.dataset.logid;
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

  /**
   * 调用服务器微信统一下单接口创建一笔微信预订单
   */
  //   prePayWechatOrder: function(orderId){
  //     var uri = "/ztb/userZBT/GetWxOrder";
  //     var method = "post";
  //     var dataMap = {
  //       SessionId: app.globalData.userInfo.sessionId,
  //       OrderNo: orderId
  //     }
  //     console.log(dataMap);
  //     var successCallback = function (response) {
  //       console.log(response);
  //     };
  //     common.sentHttpRequestToServer(uri, dataMap, method, successCallback);
  //   }
})