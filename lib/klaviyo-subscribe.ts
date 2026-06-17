export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

type KlaviyoConfig = {
  publicApiKey?: string;
  privateApiKey?: string;
  listId?: string;
};

const PRIVATE_API =
  "https://a.klaviyo.com/api/profile-subscription-bulk-create-jobs/";

export async function subscribeViaKlaviyoClient(
  email: string,
  publicApiKey: string,
  listId: string,
): Promise<void> {
  const response = await fetch(
    `https://a.klaviyo.com/client/subscriptions/?company_id=${encodeURIComponent(publicApiKey)}`,
    {
      method: "POST",
      headers: {
        Accept: "application/vnd.api+json",
        "Content-Type": "application/vnd.api+json",
        revision: "2026-01-15",
      },
      body: JSON.stringify({
        data: {
          type: "subscription",
          attributes: {
            custom_source: "Riva Fitness Waitlist",
            profile: {
              data: {
                type: "profile",
                attributes: {
                  email,
                  subscriptions: {
                    email: {
                      marketing: {
                        consent: "SUBSCRIBED",
                      },
                    },
                  },
                },
              },
            },
          },
          relationships: {
            list: {
              data: {
                type: "list",
                id: listId,
              },
            },
          },
        },
      }),
    },
  );

  if (!response.ok) {
    const detail = await response.text();
    console.error("Klaviyo client error:", response.status, detail);
    throw new Error(`Klaviyo client error ${response.status}: ${detail}`);
  }
}

async function subscribeViaKlaviyoPrivate(
  email: string,
  privateApiKey: string,
  listId: string,
): Promise<void> {
  const response = await fetch(PRIVATE_API, {
    method: "POST",
    headers: {
      Authorization: `Klaviyo-API-Key ${privateApiKey}`,
      "Content-Type": "application/json",
      revision: "2024-10-15",
    },
    body: JSON.stringify({
      data: {
        type: "profile-subscription-bulk-create-job",
        attributes: {
          custom_source: "Riva Fitness Waitlist",
          profiles: {
            data: [
              {
                type: "profile",
                attributes: {
                  email,
                  subscriptions: {
                    email: {
                      marketing: {
                        consent: "SUBSCRIBED",
                      },
                    },
                  },
                },
              },
            ],
          },
        },
        relationships: {
          list: {
            data: {
              type: "list",
              id: listId,
            },
          },
        },
      },
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    console.error("Klaviyo private error:", response.status, detail);
    throw new Error(`Klaviyo private error ${response.status}: ${detail}`);
  }
}

export async function subscribeToWaitlist(
  email: string,
  config: KlaviyoConfig,
): Promise<void> {
  const listId = config.listId?.trim();
  if (!listId) {
    throw new Error("KLAVIYO_LIST_ID is not configured");
  }

  const publicKey = config.publicApiKey?.trim();
  const privateKey = config.privateApiKey?.trim();

  if (privateKey) {
    try {
      await subscribeViaKlaviyoPrivate(email, privateKey, listId);
      return;
    } catch (error) {
      if (!publicKey) throw error;
      console.warn("Klaviyo private key failed, falling back to public key:", error);
    }
  }

  if (publicKey) {
    await subscribeViaKlaviyoClient(email, publicKey, listId);
    return;
  }

  throw new Error(
    "Set KLAVIYO_PUBLIC_API_KEY or KLAVIYO_PRIVATE_API_KEY in Vercel",
  );
}
