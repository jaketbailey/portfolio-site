import portfolio from '../data/portfolio'
import PortfolioItem from './PortfolioItem'
import SectionHeading from './SectionHeading'

export default function Portfolio() {
    return (
        <section id="projects" className="pt-10 scroll-mt-16">
            <SectionHeading>Projects</SectionHeading>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {portfolio.map((project) => (
                    <PortfolioItem key={project.title} {...project} />
                ))}
            </div>
        </section>
    )
}
