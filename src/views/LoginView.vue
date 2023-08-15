<template>
    <div class="register">
        <div class="mt-10">Логин</div>
        <input type="text" class="input mt-5" v-model="login" @keypress.enter="onLogIn">
        <div class="mt-10">Пароль</div>
        <input type="password" class="input mt-5" v-model="password" @keypress.enter="onLogIn">
        <div class="btn mt-10" @click="onLogIn">Войти</div>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import api from '../api/api.js';
import { useRouter } from 'vue-router'
import { useToken } from '../store';

const login = ref('')
const password = ref('')

const router = useRouter()

onMounted(() => {
    if (localStorage.getItem('token')) {
        router.push('/todo')
        return
    }
})

const onLogIn = async () => {
    if ((login.value.length && password.value.length) !== 0) {
        try {
            const token = await api.postLogin(login.value, password.value)
            localStorage.setItem('token', token)
            useToken(token)
            router.push('/todo')
        } catch (err) {
            alert(err.response.data.payload)
        }

    } else {
        alert("Введите данные верно")
    }

}



</script>