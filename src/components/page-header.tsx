interface PageHeaderProps {
    title: string
    description: string
}

export default function PageHeader({ title, description }: PageHeaderProps) {
    return (
        <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl mb-2">{title}</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">{description}</p>
        </div>
    )
}
