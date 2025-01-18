<template>
  <div class="min-h-screen bg-white text-black">
    <Navbar />
    <HeroSection />
    <FeaturesSection />
    <UserCounter />
    <CarouselSection />
    <Footer />
  </div>
</template>

<script setup>
import Navbar from './components/Navbar.vue'
import HeroSection from './components/HeroSection.vue'
import FeaturesSection from './components/FeaturesSection.vue'
import UserCounter from './components/UserCounter.vue'
import CarouselSection from './components/CarouselSection.vue'
import Footer from './components/Footer.vue'
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300..800;1,300..800&display=swap');
</style>