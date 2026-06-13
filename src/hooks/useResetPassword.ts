import { useMutation } from '@tanstack/react-query'
import {api} from '../api/api'

interface ResetPasswordCredentials {
    token: string
    password: string
    cPassword: string
}

interface ResetPasswordResponse {
    success: boolean
    message: string
}

export const useResetPassword = ()=>{
    return useMutation({
        mutationFn: ({token, password, cPassword}: ResetPasswordCredentials)=>
        api(`/auth/reset-password/${token}`, {
            method: 'POST',
            body: JSON.stringify({password,cPassword}),
        }) as Promise<ResetPasswordResponse>,
    })
}