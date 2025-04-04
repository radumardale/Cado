'use client'

import { BlogTags } from '@/lib/enums/BlogTags'
import React, { Fragment } from 'react'
import BlogCard from './BlogCard';

const blogs = [
    {
        image: "/categories/ACCESSORIES.jpg",
        tag: BlogTags.RECOMMENDATIONS,
        title: "De ce cadourile corporate de la CADO sunt mai mult decât un set clasic?",
        date: "05.06.2025"
    },
    {
        image: "/categories/FOR_HIM.jpg",
        tag: BlogTags.NEWS,
        title: "Christmas World 2025 unde dorințele devin realitate",
        date: "05.06.2025"
    },
    {
        image: "/categories/FOR_HER.jpg",
        tag: BlogTags.EXPERIENCES,
        title: "Ce nu ar trebui să fie într-un cadou: ce excludem și nu vă recomandăm",
        date: "05.06.2025"
    },
    {
        image: "/categories/FOR_KIDS.jpg",
        tag: BlogTags.RECOMMENDATIONS,
        title: "CADO: Povestea transformării și creșterii",
        date: "05.06.2025"
    }
]

export default function BlogGrid() {
  return (
    <div className='col-start-2 col-span-13 grid grid-cols-13 gap-y-12 gap-x-6 mb-42'>
        {
            blogs.map((blog, index) => {
                return (
                    <Fragment key={index}>
                        <BlogCard src={blog.image} tag={blog.tag} title={blog.title} date={blog.date} />
                        {(index + 1) % 2 !== 0 && <div className='col-span-1'></div>}
                    </Fragment>
                )
            })
        }
    </div>
  )
}