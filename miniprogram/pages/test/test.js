Page({
  onReady() {
    const _this = this
    const arr = [1, 2, 3]
    this.asyncForEach(arr, async(num) => {
      await _this.print(num)
			await _this.print2(num)
    })
  },

  async print(num) {
    return new Promise(resolve => {
      setTimeout(() => {
        console.log(`num is ${num}`)
        resolve()
      }, 1000)

    })
  },


  async print2(num) {
    return new Promise(resolve => {
      setTimeout(() => {
        console.log(`number is ${num}`)
        resolve()
      }, 1000)

    })
  },

  async asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array)
    }
  },
})