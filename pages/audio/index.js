var app = getApp();
Page({
  data: {
    current: {
      poster: 'https://www.juziyimei.com/images/logo.png',
      name: '50-60岁客户3大营销特点',
      author: '老汤',
      src: 'https://www.juziyimei.com/audio/1.MP3',
    },
    src:'',
    url:'https://www.juziyimei.com/audio/28.MP3',
    author:'',
    name:'',
    poster:'',
    info:[],
    title:'',
    aid:'',
    id:'',
    play:'',
    animationData: {},
    audioAction: {
      method: 'pause'
    }
  },
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
  /**
    * 用户点击右上角分享
    */
  onShareAppMessage: function () {
    var abc = wx.getStorageSync('id');
    var name = wx.getStorageSync('NickName');
    var title= this.data.title;
    var id = this.data.id;
    return {
      title: name +'分享一段音频'+ title,
      path: '/pages/audio/index?id=' + id + '&bd_id=' + abc ,
      success: function (res) {
        // 分享成功
        wx.showModal({
          title: '分享成功！',
          content: '好友授权登录后您就可在此页面领取礼品',
          showCancel: false,
          confirmText: '好的',
          success: function (res) {
          }
        })
      },
      fail: function (res) {
        // 分享失败
      }
    }
  },
  /**
 * 生命周期函数--监听页面加载
 */
  onLoad: function (options) {
    var that = this;
   
    wx.showLoading();//加载动画
    var id = options.id;//音频id
    var bd_id = options.bd_id;//获取转发时携带的转发用户的id
    var anran_id = wx.getStorageSync('id');//去取缓存里面的id，因为第二次调用的时候，app.js没执行，只能去缓存拿id
    var that = this;
    this.setData({
      id:options.id
    })
    //判断是否是转发打开，如果是就执行绑定推荐方法

    if (bd_id > 0) {
      //将转发过来的ID，放入缓存中
      wx.setStorageSync('bd_id', bd_id)//把转发的人id写入缓存
      that.setData({
        bd_id: bd_id
      });
    }
    /* if (anran_id > 0) {
           this.user_info();
           wx.hideLoading()//关闭加载动画
       console.log(77)
        } else {//判断是否已经登录
        */
    wx.hideLoading()//关闭加载动画
    app.getOpenid().then(function (openid) {

      if (openid == 66) {
        that.setData({
          shouquan: 999
        });
        that.user_info();
        console.log(66)
      }
      if (openid == 88) {
        that.setData({
          shouquan: 0
        });
        that.user_info();
        console.log(88)
      }

    });
    this.setData({
      title:options.title,
      aid:options.id
    })
    wx.onBackgroundAudioPause(function(){//监听音乐暂停
      that.setData({
        play: ''
      })
 
    })
    wx.onBackgroundAudioPlay(function () {//监听音乐播放
      that.setData({
        play: 'music-on'
      })

    })


    wx.request({
      url: app.d.anranUrl + '/index.php?m=default&c=indem&a=xcx_audio_info',
      method: 'POST',
      data: {
        id: options.id
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        that.setData({
          info: res.data.audio_info[0],
          url: res.data.audio_info[0].url,
          title: res.data.audio_info[0].name,
          fff:res.data.fff
        });
        //更改头部标题
        wx.setNavigationBarTitle({
          title: res.data.audio_info[0].name,
          success: function () {
          },
        });
      },
    });
  },
})