import { ref } from 'vue'

export const user = ref(null)

export const useToken = (token) => {
    if (!token) return
    console.log(token)
    user.value = JSON.parse(atob(token.split('.')[0]))
}

export const delToken = () => {
    console.log("del")
    user.value = null
    localStorage.clear()
}