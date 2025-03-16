export interface Repository {
    id: number
    name: string
    owner_name: string
    description: string | null
    stars_count: number
    created_at: string
    updated_at: string
    pushed_at: string
}
