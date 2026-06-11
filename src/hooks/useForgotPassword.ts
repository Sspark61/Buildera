import { useMutation } from '@tanstack/react-query'
import {api} from '../api/api'

interface ForgotRequest{
    email: string
}

interface ForgotResponse {
    success: boolean
    message: string
}


export const useForgotPassword = () => {
  return useMutation({
    mutationFn: ({email} : ForgotRequest)=>
        api('/auth/forgot-password', {
          method: 'POST',
          body: JSON.stringify({ email })
      }) as Promise<ForgotResponse>,
  }
  )
}
