import { loadDoc } from '../../utils/spreadsheets'

function getCellsValue(cells) {
  return cells.map(cell => cell.formattedValue)
}

async function getTotalsFromSheet(sheet) {
  await sheet.loadCells('H2:J2');
  const cells = await Promise.all([
    sheet.getCellByA1('H2'),
    sheet.getCellByA1('I2'),
    sheet.getCellByA1('J2')
  ])

  const [totalIncome, totalExpent, diff] = getCellsValue(cells)

  return { totalIncome, totalExpent, diff }
}

async function getSharedFromSheet(sheet) {
  await sheet.loadCells('F2:I2');
  const cells = await Promise.all([
    sheet.getCellByA1('F2'),
    sheet.getCellByA1('G2'),
    sheet.getCellByA1('H2'),
    sheet.getCellByA1('I2')
  ])

  const [leandroExpent, jazminExpent, debtor, debtAmmount] = getCellsValue(cells)

  return { leandroExpent, jazminExpent, debtor, debtAmmount }
}

export default async (__, response) => {
  try {
    const doc = await loadDoc()

    const leandroSheet = doc.sheetsByIndex[0]
    const jazminSheet = doc.sheetsByIndex[1]
    const sharedSheet = doc.sheetsByIndex[2]

    const [leandro, jazmin, shared] = await Promise.all([
      getTotalsFromSheet(leandroSheet),
      getTotalsFromSheet(jazminSheet),
      getSharedFromSheet(sharedSheet)
    ])

    return { leandro, jazmin, shared }
  } catch (e) {
    console.log(e)
    throw e
  }
}