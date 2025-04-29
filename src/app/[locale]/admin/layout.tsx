import SessionProviders from "@/components/SessionProviders";

export default function Layout({children}: {children: React.ReactNode}) {
  return (
    <SessionProviders>
        {children}
    </SessionProviders>
  )
}
