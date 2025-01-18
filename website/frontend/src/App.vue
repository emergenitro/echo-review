<template>
  <div class="min-h-screen bg-gradient-to-b from-[#121212] to-[#131313] text-white">
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
@font-face {
  font-family: 'Phantom Sans';
  src: url('./../public/font/PhantomSans_Bold.woff') format('woff');
}
</style>