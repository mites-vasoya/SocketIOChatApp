const {instrument} = require('@socket.io/admin-ui')

const io = require('socket.io')(3000, {
    cors: {
        origin: ["http://localhost:8080", "https://admin.socket.io/"]
    }
})

const userIO = io.of("/user")
userIO.on("connection", socket => {
    console.log("Connected To User NameSpace" + socket.username)
})

userIO.use((socket, next) => {
    if (socket.handshake.auth.token) {
        socket.username = getUserNameFromToken(socket.handshake.auth.token)
        next()
    } else {
        next(new Error("Please Send Token"))
    }
})

function getUserNameFromToken(token) {
    return token;
}

io.on('connection', socket => {
    console.log(socket.id)
    socket.on('send-message', (message, room) => {
        if (room === '') {
            socket.broadcast.emit('receive-message', message)
        } else {
            socket.broadcast.to(room).emit('receive-message', message)
        }
    })
    socket.on('join-room', (room, callback) => {
        // socke t.emit('room-joined', room)
        socket.join(room)
        callback(room)
    })
    socket.on('ping', n => {
        console.log(n)
    })
})


instrument(io, {auth: false})
