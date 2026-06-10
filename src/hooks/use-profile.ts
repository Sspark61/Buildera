import { useQuery } from '@tanstack/react-query'
import { api } from '../api/api'

interface ProfileResponse {
    success: boolean
    data: {
        id: number
        userName: string
        email: string
        phone: string
        role: string
        isConfirmed: boolean
        isDeleted: boolean
        deletedAt: string | null
        createdAt: string
        updatedAt: string
    }
}

export const useGetProfile = () => {
    return useQuery({
        queryKey: ['profile'],
        queryFn: () => api('/user/profile') as Promise<ProfileResponse>,
    })
}