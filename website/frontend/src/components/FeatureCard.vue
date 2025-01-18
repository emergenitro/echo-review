<template>
    <div class="bg-[#1e1e1e] p-6 rounded-lg text-center">
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

<style scoped>
/* Add any component-specific styles */
</style>