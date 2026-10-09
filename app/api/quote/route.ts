import { NextResponse } from "next/server";

const requiredFields = ["name", "phone", "item"] as const;

export async function POST(request: Request) {
  try {
    const body = await request.json();

    for (const field of requiredFields) {
      if (typeof body?.[field] !== "string" || !body[field].trim()) {
        return NextResponse.json({ ok: false, message: "Preencha os campos obrigatórios." }, { status: 400 });
      }
    }

    const record = {
      name: body.name.trim(),
      company: typeof body.company === "string" ? body.company.trim() || null : null,
      phone: body.phone.trim(),
      email: typeof body.email === "string" ? body.email.trim() || null : null,
      item: body.item.trim(),
      quantity: typeof body.quantity === "string" ? body.quantity.trim() || null : null,
      service_type: typeof body.serviceType === "string" ? body.serviceType.trim() || null : null,
      message: typeof body.message === "string" ? body.message.trim() || null : null
    };

    const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (supabaseUrl && serviceRoleKey) {
      const response = await fetch(`${supabaseUrl.replace(/\/$/, "")}/rest/v1/quote_requests`, {
        method: "POST",
        headers: {
          apikey: serviceRoleKey,
          Authorization: `Bearer ${serviceRoleKey}`,
          "Content-Type": "application/json",
          Prefer: "return=minimal"
        },
        body: JSON.stringify(record),
        cache: "no-store"
      });

      if (!response.ok) {
        return NextResponse.json({ ok: false, message: "Não foi possível salvar sua solicitação agora." }, { status: 502 });
      }

      return NextResponse.json({ ok: true, persisted: true });
    }

    return NextResponse.json({ ok: true, persisted: false });
  } catch {
    return NextResponse.json({ ok: false, message: "Não foi possível ler a solicitação." }, { status: 400 });
  }
}
