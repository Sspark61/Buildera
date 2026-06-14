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

    // 1. Immediate standard 401 check (before trying to read any body payload)
    if (res.status === 401) {
        handleAuthFailure()
        throw new Error('Unauthorized')
    }

    if (!res.ok) {
        let errorMessage = 'Something went wrong'
        
        try {
            // Attempt to parse standard JSON response payload if it exists
            const errorData = await res.json()
            errorMessage = errorData.message || JSON.stringify(errorData)
        } catch {
            // 💡 CRITICAL FIX: If parsing JSON fails because the server sent HTML/Plaintext on a 500 crash, 
            // read the raw response as text instead so it doesn't break our execution flow.
            try {
                errorMessage = await res.text()
            } catch {
                errorMessage = `Server Error (${res.status})`
            }
        }

        // 2. Scan parsed payload safely for authentication crash signatures
        const lowerMessage = errorMessage.toLowerCase()
        if (
            res.status === 500 || 
            lowerMessage.includes('auth') || 
            lowerMessage.includes('token') || 
            lowerMessage.includes('unauthorized') ||
            lowerMessage.includes('jwt')
        ) {
            handleAuthFailure()
        }

        throw new Error(errorMessage)
    }

    return res.json()
}

// Global Redirect Processor
const handleAuthFailure = () => {
    localStorage.removeItem('token')
    if (window.location.pathname !== '/login') {
        const currentPath = window.location.pathname + window.location.search
        window.location.replace(`/login?redirect=${encodeURIComponent(currentPath)}`)
    }
}