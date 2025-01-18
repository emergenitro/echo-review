<template>
    <section class="py-20">
        <div class="container mx-auto">
            <h2 class="text-4xl font-bold text-center mb-12">What Our Users Say</h2>
            <div class="relative">
                <div class="flex overflow-x-scroll no-scrollbar" ref="carousel" @mousedown="isDown = true"
                    @mouseup="isDown = false" @mouseleave="isDown = false" @mousemove="handleMouseMove">
                    <div v-for="(testimonial, index) in testimonials" :key="index"
                        class="min-w-full md:min-w-1/2 lg:min-w-1/3 px-4">
                        <div class="bg-[#1e1e1e] p-8 rounded-lg">
                            <p class="text-xl italic">"{{ testimonial.quote }}"</p>
                            <p class="mt-4 text-right">- {{ testimonial.author }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
import { ref } from 'vue'

const testimonials = [
    {
        quote: "Echo-Review has changed the way I shop online!",
        author: "Alex J.",
    },
    {
        quote: "So easy to find the best products now.",
        author: "Maria S.",
    },
    {
        quote: "Highly recommend this extension to everyone.",
        author: "Sam T.",
    },
    // Add more testimonials as needed
]

const carousel = ref(null)
let isDown = false
let startX
let scrollLeft

const handleMouseMove = (e) => {
    if (!isDown) return
    e.preventDefault()
    const x = e.pageX - carousel.value.offsetLeft
    const walk = (x - startX) * 2 // scroll-fast
    carousel.value.scrollLeft = scrollLeft - walk
}

const handleMouseDown = (e) => {
    isDown = true
    startX = e.pageX - carousel.value.offsetLeft
    scrollLeft = carousel.value.scrollLeft
}

const handleMouseUp = () => {
    isDown = false
}

const handleMouseLeave = () => {
    isDown = false
}
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
    display: none;
}

.no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
}

.relative {
    cursor: grab;
}

.relative:active {
    cursor: grabbing;
}
</style>