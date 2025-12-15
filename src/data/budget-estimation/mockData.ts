import { BudgetLineItem, HistoricalData, EstimationRecord, User, AssetRequirement } from './types';

// Helper function to parse budget head code
function parseBudgetHead(budgetHead: string): {
    demand: string;
    major: string;
    subMajor: string;
    minor: string;
    segment: string;
    ddo: string;
    chargedOrVoted: 'Charged' | 'Voted';
    object: string;
    detail: string;
} {
    const parts = budgetHead.split('-');
    return {
        demand: parts[0],
        major: parts[1],
        subMajor: parts[2],
        minor: parts[3],
        segment: parts[4],
        ddo: parts[5],
        chargedOrVoted: parts[6] === 'C' ? 'Charged' : 'Voted',
        object: parts[7],
        detail: parts[8]
    };
}

// Complete Budget data from JSON file with ALL fields
const BUDGET_DATA = [
    { srNo: "85", budgetHead: "006-2054-00-095-9999-2304-C-53-000", scheme: "(2304) Direction and administration", schemeNomenclature: "Token Provision", budgetEstimate: 500000.0, budgetAllotment: 500000.0, budgetReappropriation: 0.0, budgetSurrender: 0.0, budgetDistribution: 0.0, remainingBudget: 500000.0, expenditure: 0.0, hoaLimit: 500000.0, exempted: "Y", balanceBCO: 500000.0, balanceDDO: 0.0 },
    { srNo: "86", budgetHead: "006-2054-00-095-9999-2304-V-11-001", scheme: "(2304) Direction and administration", schemeNomenclature: "Basic Pay", budgetEstimate: 249000000.0, budgetAllotment: 249000000.0, budgetReappropriation: 0.0, budgetSurrender: 0.0, budgetDistribution: 81086856.0, remainingBudget: 167913144.0, expenditure: 81086856.0, hoaLimit: 249000000.0, exempted: "Y", balanceBCO: 167913144.0, balanceDDO: 0.0 },
    { srNo: "87", budgetHead: "006-2054-00-095-9999-2304-V-11-003", scheme: "(2304) Direction and administration", schemeNomenclature: "Dearness Allowance", budgetEstimate: 159360000.0, budgetAllotment: 159360000.0, budgetReappropriation: 0.0, budgetSurrender: 0.0, budgetDistribution: 45749830.0, remainingBudget: 113610170.0, expenditure: 45749830.0, hoaLimit: 159360000.0, exempted: "Y", balanceBCO: 113610170.0, balanceDDO: 0.0 },
    { srNo: "88", budgetHead: "006-2054-00-095-9999-2304-V-11-004", scheme: "(2304) Direction and administration", schemeNomenclature: "Transport Allowance", budgetEstimate: 2784000.0, budgetAllotment: 2784000.0, budgetReappropriation: 0.0, budgetSurrender: 0.0, budgetDistribution: 346689.0, remainingBudget: 2437311.0, expenditure: 346689.0, hoaLimit: 2784000.0, exempted: "Y", balanceBCO: 2437311.0, balanceDDO: 0.0 },
    { srNo: "89", budgetHead: "006-2054-00-095-9999-2304-V-11-006", scheme: "(2304) Direction and administration", schemeNomenclature: "HRA", budgetEstimate: 22673000.0, budgetAllotment: 22673000.0, budgetReappropriation: 0.0, budgetSurrender: 0.0, budgetDistribution: 5041969.0, remainingBudget: 17631031.0, expenditure: 5041969.0, hoaLimit: 22673000.0, exempted: "Y", balanceBCO: 17631031.0, balanceDDO: 0.0 },
    { srNo: "90", budgetHead: "006-2054-00-095-9999-2304-V-11-007", scheme: "(2304) Direction and administration", budgetEstimate: 1000.0, budgetAllotment: 1000.0, budgetReappropriation: 0.0, budgetSurrender: 0.0, budgetDistribution: 0.0, remainingBudget: 1000.0, expenditure: 0.0, hoaLimit: 1000.0, exempted: "Y", balanceBCO: 1000.0, balanceDDO: 0.0 },
    { srNo: "91", budgetHead: "006-2054-00-095-9999-2304-V-11-008", scheme: "(2304) Direction and administration", budgetEstimate: 40000.0, budgetAllotment: 40000.0, budgetReappropriation: 0.0, budgetSurrender: 0.0, budgetDistribution: 8750.0, remainingBudget: 31250.0, expenditure: 8750.0, hoaLimit: 40000.0, exempted: "Y", balanceBCO: 31250.0, balanceDDO: 0.0 },
    { srNo: "92", budgetHead: "006-2054-00-095-9999-2304-V-11-009", scheme: "(2304) Direction and administration", budgetEstimate: 3000000.0, budgetAllotment: 3000000.0, budgetReappropriation: 0.0, budgetSurrender: 0.0, budgetDistribution: 963217.0, remainingBudget: 2036783.0, expenditure: 590785.0, hoaLimit: 3000000.0, exempted: "Y", balanceBCO: 2036783.0, balanceDDO: 372432.0 },
    { srNo: "93", budgetHead: "006-2054-00-095-9999-2304-V-11-011", scheme: "(2304) Direction and administration", budgetEstimate: 50000.0, budgetAllotment: 50000.0, budgetReappropriation: 0.0, budgetSurrender: 0.0, budgetDistribution: 4000.0, remainingBudget: 46000.0, expenditure: 4000.0, hoaLimit: 50000.0, exempted: "Y", balanceBCO: 46000.0, balanceDDO: 0.0 },
    { srNo: "94", budgetHead: "006-2054-00-095-9999-2304-V-11-016", scheme: "(2304) Direction and administration", budgetEstimate: 50000.0, budgetAllotment: 50000.0, budgetReappropriation: 0.0, budgetSurrender: 0.0, budgetDistribution: 4000.0, remainingBudget: 46000.0, expenditure: 4000.0, hoaLimit: 50000.0, exempted: "Y", balanceBCO: 46000.0, balanceDDO: 0.0 },
    { srNo: "95", budgetHead: "006-2054-00-095-9999-2304-V-11-018", scheme: "(2304) Direction and administration", budgetEstimate: 300000.0, budgetAllotment: 300000.0, budgetReappropriation: 0.0, budgetSurrender: 0.0, budgetDistribution: 0.0, remainingBudget: 300000.0, expenditure: 0.0, hoaLimit: 300000.0, exempted: "Y", balanceBCO: 300000.0, balanceDDO: 0.0 },
    { srNo: "96", budgetHead: "006-2054-00-095-9999-2304-V-11-021", scheme: "(2304) Direction and administration", budgetEstimate: 1000.0, budgetAllotment: 1000.0, budgetReappropriation: 0.0, budgetSurrender: 0.0, budgetDistribution: 0.0, remainingBudget: 1000.0, expenditure: 0.0, hoaLimit: 1000.0, exempted: "Y", balanceBCO: 1000.0, balanceDDO: 0.0 },
    { srNo: "97", budgetHead: "006-2054-00-095-9999-2304-V-11-025", scheme: "(2304) Direction and administration", budgetEstimate: 1000.0, budgetAllotment: 1000.0, budgetReappropriation: 0.0, budgetSurrender: 0.0, budgetDistribution: 0.0, remainingBudget: 1000.0, expenditure: 0.0, hoaLimit: 1000.0, exempted: "Y", balanceBCO: 1000.0, balanceDDO: 0.0 },
    { srNo: "98", budgetHead: "006-2054-00-095-9999-2304-V-12-000", scheme: "(2304) Direction and administration", budgetEstimate: 110000.0, budgetAllotment: 110000.0, budgetReappropriation: 0.0, budgetSurrender: 0.0, budgetDistribution: 110000.0, remainingBudget: 0.0, expenditure: 48556.0, hoaLimit: 110000.0, exempted: "Y", balanceBCO: 0.0, balanceDDO: 61444.0 },
    { srNo: "99", budgetHead: "006-2054-00-095-9999-2304-V-12-001", scheme: "(2304) Direction and administration", budgetEstimate: 1000.0, budgetAllotment: 1000.0, budgetReappropriation: 0.0, budgetSurrender: 0.0, budgetDistribution: 0.0, remainingBudget: 1000.0, expenditure: 0.0, hoaLimit: 1000.0, exempted: "Y", balanceBCO: 1000.0, balanceDDO: 0.0 },
    { srNo: "100", budgetHead: "006-2054-00-095-9999-2304-V-12-003", scheme: "(2304) Direction and administration", budgetEstimate: 1000.0, budgetAllotment: 1000.0, budgetReappropriation: 0.0, budgetSurrender: 0.0, budgetDistribution: 0.0, remainingBudget: 1000.0, expenditure: 0.0, hoaLimit: 1000.0, exempted: "Y", balanceBCO: 1000.0, balanceDDO: 0.0 },
    { srNo: "101", budgetHead: "006-2054-00-095-9999-2304-V-12-006", scheme: "(2304) Direction and administration", budgetEstimate: 3000.0, budgetAllotment: 3000.0, budgetReappropriation: 0.0, budgetSurrender: 0.0, budgetDistribution: 0.0, remainingBudget: 3000.0, expenditure: 0.0, hoaLimit: 3000.0, exempted: "Y", balanceBCO: 3000.0, balanceDDO: 0.0 },
    { srNo: "102", budgetHead: "006-2054-00-095-9999-2304-V-12-008", scheme: "(2304) Direction and administration", budgetEstimate: 1000.0, budgetAllotment: 1000.0, budgetReappropriation: 0.0, budgetSurrender: 0.0, budgetDistribution: 0.0, remainingBudget: 1000.0, expenditure: 0.0, hoaLimit: 1000.0, exempted: "Y", balanceBCO: 1000.0, balanceDDO: 0.0 },
    { srNo: "103", budgetHead: "006-2054-00-095-9999-2304-V-14-000", scheme: "(2304) Direction and administration", budgetEstimate: 1000.0, budgetAllotment: 1000.0, budgetReappropriation: 0.0, budgetSurrender: 0.0, budgetDistribution: 0.0, remainingBudget: 1000.0, expenditure: 0.0, hoaLimit: 250.0, exempted: "N", balanceBCO: 1000.0, balanceDDO: 0.0 },
    { srNo: "104", budgetHead: "006-2054-00-095-9999-2304-V-16-001", scheme: "(2304) Direction and administration", budgetEstimate: 2355000.0, budgetAllotment: 2355000.0, budgetReappropriation: 0.0, budgetSurrender: 0.0, budgetDistribution: 1354063.0, remainingBudget: 1000937.0, expenditure: 1354063.0, hoaLimit: 2355000.0, exempted: "Y", balanceBCO: 1000937.0, balanceDDO: 0.0 },
    { srNo: "105", budgetHead: "006-2054-00-095-9999-2304-V-16-003", scheme: "(2304) Direction and administration", budgetEstimate: 1507000.0, budgetAllotment: 1507000.0, budgetReappropriation: 0.0, budgetSurrender: 0.0, budgetDistribution: 691585.0, remainingBudget: 815415.0, expenditure: 691585.0, hoaLimit: 1507000.0, exempted: "Y", balanceBCO: 815415.0, balanceDDO: 0.0 },
    { srNo: "106", budgetHead: "006-2054-00-095-9999-2304-V-16-006", scheme: "(2304) Direction and administration", budgetEstimate: 3000.0, budgetAllotment: 3000.0, budgetReappropriation: 0.0, budgetSurrender: 0.0, budgetDistribution: 0.0, remainingBudget: 3000.0, expenditure: 0.0, hoaLimit: 3000.0, exempted: "Y", balanceBCO: 3000.0, balanceDDO: 0.0 },
    { srNo: "107", budgetHead: "006-2054-00-095-9999-2304-V-16-008", scheme: "(2304) Direction and administration", budgetEstimate: 150000.0, budgetAllotment: 150000.0, budgetReappropriation: 0.0, budgetSurrender: 0.0, budgetDistribution: 0.0, remainingBudget: 150000.0, expenditure: 0.0, hoaLimit: 150000.0, exempted: "Y", balanceBCO: 150000.0, balanceDDO: 0.0 },
    { srNo: "108", budgetHead: "006-2054-00-095-9999-2304-V-16-009", scheme: "(2304) Direction and administration", budgetEstimate: 100000.0, budgetAllotment: 100000.0, budgetReappropriation: 0.0, budgetSurrender: 0.0, budgetDistribution: 100000.0, remainingBudget: 0.0, expenditure: 21073.0, hoaLimit: 100000.0, exempted: "Y", balanceBCO: 0.0, balanceDDO: 78927.0 },
    { srNo: "109", budgetHead: "006-2054-00-095-9999-2304-V-16-010", scheme: "(2304) Direction and administration", budgetEstimate: 165000.0, budgetAllotment: 165000.0, budgetReappropriation: 0.0, budgetSurrender: 0.0, budgetDistribution: 165000.0, remainingBudget: 0.0, expenditure: 0.0, hoaLimit: 165000.0, exempted: "Y", balanceBCO: 0.0, balanceDDO: 165000.0 },
    { srNo: "110", budgetHead: "006-2054-00-095-9999-2304-V-16-018", scheme: "(2304) Direction and administration", budgetEstimate: 2000.0, budgetAllotment: 2000.0, budgetReappropriation: 0.0, budgetSurrender: 0.0, budgetDistribution: 2000.0, remainingBudget: 0.0, expenditure: 0.0, hoaLimit: 2000.0, exempted: "Y", balanceBCO: 0.0, balanceDDO: 2000.0 },
    { srNo: "111", budgetHead: "006-2054-00-095-9999-2304-V-19-001", scheme: "(2304) Direction and administration", budgetEstimate: 598000.0, budgetAllotment: 598000.0, budgetReappropriation: 0.0, budgetSurrender: 0.0, budgetDistribution: 598000.0, remainingBudget: 0.0, expenditure: 352000.0, hoaLimit: 598000.0, exempted: "Y", balanceBCO: 0.0, balanceDDO: 246000.0 },
    { srNo: "112", budgetHead: "006-2054-00-095-9999-2304-V-19-003", scheme: "(2304) Direction and administration", budgetEstimate: 385000.0, budgetAllotment: 385000.0, budgetReappropriation: 0.0, budgetSurrender: 0.0, budgetDistribution: 385000.0, remainingBudget: 0.0, expenditure: 183916.0, hoaLimit: 385000.0, exempted: "Y", balanceBCO: 0.0, balanceDDO: 201084.0 },
    { srNo: "113", budgetHead: "006-2054-00-095-9999-2304-V-19-006", scheme: "(2304) Direction and administration", budgetEstimate: 69000.0, budgetAllotment: 69000.0, budgetReappropriation: 0.0, budgetSurrender: 0.0, budgetDistribution: 69000.0, remainingBudget: 0.0, expenditure: 29530.0, hoaLimit: 69000.0, exempted: "Y", balanceBCO: 0.0, balanceDDO: 39470.0 },
    { srNo: "114", budgetHead: "006-2054-00-095-9999-2304-V-19-008", scheme: "(2304) Direction and administration", budgetEstimate: 10000.0, budgetAllotment: 10000.0, budgetReappropriation: 0.0, budgetSurrender: 0.0, budgetDistribution: 10000.0, remainingBudget: 0.0, expenditure: 3538.0, hoaLimit: 10000.0, exempted: "Y", balanceBCO: 0.0, balanceDDO: 6462.0 },
    { srNo: "115", budgetHead: "006-2054-00-095-9999-2304-V-19-009", scheme: "(2304) Direction and administration", budgetEstimate: 1000.0, budgetAllotment: 1000.0, budgetReappropriation: 0.0, budgetSurrender: 0.0, budgetDistribution: 0.0, remainingBudget: 1000.0, expenditure: 0.0, hoaLimit: 1000.0, exempted: "Y", balanceBCO: 1000.0, balanceDDO: 0.0 },
    { srNo: "116", budgetHead: "006-2054-00-095-9999-2304-V-19-011", scheme: "(2304) Direction and administration", budgetEstimate: 1000.0, budgetAllotment: 1000.0, budgetReappropriation: 0.0, budgetSurrender: 0.0, budgetDistribution: 0.0, remainingBudget: 1000.0, expenditure: 0.0, hoaLimit: 1000.0, exempted: "Y", balanceBCO: 1000.0, balanceDDO: 0.0 },
    { srNo: "117", budgetHead: "006-2054-00-095-9999-2304-V-19-016", scheme: "(2304) Direction and administration", budgetEstimate: 1000.0, budgetAllotment: 1000.0, budgetReappropriation: 0.0, budgetSurrender: 0.0, budgetDistribution: 0.0, remainingBudget: 1000.0, expenditure: 0.0, hoaLimit: 1000.0, exempted: "Y", balanceBCO: 1000.0, balanceDDO: 0.0 },
    { srNo: "118", budgetHead: "006-2054-00-095-9999-2304-V-19-018", scheme: "(2304) Direction and administration", budgetEstimate: 1000.0, budgetAllotment: 1000.0, budgetReappropriation: 0.0, budgetSurrender: 0.0, budgetDistribution: 0.0, remainingBudget: 1000.0, expenditure: 0.0, hoaLimit: 1000.0, exempted: "Y", balanceBCO: 1000.0, balanceDDO: 0.0 },
    { srNo: "119", budgetHead: "006-2054-00-095-9999-2304-V-21-001", scheme: "(2304) Direction and administration", budgetEstimate: 1440000.0, budgetAllotment: 1440000.0, budgetReappropriation: 0.0, budgetSurrender: 0.0, budgetDistribution: 82724.0, remainingBudget: 1357276.0, expenditure: 82724.0, hoaLimit: 1440000.0, exempted: "Y", balanceBCO: 1357276.0, balanceDDO: 0.0 },
    { srNo: "120", budgetHead: "006-2054-00-095-9999-2304-V-21-002", scheme: "(2304) Direction and administration", budgetEstimate: 72000.0, budgetAllotment: 72000.0, budgetReappropriation: 0.0, budgetSurrender: 0.0, budgetDistribution: 8085.0, remainingBudget: 63915.0, expenditure: 8085.0, hoaLimit: 72000.0, exempted: "Y", balanceBCO: 63915.0, balanceDDO: 0.0 },
    { srNo: "121", budgetHead: "006-2054-00-095-9999-2304-V-21-003", scheme: "(2304) Direction and administration", budgetEstimate: 2000.0, budgetAllotment: 2000.0, budgetReappropriation: 0.0, budgetSurrender: 0.0, budgetDistribution: 0.0, remainingBudget: 2000.0, expenditure: 0.0, hoaLimit: 2000.0, exempted: "Y", balanceBCO: 2000.0, balanceDDO: 0.0 },
    { srNo: "122", budgetHead: "006-2054-00-095-9999-2304-V-22-001", scheme: "(2304) Direction and administration", budgetEstimate: 80000.0, budgetAllotment: 80000.0, budgetReappropriation: 0.0, budgetSurrender: 0.0, budgetDistribution: 40000.0, remainingBudget: 40000.0, expenditure: 40000.0, hoaLimit: 80000.0, exempted: "Y", balanceBCO: 40000.0, balanceDDO: 0.0 },
    { srNo: "123", budgetHead: "006-2054-00-095-9999-2304-V-22-002", scheme: "(2304) Direction and administration", budgetEstimate: 700000.0, budgetAllotment: 700000.0, budgetReappropriation: 0.0, budgetSurrender: 0.0, budgetDistribution: 452603.0, remainingBudget: 247397.0, expenditure: 452603.0, hoaLimit: 700000.0, exempted: "Y", balanceBCO: 247397.0, balanceDDO: 0.0 },
    { srNo: "124", budgetHead: "006-2054-00-095-9999-2304-V-22-003", scheme: "(2304) Direction and administration", budgetEstimate: 200000.0, budgetAllotment: 200000.0, budgetReappropriation: 0.0, budgetSurrender: 0.0, budgetDistribution: 0.0, remainingBudget: 200000.0, expenditure: 0.0, hoaLimit: 944149.0, exempted: "N", balanceBCO: 200000.0, balanceDDO: 0.0 },
    { srNo: "125", budgetHead: "006-2054-00-095-9999-2304-V-22-004", scheme: "(2304) Direction and administration", budgetEstimate: 100000.0, budgetAllotment: 100000.0, budgetReappropriation: 0.0, budgetSurrender: 0.0, budgetDistribution: 50000.0, remainingBudget: 50000.0, expenditure: 40236.0, hoaLimit: 100000.0, exempted: "Y", balanceBCO: 50000.0, balanceDDO: 9764.0 },
    { srNo: "126", budgetHead: "006-2054-00-095-9999-2304-V-22-005", scheme: "(2304) Direction and administration", budgetEstimate: 10000000.0, budgetAllotment: 10000000.0, budgetReappropriation: 0.0, budgetSurrender: 0.0, budgetDistribution: 5989057.0, remainingBudget: 4010943.0, expenditure: 5989057.0, hoaLimit: 10000000.0, exempted: "Y", balanceBCO: 4010943.0, balanceDDO: 0.0 },
    { srNo: "127", budgetHead: "006-2054-00-095-9999-2304-V-22-006", scheme: "(2304) Direction and administration", budgetEstimate: 96000.0, budgetAllotment: 96000.0, budgetReappropriation: 0.0, budgetSurrender: 0.0, budgetDistribution: 96000.0, remainingBudget: 0.0, expenditure: 0.0, hoaLimit: 944149.0, exempted: "N", balanceBCO: 0.0, balanceDDO: 96000.0 },
    { srNo: "128", budgetHead: "006-2054-00-095-9999-2304-V-22-007", scheme: "(2304) Direction and administration", budgetEstimate: 1200000.0, budgetAllotment: 1200000.0, budgetReappropriation: 0.0, budgetSurrender: 0.0, budgetDistribution: 500000.0, remainingBudget: 700000.0, expenditure: 13915.0, hoaLimit: 1200000.0, exempted: "Y", balanceBCO: 700000.0, balanceDDO: 486085.0 },
    { srNo: "129", budgetHead: "006-2054-00-095-9999-2304-V-24-000", scheme: "(2304) Direction and administration", budgetEstimate: 40000.0, budgetAllotment: 40000.0, budgetReappropriation: 0.0, budgetSurrender: 0.0, budgetDistribution: 3449.0, remainingBudget: 36551.0, expenditure: 3449.0, hoaLimit: 10000.0, exempted: "N", balanceBCO: 36551.0, balanceDDO: 0.0 },
    { srNo: "130", budgetHead: "006-2054-00-095-9999-2304-V-24-001", scheme: "(2304) Direction and administration", budgetEstimate: 1000.0, budgetAllotment: 1000.0, budgetReappropriation: 0.0, budgetSurrender: 0.0, budgetDistribution: 0.0, remainingBudget: 1000.0, expenditure: 0.0, hoaLimit: 250.0, exempted: "N", balanceBCO: 1000.0, balanceDDO: 0.0 },
    { srNo: "131", budgetHead: "006-2054-00-095-9999-2304-V-24-002", scheme: "(2304) Direction and administration", budgetEstimate: 400000.0, budgetAllotment: 400000.0, budgetReappropriation: 0.0, budgetSurrender: 0.0, budgetDistribution: 0.0, remainingBudget: 400000.0, expenditure: 0.0, hoaLimit: 100000.0, exempted: "N", balanceBCO: 400000.0, balanceDDO: 0.0 },
    { srNo: "132", budgetHead: "006-2054-00-095-9999-2304-V-24-003", scheme: "(2304) Direction and administration", budgetEstimate: 2000.0, budgetAllotment: 2000.0, budgetReappropriation: 0.0, budgetSurrender: 0.0, budgetDistribution: 0.0, remainingBudget: 2000.0, expenditure: 0.0, hoaLimit: 500.0, exempted: "N", balanceBCO: 2000.0, balanceDDO: 0.0 },
    { srNo: "133", budgetHead: "006-2054-00-095-9999-2304-V-24-004", scheme: "(2304) Direction and administration", budgetEstimate: 100000.0, budgetAllotment: 100000.0, budgetReappropriation: 0.0, budgetSurrender: 0.0, budgetDistribution: 0.0, remainingBudget: 100000.0, expenditure: 0.0, hoaLimit: 25000.0, exempted: "N", balanceBCO: 100000.0, balanceDDO: 0.0 },
    { srNo: "134", budgetHead: "006-2054-00-095-9999-2304-V-24-005", scheme: "(2304) Direction and administration", budgetEstimate: 1000.0, budgetAllotment: 1000.0, budgetReappropriation: 0.0, budgetSurrender: 0.0, budgetDistribution: 0.0, remainingBudget: 1000.0, expenditure: 0.0, hoaLimit: 250.0, exempted: "N", balanceBCO: 1000.0, balanceDDO: 0.0 },
    { srNo: "135", budgetHead: "006-2054-00-095-9999-2304-V-24-006", scheme: "(2304) Direction and administration", budgetEstimate: 1000.0, budgetAllotment: 1000.0, budgetReappropriation: 0.0, budgetSurrender: 0.0, budgetDistribution: 0.0, remainingBudget: 1000.0, expenditure: 0.0, hoaLimit: 250.0, exempted: "N", balanceBCO: 1000.0, balanceDDO: 0.0 },
    { srNo: "136", budgetHead: "006-2054-00-095-9999-2304-V-24-009", scheme: "(2304) Direction and administration", budgetEstimate: 2000.0, budgetAllotment: 2000.0, budgetReappropriation: 0.0, budgetSurrender: 0.0, budgetDistribution: 0.0, remainingBudget: 2000.0, expenditure: 0.0, hoaLimit: 500.0, exempted: "N", balanceBCO: 2000.0, balanceDDO: 0.0 },
    { srNo: "137", budgetHead: "006-2054-00-095-9999-2304-V-24-010", scheme: "(2304) Direction and administration", budgetEstimate: 1000.0, budgetAllotment: 1000.0, budgetReappropriation: 0.0, budgetSurrender: 0.0, budgetDistribution: 0.0, remainingBudget: 1000.0, expenditure: 0.0, hoaLimit: 250.0, exempted: "N", balanceBCO: 1000.0, balanceDDO: 0.0 },
    { srNo: "138", budgetHead: "006-2054-00-095-9999-2304-V-24-011", scheme: "(2304) Direction and administration", budgetEstimate: 1000.0, budgetAllotment: 1000.0, budgetReappropriation: 0.0, budgetSurrender: 0.0, budgetDistribution: 0.0, remainingBudget: 1000.0, expenditure: 0.0, hoaLimit: 250.0, exempted: "N", balanceBCO: 1000.0, balanceDDO: 0.0 },
    { srNo: "139", budgetHead: "006-2054-00-095-9999-2304-V-24-012", scheme: "(2304) Direction and administration", budgetEstimate: 500000.0, budgetAllotment: 500000.0, budgetReappropriation: 0.0, budgetSurrender: 0.0, budgetDistribution: 0.0, remainingBudget: 500000.0, expenditure: 0.0, hoaLimit: 125000.0, exempted: "N", balanceBCO: 500000.0, balanceDDO: 0.0 },
    { srNo: "140", budgetHead: "006-2054-00-095-9999-2304-V-27-001", scheme: "(2304) Direction and administration", budgetEstimate: 2000.0, budgetAllotment: 2000.0, budgetReappropriation: 0.0, budgetSurrender: 0.0, budgetDistribution: 0.0, remainingBudget: 2000.0, expenditure: 0.0, hoaLimit: 500.0, exempted: "N", balanceBCO: 2000.0, balanceDDO: 0.0 },
    { srNo: "141", budgetHead: "006-2054-00-095-9999-2304-V-27-002", scheme: "(2304) Direction and administration", budgetEstimate: 620000.0, budgetAllotment: 620000.0, budgetReappropriation: 0.0, budgetSurrender: 0.0, budgetDistribution: 0.0, remainingBudget: 620000.0, expenditure: 0.0, hoaLimit: 155000.0, exempted: "N", balanceBCO: 620000.0, balanceDDO: 0.0 },
    { srNo: "142", budgetHead: "006-2054-00-095-9999-2304-V-27-003", scheme: "(2304) Direction and administration", budgetEstimate: 200000.0, budgetAllotment: 200000.0, budgetReappropriation: 0.0, budgetSurrender: 0.0, budgetDistribution: 0.0, remainingBudget: 200000.0, expenditure: 0.0, hoaLimit: 50000.0, exempted: "N", balanceBCO: 200000.0, balanceDDO: 0.0 },
    { srNo: "143", budgetHead: "006-2054-00-095-9999-2304-V-28-001", scheme: "(2304) Direction and administration", budgetEstimate: 1000.0, budgetAllotment: 1000.0, budgetReappropriation: 0.0, budgetSurrender: 0.0, budgetDistribution: 0.0, remainingBudget: 1000.0, expenditure: 0.0, hoaLimit: 250.0, exempted: "N", balanceBCO: 1000.0, balanceDDO: 0.0 },
    { srNo: "144", budgetHead: "006-2054-00-095-9999-2304-V-28-002", scheme: "(2304) Direction and administration", budgetEstimate: 1000.0, budgetAllotment: 1000.0, budgetReappropriation: 0.0, budgetSurrender: 0.0, budgetDistribution: 0.0, remainingBudget: 1000.0, expenditure: 0.0, hoaLimit: 250.0, exempted: "N", balanceBCO: 1000.0, balanceDDO: 0.0 },
    { srNo: "145", budgetHead: "006-2054-00-095-9999-2304-V-28-003", scheme: "(2304) Direction and administration", budgetEstimate: 1000.0, budgetAllotment: 1000.0, budgetReappropriation: 0.0, budgetSurrender: 0.0, budgetDistribution: 0.0, remainingBudget: 1000.0, expenditure: 0.0, hoaLimit: 250.0, exempted: "N", balanceBCO: 1000.0, balanceDDO: 0.0 },
    { srNo: "146", budgetHead: "006-2054-00-095-9999-2304-V-29-001", scheme: "(2304) Direction and administration", budgetEstimate: 1400000.0, budgetAllotment: 1400000.0, budgetReappropriation: 0.0, budgetSurrender: 0.0, budgetDistribution: 204523.0, remainingBudget: 1195477.0, expenditure: 204523.0, hoaLimit: 1400000.0, exempted: "Y", balanceBCO: 1195477.0, balanceDDO: 0.0 },
    { srNo: "147", budgetHead: "006-2054-00-095-9999-2304-V-29-002", scheme: "(2304) Direction and administration", budgetEstimate: 1000.0, budgetAllotment: 1000.0, budgetReappropriation: 0.0, budgetSurrender: 0.0, budgetDistribution: 0.0, remainingBudget: 1000.0, expenditure: 0.0, hoaLimit: 1000.0, exempted: "Y", balanceBCO: 1000.0, balanceDDO: 0.0 },
    { srNo: "148", budgetHead: "006-2054-00-095-9999-2304-V-29-003", scheme: "(2304) Direction and administration", budgetEstimate: 1000.0, budgetAllotment: 1000.0, budgetReappropriation: 0.0, budgetSurrender: 0.0, budgetDistribution: 0.0, remainingBudget: 1000.0, expenditure: 0.0, hoaLimit: 1000.0, exempted: "Y", balanceBCO: 1000.0, balanceDDO: 0.0 },
    { srNo: "149", budgetHead: "006-2054-00-095-9999-2304-V-30-001", scheme: "(2304) Direction and administration", budgetEstimate: 10000.0, budgetAllotment: 10000.0, budgetReappropriation: 0.0, budgetSurrender: 0.0, budgetDistribution: 0.0, remainingBudget: 10000.0, expenditure: 0.0, hoaLimit: 2500.0, exempted: "N", balanceBCO: 10000.0, balanceDDO: 0.0 },
    { srNo: "150", budgetHead: "006-2054-00-095-9999-2304-V-30-002", scheme: "(2304) Direction and administration", budgetEstimate: 10000.0, budgetAllotment: 10000.0, budgetReappropriation: 0.0, budgetSurrender: 0.0, budgetDistribution: 0.0, remainingBudget: 10000.0, expenditure: 0.0, hoaLimit: 2500.0, exempted: "N", balanceBCO: 10000.0, balanceDDO: 0.0 }
];

