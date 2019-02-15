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
    page:1,
    user_lei:'',
    search:'',
    col1: [],
    lx_id:0,
    lx:[],
    col2: [],//瀑布流结束
  },

  removeImage:function(e){
    var that = this;
    wx.showLoading();//加载动画 
    wx.request({
      url: app.d.anranUrl + '/index.php?m=default&c=indem&a=remove_anli',
      method: 'post',
      data: {
        id: wx.getStorageSync('id'),
        aid: e.currentTarget.dataset.aid
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        that.setData({
          col1: [],
          col2: [],
          page:1
        })

        that.loadImages();//按照分类加载
        
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
  },
  searchValueInput:function(e){
    console.log(e.detail.value)
    this.setData({
      search: e.detail.value
    })
  },
  doSearch:function(e){
    this.setData({
      col1: [],
      col2: [],
      page: 1
    })
    this.loadImages();//按照分类加载
  },
  indexChange:function(e){//切换分类
    var lx_id = e.target.dataset.lxid;
    console.log(e.target.dataset.lxid);
    this.setData({
      lx_id:lx_id,
      col1: [],
      col2: [],
      page:1
    })
    this.loadImages();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      user_lei: wx.getStorageSync('user_lei')
    })
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
    let scale = imgWidth / oImgW;        
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

  loadImages: function (e) {
    var that = this;
    var page = that.data.page;
    var search = that.data.search;
    wx.showLoading();//加载动画 
    wx.request({
      url: app.d.anranUrl + '/index.php?m=default&c=indem&a=get_shaidan3',
      method: 'post',
      data: {
        id: wx.getStorageSync('id'),
        page: page,
        lx_id:that.data.lx_id,
        search: search
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var shaidan = res.data.comments;
          if(shaidan == ''){
            wx.showToast({
              title: '没有更多了',
              duration: 2000
            });
          }
        that.setData({
          loadingCount: shaidan.length,
          images: shaidan,
          lx:res.data.lx,
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
  big_img(e) {//点击显示大图
    const bigimg = e.target.dataset.bigimg
    const current = e.target.dataset.img
    var con = e.target.dataset.con
      wx.setClipboardData({
        data: con,
        success(res) {
          wx.getClipboardData({
            success(res) {

            }
          });
         /* wx.downloadFile({
            url: current,
            success: function (res) {
              var imageFilePath = res.tempFilePath;
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
              
            },
          })*/
        }
      })
    wx.previewImage({
      current: current,
      urls: bigimg
    })
  },
  /*保存图片到本地 */
  saveImage: function (e) {

    wx.downloadFile({

      url: 服务器Http请求  + 图片路径,

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
    this.setData({
      col1: [],
      col2: [],
      page:1
    })
    this.loadImages();//按照分类加载
    wx.stopPullDownRefresh();//解决回弹问题
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.loadImages();//按照分类加载
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})