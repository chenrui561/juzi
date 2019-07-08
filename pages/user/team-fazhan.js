// pages/user/team-fazhan.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shouquan: 999,
    id:0,
    user_id:'',
    user_info:[],
    mf:0,
    mf_qd:0,
    off:1,
    type_id:0
  },
  bindGetUserInfo: function (e) {
    var that = this;

    if (e.detail.userInfo) {
      //调用应用实例的方法获取全局数据
      app.getUserInfo(function (userInfo) {
        //更新数据
        that.setData({
          userInfo: userInfo,
          loadingHidden: true,
          shouquan: 1,
        })

      });
      //用户按了允许授权按钮

    } else {
      wx.showModal({
        content: "您已拒绝授权",
        showCancel: false,
        confirmText: '知道了',
        success: function (res) {
          that.setData({
            showModal2: false
          });
        }
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu();//隐藏原生转发按钮
    var hx_id = wx.getStorageSync('id')//从缓存中获取用户id
    var that = this;
    var id = options.id;
    var mf = options.mf;
    var type_id = options.type_id;
    that.setData({
      id: id,
      user_id: hx_id,
      mf: mf,
      type_id: type_id
    });
    if(id > 0){//表示来自分享的页面，就要显示id用户邀请你缴费成为合作伙伴
      //更改头部标题
      wx.setNavigationBarTitle({
        title: '成为合作伙伴',
        success: function () {
        },
      });
    }
    if (wx.getStorageSync('id') == '') {//如果缓存里面没有id，那就弹授权
      that.setData({
        shouquan: 0,
      });
    }
    if (hx_id > 0) { } else {//判断是否已经登录
     /* app.getOpenid().then(function (openid) {
        if (openid == 66) {
          that.setData({
            shouquan: 999
          });
        }
        if (openid == 88) {
          that.setData({
            shouquan: 0
          });
        }

      });*/
    }
    wx.showLoading();//加载动画

    wx.request({
      url: app.d.anranUrl + '/index.php?m=default&c=indem&a=xcx_shouyi_liushui',
      method: 'post',
      data: {
        id: wx.getStorageSync('id'),
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        //--init data 
        var goods_user = res.data.goods_user;
        var user_info = res.data.user_info;
        that.setData({
          goods_user: goods_user,
          user_info: user_info[0]
        });
        wx.hideLoading()//关闭加载动画
      },
      error: function (e) {
        wx.showToast({
          title: '网络异常！',
          duration: 2000,
        });
      },
    });
   
  },
/*免费成为总监 */
mf_done: function(e){
  var that = this;
  var id = that.data.id;
  var type_id = that.data.type_id;
  var rel_name = that.data.user_info.rel_name
  var mobile_phone = that.data.user_info.mobile_phone
  if (rel_name == '' || mobile_phone == ''){

    wx.showModal({//弹窗
      content: "成为合作伙伴需要先完善用户信息，现在就去完善？",
      showCancel: true,
      confirmText: '确定',
      success: function (res) {
        if (res.cancel) {//点击了取消
        return;
        }
        if (res.confirm) {//点击了确定，去支付
          wx.navigateTo({//绑定成功之后重新加载小程序，并回到首页
            url: '../user/bd?type_id=' + type_id + '&id=' + id,
          })
        }
      }
    })
    return;
  }
  console.log('真名' + rel_name);
  console.log('手机' + mobile_phone);
  wx.request({
    url: app.d.anranUrl + '/index.php?m=default&c=indem&a=mf_qd_done',
    method: 'post',
    data: {
      user_id: wx.getStorageSync('id'),//用户自己的ID，从缓存去取
      type_id: type_id,//1为总监，2城市，3省创
      tid:id //推荐人的id
    },
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    success: function (res) {
      //--init data        
      var data = res.data;
      if (data.status == 1) {
        wx.showToast({
          title: "加入成功!",
          duration: 2500
        });
        setTimeout(function () {
          wx.reLaunch({//绑定成功之后重新加载小程序，并回到首页
            url: '../index/index',
          })//要延时执行的代码
        }, 2500) //延迟时间 这里是1秒
        
      } else if (data.status == 2){
        wx.showToast({
          title: "您已经是合作伙伴啦!",
          duration: 2500
        });  
      } else {
        wx.showToast({
          title: "失败!",
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
},
  //确认订单，付费成为合作伙伴
  createProductOrder: function (e) {
    

    //创建订单
    var that = this;
    var off = e.currentTarget.dataset.off;
    var id = that.data.id;
    var type_id = that.data.type_id;
    var rel_name = that.data.user_info.rel_name
    var mobile_phone = that.data.user_info.mobile_phone
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
              type_id: type_id,//1为总监，2城市，3省创
              tid: id //推荐人的id
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

  type_id_1: function(e){
    var that = this;
    that.setData({
      type_id: 1
    });
  },
  type_id_2: function (e) {
    var that = this;
    that.setData({
      type_id: 2
    });
  },
  type_id_3: function (e) {
    var that = this;
    that.setData({
      type_id: 3
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
    var that = this;
    var id = that.data.id;
    //获取用户数据
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
          var user_lei = res.data.user_info.user_lei;
          var mf_qd = res.data.user_info.mf_qd;//免费发展权限
          //--init data 
          var goods_user = res.data.goods_user;
          var user_info = res.data.user_info;
          that.setData({
            mf_qd: mf_qd,
            user_info: res.data.user_info,
            user_lei: user_lei
          });
          console.log(res.data.user_info)
          wx.hideLoading()//关闭加载动画
          if (user_lei > 0 && id > 0) {
            wx.showToast({
              title: '您已经是合作伙伴了',
              icon: 'none',
              mask: true,
              duration: 2000
            });
            setTimeout(function () {
              wx.reLaunch({//绑定成功之后重新加载小程序，并回到首页
                url: '../index/index',
              })//要延时执行的代码
            }, 2000)
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
  onShareAppMessage: function () {//
    var that = this;
    var abc = wx.getStorageSync('id');
    var name = wx.getStorageSync('NickName');
    var type_id = that.data.type_id;
    var mf = that.data.mf;
    var title = that.data.title;
    console.log(abc);
    console.log(type_id);
    console.log(mf);
    return {
      title: name +'邀请您成为桔子放心美的合作伙伴',
      path: 'pages/user/team-fazhan?id=' + abc + '&type_id=' + type_id + '&mf=' + mf,
      imageUrl:'http://www.juziyimei.com/bj.png',
      success: function (res) {
        // 分享成功
      },
      fail: function (res) {
        // 分享失败
      }
    }
  },
})