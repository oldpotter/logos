Page({
  data: {
    canvasW: 0,
    canvasH: 0,
    processing: false, //保存图片中
    /**
     * path
     */
    images: null, //所有底图的路径
    currentImage: null, //当前图片
    imageRate: 0,
    /**
     * [
     * 	{
     * 		path, //logo路径
    			width, 
    			height,
    			rate // 高/宽 比
    			{
    				scale, 缩放
    				x, 坐标
    				y
    			}
     * 	}
     * ]
     */
    logos: [] //所有logo
  },

	onReady(){
		this.setData({
			canvasW: getApp().globalData.screenWidth
		})
	},

  async asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array)
    }
  },

  async savePic(src, ctx) {	
		const _this = this
    return new Promise(resolve => {
      wx.getImageInfo({
        src,
        success: function(res) {
					const rate = res.height / res.width
          _this.setData({
						canvasH: rate * _this.data.canvasW
          })
					// console.log(`w:${_this.data.canvasW}, h:${_this.data.canvasH}`)
          ctx.drawImage(res.path, 0, 0, _this.data.canvasW, _this.data.canvasH)
          ctx.draw(false, () => {
            setTimeout(()=>{
							wx.canvasToTempFilePath({
								canvasId: 'canvas',
								fileType: 'jpg',
								quality: 0.5,
								success: function (result) {
									// console.log(res.tempFilePath)
									wx.saveImageToPhotosAlbum({
										filePath: result.tempFilePath,
										success: function (res) {
											resolve()
										},
										fail: function (res) { },
										complete: function (res) { },
									})
								},
								fail: function (res) {
									console.error(res)
								},
								complete: function (res) { },
							}, _this)
						}, 1000)
          })
        },
        fail: function(res) {},
        complete: function(res) {},
      })
    })

  },

  //保存图片
  onClickSave() {
    const _this = this
    this.setData({
      processing: true
    })
		const ctx = wx.createCanvasContext('canvas', this)

    this.asyncForEach(this.data.images, async(path, index, images) => {
      wx.showLoading({
        title: `正在保存${index + 1}/${images.length}张`
      })
      await this.savePic(path, ctx)
      wx.hideLoading()
			if(index + 1 == images.length){
				this.setData({
					processing: false
				})
			}
    })
  },

  //logo移动位置
  onLogoChange(e) {
    console.log(e)
  },

  //logo改变大小
  onLogoScale(e) {
    console.log(e)
  },

  //选择一个logo
  onChooseLogo() {
    const _this = this
    wx.chooseImage({
      count: 1,
      success: function(res) {
        const path = res.tempFilePaths[0]
        wx.getImageInfo({
          src: path,
          success: function(res) {
            let {
              width,
              height
            } = res
            // console.log(`width: ${width}, height: ${height}`)
            let rate = 0
            rate = res.height / res.width
            let logo = {
              path,
              width,
              height,
              rate
            }
            let logos = _this.data.logos
            logos.push(logo)
            _this.setData({
              logos
            })
            console.log(_this.data.logos)
          },
          fail: function(res) {},
          complete: function(res) {},
        })
      },
    })
  },

  //添加底图
  onClickAddImage() {
    const _this = this
    wx.chooseImage({
      success(res) {
        let images = _this.data.images
        images = res.tempFilePaths.concat(images)
        // console.log(images)
        _this.setData({
          images,
          currentImage: images[0]
        })
        _this.onClickImage()
      }
    })
  },

  //点击一张缩略图
  onClickImage(e, index = 0) {
    const _this = this
    if (e) {
      index = e.currentTarget.dataset.index
    }
    wx.getImageInfo({
      src: this.data.images[index],
      success: function(res) {
        let rate = 0
        rate = res.height / res.width
        _this.setData({
          currentImage: _this.data.images[index],
          imageRate: rate
        })
        // console.log(_this.data.imageRate)
      },
      fail: function(res) {},
      complete: function(res) {},
    })

  },

  //选择图片
  onChooseImage() {
    const _this = this
    wx.chooseImage({
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        const images = res.tempFilePaths
        // console.log(res)
        _this.setData({
          images,
          currentImage: images[0]
        })
        _this.onClickImage()
      }
    })
  }
})