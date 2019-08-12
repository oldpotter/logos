//app.js
App({
  onLaunch: function () {
    
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        traceUser: true,
      })
    }
		this.globalData = {}
		
		const _this = this
		wx.getSystemInfo({
			success: function(res) {
				// console.log(res)
				_this.globalData.screenWidth = res.screenWidth
				_this.globalData.screenHeight = res.screenHeight
				_this.globalData.pixelRatio = res.pixelRatio
				// _this.globalData.screenWidth = res.screenWidth * res.pixelRatio
			},
			fail: function(res) {},
			complete: function(res) {},
		}) 
  }
})
