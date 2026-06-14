const BaseURL = 'https://build-era-kappa.vercel.app'

export const api = async (endPoint: string, options: RequestInit = {}) => {
    const token = localStorage.getItem('token')

    const res = await fetch(`${BaseURL}${endPoint}`, {
        headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `access ${token}` })
        },
        ...options
    })

    // 1. Standard 401 check
    if (res.status === 401) {
        handleAuthFailure()
        throw new Error('Unauthorized')
    }

    if (!res.ok) {
        const error = await res.json()
        const errorMessage = error.message || 'Something went wrong'

        // 2. 💡 BACKEND WORKAROUND: Catch 500 crashes caused by dead authentication tokens
        const lowerMessage = errorMessage.toLowerCase()
        if (res.status === 500 && (lowerMessage.includes('auth') || lowerMessage.includes('token') || lowerMessage.includes('unauthorized'))) {
            handleAuthFailure()
        }

        throw new Error(errorMessage)
    }

    return res.json()
}

// Reusable redirection logic helper
const handleAuthFailure = () => {
    localStorage.removeItem('token')
    if (window.location.pathname !== '/login') {
        const currentPath = window.location.pathname + window.location.search
        window.location.replace(`/login?redirect=${encodeURIComponent(currentPath)}`)
    }
}