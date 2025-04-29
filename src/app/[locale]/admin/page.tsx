import { redirect } from '@/i18n/navigation'
import { getLocale } from 'next-intl/server'

export default async function Admin() {
    const locale = await getLocale();
    redirect({href: "/admin/orders", locale: locale});
  return (
    <div>page</div>
  )
}
