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
    content: '',
    goods_id:[],
    images: [],
    images2: [],
    type_id:0,
    off:1,
    yiyuan: ['美国', '中国', '巴西', '日本'],
    yiyuan_index:'',//医院序号
    yiyuan_id:[],//医院对应的ID
    xiangmu:[],
    xiangmu_id:'',//项目序号
    xiangmu_index:9999, //项目id
    new_goods_id_1: 0,//新增多个项目，最多五个，项目id
    new_goods_id_2: 0,
    new_goods_id_3: 0,
    new_goods_id_4: 0,
    new_goods_id_5: 0,
    new_goods_info_1:[],//第一个项目展示
    new_goods_info_2: [],
    new_goods_info_3: [],
    new_goods_info_4: [],
    new_goods_info_5: [],
    new_goods_id: 0,//选择项目页面返回获得的值
    anli_info:[]
  },

  onLoad(options) {
    $init(this)
    this.yiyuan_load();
    var that = this;
    if(options.id > 0){
      wx.showLoading();//加载动画
      this.setData({
        type_id: options.id //表示为修改状态
      })
      wx.request({
        url: app.d.anranUrl + '/index.php?m=default&c=indem&a=anli_info',
        method: 'post',
        data: {
          aid: options.id,
          uid: wx.getStorageSync('id')
        },
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {

          that.setData({
            anli_info: res.data.anli_info[0],
            new_goods_id_1: res.data.anli_info[0].goods_id,
            new_goods_id_2: res.data.anli_info[0].goods_id_2,
            new_goods_id_3: res.data.anli_info[0].goods_id_3,
            new_goods_id_4: res.data.anli_info[0].goods_id_4,
            new_goods_id_5: res.data.anli_info[0].goods_id_5,
          })
          console.log('第一个商品' + res.data.anli_info[0].goods_id);
          //endInitData
          that.xiangmu_load();//加载项目
          wx.hideLoading()//关闭加载动画
        },
        fail: function (e) {
          wx.showToast({
            title: '网络异常！',
            duration: 2000
          });
        }
      })
      
    }
  },
