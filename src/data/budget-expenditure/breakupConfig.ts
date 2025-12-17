// Comprehensive Breakup Configuration for BE1 field
// Contains specific field definitions for each Object Head + Detail Head combination

export interface BreakupFieldDef {
    name: string;
    label: string;
    type: 'text' | 'number' | 'dropdown' | 'display' | 'textarea';
    required: boolean;
    options?: string[];
    placeholder?: string;
    width?: 'sm' | 'md' | 'lg' | 'xl';
    isCalculated?: boolean;
}

export interface BreakupTypeConfig {
    key: string;
    label: string;
    description: string;
    objectHeads: string[];
    detailHead: string;
    fields: BreakupFieldDef[];
    calculateTotal: (item: Record<string, any>) => number;
}

// All breakup type configurations
export const BREAKUP_TYPE_CONFIGS: BreakupTypeConfig[] = [
    // ========== BASIC PAY (11, 12, 19 - 001) ==========
    {
        key: 'basic_pay',
        label: 'Basic Pay',
        description: 'Regular Salary (Permanent Employees)',
        objectHeads: ['11', '12', '19'],
        detailHead: '001',
        fields: [
            { name: 'gradePay', label: 'Grade Pay Code', type: 'dropdown', required: true, options: ['GP1800', 'GP2400', 'GP2800', 'GP4200', 'GP4600', 'GP5400', 'GP6600', 'GP7600'], width: 'md' },
            { name: 'employeeCount', label: 'Employee Count', type: 'number', required: true, width: 'sm' },
            { name: 'avgBasicPay', label: 'Avg Basic Pay (₹)', type: 'number', required: true, width: 'md' },
            { name: 'incrementPercent', label: 'Increment %', type: 'number', required: true, placeholder: '3', width: 'sm' },
            { name: 'monthlyBasic', label: 'Monthly Basic (₹)', type: 'display', required: false, isCalculated: true, width: 'md' },
            { name: 'annualBasic', label: 'Annual Basic (₹)', type: 'display', required: false, isCalculated: true, width: 'md' },
            { name: 'remarks', label: 'Remarks', type: 'textarea', required: false, width: 'xl' },
        ],
        calculateTotal: (item) => {
            const count = Number(item.employeeCount) || 0;
            const basic = Number(item.avgBasicPay) || 0;
            const increment = Number(item.incrementPercent) || 3;
            return count * basic * (1 + increment / 100) * 12;
        }
    },

    // ========== DEARNESS ALLOWANCE (11, 12, 16, 19 - 003) ==========
    {
        key: 'dearness_allowance',
        label: 'Dearness Allowance',
        description: 'DA Calculation',
        objectHeads: ['11', '12', '16', '19'],
        detailHead: '003',
        fields: [
            { name: 'gradePay', label: 'Grade Pay Code', type: 'dropdown', required: true, options: ['GP1800', 'GP2400', 'GP2800', 'GP4200', 'GP4600', 'GP5400', 'GP6600', 'GP7600'], width: 'md' },
            { name: 'employeeCount', label: 'Employee Count', type: 'number', required: true, width: 'sm' },
            { name: 'avgBasicPay', label: 'Avg Basic Pay (₹)', type: 'number', required: true, width: 'md' },
            { name: 'daPercent', label: 'DA %', type: 'number', required: true, placeholder: '50', width: 'sm' },
            { name: 'monthlyDA', label: 'Monthly DA (₹)', type: 'display', required: false, isCalculated: true, width: 'md' },
            { name: 'annualDA', label: 'Annual DA (₹)', type: 'display', required: false, isCalculated: true, width: 'md' },
            { name: 'remarks', label: 'Remarks', type: 'textarea', required: false, width: 'xl' },
        ],
        calculateTotal: (item) => {
            const count = Number(item.employeeCount) || 0;
            const basic = Number(item.avgBasicPay) || 0;
            const daPercent = Number(item.daPercent) || 50;
            return count * basic * (daPercent / 100) * 12;
        }
    },

    // ========== TRANSPORT ALLOWANCE (11 - 004) ==========
    {
        key: 'transport_allowance',
        label: 'Transport Allowance',
        description: 'TA for employees',
        objectHeads: ['11'],
        detailHead: '004',
        fields: [
            { name: 'payLevel', label: 'Pay Level', type: 'dropdown', required: true, options: ['L1', 'L2', 'L3', 'L4', 'L5', 'L6', 'L7', 'L8', 'L9', 'L10', 'L11', 'L12', 'L13', 'L14'], width: 'sm' },
            { name: 'eligibleCount', label: 'Eligible Employee Count', type: 'number', required: true, width: 'md' },
            { name: 'monthlyTARate', label: 'Monthly TA Rate (₹)', type: 'number', required: true, width: 'md' },
            { name: 'newRecruits', label: 'New Recruits (Expected)', type: 'number', required: false, placeholder: '0', width: 'sm' },
            { name: 'monthlyTA', label: 'Monthly TA Requirement (₹)', type: 'display', required: false, isCalculated: true, width: 'md' },
            { name: 'annualTA', label: 'Annual TA Requirement (₹)', type: 'display', required: false, isCalculated: true, width: 'md' },
            { name: 'remarks', label: 'Remarks', type: 'textarea', required: false, width: 'xl' },
        ],
        calculateTotal: (item) => {
            const count = Number(item.eligibleCount) || 0;
            const newRecruits = Number(item.newRecruits) || 0;
            const rate = Number(item.monthlyTARate) || 0;
            return (count + newRecruits) * rate * 12;
        }
    },

    // ========== HRA (11, 16, 19 - 006) ==========
    {
        key: 'hra',
        label: 'House Rent Allowance',
        description: 'HRA Calculation',
        objectHeads: ['11', '16', '19'],
        detailHead: '006',
        fields: [
            { name: 'gradePay', label: 'Grade Pay Code', type: 'dropdown', required: true, options: ['GP1800', 'GP2400', 'GP2800', 'GP4200', 'GP4600', 'GP5400', 'GP6600', 'GP7600'], width: 'md' },
            { name: 'employeeCount', label: 'Employee Count', type: 'number', required: true, width: 'sm' },
            { name: 'avgBasicPay', label: 'Avg Basic Pay (₹)', type: 'number', required: true, width: 'md' },
            { name: 'hraPercent', label: 'HRA %', type: 'number', required: true, placeholder: '27', width: 'sm' },
            { name: 'monthlyHRA', label: 'Monthly HRA (₹)', type: 'display', required: false, isCalculated: true, width: 'md' },
            { name: 'annualHRA', label: 'Annual HRA (₹)', type: 'display', required: false, isCalculated: true, width: 'md' },
            { name: 'remarks', label: 'Remarks', type: 'textarea', required: false, width: 'xl' },
        ],
        calculateTotal: (item) => {
            const count = Number(item.employeeCount) || 0;
            const basic = Number(item.avgBasicPay) || 0;
            const hraPercent = Number(item.hraPercent) || 27;
            return count * basic * (hraPercent / 100) * 12;
        }
    },

    // ========== CCA (11 - 007) ==========
    {
        key: 'cca',
        label: 'City Compensatory Allowance',
        description: 'CCA for city employees',
        objectHeads: ['11'],
        detailHead: '007',
        fields: [
            { name: 'payLevel', label: 'Pay Level', type: 'dropdown', required: true, options: ['L1', 'L2', 'L3', 'L4', 'L5', 'L6', 'L7', 'L8', 'L9', 'L10', 'L11', 'L12', 'L13', 'L14'], width: 'sm' },
            { name: 'eligibleCount', label: 'CCA Eligible Employee Count', type: 'number', required: true, width: 'md' },
            { name: 'ccaRatePerMonth', label: 'CCA Rate per Month (₹)', type: 'number', required: true, width: 'md' },
            { name: 'monthlyCCA', label: 'Monthly CCA Amount (₹)', type: 'display', required: false, isCalculated: true, width: 'md' },
            { name: 'annualCCA', label: 'Annual CCA Amount (₹)', type: 'display', required: false, isCalculated: true, width: 'md' },
            { name: 'remarks', label: 'Remarks', type: 'textarea', required: false, width: 'xl' },
        ],
        calculateTotal: (item) => {
            const count = Number(item.eligibleCount) || 0;
            const rate = Number(item.ccaRatePerMonth) || 0;
            return count * rate * 12;
        }
    },

    // ========== OTHER ALLOWANCES (11, 16, 19 - 008) ==========
    {
        key: 'other_allowances',
        label: 'Other Allowances',
        description: 'CCA, Risk Allowance, etc.',
        objectHeads: ['11', '16', '19'],
        detailHead: '008',
        fields: [
            { name: 'allowanceType', label: 'Allowance Type', type: 'dropdown', required: true, options: ['CCA', 'Risk Allowance', 'Washing Allowance', 'Uniform Allowance', 'Night Duty Allowance', 'Other'], width: 'md' },
            { name: 'eligibleCount', label: 'Eligible Employee Count', type: 'number', required: true, width: 'md' },
            { name: 'monthlyRate', label: 'Monthly Allowance Rate (₹)', type: 'number', required: true, width: 'md' },
            { name: 'annualAllowance', label: 'Annual Allowance (₹)', type: 'display', required: false, isCalculated: true, width: 'md' },
            { name: 'remarks', label: 'Remarks', type: 'textarea', required: false, width: 'xl' },
        ],
        calculateTotal: (item) => {
            const count = Number(item.eligibleCount) || 0;
            const rate = Number(item.monthlyRate) || 0;
            return count * rate * 12;
        }
    },

    // ========== MEDICAL REIMBURSEMENT (11, 16, 19 - 009) ==========
    {
        key: 'medical_reimbursement',
        label: 'Medical Reimbursement',
        description: 'Medical claims',
        objectHeads: ['11', '16', '19'],
        detailHead: '009',
        fields: [
            { name: 'eligibleCount', label: 'Eligible Employee Count', type: 'number', required: true, width: 'md' },
            { name: 'avgAnnualClaim', label: 'Average Annual Claim (₹)', type: 'number', required: true, width: 'md' },
            { name: 'expectedIncreasePercent', label: 'Expected Increase %', type: 'number', required: false, placeholder: '5', width: 'sm' },
            { name: 'totalEstimated', label: 'Total Estimated Requirement (₹)', type: 'display', required: false, isCalculated: true, width: 'lg' },
            { name: 'remarks', label: 'Remarks', type: 'textarea', required: false, width: 'xl' },
        ],
        calculateTotal: (item) => {
            const count = Number(item.eligibleCount) || 0;
            const avgClaim = Number(item.avgAnnualClaim) || 0;
            const increase = Number(item.expectedIncreasePercent) || 0;
            return count * avgClaim * (1 + increase / 100);
        }
    },

    // ========== LTC (16 - 010) ==========
    {
        key: 'ltc',
        label: 'Leave Travel Facility',
        description: 'LTC for IAS officers',
        objectHeads: ['16'],
        detailHead: '010',
        fields: [
            { name: 'eligibleCount', label: 'Eligible Employee Count', type: 'number', required: true, width: 'md' },
            { name: 'expectedToAvail', label: 'Employees Expected to Avail LTC', type: 'number', required: true, width: 'md' },
            { name: 'avgClaimAmount', label: 'Average LTC Claim Amount (₹)', type: 'number', required: true, width: 'md' },
            { name: 'inflationRate', label: 'Expected Inflation Rate (%)', type: 'number', required: false, placeholder: '5', width: 'sm' },
            { name: 'pendingClaims', label: 'Pending LTC Claims (₹)', type: 'number', required: false, placeholder: '0', width: 'md' },
            { name: 'estimatedTotal', label: 'Estimated Total LTC (₹)', type: 'display', required: false, isCalculated: true, width: 'md' },
            { name: 'grandTotal', label: 'Grand Total Requirement (₹)', type: 'display', required: false, isCalculated: true, width: 'md' },
            { name: 'remarks', label: 'Justification Note', type: 'textarea', required: false, width: 'xl' },
        ],
        calculateTotal: (item) => {
            const cases = Number(item.expectedToAvail) || 0;
            const avgClaim = Number(item.avgClaimAmount) || 0;
            const inflation = Number(item.inflationRate) || 0;
            const pending = Number(item.pendingClaims) || 0;
            return cases * avgClaim * (1 + inflation / 100) + pending;
        }
    },

    // ========== FESTIVAL ADVANCE (11, 19 - 011) ==========
    {
        key: 'festival_advance',
        label: 'Festival Advance',
        description: 'Festival advance payment',
        objectHeads: ['11', '19'],
        detailHead: '011',
        fields: [
            { name: 'eligibleCount', label: 'Eligible Employee Count', type: 'number', required: true, width: 'md' },
            { name: 'advancePerEmployee', label: 'Advance Amount per Employee (₹)', type: 'number', required: true, placeholder: '10000', width: 'md' },
            { name: 'totalRequirement', label: 'Total Requirement (₹)', type: 'display', required: false, isCalculated: true, width: 'md' },
            { name: 'remarks', label: 'Remarks', type: 'textarea', required: false, width: 'xl' },
        ],
        calculateTotal: (item) => {
            const count = Number(item.eligibleCount) || 0;
            const amount = Number(item.advancePerEmployee) || 0;
            return count * amount;
        }
    },

    // ========== GRAIN ADVANCE (11, 19 - 016) ==========
    {
        key: 'grain_advance',
        label: 'Grain Advance',
        description: 'Grain advance for employees',
        objectHeads: ['11', '19'],
        detailHead: '016',
        fields: [
            { name: 'eligibleCount', label: 'Eligible Employee Count', type: 'number', required: true, width: 'md' },
            { name: 'advancePerEmployee', label: 'Advance Amount per Employee (₹)', type: 'number', required: true, width: 'md' },
            { name: 'totalRequirement', label: 'Total Requirement (₹)', type: 'display', required: false, isCalculated: true, width: 'md' },
            { name: 'remarks', label: 'Remarks', type: 'textarea', required: false, width: 'xl' },
        ],
        calculateTotal: (item) => {
            const count = Number(item.eligibleCount) || 0;
            const amount = Number(item.advancePerEmployee) || 0;
            return count * amount;
        }
    },

    // ========== MEDICAL ADVANCE (11, 16, 19 - 018) ==========
    {
        key: 'medical_advance',
        label: 'Medical Advance',
        description: 'Medical advance for IAS',
        objectHeads: ['11', '16', '19'],
        detailHead: '018',
        fields: [
            { name: 'expectedCases', label: 'Expected No. of Medical Cases', type: 'number', required: true, width: 'md' },
            { name: 'avgAdvanceAmount', label: 'Average Medical Advance Amount (₹)', type: 'number', required: true, width: 'md' },
            { name: 'totalEstimated', label: 'Total Estimated Requirement (₹)', type: 'display', required: false, isCalculated: true, width: 'md' },
            { name: 'remarks', label: 'Remarks', type: 'textarea', required: false, width: 'xl' },
        ],
        calculateTotal: (item) => {
            const cases = Number(item.expectedCases) || 0;
            const avgAmount = Number(item.avgAdvanceAmount) || 0;
            return cases * avgAmount;
        }
    },

    // ========== SPECIAL PAY (11 - 021) ==========
    {
        key: 'special_pay',
        label: 'Special Pay',
        description: 'Special pay allowance',
        objectHeads: ['11'],
        detailHead: '021',
        fields: [
            { name: 'employeeCount', label: 'No. of Employees Receiving Special Pay', type: 'number', required: true, width: 'md' },
            { name: 'specialPayRate', label: 'Special Pay Rate (₹/month)', type: 'number', required: true, width: 'md' },
            { name: 'annualRequirement', label: 'Annual Requirement (₹)', type: 'display', required: false, isCalculated: true, width: 'md' },
            { name: 'remarks', label: 'Remarks', type: 'textarea', required: false, width: 'xl' },
        ],
        calculateTotal: (item) => {
            const count = Number(item.employeeCount) || 0;
            const rate = Number(item.specialPayRate) || 0;
            return count * rate * 12;
        }
    },

    // ========== CONTRACTUAL PAYMENT (11 - 025) ==========
    {
        key: 'contractual_payment',
        label: 'Contractual Employee Payment',
        description: 'Contract staff payment',
        objectHeads: ['11'],
        detailHead: '025',
        fields: [
            { name: 'contractEmployees', label: 'Number of Contract Employees', type: 'number', required: true, width: 'md' },
            { name: 'monthlyHonorarium', label: 'Monthly Honorarium (₹)', type: 'number', required: true, width: 'md' },
            { name: 'totalMonthly', label: 'Total Monthly Payment (₹)', type: 'display', required: false, isCalculated: true, width: 'md' },
            { name: 'annualPayment', label: 'Annual Payment (₹)', type: 'display', required: false, isCalculated: true, width: 'md' },
            { name: 'remarks', label: 'Remarks', type: 'textarea', required: false, width: 'xl' },
        ],
        calculateTotal: (item) => {
            const count = Number(item.contractEmployees) || 0;
            const honorarium = Number(item.monthlyHonorarium) || 0;
            return count * honorarium * 12;
        }
    },

    // ========== WAGES (12 - 000) ==========
    {
        key: 'wages',
        label: 'Wages',
        description: 'Daily Wagers / Mali / Helper',
        objectHeads: ['12'],
        detailHead: '000',
        fields: [
            { name: 'wagerCount', label: 'No. of Daily Wagers / Mali / Helper', type: 'number', required: true, width: 'md' },
            { name: 'monthlyWageRate', label: 'Monthly Wage Rate (₹)', type: 'number', required: true, width: 'md' },
            { name: 'additionalMonths', label: 'Expected Additional Work Months', type: 'number', required: false, placeholder: '0', width: 'sm' },
            { name: 'annualWage', label: 'Annual Wage Calculation (₹)', type: 'display', required: false, isCalculated: true, width: 'md' },
            { name: 'remarks', label: 'Remarks', type: 'textarea', required: false, width: 'xl' },
        ],
        calculateTotal: (item) => {
            const count = Number(item.wagerCount) || 0;
            const rate = Number(item.monthlyWageRate) || 0;
            const additional = Number(item.additionalMonths) || 0;
            return count * rate * (12 + additional);
        }
    },

    // ========== TELEPHONE (22 - 002) ==========
    {
        key: 'telephone',
        label: 'Telephone',
        description: 'Telephone connections',
        objectHeads: ['22'],
        detailHead: '002',
        fields: [
            { name: 'connectionType', label: 'Type of Connection', type: 'dropdown', required: true, options: ['Mobile', 'Landline', 'Broadband'], width: 'md' },
            { name: 'description', label: 'Description', type: 'text', required: false, width: 'lg' },
            { name: 'oldQty', label: 'Old Available Quantity', type: 'number', required: true, width: 'sm' },
            { name: 'employeesUsing', label: 'No. of Employees Using', type: 'number', required: false, width: 'sm' },
            { name: 'newQty', label: 'New Required Quantity', type: 'number', required: true, width: 'sm' },
            { name: 'monthlyCharge', label: 'Monthly Charge (₹)', type: 'number', required: true, width: 'md' },
            { name: 'yearlyTotal', label: 'Yearly Total (₹)', type: 'display', required: false, isCalculated: true, width: 'md' },
            { name: 'remarks', label: 'Reason for New Purchase', type: 'textarea', required: true, width: 'xl' },
        ],
        calculateTotal: (item) => {
            const oldQty = Number(item.oldQty) || 0;
            const newQty = Number(item.newQty) || 0;
            const monthlyCharge = Number(item.monthlyCharge) || 0;
            return (oldQty + newQty) * monthlyCharge * 12;
        }
    },

    // ========== FURNITURE (22 - 003) ==========
    {
        key: 'furniture',
        label: 'Furniture Purchase',
        description: 'Office furniture',
        objectHeads: ['22'],
        detailHead: '003',
        fields: [
            { name: 'itemName', label: 'Name of Furniture Item', type: 'text', required: true, placeholder: 'Table/Chair/Almirah', width: 'md' },
            { name: 'description', label: 'Description', type: 'text', required: false, width: 'lg' },
            { name: 'oldQty', label: 'Old Available Quantity', type: 'number', required: true, width: 'sm' },
            { name: 'employeesUsing', label: 'No. of Employees Using', type: 'number', required: false, width: 'sm' },
            { name: 'newQty', label: 'New Required Quantity', type: 'number', required: true, width: 'sm' },
            { name: 'unitCost', label: 'Per Unit Cost (₹)', type: 'number', required: true, width: 'md' },
            { name: 'totalCost', label: 'Total Cost (₹)', type: 'display', required: false, isCalculated: true, width: 'md' },
            { name: 'remarks', label: 'Reason for New Purchase', type: 'textarea', required: true, width: 'xl' },
        ],
        calculateTotal: (item) => {
            const newQty = Number(item.newQty) || 0;
            const unitCost = Number(item.unitCost) || 0;
            return newQty * unitCost;
        }
    },

    // ========== ELECTRICITY (22 - 005) ==========
    {
        key: 'electricity',
        label: 'Electricity',
        description: 'Electricity charges',
        objectHeads: ['22'],
        detailHead: '005',
        fields: [
            { name: 'meterPurpose', label: 'Description / Meter Purpose', type: 'text', required: true, placeholder: 'Main Office Electricity', width: 'lg' },
            { name: 'actualExpenditure', label: 'Actual Yearly Expenditure (₹)', type: 'number', required: true, width: 'md' },
            { name: 'systemExpected', label: 'System Expected (10% escalation) (₹)', type: 'display', required: false, isCalculated: true, width: 'md' },
            { name: 'ddoEstimated', label: 'DDO Estimated Expenditure (₹)', type: 'number', required: true, width: 'md' },
            { name: 'remarks', label: 'Reason for Higher Estimate', type: 'textarea', required: false, width: 'xl' },
        ],
        calculateTotal: (item) => {
            return Number(item.ddoEstimated) || Number(item.actualExpenditure) * 1.1 || 0;
        }
    },

    // ========== PETROL, OIL (22 - 009) ==========
    {
        key: 'petrol_oil',
        label: 'Petrol, Oil etc',
        description: 'Vehicle fuel expenses',
        objectHeads: ['22'],
        detailHead: '009',
        fields: [
            { name: 'vehicleType', label: 'Type of Vehicle', type: 'dropdown', required: true, options: ['Car', 'Jeep', 'Two Wheeler', 'Bus', 'Other'], width: 'md' },
            { name: 'description', label: 'Description', type: 'text', required: false, width: 'lg' },
            { name: 'oldQty', label: 'Old Available Quantity', type: 'number', required: true, width: 'sm' },
            { name: 'employeesUsing', label: 'No. of Employees Using', type: 'number', required: false, width: 'sm' },
            { name: 'newQty', label: 'New Required Quantity', type: 'number', required: true, width: 'sm' },
            { name: 'monthlyFuelCost', label: 'Monthly Fuel Cost (₹)', type: 'number', required: true, width: 'md' },
            { name: 'yearlyTotal', label: 'Yearly Total (₹)', type: 'display', required: false, isCalculated: true, width: 'md' },
            { name: 'remarks', label: 'Reason for Additional Requirement', type: 'textarea', required: true, width: 'xl' },
        ],
        calculateTotal: (item) => {
            const oldQty = Number(item.oldQty) || 0;
            const newQty = Number(item.newQty) || 0;
            const monthlyCost = Number(item.monthlyFuelCost) || 0;
            return (oldQty + newQty) * monthlyCost * 12;
        }
    },

    // ========== OFFICE EQUIPMENT (23 - 001) ==========
    {
        key: 'office_equipment',
        label: 'Office Equipment Purchase',
        description: 'Printer, Scanner, UPS, etc.',
        objectHeads: ['23'],
        detailHead: '001',
        fields: [
            { name: 'equipmentName', label: 'Name of Office Equipment', type: 'text', required: true, placeholder: 'Printer/Scanner/UPS', width: 'md' },
            { name: 'description', label: 'Description', type: 'text', required: false, width: 'lg' },
            { name: 'oldQty', label: 'Old Available Quantity', type: 'number', required: true, width: 'sm' },
            { name: 'employeesUsing', label: 'No. of Employees Using', type: 'number', required: false, width: 'sm' },
            { name: 'newQty', label: 'New Required Quantity', type: 'number', required: true, width: 'sm' },
            { name: 'unitCost', label: 'Per Unit Cost (₹)', type: 'number', required: true, width: 'md' },
            { name: 'totalCost', label: 'Total Cost (₹)', type: 'display', required: false, isCalculated: true, width: 'md' },
            { name: 'remarks', label: 'Reason for New Purchase', type: 'textarea', required: true, width: 'xl' },
        ],
        calculateTotal: (item) => {
            const newQty = Number(item.newQty) || 0;
            const unitCost = Number(item.unitCost) || 0;
            return newQty * unitCost;
        }
    },

    // ========== IT ASSETS (27 - 001) ==========
    {
        key: 'it_assets',
        label: 'IT & Computer Purchase',
        description: 'IT Assets Capital',
        objectHeads: ['27'],
        detailHead: '001',
        fields: [
            { name: 'assetType', label: 'IT Asset Type', type: 'dropdown', required: true, options: ['Desktop', 'Laptop', 'Printer', 'Scanner', 'Server', 'Projector', 'Other'], width: 'md' },
            { name: 'description', label: 'Description', type: 'text', required: false, width: 'lg' },
            { name: 'oldQty', label: 'Old Available Quantity', type: 'number', required: true, width: 'sm' },
            { name: 'employeesUsing', label: 'No. of Employees Using', type: 'number', required: false, width: 'sm' },
            { name: 'newQty', label: 'New Required Quantity', type: 'number', required: true, width: 'sm' },
            { name: 'unitCost', label: 'Per Unit Cost (₹)', type: 'number', required: true, width: 'md' },
            { name: 'totalCost', label: 'Total Cost (₹)', type: 'display', required: false, isCalculated: true, width: 'md' },
            { name: 'remarks', label: 'Reason for New Purchase', type: 'textarea', required: true, width: 'xl' },
        ],
        calculateTotal: (item) => {
            const newQty = Number(item.newQty) || 0;
            const unitCost = Number(item.unitCost) || 0;
            return newQty * unitCost;
        }
    },

    // ========== OUTSOURCED STAFF (31 - 004) ==========
    {
        key: 'outsourced_staff',
        label: 'Outsourced Staff Payment',
        description: 'Contract staff payment',
        objectHeads: ['31'],
        detailHead: '004',
        fields: [
            { name: 'staffType', label: 'Type of Outsourced Staff', type: 'dropdown', required: true, options: ['Peon', 'DEO', 'Security', 'Sweeper', 'Driver', 'Other'], width: 'md' },
            { name: 'providerName', label: 'Service Provider Name', type: 'text', required: false, width: 'lg' },
            { name: 'staffCount', label: 'Number of Outsourced Staff', type: 'number', required: true, width: 'sm' },
            { name: 'monthlyRate', label: 'Monthly Rate per Staff (₹)', type: 'number', required: true, width: 'md' },
            { name: 'monthlyCost', label: 'Monthly Outsourced Cost (₹)', type: 'display', required: false, isCalculated: true, width: 'md' },
            { name: 'duration', label: 'Contract Duration (Months)', type: 'number', required: true, placeholder: '12', width: 'sm' },
            { name: 'annualCost', label: 'Annual Outsourced Cost (₹)', type: 'display', required: false, isCalculated: true, width: 'md' },
            { name: 'escalationPercent', label: 'Escalation %', type: 'number', required: false, placeholder: '0', width: 'sm' },
            { name: 'revisedAnnualCost', label: 'Revised Annual Cost (₹)', type: 'display', required: false, isCalculated: true, width: 'md' },
            { name: 'remarks', label: 'Reason / Justification', type: 'textarea', required: true, width: 'xl' },
        ],
        calculateTotal: (item) => {
            const count = Number(item.staffCount) || 0;
            const rate = Number(item.monthlyRate) || 0;
            const duration = Number(item.duration) || 12;
            const escalation = Number(item.escalationPercent) || 0;
            const base = count * rate * duration;
            return base * (1 + escalation / 100);
        }
    },

    // ========== TRANSPORTATION SERVICE (31 - 007) ==========
    {
        key: 'transportation_service',
        label: 'Transportation Service',
        description: 'Rental vehicles',
        objectHeads: ['31'],
        detailHead: '007',
        fields: [
            { name: 'vehicleType', label: 'Type of Vehicle', type: 'dropdown', required: true, options: ['Sedan', 'SUV', 'Hatchback', 'Bus', 'Other'], width: 'md' },
            { name: 'description', label: 'Description', type: 'text', required: false, placeholder: 'Purpose of vehicle', width: 'lg' },
            { name: 'oldQty', label: 'Old Available Quantity', type: 'number', required: true, width: 'sm' },
            { name: 'employeesUsing', label: 'No. of Employees Using', type: 'number', required: false, width: 'sm' },
            { name: 'newQty', label: 'New Required Quantity', type: 'number', required: true, width: 'sm' },
            { name: 'monthlyRental', label: 'Monthly Rental Charge (₹)', type: 'number', required: true, width: 'md' },
            { name: 'yearlyTotal', label: 'Yearly Total (₹)', type: 'display', required: false, isCalculated: true, width: 'md' },
            { name: 'remarks', label: 'Reason for New Requirement', type: 'textarea', required: true, width: 'xl' },
        ],
        calculateTotal: (item) => {
            const oldQty = Number(item.oldQty) || 0;
            const newQty = Number(item.newQty) || 0;
            const monthlyRental = Number(item.monthlyRental) || 0;
            return (oldQty + newQty) * monthlyRental * 12;
        }
    },
];

/**
 * Get breakup configuration for a specific object/detail head combination
 */
export function getBreakupTypeConfig(objectHead: string, detailHead: string): BreakupTypeConfig | null {
    return BREAKUP_TYPE_CONFIGS.find(config =>
        config.objectHeads.includes(objectHead) && config.detailHead === detailHead
    ) || null;
}

/**
 * Check if a budget line requires breakup
 */
export function requiresBreakup(objectHead: string, detailHead: string): boolean {
    return getBreakupTypeConfig(objectHead, detailHead) !== null;
}

/**
 * Get all supported breakup type keys
 */
export function getAllBreakupKeys(): string[] {
    return BREAKUP_TYPE_CONFIGS.map(config => config.key);
}
