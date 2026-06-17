import { NextResponse } from "next/server";

const KLAVIYO_LISTS_URL = "https://a.klaviyo.com/api/lists/";

export async function POST(request: Request) {
  const setupToken = process.env.SETUP_PROVISION_TOKEN;
  const auth = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");

  if (!setupToken?.trim() || auth !== setupToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { privateApiKey?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const privateKey =
    body.privateApiKey?.trim() || process.env.KLAVIYO_PRIVATE_API_KEY?.trim();
  if (!privateKey) {
    return NextResponse.json(
      { error: "Missing privateApiKey in body or KLAVIYO_PRIVATE_API_KEY env" },
      { status: 400 },
    );
  }

  const existing = await fetch(`${KLAVIYO_LISTS_URL}?filter=equals(name,"Riva Fitness Waitlist")`, {
    headers: {
      Authorization: `Klaviyo-API-Key ${privateKey}`,
      Accept: "application/vnd.api+json",
      revision: "2024-10-15",
    },
  });

  if (existing.ok) {
    const parsed = (await existing.json()) as {
      data?: Array<{ id: string; attributes?: { name?: string } }>;
    };
    const found = parsed.data?.find(
      (row) => row.attributes?.name?.toLowerCase() === "riva fitness waitlist",
    );
    if (found?.id) {
      return NextResponse.json({ listId: found.id, created: false });
    }
  }

  const create = await fetch(KLAVIYO_LISTS_URL, {
    method: "POST",
    headers: {
      Authorization: `Klaviyo-API-Key ${privateKey}`,
      Accept: "application/vnd.api+json",
      "Content-Type": "application/vnd.api+json",
      revision: "2024-10-15",
    },
    body: JSON.stringify({
      data: {
        type: "list",
        attributes: {
          name: "Riva Fitness Waitlist",
          opt_in_process: "single_opt_in",
        },
      },
    }),
  });

  const created = await create.json();
  if (!create.ok) {
    return NextResponse.json(
      { error: "Klaviyo list create failed", detail: created },
      { status: 502 },
    );
  }

  return NextResponse.json({
    listId: created.data?.id,
    created: true,
  });
}
