var app = getApp();
function getRandomColor() {
  const rgb = []
  for (let i = 0; i < 3; ++i) {
    let color = Math.floor(Math.random() * 256).toString(16)
    color = color.length == 1 ? '0' + color : color
    rgb.push(color)
  }
  return '#' + rgb.join('')
}

Page({
  onReady: function (res) {
    this.videoContext = wx.createVideoContext('myVideo')
  },
  inputValue: '',
  data: {
    src: '',
    id:'',
    states:0,
    /*danmuList:
      [{
        text: '第 1s 出现的弹幕',
        color: '#ff0000',
        time: 1
      },
      {
        text: '第 3s 出现的弹幕',
        color: '#ff00ff',
        time: 3
      }]*/
  },
  /**
    * 用户点击右上角分享
    */
  onShareAppMessage: function () {
    var abc = wx.getStorageSync('id');
    var name = wx.getStorageSync('NickName');
    var title = this.data.title;
    var id = this.data.id;
    return {
      title:  title,
      path: '/pages/video/index?id=' + id + '&bd_id=' + abc,
      success: function (res) {
       
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
    this.setData({
      id:options.id
    })
    var that = this;
    var search = this.data.search;
    wx.request({
      url: app.d.anranUrl + '/index.php?m=default&c=indem&a=xcx_video_info',
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
          src: res.data.audio_info[0].url,
          title: res.data.audio_info[0].name,
          fff: res.data.fff
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
  bindplay_states:function(e){
    this.setData({
      states:1 //表示播放中
    })
  },
  bindpause_states: function (e) {
    this.setData({
      states: 0 //表示暂停中
    })
  },
  bindInputBlur: function (e) {
    this.inputValue = e.detail.value
  },
  bindSendDanmu: function () {//发送弹幕
    this.videoContext.sendDanmu({
      text: this.inputValue,
      color: getRandomColor()
    })
  },
  bindPlay: function () {
    this.videoContext.play()
  },
  bindPause: function () {
    this.videoContext.pause()
  },
  videoErrorCallback: function (e) {
    console.log('视频错误信息:')
    console.log(e.detail.errMsg)
  }
})
