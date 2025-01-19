<template>
    <section id="features" class="py-20">
        <div class="container mx-auto bg-gray-100 p-10">
            <h2
                class="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-green-400 via-green-500 to-green-600 inline-block text-transparent bg-clip-text">
                Features</h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                <FeatureCard title="Alternative Products"
                    description="Find the best alternatives for any product instantly." icon="🚀"
                    class="border-2 hover:border-green-200  transition duration-500 hover:scale-105" />
                <FeatureCard title="Average Ratings" description="Get average ratings from multiple sources." icon="⭐"
                    class="border-2 hover:border-green-200  transition duration-500 hover:scale-105 m" />
                <FeatureCard title="Detailed Reviews"
                    description="Read comprehensive reviews to make informed decisions." icon="📝"
                    class="border-2 hover:border-green-200  transition duration-500 hover:scale-105 " />
            </div>
        </div>
    </section>
</template>

<script setup>
import FeatureCard from './FeatureCard.vue'
</script>