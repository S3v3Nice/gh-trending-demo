import type {ToastServiceMethods} from 'primevue'
import {useToast} from 'primevue'

export function changeTitle(title: string) {
    document.title = title + ' — ' + import.meta.env.VITE_APP_NAME
}

class ToastHelper {
    private static readonly lifeTime = 5000

    private toast: ToastServiceMethods

    constructor(toast: ToastServiceMethods) {
        this.toast = toast
    }

    public success(message?: string) {
        this.toast.add({severity: 'success', summary: 'Success', detail: message || '', life: ToastHelper.lifeTime})
    }

    public error(message?: string) {
        this.toast.add({severity: 'error', summary: 'Error', detail: message || '', life: ToastHelper.lifeTime})
    }
}

export function useToastHelper() {
    return new ToastHelper(useToast())
}
