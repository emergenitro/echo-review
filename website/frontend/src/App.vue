<template>
  <div class="min-h-screen bg-white text-black">
    <Navbar />
    <HeroSection />
    <FeaturesSection />
    <ContactSection />
    <Footer />
  </div>
</template>

<script setup>
import Navbar from './components/Navbar.vue'
import HeroSection from './components/HeroSection.vue'
import FeaturesSection from './components/FeaturesSection.vue'
import Footer from './components/Footer.vue'
import ContactSection from './components/ContactSection.vue'
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300..800;1,300..800&display=swap');
</style>