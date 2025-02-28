import Balancer from 'react-wrap-balancer'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

const features = [
  {
    title: 'AI-Powered Presentation Generation',
    description: 'Generate professional PowerPoint presentations in minutes with AI-driven content creation. Simply enter a topic, and let AI handle the slide structure, text, and placeholders.',
  },
  {
    title: 'Customizable Slide Layouts',
    description: 'Select from multiple slide layout styles, including text-focused, image-heavy, and balanced designs. The AI adapts to your chosen style for an optimized presentation.',
 
  },
  {
    title: 'Smart Content Structuring',
    description: 'AI intelligently organizes your presentation with clear titles, bullet points, and logical flow, ensuring an engaging and well-structured slide deck.',

  },
  {
    title: 'Integrated Image & Chart Placeholders',
    description: 'Automatically includes placeholders for relevant images, graphs, and charts, allowing easy customization and enhanced visual storytelling.',

  },
  {
    title: 'Fast & Efficient Slide Creation',
    description: 'Generate a full deck of PowerPoint slides in seconds, saving valuable time compared to manual slide design and structuring.',
 
  },
  {
    title: 'Seamless Download & Export',
    description: 'Download your AI-generated presentation in .pptx format, ready for final edits and delivery in Microsoft PowerPoint or Google Slides.',
  },
];

const Features = () => {
  return (
    <section
      id="features"
      className={cn(
        'container space-y-6 rounded-md py-8',
        'md:py-12 px-12',
        'lg:py-16 px-16',
      )}
    >
      <div
        className={cn(
          'mx-auto flex max-w-4xl flex-col items-center space-y-4 text-center',
        )}
      >
        <h2
          className={cn(
            'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-400 bg-clip-text text-center text-4xl font-bold tracking-tight text-transparent drop-shadow-sm',
            'dark:from-gray-100 dark:to-gray-800',
            'md:text-6xl md:leading-tight',
          )}
        >
          Features
        </h2>
        <p
          className={cn(
            'max-w-[85%] leading-normal text-muted-foreground',
            'sm:text-lg',
            'sm:leading-7',
          )}
        >
      <Balancer>
        Transform your ideas into stunning presentations with AI-powered slide generation. Simply input your topic, and Presenta-AI crafts a professional, customizable PowerPoint for you in seconds.
      </Balancer>

        </p>
      </div>
      <div
        className={cn(
          'grid justify-center gap-4',
          'sm:grid-cols-2',
          'md:grid-cols-3',
        )}
      >
        {features.map((feature) => (
          <Card
            key={feature.title}
            className={cn(
              'flex flex-col justify-between rounded-md p-6',
            )}
          >
            {/* <feature.icon className={cn('h-12 w-12')} /> */}
            <div className={cn('space-y-2')}>
              <h3 className="font-bold">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">
                {feature.description}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </section>
  )
}

export default Features
