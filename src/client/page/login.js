import React, {Component} from 'react'
import request from 'superagent'
import {Redirect} from 'react-router-dom'

export default class Login extends Component {
  constructor (props) {
    super(props)
    this.state = { userid: '', passwd: '', redirect: '', msg: '' }
  }
  api (command) {
    request
      .get('/api/' + command)
      .query({
        userid: this.state.userid,
        passwd: this.state.passwd
      })
      .end((err, res) => {
        if (err) return
        const r = res.body
        console.log(r)
        if (r.status && r.token) {
          window.localStorage['id'] = this.state.userid
          window.localStorage['token'] = r.token
          return
        }
        this.setState({msg: r.msg})
      })
  }
  render () {
    if (this.state.redirect) {
      return <Redirect to={this.state.redirect} />
    }
    const changed = (name, e) => this.setState({[name]: e.target.value})
    return (
      <div>
        <h1>ログイン</h1>
        <div>
          ユーザID:<br />
          <input value={this.state.userid}
                 onChange={e => changed('userid', e)} /><br />
          パスワード:<br />
          <input type='password' value={this.state.passwd}
                 onChange={e => changed('passwd', e)} /><br />
          <button onClick={e => this.api('login')}>ログイン</button><br />
          <p>{this.state.msg}</p>
          <p><button onClick={e => this.api('adduser')}>
            ユーザ登録</button></p>
        </div>
      </div>
    )
  }
}
