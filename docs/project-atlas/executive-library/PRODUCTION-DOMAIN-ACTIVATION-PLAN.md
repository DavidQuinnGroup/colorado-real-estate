# PROJECT ATLAS - Production Domain Activation Plan

Generated: 2026-07-17  
Mode: owner-facing DNS and hosting action package only

## 1. Canonical Decision

Intended canonical URL:

- `https://davidquinngroup.com`

Intended alias:

- `https://www.davidquinngroup.com`

Recommended redirect direction:

- `www` -> root, unless verified production conventions require the reverse.

Reason:

- Local metadata and structured data use `https://davidquinngroup.com`.
- Alert, digest, unsubscribe, and tracking URL builders fall back to `https://davidquinngroup.com`.
- Click tracking allowlist already includes both root and `www`.

## 2. Current DNS State

Observed on 2026-07-17:

| Record | Result |
| --- | --- |
| `davidquinngroup.com` A | no observed answer |
| `davidquinngroup.com` AAAA | no observed answer |
| `www.davidquinngroup.com` A | no observed answer |
| `www.davidquinngroup.com` CNAME | no observed answer |
| `davidquinngroup.com` MX | no observed answer |
| `davidquinngroup.com` TXT | `"v=spf1 include:resend.com ~all"` |
| `davidquinngroup.com` NS | `dns1.registrar-servers.com`, `dns2.registrar-servers.com` |
| `davidquinngroup.com` SOA | `dns1.registrar-servers.com. hostmaster.registrar-servers.com.` |

Likely DNS provider:

- Registrar-hosted DNS using `registrar-servers.com` nameservers.

Do not remove or overwrite email-related TXT/MX/DKIM/DMARC records. The observed SPF TXT record must remain unless the email provider gives a replacement.

## 3. Production Hosting State

Verified locally:

- Vercel project name: `david-quinn-group-8rde`.
- Vercel project ID: `prj_Ry5WCDfamYUq1oO7t1CwCVwTvh4G`.
- Vercel org ID: `team_53Do8TFrDJHK8AJsziDVZyRQ`.

Not verified locally:

- Current Vercel deployment domain.
- Whether `davidquinngroup.com` is already added to the Vercel project.
- Whether `www.davidquinngroup.com` is already added to the Vercel project.
- Whether Vercel ownership verification is required.
- Exact Vercel DNS target values.

Exact DNS targets:

- `OWNER_MUST_COPY_FROM_VERCEL_DOMAIN_CONFIGURATION`.

## 4. Owner DNS Actions

Owner must open the registrar DNS management screen for `davidquinngroup.com`.

Required root record:

- Type: `A` or Vercel-specified root/apex record type.
- Host/name: `@` or blank, depending on registrar UI.
- Target/value: `OWNER_MUST_COPY_FROM_VERCEL_DOMAIN_CONFIGURATION`.
- TTL: automatic/default, or 300 seconds during activation if the registrar allows it.

Required www record:

- Type: `CNAME`, unless Vercel instructs otherwise.
- Host/name: `www`.
- Target/value: `OWNER_MUST_COPY_FROM_VERCEL_DOMAIN_CONFIGURATION`.
- TTL: automatic/default, or 300 seconds during activation if the registrar allows it.

Records to remove:

- Remove only conflicting root A/AAAA/CNAME records if Vercel identifies them as conflicts.
- Remove only conflicting `www` A/AAAA/CNAME records if Vercel identifies them as conflicts.

Records that must remain untouched:

- Existing SPF TXT: `"v=spf1 include:resend.com ~all"`.
- Any MX record if later present.
- Any DKIM TXT/CNAME records.
- Any DMARC TXT record.
- Any provider verification TXT records unless Vercel or the registrar explicitly says they are obsolete.

## 5. Vercel Actions

Owner must verify in Vercel:

- Project: `david-quinn-group-8rde`.
- Add domain: `davidquinngroup.com`.
- Add domain: `www.davidquinngroup.com`.
- Set primary/canonical domain to `davidquinngroup.com`.
- Configure redirect/alias so `www` resolves to root.
- Copy exact Vercel DNS target values into registrar DNS.
- Complete any ownership verification Vercel requires.
- Wait until Vercel shows domains as valid and SSL issued.

## 6. Application Configuration Requiring Later Codex Authorization

