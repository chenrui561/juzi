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
    name: '',//输入的名字
    yzm: '',
    yy: '',//需要提交的医院
    xm: '',
    tid:'',
    dy_time: '',
    goods_id: [],//项目对应的id数组
    tj_goods_id: '',//提交的项目id
    yiyuan: ['美国', '中国', '巴西', '日本'],
    yiyuan_index: '',//医院序号
    yiyuan_id: [],//医院对应的ID
    xiangmu: [],
    xiangmu_index: '',//项目序号
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var tid = options.tid;
    this.setData({
      tid: tid
    })
    console.log(tid);
    
    this.yiyuan_load();

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

  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      yiyuan_index: e.detail.value
    })
    var that = this;
    var yiyuan_id = that.data.yiyuan_id[e.detail.value];
    wx.showLoading();//加载动画
    wx.request({
      url: app.d.anranUrl + '/index.php?m=default&c=indem&a=xcx_xiangmu',
      method: 'post',
      data: {
        yiyuan_id: yiyuan_id
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        that.setData({
          xiangmu: res.data.xiangmu,
          goods_id: res.data.goods_id
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
  bindPickerChange2: function (e) {//选择项目

    this.setData({
      xiangmu_index: e.detail.value,
      tj_goods_id: this.data.goods_id[e.detail.value]
    })
    console.log('测试', this.data.goods_id[e.detail.value])
  },
  yiyuan_load: function (e) {
    var that = this;
    wx.showLoading();//加载动画
    wx.request({
      url: app.d.anranUrl + '/index.php?m=default&c=indem&a=xcx_yiyuan',
      method: 'post',
      data: {
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
  xuanze: function (e) {
    // console.log('form发生了submit事件，携带数据为：', e.detail.value)
    var that = this;
    var tj_goods_id = that.data.tj_goods_id;
    var tid = that.data.tid;
    if (tj_goods_id > 0){//如果存在选择的项目id
      let pages = getCurrentPages();//当前页面
      let prevPage = pages[pages.length - 2];//上一页面
      prevPage.setData({//直接给上移页面赋值
        new_goods_id: tj_goods_id
      });
      wx.navigateBack()
      
    }else{
      wx.showToast({
        title: '请选择项目',
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