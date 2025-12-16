**Breakup Required Detail Heads**

| Object Head | Detail Head Code | Detail Head Description (English) |
| :---- | :---- | :---- |
| 11 | 001, 003, 004, 006, 007, 008, 009, 011, 016, 118 | Regular Salary (Permanent Employees) |
| 12 | 000, 001, 003 | Wages – Labour |
| 16 | 001, 003, 006, 008, 009, 010, 018 | IAS Salary (Indian Administrative Service) |
| 19 | 001, 003, 006, 008, 009, 011, 016, 018 | Work-Charged / Temporary Duty Employee Salary |
| 31 | 004 | Outsourced Staff Payment |
| 22 | 002 | Telephone |
| 22 | 003 | Furniture Purchase |
| 22 | 005 | Electricity |
| 22 | 009 | Petrol, Oil etc |
| 23 | 001 | Purchase of Office Equipment |
| 27 | 001 | IT & Computer Purchase Capital |
| 31 | 007 | Transportation Service |

10. **Field Table**

| Field Name | Description | UI Component | Field Type | Field Length | Mandatory (Y/N) | *Validation Rule* | *Remarks* |
| :---- | :---- | :---- | :---- | :---- | :---- | :---- | :---- |
| Demand No | Demand Number mapped to Budget Line | Display Field | Auto-Fetched | 3 digits | Y | None | Fetched from HoA Master |
| Major Head | Major classification | Display Field | Auto-Fetched | 4 digits | Y | None | Read-only |
| Sub Major Head | Sub-major classification | Display Field | Auto-Fetched | 2 digits | Y | None | Read-only |
| Minor Head | Minor classification | Display Field | Auto-Fetched | 3 digits | Y | None | Read-only |
| Segment Head | Segment code | Display Field | Auto-Fetched | 4 digits | Y | None | Read-only |
| Scheme | Scheme mapped with budget line | Display Field | Auto-Fetched | N/A | Y | None | Read-only |
| Project | Project Code (if applicable) | Display Field | Auto-Fetched | N/A | N | None | Optional |
| Object Head | Accounting object head | Display Field | Auto-Fetched | 2 digits | Y | None | Read-only |
| Detail Head | Detail object head | Display Field | Auto-Fetched | 3 digits | Y | None | Read-only |
| Charged / Voted | Indicates nature of expenditure | Display Field | Auto-Fetched | N/A | Y | None | Read-only |
| Previous 5 Years Actuals | Prior year expenditure history | Table | Numeric | N/A | N | Auto-fetched numbers | Displayed on toggle |
| Budget Estimate (Previous FY) | BE of the last FY | Display | Numeric | 15 | N | ≥ 0 | Fetched from AG/VLC |
| Expenditure (Previous FY) | Actual expenditure for the last FY | Display | Numeric | 15 | N | ≥ 0 | Auto-fetched |
| Budget Estimate (Current FY) | Approved BE for current financial year | Display | Numeric | 15 | Y | ≥ 0 | Auto-fetched |
| Budget Allotment (Current FY) | Allotment released to DDO | Display | Numeric | 15 | N | ≥ 0 | Auto-fetched |
| Budget Re-appropriation | Additions/reductions during FY | Display | Numeric | 15 | N | ≥ 0 | Auto-fetched |
| Supplementary Budget | Read-only field showing the total supplementary amount sanctioned for the current FY | Display Field | Numeric | 15 | N | Cannot be edited | Auto-fetched from Supplementary Budget records |
| Total Budget Estimate (Current FY) | Sum of BE \+ RA \+ Supplementary | Display | Numeric | 15 | Y | ≥ 0 | Formula: BE \+ RA \+ Suppl. |
| Expenditure Upto Cutoff Date | Actual expenditure till system-defined cutoff (e.g., 31 Aug) | Display | Numeric | 15 | Y | ≥ 0 | Auto-fetched |
| Proposed Expenditure (Remaining Months) | DDO-projected expenditure for remaining FY | Input | Numeric | 15 | Y | ≥ 0 | Used for Total RE calculation |
| Total Revised Estimate (RE) | Total RE for the current year | Display | Numeric | 15 | Y | ≥ 0 | Formula: RE \= Expenditure Till Date \+ Proposed Remaining Expenditure |
| % RE Over BE (Previous FY) | Percentage difference of RE over Previous Year BE | Display | Numeric | 5 | N | Auto-calculated | Formula: ((RE – PreviousYearBE) / PreviousYearBE) × 100 |
| BE for Next FY (BE1) | Main budget estimate for next FY | Input | Numeric | 15 | Y | ≥ 0 | Entered by DDO/Edited by BCO |
| % BE1 Over Current BE | Variance % from current BE | Display | Numeric | 10 | N | Auto | Formula: ((BE1 – CurrentBE) / CurrentBE) × 100 |
| % BE1 Over Current RE | Variance % from current RE | Display | Numeric | 10 | N | Auto | Formula: ((BE1 – CurrentRE) / CurrentRE) × 100 |
| BE for Next FY \+1 (BE2) | Budget projection for subsequent year | Input | Numeric | 15 | Y | ≥ 0 | MTE |
| BE for Next FY \+2 (BE3) | Two-year forward budget estimate | Input | Numeric | 15 | Y | ≥ 0 | MTE |
| DDO Remarks | General explanation | Text Area | Text | 2000 | N | None | Optional |
| Supporting Documents | Additional docs | File Upload | PDF/JPG | 10MB | N | None | Optional |

