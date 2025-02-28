import React from 'react'
import PagesWrapper from '@/components/PagesWrapper'


function AboutPage() {
  return (
    <PagesWrapper>
    <div className="w-full mx-auto text-left md:w-11/12 xl:w-9/12 md:text-center">
      <h1 className="mb-4 text-xl font-extrabold leading-none tracking-normal text-gray-900 md:text-4xl md:tracking-tight">
        <span className="block w-full text-transparent text-center bg-clip-text bg-gradient-to-r from-green-400 to-purple-500 lg:inline">
        About Presenta-AI 
        </span>
      </h1>
    </div>
      <blockquote className="flex flex-col items-center p-4">
          <p className="max-w-4xl text-lg font-normal dark:text-slate-200 text-gray-800 text-center md:text-xl lg:text-2xl">Presenta-AI is an advanced AI-powered PowerPoint generator that automates the creation of professional presentations in minutes. Whether you need a pitch deck, a business report, or an educational slideshow, Presenta-AI streamlines the process with intelligent content generation, diverse layouts, and seamless customization. With just a few inputs—such as a topic, number of slides, and preferred design—our AI crafts structured and visually appealing presentations tailored to your needs.
          </p>
      </blockquote>
    </PagesWrapper>
  )
}

export default AboutPage
