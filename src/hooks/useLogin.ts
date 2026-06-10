import { useMutation } from '@tanstack/react-query'
import {api} from '../api/api'

interface LoginCredentials {
    email: string
    password: string
}

interface LoginResponse {
    success: boolean
    message: string
    token: string
}

export const useLogin = () => {
    return useMutation({
        mutationFn: ({ email, password }: LoginCredentials) =>
            api('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        }) as Promise<LoginResponse>,
        onSuccess: (data) => {
            localStorage.setItem('token', data.token)
        },
    })
}