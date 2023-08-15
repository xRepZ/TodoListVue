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
                    <div class="btn ml-10" @click="onEditClick(item.id, true)">✎</div>
                </div>
                <div v-else>
                    <!-- <input type="text" class="input" v-model="item.editedText"
                        @keypress="(event) => sendText(item.id, event)" @keypress.enter="editItem(item.id)"> -->
                    <input type="text" class="input" v-model="item.editedText" @keypress.enter="editItem(item.id)">
                    <div class="btn ml-10" @click="onEditClick(item.id, false)">✎</div>
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
                    <div class="btn ml-10" @click="onEditClick(item.id, true)">✎</div>
                    <!-- <div class="btn ml-10" @click="item.edit = true">✎</div> -->
                </div>
                <div v-else>
                    <input type="text" class="input" v-model="item.editedText" @keypress.enter="editItem(item.id)">
                    <div class="btn ml-10" @click="onEditClick(item.id, false)">✎</div>
                    <!-- <div class="btn ml-10" @click="item.edit = false">✎</div> -->
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
import { ref, onMounted, computed, onUpdated, onUnmounted } from 'vue'
import api from '../api/api.js'
import wsApi from '../api/ws.js'
import { useRouter } from 'vue-router';

const message = ref({})
const todoList = ref([])
const actualItems = computed(() => todoList.value.filter(t => !t.done))
const doneItems = computed(() => todoList.value.filter(t => t.done))

const inputText = ref('')
//const editText = ref('')
//const edit = ref(false)





const router = useRouter()

let ws
//console.log(JSON.parse(atob(localStorage.getItem('token').split('.')[0])))
onMounted(async () => {
    if (localStorage.getItem('token') === null) {
        router.push('/login')
        return
    }
    const list = await api.getList()
    todoList.value = list
    console.log(list)
    //console.log(user.value)
    try {
        ws = await wsApi.connect()
    } catch (err) {
        alert(`Не удалось установить соединение с ${err.target.url}`)
        return
    }

    ws.onmessage((data) => {
        if (data.type === 'new_todo') {
            todoList.value.push({
                ...data.payload,
                edit: false,
                editedText: data.payload.text
            })
        } else if (data.type === 'delete_todo') {
            const idx = todoList.value.findIndex(item => item.id === data.payload.id)
            todoList.value.splice(idx, 1)
        } else if (data.type === 'delete_done') {
            todoList.value = todoList.value.filter(t => !t.done)
        } else if (data.type === 'delete_all') {
            todoList.value = []
        } else if (data.type === 'edit') {
            const todo = todoList.value.find(item => item.id === data.payload.id)
            todo.text = data.payload.text
            todo.done = data.payload.done
        }
    })
    ws.onerror((event) => {
        alert(`Ошибка установки соединения с ${event}`)
    })
    ws.onclose((event) => {

    })
})

onUnmounted(() => {
    ws.close()
})


const onItemCreate = async () => {
    if (inputText.value.length === 0) return

    const id = await api.postTodo(inputText.value)
    // console.log(id[2])
    // console.log(id)
    // todoList.value.push({
    //     id,
    //     text: inputText.value,
    //     done: false,
    //     edit: false,
    //     editedText: inputText.value
    // })
    inputText.value = ''
}


const moveToDone = (id) => {
    const idx = todoList.value.findIndex(item => item.id === id)
    // const todo = todoList.value.find(item => item.id === id)
    // todo.done = true
    api.putDone({ id: id, text: todoList.value[idx].text, done: true })
    // wsSend("new_todo")
}

const moveToActual = (id) => {
    const idx = todoList.value.findIndex(item => item.id === id)
    // const todo = todoList.value.find(item => item.id === id)
    // todo.done = false
    api.putDone({ id: id, text: todoList.value[idx].text, done: false })
    // wsSend("new_todo")
}

const removeItem = (id) => {
    // const idx = todoList.value.findIndex(item => item.id === id)
    // //console.log(id, idx)
    // todoList.value.splice(idx, 1)
    api.deleteEl(id)
    //wsSend("new_todo")
}

const onEditClick = (id, isEdit) => {
    console.log("entered", isEdit)
    const idx = todoList.value.findIndex(item => item.id === id)

    if (isEdit) {
        todoList.value[idx].edit = true
        //return true
    } else {
        todoList.value[idx].edit = false
        //return false
    }

    // console.log("edit send")
    // wsSend("new_todo")

}
// const sendText = (id, event) => {
//     const idx = todoList.value.findIndex(item => item.id === id)
//     console.log(event.key)
//     if (event.key !== 'Enter') {
//         inputText.value += event.key
//         todoList.value[idx].editedText = inputText.value

//         console.log("editing...", todoList.value[idx].editedText)
//         message.value = {
//             type: "new_todo",
//             payload: {
//                 todoList: todoList.value,
//                 token: localStorage.getItem('token'),
//             },

//         }
//         console.log("edit send")
//         wsSend(JSON.stringify(message.value))
//     }

// }

const editItem = (id) => {
    const idx = todoList.value.findIndex(item => item.id === id)

    todoList.value[idx].text = todoList.value[idx].editedText
    todoList.value[idx].edit = false

    api.putDone({ id: id, text: todoList.value[idx].text, done: todoList.value[idx].done })
    console.log("edit send")
    // wsSend("new_todo")

}

const newList = async () => {
    if (todoList.value.length !== 0) {
        await api.deleteAll()
        //  todoList.value = []
    }
    // wsSend("new_todo")
}

const deleteDone = () => {

    const removed = todoList.value.filter(t => t.done)
    if (removed.length !== 0) {
        // todoList.value = todoList.value.filter(t => !t.done)
        api.deleteDone()
    }

    // wsSend("new_todo")


}
</script>