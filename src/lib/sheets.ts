import { google } from 'googleapis';

function getAuth() {
  return new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
}

export async function getProducts() {
  const auth = getAuth();
  const sheets = google.sheets({ version: 'v4', auth });

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.GOOGLE_SHEET_ID!,
    range: 'Products!A2:H',
  });

  const rows = res.data.values || [];

  return rows.map((row, index) => ({
    id: row[0] || String(index + 1),
    title: row[1] || '',
    price: Number(row[2]) || 0,
    srcUrl: row[3] || '/images/placeholder.png',
    gallery: row[4] ? row[4].split(',').map((s: string) => s.trim()) : [],
    rating: Number(row[5]) || 0,
    discount: {
      percentage: Number(row[6]) || 0,
      amount: 0,
    },
    description: row[7] || '',
  }));
}

export async function saveOrder(order: {
  name: string;
  phone: string;
  address: string;
  items: any[];
  total: number;
  utr: string;
}) {
  const auth = getAuth();
  const sheets = google.sheets({ version: 'v4', auth });

  await sheets.spreadsheets.values.append({
    spreadsheetId: process.env.GOOGLE_SHEET_ID!,
    range: 'Orders!A:G',
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [[
        new Date().toISOString(),
        order.name,
        order.phone,
        order.address,
        JSON.stringify(order.items),
        order.total,
        order.utr,
      ]],
    },
  });

  return { ok: true };
} 

export async function getOrders() {
  const auth = getAuth();
  const sheets = google.sheets({ version: 'v4', auth });

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.GOOGLE_SHEET_ID!,
    range: 'Orders!A2:G', // A se G tak data uthayega
  });

  const rows = res.data.values || [];

  // Data ko object format mein convert karo
  return rows.map((row, index) => ({
    id: index + 1,
    date: row[0] || '',
    name: row[1] || '',
    phone: row[2] || '',
    address: row[3] || '',
    items: row[4] || '[]',
    total: row[5] || '0',
    utr: row[6] || '',
  }));
}

export async function getProductById(id: string) {
  const products = await getProducts();
  const product = products.find((p) => String(p.id) === String(id));
  
  if (!product) {
    return null;
  }
  return product;
}