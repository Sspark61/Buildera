import { useMutation } from '@tanstack/react-query'
import {api} from '../api/api'

interface UpdatePictureRequest {
    image: string
}
interface UpdatePictureResponse {
    success: boolean
    data: {
        imageUrl: string
    }
}

export const useUpdateProfilePicture = () => {
    return useMutation({
        mutationFn: (file: File) => {
            const formData = new FormData();
            formData.append('image', file);
            return api('/user/profile/picture', {
                method: 'PUT',
                body: formData,
            }) as Promise<UpdatePictureResponse>
        },
        onSuccess: (data) => {
            localStorage.setItem('imageUrl', data.data.imageUrl)
        }
    })
}
