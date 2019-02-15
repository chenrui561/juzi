// pages/user/tixian.js
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
  formSubmit:function(e){
    var that = this;
    var cash = e.detail.value.cash;
    var zhifubao = e.detail.value.zhifubao;
    var rel_name = e.detail.value.rel_name;
    if (cash == ''){
      wx.showToast({
        title: '请输入金额',
        icon:'none',
        duration: 2000
      });
      return;
}
    if (zhifubao == '') {
      wx.showToast({
        title: '请输入支付宝账号',
        icon: 'none',
        duration: 2000
      });
      return;
    }
    if (rel_name == '') {
      wx.showToast({
        title: '请输入实名',
        icon: 'none',
        duration: 2000
      });
      return;
    }



    wx.showModal({//弹窗
      content: "确定提现",
      showCancel: true,
      confirmText: '确定',
      success: function (res) {
        if (res.cancel) {//点击了取消，去首页
        console.log(88);
        }
        if (res.confirm) {//点击了确定，去绑定
          wx.showLoading();//加载动画
          wx.request({
            url: 'https://www.juziyimei.com/mobile/index.php?m=default&c=indem&a=tixian',
            method: 'POST',
            data: {
              cash: cash,
              zhifubao: zhifubao,
              rel_name: rel_name,
              user_id:wx.getStorageSync('id')
            },
            header: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
              console.log(res)
                if(res.data.state == 1){
                  wx.showToast({
                    title: '申请提现成功！',
                    duration: 2000
                  });
                  setTimeout(function () {//延时2秒
                    wx.navigateBack({
                    })
                  }, 2000)
                  
                }else if (res.data.state == 2) {
                wx.showToast({
                  title: '余额不足',
                  icon:'none',
                  duration: 2000
                });
              }
              wx.hideLoading()//关闭加载动画
            },
            fail: function (e) {
              wx.showToast({
                title: '网络异常！',
                duration: 2000
              });
            }
          })
        }
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