/*加载项目数据 */
xiangmu_load:function(e){
  var that = this;
  var new_goods_id = this.data.new_goods_id;
  var new_goods_id_1 = this.data.new_goods_id_1;
  var new_goods_id_2 = this.data.new_goods_id_2;
  var new_goods_id_3 = this.data.new_goods_id_3;
  var new_goods_id_4 = this.data.new_goods_id_4;
  var new_goods_id_5 = this.data.new_goods_id_5;
  console.log('第一个商品' + new_goods_id_1)
  if (new_goods_id_1 > 0 ) {//写入第一个

    wx.request({
      url: app.d.anranUrl + '/index.php?m=default&c=indem&a=xcx_goods_info',
      method: 'post',
      data: {
        user_id: wx.getStorageSync('id'),
        pro_id: new_goods_id_1,
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        that.setData({
          new_goods_info_1: res.data.goods,
        })
      },
      fail: function (e) {
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      },
    })
  }
    if (new_goods_id_2 > 0) {// 写入第二个
      wx.request({
        url: app.d.anranUrl + '/index.php?m=default&c=indem&a=xcx_goods_info',
        method: 'post',
        data: {
          user_id: wx.getStorageSync('id'),
          pro_id: new_goods_id_2,
        },
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          that.setData({
            new_goods_info_2: res.data.goods,
          })
        },
        fail: function (e) {
          wx.showToast({
            title: '网络异常！',
            duration: 2000
          });
        },
      })

      if (new_goods_id_3 > 0) {//写入第三个
        wx.request({
          url: app.d.anranUrl + '/index.php?m=default&c=indem&a=xcx_goods_info',
          method: 'post',
          data: {
            user_id: wx.getStorageSync('id'),
            pro_id: new_goods_id_3,
          },
          header: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          success: function (res) {
            that.setData({
              new_goods_info_3: res.data.goods,
            })
          },
          fail: function (e) {
            wx.showToast({
              title: '网络异常！',
              duration: 2000
            });
          },
        })

        if (new_goods_id_4 > 0) {//写入第四个
          wx.request({
            url: app.d.anranUrl + '/index.php?m=default&c=indem&a=xcx_goods_info',
            method: 'post',
            data: {
              user_id: wx.getStorageSync('id'),
              pro_id: new_goods_id_4,
            },
            header: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
              that.setData({
                new_goods_info_4: res.data.goods,
              })
            },
            fail: function (e) {
              wx.showToast({
                title: '网络异常！',
                duration: 2000
              });
            },
          })

          if (new_goods_id_5 > 0) {//写入第五个
            wx.request({
              url: app.d.anranUrl + '/index.php?m=default&c=indem&a=xcx_goods_info',
              method: 'post',
              data: {
                user_id: wx.getStorageSync('id'),
                pro_id: new_goods_id_5,
              },
              header: {
                'Content-Type': 'application/x-www-form-urlencoded'
              },
              success: function (res) {
                that.setData({
                  new_goods_info_5: res.data.goods,
                })
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
    }
  }

},

yiyuan_load:function(e){
  var that = this;
  wx.showLoading();//加载动画
  wx.request({
    url: app.d.anranUrl + '/index.php?m=default&c=indem&a=xcx_yiyuan',
    method: 'post',
    data: {
    },
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    success: function (res) {
      that.setData({
        yiyuan: res.data.yiyuan,
        yiyuan_id: res.data.yiyuan_id
      });
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
  handleTitleInput(e) {
    const value = e.detail.value
    this.data.title = value
    this.data.titleCount = value.length
    $digest(this)
  },

  handleContentInput(e) {
    const value = e.detail.value
    this.data.content = value
    this.data.contentCount = value.length
    $digest(this)
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
        console.log(images)
       
      }
    })
  },
  chooseImage2(e) {
    wx.chooseImage({
      count: 3,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: res => {
        const images2 = this.data.images2.concat(res.tempFilePaths)
        this.data.images2 = images2.length <= 3 ? images2 : images2.slice(0, 3)
        $digest(this)
        console.log(images2)

      }
    })
  },
  removeImage(e) {
    const idx = e.currentTarget.dataset.idx
    this.data.images.splice(idx, 1)
    $digest(this)
  },
  removeImage2(e) {
    const idx = e.currentTarget.dataset.idx
    this.data.images2.splice(idx, 1)
    $digest(this)
  },
  remove_xm (e) {
    if (e.currentTarget.dataset.idx == 1){
      this.setData({
        new_goods_id_1: 0
      })
    }
    if (e.currentTarget.dataset.idx == 2) {
      this.setData({
        new_goods_id_2: 0
      })
    }
    if (e.currentTarget.dataset.idx == 3) {
      this.setData({
        new_goods_id_3: 0
      })
    }
    if (e.currentTarget.dataset.idx == 4) {
      this.setData({
        new_goods_id_4: 0
      })
    }
    if (e.currentTarget.dataset.idx == 5) {
      this.setData({
        new_goods_id_5: 0
      })
    }
   
  },
  handleImagePreview(e) {
    const idx = e.currentTarget.dataset.idx
    const images = this.data.images

    wx.previewImage({
      current: images[idx],
      urls: images,
    })
  },
  handleImagePreview2(e) {
    const idx = e.currentTarget.dataset.idx
    const images = this.data.images2

    wx.previewImage({
      current: images[idx],
      urls: images,
    })
  },

  submitForm(e) {
    const content = this.data.content
    var that = this;
    var xiangmu_index = that.data.xiangmu_index;
    var off = e.currentTarget.dataset.off;
    var type_id = this.data.type_id;
    var new_goods_id_1 = this.data.new_goods_id_1;
    var new_goods_id_2 = this.data.new_goods_id_2;
    var new_goods_id_3 = this.data.new_goods_id_3;
    var new_goods_id_4 = this.data.new_goods_id_4;
    var new_goods_id_5 = this.data.new_goods_id_5;
    if(off == 1){//提交开关=1
      that.setData({
        off: 0,
      });
     /* if (xiangmu_index == 9999){//没有选择项目
        wx.showToast({
          title: '请选择项目',
          duration: 2000
        });
        that.setData({
          off: 1,
        });
        return
      }*/

      if (content.length < 30) {//不得小于30字
        wx.showToast({
          title: '文字内容不得少于30字',
          icon:'none',
          duration: 2000
        });
        return
      }
      /*先创建一个晒单 */
      wx.request({
        url: app.d.anranUrl + '/index.php?m=default&c=indem&a=add_shaidan',
        method: 'post',
        data: {
          user_id: wx.getStorageSync('id'),
          goods_id: xiangmu_index,
          content: content,
          type_id:type_id,
          new_goods_id_1: new_goods_id_1,//新增多个项目，最多五个，项目id
          new_goods_id_2: new_goods_id_2,
          new_goods_id_3: new_goods_id_3,
          new_goods_id_4: new_goods_id_4,
          new_goods_id_5: new_goods_id_5,
        },
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          var shaidan = res.data.state;
          var id = res.data.id;
          if (shaidan == 1) {//添加成功
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
    }else{
      wx.showToast({
        title: '点太快',
        duration: 2000
      });
    }
    
  },

  up_img: function (id){//上传图片
  const content = this.data.content
    console.log(content);
  if (content) {
    const arr = []
    var key = 1;
    var key2 = 1;
    for (let path of this.data.images) {
      arr.push(wxUploadFile({
        url: app.d.anranUrl + '/index.php?m=default&c=indem&a=save',
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
    for (let path of this.data.images2) {
      arr.push(wxUploadFile({
        url: app.d.anranUrl + '/index.php?m=default&c=indem&a=save2',
        filePath: path,
        name: 'file',
        formData: {
          user_id: wx.getStorageSync('id'),
          content: content,
          id: id,
          key2: key2++
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
      wx.redirectTo({
        url: '../user/my-anli'
      })
      wx.hideLoading()
     
   
      
    }).catch(err => {
      console.log(">>>> upload images error:", err)
    })
  }

},

  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      yiyuan_index: e.detail.value
    })
    var that = this;
    var yiyuan_id = that.data.yiyuan_id[e.detail.value];
    wx.showLoading();//加载动画
    wx.request({
      url: app.d.anranUrl + '/index.php?m=default&c=indem&a=xcx_xiangmu',
      method: 'post',
      data: {
        yiyuan_id: yiyuan_id
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        that.setData({
          xiangmu: res.data.xiangmu,
          goods_id:res.data.goods_id
        });
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
  
  bindPickerChange2: function (e) {//选择项目
    var goods_id = this.data.goods_id;
    var xiangmu = this.data.xiangmu;
    console.log('picker发送选择改变，携带值为', xiangmu[e.detail.value])
    console.log('picker发送选择改变，携带值为', goods_id[e.detail.value])
    this.setData({
      xiangmu_index: goods_id[e.detail.value],
      xiangmu_id: e.detail.value //项目序号
    })
  },
  /**
 * 生命周期函数--监听页面显示
 */
  onShow: function () {
    var that = this;
    var new_goods_id = this.data.new_goods_id;
    var new_goods_id_1 = this.data.new_goods_id_1;
    var new_goods_id_2 = this.data.new_goods_id_2;
    var new_goods_id_3 = this.data.new_goods_id_3;
    var new_goods_id_4 = this.data.new_goods_id_4;
    var new_goods_id_5 = this.data.new_goods_id_5;
    console.log('测试' + new_goods_id + '测试B' + new_goods_id_1 )
    if (new_goods_id > 0 && new_goods_id_1 == 0) {//写入第一个

      wx.request({
        url: app.d.anranUrl + '/index.php?m=default&c=indem&a=xcx_goods_info',
        method: 'post',
        data: {
          user_id: wx.getStorageSync('id'),
          pro_id: new_goods_id,
        },
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
         that.setData({
           new_goods_info_1:res.data.goods,
           new_goods_id_1: new_goods_id,
           new_goods_id:0
         })
        },
        fail: function (e) {
          wx.showToast({
            title: '网络异常！',
            duration: 2000
          });
        },
      })
    } else {
      if (new_goods_id_2 == 0) {// 写入第二个
        wx.request({
          url: app.d.anranUrl + '/index.php?m=default&c=indem&a=xcx_goods_info',
          method: 'post',
          data: {
            user_id: wx.getStorageSync('id'),
            pro_id: new_goods_id,
          },
          header: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          success: function (res) {
            that.setData({
              new_goods_info_2: res.data.goods,
              new_goods_id_2: new_goods_id,
              new_goods_id: 0
            })
          },
          fail: function (e) {
            wx.showToast({
              title: '网络异常！',
              duration: 2000
            });
          },
        })
      }else{
        if (new_goods_id_3 == 0){//写入第三个
          wx.request({
            url: app.d.anranUrl + '/index.php?m=default&c=indem&a=xcx_goods_info',
            method: 'post',
            data: {
              user_id: wx.getStorageSync('id'),
              pro_id: new_goods_id,
            },
            header: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
              that.setData({
                new_goods_info_3: res.data.goods,
                new_goods_id_3: new_goods_id,
                new_goods_id: 0
              })
            },
            fail: function (e) {
              wx.showToast({
                title: '网络异常！',
                duration: 2000
              });
            },
          })
        }else{
          if (new_goods_id_4 == 0){//写入第四个
            wx.request({
              url: app.d.anranUrl + '/index.php?m=default&c=indem&a=xcx_goods_info',
              method: 'post',
              data: {
                user_id: wx.getStorageSync('id'),
                pro_id: new_goods_id,
              },
              header: {
                'Content-Type': 'application/x-www-form-urlencoded'
              },
              success: function (res) {
                that.setData({
                  new_goods_info_4: res.data.goods,
                  new_goods_id_4: new_goods_id,
                  new_goods_id: 0
                })
              },
              fail: function (e) {
                wx.showToast({
                  title: '网络异常！',
                  duration: 2000
                });
              },
            })
          }else{
            if (new_goods_id_5 == 0){//写入第五个
              wx.request({
                url: app.d.anranUrl + '/index.php?m=default&c=indem&a=xcx_goods_info',
                method: 'post',
                data: {
                  user_id: wx.getStorageSync('id'),
                  pro_id: new_goods_id,
                },
                header: {
                  'Content-Type': 'application/x-www-form-urlencoded'
                },
                success: function (res) {
                  that.setData({
                    new_goods_info_5: res.data.goods,
                    new_goods_id_5: new_goods_id,
                    new_goods_id: 0
                  })
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
        }
      }
    }
  },

  xiangmu_info:function(e){

    
  }

})