// Generate Budget Line Items from data with ALL fields
export const MOCK_BUDGET_LINE_ITEMS: BudgetLineItem[] = BUDGET_DATA.map((item, index) => {
    const parsed = parseBudgetHead(item.budgetHead);
    return {
        id: `BL${String(index + 1).padStart(3, '0')}`,
        srNo: item.srNo,
        demandNo: parsed.demand,
        majorHead: parsed.major,
        subMajorHead: parsed.subMajor,
        minorHead: parsed.minor,
        segmentHead: parsed.segment,
        scheme: item.scheme,
        schemeNomenclature: (item as any).schemeNomenclature,
        chargedOrVoted: parsed.chargedOrVoted,
        objectHead: parsed.object,
        detailHead: parsed.detail,
        ddoCode: `DDO/${parsed.ddo}`,
        ddoName: `DDO ${parsed.ddo} - Direction and Administration`,
        ceilingLimit: item.hoaLimit,
        budgetHead: item.budgetHead,
        budgetEstimate: item.budgetEstimate,
        budgetAllotment: item.budgetAllotment,
        budgetReappropriation: item.budgetReappropriation,
        budgetSurrender: item.budgetSurrender,
        budgetDistribution: item.budgetDistribution,
        remainingBudget: item.remainingBudget,
        expenditure: item.expenditure,
        hoaExpenditureLimit: item.hoaLimit,
        exempted: item.exempted === 'Y',
        balanceBudgetBCO: item.balanceBCO,
        balanceBudgetDDO: item.balanceDDO
    };
});

