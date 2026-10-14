export default function SectionHeading({ children, className = '' }) {
    return (
        <h2
            className={`text-3xl md:text-4xl font-semibold leading-tight underline decoration-accent decoration-4 underline-offset-8 mb-6 ${className}`}
        >
            {children}
        </h2>
    )
}