**Fields for Basic Pay (For Object Code- 11, 12 and 19 and Detail Head 001\)**

| Field Name | Description | UI Component | Field Type | Length | Mandatory (Y/N) | Validation Rule | Remarks |
| :---- | :---- | :---- | :---- | :---- | :---- | :---- | :---- |
| **DDO Code** | Identifier of DDO | Display | Text | 10 | Y | Read-only | Auto-fetched from HRMS |
| **DDO Name** | Name of DDO | Display | Text | 100 | Y | Read-only | Auto-fetched |
| **Grade Pay Code** | Grade level of employees | Dropdown | Text | 10 | Y | Must be valid grade pay | Loaded from Grade Pay Master |
| **Employee Count** | Number of employees under this grade | Numeric Input | Integer | 6 | Y | Must be ≥ 0 | Fetched from HRMS; editable by DDO |
| **Average Basic Pay (₹)** | Average monthly basic pay for employees of this grade | Numeric Input | Decimal | 12 | Y | Must be ≥ 0 | Auto-calculated from salary roll; editable |
| **Increment %** | Annual increment % applicable | Display / Input | Decimal | 5 | Y | 0–10% | Configured by FD |
| **Monthly Basic Pay (Calculated)** | Monthly basic pay after increment | Display | Numeric | 12 | Y | Formula: Avg Basic × (1 \+ Increment%) | Read-only |
| **Annual Basic Pay (Calculated)** | Annual estimation for basic pay | Display | Numeric | 12 | Y | Formula: Monthly Basic × 12 | Read-only |
| **Remarks** | Explanation for any change | Text Area | Text | 500 | N | — | Optional |

**Fields for Dearness Allowance (For Object Code- 11, 12, 16 and 19 and Detail Head – 003\)**

| Field Name | Description | UI Component | Field Type | Length | Mandatory (Y/N) | Validation Rule | Remarks |
| :---- | :---- | :---- | :---- | :---- | :---- | :---- | :---- |
| **DDO Code** | Identifier of DDO | Display | Text | 10 | Y | Read-only | Auto-fetched from HRMS |
| **DDO Name** | Name of DDO | Display | Text | 100 | Y | Read-only | Auto-fetched |
| **Grade Pay Code** | Grade of employees | Dropdown | Text | 10 | Y | Select valid grade pay | From Master |
| **Employee Count** | Number of employees for DA calculation | Numeric Input | Integer | 6 | Y | ≥ 0 | Editable |
| **Average Basic Pay (₹)** | Average basic pay of grade | Numeric Input | Decimal | 12 | Y | ≥ 0 | Auto from salary roll |
| **DA %** | Declared DA percentage for FY | Display / Input | Decimal | 5 | Y | 0–200% | Updated by Finance Department |
| **Monthly DA (Calculated)** | Monthly DA estimate | Display | Numeric | 12 | Y | Formula: Avg Basic × DA% | Read-only |
| **Annual DA (Calculated)** | Annual DA estimate | Display | Numeric | 12 | Y | Formula: Monthly DA × 12 × Employee Count | Read-only |
| **Remarks** | Explanation for variations | Text Area | Text | 500 | N | — | Optional |

**Fields for Transport Allowance (For Object Code \- 11 and Detail Head – 004\)**

