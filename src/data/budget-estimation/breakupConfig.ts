// Breakup Configuration for BE1 field
// Maps Object Head + Detail Head combinations to their breakup form types

export type BreakupFormType =
    | 'basic_pay'
    | 'dearness_allowance'
    | 'transport_allowance'
    | 'hra'
    | 'other_allowances'
    | 'medical_reimbursement'
    | 'festival_advance'
    | 'grain_advance'
    | 'medical_advance'
    | 'special_pay'
    | 'contractual_payment'
    | 'wages'
    | 'ltc'
    | 'cca'
    | 'outsourced_staff'
    | 'telephone'
    | 'furniture'
    | 'electricity'
    | 'petrol_oil'
    | 'office_equipment'
    | 'it_assets'
    | 'transportation_service';

export interface BreakupConfig {
    type: BreakupFormType;
    label: string;
    description: string;
    category: 'salary' | 'equipment' | 'service' | 'utility';
}

// Mapping of Object Head + Detail Head to Breakup Configuration
export const BREAKUP_MAPPINGS: Record<string, BreakupConfig> = {
    // Object Head 11 - Salary
    '11-001': { type: 'basic_pay', label: 'Basic Pay', description: 'Regular Salary (Permanent Employees)', category: 'salary' },
    '11-003': { type: 'dearness_allowance', label: 'Dearness Allowance', description: 'DA Calculation', category: 'salary' },
    '11-004': { type: 'transport_allowance', label: 'Transport Allowance', description: 'TA for employees', category: 'salary' },
    '11-006': { type: 'hra', label: 'House Rent Allowance', description: 'HRA Calculation', category: 'salary' },
    '11-007': { type: 'cca', label: 'City Compensatory Allowance', description: 'CCA for city employees', category: 'salary' },
    '11-008': { type: 'other_allowances', label: 'Other Allowances', description: 'CCA, Risk Allowance, etc.', category: 'salary' },
    '11-009': { type: 'medical_reimbursement', label: 'Medical Reimbursement', description: 'Medical claims', category: 'salary' },
    '11-011': { type: 'festival_advance', label: 'Festival Advance', description: 'Festival advance payment', category: 'salary' },
    '11-016': { type: 'grain_advance', label: 'Grain Advance', description: 'Grain advance for employees', category: 'salary' },
    '11-118': { type: 'special_pay', label: 'Special Pay', description: 'Special pay allowance', category: 'salary' },

    // Object Head 12 - Wages
    '12-000': { type: 'wages', label: 'Wages', description: 'Daily Wagers / Mali / Helper', category: 'salary' },
    '12-001': { type: 'basic_pay', label: 'Basic Pay (Labour)', description: 'Wages - Labour', category: 'salary' },
    '12-003': { type: 'dearness_allowance', label: 'Dearness Allowance', description: 'DA for Labour', category: 'salary' },

    // Object Head 16 - IAS Salary
    '16-001': { type: 'basic_pay', label: 'Basic Pay (IAS)', description: 'IAS Salary', category: 'salary' },
    '16-003': { type: 'dearness_allowance', label: 'Dearness Allowance', description: 'DA for IAS', category: 'salary' },
    '16-006': { type: 'hra', label: 'House Rent Allowance', description: 'HRA for IAS', category: 'salary' },
    '16-008': { type: 'other_allowances', label: 'Other Allowances', description: 'Other allowances for IAS', category: 'salary' },
    '16-009': { type: 'medical_reimbursement', label: 'Medical Reimbursement', description: 'Medical for IAS', category: 'salary' },
    '16-010': { type: 'ltc', label: 'Leave Travel Facility', description: 'LTC for IAS officers', category: 'salary' },
    '16-018': { type: 'medical_advance', label: 'Medical Advance', description: 'Medical advance for IAS', category: 'salary' },

    // Object Head 19 - Work-Charged / Temporary
    '19-001': { type: 'basic_pay', label: 'Basic Pay (Temporary)', description: 'Temporary Employee Salary', category: 'salary' },
    '19-003': { type: 'dearness_allowance', label: 'Dearness Allowance', description: 'DA for Temporary', category: 'salary' },
    '19-006': { type: 'hra', label: 'House Rent Allowance', description: 'HRA for Temporary', category: 'salary' },
    '19-008': { type: 'other_allowances', label: 'Other Allowances', description: 'Other allowances', category: 'salary' },
    '19-009': { type: 'medical_reimbursement', label: 'Medical Reimbursement', description: 'Medical claims', category: 'salary' },
    '19-011': { type: 'festival_advance', label: 'Festival Advance', description: 'Festival advance', category: 'salary' },
    '19-016': { type: 'grain_advance', label: 'Grain Advance', description: 'Grain advance', category: 'salary' },
    '19-018': { type: 'medical_advance', label: 'Medical Advance', description: 'Medical advance', category: 'salary' },

    // Object Head 22 - Office Expenses
    '22-002': { type: 'telephone', label: 'Telephone', description: 'Telephone connections', category: 'equipment' },
    '22-003': { type: 'furniture', label: 'Furniture Purchase', description: 'Office furniture', category: 'equipment' },
    '22-005': { type: 'electricity', label: 'Electricity', description: 'Electricity charges', category: 'utility' },
    '22-009': { type: 'petrol_oil', label: 'Petrol, Oil etc', description: 'Vehicle fuel expenses', category: 'equipment' },

    // Object Head 23 - Office Equipment
    '23-001': { type: 'office_equipment', label: 'Office Equipment', description: 'Printer, Scanner, UPS, etc.', category: 'equipment' },

    // Object Head 27 - IT Assets
    '27-001': { type: 'it_assets', label: 'IT & Computer Purchase', description: 'IT Assets Capital', category: 'equipment' },

    // Object Head 31 - Services
    '31-004': { type: 'outsourced_staff', label: 'Outsourced Staff Payment', description: 'Contract staff payment', category: 'service' },
    '31-007': { type: 'transportation_service', label: 'Transportation Service', description: 'Rental vehicles', category: 'service' },
};

