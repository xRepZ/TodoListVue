<template>
  <div class="btn remove-all" @click="newList()">Начать новый список</div>
  <div class="level mt-10">
    <input type="text" class="input" v-model="inputText" @keypress.enter="onItemCreate">
    <div class="btn ml-10 enter" @click="onItemCreate">Enter</div>
  </div>
  <ol class="actual-items">
    <li v-for="item in actualItems" :key="item.id">
      <div class="d-flex">
        <span>{{ item.text }}</span>
        <div class="btn ml-10" @click="removeItemActual(item.id)">×</div>
        <input class="ml-10" type="checkbox" @change="moveToDone(item.id)">
      </div>
    </li>
  </ol>
  <ul class="done-items mt-10">
    <li v-for="item in doneItems" :key="item.id">
      <div class="d-flex">
        <span>{{ item.text }}</span>
        <div class="btn ml-10" @click="removeItemDone(item.id)">×</div>
        <input class="ml-10" type="checkbox" @change="moveToActual" checked>
      </div>
    </li>
  </ul>
  <div class="mt-10">
    <div class="btn remove-done" @click="deleteDone()">Удалить выполненные</div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const idCounter = ref(0)
const actualItems = ref([])
const doneItems = ref([])

const inputText = ref('')

const onItemCreate = () => {
  if (inputText.value.length === 0) return
  actualItems.value.push({
    id: ++idCounter.value,
    text: inputText.value
  })
  inputText.value = ''
}


const moveToDone = (id) => {
  const idx = actualItems.value.findIndex(item => item.id === id)
  const [item] = actualItems.value.splice(idx, 1)
  doneItems.value.push(item)
}

const moveToActual = (id) => {
  const idx = doneItems.value.findIndex(item => item.id === id)
  const [item] = doneItems.value.splice(idx, 1)
  actualItems.value.push(item)
}

const removeItem = (arr, id) => {
  const idx = arr.findIndex(item => item.id === id)
  arr.splice(idx, 1)
}
const removeItemActual = (id) => {
  removeItem(actualItems.value, id)
}

const removeItemDone = (id) => {
  removeItem(doneItems.value, id)
}

const newList = () => {
  actualItems.value = []
  doneItems.value = []
}

const deleteDone = () => {
  doneItems.value = []
}

</script>
