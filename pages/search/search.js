// pages/search/search.js

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    topTipsType: 'error',
    topTipsMsg: '',
    focus: true,
    loading: false,
    inputValue: '',
    hits: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

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
  onReachBottom: function () {
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
      url: app.globalData.urlPrefix + '/m/search/' + that.data.inputValue,
      data: {
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
        var hits = res.data.data.hits;
        var currentPage = res.data.data.currentPage;
        var totalPage = res.data.data.totalPage;
        that.setData({
          hits: that.data.hits.concat(hits),
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
      }
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  navToTopic: function (e) {
    var topic = e.currentTarget.dataset.topic
    wx.navigateTo({
      url: '/pages/topic/topic?from=search&topic=' + topic,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },

  bindKeyInput: function(e) {
    this.setData({
      inputValue: e.detail.value
    })
  },
  bindConfirmEvent: function(e) {
    var that = this
    console.log(this.data.inputValue)
    if (!this.data.inputValue) {
      this.setData({
        topTipsMsg: '搜索内容不能为空',
      })
      return
    }

    wx.showLoading({
      title: '加载中',
    });

    wx.request({
      url: app.globalData.urlPrefix + '/m/search/' + that.data.inputValue,
      data: {
        page: 1,
        size: 10
      },
      header: {
        'content-type': 'application/json'
      },
      success(res) {
        // console.log(res.data);
        if (res.data.code !== 0) {
          that.setData({
            topTipsType: 'error',
            topTipsMsg: '请求出错，请联系管理员',
          })
          return
        }
        var hits = res.data.data.hits;
        var currentPage = res.data.data.currentPage;
        var totalPage = res.data.data.totalPage;

        that.setData({
          hits: hits,
          currentPage: currentPage,
          totalPage: totalPage,
          noMoreData: currentPage >= totalPage
        })
      },
      fail(reason) {
        console.log(reason)
        that.setData({
          topTipsType: 'error',
          topTipsMsg: '服务器忙，请稍后再试',
        })
      },
      complete() {
        wx.hideLoading()
      }
    })
  }
})