// pages/up_anli/down.js
var app = getApp();
let col1H = 0;
let col2H = 0;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    scrollH: 0,//瀑布流开始
    imgWidth: 0,
    loadingCount: 0,
    images: [],
    page: 1,
    col1: [],
    col2: [],//瀑布流结束
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    /*瀑布流部分开始 */
    wx.getSystemInfo({
      success: (res) => {
        let ww = res.windowWidth;
        let wh = res.windowHeight;
        let imgWidth = ww * 0.48;
        let scrollH = wh;

        this.setData({
          scrollH: scrollH,
          imgWidth: imgWidth
        });

        this.loadImages();
      }
    })
    /*瀑布流部分结束 */
  },
  /*瀑布流js开始 */
  onImageLoad: function (e) {
    let imageId = e.currentTarget.id;
    let oImgW = e.detail.width;         //图片原始宽度
    let oImgH = e.detail.height;        //图片原始高度
    let imgWidth = this.data.imgWidth;  //图片设置的宽度
    let scale = imgWidth / oImgW;        //比例计算
    let imgHeight = oImgH * scale;      //自适应高度

    let images = this.data.images;
    let imageObj = null;
    for (let i = 0; i < images.length; i++) {
      let img = images[i];
      if (img.id === imageId) {
        imageObj = img;
        break;
      }
    }

    imageObj.height = imgHeight;

    let loadingCount = this.data.loadingCount - 1;
    let col1 = this.data.col1;
    let col2 = this.data.col2;

    if (col1H <= col2H) {
      col1H += imgHeight;
      col1.push(imageObj);
    } else {
      col2H += imgHeight;
      col2.push(imageObj);
    }

    let data = {
      loadingCount: loadingCount,
      col1: col1,
      col2: col2
    };

    if (!loadingCount) {
      data.images = [];
    }

    this.setData(data);
  },

  loadImages: function () {
    var that = this;
    var page = that.data.page;
    wx.showLoading();//加载动画 
    wx.request({
      url: app.d.anranUrl + '/index.php?m=default&c=indem&a=get_shaidan_shenhe',
      method: 'post',
      data: {
        id: wx.getStorageSync('id'),
        page: page
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var shaidan = res.data.comments;

        that.setData({
          loadingCount: shaidan.length,
          images: shaidan,
          count_gs: res.data.count_gs,
          count_s: res.data.count_s,
          all:res.data.all,
          yonghu: res.data.yonghu,
          page: page + 1,
        });

        //endInitData
        wx.hideLoading()//关闭加载动画
      },
      fail: function (e) {
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      },
    });
    /*let images = [
      { pic: "../../images/1.png", height: 0 },
      { pic: "../../images/2.png", height: 0 },
      { pic: "../../images/3.png", height: 0 },
      { pic: "../../images/4.png", height: 0 },
      { pic: "../../images/5.png", height: 0 },
      { pic: "../../images/6.png", height: 0 },
      { pic: "../../images/7.png", height: 0 },
      { pic: "../../images/8.png", height: 0 },
      { pic: "../../images/9.png", height: 0 },
      { pic: "../../images/10.png", height: 0 },
      { pic: "../../images/11.png", height: 0 },
      { pic: "../../images/12.png", height: 0 },
      { pic: "../../images/13.png", height: 0 },
      { pic: "../../images/14.png", height: 0 }
    ];

    let baseId = "img-" + (+new Date());

    for (let i = 0; i < images.length; i++) {
      images[i].id = baseId + "-" + i;
    }

    this.setData({
      loadingCount: images.length,
      images: images
    });*/
  },
  /*瀑布流js结束 */
  
  /*保存图片到本地 */
  saveImage: function (e) {

    wx.downloadFile({

      url: 服务器Http请求 + 图片路径,

      success: function (res) {

        var imageFilePath = res.tempFilePath;

        if (!util.isNull(imageFilePath)) {

          wx.saveImageToPhotosAlbum({

            filePath: imageFilePath,

            success: function (data) {

              wx.showToast({

                title: "保存成功",

              })

            }, fail: function (res) {

              wx.showToast({

                title: "保存失败",

              })

            }

          })

        }

      },

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