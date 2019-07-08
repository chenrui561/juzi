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
    kefu:[],
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
   // this.loadProductDetail();
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
      url: app.d.anranUrl + '/index.php?m=default&c=indem&a=user_next_genjin_time_change',
      method: 'post',
      data: {
        change_user_id: that.data.gj_user_id,
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
  price_change:function(){
    this.setData({
      price_change:1
    })
  },
  phone_call:function(e){
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phone // 仅为示例，并非真实的电话号码
    })
    console.log(e.currentTarget.dataset.phone)
  },
 
  pl_del:function(e){
    var that = this;
    wx.showModal({//弹窗
      content: "确定删除？",
      showCancel: true,
      confirmText: '确定',
      success: function (res) {
        if (res.cancel) {//点击了取消
          console.log(88);
        }
        if (res.confirm) {//点击了确定
          wx.request({
            url: app.d.anranUrl + '/index.php?m=default&c=indem&a=pl_del',
            method: 'post',
            data: {
              id: e.currentTarget.dataset.aid,
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
  searchValueInput: function (e) {
    var value = e.detail.value;
    this.setData({
      searchValue: value,
    });

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
  change_kefu: function (e) {
    var that = this;
    wx.request({
      url: app.d.anranUrl + '/index.php?m=default&c=indem&a=xcx_change_kefu',
      method: 'post',
      data: {
        user_id: wx.getStorageSync('id'),//提交人信息
        gj_user_id: that.data.gj_user_id,
        kefu: e.detail.value,
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
  bindPickerChange2: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    var that = this;
    wx.request({
      url: app.d.anranUrl + '/index.php?m=default&c=indem&a=xcx_genjin_user_jibie',
      method: 'post',
      data: {
        user_id: wx.getStorageSync('id'),//提交人信息
        gj_user_id: that.data.gj_user_id,
        jibie: e.detail.value,
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
  bindPickerChange3: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    var that = this;
    wx.request({
      url: app.d.anranUrl + '/index.php?m=default&c=indem&a=xcx_change_genjin_lei',
      method: 'post',
      data: {
        user_id: wx.getStorageSync('id'),//提交人信息
        gj_user_id: that.data.gj_user_id,
        genjin_lei: e.detail.value,
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
  /**
 * 生命周期函数--监听页面显示
 */
  onShow: function () {
    this.loadProductDetail();
  },
  loadProductDetail:function(){
    var that = this;
    wx.request({
      url: app.d.anranUrl + '/index.php?m=default&c=indem&a=xcx_get_user_info2',
      method:'post',
      data: {
        id: that.data.gj_user_id,
        user_id: wx.getStorageSync('id')
      },
      header: {
        'Content-Type':  'application/x-www-form-urlencoded'
      },
      success: function (res) {
          that.setData({
            user_info: res.data.user_info,
            my_user_info: res.data.my_user_info,
            user_info2: res.data.user_info2,
            user_info3: res.data.user_info3,
            list_info: res.data.list_info,
            genjin_info: res.data.genjin_info,
            states_array: res.data.states_array,
            states_name_array: res.data.states_name_array,
            jibie_array: res.data.jibie_array,
            jibie_name_array: res.data.jibie_name_array,
            genjin_lei_array: res.data.genjin_lei_array,
            genjin_lei_name_array: res.data.genjin_lei_name_array,
            count_qd: res.data.count_qd,
            count_tj: res.data.count_tj,
            kefu:res.data.kefu,
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