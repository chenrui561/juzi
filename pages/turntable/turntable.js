var app = getApp();

let canRoll = true, //加控制，防止用户点击两次
  num = 1, //用在动画上，让用户在第二次点击的时候可以接着上次转动的角度继续转
  lotteryArrLen = 0, //放奖品的数组的长度
  lottery = ['谢谢惠顾', '三等奖', '二等奖', '四等奖', '一等奖', '四等奖', '二等奖', '三等奖']; //放奖品
Page({
  data: {
    app_uid:'',//获取的app.js的id
    can:1,//防止快速点击按钮的判断
    chi:'',
    end_time:'',
    choujiang:'',
    jp_num:'',
    countDownDay: '00',
    countDownHour: '00',
    countDownMinute: '00',
    countDownSecond: '00',
    last_name:'',
    last_img:'',
    zhongjiang_info:'',
    circular: true,
    one_id:'',
    two_id:'',
    one_name: '',
    one_img: '',
    two_name: '',
    two_img: ''
  },
  // 截获竖向滑动
  catchTouchMove: function (res) {
    return false
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onPullDownRefresh: function () {
    wx.reLaunch({//刷新当前页面
      url: '../turntable/turntable',
    })
    wx.stopPullDownRefresh();//解决回弹问题
  },
  onLoad(opt) {
    let that = this;
   
    
    console.log('参数id'+opt.id);
    that.setData({
      app_uid: wx.getStorageSync('id'),//缓存id
   
    });
    if (opt.id > 0){
      wx.setStorageSync('bd_id', opt.id)//把转发的人id写入缓存

    }
    if (wx.getStorageSync('id') == '') {//如果缓存里面没有id，那就弹授权
      that.setData({
        shouquan: 0,
      });
    }
    var app_uid = wx.getStorageSync('id');//获取app.js里的用户id
    var hx_uid = wx.getStorageSync('id');//获取缓存里面的用户id


    /*获取抽奖转盘基本信息 */
    wx.request({
      url: app.d.anranUrl + '/index.php?m=default&c=indem&a=zhuanpan_info',
      method: 'post',
      data: {
        id: wx.getStorageSync('id')
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        that.setData({
          chi: res.data.chi,//奖池金额
          end_time: res.data.end_time,//倒计时结束时间
          choujiang: res.data.zhuanpan_quan,
          last_name: res.data.last_name,
          last_img: res.data.last_img,
          zhongjiang_info: res.data.zhongjiang_info,
          one_name: res.data.one_name,
          one_img: res.data.one_img,
          two_name: res.data.two_name,
          two_img: res.data.two_img,
          one_id: res.data.one_id,
          two_id: res.data.two_id
        });
       that.djs();
        
      },
      error: function (e) {
        wx.showToast({
          title: '网络异常！',
          duration: 2000,
        });
      },
    });




    this.setPlateData(); //执行设置转盘表面的文字
    
    let aniData = wx.createAnimation({ //创建动画对象
      duration: 2000,
      timingFunction: 'ease'
    });
    this.aniData = aniData; //将动画对象赋值给this的aniData属性

    let aniData2 = wx.createAnimation({ //创建动画对象+1特效
      duration: 1000,
      timingFunction: 'linear'
    });
    this.aniData2 = aniData2; //将动画对象赋值给this的aniData属性+1特效
  },
  setPlateData() { //设置奖品数组
    lotteryArrLen = lottery.length; //获取奖品数组的长度，用来判断
      let dataLen = 0; //用来放原来数组的索引
      let evenArr = new Array(lotteryArrLen ); //创建扩展数组
      for (let i = 0; i < (lotteryArrLen ); i++) {
          evenArr[i] = lottery[dataLen]; //将原来数组的值赋值给新数组
          dataLen++; //原来数组的索引加一

      }
      lottery = [...evenArr]; //将整合好的数组赋值给lottery数组

    lotteryArrLen = lottery.length; //获取新的数组长度
    this.setData({
      lottery: lottery //设置好值，用于页面展示
    })
  },
  startRollTap(e) { //开始转盘
    let that = this;
    var one_id = that.data.one_id;
    var two_id = that.data.two_id;
    var canRoll = e.currentTarget.dataset.can;
    if (canRoll == 1) {//表示可以点击
      let aniData = this.aniData; //获取this对象上的动画对象
      let aniData2 = this.aniData2; //获取this对象上的动画对象，+1特效
      wx.request({//接口请求后台获取抽奖结果
        url: app.d.anranUrl + '/index.php?m=default&c=indem&a=onclick_zhuanpan',
        method: 'post',
        data: {
          id: wx.getStorageSync('id'),
        },
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {

          if (res.data.state == 9){//返回9，表示没有券了
            wx.showToast({
              title: '抽奖券不足',
              duration: 2000,
            });  
          }else{//如果还有券
            let rightNum = res.data.num; //返回的奖品
            var r_end_time = that.data.end_time;
            setTimeout(function () {
              //要延时执行的代码,提示获得奖品
              console.log(`随机数是${rightNum}`);
              console.log(`奖品是：${lottery[rightNum]}`);
              /*抽奖弹窗 */
              if (rightNum == 1 || rightNum == 3 || rightNum == 5 || rightNum == 7){//获得代金券奖品
                wx.showModal({
                  title: `恭喜您获得${lottery[rightNum]}`,
                  content: '优惠券已放入您的账户中，前往查看？',
                  showCancel: ' 不了',
                  confirmText: '好的',
                  success: function (res) {
                    if (res.cancel) {//点击了取消，刷新
                      that.shuaxin();
                    }
                    if (res.confirm) {//点击了确定，前往优惠券页面
                      wx.navigateTo({
                        url: '../user/quan'
                      })
                    }
                  }
                })
              } else if (rightNum == 2){//如果是二等奖
                wx.showModal({
                  title: `恭喜您获得${lottery[rightNum]}`,
                  content: '您已获得该商品专属全额抵扣券，立即下单？',
                  showCancel: '晚点',
                  confirmText: '好的',
                  success: function (res) {
                    if (res.cancel) {//点击了取消，去首页
                      that.shuaxin();
                    }
                    if (res.confirm) {//点击了确定，去商品页
                      wx.navigateTo({
                        url: '../user/quan'
                      })
                    }
                  }
                })

              } else if (rightNum == 4) {//如果是一等奖
                wx.showModal({
                  title: `恭喜您获得${lottery[rightNum]}`,
                  content: '您已获得该商品专属全额抵扣券，立即下单？',
                  showCancel: '晚点',
                  confirmText: '好的',
                  success: function (res) {
                    if (res.cancel) {//点击了取消，去首页
                      that.shuaxin();
                    }
                    if (res.confirm) {//点击了确定，去商品页
                      wx.navigateTo({
                        url: '../user/quan'
                      })
                    }
                  }
                })

              }
              


              that.setData({
                can: 1
              })
            }, 2000) //延迟时间 这里是2秒

            aniData.rotate(3600 * num - 360 / lotteryArrLen * rightNum).step(); //设置转动的圈数
            //aniData2.scale(5).step();//+1特效
            that.setData({
              aniData: aniData.export(),
              aniData2: aniData2.export(),
              end_time: r_end_time + 600,
              can: 2
            })
            num++;
          }
        },
        error: function (e) {
          wx.showToast({
            title: '网络异常！',
            duration: 2000,
          });
        },
      });
      //let rightNum = ~~(Math.random() * lotteryArrLen); //生成随机数
     

    }
  },
  shuaxin: function (e) {
    wx.reLaunch({//刷新当前页面
      url: '../turntable/turntable',
    })

  },

  /*点击授权登录 */
  bindGetUserInfo: function (e) {
    var that = this;
    if (e.detail.userInfo) {
      //调用应用实例的方法获取全局数据
     /* app.getOpenid().then(function (openid) {
        if (openid == 66) {
          console.log(66)
          that.setData({
            app_uid: 999999,//缓存id还没有来得及写进来，先写一个9999

          })
        }

        if (openid == 88) {
          console.log(88)
        }
      });*/
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
  // 弹窗
  setModalStatus: function (e) {
    console.log(123);
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })

    this.animation = animation
    animation.translateY(500).step();

    this.setData({
      animationData: animation.export()
    })


    if (e.currentTarget.dataset.status == 1) {

      this.setData(
        {
          showModalStatus: true,

        }
      );
    }
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation
      })
      if (e.currentTarget.dataset.status == 0) {
        this.setData(
          {
            showModalStatus: false,

          }
        );
      }
    }.bind(this), 200)
  },
