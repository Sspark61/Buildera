import { useMutation } from '@tanstack/react-query'
import {api} from '../api/api'

interface RegisterCredentials {
    email: string
    userName: string
    password : string
    cPassword : string
}
interface RegisterResponse {
    success: boolean
    message: string
        data: {
        id: number
        userName: string
        email: string
        role: string
        isConfirmed: boolean
        isDeleted: boolean
        phone: string | null
        createdAt: string
        updatedAt: string
    }
}

export const useRegister = () => {
    return useMutation({
        mutationFn: ({ email, userName, password, cPassword }: RegisterCredentials) =>
            api('/auth/register', {
                method: 'POST',
                body: JSON.stringify({ email, userName, password, cPassword }),
            }) as Promise<RegisterResponse>
    })
}
