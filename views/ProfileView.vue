<template>
    <div class="btn remove-all" @click="editProfile()">Редактировать профиль</div>
    <div v-if="!editableProfile">

        <div>Фото</div>
        

        <img :src="profile.photo">


        
        <div>Описание</div>
        <h3>{{ profile.text }}</h3>
        
        <div>Имя</div>
        <h2>{{ profile.name }}</h2>

    </div>
    <div v-else>
        <div>Фото</div>
        <input type="file" class="input" @change="onFileChange" @keypress.enter="putToProfile()">
        <div>Описание</div>
        <input type="text" class="input" v-model="editableProfile.text" @keypress.enter="putToProfile()">
        <div>Имя</div>
        <input type="text" class="input" v-model="editableProfile.name" @keypress.enter="putToProfile()">
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../api/api.js';
import axios from 'axios';
import { useRouter } from 'vue-router';

const url = "https://api.imgbb.com/1/upload?expiration=600&key=14f6235824cddc89097e932ab0a79c23%20" 
const profile = ref({})
const editableProfile = ref(null)
const router = useRouter()

onMounted(async () => {
    if (localStorage.getItem('token') === null) {
        router.push('/login')
        return
    }
    const resp = await api.getProfile()
    

    profile.value = {
        id: resp[0].id,
        name: resp[0].name,
        text: resp[0].text,
        photo: resp[0].photo,
    }
    console.log(profile.value)
    console.log(resp[0].name)
})
const editProfile = () => {
    editableProfile.value = { ...profile.value }
}
const putToProfile = async () => {
    const fd = new FormData()
    fd.append('image', editableProfile.value.photo)
    const resp = await axios.post(url, fd)
    //console.log("resp", resp.data.data.medium)

    if (resp.data.data.mediuml !== undefined) {
        editableProfile.value.photo = resp.data.data.medium.url
    } else {
        console.log("ent")
        editableProfile.value.photo = resp.data.data.image.url
    }
    

    await api.putProfile(editableProfile.value)
    profile.value = editableProfile.value
    editableProfile.value = null
}


const onFileChange = async (e) => {
    editableProfile.value.photo = e.target.files[0]
}

</script>