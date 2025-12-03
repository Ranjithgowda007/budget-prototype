export interface ModuleConfig {
    id: string;
    name: string;
    path: string;
    description?: string;
    icon?: string;
    animationUrl?: string; // URL to Lottie JSON
}

export const MODULES: ModuleConfig[] = [
    {
        id: 'dashboard',
        name: 'Dashboard',
        path: '/dashboard',
        description: 'Main Dashboard',
        icon: 'LayoutDashboard',
        animationUrl: 'https://lottie.host/88888888-8888-8888-8888-888888888888/sample.json' // Placeholder
    },
    {
        id: 'budget',
        name: 'Budget',
        path: '/budget',
        description: 'Budget Management System',
        icon: 'Wallet'
    },
    {
        id: 'bms',
        name: 'BMS',
        path: '/bms',
        description: 'Budget Management System',
        icon: 'FileText'
    },
    {
        id: 'audit',
        name: 'Audit',
        path: '/audit',
        description: 'Audit Management',
        icon: 'Shield'
    },
    {
        id: 'book-keeping',
        name: 'Book Keeping',
        path: '/book-keeping',
        description: 'Book Keeping & Accounting',
        icon: 'BookOpen'
    },
    {
        id: 'debt',
        name: 'Debt',
        path: '/debt',
        description: 'Debt Management',
        icon: 'CreditCard'
    },
    {
        id: 'deposit',
        name: 'Deposit',
        path: '/deposit',
        description: 'Deposit Management',
        icon: 'Landmark'
    },
    {
        id: 'e-accounting',
        name: 'E-Accounting',
        path: '/e-accounting',
        description: 'Electronic Accounting',
        icon: 'FileCheck'
    },
    {
        id: 'e-receipt',
        name: 'E-Receipt',
        path: '/e-receipt',
        description: 'Electronic Receipts',
        icon: 'FileText'
    },
    {
        id: 'e-sanction',
        name: 'E-Sanction',
        path: '/e-sanction',
        description: 'Electronic Sanctions',
        icon: 'FileCheck'
    },
    {
        id: 'grievance',
        name: 'Grievance',
        path: '/grievance',
        description: 'Grievance Redressal',
        icon: 'AlertCircle'
    },
    {
        id: 'hrmis',
        name: 'HRMIS',
        path: '/hrmis',
        description: 'Human Resource Management',
        icon: 'Users'
    },
    {
        id: 'inspection',
        name: 'Inspection',
        path: '/inspection',
        description: 'Inspection Management',
        icon: 'Search'
    },
    {
        id: 'lms-ats',
        name: 'LMS & ATS',
        path: '/lms-ats',
        description: 'Legal & Audit Tracking',
        icon: 'Award'
    },
    {
        id: 'pension',
        name: 'Pension',
        path: '/pension',
        description: 'Pension Management',
        icon: 'UserCheck'
    },
    {
        id: 'purchase',
        name: 'Purchase',
        path: '/purchase',
        description: 'Purchase & Procurement',
        icon: 'ShoppingCart'
    },
    {
        id: 'strong-room',
        name: 'Strong Room',
        path: '/strong-room',
        description: 'Strong Room Management',
        icon: 'HardDrive'
    },
    {
        id: 'vendor',
        name: 'Vendor',
        path: '/vendor',
        description: 'Vendor Management',
        icon: 'Briefcase'
    }
];

export const DEFAULT_MODULE_ID = 'dashboard';

export function getModuleById(id: string): ModuleConfig | undefined {
    return MODULES.find(m => m.id === id);
}
