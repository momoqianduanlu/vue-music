import storage from 'good-storage'

const SEARCH_KEY = '__search__'
const SEARCH_MAX_LEN = 15

const PLAY_KEY = '__play__'
const PLAY_MAX_LEN = 200

const FAVORITE_KEY = '__favorite__'
const FAVORITE_MAX_LEN = 200

/**
 * arr要保存到的数组, val要保存的值，compare是一个比较函数，maxLen最大保存个数。
 * index === 0 数组中的第一条数据，我们就什么都不做，因为数组中只有一条数据，我们就直接原样返回这条数据
 * index > 0 数组中存在与query重复的数据，那我们就删除重复的那条数据，删掉以后我们将新数据插入到数组中的第一个位置
 * arr.unshift(val)。
 * maxLen && arr.length > maxLen 如果arr超出了最大长度，这种情况我们就要把数组的最后一个给pop出来。
 */
function insertArray (arr, val, compare, maxLen) {
  const index = arr.findIndex(compare)
  if (index === 0) {
    return
  }
  if (index > 0) {
    arr.splice(index, 1)
  }
  arr.unshift(val)
  if (maxLen && arr.length > maxLen) {
    arr.pop()
  }
}

function deleteFromArray (arr, compare) {
  const index = arr.findIndex(compare)
  if (index > -1) {
    arr.splice(index, 1)
  }
}

/**
 * 首先我们要得到一个当前的存储空间(也就是说我们没有存过的话他就是一个空数组)。

 * 接下来就把query插入到searches数组中，我们的插入逻辑是我们这个数组最大只能存15条数据，
 * 我们每次插入的数据都会插入到数组的前面，如果说我们数组中有重复的数据我们就要把重复的数据给删掉，
 * 然后把新的数据插入到前面，也就是我们最新搜索的数据总是展现在列表的最前面，所以我们去定义一个函数insertArray。

 * 调用insertArray，compare就是findIndex的回调函数。
   (item) => {
    return item === query
   }
 */
export function saveSearch (query) {
  let searches = storage.get(SEARCH_KEY, [])
  insertArray(searches, query, (item) => {
    return item === query
  }, SEARCH_MAX_LEN)
  storage.set(SEARCH_KEY, searches)
  return searches
}

export function loadSearch () {
  return storage.get(SEARCH_KEY, [])
}

export function deleteSearch (query) {
  let searches = storage.get(SEARCH_KEY, [])
  deleteFromArray(searches, (item) => {
    return item === query
  })
  storage.set(SEARCH_KEY, searches)
  return searches
}

export function clearSearch () {
  storage.remove(SEARCH_KEY)
  return []
}

export function savePlay (song) {
  let songs = storage.get(PLAY_KEY, [])
  insertArray(songs, song, (item) => {
    return song.id === item.id
  }, PLAY_MAX_LEN)
  storage.set(PLAY_KEY, songs)
  return songs
}

export function loadPlay () {
  return storage.get(PLAY_KEY, [])
}

export function saveFavorite (song) {
  let songs = storage.get(FAVORITE_KEY, [])
  insertArray(songs, song, (item) => {
    return song.id === item.id
  }, FAVORITE_MAX_LEN)
  storage.set(FAVORITE_KEY, songs)
  return songs
}

export function deleteFavorite (song) {
  let songs = storage.get(FAVORITE_KEY, [])
  deleteFromArray(songs, (item) => {
    return item.id === song.id
  })
  storage.set(FAVORITE_KEY, songs)
  return songs
}

export function loadFavorite () {
  return storage.get(FAVORITE_KEY, [])
}

