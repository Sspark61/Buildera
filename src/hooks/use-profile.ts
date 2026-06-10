import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query'
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

interface UpdateProfileBody {
    userName: string
    phone: string
    currentPassword: string
    password: string
    cPassword: string
}

export const useUpdateProfile = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (body: UpdateProfileBody) =>
            api('/user/profile', {
                method: 'PUT',
                body: JSON.stringify(body),
            }) as Promise<ProfileResponse>,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['profile'] })
        },
    })
}