// Generate Historical Data from budget data
export const MOCK_HISTORICAL_DATA: HistoricalData[] = BUDGET_DATA.map((item, index) => ({
    budgetLineItemId: `BL${String(index + 1).padStart(3, '0')}`,
    fy5: Math.round(item.budgetEstimate * 0.7),
    fy4: Math.round(item.budgetEstimate * 0.75),
    fy3: Math.round(item.budgetEstimate * 0.8),
    fy2: Math.round(item.budgetEstimate * 0.85),
    fy1: Math.round(item.budgetEstimate * 0.9),
    currentYearBE: item.budgetEstimate,
    actualTillDate: item.expenditure,
    projectedBalance: item.remainingBudget
}));

// Mock Users
export const MOCK_USERS: User[] = [
    { id: 'U001', name: 'Rajesh Kumar', designation: 'Assistant Director', role: 'ddo_creator', department: 'Administration', ddoCode: 'DDO/2304' },
    { id: 'U002', name: 'Priya Sharma', designation: 'Deputy Director', role: 'ddo_verifier', department: 'Administration', ddoCode: 'DDO/2304' },
    { id: 'U003', name: 'Amit Verma', designation: 'Director', role: 'ddo_approver', department: 'Administration', ddoCode: 'DDO/2304' },
    { id: 'U004', name: 'Sunita Patel', designation: 'Budget Officer', role: 'bco_creator', department: 'Finance' },
    { id: 'U005', name: 'Vikram Singh', designation: 'Joint Director (Budget)', role: 'bco_verifier', department: 'Finance' },
    { id: 'U006', name: 'Kavita Malhotra', designation: 'Director (Budget)', role: 'bco_approver', department: 'Finance' }
];

