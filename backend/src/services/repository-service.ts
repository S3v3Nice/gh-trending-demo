import {PrismaClient} from '@prisma/client'
import axios from 'axios'
import SyncError from '../errors/sync-error'

const GITHUB_API_URL = 'https://api.github.com/search/repositories'
const SYNC_MAX_PER_PAGE = 100
const GITHUB_TOKEN = process.env.GITHUB_TOKEN
const SYNC_COUNT = Number(process.env.SYNC_REPO_COUNT ?? 1000)
const SYNC_DELAY = Number(process.env.SYNC_DELAY ?? 60)

const prisma = new PrismaClient()
let syncTimeout: NodeJS.Timeout | null = null

export async function getAll() {
    return prisma.repository.findMany({
        orderBy: [{stars_count: 'desc'}],
    })
}

export async function getByName(ownerName: string, repositoryName: string) {
    return prisma.repository.findFirst({
        where: {owner_name: ownerName, name: repositoryName}
    })
}

export async function getById(id: number) {
    return prisma.repository.findFirst({
        where: {id: id}
    })
}

export async function forceSync() {
    await sync()
    startAutoSyncInterval()
}

export function startAutoSync() {
    autoSyncFunction()
    startAutoSyncInterval()
}

function startAutoSyncInterval() {
    if (syncTimeout) {
        clearTimeout(syncTimeout)
    }
    syncTimeout = setInterval(autoSyncFunction, SYNC_DELAY * 60 * 1000)
}

async function autoSyncFunction() {
    try {
        await sync()
    } catch (error) {
        const errorMessage = (error as SyncError).message
        console.error(`GitHub synchronization failed:\n${errorMessage}`)
    }
}

async function sync() {
    try {
        const repositories = await retrieveRepositories()
        await prisma.$executeRaw`TRUNCATE TABLE repositories`
        await prisma.repository.createMany({
            data: repositories.map(repo => ({
                id: repo['id'],
                name: repo['name'],
                owner_name: repo['owner']['login'],
                description: repo['description'] ?? null,
                stars_count: repo['stargazers_count'],
                created_at: repo['created_at'],
                updated_at: repo['updated_at'],
                pushed_at: repo['pushed_at']
            }))
        })
    } catch (error) {
        let errorMessage: string
        let statusCode = 500

        if (axios.isAxiosError(error) && error.response) {
            errorMessage = error.response.data?.message || error.message
            statusCode = error.response.status
        } else if (error instanceof Error) {
            errorMessage = error.message
        } else {
            errorMessage = String(error)
        }

        throw new SyncError(errorMessage, statusCode)
    }
}

async function retrieveRepositories() {
    const totalPages = Math.ceil(SYNC_COUNT / SYNC_MAX_PER_PAGE)
    const requests = []

    for (let page = 1; page <= totalPages; page++) {
        const perPage = Math.min(SYNC_MAX_PER_PAGE, SYNC_COUNT - (page - 1) * SYNC_MAX_PER_PAGE)

        requests.push(
            axios.get(GITHUB_API_URL, {
                params: {
                    q: 'stars:>0',
                    sort: 'stars',
                    order: 'desc',
                    per_page: perPage,
                    page: page,
                },
                headers: {
                    ...(GITHUB_TOKEN && {Authorization: `Bearer ${GITHUB_TOKEN}`}),
                },
            })
        )
    }

    const results = await Promise.all(requests)
    return results.flatMap((res) => res.data.items)
}
