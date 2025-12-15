// Mock data types for Budget Estimation POC

export interface BudgetLineItem {
    id: string;
    srNo?: string;              // Serial number from JSON
    demandNo: string;
    majorHead: string;
    subMajorHead: string;
    minorHead: string;
    segmentHead: string;
    scheme: string;
    schemeNomenclature?: string;    // Scheme nomenclature/description
    project?: string;
    chargedOrVoted: 'Charged' | 'Voted';
    objectHead: string;
    detailHead: string;
    ddoCode: string;
    ddoName: string;
    ceilingLimit: number;
    budgetHead?: string;               // Full budget head code
    budgetEstimate?: number;           // Budget Estimate
    budgetAllotment?: number;          // Budget Allotment
    budgetReappropriation?: number;    // Budget Re-appropriation
    budgetSurrender?: number;          // Budget Surrender
    budgetDistribution?: number;       // Budget Distribution
    remainingBudget?: number;          // Remaining Budget
    expenditure?: number;              // Expenditure
    hoaExpenditureLimit?: number;      // HOA Expenditure Limit
    exempted?: boolean;                // Exempted (Y/N)
    balanceBudgetBCO?: number;         // Balance Budget with BCO
    balanceBudgetDDO?: number;         // Balance Budget with DDO
}



export interface HistoricalData {
    budgetLineItemId: string;
    fy5: number;
    fy4: number;
    fy3: number;
    fy2: number;
    fy1: number;
    currentYearBE: number;
    actualTillDate: number;
    projectedBalance: number;
}

export interface EstimationRecord {
    id: string;
    budgetLineItemId: string;
    reviseEstimateCY: number;
    budgetEstimateNextYear: number;
    forwardEstimateY2?: number;
    forwardEstimateY3?: number;
    percentageDeviation: number;

    // Outcome-Based Budgeting (NEW in Next Gen)
    outcomeCategory?: string;
    sdgGoal?: string; // SDG 1-17
    sdgTarget?: string;
    genderTag?: 'Women' | 'Child' | 'Youth' | 'General';
    scstTag?: boolean;
    geographyTag?: string; // State/District/Block

    // Workflow
    status: 'draft' | 'submitted' | 'under_verification' | 'verified' | 'under_approval' | 'approved' | 'rejected' | 'returned';
    currentLevel: 'ddo_creator' | 'ddo_verifier' | 'ddo_approver' | 'bco_creator' | 'bco_verifier' | 'bco_approver';

    // Remarks
    creatorRemarks?: string;
    verifierRemarks?: string;
    approverRemarks?: string;

    // Audit trail
    createdBy: string;
    createdAt: string;
    modifiedBy?: string;
    modifiedAt?: string;
    submittedAt?: string;
    verifiedAt?: string;
    approvedAt?: string;

    // Asset details (if applicable)
    assets?: AssetRequirement[];

    // Exceed ceiling
    exceedsCeiling: boolean;
    exceedJustification?: string;
    exceedAttachment?: string;
}

// Asset Category Types (Detail Head Codes requiring breakup)
export type AssetCategory =
    | 'telephone'      // 22/002 - Telephone Connections
    | 'furniture'      // 22/003 - Furniture Items
    | 'vehicleFuel'    // 22/009 - Departmental Vehicle Fuel
    | 'officeEquipment'// 23/001 - Office Equipment
    | 'itAsset'        // 27/001 - IT Assets
    | 'carRental';     // 31/007 - Car Rental

export const ASSET_CATEGORY_CONFIG: Record<AssetCategory, { code: string; label: string; description: string }> = {
    telephone: { code: '22/002', label: 'Telephone Connections', description: 'Mobile, Landline, Broadband connections' },
    furniture: { code: '22/003', label: 'Furniture Items', description: 'Tables, Chairs, Almirahs, etc.' },
    vehicleFuel: { code: '22/009', label: 'Departmental Vehicle Fuel', description: 'Fuel expenses for department vehicles' },
    officeEquipment: { code: '23/001', label: 'Office Equipment', description: 'Printers, Scanners, UPS, etc.' },
    itAsset: { code: '27/001', label: 'IT Assets', description: 'Desktops, Laptops, Servers, etc.' },
    carRental: { code: '31/007', label: 'Car Rental', description: 'Rental vehicles for official use' },
};