| Field Name | Description | UI Component | Field Type | Length | Mandatory (Y/N) | Validation Rule | Remarks |
| :---- | :---- | :---- | :---- | :---- | :---- | :---- | :---- |
| **DDO Code** | Identifier of DDO | Display | Text | 10 | Y | Read-only | Auto-fetched |
| **DDO Name** | Name of DDO | Display | Text | 100 | Y | Read-only | Auto-fetched |
| **Pay Level** | Employee Pay Level (L1–L18) | Dropdown | Enum | Y | Must match HRMS | Auto-fetched; editable | Pay Level |
| **Eligible Employee Count** | Number of employees eligible for TA | Numeric Input | Integer | 6 | Y | ≥ 0 | Editable by DDO |
| **Monthly TA Rate (₹)** | Rate per employee per month | Numeric Input | Decimal | 10 | Y | ≥ 0 | Based on Govt rules |
| **New Recruits (Expected)** | Additional employees expected to join | Numeric Input | Integer | 6 | N | ≥ 0 | Optional projection |
| **Monthly TA Requirement (Calculated)** | Total monthly TA | Display | Numeric | 12 | Y | Formula: (Emp Count \+ New Recruits) × Rate | Read-only |
| **Annual TA Requirement (Calculated)** | Total annual TA | Display | Numeric | 12 | Y | Formula: Monthly TA × 12 | Read-only |
| **Remarks** | Explanation for increase/decrease | Text Area | Text | 500 | N | — | Optional |

 

**Fields for HRA(For Object Code \- 11 ,16 and 19 and Detail Head – 006\)**

| Field Name | Description | UI Component | Field Type | Length | Mandatory (Y/N) | Validation Rule | Remarks |
| :---- | :---- | :---- | :---- | :---- | :---- | :---- | :---- |
| **DDO Code** | Identifier of DDO | Display | Text | 10 | Y | Read-only | Auto-fetched |
| **DDO Name** | Name of DDO | Display | Text | 100 | Y | Read-only | Auto-fetched |
| **Grade Pay Code** | Grade of employees | Dropdown | Text | 10 | Y | Must be valid | From Master |
| **Employee Count** | Number of employees eligible for HRA | Numeric Input | Integer | 6 | Y | ≥ 0 | Editable |
| **Average Basic Pay (₹)** | Average basic pay for the grade | Numeric Input | Decimal | 12 | Y | ≥ 0 | Editable |
| **HRA %** | HRA percentage according to city category | Display / Input | Decimal | 5 | Y | 0–30% | Based on Category (A/B/C City) |
| **Monthly HRA (Calculated)** | Monthly HRA estimate | Display | Numeric | 12 | Y | Formula: Avg Basic × HRA% × Emp Count | Read-only |
| **Annual HRA (Calculated)** | Annual estimate | Display | Numeric | 12 | Y | Formula: Monthly HRA × 12 | Read-only |
| **Remarks** | Additional explanation | Text Area | Text | 500 | N | — | Optional |

 

**Fields for Other Allowances (For Object Code \- 11,16 and 19 and Detail Head – 008\)**

| Field Name | Description | UI Component | Field Type | Length | Mandatory | Validation Rule | Remarks |
| :---- | :---- | :---- | :---- | :---- | :---- | :---- | :---- |
| **DDO Code** | Identifier | Display | Text | 10 | Y | Read-only | Auto-fetched |
| **DDO Name** | DDO name | Display | Text | 100 | Y | Read-only | Auto-fetched |
| **Eligible Employee Count** | Employees eligible for other allowances | Numeric Input | Integer | 6 | Y | ≥ 0 | Editable by DDO |
| **Allowance Type** | Type of allowance (CCA, Risk Allowance, etc.) | Dropdown | Text | — | Y | Must select | Controlled by master |
| **Monthly Allowance Rate (₹)** | Rate per employee per month | Numeric Input | Decimal | 10 | Y | ≥ 0 | Editable |
| **Annual Allowance (Calculated)** | Yearly requirement | Display | Numeric | 15 | Y | Formula: Emp Count × Monthly Rate × 12 | Read-only |
| **Remarks** | Explanation | Text Area | Text | 500 | N | — | Optional |

 

**Fields for Medical Reimbursement (For Object Code \- 11, 16 and 19 and Detail Head – 009\)**

| Field Name | Description | UI Component | Type | Length | Mandatory | Validation | Remarks |
| :---- | :---- | :---- | :---- | :---- | :---- | :---- | :---- |
| **DDO Code** | Identifier | Display | Text | 10 | Y | Read-only | Auto |
| **DDO Name** | DDO name | Display | Text | 100 | Y | Read-only | Auto |
| **Eligible Employee Count** | Employees eligible under medical reimbursement | Numeric Input | Integer | 6 | Y | ≥ 0 | Editable |
| **Average Annual Claim (₹)** | Average historical claim per employee | Numeric Input | Decimal | 12 | Y | ≥ 0 | Auto-fetched from past expenditure (editable) |
| **Expected Increase %** | Expected inflation/claim increase | Input | Decimal | 5 | N | 0–20% | Optional |
| **Total Estimated Requirement (₹)** | System computed amount | Display | Numeric | 15 | Y | Formula: Emp Count × Avg Claim × (1 \+ Increase%) | Read-only |
| **Remarks** | Additional comments | Text Area | — | 500 | N | — | Optional |

 

