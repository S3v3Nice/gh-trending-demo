<script setup lang="ts">

</script>

<template>
    <div class="header-fixed flex flex-col">
        <div class="h-[var(--header-height)] surface-overlay p-2 lg:px-0 border-b flex items-center">
            <div class="page-container flex gap-2 h-full items-center justify-center sm:justify-start">
                <RouterLink :to="{name: 'home'}" class="h-[70%]">
                    <picture>
                        <source srcset="/logo.dark.svg" media="(prefers-color-scheme: dark)">
                        <img src="/logo.svg" alt="Logo" class="h-full">
                    </picture>
                </RouterLink>
            </div>
        </div>
    </div>
</template>

<style scoped>
.header-fixed {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 1000;
}
</style>
