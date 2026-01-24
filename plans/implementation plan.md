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
7. Extract relevant data from rows matching these column names (exact match first, then variations):
   - Primary column name: 'Fabric Roll Number' → maps to `reelNumber`
   - Primary column name: 'L* ' (with trailing space) → maps to `L`
   - Primary column name: 'a* ' (with trailing space) → maps to `a`
   - Primary column name: 'b* ' (with trailing space) → maps to `b`
   - If primary names not found, try variations: trim whitespace, convert to lowercase, remove asterisks
8. Return array of objects with structure: `{ id, reelNumber, L, a, b }`
   - `id`: auto-incrementing integer starting from 1
   - `reelNumber`: string from 'Fabric Roll Number' column
   - `L`: number from L* column
   - `a`: number from a* column
   - `b`: number from b* column
9. Add error handling for invalid file format, missing columns, or invalid numeric values

### Expected Output:
```javascript
[
  { id: 1, reelNumber: "25A010788", L: 20.62, a: 0.17, b: -13.68 },
  { id: 2, reelNumber: "25A010871", L: 21.08, a: 0.22, b: -14.13 },
  { id: 3, reelNumber: "25A010872", L: 20.66, a: 0.32, b: -13.81 },
  // ... more color entries
]
```

### Testing Instructions:
After completing Phase 1, add this code to main.jsx temporarily to test:
```javascript
import { parseExcel } from './utils/excelParser.js'

// Test with the actual Excel file
const testExcelFile = new File([''], 'test.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
// Or upload the file through the UI when Phase 4 is complete

// In browser console after implementation:
const fileInput = document.querySelector('input[type="file"]')
fileInput.files[0].then(file => {
  parseExcel(file).then(data => {
    console.log('Parsed data:', data)
    console.log('Total rows:', data.length)
    console.log('First row:', data[0])
  })
})
```

---

## Phase 2: Color Grouper Utility
**File**: `src/utils/colorGrouper.js`

### Implementation Steps:
1. Create `groupColors` function accepting `colors` array and `tolerances` object
2. Tolerances object structure: `{ deltaL: 0.15, deltaA: 0.08, deltaB: 0.10 }`
3. Implement greedy clustering algorithm:
   - Start with first color as first group, initialize its min/max values
   - For each remaining color, check if it fits in any existing group
   - A color fits in a group if adding it keeps all three dimensions within tolerance:
     - Calculate new potential range for L: `Math.max(group.max.L, newColor.L) - Math.min(group.min.L, newColor.L) <= deltaL`
     - Calculate new potential range for a: `Math.max(group.max.a, newColor.a) - Math.min(group.min.a, newColor.a) <= deltaA`
     - Calculate new potential range for b: `Math.max(group.max.b, newColor.b) - Math.min(group.min.b, newColor.b) <= deltaB`
   - If no group fits, create new group with this color as its first member
   - Maintain min/max values for each group in L, a, b dimensions
4. Return array of groups with structure: `[{ groupId, colors: [...] }]`
5. Add summary data to each group: min/max values for L, a, b

### Expected Output:
```javascript
[
  {
    groupId: 1,
    colors: [
      { id: 1, reelNumber: "25A010788", L: 20.62, a: 0.17, b: -13.68 },
      { id: 2, reelNumber: "25A010871", L: 21.08, a: 0.22, b: -14.13 }
    ],
    summary: {
      L: { min: 20.62, max: 21.08, range: 0.46 },
      a: { min: 0.17, max: 0.22, range: 0.05 },
      b: { min: -14.13, max: -13.68, range: 0.45 }
    }
  }
]
```

### Testing Instructions:
After completing Phase 2, add this code to main.jsx temporarily to test:
```javascript
import { groupColors } from './utils/colorGrouper.js'

// Test with sample data
const testColors = [
  { id: 1, reelNumber: "25A010788", L: 20.62, a: 0.17, b: -13.68 },
  { id: 2, reelNumber: "25A010871", L: 20.70, a: 0.20, b: -13.80 },
  { id: 3, reelNumber: "25A010872", L: 25.00, a: 0.25, b: -13.90 },
]

const tolerances = { deltaL: 0.15, deltaA: 0.08, deltaB: 0.10 }
const grouped = groupColors(testColors, tolerances)

console.log('Grouped data:', grouped)
console.log('Number of groups:', grouped.length)
console.log('Group 1 summary:', grouped[0]?.summary)
```

---

## Phase 3: Excel Exporter Utility
**File**: `src/utils/excelExporter.js`

### Implementation Steps:
1. Import `writeFile` and `utils` from 'xlsx' library
2. Create `exportToExcel` function accepting `groupedData` array
3. Create workbook using `utils.book_new()`
4. Create summary sheet:
   - Headers: "Group ID", "Reel Count", "L* Range (min-max)", "a* Range (min-max)", "b* Range (min-max)"
   - One row per group with summary data
   - Add to workbook as first sheet named "Summary"
