import { NextResponse } from "next/server";
import { saveOrder } from "@/lib/sheets";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    await saveOrder({
      name: body.name,
      phone: body.phone,
      address: body.address,
      items: body.items,
      total: body.total,
      utr: body.utr,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to save order" }, { status: 500 });
  }
}