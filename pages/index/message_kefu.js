// pages/index/message_kefu.js
var app = getApp();
import { promisify } from '../../utils/promise.util'
import { $init, $digest } from '../../utils/common.util'
//import { createQuestion } from '../../services/question.service'
import config from '../../config'
const wxUploadFile = promisify(wx.uploadFile)
Page({

  /**
   * 页面的初始数据
   */
  data: {
    message_info:[],
    brand_info:[],
    top: 0,
    last_kid:0,//初次加载进来的最后一条消息，用于判断是否有新消息,0为初始值
    padding_bottom:'2%',
    input_content:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    $init(this)
    this.setData({
      open_id: options.open_id,
      brand_id: options.brand_id,
    })
    this.loading();
    this.check_new_message();
    /*获取设备型号 */
    wx.getSystemInfo({
      success: function (res) {
        //model中包含着设备信息
        var model = res.model
        if (model.search('iPhone X') != -1) {
          app.globalData.isIpx = true;
          that.setData({
            padding_bottom: '10%'
          })
        } else {
          app.globalData.isIpx = false;
          that.setData({
            padding_bottom: '2%'
          })
        }
      }
    })
  },
  bindscroll: function (e) {
    // let query = wx.createSelectorQuery()
   
    console.log(111);
    console.log(e.detail.scrollTop);
  },
  gundong:function(){
    this.setData({
      top:99999
    })
    console.log(this.data.top)
  },
  big_img(e) {//点击显示大图

    const current = e.target.dataset.img
    wx.previewImage({
      current: current,
      urls: current.split()
    })
  },
loading:function(e){
  var that = this;
  var brand_id = this.data.brand_id;
  var open_id = this.data.open_id;
  wx.request({
    url: app.d.anranUrl + '/index.php?m=default&c=indem&a=message_info',
    method: 'post',
    data: {
      user_id: wx.getStorageSync('id'),
      open_id: open_id,
      brand_id: brand_id
    },
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    success: function (res) {
        that.setData({
          message_info:res.data.message_info,
          brand_info: res.data.brand_info,
         // last_kid:res.data.message_info[res.data.message_info.length - 1].kid,
          top:99999
        })
      that.gundong();
      console.log(that.data.last_kid);
    },
    error: function (e) {
      wx.showToast({
        title: '网络异常！',
        duration: 2000
      });
    }
  });
},
input:function(e){
  const value = e.detail.value
  this.setData({
    input_content: e.detail.value
  })
},

check_new_message(){//检查有没有新的消息
  var that = this;
  var open_id = this.data.open_id;
  that.setData({
    timer: setInterval(function () {//这里把setInterval赋值给变量名为timer的变量
    //开始检查是否有新的消息

      that.loading();
    
    }, 3000)//每三秒检查一次
  })
},
send_message:function(e){
  var that = this;
  var input_content = this.data.input_content;
  var brand_id = this.data.brand_id;
  var open_id = this.data.open_id;
  wx.showLoading();//加载动画
  wx.request({
    url: app.d.anranUrl + '/index.php?m=default&c=indem&a=xcx_send_message',
    method: 'post',
    data: {
      user_id: wx.getStorageSync('id'),
      input_content: input_content,
      brand_id: brand_id,
      open_id: open_id
    },
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    success: function (res) {
      that.setData({
        input_content:''
      })
      that.loading();
      wx.hideLoading()//关闭加载动画
    },
    error: function (e) {
      wx.showToast({
        title: '网络异常！',
        duration: 2000
      });
    }
  });
},

/*上传并发送图片 */
  chooseImage(e) {
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: res => {
        const images_one = res.tempFilePaths;
        this.data.images_one = images_one.length <= 1 ? images_one : images_one.slice(0, 1)
        $digest(this)
        this.setData({
          images_one: res.tempFilePaths
        })
        //console.log(images_one)
        that.up_img(e.currentTarget.dataset.idx);
        console.log('测试')
      }
    })
  },
  /*上传logo*/
  up_img: function (key) {
    var that = this;
    const arr = []
    var id = that.data.brand_id;
    var order_type = this.data.currentTab;
    for (let path of this.data.images_one) {
      arr.push(wxUploadFile({
        url: app.d.anranUrl + '/index.php?m=default&c=indem&a=save_message_img',
        filePath: path,
        name: 'file',
        formData: {
          user_id: wx.getStorageSync('id'),
          open_id: that.data.open_id,
          brand_id: id,
        },
      }))
console.log(that.data.open_id)
    }

    wx.showLoading({
      title: '正在创建...',
      mask: true
    })

    Promise.all(arr).then(res => {
      var that = this;
      wx.showToast({
        title: '上传成功！',
        duration: 2000
      });
      that.loading();
      wx.hideLoading()
    }).catch(err => {
      console.log(">>>> upload images error:", err)
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
    clearInterval(this.data.timer);//关闭定时器
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