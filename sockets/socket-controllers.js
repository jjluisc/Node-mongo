const { Socket } = require("socket.io")
const { checkJWT } = require("../helpers")
const { ChatMsjs } = require('../models')

const chatMsjs = new ChatMsjs()


const socketController = async (socket = new Socket(), io) => {

    const token = socket.handshake.headers['x-token'] 
    const user = await checkJWT(token)

    if (!user) {
        return socket.disconnect()
    }


    chatMsjs.connectUser(user)
    io.emit('usuarios-activos', chatMsjs.usersArr)
    socket.emit('recibir-mensajes', chatMsjs.last10)

    socket.join(user.id) 
    socket.on('disconnect', () => {
        chatMsjs.disconnectUser(user.id)
        io.emit('usuarios-activos', chatMsjs.usersArr)
    })

    socket.on('enviar-mensaje', ({ uid, msj }) => {

        if (uid) {
            socket.to(uid).emit('mensaje-privado', { de: user.name, msj })

        } else {


            chatMsjs.sendMsg(user.id, user.name, msj)
            console.log(chatMsjs.last10)
            io.emit('recibir-mensajes', chatMsjs.last10)
        }

    })

}

module.exports = {
    socketController
}