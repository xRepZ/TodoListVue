import { createRouter, createWebHistory } from 'vue-router'
import HomeView from './views/HomeView.vue'
import LoginView from './views/LoginView.vue'
import RegisterView from './views/RegisterView.vue'
import TodoView from './views/TodoView.vue'
import ChangePassView from './views/ChangePassView.vue'
const routes = [
    {
        path: '/',
        component: HomeView
    },
    {
        path: '/login',
        component: LoginView
    },
    {
        path: '/register',
        component: RegisterView
    },
    {
        path: '/change-pass',
        component: ChangePassView
    },
    {
        path: '/todo',
        component: TodoView
    } 
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
