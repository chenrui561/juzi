// pages/huodong/huodong.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bd_id:0,
    shouquan: 999,
    goods_info:[],
    xiangmu_type:1 //项目类型，默认为1，光电项目，2为储值卡项目
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
  change_xiangmu:function(){
    
    if (this.data.xiangmu_type == 1){
      this.setData({
        xiangmu_type:2
      })
      this.huodong_info();
    }else if (this.data.xiangmu_type == 2) {
      this.setData({
        xiangmu_type: 1
      })
      this.huodong_info();
    }

  },
  /*生成二维码 */
  qr: function (e) {
    var that = this;
    wx.showLoading();//加载动画 
    wx.request({
      url: app.d.anranUrl + '/index.php?m=default&c=indem&a=huodong_code',
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading();//加载动画
    var bd_id = options.id;//获取转发时携带的转发用户的id
    var anran_id = wx.getStorageSync('id');//去取缓存里面的id，因为第二次调用的时候，app.js没执行，只能去缓存拿id
    var that = this;
    if (options.xiangmu_type == 2){
      this.setData({
        xiangmu_type:2
      })
    }
    this.jianting_id();
    //判断是否是转发打开，如果是就执行绑定推荐方法

    if (bd_id > 0) {
      //将转发过来的ID，放入缓存中
      wx.setStorageSync('bd_id', bd_id)//把转发的人id写入缓存
      that.setData({
        bd_id: bd_id
      });
    }
   /* if (anran_id > 0) {
          this.user_info();
          wx.hideLoading()//关闭加载动画
      console.log(77)
       } else {//判断是否已经登录
       */
      wx.hideLoading()//关闭加载动画
      app.getOpenid().then(function (openid) {

        if (openid == 66) {
          that.setData({
            shouquan: 999
          });
          that.user_info();
          console.log(66)
        }
        if (openid == 88) {
          that.setData({
            shouquan: 0
          });
          that.user_info();
          console.log(88)
        }

      });
    //}
  },
jianting_id:function(e){//每隔三秒检测一下状态，知道缓存里面有id为止
  var that =this;
  console.log(123 + wx.getStorageSync('id'));
  if (wx.getStorageSync('id') == ''){
    console.log(456);
    setTimeout(function () {//延时10秒关闭弹出层
      console.log(789);
      that.user_info();
      that.huodong_info();
      that.jianting_id();
    }, 3000)
    
  }
},
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },
user_info:function(){
  var that = this;
  wx.request({
    url: app.d.anranUrl + '/index.php?m=default&c=indem&a=xcx_get_user_info',
    method: 'post',
    data: {
      id: wx.getStorageSync('id')
    },
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    success: function (res) {

      that.setData({
        t_user: res.data[0],
      });
    },
    error: function (e) {
      wx.showToast({
        title: '网络异常！',
        duration: 2000,
      });
    },
  });
},
  huodong_info: function () {
    var that = this;
    wx.request({
      url: app.d.anranUrl + '/index.php?m=default&c=indem&a=xcx_get_huodong_info',
      method: 'post',
      data: {
        id: wx.getStorageSync('id'),
        xiangmu_type:that.data.xiangmu_type
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        that.setData({
          goods_info: res.data.huodong_goods,
          count_user: res.data.count_user,
          hdsm: res.data.hdsm,
          fff:res.data.fff,
          card: res.data.card,
          card_info: res.data.card_info
        })
        console.log(res.data)
      },
      error: function (e) {
        wx.showToast({
          title: '网络异常！',
          duration: 2000,
        });
      },
    });
  },
  lingqu:function(e){
    var that = this;
    var bonus_type_id = e.currentTarget.dataset.bid;
    wx.request({
      url: app.d.anranUrl + '/index.php?m=default&c=indem&a=xcx_huodong_lingqu',
      method: 'post',
      data: {
        user_id: wx.getStorageSync('id'),
        bonus_type_id: bonus_type_id
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var states = res.data.state;
        if(states ==1){//提示已经发过了
          wx.showToast({
            title: '您已经领过该免单券了',
            icon:'none',
            duration: 2000
          });
          setTimeout(function () {//延时2秒关闭弹出层
            //延时跳转优惠券页面
            wx.navigateTo({//优惠券页面
              url: '../user/quan',
            })
          }, 2000)
        }
        if(states == 2){//提示不满足条件
          wx.showToast({
            title: '对不起，您邀请的人数还不足领取该免单券！',
            icon: 'none',
            duration: 2000
          });
        }

        if (states == 9) {//提示成功
          wx.showToast({
            title: '领取成功',
            duration: 2000
          });
          
          setTimeout(function () {//延时2秒关闭弹出层
            //延时跳转优惠券页面
            wx.navigateTo({//优惠券页面
              url: '../user/quan',
            })
          }, 2000)
        }
      },
      error: function (e) {
        wx.showToast({
          title: '网络异常！',
          duration: 2000,
        });
      },
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.user_info();
    this.huodong_info();
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
    this.user_info();
    this.huodong_info();
    wx.stopPullDownRefresh();//解决回弹问题
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
  ceshi:function(){
    console.log(Math.random().toString(10).substr(2, 2))
  },
  /**
   * 用户点击右上角分享
   */
  /*分享开始 */
  onShareAppMessage: function () {//
    var abc = wx.getStorageSync('id');
    var name = wx.getStorageSync('NickName');
    var rand_num = Math.random().toString(10).substr(2, 2);//生成小于100的随机数
    if (rand_num > 50){
      var fx_title = '【免费送】——1万元整形项目';
    }else{
      var fx_title = '【免费送】——1万元整形项目';
    }
    return {
      title: fx_title,
      path: '/pages/huodong/huodong?id=' + abc,
      success: function (res) {
        // 分享成功
        wx.showModal({
          title: '分享成功！',
          content: '好友授权登录后您就可在此页面领取礼品',
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
  },
})