// Mock Estimation Records
export const MOCK_ESTIMATIONS: EstimationRecord[] = [
    // Approved records
    {
        id: 'EST001', budgetLineItemId: 'BL001', reviseEstimateCY: 450000, budgetEstimateNextYear: 520000,
        forwardEstimateY2: 550000, forwardEstimateY3: 580000, percentageDeviation: 4.0,
        status: 'approved', currentLevel: 'bco_approver', creatorRemarks: 'Standard allocation',
        verifierRemarks: 'Verified', approverRemarks: 'Approved', createdBy: 'U001',
        createdAt: '2024-10-15T10:30:00Z', submittedAt: '2024-10-15T14:00:00Z',
        verifiedAt: '2024-10-16T11:00:00Z', approvedAt: '2024-10-17T09:00:00Z', exceedsCeiling: false
    },
    // Under Verification (DDO Verifier)
    {
        id: 'EST002', budgetLineItemId: 'BL002', reviseEstimateCY: 240000000, budgetEstimateNextYear: 255000000,
        forwardEstimateY2: 270000000, percentageDeviation: 2.4, status: 'under_verification',
        currentLevel: 'ddo_verifier', creatorRemarks: 'Increased salary requirements',
        createdBy: 'U001', createdAt: '2024-11-01T09:00:00Z', submittedAt: '2024-11-01T16:30:00Z', exceedsCeiling: false
    },
    // Draft (DDO Creator)
    {
        id: 'EST003', budgetLineItemId: 'BL003', reviseEstimateCY: 155000000, budgetEstimateNextYear: 165000000,
        forwardEstimateY2: 175000000, percentageDeviation: 3.5, status: 'draft', currentLevel: 'ddo_creator',
        creatorRemarks: '', createdBy: 'U001', createdAt: '2024-11-20T14:00:00Z', exceedsCeiling: false
    },
    // Under Approval (DDO Approver) - NEW RECORDS
    {
        id: 'EST004', budgetLineItemId: 'BL004', reviseEstimateCY: 2700000, budgetEstimateNextYear: 2900000,
        forwardEstimateY2: 3100000, forwardEstimateY3: 3300000, percentageDeviation: 4.2,
        status: 'under_approval', currentLevel: 'ddo_approver',
        creatorRemarks: 'Additional allocation for new telephone connections',
        verifierRemarks: 'Calculations verified. Documents complete.',
        createdBy: 'U001', createdAt: '2024-11-25T09:00:00Z', submittedAt: '2024-11-25T15:00:00Z',
        verifiedAt: '2024-11-26T10:00:00Z', exceedsCeiling: false
    },
    {
        id: 'EST005', budgetLineItemId: 'BL005', reviseEstimateCY: 22000000, budgetEstimateNextYear: 24000000,
        forwardEstimateY2: 26000000, forwardEstimateY3: 28000000, percentageDeviation: 5.8,
        status: 'under_approval', currentLevel: 'ddo_approver',
        creatorRemarks: 'Salary revision impact - increased staffing requirement',
        verifierRemarks: 'Verified against HR records and pay commission recommendations.',
        createdBy: 'U001', createdAt: '2024-11-28T10:30:00Z', submittedAt: '2024-11-28T16:00:00Z',
        verifiedAt: '2024-11-29T11:30:00Z', exceedsCeiling: false
    },
    {
        id: 'EST006', budgetLineItemId: 'BL008', reviseEstimateCY: 2800000, budgetEstimateNextYear: 3200000,
        forwardEstimateY2: 3500000, percentageDeviation: 6.7,
        status: 'under_approval', currentLevel: 'ddo_approver',
        creatorRemarks: 'Office renovation and travel expenses for new projects',
        verifierRemarks: 'Detailed breakup verified. Supporting documents attached.',
        createdBy: 'U001', createdAt: '2024-12-01T08:00:00Z', submittedAt: '2024-12-01T14:00:00Z',
        verifiedAt: '2024-12-02T09:00:00Z', exceedsCeiling: true,
        exceedJustification: 'Ceiling exceeded due to new project requirements approved by department head'
    },
    {
        id: 'EST007', budgetLineItemId: 'BL010', reviseEstimateCY: 45000, budgetEstimateNextYear: 52000,
        forwardEstimateY2: 55000, percentageDeviation: 4.0,
        status: 'under_approval', currentLevel: 'ddo_approver',
        creatorRemarks: 'Minor increase for inflation adjustment',
        verifierRemarks: 'Verified. Within normal inflation range.',
        createdBy: 'U001', createdAt: '2024-12-05T11:00:00Z', submittedAt: '2024-12-05T17:00:00Z',
        verifiedAt: '2024-12-06T10:00:00Z', exceedsCeiling: false
    }
];


