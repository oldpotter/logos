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
    			rate // 高/宽 比
					scale, //缩放
					location: //基本位置, 四种值'ul'(左上), 'ur'（上右）, 'bl'(下左), 'br'(下右)
					path,
					width，
					height
     * 	}
     * ]
     */
    logos: [], //所有logo
  },


  //添加logo
  onClickAddLogo() {
    const _this = this
    wx.chooseImage({
      count: 3,
       
      success: function(res) {
        res.tempFilePaths.forEach(path => {
          // console.log(path)
          wx.getImageInfo({
            src: path,
            success: function(res) {
              let {
                width,
                height
              } = res
              let rate = height / width
              // console.log(`logo原始大小：width: ${width}, height: ${height}`)
              // width = getApp().globalData.screenWidth / 10
              // height = rate * width
              // console.log(`logo新大小：width: ${width}, height: ${height}`)
              let logo = {
                path,
                width,
                height,
                rate,
                location: 'br',
              }
              let logos = _this.data.logos
              logos.push(logo)
              _this.setData({
                logos
              })
							/*
              var query = wx.createSelectorQuery()
              query.select("#move-view-0").boundingClientRect()
              // query.select("#move-area").boundingClientRect()
              query.exec(function(res) {
                res.forEach(res => {
									console.log(res)
                  // console.log(`id: ${res.id}, width: ${res.width}, height: ${res.height}`)
                })
              });
              console.log(`screenWidth: ${getApp().globalData.screenWidth}`)
							*/
              // _this.onClickImage()
            },
            fail: function(res) {},
            complete: function(res) {},
          })
        })

      },
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
          _this.setData({
            canvasW: res.width,
            canvasH: res.height
          })
          const rate = res.width / getApp().globalData.screenWidth
          // console.log(`w:${_this.data.canvasW}, h:${_this.data.canvasH}`)
          ctx.drawImage(res.path, 0, 0)
          if (_this.data.logos.length > 0) {
            const logo = _this.data.logos[0]
            ctx.drawImage(logo.path, 0, 0, logo.width * rate, logo.height * rate)
          }
          ctx.draw(false, () => {
            setTimeout(() => {
              wx.canvasToTempFilePath({
                canvasId: 'canvas',
                fileType: 'jpg',
                quality: 1,
                success: function(result) {
                  // console.log(res.tempFilePath)
                  wx.saveImageToPhotosAlbum({
                    filePath: result.tempFilePath,
                    success: function(res) {
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
      if (index + 1 == images.length) {
        this.setData({
          processing: false
        })
      }
    })
  },

  //logo移动位置
  onLogoChange(e) {
    console.log(`onLogoChange, x： ${e.detail.x}, y: ${e.detail.y}`)
  },

  //logo改变大小
  onLogoScale(e) {
    console.log('onLogoScale:', e)
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
          imageRate: rate,
          currentImageWidth: getApp().globalData.screenWidth,
          currentImageHeight: getApp().globalData.screenWidth * rate,
        })
        // console.log(`currentImageWidth: ${_this.data.currentImageWidth}, currentImageHeight: ${_this.data.currentImageHeight}`)
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