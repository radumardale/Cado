import AdminHeader from '@/components/admin/AdminHeader'
import AdminSidebar from '@/components/admin/AdminSidebar'
import NewAdminBlogForm from '@/components/admin/blog/new/NewAdminBlogForm'
import { AdminPages } from '@/lib/enums/AdminPages'
import React from 'react'

export default function AdminBlogPage() {
    return (
        <>
            <AdminSidebar page={AdminPages.BLOG_PAGE} />
            <div className='col-span-full xl:col-span-12 grid grid-cols-12 gap-x-6'>
                <AdminHeader id="nou" href='/admin/blog' page={AdminPages.BLOG_PAGE} />
                <NewAdminBlogForm />
            </div>
        </>
    )
}