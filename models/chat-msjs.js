class Msg {
    constructor(uid, name, msg) {
        this.uid = uid
        this.name = name
        this.msg = msg
    }
}

class ChatMsjs {
    constructor() {
        this.mesagges = []
        this.users = {}
    }

    get last10() {
        this.mesagges = this.mesagges.splice(0, 10)
        return this.mesagges
    }

    get usersArr() {
        return Object.values(this.users) 
    }

    sendMsg(uid, name, msj) {
        this.mesagges.unshift(
            new Msg(uid, name, msj)
        )
    }

    connectUser(user) {
        this.users[user.id] = user
    }

    disconnectUser(id) {
        delete this.users[id]
    }
}

module.exports = ChatMsjs