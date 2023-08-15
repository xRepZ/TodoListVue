<template>
    <div class="register" @keypress.enter="onUserCreate">
     
        <div class="mt-10">Введите логин: </div>
        <input type="text" class="input mt-5" v-model="login">
        <div class="mt-10">Введите пароль: </div>
        <input type="password" class="input mt-5" v-model="password">
        <div class="mt-10">Повторите пароль: </div>
        <input type="password" class="input mt-5" v-model="checkPass">
        <div class="btn mt-10 enter" @click="onUserCreate">Вход</div>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import api from '../api/api.js'
import { useRouter } from 'vue-router'
import { useToken } from '../store'


const login = ref('')
const password = ref('')
const checkPass = ref('')
const router = useRouter()


const onUserCreate = async () => {
    if ((login.value.length && password.value.length && checkPass.value.length) !== 0) {
        if (password.value !== checkPass.value) {
            alert("Пароли на совпадают")
            return
        }

        await api.postReg(login.value, password.value)
        const token = await api.postLogin(login.value, password.value)
        localStorage.setItem('token', token)
        useToken(token)
        await api.createProfile()
  
        router.push('/todo')
    } else {
        alert("Введите данные верно")
    }
}
</script>