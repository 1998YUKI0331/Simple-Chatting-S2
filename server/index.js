const express = require('express')
const socketio = require('socket.io')
const http = require('http')
const cors = require('cors')
const router = require('./router')
const { addUser, removeUser, getUser, getUsersInRoom, getNoticeInRoom, setNoticeInRoom } = require('./users')

const app = express()
const server = http.createServer(app)
const io = socketio(server, { cors: { origin: '*' } })
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(router)

io.on('connection', (socket) => {
  console.log('new connection')

  socket.on('join', ({ name, room }, callback) => {
    const { error, user } = addUser({
      id: socket.id,
      name,
      room,
    })

    if (error) return callback(error)

    socket.join(user.room)

    socket.emit('message', {
      user: 'admin',
      text: `${user.name}, welcome to room ${user.room}`,
    })
    socket.broadcast.to(user.room).emit('message', {
      user: 'admin',
      text: `${user.name}, has joined`,
    })

    io.to(user.room).emit('roomData', {
      room: user.room,
      users: getUsersInRoom(user.room),
    })

    io.to(user.room).emit('noticeMessage', {
      user: user.name,
      text: getNoticeInRoom(user.room),
    })

    callback()
  })

  socket.on('sendMessage', (message, callback) => {
    const user = getUser(socket.id)

    io.to(user.room).emit('message', {
      user: user.name,
      text: message,
    })
    io.to(user.room).emit('roomData', {
      room: user.room,
      users: getUsersInRoom(user.room),
    })

    callback()
  })

  socket.on('sendNotice', (notice, callback) => {
    const user = getUser(socket.id)

    io.to(user.room).emit('noticeMessage', {
      user: user.name,
      text: setNoticeInRoom(user.room, notice),
    })

    callback()
  })

  socket.on('disconnect', () => {
    const user = removeUser(socket.id)

    user && io.to(user.room).emit('message', {
      user: 'admin',
      text: `${user.name} has left`,
    })
  })

  socket.on('clearRoom', () => {
    const user = getUser(socket.id)
    const users = getUsersInRoom(user.room)
    users.forEach(user => removeUser(user))

    io.to(user.room).emit('message', {
      user: 'admin',
      text: '채팅이 종료되었습니다',
    })
  })
})

server.listen(PORT, () =>
  console.log(`Server working on port ${PORT}`)
)
