import { GoogleSpreadsheet } from "google-spreadsheet";

export async function loadDoc() {
  const doc = new GoogleSpreadsheet('1eSsbQy6NzhIc7vD3U_GYC3OzZScJpIy7ToTDAqDP1ts');
  await doc.useServiceAccountAuth({
    client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_SHEETS_PRIVATE_KEY.replace(/\\n/g, "\n"),
  });

  await doc.loadInfo(); // loads document properties and worksheets

  return doc
}