import { NextResponse } from "next/server";
// 1. Naye version ke hisaab se import badlein, init aur type import karein
import init, { upiqrcode } from "upiqrcode";

export async function POST(req: Request) {
  try {
    const { amount } = await req.json();

    // 2. Sabse pehle init() ko call karein (WASM load karne ke liye)
    await init();

    // 3. UPI ID aur parameters
    const MY_UPI_ID = "your_upi_id@okaxis"; 

    // 4. Naye version mein parameters string type ke hain
    const result = await upiqrcode({
      payeeVPA: MY_UPI_ID,
      payeeName: "ReshamLibas",
      amount: amount.toFixed(2), // String type zaroori hai
      transactionNote: "Order Payment",
    });

    // 5. Return value mein 'qr' property hoti hai, lekin yeh SVG string hoti hai (base64 image nahi)
    return NextResponse.json({ qr: result.qr });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "QR generation failed" }, { status: 500 });
  }
}