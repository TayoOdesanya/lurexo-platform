'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import AdminSidebar from './AdminSidebar';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
  // TEMPORARILY DISABLED FOR DEVELOPMENT
  // Will re-enable when connecting to real backend
  
  // const checkAdminAccess = () => {
  //   const user = localStorage.getItem('user');
  //   
  //   if (!user) {
  //     router.push('/login');
  //     return;
  //   }
  //
  //   try {
  //     const userData = JSON.parse(user);
  //     
  //     if (!userData.is_admin) {
  //       router.push('/');
  //     }
  //   } catch (error) {
  //     console.error('Error parsing user data:', error);
  //     router.push('/login');
  //   }
  // };
  //
  // checkAdminAccess();
}, [router, pathname]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex flex-col">
      <Navigation />

      <div className="flex flex-1">
        <AdminSidebar />

        <main className="flex-1 overflow-x-hidden">
          <div className="p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