**Fields for Festival Advance (For Object Code \- 11, 19 and Detail Head – 011\)**

| Field Name | Description | UI Component | Type | Length | Mandatory | Validation | Remarks |
| :---- | :---- | :---- | :---- | :---- | :---- | :---- | :---- |
| **DDO Code** | Identifier | Display | Text | 10 | Y | — | Auto |
| **DDO Name** | Name | Display | Text | 100 | Y | — | Auto |
| **Eligible Employee Count** | No. of employees eligible | Numeric Input | Integer | 6 | Y | ≥ 0 | Editable |
| **Advance Amount per Employee** | Standard advance | Numeric Input | Decimal | 10 | Y | ≥ 0 | Pre-filled (Govt rule) |
| **Total Requirement (₹)** | System calculated | Display | Numeric | 15 | Y | Formula: Emp Count × Amount | Read-only |
| **Remarks** | Comments | Text Area | — | 500 | N | — | Optional |

 

**Fields for Grain Advance(For Object Head \- 11, 19 and Detail Head – 016\)**

| Field Name | Description | UI Component | Type | Mandatory | Validation | Remarks |
| :---- | :---- | :---- | :---- | :---- | :---- | :---- |
| **DDO Code** | Identifier | Display | Text | Y | Read-only | Auto |
| **DDO Name** | Name | Display | Text | Y | Read-only | Auto |
| **Eligible Employee Count** | No. eligible | Numeric Input | Integer | Y | ≥ 0 | Editable |
| **Advance Amount per Employee** | Standard amount | Numeric Input | Decimal | Y | ≥ 0 | As per rules |
| **Total Requirement** | System calculated | Display | Numeric | Y | Formula: Emp Count × Amount | Read-only |
| **Remarks** | Notes | Text Area | — | N | — | Optional |

 

**Fields for Medical Advance(For Object Head-11, 16 and 19 and Detail Head – 018\)**

| Field Name | Description | UI Component | Type | Mandatory | Validation | Remarks |
| :---- | :---- | :---- | :---- | :---- | :---- | :---- |
| **DDO Code** | DDO ID | Display | Text | Y | Read-only | Auto |
| **DDO Name** | DDO Name | Display | Text | Y | Read-only | Auto |
| **Expected No. of Medical Cases** | No. of expected advance requests | Numeric Input | Integer | Y | ≥ 0 | Based on past trends |
| **Average Medical Advance Amount** | Avg. per case | Numeric Input | Decimal | Y | ≥ 0 | Editable |
| **Total Estimated Requirement** | Calculated | Display | Numeric | Y | Formula: Cases × Avg Amount | Read-only |
| **Remarks** | Additional comments | Text Area | Text | N | — | Optional |

 

**Fields for Special Pay(For Object Head-11 Detail Head – 021\)**

| Field Name | Description | Component | Type | Mandatory | Validation | Remarks |
| :---- | :---- | :---- | :---- | :---- | :---- | :---- |
| **DDO Code** | Identifier | Display | Text | Y | — | Auto |
| **DDO Name** | DDO Name | Display | Text | Y | — | Auto |
| **No. of Employees Receiving Special Pay** | Eligible staff | Numeric Input | Integer | Y | ≥ 0 | Editable |
| **Special Pay Rate** | Rate per employee | Numeric Input | Decimal | Y | ≥ 0 | As per rules |
| **Annual Requirement** | Total | Display | Numeric | Y | Formula: Count × Rate × 12 | Read-only |
| **Remarks** | Reason | Text Area | Text | N | — | Required if variation occurs |

 

**Fields for Contractual Employee Payment(For Object Head-11 and Detail Head – 025\)**

| Field Name | Description | UI Component | Type | Len | Mandatory | Validation | Remarks |
| :---- | :---- | :---- | :---- | :---- | :---- | :---- | :---- |
| **DDO Code** | DDO ID | Display | Text | 10 | Y | — | Auto |
| **DDO Name** | DDO Name | Display | Text | 100 | Y | — | Auto |
| **Number of Contract Employees** | Count | Numeric | Integer | 6 | Y | ≥ 0 | Editable |
| **Monthly Honorarium** | Per employee | Numeric Input | Decimal | 10 | Y | ≥ 0 | Editable |
| **Total Monthly Payment** | Calc | Display | Numeric | — | Y | Formula: Count × Honorarium | Read-only |
| **Annual Payment** | Calc | Display | Numeric | — | Y | Formula: Monthly × 12 | Read-only |
| **Remarks** | Justification | Text Area | — | 500 | N | — | Optional |

 

