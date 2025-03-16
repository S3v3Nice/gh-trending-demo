import {createRouter, createWebHistory} from 'vue-router'
import routes from '@/router/routes'
import {changeTitle} from '@/helpers'

const router = createRouter({
    history: createWebHistory(),
    routes: routes,
})

router.afterEach((to) => {
    if (to.meta.title) {
        changeTitle(to.meta.title)
    }
})

export default router
