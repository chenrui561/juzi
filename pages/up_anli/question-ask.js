import { promisify } from '../../utils/promise.util'
import { $init, $digest } from '../../utils/common.util'
import config from '../../config'
const wxUploadFile = promisify(wx.uploadFile)
var app = getApp()
Page({

  data: {
    titleCount: 0,
    contentCount: 0,
    title: '',
    zid:0,//社区的回帖的主题id
    sid:0,
    fen:0,//评分默认为0
    states:0,//评价的状态，0为未评价，1为已评价
    order_id:'',
    content: ' ',
    fengmian1:'',//社区发帖的封面
    fengmian2: '',//社区发帖的封面
    fengmian3: '',//社区发帖的封面
    images: [],
    anli_text:[],
    title:'',//知乎提问的问题标题
    wenti_info:'',//问题的描述详情
    shunxu:0,//顺序
    type_id:0,
    up_ys_pick:[],//选中的医生
    up_zx_pick: [],//选中的咨询
    lx_info:[],
    lx_id:0,//提交的分类类型id
    id:0//表示案例id
  },
  bindfocus:function(e){//向上推

  },
pingfen:function(e){
  var fen = e.currentTarget.dataset.pf
  this.setData({
    fen:fen
  })
},
  pingfen2: function (e) {
    if (this.data.up_ys_pick.length == 0){
      wx.showToast({
        title: '请先选择医生',
        icon:'none',
        duration: 2000
      });
      return
    }
    var fen2 = e.currentTarget.dataset.pf
    this.setData({
      fen2: fen2
    })
  },
  pingfen3: function (e) {
    if (this.data.up_zx_pick.length == 0) {
      wx.showToast({
        title: '请先选择咨询师',
        icon: 'none',
        duration: 2000
      });
      return
    }
    var fen3 = e.currentTarget.dataset.pf
    this.setData({
      fen3: fen3
    })
  },
  change_pl:function(e){
    this.setData({
      states:0
    })
  },
  onLoad(options) {
    $init(this)
    console.log('测试' + this.data.up_ys_pick);
    this.setData({
      order_id: options.order_id,
      brand_id: options.brand_id
    })
    if (options.type_id == 4) {
      //更改头部标题
      wx.setNavigationBarTitle({
        title: '意见反馈',
        success: function () {
        },
      });
      this.setData({
        type_id: 4,
      })
      this.pingjia_info();
    }
    if(options.type_id == 1){
      //更改头部标题
      wx.setNavigationBarTitle({
        title: '评价晒图',
        success: function () {
        },
      });
      this.setData({
        type_id: 1,
      })
      this.pingjia_info();
    }
    if (options.type_id == 2) {//知乎提问
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
    if (options.type_id == 3) {//社区发帖
      if (options.zid > 0){
        //更改头部标题
        wx.setNavigationBarTitle({
          title: '回帖',
          success: function () {
          },
        });
        this.setData({
          type_id: 3,
          zid: options.zid
        })
      }else{
        //更改头部标题
        wx.setNavigationBarTitle({
          title: '发帖',
          success: function () {
          },
        });
        this.setData({
          type_id: 3,
        })
      }
      if (options.sid > 0) {//表示是编辑模式
        //更改头部标题
        wx.setNavigationBarTitle({
          title: '编辑',
          success: function () {
          },
        });
        this.setData({
          sid: options.sid,
        })
        this.loading_shequ_html(options.sid);
      }
    }
    if(options.id > 0){
      //更改头部标题
      wx.setNavigationBarTitle({
        title: '编辑案例',
        success: function () {
        },
      });
      this.fenlei();
    }
    this.setData({
      id: options.id
    })
    
  },
  /* 社区加载要编辑的内容*/
  loading_shequ_html: function (sid) {
    var that = this;
    /*测试富文本的编辑 */
    wx.showLoading();//加载动画 
    wx.request({
      url: app.d.anranUrl + '/index.php?m=default&c=indem&a=shequ_info',
      method: 'post',
      data: {
        sid: sid,
        uid: wx.getStorageSync('id')
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {

        that.html(res.data.xcx_shequ_info.content);//向富文本编辑器里面添加要修改的html
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

  ys_pick:function(e){
    
    this.setData({
      up_ys_pick: this.data.ys_list[e.detail.value]
    })
    console.log(this.data.ys_list[e.detail.value]);
  },
  zx_pick: function (e) {

    this.setData({
      up_zx_pick: this.data.zx_list[e.detail.value]
    })
    console.log(this.data.zx_list[e.detail.value]);
  },
  pingjia_info:function(e){
    var brand_id = this.data.brand_id;
    var that = this;
    wx.showLoading();//加载动画
    wx.request({
      url: app.d.anranUrl + '/index.php?m=default&c=indem&a=pingjia_info',
      method: 'post',
      data: {
        brand_id: brand_id,
        order_id:this.data.order_id,
        user_id: wx.getStorageSync('id')
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        that.setData({
          brand_name:res.data.brand_name,
          states: res.data.states,
          ys_list: res.data.ys_list,
          ys_pick: res.data.ys_pick,
          zx_list: res.data.zx_list,
          zx_pick: res.data.zx_pick,
          shaidan: res.data.pl
        })
       
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
  submitForm_fk(){
    var that = this;
    wx.request({
      url: app.d.anranUrl + '/index.php?m=default&c=indem&a=add_yijianfankui',
      method: 'post',
      data: {
        user_id: wx.getStorageSync('id'),
        content: this.data.wenti_info,
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        wx.showToast({
          title: '提交成功！',
          duration: 2000
        });
        wx.navigateBack();
      },
      fail: function (e) {
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      },
    })
    
  },
  submitForm(e) {//提交评论
    const content = this.data.content
    var that = this;
    var lx = this.data.lx_id;
    var fen = this.data.fen;
    var fen2 = this.data.fen2;
    var fen3 = this.data.fen3;
    var order_id = this.data.order_id;
    var brand_id = this.data.brand_id;
    var type_id = this.data.type_id;
    console.log(content)
    if (type_id > 0){
      if (fen == 0) {
        wx.showToast({
          title: '请给医院评分哦！',
          icon: 'none',
          duration: 2000
        });
        return
      }
    }
    wx.showModal({//弹窗
      content: "确认提交？",
      showCancel: true,
      confirmText: '确定',
      success: function (res) {
        if (res.cancel) {//点击了取消，去首页
          console.log(88);
        }
        if (res.confirm) {//点击了确定，去支付
          /*先创建 */
          wx.request({
            url: app.d.anranUrl + '/index.php?m=default&c=indem&a=add_shaidan2',
            method: 'post',
            data: {
              user_id: wx.getStorageSync('id'),
              content: content,
              fen: fen,
              fen2: fen2,
              fen3: fen3,
              lx: lx,
              ys_id: that.data.up_ys_pick['brand_id'],
              zx_id: that.data.up_zx_pick['brand_id'],
              brand_id: brand_id,
              order_id: order_id,
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
              } else {
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
        }
      }
    })

    
  },
  submitForm3(e) {//知乎提问
    const title = this.data.title
    const wenti_info = this.data.wenti_info
    var that = this;
    var lx = this.data.lx_id;
    if(title == ''){
      wx.showToast({
        title: '您还没有输入问题！',
        icon: 'none',
        duration: 2000
      });
      return false;
    }
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
        if (res.data.states == 2) {
          wx.showToast({
            title: '已经有人问过这个问题了',
            icon:'none',
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

},

/*富文本 */
onEditorReady() {
    const that = this
    wx.createSelectorQuery().select('#editor').context(function (res) {
      that.editorCtx = res.context
    }).exec()
  },
  tijiao: function (e) {//获取富文本内容
    var that = this;
    wx.showModal({//弹窗
      content: "确认提交？",
      showCancel: true,
      confirmText: '确定',
      success: function (res) {
        if (res.cancel) {//点击了取消，去首页
          console.log(88);
        }
        if (res.confirm) {//点击了确定，去支付
          that.editorCtx.getContents({
            fail: (res) => {
              console.log('err')
            },
            success: (res) => {
              //查找出上传的html里的图片
              console.log(res)
              let a = 0;
              for (let i = 0; i < res.delta.ops.length; i++) {
                if (res.delta.ops[i].insert.image) {//循环查询是否有图片存在，如果有就输出图片
                  if (a == 0) {//写入第一个封面
                    that.setData({
                      fengmian1: res.delta.ops[i].insert.image
                    })
                  }
                  if (a == 1) {//写入第二个封面
                    that.setData({
                      fengmian2: res.delta.ops[i].insert.image
                    })
                  }
                  if (a == 2) {//写入第三个封面
                    that.setData({
                      fengmian3: res.delta.ops[i].insert.image
                    })
                    //break; //够三张了，中断循环
                  }
                  a++;
                }

              }
              /** */
              wx.request({
                url: app.d.anranUrl + '/index.php?m=default&c=indem&a=fatie',
                method: 'post',
                data: {
                  user_id: wx.getStorageSync('id'),
                  title: that.data.title,
                  fengmian1: that.data.fengmian1,
                  fengmian2: that.data.fengmian2,
                  fengmian3: that.data.fengmian3,
                  content: res.html,
                  sid:that.data.sid,//大于0表示是编辑
                  zid: that.data.zid //社区帖子id，如果大于0表示是回帖
                },
                header: {
                  'Content-Type': 'application/x-www-form-urlencoded'
                },
                success: function (res) {
                  let pages = getCurrentPages();  // 当前页的数据，可以输出来看看有什么东西
                  let prevPage = pages[pages.length - 2];  // 上一页的数据，也可以输出来看看有什么东西
                  /** 设置数据 这里面的 value 是上一页你想被携带过去的数据，后面是本方法里你得到的数据，我这里是detail.value，根据自己实际情况设置 */
                  prevPage.setData({
                    sx: 1,
                  })
                  wx.navigateBack({});
    /** 返回上一页 这个时候数据就传回去了 可以在上一页的onShow方法里把 value 输出来查看是否已经携带完成 */
                },
                fail: function (e) {
                  wx.showToast({
                    title: '网络异常！',
                    duration: 2000
                  });
                },
              })
            }
          })
        }
      }
    })
   
  },
  fanhui:function(){
  
  },
  html: function (html) {//初始化富文本编辑器内容
    this.editorCtx.setContents({
      html:html,
      fail: (res) => {
        console.log('err')
      },
      success: (res) => {
        console.log(res)
      }
    })
  },

  undo() {
    this.editorCtx.undo()
  },
  redo() {
    this.editorCtx.redo()
  },
  format(e) {
    let { name, value } = e.target.dataset
    if (!name) return
    // console.log('format', name, value)
    this.editorCtx.format(name, value)

  },
  onStatusChange(e) {
    const formats = e.detail
    this.setData({ formats })
  },
  insertDivider() {
    this.editorCtx.insertDivider({
      success: function () {
        console.log('insert divider success')
      }
    })
  },
  clear() {
    this.editorCtx.clear({
      success: function (res) {
        console.log("clear success")
      }
    })
  },
  removeFormat() {
    this.editorCtx.removeFormat()
  },
  insertDate() {
    const date = new Date()
    const formatDate = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
    this.editorCtx.insertText({
      text: formatDate
    })
  },
  insertImage() {
    const that = this
    wx.chooseImage({
      count: 1,
      success: function (res) {
        
        const arr = []
        for (let path of res.tempFilePaths) {
            arr.push(wxUploadFile({
              url: app.d.anranUrl + '/index.php?m=default&c=indem&a=save_fwb',
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
            console.log(res[0].data)
            wx.hideLoading();
            /*成功之后显示图片 */
            that.editorCtx.insertImage({
              src: res[0].data,
              data: {
                id: 'abcd',
                role: 'god'
              },
              success: function () {
                console.log('insert image success')
              }
            })

          }).catch(err => {
            console.log(">>>> upload images error:", err)
          })
       


        
      }
    })
  },




})