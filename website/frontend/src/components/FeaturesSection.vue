<template>
    <section id="features" class="py-20">
        <div class="container mx-auto">
            <h2 class="text-4xl font-bold text-center mb-12">Features</h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                <FeatureCard title="Alternative Products"
                    description="Find the best alternatives for any product instantly." icon="🚀" />
                <FeatureCard title="Average Ratings" description="Get average ratings from multiple sources."
                    icon="⭐" />
                <FeatureCard title="Detailed Reviews"
                    description="Read comprehensive reviews to make informed decisions." icon="📝" />
                <!-- Add more FeatureCards as needed -->
            </div>
        </div>
    </section>
</template>

<script setup>
import FeatureCard from './FeatureCard.vue'
</script>