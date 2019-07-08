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
    goods_id:0,//如果大于0就表示编辑商品
    xieyi: '',
    content:'',
    lx_info: ['公开','不公开'],
    lx:9,//0为公开，1为不公开
    shenqing_id:'',//申请id,其实就是brand_id
    images: ['',''],
    images01:'',//头图
    images02: '',//详情图
    images_one:[],//单张单独上传
    images_px:[1,0],//图片加载排序
    images_up: [0, 0],//需要进行上传的图片判断，0为没动，1为有新增上传图片，2为删除图片
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
  bindPickerChange2:function(e){
    this.setData({
      lx: e.detail.value,
    })
    console.log(e.detail.value)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    $init(this)
    var that = this;
    var anran_id = wx.getStorageSync('id');
    var bd_type = that.data.bd_type;
    var goods_id = options.goods_id;
    that.setData({
      anran_id: anran_id,
      goods_id: goods_id
    });
    if (goods_id > 0){
      this.loading_goods_info();
    }
   
   // this.loading();
  },
  loading:function(e){
    var that = this;
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
          images: res.data.img,
          shenqing_id: info.brand_id
        });
        if(info.off == 0){
          if (res.data.img.length > 0) {
            that.setData({
              jindu: 2
            })
          }
        }
        if (info.off == 2) {//用户已提交申请
            that.setData({
              jindu: 3
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
  loading_goods_info:function(e){
    var that = this;
      var goods_id = this.data.goods_id;
    wx.showLoading();//加载动画 
    wx.request({//第一步先上传
      url: app.d.anranUrl + '/index.php?m=default&c=indem&a=xcx_loading_goods',
      method: 'post',
      data: {
        goods_id: goods_id,
        user_id: wx.getStorageSync('id')
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        that.setData({
          name:res.data.goods_info[0].goods_name,
          youhuijia: res.data.goods_info[0].juzi_price,
          yuanjia: res.data.goods_info[0].juzi_price,
          lx: res.data.goods_info[0].off,
          fandian: res.data.goods_info[0].fandian,
          images01: res.data.goods_info[0].goods_img,
          images02: res.data.goods_info[0].goods_desc_img,
          'images[0]': res.data.goods_info[0].goods_img,
          'images[1]': res.data.goods_info[0].goods_desc_img,
        })
        console.log(res.data)
        wx.hideLoading()//关闭加载动画
      },
      fail: function (e) {
        wx.showToast({
          title: '网络异常！',
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
  formSubmit: function (e) {//提交
    // console.log('form发生了submit事件，携带数据为：', e.detail.value)
    var that = this;
    var goods_id = this.data.goods_id;
    var lx = this.data.lx;
    var name = e.detail.value.name;
    var youhuijia = e.detail.value.youhuijia;
    var yuanjia = e.detail.value.yuanjia;
    var fandian = e.detail.value.fandian;
    if(goods_id > 0){
      if (lx == 9) {
        wx.showToast({
          title: '您还未选择类型',
          icon: 'none',
          duration: 2000
        });
        return false;
      }
      if (name == '') {
        wx.showToast({
          title: '优惠名称不能为空',
          icon: 'none',
          duration: 2000
        });
        return false;
      }
      if (youhuijia == '') {
        wx.showToast({
          title: '优惠价不能为空',
          icon: 'none',
          duration: 2000
        });
        return false;
      }
      if (yuanjia == '') {
        wx.showToast({
          title: '原价不能为空！',
          icon: 'none',
          duration: 2000
        });
        return false;
      }
      if (fandian == '') {
        wx.showToast({
          title: '返点金额不能为空！',
          icon: 'none',
          duration: 2000
        });
        return false;
      }
      if (this.data.images01 == '') {
        wx.showToast({
          title: '头图没有上传',
          icon: 'none',
          duration: 2000
        });
        return false;
      }
      if (this.data.images02 == '') {
        wx.showToast({
          title: '详情图图没有上传',
          icon: 'none',
          duration: 2000
        });
        return false;
      }
      wx.showModal({
        content: "确定修改？",
        showCancel: '不了',
        confirmText: '确定',
        success: function (res) {
          if (res.cancel) {//点击了取消，
          }
          if (res.confirm) {//点击了确定，去绑定
            wx.showLoading();//加载动画 
            wx.request({//第一步先上传
              url: app.d.anranUrl + '/index.php?m=default&c=indem&a=xiugai_goods',
              method: 'post',
              data: {
                goods_id: goods_id,
                name: name,
                youhuijia: youhuijia,
                yuanjia: yuanjia,
                fandian: fandian,
                images01: that.data.images01,
                images02: that.data.images02,
                lx: lx,
                user_id: wx.getStorageSync('id')
              },
              header: {
                'Content-Type': 'application/x-www-form-urlencoded'
              },
              success: function (res) {
                wx.navigateBack({
                })
                wx.hideLoading()//关闭加载动画
              },
              fail: function (e) {
                wx.showToast({
                  title: '网络异常！',
                  duration: 2000
                });
              },
            });
          }
        }
      })
    }else{
    if (lx == 9) {
      wx.showToast({
        title: '您还未选择类型',
        icon: 'none',
        duration: 2000
      });
      return false;
    }
    if (name == '') {
      wx.showToast({
        title: '优惠名称不能为空',
        icon: 'none',
        duration: 2000
      });
      return false;
    }
    if (youhuijia == '') {
      wx.showToast({
        title: '优惠价不能为空',
        icon: 'none',
        duration: 2000
      });
      return false;
    }
    if (yuanjia == '') {
      wx.showToast({
        title: '原价不能为空！',
        icon: 'none',
        duration: 2000
      });
      return false;
    }
    if (fandian == '') {
      wx.showToast({
        title: '返点金额不能为空！',
        icon: 'none',
        duration: 2000
      });
      return false;
    }
    if (this.data.images01 == '') {
      wx.showToast({
        title: '头图没有上传',
        icon: 'none',
        duration: 2000
      });
      return false;
    }
    if (this.data.images02 == '') {
      wx.showToast({
        title: '详情图图没有上传',
        icon: 'none',
        duration: 2000
      });
      return false;
    }
    wx.showModal({
      content: "确定提交？",
      showCancel: '不了',
      confirmText: '确定',
      success: function (res) {
        if (res.cancel) {//点击了取消，
        }
        if (res.confirm) {//点击了确定，去绑定
          wx.showLoading();//加载动画 
          wx.request({//第一步先上传
            url: app.d.anranUrl + '/index.php?m=default&c=indem&a=fabu_goods',
            method: 'post',
            data: {
              name: name,
              youhuijia: youhuijia,
              yuanjia: yuanjia,
              fandian: fandian,
              images01: that.data.images01,
              images02: that.data.images02,
              lx: lx,
              user_id: wx.getStorageSync('id')
            },
            header: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {

              wx.navigateBack({
              })
              wx.hideLoading()//关闭加载动画
            },
            fail: function (e) {
              wx.showToast({
                title: '网络异常！',
                duration: 2000
              });
            },
          });
        }
      }
    })
      
    }
  },

  up_img: function (key) {//上传图片
  var that = this;
      const arr = []
      var id = this.data.shenqing_id;
      //var images = this.data.images_one;//判断需要上传的图片有哪几个
    for (let path of this.data.images_one) {
        arr.push(wxUploadFile({
          url: app.d.anranUrl + '/index.php?m=default&c=indem&a=save_goods_img',
          filePath: path,
          name: 'file',
          formData: {
            user_id: wx.getStorageSync('id'),
            id: id,
            key: key
          },
        }))
        
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
        console.log(res[0].data)
        if(key == 0){//头图
          console.log(123)
          that.setData({
            'images[0]': res[0].data,
            images01: res[0].data,
          })
          console.log(that.data.images)
        }
        if (key == 1) {//详情图
          that.setData({
            'images[1]': res[0].data,
            images02: res[0].data,
          })
        }
        wx.hideLoading()
      }).catch(err => {
        console.log(">>>> upload images error:", err)
      })
    
  },
  test:function(){
    console.log(this.data.images_one)
  //  console.log(this.data.images_px.join("-"))
  },

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
        console.log(images_one)
        that.up_img(e.currentTarget.dataset.px);
        console.log('测试')
      }
    })
  },
  removeImage(e) {
    var  that = this;
    const idx = e.currentTarget.dataset.idx
    wx.request({//加载该用户申请过的记录
      url: app.d.anranUrl + '/index.php?m=default&c=indem&a=remove_zizhi',
      method: 'post',
      data: {
        shenqing_id: this.data.shenqing_id,
        idx: idx //删除第几个图
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        that.loading();
      },
      fail: function (e) {
        wx.showToast({
          title: '网络异常',
          duration: 2000
        });
      },
    });

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