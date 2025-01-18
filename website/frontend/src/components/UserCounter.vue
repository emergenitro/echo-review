<template>
    <section class="py-20 bg-[#0f0f0f]">
        <div class="container mx-auto text-center">
            <h2 class="text-4xl font-bold mb-4">{{ formattedUserCount }} Users Trust Echo-Review</h2>
            <p class="text-gray-400">Join our growing community of satisfied customers.</p>
        </div>
    </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const userCount = ref(0)
const formattedUserCount = computed(() => userCount.value.toLocaleString())

const fetchUserCount = async () => {
    userCount.value = 123456
}

onMounted(() => {
    fetchUserCount()
})
</script>

<style scoped>
/* Add any styles specific to the user counter */
</style>