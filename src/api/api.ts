const BaseURL = 'https://build-era-kappa.vercel.app'

export const api = async (endPoint: string , options: RequestInit = {}) => {
    const token = localStorage.getItem('token')

    const res = await fetch(`${BaseURL}${endPoint}`, {
        headers: {
            'Content-Type': 'application/json',
            ...(token && {'Authorization': `access ${token}`})
        },
        ...options
    })

if (res.status === 401) {
    localStorage.removeItem('token');
    if (window.location.pathname !== '/login') {
        window.location.href = '/login';
    }
    return;
}

if (res.status === 400){
    window.location.href = '/login';
}

if (!res.ok) {
    const error = await res.json()
    throw new Error(error.message || 'Something went wrong')
}

return res.json()}