// Helper functions
export function getBudgetLineItemById(id: string): BudgetLineItem | undefined {
    return MOCK_BUDGET_LINE_ITEMS.find(item => item.id === id);
}

export function getHistoricalDataByBudgetLineId(budgetLineItemId: string): HistoricalData | undefined {
    return MOCK_HISTORICAL_DATA.find(data => data.budgetLineItemId === budgetLineItemId);
}

export function getEstimationsByRole(role: string): EstimationRecord[] {
    return MOCK_ESTIMATIONS.filter(est => {
        if (role.startsWith('ddo')) return est.currentLevel.startsWith('ddo');
        if (role.startsWith('bco')) return est.currentLevel.startsWith('bco');
        return false;
    });
}

export function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);
}

export function calculateTotalExpected(actual: number, projected: number): number {
    return actual + projected;
}

export function calculatePercentageDeviation(be: number, re: number): number {
    if (re === 0) return 0;
    return ((be - re) / re) * 100;
}

// Mock Audit Trail Data
import { AuditTrailEntry } from './types';

export const MOCK_AUDIT_TRAIL: AuditTrailEntry[] = [
    // Budget Line BL001 - Full workflow with detailed changes
    {
        id: 'audit-001-1',
        budgetLineItemId: 'BL001',
        timestamp: '2024-12-01T09:30:00Z',
        action: 'created',
        performedBy: { userId: 'U001', name: 'Rajesh Kumar', role: 'ddo_creator', designation: 'Assistant Director' },
        level: 'DDO',
        changes: [
            { field: 'reviseEstimateCY', fieldLabel: 'Proposed RE', oldValue: null, newValue: 450000 },
            { field: 'budgetEstimateNextYear', fieldLabel: 'Next Year BE', oldValue: null, newValue: 500000 },
            { field: 'forwardEstimateY2', fieldLabel: 'Forward Est (Y+2)', oldValue: null, newValue: 520000 },
        ],
        remarks: 'Initial estimation created based on previous year expenditure patterns'
    },
    {
        id: 'audit-001-2',
        budgetLineItemId: 'BL001',
        timestamp: '2024-12-02T10:15:00Z',
        action: 'submitted',
        performedBy: { userId: 'U001', name: 'Rajesh Kumar', role: 'ddo_creator', designation: 'Assistant Director' },
        level: 'DDO',
        remarks: 'Submitted for verification by DDO Verifier'
    },
    {
        id: 'audit-001-3',
        budgetLineItemId: 'BL001',
        timestamp: '2024-12-03T14:20:00Z',
        action: 'modified',
        performedBy: { userId: 'U002', name: 'Priya Sharma', role: 'ddo_verifier', designation: 'Deputy Director' },
        level: 'DDO',
        changes: [
            { field: 'budgetEstimateNextYear', fieldLabel: 'Next Year BE', oldValue: 500000, newValue: 520000 },
            { field: 'forwardEstimateY2', fieldLabel: 'Forward Est (Y+2)', oldValue: 520000, newValue: 550000 },
            { field: 'forwardEstimateY3', fieldLabel: 'Forward Est (Y+3)', oldValue: 0, newValue: 580000 },
        ],
        remarks: 'Adjusted estimates based on projected inflation rate of 4% per annum'
    },
    {
        id: 'audit-001-4',
        budgetLineItemId: 'BL001',
        timestamp: '2024-12-03T15:00:00Z',
        action: 'verified',
        performedBy: { userId: 'U002', name: 'Priya Sharma', role: 'ddo_verifier', designation: 'Deputy Director' },
        level: 'DDO',
        remarks: 'Verified and forwarded to DDO Approver for final approval'
    },
    {
        id: 'audit-001-5',
        budgetLineItemId: 'BL001',
        timestamp: '2024-12-05T11:30:00Z',
        action: 'approved',
        performedBy: { userId: 'U003', name: 'Amit Verma', role: 'ddo_approver', designation: 'Director' },
        level: 'DDO',
        remarks: 'Approved at DDO level. Forwarded to BCO for consolidation.'
    },
    {
        id: 'audit-001-6',
        budgetLineItemId: 'BL001',
        timestamp: '2024-12-07T09:00:00Z',
        action: 'modified',
        performedBy: { userId: 'U004', name: 'Sunita Patel', role: 'bco_creator', designation: 'Budget Officer' },
        level: 'BCO',
        changes: [
            { field: 'budgetEstimateNextYear', fieldLabel: 'Next Year BE', oldValue: 520000, newValue: 515000 },
        ],
        remarks: 'Aligned with departmental ceiling limits as per BCO guidelines'
    },
    {
        id: 'audit-001-7',
        budgetLineItemId: 'BL001',
        timestamp: '2024-12-08T14:45:00Z',
        action: 'verified',
        performedBy: { userId: 'U005', name: 'Vikram Singh', role: 'bco_verifier', designation: 'Senior Budget Officer' },
        level: 'BCO',
        remarks: 'Verified at BCO level. Ready for BCO Approver review.'
    },
    {
        id: 'audit-001-8',
        budgetLineItemId: 'BL001',
        timestamp: '2024-12-09T16:00:00Z',
        action: 'approved',
        performedBy: { userId: 'U006', name: 'Meera Joshi', role: 'bco_approver', designation: 'Chief Budget Controller' },
        level: 'BCO',
        remarks: 'Final approval at BCO level. Budget line ready for consolidation.'
    },

    // Budget Line BL002 - Returned workflow with corrections
    {
        id: 'audit-002-1',
        budgetLineItemId: 'BL002',
        timestamp: '2024-12-01T10:00:00Z',
        action: 'created',
        performedBy: { userId: 'U001', name: 'Rajesh Kumar', role: 'ddo_creator', designation: 'Assistant Director' },
        level: 'DDO',
        changes: [
            { field: 'reviseEstimateCY', fieldLabel: 'Proposed RE', oldValue: null, newValue: 240000000 },
            { field: 'budgetEstimateNextYear', fieldLabel: 'Next Year BE', oldValue: null, newValue: 270000000 },
        ],
        remarks: 'Created estimation for salaries head with 12% increase'
    },
    {
        id: 'audit-002-2',
        budgetLineItemId: 'BL002',
        timestamp: '2024-12-02T11:00:00Z',
        action: 'submitted',
        performedBy: { userId: 'U001', name: 'Rajesh Kumar', role: 'ddo_creator', designation: 'Assistant Director' },
        level: 'DDO',
        remarks: 'Submitted for verification'
    },
    {
        id: 'audit-002-3',
        budgetLineItemId: 'BL002',
        timestamp: '2024-12-03T16:30:00Z',
        action: 'returned',
        performedBy: { userId: 'U002', name: 'Priya Sharma', role: 'ddo_verifier', designation: 'Deputy Director' },
        level: 'DDO',
        remarks: 'RETURNED: Proposed 12% increase exceeds ceiling limit. Please provide detailed justification or revise estimates within 8% ceiling.'
    },
    {
        id: 'audit-002-4',
        budgetLineItemId: 'BL002',
        timestamp: '2024-12-04T09:30:00Z',
        action: 'modified',
        performedBy: { userId: 'U001', name: 'Rajesh Kumar', role: 'ddo_creator', designation: 'Assistant Director' },
        level: 'DDO',
        changes: [
            { field: 'budgetEstimateNextYear', fieldLabel: 'Next Year BE', oldValue: 270000000, newValue: 255000000 },
            { field: 'creatorRemarks', fieldLabel: 'Justification', oldValue: '', newValue: 'Revised to 6% increase. Additional requirement of 2 new posts as per approved sanction order dated 15/11/2024.' },
        ],
        remarks: 'Revised estimates as per verifier feedback with proper justification'
    },
    {
        id: 'audit-002-5',
        budgetLineItemId: 'BL002',
        timestamp: '2024-12-04T10:00:00Z',
        action: 'submitted',
        performedBy: { userId: 'U001', name: 'Rajesh Kumar', role: 'ddo_creator', designation: 'Assistant Director' },
        level: 'DDO',
        remarks: 'Re-submitted after revising estimates within ceiling limits'
    },
    {
        id: 'audit-002-6',
        budgetLineItemId: 'BL002',
        timestamp: '2024-12-05T11:00:00Z',
        action: 'verified',
        performedBy: { userId: 'U002', name: 'Priya Sharma', role: 'ddo_verifier', designation: 'Deputy Director' },
        level: 'DDO',
        remarks: 'Justification accepted. Verified and forwarded to approver.'
    },

    // Budget Line BL003 - Simple workflow
    {
        id: 'audit-003-1',
        budgetLineItemId: 'BL003',
        timestamp: '2024-12-02T09:00:00Z',
        action: 'created',
        performedBy: { userId: 'U001', name: 'Rajesh Kumar', role: 'ddo_creator', designation: 'Assistant Director' },
        level: 'DDO',
        changes: [
            { field: 'reviseEstimateCY', fieldLabel: 'Proposed RE', oldValue: null, newValue: 159360000 },
            { field: 'budgetEstimateNextYear', fieldLabel: 'Next Year BE', oldValue: null, newValue: 165000000 },
        ],
        remarks: 'Allowances head - based on current sanctioned strength'
    },
    {
        id: 'audit-003-2',
        budgetLineItemId: 'BL003',
        timestamp: '2024-12-03T10:30:00Z',
        action: 'submitted',
        performedBy: { userId: 'U001', name: 'Rajesh Kumar', role: 'ddo_creator', designation: 'Assistant Director' },
        level: 'DDO'
    },

    // Budget Line BL004 - Under review
    {
        id: 'audit-004-1',
        budgetLineItemId: 'BL004',
        timestamp: '2024-12-03T11:00:00Z',
        action: 'created',
        performedBy: { userId: 'U001', name: 'Rajesh Kumar', role: 'ddo_creator', designation: 'Assistant Director' },
        level: 'DDO',
        changes: [
            { field: 'reviseEstimateCY', fieldLabel: 'Proposed RE', oldValue: null, newValue: 2784000 },
            { field: 'budgetEstimateNextYear', fieldLabel: 'Next Year BE', oldValue: null, newValue: 2900000 },
        ]
    },
];

