import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../api/api'

interface FavoriteComponent {
    id: number
    name: string
    type: string
    brand: string
    price: number | null
    imageUrl: string
    createdAt: string
    updatedAt: string
}

interface FavoritesResponse {
    success: boolean
    data: FavoriteComponent[]
}

export const useGetFavorites = () => {
    return useQuery({
        queryKey: ['favorites'],
        queryFn: () => api('/user/favorites') as Promise<FavoritesResponse>,
    })
}

export const useAddFavorite = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (componentId: number) =>
            api(`/user/favorites/${componentId}`, { method: 'POST' }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['favorites'] })
        },
    })
}

export const useRemoveFavorite = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (componentId: number) =>
            api(`/user/favorites/${componentId}`, { method: 'DELETE' }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['favorites'] })
        },
    })
}