// Base asset interface with common fields
interface BaseAsset {
    id: string;
    category: AssetCategory;
    description?: string;
    oldQuantity: number;
    employeesUsing: number;
    newRequired: number;
    reason: string;
    remarks?: string;
}

// 22/002 - Telephone Connections
export interface TelephoneAsset extends BaseAsset {
    category: 'telephone';
    connectionType: 'Mobile' | 'Landline' | 'Broadband';
    monthlyCharge: number;
    yearlyTotal: number; // Auto: (oldQty + newQty) × monthlyCharge × 12
}

// 22/003 - Furniture Items
export interface FurnitureAsset extends BaseAsset {
    category: 'furniture';
    itemName: string; // Table, Chair, Almirah, etc.
    perUnitCost: number;
    totalCost: number; // Auto: newRequired × perUnitCost
}

// 22/009 - Departmental Vehicle Fuel
export interface VehicleFuelAsset extends BaseAsset {
    category: 'vehicleFuel';
    vehicleType: 'Car' | 'Jeep' | 'Two Wheeler';
    monthlyFuelCost: number;
    yearlyTotal: number; // Auto: monthlyFuelCost × 12 × (oldQty + newQty)
}

// 23/001 - Office Equipment
export interface OfficeEquipmentAsset extends BaseAsset {
    category: 'officeEquipment';
    equipmentName: string; // Printer, Scanner, UPS, etc.
    perUnitCost: number;
    totalCost: number; // Auto: newRequired × perUnitCost
}

// 27/001 - IT Assets
export interface ITAssetItem extends BaseAsset {
    category: 'itAsset';
    assetType: 'Desktop' | 'Laptop' | 'Printer' | 'Scanner' | 'Server';
    perUnitCost: number;
    totalCost: number; // Auto: newRequired × perUnitCost
}

// 31/007 - Car Rental
export interface CarRentalAsset extends BaseAsset {
    category: 'carRental';
    vehicleType: 'Sedan' | 'SUV' | 'Hatchback';
    monthlyRentalCharge: number;
    yearlyTotal: number; // Auto: (oldQty + newQty) × monthlyRentalCharge × 12
}

// Union type for all asset types
export type TypedAsset =
    | TelephoneAsset
    | FurnitureAsset
    | VehicleFuelAsset
    | OfficeEquipmentAsset
    | ITAssetItem
    | CarRentalAsset;

// Legacy interface for backward compatibility
export interface AssetRequirement {
    id: string;
    itemName: string;
    oldQuantity: number;
    employeesUsing: number;
    newRequired: number;
    unitCost: number;
    totalCost: number;
    reason: string;
    remarks?: string;
}

export interface User {
    id: string;
    name: string;
    designation: string;
    role: 'ddo_creator' | 'ddo_verifier' | 'ddo_approver' | 'bco_creator' | 'bco_verifier' | 'bco_approver';
    department: string;
    ddoCode?: string;
}

export interface WorkflowAction {
    id: string;
    estimationId: string;
    action: 'created' | 'submitted' | 'returned' | 'verified' | 'approved' | 'rejected';
    performedBy: string;
    performedAt: string;
    remarks?: string;
    fromStatus: string;
    toStatus: string;
}

// Audit Trail Entry - tracks field-level changes
export interface AuditTrailEntry {
    id: string;
    budgetLineItemId: string;
    timestamp: string;
    action: 'created' | 'modified' | 'submitted' | 'verified' | 'approved' | 'returned' | 'rejected';
    performedBy: {
        userId: string;
        name: string;
        role: 'ddo_creator' | 'ddo_verifier' | 'ddo_approver' | 'bco_creator' | 'bco_verifier' | 'bco_approver';
        designation: string;
    };
    level: 'DDO' | 'BCO' | 'Admin' | 'Finance';
    changes?: {
        field: string;
        fieldLabel: string;
        oldValue: string | number | null;
        newValue: string | number | null;
    }[];
    remarks?: string;
}
