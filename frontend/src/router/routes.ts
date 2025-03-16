import type {RouteRecordRaw} from 'vue-router'
import Repositories from '@/components/repository/Repositories.vue'
import Repository from '@/components/repository/Repository.vue'
import NotFound from '@/components/NotFound.vue'

declare module 'vue-router' {
    interface RouteMeta {
        title?: string
    }
}

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        name: 'home',
        redirect: {name: 'repositories'}
    },
    {
        path: '/repositories',
        name: 'repositories',
        component: Repositories,
        meta: {
            title: 'Trending repositories',
        }
    },
    {
        path: '/repositories/:ownerName/:name',
        name: 'repository',
        component: Repository,
        props: true,
        meta: {
            title: 'Repository',
        }
    },
    {
        path: '/repositories/:id',
        component: Repository,
        props: true,
        meta: {
            title: 'Repository',
        }
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'not-found',
        component: NotFound,
        meta: {
            title: 'Not found'
        }
    }
]

export default routes
