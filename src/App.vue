<template>
  <div>Общая часть</div>
  <div v-if="user === null">
    <RouterLink to="/">Главная</RouterLink>
    <RouterLink to="/login" style="margin-left: 10px;">Логин</RouterLink>
    <RouterLink to="/register" style="margin-left: 10px;">Регистрация</RouterLink>
    <!-- <RouterLink to="/change-pass" style="margin-left: 10px;">Изменение пароля</RouterLink> -->
  </div>
  <div v-else>
    <RouterLink to="/" style="margin-left: 10px;">Главная</RouterLink>
    <RouterLink to="/todo" style="margin-left: 10px;">Todo List</RouterLink>
    <RouterLink to="/change-pass" style="margin-left: 10px;">Изменение пароля</RouterLink>
    <button style="margin-left: 10px;" @click="logout()">Выход</button>
 
  </div>
  <RouterView />
</template>

<script setup>
import { RouterLink, RouterView, useRouter } from 'vue-router';
import { useToken, delToken, user } from './store/'

useToken(localStorage.getItem('token'))

const router = useRouter()
const logout = () => {
  delToken()
  router.push('/login')
}


</script>
