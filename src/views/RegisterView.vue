<template>
    <div @keypress.enter="onUserCreate">
        <div>Введите логин</div>
        <input type="text" class="input" v-model="login">
        <div>Введите пароль</div>
        <input type="password" class="input" v-model="password">
        <div>Повторите пароль</div>
        <input type="password" class="input" v-model="checkPass">
        <div class="btn ml-10 enter" @click="onUserCreate">Enter</div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import api from '../api/api.js'
import { useRouter } from 'vue-router'
import { useToken } from '../store';

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

        await api.postUser(login.value, password.value)
        const token = await api.postLogin(login.value, password.value)
        localStorage.setItem('token', token)
        useToken(token)
        router.push('/todo')
    } else {
        alert("Введите данные верно")
    }
}
</script>