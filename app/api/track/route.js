import { google } from 'googleapis';

const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID;
const SHEET_NAME = 'Referrals';

async function appendToSheet(data) {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const sheets = google.sheets({ version: 'v4', auth });
  
  const date = new Date(data.timestamp).toISOString();
  
  await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: `${SHEET_NAME}!A:F`,
    valueInputOption: 'RAW',
    requestBody: {
      values: [[
        date,
        data.ref,
        data.mint,
        data.steps_completed.join(', '),
        data.steps_completed.length,
        data.event
      ]],
    },
  });
}

export async function POST(request) {
  try {
    const body = await request.json();
    
    const { event, ref, mint, timestamp, steps_completed } = body;
    
    if (!event || !mint || !timestamp) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    await appendToSheet({ event, ref, mint, timestamp, steps_completed });
    
    return Response.json({ success: true });
  } catch (error) {
    console.error('Tracking error:', error);
    return Response.json({ error: 'Internal error' }, { status: 500 });
  }
}