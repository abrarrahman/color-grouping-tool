import { read, utils } from 'xlsx'

export const parseExcel = (file) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error('No file provided'))
      return
    }

    const reader = new FileReader()

    reader.onload = (e) => {
      try {
        const arrayBuffer = e.target.result
        const workbook = read(arrayBuffer, { type: 'array' })

        if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
          reject(new Error('No sheets found in workbook'))
          return
        }

        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]
        const jsonData = utils.sheet_to_json(worksheet)

        if (!jsonData || jsonData.length === 0) {
          reject(new Error('No data found in sheet'))
          return
        }

        const columns = Object.keys(jsonData[0])

        const findColumn = (primaryName) => {
          if (columns.includes(primaryName)) {
            return primaryName
          }

          const variations = columns.filter(col => {
            const trimmed = col.trim()
            const lower = trimmed.toLowerCase()
            const withoutAsterisk = lower.replace(/\*/g, '')
            
            const targetLower = primaryName.toLowerCase()
            const targetWithoutAsterisk = targetLower.replace(/\*/g, '')
            
            return trimmed === primaryName || 
                   lower === targetLower || 
                   withoutAsterisk === targetWithoutAsterisk ||
                   col.includes(primaryName.trim())
          })

          return variations.length > 0 ? variations[0] : null
        }

        const reelNumberCol = findColumn('Fabric Roll Number')
        const lCol = findColumn('L* ')
        const aCol = findColumn('a* ')
        const bCol = findColumn('b* ')

        if (!reelNumberCol) {
          reject(new Error('Column "Fabric Roll Number" not found'))
          return
        }

        if (!lCol) {
          reject(new Error('Column "L*" not found'))
          return
        }

        if (!aCol) {
          reject(new Error('Column "a*" not found'))
          return
        }

        if (!bCol) {
          reject(new Error('Column "b*" not found'))
          return
        }

        const result = []

        for (let i = 0; i < jsonData.length; i++) {
          const row = jsonData[i]
          const reelNumber = row[reelNumberCol]
          const lValue = parseFloat(row[lCol])
          const aValue = parseFloat(row[aCol])
          const bValue = parseFloat(row[bCol])

          if (isNaN(lValue)) {
            reject(new Error(`Invalid L* value in row ${i + 2}`))
            return
          }

          if (isNaN(aValue)) {
            reject(new Error(`Invalid a* value in row ${i + 2}`))
            return
          }

          if (isNaN(bValue)) {
            reject(new Error(`Invalid b* value in row ${i + 2}`))
            return
          }

          result.push({
            id: i + 1,
            reelNumber: String(reelNumber || ''),
            L: lValue,
            a: aValue,
            b: bValue
          })
        }

        resolve(result)
      } catch (error) {
        reject(new Error(`Failed to parse Excel file: ${error.message}`))
      }
    }

    reader.onerror = () => {
      reject(new Error('Failed to read file'))
    }

    reader.readAsArrayBuffer(file)
  })
}
