// pages/post/post.js
const app = getApp()

var WxParse = require('../../wxParse/wxParse.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    from: '',
    postId: '',
    loading: true,
    topTipsType: 'success',
    topTipsMsg: '',
    title: '',
    postTime: '',
    topics: [],
    pv: 0,
    commentCount: 0,
    postWordCount: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    that.setData({
      from: options.from,
      postId: options.postId,
    })

    wx.showLoading({
      title: '加载中',
    });
    
    wx.request({
      url: app.globalData.urlPrefix + '/m/p/' + that.data.postId,
      header: {
        'content-type': 'application/json'
      },
      success(res) {
        // console.log(res.data);
        if (res.data.code !== 200) {
          that.setData({
            loading: false,
            topTipsType: 'error',
            topTipsMsg: '请求出错，请稍后再试~',
          }, function () {
            wx.hideLoading()
          })
          return
        }

        WxParse.wxParse('article', 'html', res.data.data.post.contentHtml, that, 5);

        that.setData({
          title: res.data.data.post.title,
          postTime: res.data.data.post.postTime.$date.$numberLong,
          topics: res.data.data.post.topics,
          pv: res.data.data.post.pv,
          commentCount: res.data.data.post.commentCount,
          postWordCount: res.data.data.post.postWordCount,
          loading: false
        }, function () {
          wx.hideLoading()
        })
      },
      fail(reason) {
        console.log(reason)
        that.setData({
          loading: false,
          topTipsType: 'error',
          topTipsMsg: '服务器忙，请稍后再试',
        }, function () {
          wx.hideLoading()
        })
      },
      complete() {
        
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this
    console.log("enter post from#" + that.data.from)
    wx.reportAnalytics('enter_post', {
      from: that.data.from,
      postid: that.data.postId,
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(res) {
    var that = this
    if (res.from === 'button') {
      // 通过按钮触发
      var data = res.target.dataset
      return {
        title: data.title,
        path: '/pages/post/post?from=share-btn&postId=' + data.postId,
        imageUrl: '',
        success: function(res) {
          // 转发成功
          console.log('转发成功')
        },
        fail: function(res) {
          // 转发失败
          console.log('转发失败')
        }
      }
    }
    //通过右上角菜单触发
    return {
      title: that.data.title,
      path: "/pages/post/post?from=share-menu&postId=" + that.data.postId,
      imageUrl: ''
    };
  },

  /**
   * wxParseTagATap
   */
  wxParseTagATap: function(e) {
    console.log(e.currentTarget.dataset.src)
    var that = this;
    var src = e.currentTarget.dataset.src;
    if (src == undefined) {
      that.setData({
        topTipsType: 'error',
        topTipsMsg: '复制出错，请联系管理员',
      })
      return
    }
    wx.showActionSheet({
      itemList: ['复制链接'],
      success(res) {
        var tabIndex = res.tapIndex;
        if (tabIndex == 0) {
          wx.setClipboardData({
            data: src,
            success(res) {
              console.log("copy link clipboard, postId=" + that.data.postId + ", success#" + JSON.stringify(res))
            },
            fail(res) {
              console.log("copy link clipboard postId=" + that.data.postId + ", fail#" + JSON.stringify(res))
              that.setData({
                topTipsType: 'error',
                topTipsMsg: '复制链接失败',
              })
            }
          })
        }
      },
      fail(res) {
        console.log("showActionSheet fail#" + res.errMsg)
      }
    })
  },

  /**
   * code长按事件，实现了自定义的wxParse中code长按事件
   */
  longPress: function(e) {
    var that = this;
    var codeIndex = e.currentTarget.dataset.codeIndex;
    if (codeIndex == undefined || that.wxParseCodeIndex == undefined || that.wxParseCodeContent == undefined) {
      that.setData({
        topTipsType: 'error',
        topTipsMsg: '拷贝出错，请联系管理员',
      })
      return
    }
    wx.showActionSheet({
      itemList: ['拷贝代码', '复制链接'],
      success(res) {
        var tabIndex = res.tapIndex;
        console.log("showActionSheet#" + tabIndex)
        if (tabIndex == 0) {
          var content = that.wxParseCodeContent[that.wxParseCodeIndex.indexOf(codeIndex)]
          wx.setClipboardData({
            data: content,
            success(res) {
              console.log("copy code clipboard, postId=" + that.data.postId + ", success#" + JSON.stringify(res))
            },
            fail(res) {
              console.log("copy code clipboard postId=" + that.data.postId + ", fail#" + JSON.stringify(res))
              that.setData({
                topTipsType: 'error',
                topTipsMsg: '拷贝失败',
              })
            }
          })
        } else if (tabIndex == 1) {
          wx.setClipboardData({
            data: app.globalData.urlPrefix + '/p/' + that.data.postId + '.html',
            success(res) {
              console.log("copy url to clipboard, postId=" + that.data.postId + ", success#" + JSON.stringify(res))
            },
            fail(res) {
              console.log("copy url to clipboard postId=" + that.data.postId + ", fail#" + JSON.stringify(res))
              that.setData({
                topTipsType: 'error',
                topTipsMsg: '拷贝失败',
              })
            }
          })
        }
      },
      fail(res) {
        console.log("showActionSheet fail#" + res.errMsg)
      }
    })
  },

  handleContact: function(e) {
    console.log(e.detail.path)
    console.log(e.detail.query)
  },

  bindLoad: function(e) {
    var status = e.detail.status;
    var errMsg = e.detail.errMsg;
    console.log("official-account bind load#status=" + status + ", errMsg=" + errMsg)
  },

  bindError: function(e) {
    var status = e.detail.status;
    var errMsg = e.detail.errMsg;
    console.log("official-account bind error#status=" + status + ", errMsg=" + errMsg)
  }

})