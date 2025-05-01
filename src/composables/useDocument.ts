export const useDocument = () => {
    const formatExpiryDate = (input: string | null | undefined) => {
        if (!input) {
            return 'Never'
        }

        const date = new Date(input)
        return new Intl.DateTimeFormat('en-AU', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        }).format(date)
    }

    return {
        formatExpiryDate,
    }
}
