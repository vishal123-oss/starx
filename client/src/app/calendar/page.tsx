'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CalendarView from '@/components/calendar-view';
import { useAuth } from '@/contexts/auth-context';
import { Skeleton } from '@/components/ui/skeleton';
import './calendar.css';

export default function CalendarPage() {
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [authLoading, isAuthenticated, router]);

  if (authLoading || !isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Skeleton className="h-10 w-64 mb-8" />
        <Skeleton className="h-96 w-full rounded-lg" />
      </div>
    );
  }

  return <CalendarView />;
}