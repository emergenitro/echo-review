<template>
    <div class="bg-white  border-green-200 p-6 ml-8 mr-8 rounded-lg text-center">
        <div class="text-5xl mb-4">{{ icon }}</div>
        <h3 class="text-2xl font-bold mb-2">{{ title }}</h3>
        <p class="text-gray-400">{{ description }}</p>
    </div>
</template>

<script setup>
defineProps({
    title: String,
    description: String,
    icon: String,
})
</script>