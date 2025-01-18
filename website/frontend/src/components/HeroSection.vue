<template>
    <section class="flex flex-col items-center justify-center text-center py-48">
        <h1 class="text-8xl font-extrabold mb-8 bg-gradient-to-r from-green-400 via-green-500 to-green-600 inline-block text-transparent bg-clip-text">Welcome to EchoReview</h1>
        <p class="text-2xl font-bold text-gray-400 mb-8">Lightning-fast reviews for all of your favourite products everywhere to Echo</p>
        <div class="flex w-full max-w-md mb-5">
            <input v-model="url" type="text" placeholder="Enter product URL"
                class="flex-grow p-4 bg-white rounded-l-md text-green-500 border-y-2 border-l-2 border-green-500 focus:border-3 focus:border-green-600" />
            <button @click="fetchProductReview" class="text-white font-bold border-solid bg-green-500 hover:bg-green-600 transition duration-500 hover:scale-105 cursor-pointer px-6 py-4 rounded-none rounded-r-md">
                Get Review
            </button>
        </div>
        <div v-if="loading" class="mt-4">Loading...</div>
        <div v-if="error" class="mt-4 text-red-500">{{ error }}</div>
        <div v-if="productReview" class="mt-8 w-full max-w-2xl text-left">
            <h2 class="text-3xl font-bold mb-4">Review Summary</h2>
            <p><strong>Average Rating:</strong> {{ productReview.averageRating }}</p>
            <p><strong>Alternatives:</strong></p>
            <ul class="list-disc list-inside">
                <li v-for="alternative in productReview.alternatives" :key="alternative.id">
                    {{ alternative.name }} - {{ alternative.rating }} stars
                </li>
            </ul>
        </div>
    </section>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'

const url = ref('')
const productReview = ref(null)
const loading = ref(false)
const error = ref(null)

const fetchProductReview = async () => {
    if (!url.value) {
        error.value = 'Please enter a product URL.'
        return
    }
    loading.value = true
    error.value = null
    productReview.value = null
    try {
        const apiClient = axios.create({
            baseURL: 'http://localhost:3000/api',
            withCredentials: false,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
        const response = await apiClient.post('http://localhost:3000/api/v1/scraper', { url: url.value })
        productReview.value = response.data
        console.log(productReview.value)
    } catch (e) {
        error.value = 'Failed to fetch product review. Please try again.'
    } finally {
        loading.value = false
    }
}
</script>
