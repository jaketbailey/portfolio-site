import portfolio from '../data/portfolio'
import PortfolioItem from './PortfolioItem'

export default function Portfolio() {
    return (
        <div className="grid grid-cols-1 gap-6">
            {portfolio.map((project) => (
                <PortfolioItem key={project.title} {...project} />
            ))}
        </div>
    )
}
