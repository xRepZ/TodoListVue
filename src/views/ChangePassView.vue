<template>
    <div>
        <div>Старый пароль</div>
        <input type="password" class="input" v-model="oldPassword" @keypress.enter="onChangePass">
        <div>Новый пароль</div>
        <input type="password" class="input" v-model="newPassword" @keypress.enter="onChangePass">
        <div>Повторите пароль</div>
        <input type="password" class="input" v-model="newPasswordCheck" @keypress.enter="onChangePass">
        <button style="margin-left: 10px;" @click="onChangePass">Изменить пароль</button>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import api from '../api/api.js';
import { useRouter } from 'vue-router'
import { useToken } from '../store';

const newPasswordCheck = ref('')
const oldPassword = ref('')
const newPassword = ref('')

const router = useRouter()

const onChangePass = async () => {
    if (
        (
            newPasswordCheck.value.length &&
            oldPassword.value.length &&
            newPassword.value.length
        ) !== 0 &&
        newPassword.value === newPasswordCheck.value
    ) {
        
        api.changePassword(oldPassword.value, newPassword.value)
        //const token = await api.postLogin(login.value, password.value)
        //localStorage.setItem('token', token)
        //useToken(token)
        //router.push('/todo')
    } else {
        alert("Введите данные верно")
    }

}



</script>