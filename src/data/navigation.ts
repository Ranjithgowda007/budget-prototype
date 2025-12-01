import {
    LayoutDashboard,
    FileText,
    Settings,
    Wallet,
    Shield,
    BookOpen,
    PieChart,
    Users,
    Bell,
    FileBarChart,
    Landmark,
    Briefcase
} from 'lucide-react';

export interface SidebarItem {
    id: string;
    label: string;
    icon: any;
    path?: string;
    subItems?: SidebarItem[];
    requiredRole?: string[];
}

export const NAVIGATION_ITEMS: SidebarItem[] = [
    {
        id: 'dashboard',
        label: 'Dashboard',
        icon: LayoutDashboard,
        path: '/',
    },
    {
        id: 'budget-estimate',
        label: 'Budget Estimate',
        icon: PieChart,
        subItems: [
            { id: 'be-reports', label: 'Budget Reports', icon: FileText, path: '/budget-estimate/reports' },
            { id: 'be-tracking', label: 'Estimation Tracking DoF', icon: FileText, path: '/budget-estimate/tracking' },
            { id: 'be-top-sheet', label: 'Budget Estimate TOP Sheet', icon: FileText, path: '/budget-estimate/top-sheet' },
            { id: 'be-vol3', label: 'BudgetBook Vol3-Explanations', icon: FileText, path: '/budget-estimate/vol3' },
            { id: 'be-vol2', label: 'BudgetBook Vol2-Explanations', icon: FileText, path: '/budget-estimate/vol2' },
            { id: 'fs-memo-cons', label: 'FS Memo Consolidated Explanations', icon: FileText, path: '/budget-estimate/fs-memo-cons' },
            { id: 'obj-head-wise', label: 'Object Head Wise Report-BCO', icon: FileText, path: '/budget-estimate/obj-head-wise' },
            { id: 'est-comp-receipt', label: 'Estimate Comparision Receipt Report', icon: FileText, path: '/budget-estimate/est-comp-receipt' },
            { id: 'est-comp', label: 'Estimate Comparision Report', icon: FileText, path: '/budget-estimate/est-comp' },
        ]
    },
    {
        id: 'budget-head-config',
        label: 'Budget Head Configuration',
        icon: Settings,
        subItems: [
            { id: 'demand-no', label: 'Demand No', icon: FileText, path: '/config/demand-no' },
            { id: 'major-head', label: 'Major Head Master', icon: FileText, path: '/config/major-head' },
            { id: 'sub-major-head', label: 'Sub Major Head Master', icon: FileText, path: '/config/sub-major-head' },
            { id: 'minor-head', label: 'Minor Head Master', icon: FileText, path: '/config/minor-head' },
            { id: 'scheme-master', label: 'Scheme Master', icon: FileText, path: '/config/scheme-master' },
            { id: 'segment-code', label: 'Segment Code Master', icon: FileText, path: '/config/segment-code' },
            { id: 'object-code', label: 'Object Code Master', icon: FileText, path: '/config/object-code' },
            { id: 'detail-head', label: 'Detail Head Master', icon: FileText, path: '/config/detail-head' },
            {
                id: 'budget-head',
                label: 'Budget Head Master',
                icon: FileText,
                subItems: [
                    { id: 'search-budget-head', label: 'Search/Update Budget Head Master', icon: FileText, path: '/config/budget-head/search' },
                    { id: 'create-budget-head', label: 'Create New Budget Head Master', icon: FileText, path: '/config/budget-head/create' },
                ]
            },
            { id: 'public-account', label: 'Budget scheme master for public account', icon: FileText, path: '/config/public-account' },
            { id: 'book-no', label: 'Book No Master', icon: FileText, path: '/config/book-no' },
        ]
    },
    {
        id: 'budget-management',
        label: 'Budget Management',
        icon: Wallet,
        subItems: [
            { id: 'allotment', label: 'Budget Allotment/Distribution Process', icon: FileText, path: '/management/allotment' },
        ]
    },
    {
        id: 'budget-admin',
        label: 'Budget Admin Section',
        icon: Shield,
        subItems: [
            { id: 'reappropriation', label: 'Budget Reappropriation Sanction Order', icon: FileText, path: '/admin/reappropriation' },
            { id: 'fs-memo', label: 'FS memo Data entry screen', icon: FileText, path: '/admin/fs-memo' },
            { id: 'bco-grant', label: 'BCO Grant Limit Master', icon: FileText, path: '/admin/bco-grant' },
        ]
    },
    {
        id: 'reports',
        label: 'Reports Section',
        icon: BookOpen,
        subItems: [
            { id: 'fs-memo-report', label: 'FS-Memo', icon: FileText, path: '/reports/fs-memo' },
            { id: 'frbm-report', label: 'FRBM Report', icon: FileText, path: '/reports/frbm' },
            { id: 'budget-mgmt-reports', label: 'Budget Management Reports', icon: FileText, path: '/reports/budget-mgmt' },
            { id: 'budget-book', label: 'Budget Book', icon: FileText, path: '/reports/budget-book' },
            { id: 'dept-scheme-data', label: 'Department wise Scheme data for 5 Years', icon: FileText, path: '/reports/dept-scheme-data' },
            { id: 'upload-scheme-report', label: 'Upload New Scheme Report', icon: FileText, path: '/reports/upload-scheme-report' },
            { id: 'supp-budget-status', label: 'Supplementary Budget Prepared Status', icon: FileText, path: '/reports/supp-budget-status' },
            { id: 'supp-budget-tracking', label: 'Supplementary Budget Tracking Report', icon: FileText, path: '/reports/supp-budget-tracking' },
            { id: 'vote-on-account', label: 'Vote On Account Allotment Budget Book', icon: FileText, path: '/reports/vote-on-account' },
            { id: 'supp-budget-reports', label: 'Supplementary Budget Reports', icon: FileText, path: '/reports/supp-budget-reports' },
            { id: 'est-tracking-minor', label: 'Estimate Tracking Report for Minor and Object', icon: FileText, path: '/reports/est-tracking-minor' },
        ]
    }
];
