import express from 'express'
import path from 'path'

const app = express()

app.use(express.static(path.join('./', 'dist')))

app.get('/api', (req, res) => {
  res.send({api: 'test'})
})

app.get('*', function (req, res) {
  res.sendFile(path.join('./', 'dist', 'index.html'))
})

app.listen(3000, ()=> {
  console.log('server running')
})

app.get('/api/adduser', (req, res) => {
  const userid = req.query.userid
  const passwd = req.query.passwd
  if (userid === '' || passwd === '') {
    return res.json({status: false, msg: '入力項目が空です'})
  }
  db.getUser(userid, (user) => {
    if (user) {
      return res.json({status: false, msg: '既にユーザーが存在しています'})
    }
    db.addUser(userid, passwd, (token) => {
      if (!token) {
        res.json({status: false, msg: 'データベースエラー'})
      }
      res.json({status: true, token})
    })
  })
})
app.get('/api/login', (req, res) => {
  const userid = req.query.userid
  const passwd = req.query.passwd
  db.login(userid, passwd, (err, token) => {
    if (err) {
      res.json({status: false, msg: 'ログインに失敗しました'})
      return
    }
    res.json({status: true, token})
  })
})