Do not change these in Wave 3F. After DNS ownership is proven, Codex can update or verify them with explicit authorization:

- Canonical application URL variable: `NEXT_PUBLIC_SITE_URL=https://davidquinngroup.com`.
- Public site URL variable: `PUBLIC_SITE_URL=https://davidquinngroup.com`.
- Authentication callback URL: no local auth callback route was verified; owner/Codex must confirm in hosting/provider settings if auth is added.
- Email tracking base URL: follows `NEXT_PUBLIC_SITE_URL || PUBLIC_SITE_URL || https://davidquinngroup.com`.
- Unsubscribe base URL: follows the same public base URL in alert/digest senders.
- Sitemap URL: no dedicated sitemap route was verified locally; add/verify only if production SEO requires it.
- Robots URL: no dedicated public robots route was verified locally; admin routes mark themselves noindex where applicable.
- Metadata canonical URL: currently hard-coded to `https://davidquinngroup.com` in multiple public routes/schema helpers.
- Production fallback constants: several helpers still fall back to `https://davidquinngroup.com`; changing the canonical domain later requires a code pass.

## 7. Deployment Sequence

1. Add `davidquinngroup.com` and `www.davidquinngroup.com` to Vercel.
2. Copy Vercel-provided DNS targets.
3. Apply DNS records at the registrar.
4. Preserve email DNS records.
5. Wait for DNS propagation.
6. Wait for Vercel domain verification and SSL issuance.
7. With later Codex authorization, update hosted env vars if needed.
8. Deploy after env changes.
9. Validate root and `www` redirects.
10. Validate application routes.
11. Validate email tracking with a new controlled internal test email.

## 8. Verification Commands

DNS:

```bash
dig davidquinngroup.com A +short
dig davidquinngroup.com AAAA +short
dig www.davidquinngroup.com CNAME +short
dig www.davidquinngroup.com A +short
dig davidquinngroup.com NS +short
dig davidquinngroup.com TXT +short
```

HTTPS and redirects:

```bash
curl -I https://davidquinngroup.com
curl -I https://www.davidquinngroup.com
curl -I https://davidquinngroup.com/search
```

Property route:

```bash
curl -I https://davidquinngroup.com/properties/OWNER_SELECT_SAFE_PUBLIC_PROPERTY_ID
```

Tracking route without exposing tokens:

```bash
curl -I "https://davidquinngroup.com/api/track-click?l=missing-user-safety-check&to=https%3A%2F%2Fdavidquinngroup.com%2Fsearch"
```

Sitemap/robots, if implemented:

```bash
curl -I https://davidquinngroup.com/sitemap.xml
curl -I https://davidquinngroup.com/robots.txt
```

Authentication callback configuration:

- Verify in the auth provider dashboard if an auth provider is active.
- No local auth callback route was verified in Wave 3F.

## 9. Rollback

If production-domain activation fails:

- Revert hosted environment variables to the prior values.
- Restore prior DNS records only where the new records caused the failure.
- Retain email DNS records.
- Disable public alert email if the tracking host is invalid.
- Do not run alert workers or recurring email while root/www DNS or SSL is invalid.

## 10. Responsibility Split

Owner must take:

- Registrar DNS changes.
- Vercel domain add/verification.
- Vercel-provided DNS target copying.
- Ownership verification.

Codex can take later, after authorization:

- Verify DNS/HTTPS/redirects.
- Update hosted environment variables if the user authorizes it.
- Deploy if the user authorizes it.
- Run a controlled production-domain tracked-link test if the user authorizes a new controlled email.

Requires later controlled test email:

- Production-domain alert email tracking.
- Production-domain unsubscribe URL.
- Production-domain click route redirect and persistence.

## Wave 4 Validation Update

Observed on 2026-07-17:

- Root DNS resolves to Vercel.
- Root HTTPS returns `HTTP/2 200`.
- `www` resolves through a Vercel CNAME.
- `www` HTTPS returns `HTTP/2 308` to `https://davidquinngroup.com/`.

Domain activation is ready at the DNS/SSL/redirect layer.

Production application activation is not certified:

- `/search` returned 404.
- `/api/search?limit=1` returned a Typesense DNS error.
- `/robots.txt` and `/sitemap.xml` returned 404.
- Vercel CLI credentials were invalid/unavailable, so hosted env and deployment correction could not be performed.
