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
    shouquan: 0,
    content:'',
    lx_info: ['医疗美容','生活美容'],
    fandain_info: [
      '15%', '16%', '17%', '18%', '19%', '20%', '21%', '22%', '23%', '24%', '25%', '26%', '27%', '28%', '29%', '30%',
      '31%', '32%', '33%', '34%', '35%', '36%', '37%', '38%', '39%', '40%', '41%', '42%', '43%', '44%', '45%', '46%',
      '47%', '48%', '49%', '50%', '51%', '52%', '53%', '54%', '55%', '56%', '57%', '58%', '59%', '60%', '61%', '62%',
      '63%', '64%', '65%', '66%', '67%', '68%', '69%', '70%', '71%', '72%', '73%', '74%', '75%', '76%', '77%', '78%', '79%', '80%'
      ],
    fandian:'',//从0开始对应15%，最高到80%
    lx:9,//0为医疗美容，1为生活美容
    shenqing_id:'',//申请id,其实就是brand_id
    images: [],
    images_one:[],//单张单独上传
    images_px:[1,0,0,0,0,0],//图片加载排序
    images_up: [0, 0, 0, 0, 0, 0],//需要进行上传的图片判断，0为没动，1为有新增上传图片，2为删除图片
    jindu:1,//进度情况，1为第一步，2为第二步，3为已提交申请
    off: 1,//按钮防点击开关
    djs: 0//发送倒计时60秒
  },

  /*授权登录start */
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
  /*授权登录end */
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
  bindPickerChange2:function(e){//类型
    this.setData({
      lx: e.detail.value,
    })
    console.log(e.detail.value)
  },
  bindPickerChange3: function (e) {//返点
    this.setData({
      fandian: e.detail.value,
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
    if(anran_id > 0){
      that.setData({
        anran_id: anran_id,
        id:options.id,//医院id
        shouquan:999
      });
    }
    if (wx.getStorageSync('id') == '') {//如果缓存里面没有id，那就弹授权
      that.setData({
        shouquan: 0,
      });
    }
    this.loading();
  },
  
  loading:function(e){
    var that = this;
    wx.request({//加载该用户申请过的记录
      url: app.d.anranUrl + '/index.php?m=default&c=indem&a=hezuo_info',
      method: 'post',
      data: {
        user_id: wx.getStorageSync('id'),
        id:this.data.id
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
       that.setData({
         money: res.data.money,
         state:res.data.states,
         info:res.data.info
       }) 
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
    var lx = this.data.lx;
    var jigou_name = e.detail.value.jigou_name;
    var address = e.detail.value.address;
    var user_name = e.detail.value.user_name;
    var phone = e.detail.value.phone;
    var fandian = this.data.fandian;
    var jieshao = e.detail.value.jieshao;
    console.log('机构：', jigou_name)
    console.log('地址：', address)
    console.log('联系人：', user_name)
    console.log('手机：', phone)
    console.log('介绍：', jieshao)

    if (jigou_name == '') {
      wx.showToast({
        title: '到院时间没有填',
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
        url: app.d.anranUrl + '/index.php?m=default&c=indem&a=shenqing_hezuo',
        method: 'post',
        data: {
          jigou_name: jigou_name,
          user_name: user_name,
          phone: phone,
          user_id: wx.getStorageSync('id')
        },
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          // Console.log(res)
          if (res.data.state == 1) {//成功，下一步
            wx.showToast({
              title: '申请成功',
              duration: 2000
            });
          }
          if (res.data.state == 2) {//重复
            wx.showToast({
              title: '您已经提交过申请了',
              icon: 'none',
              duration: 2000
            });
          }
          if (res.data.state == 99) {//未授权
            wx.showToast({
              title: '您还未授权登录桔子小程序',
              icon:'none',
              duration: 2000
            });
            that.loading();
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

  up_img: function (key) {//上传图片
  var that = this;
      const arr = []
      var id = this.data.shenqing_id;
      //var images = this.data.images_one;//判断需要上传的图片有哪几个
    for (let path of this.data.images_one) {
        arr.push(wxUploadFile({
          url: app.d.anranUrl + '/index.php?m=default&c=indem&a=save_zizhi',
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
        that.loading();
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
  /*  wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: res => {
       const images = this.data.images.splice(e.currentTarget.dataset.px,1,res.tempFilePaths[0])
       // this.data.images = images.length <= 6 ? images : images.slice(0, 6)
        $digest(this)
        this.data.images_px.splice(e.currentTarget.dataset.px,1,1)//修改显示图片排序
        this.data.images_up.splice(e.currentTarget.dataset.px,1,1)//修改动了那些图片，表示要上传
        this.setData({
          images_px:this.data.images_px,
          images: this.data.images,
        })
      }
    })*/
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
  next:function(){
    var that = this;

    wx.request({//加载该用户申请过的记录
      url: app.d.anranUrl + '/index.php?m=default&c=indem&a=shenqing_zizhi',
      method: 'post',
      data: {
        shenqing_id: this.data.shenqing_id,
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        if(res.data.state == 1){
          wx.showToast({
            title: '未上传营业执照',
            icon:'none',
            duration: 2000
          });
        }  else if (res.data.state == 3) {
          wx.showToast({
            title: '未上传门店招牌',
            icon: 'none',
            duration: 2000
          });
        } else if (res.data.state == 9) {
          wx.showToast({
            title: '申请成功',
            duration: 2000
          });
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