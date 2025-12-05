import { AppContent } from '@/pages/dashboard/_components/app-content';
import { AppShell } from '@/pages/dashboard/_components/app-shell';
import { AppSidebar } from '@/pages/dashboard/_components/app-sidebar';
import { AppSidebarHeader } from '@/pages/dashboard/_components/app-sidebar-header';
import { type BreadcrumbItem } from '@/types';
import { type PropsWithChildren } from 'react';

export default function AppSidebarLayout({
    children,
    breadcrumbs = [],
}: PropsWithChildren<{ breadcrumbs?: BreadcrumbItem[] }>) {
    return (
        <AppShell variant="sidebar">
            <AppSidebar />
            <AppContent variant="sidebar" className="overflow-x-hidden">
                <AppSidebarHeader breadcrumbs={breadcrumbs} />
                {children}
            </AppContent>
        </AppShell>
    );
}
