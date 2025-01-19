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
                                class="w-full p-4 border border-green-500 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                                type="text" id="name" placeholder="Your Name" name="name" required />
                        </div>
                        <div class="mb-6">
                            <label class="block text-gray-700 text-sm font-bold mb-2" for="email">
                                Email
                            </label>
                            <input
                                class="w-full p-4 border border-green-500 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                                type="email" id="email" placeholder="Your Email" name="email" required />
                        </div>
                        <div class="mb-6">
                            <label class="block text-gray-700 text-sm font-bold mb-2" for="message">
                                Message
                            </label>
                            <textarea
                                class="w-full p-4 border border-green-500 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
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
                            We'd love to hear from you! Whether you have a question about features, trials, pricing,
                            need a demo, or
                            anything else, our team is ready to answer all your questions.
                        </p>
                        <div class="flex items-center justify-center mb-4">
                            <div class="text-green-500 text-2xl mr-4">📍</div>
                            <div>
                                <p class="font-bold">Our Office</p>
                                <p>123 Echo Street, Suite 100<br />Cityville, Country 12345</p>
                            </div>
                        </div>
                        <div class="flex items-center justify-center">
                            <div class="text-green-500 text-2xl mr-4">✉️</div>
                            <div>
                                <p class="font-bold">Email Us</p>
                                <p>support@echoreview.com</p>
                            </div>
                        </div>
                    </div>
                    <!-- Map -->
                    <div class="w-full h-64 rounded-lg overflow-hidden shadow-md">
                        <iframe class="w-full h-full" frameborder="0" scrolling="no" marginheight="0" marginwidth="0"
                            src="https://maps.google.com/maps?width=100%25&amp;height=600&amp;hl=en&amp;q=San%20Francisco+(EchoReview%20Office)&amp;t=&amp;z=14&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"></iframe>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<style scoped></style>