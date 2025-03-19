<script setup lang="ts">
import {ref, watch} from 'vue'
import axios, {AxiosError} from 'axios'
import RepositoryCard from '@/components/repository/RepositoryCard.vue'
import type {Repository} from '@/types.ts'
import Button from 'primevue/button'
import Paginator from 'primevue/paginator'
import Skeleton from 'primevue/skeleton'
import {useRoute, useRouter} from 'vue-router'
import {useToastHelper} from '@/helpers.ts'

const route = useRoute()
const router = useRouter()
const toastHelper = useToastHelper()

const apiUrl = `${import.meta.env.VITE_APP_URL}/api/repositories`
const isLoading = ref(true)
const isSyncing = ref(false)
const repositories = ref<Repository[]>([])
const paginatorPerPage = ref(10)
const paginatorFirstModel = ref(paginatorPerPage.value * (Number(route.query.page || 1) - 1))

function loadRepositories() {
    isLoading.value = true
    repositories.value = []

    axios.get(apiUrl).then((response) => {
        repositories.value = response.data
    }).catch((error: AxiosError) => {
        if (error.response?.data?.hasOwnProperty('error')) {
            toastHelper.error((<any>error.response.data).error)
        } else {
            toastHelper.error(error.message)
        }
    }).finally(() => {
        isLoading.value = false
    })
}

function syncRepositories() {
    isSyncing.value = true

    axios.post(`${apiUrl}/sync`).then((response) => {
        if (response.data.success) {
            loadRepositories()
            toastHelper.success('Synced successfully!')
        } else {
            toastHelper.error(response.data.error)
        }
    }).catch((error: AxiosError) => {
        if (error.response?.data?.hasOwnProperty('error')) {
            toastHelper.error((<any>error.response.data).error)
        } else {
            toastHelper.error(error.message)
        }
    }).finally(() => {
        isSyncing.value = false
    })
}

watch(() => route.query.page, (page) => {
    paginatorFirstModel.value = paginatorPerPage.value * (Number(page || 1) - 1)
})

loadRepositories()
</script>

<template>
    <div class="flex flex-col gap-4">
        <div class="surface-overlay p-4 rounded-lg border">
            <h1 class="text-xl sm:text-2xl font-semibold">Trending repositories</h1>
        </div>
        <div class="surface-overlay p-4 rounded-lg border">
            <div class="flex gap-2 mb-4">
                <Button
                    icon="fa-brands fa-github"
                    label="Sync repositories"
                    :loading="isSyncing"
                    @click="syncRepositories"
                />
                <Button
                    icon="fa-solid fa-rotate-right"
                    title="Reload"
                    variant="text"
                    :loading="isLoading"
                    @click="loadRepositories()"
                />
            </div>

            <div v-if="isLoading" class="rounded-md border">
                <div v-for="_ in paginatorPerPage"
                     class="[&:not(:first-child)]:border-t p-3 sm:p-4 flex gap-3 sm:gap-4 overflow-hidden">

                    <Skeleton height="1.5rem" width="1.5rem" class="self-center flex-shrink-0"/>

                    <div class="flex flex-col gap-4 w-full min-w-0 overflow-hidden">
                        <a href="#" class="text-[var(--link-color)] hover:underline block">
                            <Skeleton height="1rem" width="15rem" class="flex-shrink max-w-full"/>
                        </a>

                        <Skeleton height="1rem" width="30rem" class="flex-shrink max-w-full"/>

                        <div class="flex items-center opacity-80 gap-2">
                            <Skeleton height="1rem" width="4rem" class="flex-shrink max-w-full"/>
                            <Skeleton height="1rem" width="1rem" class="flex-shrink max-w-full"/>
                        </div>
                    </div>
                </div>
            </div>
            <div v-else class="rounded-md border">
                <RepositoryCard
                    v-for="offset in Math.min(paginatorPerPage, repositories.length - paginatorFirstModel)"
                    :repository="repositories[paginatorFirstModel + offset - 1]"
                    :number="paginatorFirstModel + offset"
                    class="[&:not(:first-child)]:border-t"
                />
            </div>

            <Paginator
                v-model:first="paginatorFirstModel"
                :rows="paginatorPerPage"
                :total-records="repositories.length"
                :page-link-size="3"
                @page="(event) => {router.push({query: {page: event.page + 1}})}"
                class="sticky bottom-0 left-0"
            />
        </div>
    </div>
</template>

<style scoped>

</style>
