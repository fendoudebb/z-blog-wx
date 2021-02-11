// pages/topic/topic.js

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    topic: '',
    bgColor: null,
    topTipsType: 'error',
    topTipsMsg: '',
    loading: false,
    noMoreData: false,
    posts: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    var topic = options.topic
    var color = that.rdmRgbColor()
    that.setData({
      topic: topic,
      bgColor: color
    }, function() {
      wx.showLoading({
        title: '加载中',
      });

      wx.request({
        url: app.globalData.urlPrefix + '/m/index',
        data: {
          topic: topic,
          page: 1,
          size: 10
        },
        method: 'GET',
        responseType: 'text',
        success(res) {
          // console.log(res.data);
          if (res.data.code !== 0) {
            that.setData({
              topTipsType: 'error',
              topTipsMsg: '请求出错，请联系管理员',
            }, function() {
              wx.hideLoading()
            })
            return
          }
          var posts = res.data.data.posts;
          var currentPage = res.data.data.currentPage;
          var totalPage = res.data.data.totalPage;

          that.setData({
            posts: posts,
            currentPage: currentPage,
            totalPage: totalPage,
            noMoreData: currentPage >= totalPage
          }, function() {
            wx.hideLoading()
          })
        },
        fail(reason) {
          console.log(reason)
          that.setData({
            topTipsType: 'error',
            topTipsMsg: '服务器忙，请稍后再试',
          }, function() {
            wx.hideLoading()
          })
        }
      })
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

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
    var that = this
    if (that.data.noMoreData) {
      if (that.data.loading) {
        that.setData({
          loading: false,
        })
      }
      return
    }
    that.setData({
      loading: true,
    })

    wx.request({
      url: app.globalData.urlPrefix + '/m/index',
      data: {
        topic: that.data.topic,
        page: that.data.currentPage + 1,
        size: 10
      },
      method: 'GET',
      responseType: 'text',
      success(res) {
        // console.log(res.data);
        if (res.data.code !== 0) {
          that.setData({
            loading: false,
            topTipsType: 'error',
            topTipsMsg: '请求出错，请联系管理员',
          })
          return
        }
        var posts = res.data.data.posts;
        var currentPage = res.data.data.currentPage;
        var totalPage = res.data.data.totalPage;

        that.setData({
          posts: that.data.posts.concat(posts),
          currentPage: currentPage,
          totalPage: totalPage,
          noMoreData: currentPage >= totalPage,
          loading: false,
        })
      },
      fail(reason) {
        console.log(reason)
        that.setData({
          loading: false,
          topTipsType: 'error',
          topTipsMsg: '服务器忙，请稍后再试',
        })
      },
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    var that = this
    var topic = that.data.topic
    //通过右上角菜单触发
    return {
      title: '标签：' + topic,
      path: "/pages/topic/topic?from=share-menu&topic=" + topic,
      imageUrl: ''
    };
  },

  navToTopic: function(e) {
    var topic = e.currentTarget.dataset.topic
    wx.navigateTo({
      url: '/pages/topic/topic?from=topic&topic=' + topic,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },

  rdmRgbColor: function() {
    //随机生成RGB颜色
    var arr = [];
    for (var i = 0; i < 3; i++) {
      // 暖色
      arr.push(Math.floor(Math.random() * 128 + 64));
      // 亮色
      arr.push(Math.floor(Math.random() * 128 + 128));
    }
    var [r, g, b] = arr;

    // rgb颜色
    // return `rgb(${r},${g},${b})`;
    // 16进制颜色
    var color = `#${r.toString(16).length > 1 ? r.toString(16) : '0' + r.toString(16)}${g.toString(16).length > 1 ? g.toString(16) : '0' + g.toString(16)}${b.toString(16).length > 1 ? b.toString(16) : '0' + b.toString(16)}`;
    return color;
  }

})