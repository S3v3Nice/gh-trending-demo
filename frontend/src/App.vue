<script setup lang="ts">
import Header from '@/components/Header.vue'
import Toast from 'primevue/toast'
</script>

<template>
    <Toast/>
    <div class="surface-ground">
        <Header/>
        <div class="page-content page-container mb-4">
            <RouterView/>
        </div>
    </div>
</template>

<style scoped>
.page-content {
    /* Margin to prevent the fixed header from overlapping the beginning of the page content. */
    margin-top: var(--header-with-margin-height);
}
</style>
