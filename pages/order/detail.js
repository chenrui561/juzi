var app = getApp();
var util = require('../../utils/util.js');
// pages/order/detail.js
Page({
  data:{
    orderId:0,
    orderData:{},
    proData:[],
    fanli:[],
    user_lei:'',
    user_id:'',
    ss_price:'',
    fk_price:'',
    t_tuandui:'',//同级团队奖
    s_tuandui:'',//上级团队奖
    log_id:'',
    now:'',
    price_change:0 //价格编辑状态,0为不可编辑，1为可编辑
  },
  onLoad:function(options){
    var now = util.formatTime(new Date());
    this.setData({
      orderId: options.orderId,
      user_lei: wx.getStorageSync('user_lei'),
      HeadUrl: wx.getStorageSync('HeadUrl'),
      user_id: wx.getStorageSync('id'),
      now: now
    })

  },
  onShow: function () {
    this.loadProductDetail();
  },
  price_change:function(){
    this.setData({
      price_change:1
    })
  },
  /*修改跟进时间 */
  next_genjin_time: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value
    })
    var that = this;
    var orderid = that.data.orderId;
    wx.request({
      url: app.d.anranUrl + '/index.php?m=default&c=indem&a=next_genjin_time_change',
      method: 'post',
      data: {
        orderid: orderid,
        user_id: wx.getStorageSync('id'),
        next_genjin_time: e.detail.value
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        if (res.data == 1) {
          that.loadProductDetail();
        }
        if (res.data == 2) {
          wx.showToast({
            title: '修改失败！',
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
  /*跟进 */
  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value
    })
    var that = this;
    var orderid = that.data.orderId;
    wx.request({
      url: app.d.anranUrl + '/index.php?m=default&c=indem&a=dy_time_change',
      method: 'post',
      data: {
        orderid: orderid,
        user_id: wx.getStorageSync('id'),
        dy_time: e.detail.value
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        if(res.data == 1){
          that.loadProductDetail();
        }
        if(res.data == 2){
          wx.showToast({
            title: '修改失败！',
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
  baocun: function (e) {
    var that = this;
    var rec_id = e.currentTarget.dataset.recid
    wx.request({
      url: app.d.anranUrl + '/index.php?m=default&c=indem&a=price_change',
      method: 'post',
      data: {
        rec_id: rec_id,
        user_id: wx.getStorageSync('id'),
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
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      }
    });
  },
  ss_price:function(e){
    console.log(e.detail.value)
    this.setData({
      ss_price: e.detail.value,
      t_tuandui:e.detail.value * 0.01,//写默认值
      s_tuandui: e.detail.value * 0.05,//写默认值
    })
  },
  fk_price: function (e) {
    console.log(e.detail.value)
    this.setData({
      fk_price: e.detail.value
    })
  },
  t_tuandui: function (e) {
    console.log(e.detail.value)
    this.setData({
      t_tuandui: e.detail.value
    })
  },
  s_tuandui: function (e) {
    console.log(e.detail.value)
    this.setData({
      s_tuandui: e.detail.value
    })
  },
  gaiyy: function (e) {//改为已预约
    var that = this;
    var rec_id = e.currentTarget.dataset.recid
    wx.showModal({//弹窗
      content: "执行改回已预约操作？",
      showCancel: true,
      confirmText: '确定',
      success: function (res) {
        if (res.cancel) {//点击了取消
          console.log(88);
        }
        if (res.confirm) {//点击了确定
          wx.request({
            url: app.d.anranUrl + '/index.php?m=default&c=indem&a=gaiyy',
            method: 'post',
            data: {
              order_id: that.data.orderId,
              user_id: wx.getStorageSync('id')
            },
            header: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
              if (res.data.states == 1) {
                wx.showToast({
                  title: '成功',
                  duration: 2000
                });
              }
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
        }
      }
    })
  },
  weidaoyuan: function (e) {//未到院
    var that = this;
    var rec_id = e.currentTarget.dataset.recid
    wx.showModal({//弹窗
      content: "执行未到院操作？",
      showCancel: true,
      confirmText: '确定',
      success: function (res) {
        if (res.cancel) {//点击了取消
          console.log(88);
        }
        if (res.confirm) {//点击了确定
          wx.request({
            url: app.d.anranUrl + '/index.php?m=default&c=indem&a=weidaoyuan',
            method: 'post',
            data: {
              order_id: that.data.orderId,
              user_id: wx.getStorageSync('id')
            },
            header: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
              if (res.data.states == 1) {
                wx.showToast({
                  title: '成功',
                  duration: 2000
                });
              }
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
        }
      }
    })
  },
  genjin_states: function (e) {//修改跟进状态
    var that = this;
    var rec_id = e.currentTarget.dataset.recid
    wx.request({
      url: app.d.anranUrl + '/index.php?m=default&c=indem&a=genjin_states',
      method: 'post',
      data: {
        order_id: that.data.orderId,
        user_id: wx.getStorageSync('id')
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        if (res.data.states == 1) {
          wx.showToast({
            title: '成功',
            duration: 2000
          });
        }
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
  weijiesuan: function (e) {
    var that = this;
    var rec_id = e.currentTarget.dataset.recid
    wx.showModal({//弹窗
      content: "执行未成交操作？",
      showCancel: true,
      confirmText: '确定',
      success: function (res) {
        if (res.cancel) {//点击了取消
          console.log(88);
        }
        if (res.confirm) {//点击了确定
          wx.request({
            url: app.d.anranUrl + '/index.php?m=default&c=indem&a=weijiesuan',
            method: 'post',
            data: {
              order_id: that.data.orderId,
              user_id: wx.getStorageSync('id')
            },
            header: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
              if (res.data.states == 1) {
                wx.showToast({
                  title: '成功',
                  duration: 2000
                });
              }
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
        }
      }
    })
  },
  daoyuan: function (e) {
    var that = this;
    var rec_id = e.currentTarget.dataset.recid
    if(this.data.ss_price == ''){
      wx.showToast({
        title: '手术金额不能为空',
        icon:'none',
        duration: 2000
      });
      return;
    }
    if (this.data.fk_price == '') {
      wx.showToast({
        title: '返款金额不能为空',
        icon: 'none',
        duration: 2000
      });
      return;
    }
    if (this.data.t_tuandui == '') {
      wx.showToast({
        title: '同级团队奖不能为空',
        icon: 'none',
        duration: 2000
      });
      return;
    }
    if (this.data.s_tuandui == '') {
      wx.showToast({
        title: '上级团队奖不能为空',
        icon: 'none',
        duration: 2000
      });
      return;
    }
    wx.showModal({//弹窗
      content: "执行到院操作？",
      showCancel: true,
      confirmText: '确定',
      success: function (res) {
        if (res.cancel) {//点击了取消
          console.log(88);
        }
        if (res.confirm) {//点击了确定
          wx.request({
            url: app.d.anranUrl + '/index.php?m=default&c=indem&a=daoyuan',
            method: 'post',
            data: {
              order_id: that.data.orderId,
              ss_price:that.data.ss_price,
              fk_price:that.data.fk_price,
              t_tuandui: that.data.t_tuandui,
              s_tuandui: that.data.s_tuandui,
              user_id: wx.getStorageSync('id')
            },
            header: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
              if (res.data.states == 1){
                wx.showToast({
                  title: '成功',
                  duration: 2000
                });
              }
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
        }
      }
    })
    

  },
  chehui: function (e) {
    var that = this;
    wx.showModal({//弹窗
      content: "执行撤回操作？",
      showCancel: true,
      confirmText: '确定',
      success: function (res) {
        if (res.cancel) {//点击了取消
          console.log(88);
        }
        if (res.confirm) {//点击了确定
          wx.request({
            url: app.d.anranUrl + '/index.php?m=default&c=indem&a=chehui_daoyuan',
            method: 'post',
            data: {
              order_id: that.data.orderId,
              user_id: wx.getStorageSync('id')
            },
            header: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
              if (res.data.states == 1) {
                wx.showToast({
                  title: '成功',
                  duration: 2000
                });
              }
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
        }
      }
    })
  },
  jiesuan: function (e) {
    var that = this;
    wx.showModal({//弹窗
      content: "执行结算操作？",
      showCancel: true,
      confirmText: '确定',
      success: function (res) {
        if (res.cancel) {//点击了取消
          console.log(88);
        }
        if (res.confirm) {//点击了确定
          wx.request({
            url: app.d.anranUrl + '/index.php?m=default&c=indem&a=jiesuan',
            method: 'post',
            data: {
              order_id: that.data.orderId,
              user_id: wx.getStorageSync('id')
            },
            header: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
              if (res.data.states == 1) {
                wx.showToast({
                  title: '成功',
                  duration: 2000
                });
              }
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
        }
      }
    })
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
              that.loadProductDetail();
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
            address:res.data.address,
            proData: ord,
            log_id: log_id,
            genjin: res.data.genjin,
            fanli:res.data.fanli,
            count_pl: res.data.count_pl
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