/*
对话聊天的路由组件
 */

import React, {Component} from 'react'
import {NavBar, List, InputItem} from 'antd-mobile'
import {connect} from 'react-redux'
import {sendMsg} from '../../redux/actions'


const Item = List.Item

class Chat extends Component {

  state = {
    content: ''
  }

  handleSend = () => {
    // 收集数据
    const from = this.props.user._id
    const to = this.props.match.params.userid
    const content = this.state.content.trim()
    // 发送请求(发消息)
    if(content) {
      this.props.sendMsg({from, to, content})
    }
    // 清除输入数据
    this.setState({content: ''})
  }
  render() {
    const {user} = this.props
    const {users, chatMsgs} = this.props.chat

    // 计算当前聊天的chatId
    const meId = user._id
    if(!users[meId]) { // 如果还没有获取数据, 直接不做任何显示
      return null
    }
    const targetId = this.props.match.params.userid
    const chatId = [meId, targetId].sort().join('_')

    // 对chatMsgs进行过滤
    const msgs = chatMsgs.filter(msg => msg.chat_id===chatId)

    // 得到目标用户的header图片对象
    const targetHeader = users[targetId].header
    const targetIcon = targetHeader ? require(`../../assets/images/${targetHeader}.png`) : null

    return (
      <div id='chat-page'>
        <NavBar>aa</NavBar>
        <List>
          {
            msgs.map(msg => {
              if(targetId===msg.from) {// 对方发给我的
                return (
                  <Item
                    key={msg._id}
                    thumb={targetIcon}
                  >
                    {msg.content}
                  </Item>
                )
              } else { // 我发给对方的
                return (
                  <Item
                    key={msg._id}
                    className='chat-me'
                    extra='我'
                  >
                    {msg.content}
                  </Item>
                )
              }
            })
          }
        </List>

        <div className='am-tab-bar'>
          <InputItem
            placeholder="请输入"
            value={this.state.content}
            onChange={val => this.setState({content: val})}
            extra={
              <span onClick={this.handleSend}>发送</span>
            }
          />
        </div>
      </div>
    )
  }
}

export default connect(
  state => ({user: state.user, chat: state.chat}),
  {sendMsg}
)(Chat)