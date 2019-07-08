// pages/index/zhaoshang.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    qd_id:''
  },
  // 弹出层
  takeCoupon: function (e) {
    this.setData({
      LayerBoxHeight: '100%',
      noscroll: 'noscroll'//关闭背景滑动
    })
    if (e.currentTarget.dataset.id == 1) {
      this.setData({
        focus: true
      })
    }
    this.createMaskShowAnim();
    this.createContentShowAnim();
  },
  // 关闭弹出层
  takeCouponClose: function () {
    this.setData({
      'LayerBoxHeight': '0',
      noscroll: ''//开启背景滑动
    })
    this.createMaskHideAnim();
    this.createContentHideAnim();
  },
  /*弹出层方法开始 */
  createMaskShowAnim: function () {
    const animation = wx.createAnimation({
      duration: 200,
      timingFunction: 'cubic-bezier(.55, 0, .55, .2)',
    });

    this.maskAnim = animation;

    animation.opacity(1).step();
    this.setData({
      animMaskData: animation.export(),
    });
  },
  createMaskHideAnim: function () {
    this.maskAnim.opacity(0).step();
    this.setData({
      animMaskData: this.maskAnim.export(),
    });
  },
  createContentShowAnim: function () {
    const animation = wx.createAnimation({
      duration: 200,
      timingFunction: 'cubic-bezier(.55, 0, .55, .2)',
    });
    this.contentAnim = animation;
    animation.translateY(0).step();
    this.setData({
      animContentData: animation.export(),
    });
  },
  createContentHideAnim: function () {
    this.contentAnim.translateY('100%').step();
    this.setData({
      animContentData: this.contentAnim.export(),
    });
  },
 /*弹出层方法结束 */
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setStorageSync('gg_id', options.gg_id)//把广告id写入缓存
    wx.setStorageSync('bd_id', options.qd_id)//绑定推荐关系
    this.setData({
      qd_id: options.qd_id
    })
    this.youhui();
  },
  youhui: function () {//优惠的第一屏加载
    var that = this;
    var latitude = this.data.latitude;
    var longitude = this.data.longitude;
    var fenlei = this.data.fenlei;
    var paixu = this.data.paixu;
    var pick_id = this.data.pick_id;
    wx.showLoading();//加载动画
    wx.request({//加载首页推荐商品
      url: app.d.anranUrl + '/index.php?m=default&c=indem&a=zhaoshang_goods',
      method: 'post',
      data: {
        page: 1,
        user_id: wx.getStorageSync('id')
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var xzzzp = res.data.xzzzp;
        that.setData({
          xzzzp: xzzzp,
          page2: 1,
          zhuanpan_on: res.data.zhuanpan,  //转盘
          huodong_img: res.data.huodong, //活动开关
          huodong_info: res.data.huodong_info,
          fenxiang: res.data.fenxiang
        });
        //endInitData
        wx.hideLoading()//关闭加载动画
      },
      fail: function (e) {
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      },
    })
  },
  //确认订单，付费成为合作伙伴
  createProductOrder2: function (e) {

    //创建订单
    var that = this;
    wx.showModal({//弹窗
      content: "会员可享受自己消费最高50%返佣，但不能分享赚钱。确定购买？",
      showCancel: true,
      confirmText: '确定',
      success: function (res) {
        if (res.cancel) {//点击了取消，去首页
          console.log(88);
        }
        if (res.confirm) {//点击了确定，去支付
          wx.showLoading();//加载动画
          wx.request({
            url: app.d.anranUrl + '/index.php?m=default&c=indem&a=qd_done',
            method: 'post',
            data: {
              user_id: wx.getStorageSync('id'),//用户自己的ID，从缓存去取
              tid: that.data.qd_id,//需要绑定的渠道id
              type_id: 6,//6为198会员
            },
            header: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
              //--init data       
              wx.hideLoading()//关闭加载动画 
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
  //确认订单，付费成为合作伙伴
  createProductOrder: function (e) {

    //创建订单
    var that = this;
    var type_id = e.currentTarget.dataset.id;
    wx.showModal({//弹窗
      content: "确定成为桔子合作伙伴？",
      showCancel: true,
      confirmText: '确定',
      success: function (res) {
        if (res.cancel) {//点击了取消，去首页
          console.log(88);
        }
        if (res.confirm) {//点击了确定，去支付
          wx.showLoading();//加载动画
          wx.request({
            url: app.d.anranUrl + '/index.php?m=default&c=indem&a=qd_done',
            method: 'post',
            data: {
              user_id: wx.getStorageSync('id'),//用户自己的ID，从缓存去取
              tid: that.data.qd_id,//需要绑定的渠道id
              type_id: type_id,//1为总监，2城市，3省创
            },
            header: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
              //--init data        
              var data = res.data;
              wx.hideLoading()//关闭加载动画
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
tanchuang:function(){
  var that = this;
  wx.showActionSheet({
    itemList: ['支付980成为总监', '支付3980成为城市合伙人'],
    success(res) {
      console.log(res.tapIndex)
      if (res.tapIndex == 0){
        var aaa = { currentTarget: { dataset:{id:1}}};
        console.log(aaa);
        that.createProductOrder(aaa);
      }
      if (res.tapIndex == 1) {
        var aaa = { currentTarget: { dataset: { id: 2 } } };
        that.createProductOrder(aaa);
      }
    },
    fail(res) {
      console.log(res.errMsg)
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
  /*获取微信手机号 */
  getPhoneNumber(e) {
    var that = this;

    var encryptedData = e.detail.encryptedData;
    var iv = e.detail.iv;
    app.phone().then(function (res) {//调用app文件中的方法并等待回调，res为收到的phone方法里的code
      wx.showLoading();//加载动画
      //用户的订单状态
      wx.request({
        url: app.d.anranUrl + '/index.php?m=default&c=indem&a=getsessionkey_phone',
        method: 'post',
        data: {
          code: res,
          encryptedData: encryptedData,
          iv: iv,
          user_id: wx.getStorageSync('id'),
          shenqing:1 //表示来自招商的申请
        },
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          //--init data  
          wx.hideLoading()//关闭加载动画
          var data = res.data.data_info;
          if (res.data > 0) {
            if(res.data == 99999){
              wx.showToast({
                title: '您已经是桔子合作伙伴了',
                icon: 'none',
                duration: 2000
              });
              
            }else{
              that.setData({
                input_mobile: res.data,
                wx_phone: 1
              })
              wx.showToast({
                title: '申请成功！',
                duration: 2000
              });
              that.tanchuang();
            }
          } else {
            wx.showToast({
              title: '获取失败，请再试一次',
              icon: 'none',
              duration: 2000
            });
          }
        },
        fail: function (e) {
          wx.showToast({
            title: '网络异常！err:getsessionkeys',
            duration: 2000
          });
        },
      });
    });
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
    var abc = wx.getStorageSync('id');

    return {
      title: '【0投入/0囤货-月赚5万】——让整形医院给你打工！',
      path: '/pages/index/zhaoshang?qd_id=' + abc,
      success: function (res) {
        // 分享成功

        wx.showModal({
          title: '分享成功',
          content: '通过你的分享加入的会员将会成为你的团队成员哦',
          showCancel: false,
          confirmText: '好的',
          success: function (res) {

          }
        })
      },
      fail: function (res) {
        // 分享失败
      }
    }
  }
})