5. For each group in groupedData:
   - Create sheet with columns: "Fabric Roll Number", "L*", "a*", "b*"
   - One row per reel in the group
   - Add to workbook with sheet name "Group X" where X is group ID
6. Use `writeFile` to download the Excel file with name: `grouped_colors_[timestamp].xlsx`
   - Timestamp format: YYYYMMDD_HHMMSS (e.g., 20260124_120000)
7. Return true on success, throw error on failure

### Testing Instructions:
After completing Phase 3, add this code to main.jsx temporarily to test:
```javascript
import { exportToExcel } from './utils/excelExporter.js'

// Test with sample grouped data
const testGroupedData = [
  {
    groupId: 1,
    colors: [
      { id: 1, reelNumber: "25A010788", L: 20.62, a: 0.17, b: -13.68 },
      { id: 2, reelNumber: "25A010871", L: 20.70, a: 0.20, b: -13.80 }
    ],
    summary: {
      L: { min: 20.62, max: 20.70, range: 0.08 },
      a: { min: 0.17, max: 0.20, range: 0.03 },
      b: { min: -13.80, max: -13.68, range: 0.12 }
    }
  }
]

exportToExcel(testGroupedData)
console.log('Export function called - check downloads for Excel file')
```

---

## Phase 4: File Upload Component
**File**: `src/components/FileUpload.jsx`

### Implementation Steps:
1. Create file input element (accept=".xlsx, .xls")
2. Create drop zone area for drag and drop support with visual feedback
3. Create `handleFileChange` function:
   - Validate file extension is .xlsx or .xls
   - Validate file size ≤ 10MB
   - If valid, pass file to parent component via `onFileSelect` prop
   - If invalid extension: display error message "Please upload a valid Excel file (.xlsx or .xls)"
   - If invalid size: display error message "File size exceeds 10MB limit"
4. Display selected file name after file is uploaded
5. Display "Clear" button when file is loaded to remove current file
6. Display error messages above the upload area
7. Component props: `onFileSelect(file)`, `onClear()`, `fileName`, `error`

---

## Phase 5: Tolerance Controls Component
**File**: `src/components/ToleranceControls.jsx`

### Implementation Steps:
1. Create three number input fields with labels:
   - Label: "L* Tolerance", default: 0.15, step: 0.01
   - Label: "a* Tolerance", default: 0.08, step: 0.01
   - Label: "b* Tolerance", default: 0.10, step: 0.01
2. Add labels with the delta symbol (Δ) before each dimension: "ΔL*", "Δa*", "Δb*"
3. Create `handleChange` function for each input that updates the specific tolerance value
4. Pass current values to parent via `onToleranceChange` prop with updated tolerances object
5. Add validation: minimum value 0.01, maximum value 1.0
6. Display current tolerance values next to each input field
7. Component props: `tolerances` (object with deltaL, deltaA, deltaB), `onToleranceChange` (function)

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
2. Display summary statistics header: "Total Groups: X, Total Reels: Y"
3. Render table with these columns for each group row:
   - Group ID
   - Reel Count
   - L* Range (display as "min - max (range)")
   - a* Range (display as "min - max (range)")
   - b* Range (display as "min - max (range)")
   - Expand/Collapse toggle button
4. Implement expand/collapse functionality for each group
5. When expanded, show nested table within group row with columns:
   - Reel Number
   - L* value
   - a* value
   - b* value
6. Handle empty state: display "No data loaded. Please upload an Excel file to begin."
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
1. Create button with text "Export to Excel"
2. Disable button (greyed out) when groupedData is empty or undefined
3. Create `handleExport` function:
   - Call excelExporter utility with groupedData
   - On success: display success message "Excel file exported successfully!"
   - On error: display error message "Export failed. Please try again."
4. Add loading state: change button text to "Exporting..." during export
5. Component props: `groupedData` (array), `onExport` (function)

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
1. Set up state management using useState:
   - `parsedData` - array of parsed color objects, initial: []
   - `tolerances` - object with default values `{ deltaL: 0.15, deltaA: 0.08, deltaB: 0.10 }`
   - `groupedData` - array of grouped results, initial: []
   - `isFileLoaded` - boolean flag, initial: false
   - `error` - string for error messages, initial: null
   - `isLoading` - boolean for loading states, initial: false

2. Create handler functions:
   - `handleFileSelect(file)`: set isLoading=true, parse Excel file using excelParser, set parsedData and isFileLoaded=true, set isLoading=false, handle errors
   - `handleToleranceChange(updatedTolerances)`: update tolerances state with new values
   - `handleGrouping()`: call colorGrouper with parsedData and tolerances, set groupedData
   - `handleExport()`: call excelExporter with groupedData, handle errors

3. Implement `useEffect` to auto-run grouping when parsedData or tolerances change
   - Depend on parsedData and tolerances

