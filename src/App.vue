<template>
  <Teleport to="head">
    <meta name="viewport" :content="screenWidth <= 460 ? 'width=460' : (screenWidth <= 900 ? 'width=900' : 'width=device-width, initial-scale=1.0')" />
  </Teleport>
  <div v-if="user === null">
    <ul class="menu-bar">
      <li>
        <RouterLink to="/">Главная</RouterLink>
      </li>
      <li>
        <RouterLink to="/login">Логин</RouterLink>
      </li>
      <li>
        <RouterLink to="/register">Регистрация</RouterLink>
      </li>
    </ul>
  </div>
  <div v-else>
    <ul class="menu-bar">
      <li>
        <RouterLink to="/">Главная</RouterLink>
      </li>
      <li>
        <RouterLink to="/todo">Todo List</RouterLink>
      </li>
      <li>
        <RouterLink to="/change-pass">Изменение пароля</RouterLink>
      </li>
      <li>
        <RouterLink to="/profile">Профиль</RouterLink>
      </li>
      <li>
        <div class="btn" @click="logout()">Выход</div>
      </li>
    </ul>

  </div>



 <!-- <div v-if="user === null">
    <RouterLink to="/">Главная</RouterLink>
    <RouterLink to="/login" style="margin-left: 10px;">Логин</RouterLink>
    <RouterLink to="/register" style="margin-left: 10px;">Регистрация</RouterLink>
  </div>
  <div v-else>
    <RouterLink to="/" style="margin-left: 10px;">Главная</RouterLink>
    <RouterLink to="/todo" style="margin-left: 10px;">Todo List</RouterLink>
    <RouterLink to="/change-pass" style="margin-left: 10px;">Изменение пароля</RouterLink>
    <RouterLink to="/profile" style="margin-left: 10px;">Профиль</RouterLink>
    <button style="margin-left: 10px;" @click="logout()">Выход</button>

  </div> -->
  <RouterView />
</template>

<script setup>
// import './assets/css/app.css'
import { RouterLink, RouterView, useRouter } from 'vue-router';
import { useToken, delToken, user } from './store/'
import { ref, onMounted, onUnmounted } from 'vue';

useToken(localStorage.getItem('token'))

const router = useRouter()
const logout = () => {
  delToken()
  router.push('/login')
}

// 460, 900
const screenWidth = ref(window.innerWidth)
const onResize = () => {
  screenWidth.value = window.outerWidth
}
onMounted(() => {
  window.addEventListener('resize', onResize)
})
onUnmounted(() => {
  window.removeEventListener('resize', onResize)
})

</script>

<style>
.body {
    height: 100vh;
    margin: 0;
    display: flex;
    flex-flow: row wrap;
    justify-content: center;
    /* width: 80%; */
    /* max-width: 720px; */
}

/* Средние экраны */
@media all and (max-width: 900px) {
    body {
      /* На экранах среднего размера мы центрируем элементы, равномерно распределяя пустое пространство вокруг элементов */
      /* justify-content: center; */
      justify-content: space-around;
    }
  }
  
  /* Маленькие экраны */
  /* @media all and (max-width: 900px) {
    body {

      
      flex-direction: column;
    }
  } */

  @media all and (max-width: 460px) {
    body {
      /* На маленьких экранах мы больше не используем направление строки, а используем столбец */
      justify-content:left;
      flex-direction: column;
      margin-left: 10px;
    }
    .menu-bar {
        justify-content:left;
        flex-direction: column;

    }
  }

.menu-bar {
    border-radius: 25px;
    height: -webkit-fit-content;
    height: -moz-fit-content;
    height: fit-content;
    display: flex;
    background-color: rgba(149, 141, 196, 0.4);
    -webkit-backdrop-filter: blur(10px);
    backdrop-filter: blur(10px);
    align-items: center;
    padding: 0 10px;
    margin: 50px 0 0 0;
}

.menu-bar li {
    list-style: none;
    color: white;
    font-family: sans-serif;
    font-weight: bold;
    padding: 12px 16px;
    margin: 0 8px;
    position: relative;
    cursor: pointer;
    white-space: nowrap;
}

.menu-bar li::before {
    content: " ";
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    z-index: -1;
    transition: 0.2s;
    border-radius: 25px;
}

.menu-bar li:hover {
    color: black;
}

.menu-bar li:hover::before {
    background: linear-gradient(to bottom, #e8edec, #d2d1d3);
    box-shadow: 0px 3px 20px 0px black;
    transform: scale(1.2);
}
</style>