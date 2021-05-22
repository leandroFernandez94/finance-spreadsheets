import { GoogleSpreadsheet } from 'google-spreadsheet'

const LEANDRO_INDEX = 0
const JAZMIN_INDEX = 1
const SHARED_INDEX = 2

const spreadsheetIndexByName = {
  leandro: LEANDRO_INDEX,
  jazmin: JAZMIN_INDEX,
  shared: SHARED_INDEX
}

export default async (req, res) => {
  const data = JSON.parse(req.body)
  try {
    const doc = new GoogleSpreadsheet('1eSsbQy6NzhIc7vD3U_GYC3OzZScJpIy7ToTDAqDP1ts');
    await doc.useServiceAccountAuth({
      client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_SHEETS_PRIVATE_KEY.replace(/\\n/g, "\n"),
    });

    await doc.loadInfo(); // loads document properties and worksheets

    const index = spreadsheetIndexByName[data.shared ? 'shared' : data.name]
    const sheet = doc.sheetsByIndex[index]

    if (index === SHARED_INDEX) {
      await sheet.addRow({
        'quien gasto': data.name,
        descripcion: data.description,
        valor: data.value
      })
      return
    }

    if (data.type === 'entry') {
      const newRow = {
        ingreso: data.description,
        'valor ingreso': data.value
      }
      console.log('saving row', newRow)
      await sheet.addRow(newRow)
    } else {
      await sheet.addRow({
        gasto: data.description,
        'valor gasto': data.value
      })
    }
  } catch (e) {
    console.log(e)
    throw (e)
  }

  res.status(200).json({ text: 'Hello' })
}