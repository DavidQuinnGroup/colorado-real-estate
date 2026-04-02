export function propertyAlertTemplate(data: {
  address: string
  price: number
  beds?: number
  baths?: number
  sqft?: number
  imageUrl?: string
  link?: string
}) {
  const {
    address,
    price,
    beds,
    baths,
    sqft,
    imageUrl,
    link,
  } = data

  const formattedPrice = `$${price.toLocaleString()}`

  return `
  <div style="margin:0;padding:0;background:#f4f4f4;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">

    <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
      <tr>
        <td align="center">

          <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:10px;overflow:hidden;">

            <!-- HERO IMAGE -->
            <tr>
              <td>
                <img src="${imageUrl || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c'}" 
                     style="width:100%;display:block;" />
              </td>
            </tr>

            <!-- CONTENT -->
            <tr>
              <td style="padding:30px;">

                <!-- BRAND -->
                <div style="font-size:11px;letter-spacing:2px;color:#888;margin-bottom:10px;">
                  DAVID QUINN GROUP
                </div>

                <!-- HEADLINE -->
                <div style="font-size:22px;font-weight:500;color:#111;margin-bottom:8px;">
                  New Opportunity in Boulder
                </div>

                <!-- ADDRESS -->
                <div style="font-size:16px;color:#444;margin-bottom:14px;">
                  ${address}
                </div>

                <!-- PRICE -->
                <div style="font-size:30px;font-weight:600;color:#000;margin-bottom:20px;">
                  ${formattedPrice}
                </div>

                <!-- DETAILS -->
                <div style="font-size:14px;color:#666;margin-bottom:28px;">
                  ${beds ? `${beds} Beds` : ""} 
                  ${baths ? ` • ${baths} Baths` : ""} 
                  ${sqft ? ` • ${sqft.toLocaleString()} Sq Ft` : ""}
                </div>

                <!-- CTA -->
                <a href="${link || '#'}"
                   style="display:inline-block;padding:14px 26px;background:#000;color:#fff;text-decoration:none;border-radius:4px;font-size:13px;letter-spacing:.5px;">
                  VIEW PROPERTY
                </a>

              </td>
            </tr>

            <!-- FOOTER -->
            <tr>
              <td style="padding:20px 30px;border-top:1px solid #eee;font-size:12px;color:#999;">
                You are receiving this because you requested property alerts.<br/>
                David Quinn Group • Boulder County Real Estate
              </td>
            </tr>

          </table>

        </td>
      </tr>
    </table>

  </div>
  `
}