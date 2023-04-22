const express = require('express')
const bodyParser = require('body-parser')
const port = 3050;
const { Server } = require('socket.io');
const io = new Server({
    cors: true
});

const app = express();
app.use(bodyParser.json())
app.use(express.json())

const emailToSocketMapping = new Map();
const socketToEmailMapping = new Map();

io.on('connection', (socket) => {
    socket.on("join-room", (data) => {
        const { roomId, emailId } = data;
        console.log('User', emailId, "joined Room", roomId)
        emailToSocketMapping.set(emailId, socket.id);
        socketToEmailMapping.set(socket.id, emailId)
        socket.join(roomId);
        socket.emit('joined-room', { roomId })
        socket.broadcast.to(roomId).emit('user-joined', { emailId })
    })

    socket.on("call-user", (data) => {
        const { emailId, offer } = data;
        const fromEmail = socketToEmailMapping.get(socket.id)
        const socketId = emailToSocketMapping.get(emailId)
        socket.to(socketId).emit('incomming-call', { from: fromEmail, offer })
    })

    socket.on("call-accepted", (data) => {
        const { emailId, ans } = data;
        const socketId = emailToSocketMapping.get(emailId)
        socket.to(socketId).emit('call-accepted', { ans })
    })
});

app.listen(port, (err) => {
    console.log(`server is started on port http://localhost:${port}`)
})
io.listen(4000)
