import SessionProviders from '@/components/SessionProviders';
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: {
      default: 'Admin',
      template: '%s | Admin',
    },
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProviders>
      <div className='grid grid-cols-8 lg:grid-cols-15 gap-x-2 lg:gap-x-6 px-4 lg:px-16 max-w-3xl mx-auto relative'>
        {children}
      </div>
    </SessionProviders>
  );
}
