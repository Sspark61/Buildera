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
        let errorData: any = null

        try {
            // Attempt to parse standard JSON response payload if it exists
            const parsedError = await res.json()
            errorData = parsedError
            errorMessage = parsedError.message || JSON.stringify(parsedError)
        } catch {
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

        // 💡 CRITICAL FIX: Attach nested data to the error instance so calling functions can read errors/warnings
        const thrownError = new Error(errorMessage) as any;
        if (errorData?.data) {
            thrownError.data = errorData.data;
        }
        throw thrownError;
    }

    return res.json()
}

// Global Redirect Processor
const handleAuthFailure = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userName')
    if (window.location.pathname !== '/login') {
        const currentPath = window.location.pathname + window.location.search
        window.location.replace(`/login?redirect=${encodeURIComponent(currentPath)}`)
    }
}