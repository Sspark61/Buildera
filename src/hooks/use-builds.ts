import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../api/api'

// ---- Types ----
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

interface BuildComponent {
    id: number
    name: string
    type: string
    brand: string
    price: number | null
    imageUrl: string
    createdAt: string
    updatedAt: string
    buildComponentId: number
}

interface SingleBuildResponse {
    success: boolean
    data: {
        id: number
        name: string | null
        budget: number
        purpose: string
        shareToken: string | null
        createdAt: string
        updatedAt: string
        user_id: number
        components: BuildComponent[]
        totalPrice: number
    }
}

interface CreateBuildBody {
    name: string
    budget: number
    purpose: string
}

interface CompatibilityError {
    severity: string
    rule: string
    components: string[]
    message: string
}

interface AddComponentResponse {
    success: boolean
    message?: string
    data?: {
        isCompatible: boolean
        errors: CompatibilityError[]
    }
}

// ---- Hooks ----

export const useGetBuilds = () => {
    return useQuery({
        queryKey: ['builds'],
        queryFn: () => api('/builds') as Promise<BuildsResponse>,
    })
}

export const useGetBuild = (id: number) => {
    return useQuery({
        queryKey: ['builds', id],
        queryFn: () => api(`/builds/${id}`) as Promise<SingleBuildResponse>,
        enabled: !!id,
    })
}

export const useCreateBuild = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (body: CreateBuildBody) =>
            api('/builds', {
                method: 'POST',
                body: JSON.stringify(body),
            }) as Promise<SingleBuildResponse>,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['builds'] })
        },
    })
}

export const useUpdateBuild = (buildId: number) => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (body: Partial<CreateBuildBody>) =>
            api(`/builds/${buildId}`, {
                method: 'PUT',
                body: JSON.stringify(body),
            }) as Promise<SingleBuildResponse>,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['builds', buildId] })
            queryClient.invalidateQueries({ queryKey: ['builds'] })
        },
    })
}

export const useAddComponentToBuild = (buildId: number) => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (componentId: number) =>
            api(`/builds/${buildId}/components`, {
                method: 'POST',
                body: JSON.stringify({ componentId }),
            }) as Promise<AddComponentResponse>,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['builds', buildId] })
        },
    })
}

export const useRemoveComponentFromBuild = (buildId: number) => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (componentId: number) =>
            api(`/builds/${buildId}/components/${componentId}`, {
                method: 'DELETE',
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['builds', buildId] })
        },
    })
}