**Fields for Wages( For Object Head \- 12 and Detail Head – 000\)**

| Field Name | Description | UI Component | Type | Mandatory | Validation | Remarks |
| :---- | :---- | :---- | :---- | :---- | :---- | :---- |
| **DDO Code** | Identifier | Display | Text | Y | Read-only | Auto |
| **DDO Name** | Name | Display | Text | Y | Read-only | Auto |
| **No. of Daily Wagers / Mali / Helper** | Count of wage-based workers | Numeric Input | Integer | Y | ≥ 0 | Editable |
| **Monthly Wage Rate (₹)** | Per worker | Numeric Input | Decimal | Y | ≥ 0 | Editable |
| **Expected Additional Work Months** | Seasonal requirement | Numeric Input | Integer | N | ≥ 0 | Optional |
| **Annual Wage Calculation** | Total annual cost | Display | Numeric | Y | Formula: (Count × Monthly Rate × 12\) \+ Seasonal | Read-only |
| Remarks | Notes | Text Area | Text | N | — | Optional |

**Fields for Leave Travel Facility (For Object Head \-16 and Detail Head – 010\)**

| Field Name | Description | UI Component | Field Type | Length | Mandatory (Y/N) | Validation Rule | Remarks |
| :---- | :---- | :---- | :---- | :---- | :---- | :---- | :---- |
| **DDO Code** | DDO identifier | Display | Text | 10 | Y | Read-only | Auto-fetched |
| **DDO Name** | DDO Name | Display | Text | 100 | Y | Read-only | Auto-fetched |
| **Eligible Employee Count** | Number of officers eligible for LTC | Numeric Input | Integer | 6 | Y | ≥ 0 | Fetched from HRMS, editable |
| **Employees Expected to Avail LTC This Year** | Estimate of cases to be reimbursed | Numeric Input | Integer | 6 | Y | ≥ 0 and ≤ Eligible Count | Required |
| **Average LTC Claim Amount (₹)** | Avg. LTC expense per employee | Numeric Input | Decimal | 12 | Y | ≥ 0 | Based on past claims; editable |
| **Expected Inflation Rate (%)** | Expected increase due to travel cost | Numeric Input | Decimal | 5 | N | 0–15% | Optional |
| **Estimated Total LTC Requirement (₹)** | Yearly budget needed | Display | Numeric | 15 | Y | Formula: Cases × AvgClaim × (1 \+ Inflation%) | Auto-calculated |
| **Pending LTC Claims (₹)** | Backlog of last year's pending claims | Numeric Input | Decimal | 12 | N | ≥ 0 | Optional |
| **Grand Total Requirement (₹)** | Final figure shown in BE | Display | Numeric | 15 | Y | Formula: EstimatedTotal \+ PendingClaims | Read-only |
| **Justification Note** | Why LTC budget increased/decreased | Text Area | Text | 500 | Conditional | Mandatory if BE \> Last Year |   |
| **Supporting Document** | Documents for estimation | File Upload | PDF/JPG | — | N | Max 10MB | Optional unless claim spike is high |

 

**Fields for City Compensatory Allowance(For Object Head \- 11 and Detail Head – 007\)**

| Field Name | Description | UI Component | Field Type | Length | Mandatory (Y/N) | Validation Rule | Remarks |
| :---- | :---- | :---- | :---- | :---- | :---- | :---- | :---- |
| **DDO Code** | Identifier of the DDO | Display | Text | 10 | Y | Read-only | Auto-fetched from HRMS |
| **DDO Name** | Name of DDO | Display | Text | 100 | Y | Read-only | Auto-fetched |
| **Pay Level** | Employee Pay Level (L1–L18) | Dropdown | Enum | — | Y | Must match HRMS Pay Level | Required because CCA is often Pay-Level based |
| **CCA Eligible Employee Count** | Number of employees eligible for CCA in this pay level | Number Input | Integer | 6 | Y | ≥ 0 | Fetched from HRMS; editable by DDO if needed |
| **CCA Rate per Month (₹)** | Monthly City Compensatory Allowance | Number Input | Decimal | 10 | Y | \> 0 | Comes from Allowance Rate Master; editable if permitted |
| **Monthly CCA Amount (Calculated)** | System-calculated monthly CCA | Display | Numeric | 15 | Y | Formula: *CCA Rate × Employee Count* | Auto-calculated; read-only |
| **Annual CCA Amount (Calculated)** | Yearly CCA estimate | Display | Numeric | 15 | Y | Formula: *Monthly CCA × 12* | Auto-calculated; read-only |
| **Reason / Remarks** | Additional justification | Text Area | String | 500 | N | — | Optional |

