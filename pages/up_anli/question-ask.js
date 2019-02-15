import { promisify } from '../../utils/promise.util'
import { $init, $digest } from '../../utils/common.util'
//import { createQuestion } from '../../services/question.service'
import config from '../../config'

const wxUploadFile = promisify(wx.uploadFile)
var app = getApp()
Page({

  data: {
    titleCount: 0,
    contentCount: 0,
    title: '',
    content: ' ',
    images: [],
    anli_text:[],
    title:'',//知乎提问的问题标题
    wenti_info:'',//问题的描述详情
    shunxu:0,//顺序
    type_id:0,
    lx_info:[],
    lx_id:0,//提交的分类类型id
    id:0//表示案例id
  },

  onLoad(options) {
    $init(this)
    if(options.type_id == 1){
      //更改头部标题
      wx.setNavigationBarTitle({
        title: '意见反馈',
        success: function () {
        },
      });
      this.setData({
        type_id: 1,
      })
    }
    if (options.type_id == 2) {
      //更改头部标题
      wx.setNavigationBarTitle({
        title: '提问',
        success: function () {
        },
      });
      this.setData({
        type_id: 2,
      })
    }
    if(options.id > 0){
      //更改头部标题
      wx.setNavigationBarTitle({
        title: '编辑案例',
        success: function () {
        },
      });
    }
    this.setData({
      id: options.id
    })
    this.fenlei();
  },
  fenlei: function (e) {
    var that = this;
    wx.showLoading();//加载动画
    wx.request({
      url: app.d.anranUrl + '/index.php?m=default&c=indem&a=fenlei',
      method: 'post',
      data: {
        aid:that.data.id
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        if (res.data.anli_text == null){
          that.setData({
            anli_text: res.data.anli_text,
            lx_info: res.data.lx,
          });
        }else{
          that.setData({
            anli_text: res.data.anli_text,
            lx_info: res.data.lx,
            content: res.data.anli_text.content,
            lx_id: res.data.anli_text.lx,
          });
        }
        

        
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

  bindPickerChange2: function (e) {//选择分类
    this.setData({
      shunxu: e.detail.value,
      lx_id: this.data.lx_info.id[e.detail.value]
    })
    console.log(this.data.lx_info.id[e.detail.value])
  },
  handleTitleInput(e) {
    const value = e.detail.value
    this.data.title = value
    this.data.titleCount = value.length
    $digest(this)
    this.setData({
      title: value
    })
  },

  handleContentInput(e) {
    const value = e.detail.value
    this.data.content = value
    this.data.contentCount = value.length
    $digest(this)
    this.setData({
      wenti_info: value
    })
  },

  chooseImage(e) {
    wx.chooseImage({
      count: 9,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: res => {
        const images = this.data.images.concat(res.tempFilePaths)
        this.data.images = images.length <= 9 ? images : images.slice(0, 9)
        $digest(this)
        console.log(images[0])
       
      }
    })
  },

  removeImage(e) {
    const idx = e.target.dataset.idx
    this.data.images.splice(idx, 1)
    $digest(this)
  },

  handleImagePreview(e) {
    const idx = e.target.dataset.idx
    const images = this.data.images

    wx.previewImage({
      current: images[idx],
      urls: images,
    })
  },
  submitForm2(e) {
    const content = this.data.content
    var that = this;
    var lx = this.data.lx_id;
    var id = this.data.id;
    var type_id = this.data.type_id;
    console.log(content)
    /*先创建一个晒单 */
    wx.request({
      url: app.d.anranUrl + '/index.php?m=default&c=indem&a=add_shaidan2_bj',
      method: 'post',
      data: {
        user_id: wx.getStorageSync('id'),
        content: content,
        lx: lx,
        comment_id: id
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var shaidan = res.data.state;
        var id = res.data.id;
        if (shaidan == 1) {//添加成功
          wx.showToast({
            title: '修改成功！',
            duration: 2000
          });
          wx.navigateBack();
        } else {
          wx.showToast({
            title: '修改失败！',
            duration: 2000
          });
        }

      },
      fail: function (e) {
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      },
    })


  },
  submitForm(e) {
    const content = this.data.content
    var that = this;
    var lx = this.data.lx_id;
    var type_id = this.data.type_id;
    console.log(content)
/*先创建一个晒单 */
    wx.request({
      url: app.d.anranUrl + '/index.php?m=default&c=indem&a=add_shaidan2',
      method: 'post',
      data: {
        user_id: wx.getStorageSync('id'),
        content: content,
        lx:lx,
        type_id: type_id
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var shaidan = res.data.state;
        var id = res.data.id;
        if (shaidan == 1) {//添加成功
        console.log(123);
          that.up_img(id);//创建成功之后再上传图片
        }else{
          wx.showToast({
            title: '提交失败！',
            duration: 2000
          });
        }

      },
      fail: function (e) {
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      },
    })

    
  },
  submitForm3(e) {//知乎提问
    const title = this.data.title
    const wenti_info = this.data.wenti_info
    var that = this;
    var lx = this.data.lx_id;

    /*先创建一个晒单 */
    wx.request({
      url: app.d.anranUrl + '/index.php?m=default&c=indem&a=add_zhihu_tiwen',
      method: 'post',
      data: {
        user_id: wx.getStorageSync('id'),
        title: title,
        wenti_info: wenti_info,
        lx: lx
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        if(res.data.states == 1){
          wx.navigateBack()
        }
       
      },
      fail: function (e) {
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      },
    })
  },
  up_img: function (id){//上传图片
  var that = this;
  const content = this.data.content
 console.log(id);
  if (content) {
    const arr = []
    var key = 1;
    for (let path of this.data.images) {
      arr.push(wxUploadFile({
        url: app.d.anranUrl + '/index.php?m=default&c=indem&a=save3',
        filePath: path,
        name: 'file',
        formData: {
          user_id: wx.getStorageSync('id'),
          content: content,
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
      let pages = getCurrentPages();//当前页面
      let prevPage = pages[pages.length - 2];//上一页面
      var type_id = that.data.type_id;
if(type_id == 1){
  wx.showToast({
    title: '提交成功，感谢！',
    duration: 3000
  });
  setTimeout(function () {//延时3秒返回
    wx.navigateBack()
  }, 3000)
  
}else{
  prevPage.setData({//直接给上移页面赋值
    xiala: 1
  });
  wx.hideLoading()
  wx.navigateBack()

}
      
   
      
    }).catch(err => {
      console.log(">>>> upload images error:", err)
    })
  }

}











})