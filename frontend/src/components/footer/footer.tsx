import Link from 'next/link'
import { FaGithub } from "react-icons/fa";
import { cn } from '@/lib/utils'

const Footer = () => {
  return (
    <footer className={cn('relative z-10 w-full py-2 lg:px-24 px-4', 'md:py-0')}>
      <div
        className={cn(
          'container flex flex-col items-center justify-between gap-2',
          'md:h-20',
          'md:flex-row',
        )}
      >
        <div className='space-x-4 text-center dark:text-slate-200 text-gray-800 text-sm leading-loose'>
        © {new Date().getFullYear()} Presenta-AI. All rights reserved.
        </div>
        <div
          className={cn(
            'space-x-4 text-center text-sm leading-loose text-muted-foreground',
            'md:text-left',
          )}
        >
          <Link
            href="https://github.com/engraya/presenta-ai"
            target='_blank'
            className={cn(
              'font-semibold',
              'hover:underline hover:underline-offset-4',
            )}
          >
            <FaGithub size={"1.5rem"}/>
          </Link>
        </div>
      </div>
    </footer>
  )
}

export default Footer