**Fields for Outsourced Staff Payment(For Object Head – 31 and Detail Head \- 004\)** 

| Field Name | Description | UI Component | Field Type | Length | Mandatory (Y/N) | Validation Rule | Remarks |
| :---- | :---- | :---- | :---- | :---- | :---- | :---- | :---- |
| **DDO Code** | Identifier of the DDO | Display | Text | 10 | Y | Read-only | Auto-fetched from HRMS |
| **DDO Name** | Name of the DDO | Display | Text | 100 | Y | Read-only | Auto-fetched |
| **Type of Outsourced Staff** | Category of outsourced manpower (Peon, DEO, Security, Sweeper, etc.) | Dropdown | Enum | — | Y | Must be valid staff type | Loaded from Outsourced Staff Master |
| **Service Provider Name** | Name of agency/vendor (if finalized) | Text Box | String | 150 | N | — | Optional |
| **Number of Outsourced Staff** | Total outsourced staff engaged | Numeric Input | Integer | 6 | Y | ≥ 0 | Editable by DDO |
| **Monthly Rate per Staff (₹)** | Monthly payment per outsourced staff | Numeric Input | Decimal | 12 | Y | \> 0 | As per contract / prevailing rate |
| **Monthly Outsourced Cost (Calculated)** | Monthly cost for outsourced staff | Display | Numeric | 15 | Y | Formula: *Staff Count × Monthly Rate* | Auto-calculated |
| **Contract Duration (Months)** | No. of months service is required | Numeric Input | Integer | 2 | Y | 1–12 | Normally 12 months |
| **Annual Outsourced Cost (Calculated)** | Total yearly expenditure | Display | Numeric | 15 | Y | Formula: *Monthly Cost × Duration* | Auto-calculated; read-only |
| **Revision / Escalation %** | Expected rate increase (if any) | Numeric Input | Decimal | 5 | N | 0–20% | Optional |
| **Revised Annual Cost (Calculated)** | Annual cost after escalation | Display | Numeric | 15 | N | Formula: *Annual Cost × (1 \+ Escalation%)* | Auto-calculated |
| **Reason / Justification** | Reason for engaging or increasing outsourced staff | Text Area | String | 500 | Y | Cannot be blank | Mandatory for audit |
| **Supporting Document** | Contract / approval / proposal | File Upload | PDF/JPG | 10 MB | N | Valid file type | Optional unless required |

**Fields for Telephone(For Object Head \- 22 and Detail Head \- 002\)**

| Field Name | Description | UI Component | Field Type | Length | Mandatory | Validation Rule | Remarks |
| :---- | :---- | :---- | :---- | :---- | :---- | :---- | :---- |
| **DDO Code** | DDO identifier | Display | Text | 10 | Y | Read-only | Auto-fetched |
| **DDO Name** | DDO name | Display | Text | 100 | Y | Read-only | Auto-fetched |
| **Type of Telephone Connection** | Mobile/Landline/Broadband | Dropdown | Enum | NA | Y | Must select one | Master maintained |
| **Description** | Short usage/purpose description | Text Box | String | 300 | N | — | Auto-fetched |
| **Old Available Quantity** | Existing active telephone connections | Number Input | Integer | 5 | Y | ≥ 0 | Fetched from backend; editable |
| **Number of Employees Using Asset** | Employees assigned telephone service | Number Input | Integer | 5 | N | ≥ 0 | Backend data; editable |
| **New Required Quantity** | Additional connections needed | Number Input | Integer | 5 | Y | ≥ 0 | DDO entry |
| **Monthly Charge (₹)** | Monthly tariff per connection | Number Input | Decimal | 12 | Y | \> 0 | Editable |
| **Yearly Total (₹)** | Auto yearly telephone cost | Display | Numeric | NA | Y | (Old \+ New Qty) × Monthly Charge × 12 | Auto |
| **Reason for New Purchase** | Justification | Text Area | Text | 500 | Y | Cannot be blank | Mandatory if New Qty \> 0 |

**Fields for Furniture Purchase(For Object Head \- 22 and Detail Head \- 003\)**

