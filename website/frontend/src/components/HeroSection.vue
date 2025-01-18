<template>
    <section class="flex flex-col items-center justify-center text-center py-20">
        <h1 class="text-5xl font-bold mb-8">Welcome to Echo-Review</h1>
        <p class="text-xl mb-8">Get instant reviews and alternatives for your favorite products.</p>
        <div class="flex w-full max-w-md">
            <input v-model="url" type="text" placeholder="Enter product URL"
                class="flex-grow p-4 rounded-l-md text-black" />
            <button @click="fetchProductReview" class="bg-blue-500 text-white px-6 py-4 rounded-r-md">
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
        const response = await axios.post('https://localhost:5314/api/v1/productReview', { url: url.value })
        productReview.value = response.data
    } catch (e) {
        error.value = 'Failed to fetch product review. Please try again.'
    } finally {
        loading.value = false
    }
}
</script>