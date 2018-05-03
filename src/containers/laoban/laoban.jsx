/*
老板主界面路由容器组件
 */
import React, {Component} from 'react'
import {connect} from 'react-redux'

class Laoban extends Component {
  render () {
    return (
      <div>Laoban</div>
    )
  }
}

export default connect(
  state => ({}),
  {}
)(Laoban)