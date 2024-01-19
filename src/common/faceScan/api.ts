export const getTransactionResult = async ({ baseUrl, token, }: { baseUrl: string; token: string; }) => {
    const requestOptions: RequestInit = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        redirect: 'manual'
    };

    const result = await fetch(`${baseUrl}/${token}/next`, requestOptions);

    if (result.status > 300 && result.status <= 307) {
        const location = result.headers.get('location') || '';
        console.log('redirecting to...', location)
        setTimeout(() => {
            window.location.href = location;
        }, 1000);
        return;
    }

    return result.json();
};