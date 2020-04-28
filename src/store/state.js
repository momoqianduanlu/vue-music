import { playMode } from 'common/js/config'

const state = {
  singer: {},
  playing: false, // 播放器状态 播放或暂停
  fullScreen: false, // 播放器展开或收起
  playlist: [], // 播放列表
  seqenceList: [], // 歌曲列表[他是有顺序的]
  mode: playMode.sequence, // 播放模式
  currentIndex: -1 // 当前播放的歌曲
}

export default state
