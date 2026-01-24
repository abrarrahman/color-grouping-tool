# Implementation Plan

## Overview
This plan outlines the complete implementation of the Color Grouping Tool to transform the current placeholder structure into a fully functional application.

## Prerequisites
- Project bootstrapped with React + Vite
- xlsx library installed
- Placeholder components and utilities created
- Git repository initialized and pushed to GitHub

## Phase 1: Excel Parser Utility
**File**: `src/utils/excelParser.js`

### Implementation Steps:
1. Import `read` function from 'xlsx' library
2. Create `parseExcel` function that accepts a File object
3. Use FileReader to read the file as ArrayBuffer
4. Parse the workbook using `read(file, {type: 'array'})`
5. Get the first sheet name using `workbook.SheetNames[0]`
6. Convert sheet to JSON using `utils.sheet_to_json(worksheet)`
7. Extract relevant data from rows (L*, a*, b* values and reel identifiers)
8. Return array of objects with structure: `{ id, reelNumber, L, a, b }`
9. Add error handling for invalid file format

### Expected Output:
```javascript
[
  { id: 1, reelNumber: "R001", L: 45.23, a: 12.45, b: 23.67 },
  { id: 2, reelNumber: "R002", L: 45.28, a: 12.42, b: 23.71 },
  // ... more color entries
]
```

---

## Phase 2: Color Grouper Utility
**File**: `src/utils/colorGrouper.js`

### Implementation Steps:
1. Create `groupColors` function accepting `colors` array and `tolerances` object
2. Tolerances object structure: `{ deltaL: 0.15, deltaA: 0.08, deltaB: 0.10 }`
3. Implement greedy clustering algorithm:
   - Start with first color as first group
   - For each remaining color, check if it fits in any existing group
   - A color fits in a group if:
     - `max(L_in_group) - min(L_in_group) + new_color_L <= deltaL`
     - `max(a_in_group) - min(a_in_group) + new_color_a <= deltaA`
     - `max(b_in_group) - min(b_in_group) + new_color_b <= deltaB`
   - If no group fits, create new group with this color
4. Return array of groups with structure: `[{ groupId, colors: [...] }]`
5. Add summary data to each group: min/max values for L, a, b

### Expected Output:
```javascript
[
  {
    groupId: 1,
    colors: [
      { id: 1, reelNumber: "R001", L: 45.23, a: 12.45, b: 23.67 },
      { id: 2, reelNumber: "R002", L: 45.28, a: 12.42, b: 23.71 }
    ],
    summary: {
      L: { min: 45.23, max: 45.28, range: 0.05 },
      a: { min: 12.42, max: 12.45, range: 0.03 },
      b: { min: 23.67, max: 23.71, range: 0.04 }
    }
  }
]
```

---

## Phase 3: Excel Exporter Utility
**File**: `src/utils/excelExporter.js`

### Implementation Steps:
1. Import `writeFile` and `utils` from 'xlsx' library
2. Create `exportToExcel` function accepting `groupedData` array
3. Create workbook structure with multiple sheets:
   - Sheet 1: Summary of all groups
   - Sheet 2+: Each group's detailed data
4. Format summary sheet with columns: Group ID, Reel Count, L range, a range, b range
5. For each group sheet, include all color data
6. Use `writeFile` to download the Excel file with name: `grouped_colors_[timestamp].xlsx`
7. Return true on success

---

## Phase 4: File Upload Component
**File**: `src/components/FileUpload.jsx`

### Implementation Steps:
1. Create file input element (accept=".xlsx, .xls")
2. Add styling for upload area (drag and drop support optional)
3. Create `handleFileChange` function:
   - Validate file is Excel format
   - Pass file to parent component via `onFileSelect` prop
4. Display selected file name
5. Add error message for invalid file types
6. Component props: `onFileSelect(file)`

### Props Interface:
```javascript
{
  onFileSelect: (file: File) => void
}
```

---

## Phase 5: Tolerance Controls Component
**File**: `src/components/ToleranceControls.jsx`

### Implementation Steps:
1. Create three number input fields:
   - ΔL* (default: 0.15, step: 0.01)
   - Δa* (default: 0.08, step: 0.01)
   - Δb* (default: 0.10, step: 0.01)
2. Add labels and units
3. Create `handleChange` function for each input
4. Pass current values to parent via `onToleranceChange` prop
5. Add validation (min: 0.01, max: 1.0)
6. Display current values
7. Component props: `tolerances`, `onToleranceChange`

