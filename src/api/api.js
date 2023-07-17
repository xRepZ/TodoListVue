import axios from 'axios';
import { user } from '../store'

const assertTokenIsAlive = () => {
    if (user.expires < Date.now()) {
        user.value = null
        localStorage.removeItem('token')
        throw new Error('Токен истёк')
    }
}

const getAuthOptions = (options) => {
    if (!options) {
        options = {}
    }
    if (!options.headers) {
        options.headers = {}
    }
    if (!options.headers['Access-Token']) {
        options.headers['Access-Token'] = localStorage.getItem('token')
    }
    return options
}

const simpleRequest = {
    get: async (url, options) => {
        return await axios.get(url, options).then(r => r.data.payload)
    },
    post: async (url, data, options) => {
        return await axios.post(url, data, options).then(r => r.data.payload)
    },
    put: async (url, data, options) => {
        return await axios.put(url, data, options).then(r => r.data.payload)
    },
    delete: async (url, options) => {
        return await axios.delete(url, options).then(r => r.data.payload)
    }
}

const authRequest = {
    get: async (url, options) => {
        assertTokenIsAlive()
        return await axios.get(url, getAuthOptions(options)).then(r => r.data.payload)
    },
    post: async (url, data, options) => {
        assertTokenIsAlive()
        return await axios.post(url, data, getAuthOptions(options)).then(r => r.data.payload)
    },
    put: async (url, data, options) => {
        assertTokenIsAlive()
        return await axios.put(url, data, getAuthOptions(options)).then(r => r.data.payload)
    },
    delete: async (url, options) => {
        assertTokenIsAlive()
        return await axios.delete(url, getAuthOptions(options)).then(r => r.data.payload)
    }
}

const api = {
    postUser: (login, password) => {
        return simpleRequest.post('/api/reg', {
            login,
            password
        })
    },
    postLogin: (login, password) => {
        return simpleRequest.post('/api/login', {
            login,
            password
        })
    },
    changePassword: (oldPassword, newPassword) => {
        return authRequest.post('/api/change-pass', {
            oldPassword,
            newPassword
        })
    },
    getList: () => {
        return authRequest.get('/api/todos')
    },
    postTodo: (inputText) => {
        return authRequest.post('/api/todo', {
            text: inputText,
        })
    },
    putDone: (data) => {
        return authRequest.put('/api/todo', data)
    },
    deleteEl: (id) => {
        return authRequest.delete(`/api/todo?id=${id}`)
    },
    deleteDone: () => {
        return authRequest.delete(`/api/todos?filter=done`)
    },
    deleteAll: () => {
        return authRequest.delete(`/api/todos`)
    }
}

export default api
