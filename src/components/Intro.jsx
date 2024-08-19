export default function Intro() {
    return (
        <div className="flex items-left justify-left flex-col text-left pt-20 pb-6">
            <img
                src="/jake_portrait.webp"
                alt="Jake Bailey"
                className="rounded-full w-48 h-48 mb-3"
            />
            <h1 className="text-4xl md:text-7xl mb-1 md:mb-3 font-bold">
                Jake Bailey
            </h1>
            <p className="text-base md:text-xl mb-3 font-medium">
                Software Engineer
            </p>
            <p className="text-md max-w-full md:max-w-md mb-6">
                I am an avid runner, software engineer and hobby photographer
                based in the UK. I have a strong background in technologies such
                as Vue, React/Next.js, Astro and Go. I am constantly looking
                towards new avenues to improve all all of my work and develop my
                skill set, you can visit any of my projects on my GitHub at{' '}
                <a
                    href="https://github.com/jaketbailey/"
                    target="_blank"
                    className="text-blue-500 dark:text-purple-300 hover:underline underline-offset-2 decoration-2 decoration-blue-400 dark:decoration-purple-500"
                    rel="noreferrer noopener"
                >
                    github/jaketbailey
                </a>
                .
            </p>
        </div>
    )
}
