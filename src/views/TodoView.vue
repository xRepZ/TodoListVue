<template>
    <div class="btn remove-all" @click="newList()">Начать новый список</div>
    <div class="level mt-10">
        <input type="text" class="input" v-model="inputText" @keypress.enter="onItemCreate">
        <div class="btn ml-10 enter" @click="onItemCreate">Enter</div>
    </div>
    <ol class="actual-items">
        <li v-for="item in actualItems" :key="item.id">
            <div class="d-flex">
                <div v-if="!item.edit">
                    <span>{{ item.text }}</span>
                    <div class="btn ml-10" @click="removeItem(item.id)">×</div>
                    <div class="btn ml-10" @click="item.edit = true">✎</div>
                </div>
                <div v-else>
                    <input type="text" class="input" v-model="item.editedText" @keypress.enter="editItem(item.id)">
                    <div class="btn ml-10" @click="item.edit = false">✎</div>
                </div>

                <input class="ml-10" type="checkbox" @change="moveToDone(item.id)">
            </div>
        </li>
    </ol>
    <ul class="done-items mt-10">
        <li v-for="item in doneItems" :key="item.id">
            <div class="d-flex">
                <div v-if="!item.edit">
                    <span>{{ item.text }}</span>
                    <div class="btn ml-10" @click="removeItem(item.id)">×</div>
                    <div class="btn ml-10" @click="item.edit = true">✎</div>
                </div>
                <div v-else>
                    <input type="text" class="input" v-model="item.editedText" @keypress.enter="editItem(item.id)">
                    <div class="btn ml-10" @click="item.edit = false">✎</div>
                </div>
                <input class="ml-10" type="checkbox" @change="moveToActual(item.id)" checked>
            </div>
        </li>
    </ul>
    <div class="mt-10">
        <div class="btn remove-done" @click="deleteDone()">Удалить выполненные</div>
    </div>
</template>
  
<script setup>
import { ref, onMounted, computed } from 'vue'
import api from '../api/api.js'
import { useRouter } from 'vue-router';


const todoList = ref([])
const actualItems = computed(() => todoList.value.filter(t => !t.done))
const doneItems = computed(() => todoList.value.filter(t => t.done))

const inputText = ref('')
const editText = ref('')
//const edit = ref(false)





const router = useRouter()

onMounted(async () => {
    if (localStorage.getItem('token') === null) {
        router.push('/login')
        return
    }
    const list = await api.getList()
    todoList.value = list
    console.log(list)
})


const onItemCreate = async () => {
    if (inputText.value.length === 0) return

    const id = await api.postTodo(inputText.value)
    // console.log(id[2])
    // console.log(id)
    todoList.value.push({
        id,
        text: inputText.value,
        done: false,
        edit: false,
        editedText: inputText.value
    })
    inputText.value = ''

}


const moveToDone = (id) => {
    const todo = todoList.value.find(item => item.id === id)
    todo.done = true
    api.putDone({ id: id, done: true })
}

const moveToActual = (id) => {
    const todo = todoList.value.find(item => item.id === id)
    todo.done = false
    api.putDone({ id: id, done: false })
}

const removeItem = (id) => {
    const idx = todoList.value.findIndex(item => item.id === id)
    todoList.value.splice(idx, 1)
    api.deleteEl(id)
}

const editItem = (id) => {
    const idx = todoList.value.findIndex(item => item.id === id)
    //const todo = todoList.value.find(item => item.id === id)

    todoList.value[idx].text = todoList.value[idx].editedText
    todoList.value[idx].edit = false
    //todo.value = 'edit'

    api.putDone({ id: id, text: todoList.value[idx].text })
}

const newList = async () => {
    if (todoList.value.length !== 0) {
        await api.deleteAll()
        todoList.value = []
    }


    // const removed = todoList.value
    // if (removed.length !== 0) {
    //     todoList.value = []
    //     removed.forEach((item) => {
    //         api.deleteEl(item.id)
    //         console.log(item.id)
    //     })
    // }

    // delete on server
}

const deleteDone = () => {

    //const todo = todoList.value.filter(t => t.done)
    const removed = todoList.value.filter(t => t.done)
    if (removed.length !== 0) {
        todoList.value = todoList.value.filter(t => !t.done)
        api.deleteDone()
        // removed.forEach((item) => {
        //     api.deleteEl(item.id)
        //     console.log(item.id)
        // })
    }


    // list.value = 
}

</script>