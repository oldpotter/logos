// miniprogram/pages/test/test.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    w: 1000,
    h: 1000,
    paths: '../../images/fj.jpg',
    src: null
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
    const _this = this
    const paths = [
      '../../images/1.jpg',
      '../../images/2.jpg',
      '../../images/3.jpg',
      '../../images/4.jpg',
      '../../images/5.jpg',
    ]
    this.asyncForEach(paths, async(path, index) => {
      await _this.savePic(path)
    })


  },

  async savePic(path) {
    const _this = this
    return new Promise((resolve, reject) => {
      wx.getImageInfo({
        src: path,
        success: function(res) {
          _this.setData({
            w: res.width,
            h: res.height
          })
          const ctx = wx.createCanvasContext('test', _this)
          ctx.drawImage(path, 0, 0)
          ctx.draw(false, () => {
            wx.canvasToTempFilePath({
              canvasId: 'test',
              success: function(res) {
                console.log(res.tempFilePath)
                _this.setData({
                  src: res.tempFilePath
                })
                wx.saveImageToPhotosAlbum({
                  filePath: res.tempFilePath,
                  success: function(res) {
                    console.log(`保存成功`, res)
										resolve()
                  },
                  fail: function(res) {},
                  complete: function(res) {},
                })
              },
              fail: function(res) {
                console.error(res)
              },
              complete: function(res) {},
            }, _this)
          })
        },
        fail: function(res) {},
        complete: function(res) {},
      })
    })

  },

  async asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array)
    }
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
  onShareAppMessage: function() {

  }
})