<script setup lang="ts">
import {computed, ref} from 'vue'
import axios, {type AxiosError} from 'axios'
import type {Repository} from '@/types.ts'
import Button from 'primevue/button'
import {changeTitle, useToastHelper} from '@/helpers.ts'
import Skeleton from 'primevue/skeleton'

const props = defineProps({
    ownerName: String,
    name: String,
    id: String
})

const toastHelper = useToastHelper()
const apiUrl = `http://localhost:3000/api/repositories/${props.id ? props.id : `${props.ownerName}/${props.name}`}`
const isLoading = ref(true)
const repository = ref<Repository | null>(null)

const fullName = computed(() => `${repository.value!.owner_name}/${repository.value!.name}`)
const ownerGithubUrl = computed(() => `https://github.com/${repository.value!.owner_name}`)
const githubUrl = computed(() => `https://github.com/${fullName.value}`)

function loadRepository() {
    isLoading.value = true

    axios.get(apiUrl).then((response) => {
        repository.value = response.data
        changeTitle(repository.value ? fullName.value : 'Repository not found')
    }).catch((error: AxiosError) => {
        toastHelper.error(error.message)
    }).finally(() => {
        isLoading.value = false
    })
}

function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString()
}

function formatFullDate(dateString: string) {
    const date = new Date(dateString)
    return date.toLocaleString(undefined, {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZoneName: 'short'
    })
}

loadRepository()
</script>

<template>
    <div class="flex flex-col gap-4">
        <div class="surface-overlay p-4 rounded-lg border flex justify-between items-center">
            <Skeleton v-if="isLoading" height="1.25rem" width="20rem" class="self-center flex-shrink-1"/>
            <h1 v-else class="text-xl sm:text-2xl font-semibold line-clamp-1">
                {{ repository ? fullName : (id ? id : `${ownerName}/${name}`) }}
            </h1>

            <Button
                icon="fa-solid fa-rotate-right"
                variant="text"
                :loading="isLoading"
                @click="loadRepository"
            />
        </div>

        <div class="surface-overlay p-4 rounded-lg border">
            <div v-if="isLoading" class="flex flex-col gap-6">
                <Skeleton height="2.25rem" width="10rem"/>
                <Skeleton height="1rem" width="70%"/>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Skeleton height="1rem" width="10rem"/>
                    <Skeleton height="1rem" width="10rem"/>
                    <Skeleton height="1rem" width="10rem"/>
                    <Skeleton height="1rem" width="10rem"/>
                    <Skeleton height="1rem" width="10rem"/>
                    <Skeleton height="1rem" width="10rem"/>
                </div>
            </div>

            <div v-else-if="repository">
                <a :href="githubUrl" target="_blank">
                    <Button
                        icon="fa-brands fa-github"
                        label="View on GitHub"
                        class="mb-5"
                    />
                </a>

                <p v-if="repository.description" class="mb-5">
                    <i class="fa-solid fa-align-left mr-2"></i>{{ repository.description }}
                </p>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <p><i class="fa-regular fa-id-card mr-2"></i>Id: {{ repository.id }}</p>
                    <p>
                        <i class="fa-regular fa-user mr-2"></i>
                        Owner:
                        <a :href="ownerGithubUrl" target="_blank"
                           class="font-semibold text-[var(--link-color)] hover:underline">
                            {{ repository.owner_name }}
                        </a>
                    </p>
                    <p><i class="fa-regular fa-star mr-2"></i>Stars: {{ repository.stars_count.toLocaleString() }}</p>
                    <p>
                        <i class="fa-solid fa-calendar-plus mr-2"></i>
                        Created:
                        <span :title="formatFullDate(repository.created_at)">
                            {{ formatDate(repository.created_at) }}
                        </span>
                    </p>
                    <p>
                        <i class="fa-solid fa-calendar-check mr-2"></i>
                        Updated:
                        <span :title="formatFullDate(repository.updated_at)">
                            {{ formatDate(repository.updated_at) }}
                        </span>
                    </p>
                    <p>
                        <i class="fa-solid fa-code-branch mr-2"></i>
                        Last Push:
                        <span :title="formatFullDate(repository.pushed_at)">
                            {{ formatDate(repository.pushed_at) }}
                        </span>
                    </p>
                </div>
            </div>

            <div v-else>
                <p>Repository not found.</p>
            </div>
        </div>
    </div>
</template>

<style scoped>

</style>
