import React, { useState, useEffect } from 'react'
import queryString from 'query-string'
import { socket } from '../../helpers/socket'

import InfoBar from '../InfoBar/InfoBar'
import Input from '../Input/Input'
import Messages from '../Messages/Messages'
import TextContainer from '../TextContainer/TextContainer'

import './Chat.css'

const Chat = ({ location }) => {
  const [name, setName] = useState('')
  const [room, setRoom] = useState('')
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])
  const [users, setUsers] = useState('');

  useEffect(() => {
    const { name, room } = queryString.parse(location.search)

    setName(name)
    setRoom(room)

    socket.emit('join', { name, room }, (error) => {
      if (error) {
        alert(error)
      }
    })

    return () => {
      socket.disconnect()
      socket.off()
    }
  }, [location.search])

  useEffect(() => {
    socket.on('message', (message) => {
      setMessages(messages => [...messages, message])
    })

    socket.on("roomData", ({ users }) => {
      setUsers(users);
    })
  }, [])

  const sendMessage = (event) => {
    event.preventDefault()

    if (message) {
      socket.emit('sendMessage', message, () =>
        setMessage('')
      )
    }
    setMessage('')
  }

  const clear = () => {
    if (room) {
      socket.emit('clearRoom', room, () =>
      clear('')
      )
    }
  }

  return (
    <div className="container__wrapper">
      <div className="chat__container">
        <InfoBar room={room} clear={clear}/>
        <Messages messages={messages} name={name} />
        <Input
          message={message}
          setMessage={setMessage}
          sendMessage={sendMessage}
        />
      </div>
      <TextContainer users={users}/>
    </div>
  )
}

export default Chat
