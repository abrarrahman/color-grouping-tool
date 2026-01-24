# Initial Requirements

## Overview
A tool for grouping and organizing colors.

## Color Grouping Requirements

The grouping must be done in such a way, so that in each group:

- The difference between the roll with the maximum value of L* and the roll with the minimum value of L* will be less than or equal to 0.15 (|ΔL*| ≤ 0.15).

- The difference between the roll with the maximum value of a* and the roll with the minimum value of a* will be less than or equal to 0.08 (|Δa*| ≤ 0.08).

- The difference between the roll with the maximum value of b* and the roll with the minimum value of b* will be less than or equal to 0.10 (|Δb*| ≤ 0.10).

## Future Tolerance Adjustments

After the code is complete, I would like to change the tolerance set for (|ΔL*| ≤ 0.15), (|Δa*| ≤ 0.08), & (|Δb*| ≤ 0.10) so that we can lower the number of groups, because the current tolerances for these three variables will result in over a 100 groups.

## Tech Stack

- **Frontend Framework**: React + Vite (Client-side application)
- **Build Tool**: Vite
- **Excel Processing**: xlsx (SheetJS) library
- **Deployment**: Static hosting (client-side only)

## Project Structure

```
src/
├── components/
│   ├── FileUpload.jsx       - Excel file input component
│   ├── ToleranceControls.jsx - Three input fields for ΔL*, Δa*, Δb*
│   ├── ResultsTable.jsx     - Display grouped data
│   └── ExportButton.jsx     - Download grouped results
├── utils/
│   ├── excelParser.js       - Parse Excel to extract color data
│   ├── colorGrouper.js      - Grouping algorithm
│   └── excelExporter.js     - Export grouped data
└── App.jsx                   - Main application component
```

## Core Workflow

1. Upload Excel file → Parse L*, a*, b* values
2. Adjust tolerance parameters (default: 0.15, 0.08, 0.10)
3. Run grouping algorithm
4. Display results in table
5. Export grouped Excel file

## Key Decisions

- **Input Types for Tolerances**: Number inputs (vs slider)
- **Table Layout**: To be determined (expandable groups vs flat list)
- **Default Tolerance Values**: 0.15 (L*), 0.08 (a*), 0.10 (b*)
