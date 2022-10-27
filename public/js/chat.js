const url = (window.location.hostname.includes('localhost'))
    ? 'http://localhost:6060/api/auth/'
    : 'https://restserver-n0d3js.herokuapp.com/api/auth/'

let user = null
let socket = null


const txtUid = document.querySelector('#txtUid')
const txtMsg = document.querySelector('#txtMsg')
const ulUsers = document.querySelector('#ulUsers')
const ulMsg = document.querySelector('#ulMsg')
const btnOut = document.querySelector('#btnOut')


const validateJWT = async () => {

    const token = localStorage.getItem('token') || ''

    if (token.length <= 10) {
        window.location = 'index.html'
        throw new Error('No hay token en el servidor')
    }

    const resp = await fetch(url, {
        headers: { 'x-token': token }
    })

    const { userAuth, token: tokenDB } = await resp.json()

    
    localStorage.setItem('token', tokenDB)


    user = userAuth
    document.title = user.name

    await socketConect()

}


const socketConect = async () => {


    socket = io({

        'extraHeaders': {
            'x-token': localStorage.getItem('token') 
        }

    })

    socket.on('connect', () => {
        console.log('Sockets online')
    })

    socket.on('disconnect', () => {
        console.log('Sockets offline')
    })


    socket.on('recibir-mensajes', (payload) => {
        showMsjs(payload)
    })

    socket.on('usuarios-activos', (payload) => {
        showUser(payload)
    })

    // Recibir mensajes privados
    socket.on('mensaje-privado', (payload) => {
        console.log('Privado:', payload)
    })
}


const showUser = (users = []) => {

    let usersHtml = ''
    users.forEach(({ name, uid }) => {
        usersHtml += `
        
        <li>
            <p>
                <h5 class="text-success"> ${name} </h5>
                <span class="fs-6 text-muted">${uid}</span>
            </p>
        </li>
        
        `
    })

    ulUsers.innerHTML = usersHtml

}

const showMsjs = (msjs = []) => {

    let msjsHtml = ''

    msjs.forEach(({ msg, name }) => {

        msjsHtml += `
        
        <li>
            <p>
                <span class="text-primary"> ${name} </span>
                <span">${msg}</span>
            </p>
        </li>
        
        `


    })

    ulMsg.innerHTML = msjsHtml

}


txtMsg.addEventListener('keyup', e => {

    const msj = txtMsg.value
    const uid = txtUid.value

    if (e.keyCode !== 13) {
        return
    }

    if (msj.length === 0) {
        return
    }

    socket.emit('enviar-mensaje', { msj, uid })
    txtMsg.value = ''

})

const main = async () => {

    await validateJWT()

}

main()