/*倒计时 */
djs: function (code) {
  
  var totalSecond = this.data.end_time
  
    var interval = setInterval(function () {
      
      // 秒数
      var second = totalSecond;

      // 天数位
      var day = Math.floor(second / 3600 / 24);
      var dayStr = day.toString();
      if (dayStr.length == 1) dayStr = '0' + dayStr;

      // 小时位
      var hr = Math.floor((second - day * 3600 * 24) / 3600);
      var hrStr = hr.toString();
      if (hrStr.length == 1) hrStr = '0' + hrStr;

      // 分钟位
      var min = Math.floor((second - day * 3600 * 24 - hr * 3600) / 60);
      var minStr = min.toString();
      if (minStr.length == 1) minStr = '0' + minStr;

      // 秒位
      var sec = second - day * 3600 * 24 - hr * 3600 - min * 60;
      var secStr = sec.toString();
      if (secStr.length == 1) secStr = '0' + secStr;
      
      this.setData({
        countDownDay: dayStr,
        countDownHour: hrStr,
        countDownMinute: minStr,
        countDownSecond: secStr,
      });
      totalSecond--;
      if (totalSecond < 0) {
        clearInterval(interval);
        wx.showToast({
          title: '已开奖，请刷新',
        });
        this.setData({
          countDownDay: '00',
          countDownHour: '00',
          countDownMinute: '00',
          countDownSecond: '00',
        });
      }
    }.bind(this), 1000);
  },
  onShareAppMessage: function () {//
    var abc = wx.getStorageSync('id');//获取id

    return {
      title: '免费抽奖转大礼，海淘好物限时送',
      path: '/pages/turntable/turntable?id=' + abc,
      success: function (res) {
        // 分享成功
        wx.showModal({
          title: '分享成功',
          content: '好友授权登录后您即可获得一张抽奖券！',
          showCancel:  false,
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
})
