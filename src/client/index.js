import React from "react"
import ReactDOM from "react-dom"
import {
  BrowserRouter as Router,
  Route, Switch
} from 'react-router-dom'
import Login from './page/login'

const Index = () => (
  <Router>
    <div>
      <Switch>
        <Route path='/login' component={Login} />
        <Route component={Login} />
      </Switch>
    </div>
  </Router>
)

ReactDOM.render(<Index />, document.getElementById("index"))
