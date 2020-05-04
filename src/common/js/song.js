import { getSongsUrl, getLyric } from 'api/song'
import { ERR_OK } from 'api/config'
import { Base64 } from 'js-base64'

/**
 * 为什么我们要把song设计成一个类而不是一个对象？
 * 第一个是因为我们把代码集中到一块，便于维护，不用写大量的重复代码
 * 第二个是类的扩展性比对象要强很多
 */
export default class Song {
  constructor ({ id, mid, singer, name, album, duration, image, url }) {
    this.id = id // 对应qq音乐接口中的singer_id
    this.mid = mid // singer_mid
    this.singer = singer // 歌手名字
    this.name = name // 歌曲名称
    this.album = album // 专辑名称
    this.duration = duration // 歌曲长度 播放时长
    this.image = image // 歌曲图片
    // this.filename = `C400${this.mid}.m4a`
    this.url = url // 歌曲真实请求路径
  }

  // 获取歌词方法
  getLyric () {
    if (this.lyric) {
      /**
       * 为什么要promise？
       * 因为我们的getLyric本身返回的就是一个promise，
       * 这个getLyric指的是getLyric方法，不是下面获取歌词的这个getLyric
       * 所以，下面的getLyric我们又用promise做了一层封装，
       *
       * 我们为什么不直接返回getLyric？
       * 可能你会问，既然我们获取歌词的getLyric返回的是一个promise，
       * 那我们为什么还要再封装一层promise呢？这是因为我们还要在获取歌词的getLyric
       * 做一层处理，而且当我们的 res.retcode 不ok的时候，我们还要进行 reject。
       * 这样的话我们外层的业务逻辑去获取到歌词的时候应该怎么做，没有获取到歌词的时候应该怎么做，
       * 就是说我们这个函数不会处理获取歌词后的处理逻辑，他的任务很简单，
       * 就是获取歌词，然后把结果返回出去。
       */
      return Promise.resolve(this.lyric)
    }

    return new Promise((resolve, reject) => {
      getLyric(this.mid).then((res) => {
        if (res.retcode === ERR_OK) {
          this.lyric = Base64.decode(res.lyric)
          resolve(this.lyric)
        } else {
          reject('no lyric')
        }
      })
    })
  }
}

/**
 * 创建Song的工厂方法
 * 为什么这么做？
 * 前面我们已经说过了，我们会在三个页面同时用到歌手的数据，而每当我们用到的时候我们都会去new Song()
 * 而经过老师的分析，这三部分用到的数据都拥有musicData，而且musicData的数据结构是相同的，
 * 所以说我们再抽象出一个工厂方法，然后我们在createSong里面去实例化Song类，
 * 这样的话我们又抽象了一层，代码量更少，
 *
 * musicData中singer是一个数组，而我们想要渲染到dom中的数据是一个字符串，
 * 如果有多个歌手我们用'/'分开，'华晨宇/bigbang'，
 * 那我们在写一个方法去处理，filterSinger()
 *
 * 在我们调用createSong()的时候有些参数是必须要传的，我们也将他写成一个函数isValidMusic
 */
export function createSong (musicData) {
  return new Song({
    id: musicData.songid,
    mid: musicData.songmid,
    singer: filterSinger(musicData.singer),
    name: musicData.songname,
    album: musicData.albumname,
    duration: musicData.interval,
    image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
    url: musicData.url
  })
}

function filterSinger (singer) {
  let ret = []
  // 边界处理
  if (!singer) {
    return ''
  }
  singer.forEach((s) => {
    ret.push(s.name)
  })
  return ret.join('/')
}

export function isValidMusic (musicData) {
  return musicData.songid && musicData.albummid
}

// 获取歌曲url(明天总结)
export function processSongsUrl (songs) {
  if (!songs.length) {
    return Promise.resolve(songs)
  }
  return getSongsUrl(songs).then((purlMap) => {
    songs = songs.filter((song) => {
      const purl = purlMap[song.mid]
      if (purl) {
        song.url = purl.indexOf('http') === -1 ? `http://dl.stream.qqmusic.qq.com/${purl}` : purl
        return true
      }
      return false
    })
    return songs
  })
}
