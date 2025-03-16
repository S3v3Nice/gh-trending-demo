<script setup lang="ts">
import {computed, type PropType} from 'vue'
import Tag from 'primevue/tag'
import type {Repository} from '@/types.ts'

const props = defineProps({
    repository: {
        type: Object as PropType<Repository>,
        required: true
    },
    number: {
        type: Number,
        required: true
    }
})

const fullName = computed(() => `${props.repository.owner_name}/${props.repository.name}`)
const githubUrl = computed(() => `https://github.com/${fullName.value}`)
</script>

<template>
    <div class="p-3 sm:p-4 flex gap-3 sm:gap-4">
        <Tag severity="secondary" class="self-center">{{ number }}</Tag>

        <div class="flex flex-col gap-1">
            <RouterLink
                :to="{name: 'repository', params: {ownerName: repository.owner_name, name: repository.name}}"
                class="text-[var(--link-color)] hover:underline"
            >
                <p class="sm:text-base text-sm font-semibold">{{ fullName }}</p>
            </RouterLink>

            <p class="sm:text-base text-sm">{{ repository.description }}</p>

            <div class="flex items-center opacity-80 gap-2">
                <a :href="githubUrl + '/stargazers'"
                   class="flex gap-1 items-center hover:text-[var(--link-color)] hover:underline">
                    <i class="fa-regular fa-star sm:text-sm text-xs"/>
                    <p class="sm:text-sm text-xs">{{ repository.stars_count.toLocaleString() }}</p>
                </a>
                <a :href="githubUrl">
                    <i class="fa-brands fa-github"/>
                </a>
            </div>
        </div>
    </div>
</template>

<style scoped>

</style>
