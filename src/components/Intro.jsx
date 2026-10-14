import skills from '../data/skills'
import Socials from './Socials'

export default function Intro() {
    return (
        <section className="flex flex-col md:flex-row md:items-center gap-6 md:gap-12 pt-32 md:pt-28 pb-4">
            <img
                src="/jake_portrait.webp"
                alt="Jake Bailey"
                className="rounded-full w-40 h-40 md:w-56 md:h-56 shrink-0"
            />
            <div className="min-w-0">
                <h1 className="text-5xl md:text-7xl mb-2 md:mb-3 font-semibold leading-none">
                    Jake Bailey
                </h1>
                <p className="text-lg md:text-xl mb-3 font-medium text-muted">
                    Software Engineer
                </p>
                <p className="text-md max-w-2xl mb-4">
                    I am a software engineer and hobby photographer based in the
                    UK, and spend as much time as I can outdoors running,
                    hiking, climbing and scrambling. I am constantly looking
                    towards new avenues to improve all of my work and develop my
                    skill set, you can visit any of my projects on my GitHub at{' '}
                    <a
                        href="https://github.com/jaketbailey/"
                        target="_blank"
                        className="text-link hover:underline underline-offset-2 decoration-2 decoration-accent"
                        rel="noreferrer noopener"
                    >
                        github/jaketbailey
                    </a>
                    .
                </p>
                <ul aria-label="Skills" className="flex flex-wrap gap-2">
                    {skills.map((skill) => (
                        <li
                            key={skill}
                            className="px-2 py-1 text-xs font-semibold uppercase tracking-wide rounded-md bg-tag text-tag-ink"
                        >
                            {skill}
                        </li>
                    ))}
                </ul>
                <div className="flex flex-wrap gap-2 mt-5">
                    <Socials />
                </div>
            </div>
        </section>
    )
}
