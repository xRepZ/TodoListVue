<template>
        <div style="display: flex;">
        <div>Логин</div> 
        <input type="text" class="input" v-model="login" @keypress.enter="onLogIn">
        <div>Пароль</div>
        <input type="password" class="input" v-model="password" @keypress.enter="onLogIn">
        <button @click="onLogIn">Войти</button>        
    </div>
</template>

<script setup>
import { ref } from 'vue';
import api from '../api/api.js';
import { useRouter } from 'vue-router'
import { useToken } from '../store';

const login = ref('')
const password = ref('')

const router = useRouter()

const onLogIn = async () => {
    if ((login.value.length && password.value.length) !== 0) {
        const token = await api.postLogin(login.value, password.value)
        localStorage.setItem('token', token)
        useToken(token)
        router.push('/todo')
    } else {
        alert("Введите данные верно")
    }

}



</script>