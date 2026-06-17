#!/usr/bin/env node
/**
 * Create "Riva Fitness Waitlist" on the same Klaviyo account as Jarvis.
 * Requires KLAVIYO_PRIVATE_API_KEY (lists:write).
 *
 * Usage:
 *   KLAVIYO_PRIVATE_API_KEY=pk_... node scripts/create-klaviyo-list.mjs
 */

const privateKey = process.env.KLAVIYO_PRIVATE_API_KEY?.trim();
if (!privateKey) {
  console.error("Missing KLAVIYO_PRIVATE_API_KEY");
  process.exit(1);
}

const headers = {
  Authorization: `Klaviyo-API-Key ${privateKey}`,
  Accept: "application/vnd.api+json",
  "Content-Type": "application/vnd.api+json",
  revision: "2024-10-15",
};

async function api(path, init) {
  const res = await fetch(`https://a.klaviyo.com/api${path}`, {
    ...init,
    headers: { ...headers, ...(init?.headers ?? {}) },
  });
  const text = await res.text();
  if (!res.ok) {
    throw new Error(`${res.status} ${path}: ${text}`);
  }
  return text ? JSON.parse(text) : null;
}

async function main() {
  const existing = await api("/lists/");
  const found = (existing?.data ?? []).find(
    (row) =>
      row.attributes?.name?.toLowerCase() === "riva fitness waitlist".toLowerCase(),
  );

  let listId = found?.id;
  if (listId) {
    console.log(`List already exists: ${listId}`);
  } else {
    const created = await api("/lists/", {
      method: "POST",
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
    listId = created.data.id;
    console.log(`Created list: ${listId}`);
  }

  let publicApiKey = process.env.KLAVIYO_PUBLIC_API_KEY?.trim() ?? "";
  if (!publicApiKey) {
    try {
      const accounts = await api("/accounts/");
      const account = accounts?.data?.[0];
      publicApiKey =
        account?.attributes?.contact_information?.website ??
        account?.attributes?.public_api_key ??
        "";
    } catch {
      /* accounts endpoint shape varies */
    }
  }

  console.log(JSON.stringify({ listId, publicApiKey }, null, 2));
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
