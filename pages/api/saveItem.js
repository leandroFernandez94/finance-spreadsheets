import { GoogleSpreadsheet } from 'google-spreadsheet'

function getSpreadSheetIndexByName(name, shared) {
  if (shared) return 2
  switch (name) {
    case 'leandro':
      return 0
    case 'jazmin':
      return 1
  }
}

export default async (req, res) => {
  const data = JSON.parse(req.body)

  const doc = new GoogleSpreadsheet('1eSsbQy6NzhIc7vD3U_GYC3OzZScJpIy7ToTDAqDP1ts');
  await doc.useServiceAccountAuth({
    client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_SHEETS_PRIVATE_KEY.replace(/(\\r)|(\\n)/g, '\n'),
  });

  await doc.loadInfo(); // loads document properties and worksheets

  const index = getSpreadSheetIndexByName(data.name, data.shared)
  const sheet = doc.sheetsByIndex[index]

  if (index === 2) {
    sheet.addRow({
      'quien gasto': data.name,
      descripcion: data.description,
      valor: data.value
    })
    return
  }

  if (data.type === 'entry') {
    sheet.addRow({
      ingreso: data.description,
      'valor ingreso': data.value
    })
  } else {
    sheet.addRow({
      gasto: data.description,
      'valor gasto': data.value
    })
  }

  res.status(200).json({ text: 'Hello' })
}