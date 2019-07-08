// pages/user/bd.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    anran_id: '',
    bd_type: 0,  //默认为0，没有绑定过
    bd_name: '',
    input_mobile: '',//输入的手机号
    name:'',//输入的名字
    yzm: '',
    yy:'',//需要提交的医院
    xm:'',
    connect:'',//筛选医院的文本
    dy_time:'',
    xiangmu_id:'',
    xiangmu_info:[],
    huodong:['是','否'],
    is_huodong:2,//默认为2，未选，0，是，1，否
    goods_id:[],//项目对应的id数组
    tj_goods_id:'',//提交的项目id
    tj_yiyuan_id:'',//提交的医院id
    tj_yiyuan_name:'',
    yiyuan: ['美国', '中国', '巴西', '日本'],
    yiyuan_index: '',//医院序号
    yiyuan_id: [],//医院对应的ID
    xiangmu: [],
    xiangmu_index: ''//项目序号
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.yiyuan_id > 0){
      this.setData({
        tj_yiyuan_id: options.yiyuan_id,
        tj_yiyuan_name: options.yiyuan_name
      })

    }
    this.xcx_yiyuan();
  },
  xcx_yiyuan:function(e){
    var that = this;
    wx.showLoading();//加载动画
    wx.request({
      url: app.d.anranUrl + '/index.php?m=default&c=indem&a=xcx_yiyuan',
      method: 'post',
      data: {
        connect:this.data.connect
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        that.setData({
          yiyuan: res.data.yiyuan,
          yiyuan_id: res.data.yiyuan_id
        });
        //endInitData
        wx.hideLoading()//关闭加载动画
      },
      fail: function (e) {
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      }
    })
  },
  back: function (e) {

    wx.navigateBack({

    })
  },
  input_mobile: function (e) {
    this.setData({
      input_mobile: e.detail.value
    })

  },
  //日期选择器
  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      dy_time: e.detail.value
    })
  },
  bindPickerChange_huodong: function (e) {
    var that = this;
    this.setData({
      is_huodong: e.detail.value,
    })
    console.log('picker发送选择改变，携带值为', e.detail.value)
  },
  bindPickerChange: function (e) {
    var that = this;
    this.setData({
      yiyuan_index: e.detail.value,
      tj_yiyuan_id: that.data.yiyuan_id[e.detail.value]
    })
    
    var yiyuan_id = that.data.yiyuan_id[e.detail.value];
    console.log('picker发送选择改变，携带值为', yiyuan_id)
  },


  formSubmit: function (e) {
    // console.log('form发生了submit事件，携带数据为：', e.detail.value)
    var that = this;
    var phone = e.detail.value.phone;
    var name = e.detail.value.name;
    var bz = e.detail.value.bz;
    console.log('form发生了submit事件，携带数据为：', name)
    console.log('form发生了submit事件，携带数据为：', phone)
    if (this.data.is_huodong == 2) {
      wx.showToast({
        title: '请选择是否参加活动！',
        icon: 'none',
        duration: 2000
      });
      return false;
    } 
    if (name == '' || phone == '') {
      wx.showToast({
        title: '客户信息不能为空！',
        icon: 'none',
        duration: 2000
      });
      return false;
    }
    if (this.data.tj_yiyuan_id == ''){
      wx.showToast({
        title: '医院不能为空！',
        icon:'none',
        duration: 2000
      });
      return false;
    } 
    if (this.data.dy_time == '') {
      wx.showToast({
        title: '到院时间不能为空！',
        icon: 'none',
        duration: 2000
      });
      return false;
    } wx.showModal({//弹窗
      content: "确定提交？",
      showCancel: true,
      confirmText: '确定',
      success: function (res) {
        if (res.cancel) {//点击了取消，去首页
          console.log(88);
        }
        if (res.confirm) {//点击了确定，去支付
          wx.showLoading();//加载动画
          wx.request({//加载首页推荐商品
            url: app.d.anranUrl + '/index.php?m=default&c=indem&a=yuyue',
            method: 'post',
            data: {
              phone: phone,
              name: name,
              bz: bz,
              is_huodong: that.data.is_huodong,
              tj_yiyuan_id: that.data.tj_yiyuan_id,
              dy_time: that.data.dy_time,
              xcx_user_id: wx.getStorageSync('id')
            },
            header: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
              // Console.log(res)
              wx.hideLoading()//关闭加载动画
              if (res.data.status == 1) {//绑定成功之后，如何切换到新的账号
                wx.showToast({
                  title: '提交成功',
                  duration: 2000
                });
                setTimeout(function () {
                  wx.navigateTo({
                    url: '../user/dingdan?currentTab=1&otype=deliver',
                  });
                }, 1500);
              }
              if (res.data.status == 2) {//绑定成功之后，如何切换到新的账号
                wx.showToast({
                  title: '已被预约过了',
                  duration: 2000
                });

              }

            },
            fail: function (e) {
              wx.showToast({
                title: '提交失败！',
                duration: 2000
              });
            },
          });
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