// Generate audit trail for remaining budget lines (BL005 to BL066)
for (let i = 5; i <= 66; i++) {
    const blId = `BL${String(i).padStart(3, '0')}`;
    const baseDate = new Date(2024, 11, 1 + (i % 10));

    MOCK_AUDIT_TRAIL.push({
        id: `audit-${blId}-1`,
        budgetLineItemId: blId,
        timestamp: baseDate.toISOString(),
        action: 'created',
        performedBy: { userId: 'U001', name: 'Rajesh Kumar', role: 'ddo_creator', designation: 'Assistant Director' },
        level: 'DDO',
        changes: [
            { field: 'reviseEstimateCY', fieldLabel: 'Proposed RE', oldValue: null, newValue: Math.floor(Math.random() * 10000000) + 100000 },
            { field: 'budgetEstimateNextYear', fieldLabel: 'Next Year BE', oldValue: null, newValue: Math.floor(Math.random() * 10000000) + 100000 },
        ],
        remarks: 'Initial budget estimation created'
    });

    if (i % 3 === 0) {
        const submitDate = new Date(baseDate);
        submitDate.setDate(submitDate.getDate() + 1);
        MOCK_AUDIT_TRAIL.push({
            id: `audit-${blId}-2`,
            budgetLineItemId: blId,
            timestamp: submitDate.toISOString(),
            action: 'submitted',
            performedBy: { userId: 'U001', name: 'Rajesh Kumar', role: 'ddo_creator', designation: 'Assistant Director' },
            level: 'DDO',
            remarks: 'Submitted for verification'
        });
    }
}

export function getAuditTrailByBudgetLineId(budgetLineItemId: string): AuditTrailEntry[] {
    return MOCK_AUDIT_TRAIL.filter(entry => entry.budgetLineItemId === budgetLineItemId);
}

