import React from 'react';
import portfolio from '../data/portfolio';
import Modal from './Modal';
import PortfolioItem from './PortfolioItem';

export default function Portfolio({ theme }) {
   


   return (
      <div className="flex flex-col items-left justify-left">
         <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-6">
            {portfolio.map(project => (
               <PortfolioItem 
                  imgUrl={project.imgUrl}
                  imgUrlLight={project.imgUrlLight}
                  title={project.title}
                  stack={project.stack}
                  link={project.link}
                  description={project.description}
                  theme={theme}
               />
            ))}
         </div>
         
      </div>
   )
}
