var app = getApp();
// pages/order/detail.js
Page({
  data:{
    orderId:0,
    orderData:{},
    proData:[],
    fanli:[],
    user_info:[],
    genjin_info:[],
    user_lei:'',
    gj_user_id:'',//跟进的用户id
    log_id:'',
    y_states:'', //原来的跟进状态
    new_states:'',//新的跟进状态
    price_change:0 //价格编辑状态,0为不可编辑，1为可编辑
  },
  onLoad:function(options){
    this.setData({
      orderId: options.orderId,
      user_lei: wx.getStorageSync('user_lei'),
      HeadUrl: wx.getStorageSync('HeadUrl'),
      gj_user_id: options.id
    })
    this.loadProductDetail();
  },
  price_change:function(){
    this.setData({
      price_change:1
    })
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
      url: app.d.anranUrl + '/index.php?m=default&c=indem&a=xcx_user_genjin',
      method: 'post',
      data: {
        content: that.data.searchValue,
        user_id: wx.getStorageSync('id'),//提交人信息
        gj_user_id: that.data.gj_user_id
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
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
    var that = this;
    wx.request({
      url: app.d.anranUrl + '/index.php?m=default&c=indem&a=xcx_genjin_user_states',
      method: 'post',
      data: {
        user_id: wx.getStorageSync('id'),//提交人信息
        gj_user_id: that.data.gj_user_id,
        y_states: that.data.y_states,
        new_states: e.detail.value,
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
  loadProductDetail:function(){
    var that = this;
    wx.request({
      url: app.d.anranUrl + '/index.php?m=default&c=indem&a=xcx_get_user_info2',
      method:'post',
      data: {
        id: that.data.gj_user_id,
      },
      header: {
        'Content-Type':  'application/x-www-form-urlencoded'
      },
      success: function (res) {
          that.setData({
            user_info: res.data.user_info,
            genjin_info: res.data.genjin_info,
            states_array: res.data.states_array,
            states_name_array: res.data.states_name_array,
            y_states: res.data.user_info[0].gj_states  //原来的跟进状态
          });
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