| Field Name | Description | UI Component | Type | Len | Mandatory | Validation Rule | Remarks |
| :---- | :---- | :---- | :---- | :---- | :---- | :---- | :---- |
| **DDO Code** | Auto | Display | Text | 10 | Y | Read-only | Backend |
| **DDO Name** | Auto | Display | Text | 100 | Y | Read-only | Backend |
| **Name of Furniture Item** | Table/Chair/Almirah etc. | Text Box | Text | 200 | Y | No special chars | Master suggested |
| **Description** | Short usage/purpose description | Text Box | String | 300 | N | — | Auto-fetched |
| **Old Available Quantity** | Present usable items | Number Input | Integer | 5 | Y | ≥ 0 | Backend editable |
| **Number of Employees Using Asset** | Staff using items | Number Input | Integer | 5 | N | ≥ 0 | Optional |
| **New Required Quantity** | Additional items | Number Input | Integer | 5 | Y | ≥ 0 | DDO entry |
| **Per Unit Cost (₹)** | Purchase price per item | Number Input | Decimal | 12 | Y | \> 0 | Editable |
| **Total Cost (₹)** | Cost of new quantity | Display | Numeric | NA | Y | Qty × Unit Cost | Auto |
| **Reason for New Purchase** | Justification | Text Area | Text | 500 | Y | Must explain requirement | Mandatory |

**Fields for Petrol, Oil etc(For Object Head \- 22 and Detail Head \- 009\)**

| Field Name | Description | UI Component | Type | Len | Mandatory | Rule | Remarks |
| :---- | :---- | :---- | :---- | :---- | :---- | :---- | :---- |
| **DDO Code** | Auto | Display | Text | 10 | Y | Read-only | — |
| **DDO Name** | Auto | Display | Text | 100 | Y | Read-only | — |
| **Type of Vehicle** | Car/Jeep/Two Wheeler | Dropdown | Enum | NA | Y | Must select | For fuel mapping |
| **Description** | Short usage/purpose description | Text Box | String | 300 | N | — | Auto-fetched |
| **Old Available Quantity** | No. of vehicles currently in use | Number | Int | 5 | Y | ≥ 0 | Backend editable |
| **Number of Employees Using Asset** | Persons authorized | Number | Int | 5 | N | ≥ 0 | Optional |
| **New Required Quantity** | Additional vehicles needing fuel | Number | Int | 5 | Y | ≥ 0 | — |
| **Monthly Fuel Cost (₹)** | Average monthly fuel expense | Number | Decimal | 12 | Y | \> 0 | Editable |
| **Yearly Total (₹)** | Auto \= Monthly Cost × 12 × Total Vehicles | Display | Numeric | NA | Y | System calculated | — |
| **Reason for Additional Requirement** | Justification | Text Area |   |   | Y | Mandatory | — |

**Fields for Purchase of Office Equipment (For Object Head \- 23 and Detail Head \- 001\)**

| Field Name | Description | UI Component | Field Type | Length | Mandatory (Y/N) | Validation Rule | Remarks |
| :---- | :---- | :---- | :---- | :---- | :---- | :---- | :---- |
| **DDO Code** | Unique code of DDO | Display Field | Text | 10 | Y | Read-only | Auto-fetched |
| **DDO Name** | Name of DDO | Display Field | Text | 100 | Y | Read-only | Auto-fetched |
| **Name of Office Equipment** | Printer, Scanner, UPS, etc. | Text Box | String | 200 | Y | No special chars | Editable |
| **Description** | Short usage/purpose description | Text Box | String | 300 | N | — | Auto-fetched |
| **Old Available Quantity** | Existing working equipment quantity | Number Input | Integer | 5 | Y | ≥ 0 | Fetched from backend; editable |
| **Number of Employees Using Asset** | Employees dependent on this equipment | Number Input | Integer | 5 | N | ≥ 0 | Optional |
| **New Required Quantity** | Additional equipment required | Number Input | Integer | 5 | Y | ≥ 0 | Must be non-negative |
| **Per Unit Cost (₹)** | Cost per equipment item | Number Input | Decimal | 12 | Y | \> 0 | Editable by DDO |
| **Total Cost (₹)** | Auto \= New Qty × Per Unit Cost | Display | Numeric | — | Y | Autocalculated | Read-only |
| **Reason for New Purchase** | Why new equipment is needed | Text Area | String | 500 | Y | Cannot be blank | Mandatory if New Qty \> 0 |

**Fields for IT Computer Purchase Capital (For Object Head \- 27 and Detail Head \- 001\)**

