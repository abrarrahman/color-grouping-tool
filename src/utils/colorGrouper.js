export const groupColors = (colors, tolerances) => {
  if (!colors || colors.length === 0) {
    return []
  }

  const { deltaL, deltaA, deltaB } = tolerances

  const groups = []

  for (let i = 0; i < colors.length; i++) {
    const color = colors[i]
    let groupFound = false

    for (const group of groups) {
      const potentialMaxL = Math.max(group.max.L, color.L)
      const potentialMinL = Math.min(group.min.L, color.L)
      const potentialRangeL = potentialMaxL - potentialMinL

      const potentialMaxA = Math.max(group.max.a, color.a)
      const potentialMinA = Math.min(group.min.a, color.a)
      const potentialRangeA = potentialMaxA - potentialMinA

      const potentialMaxB = Math.max(group.max.b, color.b)
      const potentialMinB = Math.min(group.min.b, color.b)
      const potentialRangeB = potentialMaxB - potentialMinB

      if (potentialRangeL <= deltaL && 
          potentialRangeA <= deltaA && 
          potentialRangeB <= deltaB) {
        group.colors.push(color)
        group.max.L = potentialMaxL
        group.min.L = potentialMinL
        group.max.a = potentialMaxA
        group.min.a = potentialMinA
        group.max.b = potentialMaxB
        group.min.b = potentialMinB
        groupFound = true
        break
      }
    }

    if (!groupFound) {
      groups.push({
        groupId: groups.length + 1,
        colors: [color],
        min: {
          L: color.L,
          a: color.a,
          b: color.b
        },
        max: {
          L: color.L,
          a: color.a,
          b: color.b
        }
      })
    }
  }

  return groups.map(group => ({
    groupId: group.groupId,
    colors: group.colors,
    summary: {
      L: {
        min: group.min.L,
        max: group.max.L,
        range: group.max.L - group.min.L
      },
      a: {
        min: group.min.a,
        max: group.max.a,
        range: group.max.a - group.min.a
      },
      b: {
        min: group.min.b,
        max: group.max.b,
        range: group.max.b - group.min.b
      }
    }
  }))
}
