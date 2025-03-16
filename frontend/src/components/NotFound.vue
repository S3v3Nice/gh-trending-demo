<script setup lang="ts">
import Button from 'primevue/button'
</script>

<template>
    <div class="h-[75vh] flex flex-col justify-center items-center ml-2 mr-2">
        <h1 class="text-4xl font-bold text-center mb-4">404: Not found</h1>
        <p class="opacity-80 text-center mb-8">Sorry, the requested page was not found.</p>
        <RouterLink :to="{ name: 'home' }">
            <Button label="Back to home page" icon="fa-solid fa-house"/>
        </RouterLink>
    </div>
</template>

<style scoped>

</style>