### Props Interface:
```javascript
{
  tolerances: { deltaL: number, deltaA: number, deltaB: number },
  onToleranceChange: (tolerances: object) => void
}
```

---

## Phase 6: Results Table Component
**File**: `src/components/ResultsTable.jsx`

### Implementation Steps:
1. Accept `groupedData` prop
2. Display summary statistics (total groups, total colors)
3. Render table with expandable groups:
   - Each row represents a group
   - Show Group ID, Reel Count, Color Range summary
   - Expandable section shows individual reels within group
4. Implement expand/collapse functionality for each group
5. Add visual indicators for tolerance compliance (green/red)
6. Handle empty state (no data loaded)
7. Component props: `groupedData`

### Props Interface:
```javascript
{
  groupedData: Array<{
    groupId: number,
    colors: Array<{id, reelNumber, L, a, b}>,
    summary: { L, a, b }
  }>
}
```

---

## Phase 7: Export Button Component
**File**: `src/components/ExportButton.jsx`

### Implementation Steps:
1. Create button with "Export to Excel" text
2. Disable button when no grouped data available
3. Create `handleExport` function:
   - Call excelExporter utility
   - Handle errors
   - Show success message
4. Add loading state during export
5. Component props: `groupedData`, `onExport`

### Props Interface:
```javascript
{
  groupedData: array,
  onExport: () => void
}
```

---

## Phase 8: Main App Component Integration
**File**: `src/App.jsx`

### Implementation Steps:
1. Set up state management:
   - `parsedData` - array of parsed color objects
   - `tolerances` - object with default values `{ deltaL: 0.15, deltaA: 0.08, deltaB: 0.10 }`
   - `groupedData` - array of grouped results
   - `isFileLoaded` - boolean flag

2. Create handler functions:
   - `handleFileSelect(file)` - parse Excel file using excelParser
   - `handleToleranceChange(tolerances)` - update tolerances state
   - `handleGrouping()` - run colorGrouper when data or tolerances change
   - `handleExport()` - trigger export functionality

3. Implement `useEffect` to auto-run grouping when parsedData or tolerances change

4. Render layout:
   - Header with app title
   - FileUpload component
   - ToleranceControls component (visible after file loaded)
   - ResultsTable component (visible after grouping complete)
   - ExportButton component (visible after grouping complete)

5. Add basic styling with CSS modules or inline styles

6. Add error handling and loading states

---

## Phase 9: Styling
**File**: Update `src/index.css` and add `src/App.css`

### Implementation Steps:
1. Create clean, modern UI with consistent spacing
2. Style file upload area with drag/drop visual feedback
3. Style tolerance inputs with proper spacing
4. Style results table with:
   - Clear headers
   - Alternating row colors
   - Expandable sections
   - Responsive design
5. Style export button with hover states
6. Add mobile responsiveness
7. Ensure accessibility (proper labels, focus states)

---

## Phase 10: Testing & Validation

### Manual Testing Checklist:
1. Upload valid Excel file → data parsed correctly
2. Upload invalid file → error message displayed
3. Change tolerance values → groups recalculated
4. Verify grouping algorithm meets tolerance requirements
5. Export functionality generates valid Excel file
6. Verify exported Excel contains correct grouped data
7. Test edge cases (empty file, single row, very large datasets)
8. Test across different browsers

---

## Phase 11: Final Polish

### Tasks:
1. Add loading spinners for file parsing and grouping
2. Add success/error toast notifications
3. Improve error messages with helpful guidance
4. Add example file format documentation in README
5. Optimize performance for large datasets
6. Add keyboard navigation support
7. Test responsiveness on various screen sizes

---

## Technical Notes

### Excel File Format Expected:
- First row: headers (should contain L*, a*, b* columns)
- Subsequent rows: data with reel identifiers and color values
- Column names may vary but should map to L, a, b values

### Color Grouping Algorithm Notes:
- Uses greedy clustering approach
- Not guaranteed to be optimal but efficient for typical use cases
- Can be optimized later if needed
- Tolerances are inclusive (≤ specified values)

### State Management:
- Uses React hooks (useState, useEffect)
- No external state management library needed
- All state is local to App component

---

## Success Criteria
✅ Excel file can be uploaded and parsed
✅ Tolerance values can be adjusted
✅ Colors are grouped according to specified tolerances
✅ Groups are displayed in an organized table
✅ Grouped data can be exported to Excel
✅ UI is user-friendly and responsive
✅ Error handling is robust

---

## Order of Implementation
Execute phases in numerical order (1-11). Each phase builds upon previous phases. Testing should be performed after each phase to ensure correctness.
