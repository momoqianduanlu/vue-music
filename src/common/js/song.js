import { getSongsUrl } from 'api/song'
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
