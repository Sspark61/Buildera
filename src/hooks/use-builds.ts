import { useQuery } from '@tanstack/react-query'
import { api } from '../api/api'

interface Build {
    id: number
    name: string | null
    budget: number
    purpose: string
    shareToken: string | null
    createdAt: string
    updatedAt: string
    user_id: number
    componentCount: number
    totalPrice: number
}

interface BuildsResponse {
    success: boolean
    data: Build[]
}

export const useGetBuilds = () => {
    return useQuery({
        queryKey: ['builds'],
        queryFn: () => api('/builds') as Promise<BuildsResponse>,
    })
}