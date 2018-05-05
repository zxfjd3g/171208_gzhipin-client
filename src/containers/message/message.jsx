/*
消息界面路由容器组件
 */
import React, {Component} from 'react'
import {connect} from 'react-redux'
import {List, Badge} from 'antd-mobile'

const Item = List.Item
const Brief = Item.Brief
/*
对chatMsgs按chat_id进行分组, 并得到每个组的lastMsg组成的数组
1. 找出每个聊天的lastMsg, 并用一个对象容器来保存 {chat_id, lastMsg}
2. 得到所有lastMsg的数组
3. 对数组进行排序(按create_time降序)
 */
function getLastMsgs(chatMsgs) {
  // 1. 找出每个聊天的lastMsg, 并用一个对象容器来保存 {chat_id:lastMsg}
  const lastMsgObjs = {}
  chatMsgs.forEach(msg => {
    // 得到msg的聊天标识id
    const chatId = msg.chat_id
    // 获取已保存的当前组件的lastMsg
    let lastMsg = lastMsgObjs[chatId]
    // 没有
    if(!lastMsg) { // 当前msg就是所在组的lastMsg
      lastMsgObjs[chatId] = msg
    } else {// 有
      // 如果msg比lastMsg晚, 就将msg保存为lastMsg
      if(msg.create_time>lastMsg.create_time) {
        lastMsgObjs[chatId] = msg
      }
    }
  })

  // 2. 得到所有lastMsg的数组
  const lastMsgs = Object.values(lastMsgObjs)

  // 3. 对数组进行排序(按create_time降序)
  lastMsgs.sort(function (m1, m2) { // 如果结果<0, 将m1放在前面, 如果结果为0, 不变, 如果结果>0, m2前面
    return m2.create_time-m1.create_time
  })
  console.log(lastMsgs)
  return lastMsgs
}

class Message extends Component {

  render() {
    const {user} = this.props
    const {users, chatMsgs} = this.props.chat

    // 对chatMsgs按chat_id进行分组
    const lastMsgs = getLastMsgs(chatMsgs)


    return (
      <List style={{marginTop:50, marginBottom: 50}}>

        {
          lastMsgs.map(msg =>{
            // 得到目标用户的id
            const targetUserId = msg.to===user._id ? msg.from : msg.to
            // 得到目标用户的信息
            const targetUser = users[targetUserId]
            return (
              <Item
                key={msg._id}
                extra={<Badge text={0}/>}
                thumb={targetUser.header ? require(`../../assets/images/${targetUser.header}.png`) : null}
                arrow='horizontal'
                onClick={() => this.props.history.push(`/chat/${targetUserId}`)}
              >
                {msg.content}
                <Brief>{targetUser.username}</Brief>
              </Item>
            )
          })
        }
      </List>
    )
  }
}

export default connect(
  state => ({user: state.user, chat: state.chat}),
  {}
)(Message)