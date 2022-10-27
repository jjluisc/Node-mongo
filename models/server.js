const express = require('express')
const cors = require('cors')
const fileUpload = require('express-fileupload')

const { dbConnection } = require('../db/config.db')
const { socketController } = require('../sockets/socket-controllers')

class Server {

    constructor() {
        this.app = express()
        this.port = process.env.PORT
        this.server = require('http').createServer(this.app)
        this.io = require('socket.io')(this.server)

        this.usersRoutePath = '/api/user'
        this.authPath = '/api/auth'
        this.categoryPath = '/api/category'
        this.productPath = '/api/products'
        this.search = '/api/search'
        this.upload = '/api/uploads'

        this.connectBD()

        this.middlewares()

        this.routes()

        this.sockets()
    }

    async connectBD() {
        await dbConnection()
    }

    middlewares() {
        this.app.use(cors())
        this.app.use(express.json())
        this.app.use(express.static('public'))
        this.app.use(fileUpload({
            useTempFiles: true,
            tempFileDir: '/tmp/',
            createParentPath: true
        }));

    }

    routes() {
        this.app.use(this.upload, (require('../routes/upload.routes')))
        this.app.use(this.authPath, (require('../routes/auth.routes')))
        this.app.use(this.usersRoutePath, (require('../routes/user.routes')))
        this.app.use(this.categoryPath, (require('../routes/category.routes')))
        this.app.use(this.productPath, (require('../routes/product.routes')))
        this.app.use(this.search, (require('../routes/search.routes')))
    }

    sockets() {
        this.io.on('connection', (socket) => socketController(socket, this.io))
    }

    listen() {
        this.server.listen(this.port, () => {
            console.log(`server corriendo en puerto: ${this.port}`)
        })
    }

}

module.exports = Server