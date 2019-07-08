// pages/user/user.js
import { promisify } from '../../utils/promise.util'
import { $init, $digest } from '../../utils/common.util'
//import { createQuestion } from '../../services/question.service'
import config from '../../config'
const wxUploadFile = promisify(wx.uploadFile)
var app = getApp()


Page( {
  data: {
    userInfo: {},
    u_info:{},
    cart_num:'',
    user_money:'',
    b_count:'',
    b_user_name:'',
    mobile_phone:'',
    count_my:'',
    shouquan:99,//授权
    zhaoshang_ctrl:99
  },
  onLoad: function () {
      this.loadOrderStatus();
  }, 
  copyText: function (e) {

    wx.setClipboardData({
      data: e.currentTarget.dataset.text,
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            wx.showToast({
              title: '已成功复制手机号',
              icon:'none'
            })
          }
        })
      }
    })
  },
  huancun:function(e){//清除缓存信息,并重新加载小程序
   // wx.setStorageSync('bd_id', '')//绑定成功后要把缓存的bd_id设置为空
    //wx.setStorageSync('gg_id', '')//绑定成功后要把缓存的bd_id设置为空
    //wx.setStorageSync('id', '')//把自己的id写入缓存
    //wx.setStorageSync('openid', '')//把自己的openid写入缓存
    //console.log(wx.getStorageSync('openid'));
    var that = this;
    wx.request({//加载首页推荐商品
      url: app.d.anranUrl + '/index.php?m=default&c=indem&a=huancun',
      method: 'post',
      data: {
        openid: wx.getStorageSync('openid'),
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        if(res.data.states == 1){//根据openid获取user_id成功
          wx.setStorageSync('id', res.data.user_id)
          wx.reLaunch({
            url: '../index/index',
          })
        }else{
          wx.showToast({
            title: '获取用户信息失败，请删除小程序后再重新关注！',
            icon:'none',
            duration: 2000
          });

        }
       
      },
      fail: function (e) {
        wx.showToast({
          title: '网络异常！',
          icon: 'none',
          duration: 2000
        });
      },
    })
    //根据缓存的openid，去获取用户的真实user_id
    
    
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onPullDownRefresh: function () {
    this.loadOrderStatus();
    wx.stopPullDownRefresh();//解决回弹问题
  },
  loadOrderStatus:function(){
    //获取用户订单数据
    wx.showLoading();//加载动画
    var that = this;
    wx.request({
      url: app.d.anranUrl + '/index.php?m=default&c=indem&a=xcx_user_info',
      method: 'post',
      data: {
        anran_id: wx.getStorageSync('id'),
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        //--init data        
        wx.hideLoading()//关闭加载动画
        var status = res.data.status;
        if (status == 1) {

          var u_info = res.data.user_info;
          var cart_info = res.data.cart_goods;
          var b_count = res.data.b_count;
          if (u_info.nick_name == '游客'){
            that.setData({
              shouquan: 0,
            });
          }
          if (u_info == null) {
            that.setData({
              b_user_name: 0,
            });
          } else {
            wx.setStorageSync('user_lei', res.data.user_info.user_lei)//把自己的用户类型写入缓存
            wx.setStorageSync('choujiang', res.data.user_info.choujiang)//判断弹窗是否出现
            that.setData({
              all_money: res.data.all_money,
              count_car: res.data.count_car,
              mobile_phone: u_info.mobile_phone,
              u_info: u_info,
              cart_num: cart_info.total_number,
              user_money: u_info.user_money,
              b_count: b_count,
              cdb: res.data.cdb,
              count_my: res.data.count_my,
              b_user_name: res.data.user_name,
              count1: res.data.count1,
              count2: res.data.count2,
              count3: res.data.count3,
              count4: res.data.count4,
              zhuanshu_phone: res.data.zhuanshu_phone,
              zhuanshu_kefu: res.data.zhuanshu_kefu,
              form_off: res.data.form_off,
              form_count: res.data.form_count,
              dian_info: res.data.dian_info,
              zhaoshang_ctrl: res.data.zhaoshang_ctrl
            });
          }
        } else {
          wx.showToast({
            title: '非法操作.',
            duration: 2000
          });
        }
      },
      error: function (e) {
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      }
    });
  },
  bindGetUserInfo: function (e) {
    var that = this;
    if (e.detail.userInfo) {
      //调用应用实例的方法获取全局数据
      app.getUserInfo(function (userInfo) {
        //更新数据
        that.setData({
          userInfo: userInfo,
          shouquan: 1,
          loadingHidden: true
        })
      });

      that.setData({//也要消掉弹窗，因为已经确认了授权了
        shouquan: 1,
      })
      //用户按了允许授权按钮
      /* wx.showModal({
         content: "授权成功，立即绑定手机号，享受桔子放心美的层层优惠吧！",
         showCancel: '不了',
         confirmText: '去绑定',
         success: function (res) {
          
 
         }
 
       })*/
    }
  },
  change_head:function(e){
    var that = this;
    wx.showModal({
      content: "是否修改头像",
      showCancel: '不了',
      confirmText: '修改',
      success: function (res) {
        if (res.cancel) {//点击了取消
        }
        if (res.confirm) {//点击了确定，去修改
          that.change();
        }
      }
    })
  },
  change:function(e){
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: res => {
        const images_one = res.tempFilePaths;
        this.data.images_one = images_one.length <= 1 ? images_one : images_one.slice(0, 1)
        //$digest(this)
        this.setData({
          images_one: res.tempFilePaths
        })
        console.log(images_one)
        that.up_img();
      }
    })
  },
  up_img: function (key) {//上传图片
    var that = this;
    const arr = []
    //var images = this.data.images_one;//判断需要上传的图片有哪几个
    for (let path of this.data.images_one) {
      arr.push(wxUploadFile({
        url: app.d.anranUrl + '/index.php?m=default&c=indem&a=change_head',
        filePath: path,
        name: 'file',
        formData: {
          user_id: wx.getStorageSync('id'),
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
      that.loadOrderStatus();
      wx.hideLoading()
    }).catch(err => {
      console.log(">>>> upload images error:", err)
    })

  },
  form_off:function(e){//通知开关
    console.log(e.detail.value);
    if(this.data.form_off == 1){
        var form_off = 0;
        this.setData({
          form_off: false
        })
    }else{
      var form_off = 1;
      this.setData({
        form_off: true
      })
    }
    var that = this;

    wx.request({//加载首页推荐商品
      url: app.d.anranUrl + '/index.php?m=default&c=indem&a=form_off',
      method: 'post',
      data: {
        form_off: form_off,
        id: wx.getStorageSync('id')
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
          that.setData({
            form_off:res.data.form_off
          })
      },
      fail: function (e) {
      },
    })
    this.setData({
      form_off:1
    })
  },
  formid: function (e) {
    let formId = e.detail.formId;
    var that = this;
    console.log('form发生了submit事件，推送码为：', formId)
    wx.request({//加载首页推荐商品
      url: app.d.anranUrl + '/index.php?m=default&c=indem&a=formid',
      method: 'post',
      data: {
        formid: formId,
        id: wx.getStorageSync('id')
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        that.setData({
          form_count:res.data
        })
      },
      fail: function (e) {
      },
    })
  },

  /*生成二维码 */
  qr: function (e) {
    var that = this;
    wx.showLoading();//加载动画 
    wx.request({
      url: app.d.anranUrl + '/index.php?m=default&c=indem&a=testcode',
      method: 'post',
      data: {
        anran_id: wx.getStorageSync('id'),
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        that.setData({
          qr_img: res.data.qr_img,
          qr_arr: res.data.qr_arr
        });

        wx.previewImage({
          current: res.data.qr_img,
          urls: res.data.qr_arr
        })
        wx.hideLoading()//关闭加载动画
      },
      error: function (e) {
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
        wx.hideLoading()//关闭加载动画
      }
    });
  },
  onShareAppMessage: function () {
    var abc = app.globalData.userInfo.id;
    console.log(abc);
    return {
      title: abc,
      path: '/pages/index/index?bd_id=' + abc,
      success: function (res) {
        // 分享成功
      },
      fail: function (res) {
        // 分享失败
      }
    }
  }
})