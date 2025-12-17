// SDG Goals and Targets reference data

export const SDG_GOALS = [
    { id: '1', name: 'No Poverty', color: '#e5243b' },
    { id: '2', name: 'Zero Hunger', color: '#dda63a' },
    { id: '3', name: 'Good Health and Well-being', color: '#4c9f38' },
    { id: '4', name: 'Quality Education', color: '#c5192d' },
    { id: '5', name: 'Gender Equality', color: '#ff3a21' },
    { id: '6', name: 'Clean Water and Sanitation', color: '#26bde2' },
    { id: '7', name: 'Affordable and Clean Energy', color: '#fcc30b' },
    { id: '8', name: 'Decent Work and Economic Growth', color: '#a21942' },
    { id: '9', name: 'Industry, Innovation and Infrastructure', color: '#fd6925' },
    { id: '10', name: 'Reduced Inequality', color: '#dd1367' },
    { id: '11', name: 'Sustainable Cities and Communities', color: '#fd9d24' },
    { id: '12', name: 'Responsible Consumption and Production', color: '#bf8b2e' },
    { id: '13', name: 'Climate Action', color: '#3f7e44' },
    { id: '14', name: 'Life Below Water', color: '#0a97d9' },
    { id: '15', name: 'Life on Land', color: '#56c02b' },
    { id: '16', name: 'Peace, Justice and Strong Institutions', color: '#00689d' },
    { id: '17', name: 'Partnerships for the Goals', color: '#19486a' }
];

export const OUTCOME_CATEGORIES = [
    'Learning Level Improvement',
    'Health Impact',
    'Infrastructure Development',
    'Employment Generation',
    'Poverty Reduction',
    'Environmental Conservation',
    'Digital Inclusion',
    'Women Empowerment',
    'Rural Development',
    'Urban Development'
];

export const GEOGRAPHY_TAGS = [
    'Statewide',
    'District - Bhopal',
    'District - Indore',
    'District - Jabalpur',
    'District - Gwalior',
    'District - Ujjain',
    'Block - Urban',
    'Block - Rural'
];

export const GENDER_TAGS = ['General', 'Women', 'Child', 'Youth'] as const;
