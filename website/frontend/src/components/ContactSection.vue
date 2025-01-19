<template>
    <section id="contact" class="py-20 bg-gray-100">
        <div class="container mx-auto">
            <h2
                class="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-green-400 via-green-500 to-green-600 inline-block text-transparent bg-clip-text">
                Contact Us
            </h2>
            <div class="flex flex-col md:flex-row md:justify-between">
                <!-- Contact Form -->
                <div class="w-full md:w-1/2 p-8">
                    <form action="https://formspree.io/f/xnnnkbjz" method="POST"
                        class="bg-white p-8 rounded-lg shadow-md">
                        <div class="mb-6">
                            <label class="block text-gray-700 text-sm font-bold mb-2" for="name">
                                Name
                            </label>
                            <input
                                class="w-full p-4 border border-green-500 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600 bg-gray-50"
                                type="text" id="name" placeholder="Your Name" name="name" required />
                        </div>
                        <div class="mb-6">
                            <label class="block text-gray-700 text-sm font-bold mb-2" for="email">
                                Email
                            </label>
                            <input
                                class="w-full p-4 border border-green-500 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600 bg-gray-50"
                                type="email" id="email" placeholder="Your Email" name="email" required />
                        </div>
                        <div class="mb-6">
                            <label class="block text-gray-700 text-sm font-bold mb-2" for="message">
                                Message
                            </label>
                            <textarea
                                class="w-full p-4 border border-green-500 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600 bg-gray-50"
                                id="message" placeholder="Your Message" rows="6" name="message" required></textarea>
                        </div>
                        <button type="submit"
                            class="w-full bg-green-500 text-white font-bold py-4 px-6 rounded-md hover:bg-green-600 transition duration-200">
                            Send Message
                        </button>
                        <div v-if="successMessage" class="mt-4 text-green-600">
                            {{ successMessage }}
                        </div>
                        <div v-if="errorMessage" class="mt-4 text-red-500">
                            {{ errorMessage }}
                        </div>
                    </form>
                </div>
                <!-- Contact Details and Map -->
                <div class="w-full md:w-1/2 p-8 flex flex-col items-center">
                    <div class="bg-white p-8 rounded-lg shadow-md w-full mb-8">
                        <h3 class="text-2xl font-bold mb-4 text-center">Get in Touch</h3>
                        <p class="text-gray-700 mb-4 text-center">
                            We'd love to hear from you! Whether you have a question about features, working, pricing,
                            need a demo, or
                            anything else, our team is ready to answer all your questions.
                        </p>
                        <div class="flex items-center justify-center mb-4">
                            <div class="text-green-500 text-2xl mr-4">📍</div>
                            <div>
                                <p class="font-bold">Our Office</p>
                                <p>Global Indian International School<br />Punggol, Singapore, 828649</p>
                            </div>
                        </div>
                        <div class="flex items-center justify-center">
                            <div class="text-green-500 text-2xl mr-4">✉️</div>
                            <div>
                                <p class="font-bold">Email Us</p>
                                <p>support@echoreview.site</p>
                            </div>
                        </div>
                    </div>
                    <!-- Map -->
                    <div class="w-full h-64 rounded-lg overflow-hidden shadow-md">
                        <iframe class="w-full h-full" frameborder="0" scrolling="no" marginheight="0" marginwidth="0"
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.643513852647!2d103.90920037527799!3d1.3904484614433676!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31da17bc6f1b5fe7%3A0x230a6bb5f639557f!2sGlobal%20Indian%20International%20School%20SMART%20Campus%20-%20Punggol%2C%20Singapore!5e0!3m2!1sen!2ssg!4v1737258100700!5m2!1sen!2ssg"></iframe>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<style scoped></style>