4. Render layout in this order:
   - Header with "Color Grouping Tool" title
   - Error message display (if error exists)
   - FileUpload component (always visible)
   - ToleranceControls component (visible only when isFileLoaded is true)
   - ResultsTable component (visible only when groupedData has items)
   - ExportButton component (visible only when groupedData has items)

5. Use inline styles for spacing and layout:
   - Container: padding: 20px, maxWidth: 1200px
   - Header: marginBottom: 30px, fontSize: 28px
   - Section spacing: marginBottom: 30px between components
   - Error message: color: red, backgroundColor: #fee, padding: 10px, marginBottom: 20px

6. Error handling:
   - Set error state when file parsing fails: "Failed to parse Excel file. Please check the file format."
   - Set error state when grouping fails: "Error grouping colors. Please try again."
   - Clear error state on new file upload
   - Display error messages at top of component

7. Loading states:
   - Show "Processing file..." during file parsing
   - Show "Grouping colors..." during grouping

8. Reset functionality:
   - Add "Clear Data" button visible when isFileLoaded is true
   - Handle reset: set parsedData=[], groupedData=[], isFileLoaded=false, tolerances reset to defaults
   - Button style: background color #f44336, white text, padding 10px 20px

9. Large file handling:
   - Add file size validation: maximum 10MB
   - Display error if file exceeds size: "File size exceeds 10MB limit. Please upload a smaller file."
    - Implement loading indicator for files >1000 rows: "Processing large file, please wait..."

---

## Phase 9: Styling
**File**: Update `src/index.css` and add `src/App.css`

### Implementation Steps:
1. Create clean, modern UI in src/App.css with:
   - Font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif
   - Consistent spacing: 16px between elements, 24px between sections
   - Background color: #f5f5f5 for page, #ffffff for cards

2. Style file upload area:
   - Border: 2px dashed #cccccc
   - Padding: 40px
   - Background color: #fafafa
   - Hover state: border color #4CAF50, background color #e8f5e9
   - Active/drag state: border color #4CAF50, background color #c8e6c9

3. Style tolerance inputs:
   - Input width: 100px
   - Label font-weight: bold
   - Input spacing: 20px between fields
   - Input padding: 8px
   - Border: 1px solid #ccc
   - Focus state: border color #4CAF50, outline none

4. Style results table:
   - Headers: background color #f0f0f0, font-weight bold, padding 12px
   - Rows: padding 10px
   - Alternating row colors: even rows #ffffff, odd rows #f9f9f9
   - Expandable sections: padding-left 20px, background color #fafafa
   - Border: 1px solid #ddd on all cells

5. Style export button:
   - Background color: #4CAF50
   - Text color: white
   - Padding: 12px 24px
   - Border: none
   - Border-radius: 4px
   - Font-size: 16px
   - Hover state: background color #45a049
   - Disabled state: background color #cccccc, cursor not-allowed
   - Loading state: show spinner icon

6. Add mobile responsiveness:
   - Media query at 768px: stack input fields vertically
   - Table: enable horizontal scroll on mobile
   - Button: width 100% on mobile

7. Ensure accessibility:
   - All inputs have associated labels with for/id attributes
   - Focus states visible on all interactive elements
    - Color contrast ratios meet WCAG AA standards

---

## Phase 10: Documentation & README
**File**: Update `README.md`

### Implementation Steps:
1. Add project description: "A tool for grouping color reels based on L*a*b* color space tolerances"
2. Add installation instructions: `npm install`
3. Add usage instructions: `npm run dev`
4. Add Excel file format specification with example columns
5. Add tolerance explanation with default values
6. Add deployment instructions for GitHub Pages (gh-pages package)
7. Add example screenshot or description of UI

## Technical Notes

### Excel File Format Expected:
- First row: headers with specific column names
- Expected columns:
  - 'Fabric Roll Number' (or variations) - reel identifier
  - 'L* ' (with trailing space) - L* lightness value
  - 'a* ' (with trailing space) - a* value (red-green axis)
  - 'b* ' (with trailing space) - b* value (yellow-blue axis)
- Subsequent rows: data with fabric roll numbers and color values
- Handle column name variations (trailing spaces, case insensitive)
- Sheet name may vary (e.g., '7113325 Taper Report') - use first sheet
- Sample data: Fabric Roll Number='25A010788', L*=20.62, a*=0.17, b*=-13.68

### Color Grouping Algorithm Notes:
- Uses greedy clustering approach: first-fit algorithm
- Time complexity: O(n * g) where n is number of colors and g is number of groups
- Tolerances are inclusive (≤ specified values)
- Groups are created to minimize total number while maintaining tolerance constraints

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
Execute phases in numerical order (1-10). Each phase builds upon previous phases.

**Testing Requirements:**
- Phases 1-3: Use console.log testing as specified in each phase
- Phases 4-9: Test in browser by running `npm run dev` after each phase
- Each phase must be tested and verified before moving to the next phase
