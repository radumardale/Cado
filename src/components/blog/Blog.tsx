import React from 'react'
import BlogCarousel from '../home/blog/BlogCarousel'

export default function Blog() {
  return (
    <div className='col-span-full grid grid-cols-full pt-6 border-t border-black'>
        <BlogCarousel />
    </div>
  )
}