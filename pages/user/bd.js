// pages/user/bd.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    anran_id: '',
    bd_type: 0,  //默认为0，没有绑定过
    bd_name:'',
    input_mobile:'',//输入的手机号
    yzm:'',
    djs:0//发送倒计时60秒
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var anran_id = app.d.anran_id
    var bd_type = that.data.bd_type;
    that.setData({
      anran_id: anran_id,
    });
    
    wx.request({//加载首页推荐商品
      url: app.d.anranUrl + '/index.php?m=default&c=indem&a=bd_app_info',
      method: 'post',
      data: {
        user_id: app.d.anran_id
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var state = res.data.state;
       // var bd_type = that.data.bd_type;
        console.log(state)
        if(res.data.state == 1){//表示有绑定过
        
          that.setData({
            bd_type: 1,
            bd_name: res.data.user_name
          });
        }else if (res.data.state == 2) {//表示没有绑定过
          that.setData({
            bd_type: 0,
            
          });
         
        }else{//错误提示

          wx.showToast({
            title: '系统错误！',
            duration: 2000
          });
        }

      },
      fail: function (e) {
        wx.showToast({
          title: '绑定失败！',
          duration: 2000
        });
      },
    });

  },
  back: function (e) {

    wx.navigateBack({
      
    })
  },
  input_mobile:function(e){
    this.setData({
      input_mobile: e.detail.value
    })
    
  },
  send_yzm:function(e){
    var that = this;
    var input_mobile = that.data.input_mobile;
    if (input_mobile > 10000000000){//验证手机号码正确,随便验证一下就好，位数正确就行了
    wx.request({//发送验证码
      url: app.d.anranUrl + '/index.php?m=default&c=sms&a=xcx_send_yzm',
      method: 'post',
      data: {
        mobile: input_mobile
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var yzm = res.data.yzm;
        //var that = this;
        if (yzm > 0) {//表示有收到验证码
          that.setData({
            yzm: yzm,
            djs:60  //设置倒计时
          });
        that.djs();
        }else {//错误提示
          wx.showToast({
            title: '验证码异常',
            duration: 2000
          });
        }

      },
      fail: function (e) {
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      },
    });
    }else{
      wx.showToast({
        title: '手机号错误',
        duration: 2000
      });

    }
  },
  djs:function(e){
    let that = this;
    let djs = that.data.djs;
    that.setData({
      timer: setInterval(function () {//这里把setInterval赋值给变量名为timer的变量
        //每隔一秒djs就减一，实现同步
        djs--;
        //然后把djs存进data，好让用户知道时间在倒计着
        that.setData({
          djs: djs
        })
        //在倒计时还未到0时，这中间可以做其他的事情，按项目需求来
        if (djs == 0) {
          //这里特别要注意，计时器是始终一直在走的，如果你的时间为0，那么就要关掉定时器！不然相当耗性能
          //因为timer是存在data里面的，所以在关掉时，也要在data里取出后再关闭
          clearInterval(that.data.timer);
          //关闭定时器之后，可作其他处理codes go here
        }
      }, 1000)
    })
  },
  formSubmit: function (e) {
   // console.log('form发生了submit事件，携带数据为：', e.detail.value)
    var that = this;
    var phone = e.detail.value.phone;
    var password = e.detail.value.password;
    var yzm = this.data.yzm;
    console.log('form发生了submit事件，携带数据为：', password)
    console.log('form发生了submit事件，携带数据为：', phone)
    if (phone == '' || password == ''){
      wx.showToast({
        title: '不能为空！',
        duration: 2000
      });
      return false;
    }
    if (password == yzm){//如果输入的验证码一致
      wx.request({//加载首页推荐商品
        url: app.d.anranUrl + '/index.php?m=default&c=indem&a=bd_mobile',
        method: 'post',
        data: {
          mobile: phone,
          yzm: password,
          xcx_user_id: wx.getStorageSync('id')
        },
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
        // Console.log(res)
          if(res.data.bd == 1){//绑定成功之后，如何切换到新的账号
            wx.showToast({
              title: '绑定成功！',
              duration: 2000
            });
          // wx.setStorageSync('id', data.anran_id)//把自己的id写入缓存
            wx.reLaunch({//绑定成功之后重新加载小程序，并回到首页
              url: '../index/index',
            })
          }
          if (res.data.bd == 2) {
            wx.showToast({
              title: '提交错误！',
              duration: 2000
            });
          }
          if (res.data.bd == 3) {
            wx.showToast({
              title: '手机号重复',
              duration: 2000
            });
          }

        },
        fail: function (e) {
          wx.showToast({
            title: '绑定失败！',
            duration: 2000
          });
        },
      });
    }else{
      wx.showToast({
        title: '验证码错误',
        duration: 2000
      });
    }
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
  
  }
})