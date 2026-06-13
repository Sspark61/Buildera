import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query'
import { api } from '../api/api'

interface ProfileResponse {
    success: boolean
    data: {
        id: number
        userName: string
        email: string
        password: string
        role: string
        isConfirmed: boolean
        isDeleted: boolean
        deletedAt: string | null
        createdAt: string
        updatedAt: string
        imageUrl?: string;
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

export const useUploadProfilePic = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: async (formData: FormData) => {
            const token = localStorage.getItem('token'); // Grab your access token
            
            // 💡 REMOVED "/api" from the path string below to match your API documentation exactly
            const response = await fetch('https://build-era-kappa.vercel.app/user/profile/picture', {
                method: 'PUT',
                headers: {
                    ...(token && { 'Authorization': `access ${token}` })
                    // Keep Content-Type omitted so browser can bind boundary tags automatically
                },
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Server rejected the file upload');
            }

            return response.json();
        },
        onSuccess: () => {
            // Success! Refetch profile queries to dynamically update the view state avatar
            queryClient.invalidateQueries({ queryKey: ['profile'] }); 
        }
    });
};