/**
 * Check if a budget line requires breakup based on object head and detail head
 */
export function requiresBreakup(objectHead: string, detailHead: string): boolean {
    const key = `${objectHead}-${detailHead}`;
    return key in BREAKUP_MAPPINGS;
}

/**
 * Get breakup configuration for a budget line
 */
export function getBreakupConfig(objectHead: string, detailHead: string): BreakupConfig | null {
    const key = `${objectHead}-${detailHead}`;
    return BREAKUP_MAPPINGS[key] || null;
}

/**
 * Get all breakup types for a category
 */
export function getBreakupsByCategory(category: 'salary' | 'equipment' | 'service' | 'utility'): BreakupConfig[] {
    return Object.values(BREAKUP_MAPPINGS).filter(config => config.category === category);
}

// Field definitions for each form type
export interface BreakupFieldDef {
    name: string;
    label: string;
    type: 'text' | 'number' | 'dropdown' | 'display' | 'textarea';
    required: boolean;
    options?: string[];
    formula?: string; // For calculated fields
}

// Common fields across salary-type breakups
export const SALARY_COMMON_FIELDS: BreakupFieldDef[] = [
    { name: 'gradePay', label: 'Grade Pay Code', type: 'dropdown', required: true, options: ['GP1800', 'GP2400', 'GP2800', 'GP4200', 'GP4600', 'GP5400', 'GP6600', 'GP7600'] },
    { name: 'employeeCount', label: 'Employee Count', type: 'number', required: true },
    { name: 'avgBasicPay', label: 'Average Basic Pay (₹)', type: 'number', required: true },
];

export const EQUIPMENT_COMMON_FIELDS: BreakupFieldDef[] = [
    { name: 'itemName', label: 'Item Name', type: 'text', required: true },
    { name: 'description', label: 'Description', type: 'text', required: false },
    { name: 'oldQuantity', label: 'Old Available Qty', type: 'number', required: true },
    { name: 'newQuantity', label: 'New Required Qty', type: 'number', required: true },
    { name: 'unitCost', label: 'Per Unit Cost (₹)', type: 'number', required: true },
    { name: 'totalCost', label: 'Total Cost (₹)', type: 'display', required: false, formula: 'newQuantity * unitCost' },
];

export const SERVICE_COMMON_FIELDS: BreakupFieldDef[] = [
    { name: 'staffType', label: 'Type', type: 'dropdown', required: true, options: ['Peon', 'DEO', 'Security', 'Sweeper', 'Driver', 'Other'] },
    { name: 'staffCount', label: 'Staff Count', type: 'number', required: true },
    { name: 'monthlyRate', label: 'Monthly Rate (₹)', type: 'number', required: true },
    { name: 'duration', label: 'Duration (Months)', type: 'number', required: true },
    { name: 'annualCost', label: 'Annual Cost (₹)', type: 'display', required: false, formula: 'staffCount * monthlyRate * duration' },
];
