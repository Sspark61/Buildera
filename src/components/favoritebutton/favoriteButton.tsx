import { Heart } from 'lucide-react'
import { useGetFavorites, useAddFavorite, useRemoveFavorite } from '@/hooks/use-favorites'

interface FavoriteButtonProps {
    componentId: number
    className?: string
}

const FavoriteButton = ({ componentId, className = '' }: FavoriteButtonProps) => {
    const { data } = useGetFavorites()
    const { mutate: addFavorite, isPending: isAdding } = useAddFavorite()
    const { mutate: removeFavorite, isPending: isRemoving } = useRemoveFavorite()

    const isFavorited = data?.data?.some(f => f.id === componentId) ?? false
    const isPending = isAdding || isRemoving

    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault()  // prevent navigation if inside a Link
        e.stopPropagation()
        if (isPending) return
        if (isFavorited) {
            removeFavorite(componentId)
        } else {
            addFavorite(componentId)
        }
    }

    return (
        <button
            onClick={handleClick}
            disabled={isPending}
            className={`
                w-8 h-8 rounded-full flex items-center justify-center
                transition-all duration-200
                ${isFavorited
                    ? 'bg-primary text-white'
                    : 'bg-black/40 backdrop-blur-sm text-white/70 hover:text-white hover:bg-black/60'
                }
                ${isPending ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                ${className}
            `}
        >
            <Heart
                className="w-4 h-4"
                fill={isFavorited ? 'currentColor' : 'none'}
                strokeWidth={2}
            />
        </button>
    )
}

export default FavoriteButton