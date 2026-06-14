// hooks/useComponents.ts — add this alongside useGetComponents
import { useQuery } from '@tanstack/react-query';
import {api} from '../api/api'

interface SingleComponentResponse {
    success: boolean
    data: {
        id: number
        name: string
        type: string
        brand: string
        price: number | null
        urls: string[]
        imageUrl: string
        createdAt: string
        updatedAt: string
        specs: {
            Series: string,
            Microarchitecture: string,
            Core_Family: string,
            Socket: string,
            Core_Count: string,
            Thread_Count: string,
            Performance_Core_Clock: string,
            Performance_Core_Boost_Clock: string,
            L2_Cache: string,
            L3_Cache: string,
            TDP: string,
            Integrated_Graphics: string,
            ECC_Support: string,
            Includes_Cooler: string,
            Packaging: string,
            Lithography: string,
            Includes_CPU_Cooler: string,
            Simultaneous_Multithreading: string
        }
    }
}

export const useGetComponentDetails = (id: number) => {
    return useQuery({
        queryKey: ['components', id],
        queryFn: () => api(`/components/${id}`) as Promise<SingleComponentResponse>,
        enabled: !!id,
    })
}