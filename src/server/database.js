const path = require('path')
const NeDB = require('nedb')

const userDB = new NeDB({
  filename: path.join(__dirname, 'user.db'),
  autoload: true
})

function getHash (pw) {
  const salt = 'FreddieMercury'
  const crypto = require('crypto')
  const hashsum = crypto.createHash('sha512')
  hashsum.update(pw + salt)
  return hashsum.digest('hex')
}
function getAuthToken (userid) {
  const time = (new Date()).getTime()
  return getHash(`${userid}:${time}`)
}

// 以下、API
// ユーザー取得
function getUser (userid, callback) {
  userDB.findOne({userid}, (err, user) => {
    if (err || user === null) return callback(null)
    callback(user)
  })
}
// ユーザー追加
function addUser (userid, passwd, callback) {
  const hash = getHash(passwd)
  const token = getAuthToken(userid)
  const regDoc = {userid, hash, token, friends: {}}
  userDB.insert(regDoc, (err, newdoc) => {
    if (err) return callback(null)
    callback(token)
  })
}
// ログイン
function login (userid, passwd, callback) {
  const hash = getHash(passwd)
  const token = getAuthToken(userid)
  getUser(userid, (user) => {
    if (!user || user.hash !== hash) {
      return callback(new Error('認証エラー'), null)
    }
    user.token = token
    updateUser(user, (err) => {
      if (err) return callback(err, null)
      callback(null, token)
    })
  })
}
// トークンチェック
function checkToken (userid, token, callback) {
  getUser(userid, (user) => {
    if (!user || user.token !== token) {
      return callback(new Error('認証エラー'), null)
    }
    callback(null, user)
  })
}
// ユーザー更新
function updateUser (user, callback) {
  userDB.update({userid: user.userid}, user, {}, (err, n) => {
    if (err) return callback(err, null)
    callback(null)
  })
}

module.exports = {
  userDB, getUser, addUser, login, checkToken, updateUser
}
