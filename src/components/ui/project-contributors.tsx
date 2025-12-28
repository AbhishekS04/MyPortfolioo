import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import Link from 'next/link'

export interface Contributor {
    id?: string
    name: string
    avatar_url: string
    fallback: string
    social_url?: string
    role?: string
}

interface ProjectContributorsProps {
    contributors: Contributor[]
    className?: string
    size?: 'sm' | 'md' | 'lg'
}

const ProjectContributors = ({ contributors, className = '', size = 'md' }: ProjectContributorsProps) => {
    const sizeClasses = {
        sm: 'size-8',
        md: 'size-10',
        lg: 'size-12'
    }

    return (
        <div className={`flex -space-x-3 ${className}`}>
            <TooltipProvider delayDuration={0}>
                {contributors.map((contributor, index) => (
                    <Tooltip key={index}>
                        <TooltipTrigger asChild>
                            <Link
                                href={contributor.social_url || '#'}
                                target={contributor.social_url ? "_blank" : "_self"}
                                className={`relative transition-transform hover:z-10 hover:scale-110`}
                            >
                                <Avatar className={`ring-background ring-2 ${sizeClasses[size]}`}>
                                    <AvatarImage src={contributor.avatar_url} alt={contributor.name} className="object-cover" />
                                    <AvatarFallback>{contributor.fallback}</AvatarFallback>
                                </Avatar>
                            </Link>
                        </TooltipTrigger>
                        <TooltipContent>
                            <div className="flex flex-col items-center">
                                <span className="font-semibold text-xs">{contributor.name}</span>
                                {contributor.role && <span className="text-[10px] text-muted-foreground">{contributor.role}</span>}
                            </div>
                        </TooltipContent>
                    </Tooltip>
                ))}
            </TooltipProvider>
        </div>
    )
}

export default ProjectContributors
