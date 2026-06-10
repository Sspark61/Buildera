import { useQuery } from '@tanstack/react-query'
import { api } from '../api/api'

interface ComponentsParams {
    type?: string
    minPrice?: number
    maxPrice?: number
    search?: string
    page?: number
    limit?: number
}

interface Component {
    id: number
    name: string
    type: string
    brand: string
    price: number
    imageUrl: string
    createdAt: Date
    updatedAt: Date
}

interface ComponentsResponse {
    success: boolean
    data: {
        total: number
        page: number
        pages: number
        components: Component[]
    }
}

export const useGetComponents = (params: ComponentsParams = {}) => {
    // build query string from params
    const query = new URLSearchParams()
    if (params.type)        query.set('type', params.type)
    if (params.minPrice)    query.set('minPrice', String(params.minPrice))
    if (params.maxPrice)    query.set('maxPrice', String(params.maxPrice))
    if (params.search)      query.set('search', params.search)
    if (params.page)        query.set('page', String(params.page))
    if (params.limit)       query.set('limit', String(params.limit))

    return useQuery({
        queryKey: ['components', params],
        queryFn: () => api(`/components?${query.toString()}`) as Promise<ComponentsResponse>,
    })
}