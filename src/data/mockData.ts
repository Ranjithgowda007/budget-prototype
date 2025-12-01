export const MOCK_STATS = [
    {
        id: 'total-budget',
        label: 'Total Budget',
        value: '₹120,00,00,000',
        change: '+10%',
        trend: 'up',
        color: 'blue'
    },
    {
        id: 'expenditure',
        label: 'Expenditure to Date',
        value: '₹45,00,00,000',
        change: '-5%',
        trend: 'down',
        color: 'red'
    },
    {
        id: 'remaining',
        label: 'Remaining Budget',
        value: '₹75,00,00,000',
        change: '+15%',
        trend: 'up',
        color: 'green'
    },
    {
        id: 'pending-approvals',
        label: 'Pending Approvals',
        value: '24',
        change: 'Urgent',
        trend: 'neutral',
        color: 'orange'
    }
];

export const MOCK_CHART_DATA = [
    { name: 'Jan', value: 400 },
    { name: 'Feb', value: 300 },
    { name: 'Mar', value: 600 },
    { name: 'Apr', value: 800 },
    { name: 'May', value: 500 },
    { name: 'Jun', value: 700 },
];

export const MOCK_ACTIVITIES = [
    {
        id: 1,
        title: 'New Scheme for Local Business Support',
        date: 'July 26, 2024',
        description: 'The MP Government has announced a new initiative to support local businesses.',
        type: 'announcement'
    },
    {
        id: 2,
        title: 'Funds allocated to primary schools',
        date: '22 Dec 7:20 PM',
        description: 'Allocation of ₹5Cr for infrastructure development.',
        type: 'transaction'
    },
    {
        id: 3,
        title: 'Procurement of medical supplies',
        date: '21 Dec 11:21 PM',
        description: 'Emergency procurement approved for district hospital.',
        type: 'approval'
    }
];