| Field Name | Description | UI Component | Field Type | Length | Mandatory | Validation Rule | Remarks |
| :---- | :---- | :---- | :---- | :---- | :---- | :---- | :---- |
| **DDO Code** | Auto-fetched DDO Code | Display | Text | 10 | Y | Read-only | From HRMS |
| **DDO Name** | Auto-fetched DDO Name | Display | Text | 100 | Y | Read-only | From HRMS |
| **IT Asset Type** | Desktop / Laptop / Printer / Scanner / Server | Dropdown | Enum | — | Y | Must select | Asset Master-driven |
| **Description** | Technical or usage description | Text Box | String | 300 | N | — | Auto-fetched |
| **Old Available Quantity** | Existing available IT assets | Number Input | Integer | 5 | Y | ≥ 0 | Backend value, editable |
| **Number of Employees Using Asset** | Users assigned asset | Number Input | Integer | 5 | N | ≥ 0 | Optional |
| **New Required Quantity** | New machines/devices required | Number Input | Integer | 5 | Y | ≥ 0 | DDO Entry |
| **Per Unit Cost (₹)** | Cost per device | Number Input | Decimal | 12 | Y | \> 0 | Editable |
| **Total Cost (₹)** | Auto \= Qty × Unit Cost | Display | Numeric | — | Y | Auto | Read-only |
| **Reason for New Purchase** | Business/technical justification | Text Area | String | 500 | Y | Cannot be blank | Mandatory when New Qty \> 0 |

**Fields for Transportation Service(For Object Head \- 31 and Detail Head \- 007\)**

| Field Name | Description | UI Component | Field Type | Length | Mandatory | Validation Rule | Remarks |
| :---- | :---- | :---- | :---- | :---- | :---- | :---- | :---- |
| **DDO Code** | DDO Identifier | Display | Text | 10 | Y | Read-only | Auto |
| **DDO Name** | DDO Name | Display | Text | 100 | Y | Read-only | Auto |
| **Type of Vehicle** | Sedan/SUV/Hatchback rental type | Dropdown | Enum | — | Y | Must select | Rental Master |
| **Description** | Purpose of vehicle (inspection, official visits) | Text Box | String | 300 | N | — | Auto-fetched |
| **Old Available Quantity** | No. of rental cars currently used | Number Input | Integer | 5 | Y | ≥ 0 | Backend data |
| **Number of Employees Using Asset** | Officers using rental car service | Number Input | Integer | 5 | N | ≥ 0 | Optional |
| **New Required Quantity** | No. of additional rental cars required | Number Input | Integer | 5 | Y | ≥ 0 | — |
| **Monthly Rental Charge (₹)** | Monthly cost per car | Number Input | Decimal | 12 | Y | \> 0 | Editable |
| **Yearly Total (₹)** | Auto \= (Old \+ New Qty) × Monthly Charge × 12 | Display | Numeric | — | Y | Auto | Read-only |
| **Reason for New Requirement** | Justification for additional rental cars | Text Area | String | 500 | Y | Cannot be blank | Required when New Qty \> 0 |

**Fields for Electricity(For Object Head \- 22 and Detail Head \- 005\)**

| Field Name | Description | UI Component | Field Type | Length | Mandatory (Y/N) | Validation Rule | Remarks |
| :---- | :---- | :---- | :---- | :---- | :---- | :---- | :---- |
| **DDO Code** | Unique identifier of the DDO | Display Field | Auto-Fetched | — | Y | Non-editable | From HRMS |
| **DDO Name** | Name of the DDO | Display Field | Auto-Fetched | — | Y | Non-editable | Retrieved from HRMS |
| **Description / Meter Purpose** | Short description of electricity usage (building/office) | Text Box | String | 200 | Y | No special characters | e.g., “Main Office Electricity” |
| **Actual Yearly Expenditure (₹)** | Total electricity amount spent in last FY | Numeric Input | Number | 15 | Y | Must be ≥ 0 | Can be fetched from AG/VLC; editable by DDO |
| **System Expected Expenditure (₹)** | 10% escalation applied by system | Display Field (Auto) | Numeric | — | Y | Auto \= Actual × 1.10 | Non-editable |
| **DDO Estimated Expenditure (₹)** | Amount proposed by DDO for next FY | Numeric Input | Number | 15 | Y | Must be ≥ Actual Expenditure | If \> system expected → justification required |
| **Reason for Higher Estimate** | Justification if estimate exceeds system’s escalated value | Text Area | String | 500 | Conditional | Mandatory when DDO Estimate \> System Expected | Example: “New AC units installed” |
| **Supporting Document** | Upload proof or note (optional) | File Upload | PDF/JPG | 10 MB | N | Valid formats | Optional unless required for justification |

