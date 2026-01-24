import { writeFile, utils } from 'xlsx'

export const exportToExcel = (groupedData) => {
  try {
    if (!groupedData || groupedData.length === 0) {
      throw new Error('No grouped data to export')
    }

    const workbook = utils.book_new()

    const summaryData = groupedData.map(group => ({
      'Group ID': group.groupId,
      'Reel Count': group.colors.length,
      'L* Range (min-max)': `${group.summary.L.min} - ${group.summary.L.max}`,
      'a* Range (min-max)': `${group.summary.a.min} - ${group.summary.a.max}`,
      'b* Range (min-max)': `${group.summary.b.min} - ${group.summary.b.max}`
    }))

    const summarySheet = utils.json_to_sheet(summaryData)
    utils.book_append_sheet(workbook, summarySheet, 'Summary')

    for (const group of groupedData) {
      const groupData = group.colors.map(color => ({
        'Fabric Roll Number': color.reelNumber,
        'L*': color.L,
        'a*': color.a,
        'b*': color.b
      }))

      const groupSheet = utils.json_to_sheet(groupData)
      utils.book_append_sheet(workbook, groupSheet, `Group ${group.groupId}`)
    }

    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')
    const hours = String(now.getHours()).padStart(2, '0')
    const minutes = String(now.getMinutes()).padStart(2, '0')
    const seconds = String(now.getSeconds()).padStart(2, '0')
    const timestamp = `${year}${month}${day}_${hours}${minutes}${seconds}`

    const fileName = `grouped_colors_${timestamp}.xlsx`
    writeFile(workbook, fileName)

    return true
  } catch (error) {
    throw new Error(`Failed to export to Excel: ${error.message}`)
  }
}
