// pages/user/bd.js
import { promisify } from '../../utils/promise.util'
import { $init, $digest } from '../../utils/common.util'
//import { createQuestion } from '../../services/question.service'
import config from '../../config'
const wxUploadFile = promisify(wx.uploadFile)
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    anran_id: 1,
    info: [],
    bd_type: 1,  //默认为0，没有绑定过
    bd_name: '',
    input_mobile: '',//输入的手机号
    yzm: '',
    xieyi: '',
    content:'',
    shenqing_id:'',//申请id
    images: [],
    jindu:1,//进度情况，1为第一步，2为第二步，3为已提交申请
    off: 1,//按钮防点击开关
    djs: 0//发送倒计时60秒
  },

  shang1:function(){
    this.setData({
      jindu:1 
    })
  },
  shang2: function () {
    this.setData({
      jindu: 2
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    $init(this)
    var that = this;
    var anran_id = wx.getStorageSync('id');
    var bd_type = that.data.bd_type;
    that.setData({
      anran_id: anran_id,
    });

    wx.request({//加载该用户申请过的记录
      url: app.d.anranUrl + '/index.php?m=default&c=indem&a=shenqing_info',
      method: 'post',
      data: {
        user_id: wx.getStorageSync('id')
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var info = res.data.shenqing_info[0];
        that.setData({
          info: info,
          images: res.data.img
        });
        if (res.data.img.length > 0){
          that.setData({
            jindu:2
          })
        }
      },
      fail: function (e) {
        wx.showToast({
          title: '网络异常',
          duration: 2000
        });
      },
    });

  },
  xieyi: function (e) {
    this.setData({
      xieyi: e.detail.value
    })
    console.log(e.detail.value)
  },
  xiugai: function (e) {
    this.setData({
      bd_type: 0
    })
  },
  input_mobile: function (e) {
    this.setData({
      input_mobile: e.detail.value
    })

  },
  formSubmit: function (e) {
    // console.log('form发生了submit事件，携带数据为：', e.detail.value)
    var that = this;
    var xieyi = this.data.xieyi;
    var jigou_name = e.detail.value.jigou_name;
    var address = e.detail.value.address;
    var user_name = e.detail.value.user_name;
    var phone = e.detail.value.phone;
    var jieshao = e.detail.value.jieshao;
    console.log('机构：', jigou_name)
    console.log('地址：', address)
    console.log('联系人：', user_name)
    console.log('手机：', phone)
    console.log('介绍：', jieshao)
    if (xieyi == '') {
      wx.showToast({
        title: '您还未同意注册协议',
        icon: 'none',
        duration: 2000
      });
      return false;
    }
    if (jigou_name == '') {
      wx.showToast({
        title: '医院/机构不能为空！',
        icon: 'none',
        duration: 2000
      });
      return false;
    }
    if (address == '') {
      wx.showToast({
        title: '地址不能为空！',
        icon: 'none',
        duration: 2000
      });
      return false;
    }
    if (user_name == '') {
      wx.showToast({
        title: '联系人姓名不能为空！',
        icon: 'none',
        duration: 2000
      });
      return false;
    }
    if (phone == '') {
      wx.showToast({
        title: '手机号不能为空！',
        icon: 'none',
        duration: 2000
      });
      return false;
    }
      wx.request({//第一步先上传
        url: app.d.anranUrl + '/index.php?m=default&c=indem&a=shenqing_ruzhu',
        method: 'post',
        data: {
          jigou_name: jigou_name,
          address: address,
          user_name: user_name,
          phone: phone,
          jieshao: jieshao,
          user_id: wx.getStorageSync('id')
        },
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          // Console.log(res)
          if (res.data.state == 1) {//成功，下一步
            that.setData({
              jindu:2,
              shenqing_id:res.data.id
            })
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

  up_img: function () {//上传图片
      const arr = []
      var key = 1;
      var id = this.data.shenqing_id;
      for (let path of this.data.images) {
        console.log('key' + key);
        arr.push(wxUploadFile({
          url: app.d.anranUrl + '/index.php?m=default&c=indem&a=save_zizhi',
          filePath: path,
          name: 'file',
          formData: {
            user_id: wx.getStorageSync('id'),
            id: id,
            key: key++
          },
        }))
      }

      wx.showLoading({
        title: '正在创建...',
        mask: true
      })

      Promise.all(arr).then(res => {
        var that = this;
        console.log('返回成功')
        that.setData({
          off: 1
        })
        wx.showToast({
          title: '提交成功，等待审核',
          duration: 2000
        });
        wx.hideLoading()
      }).catch(err => {
        console.log(">>>> upload images error:", err)
      })
    
  },
  test:function(){
    console.log(this.data.images)
  },

  chooseImage(e) {
    wx.chooseImage({
      count: 3,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: res => {
        const images = this.data.images.concat(res.tempFilePaths)
        this.data.images = images.length <= 3 ? images : images.slice(0, 3)
        $digest(this)
        console.log(res)
        console.log('images' + this.data.images)
      }
    })
  },
  removeImage(e) {
    const idx = e.currentTarget.dataset.idx
    this.data.images.splice(idx, 1)
    $digest(this)
  },

  handleImagePreview(e) {
    const idx = e.currentTarget.dataset.idx
    const images = this.data.images

    wx.previewImage({
      current: images[idx],
      urls: images,
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