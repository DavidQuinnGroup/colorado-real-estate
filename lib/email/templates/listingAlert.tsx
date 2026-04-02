export function ListingAlertEmail({
  price,
  beds,
  baths,
  sqft,
  address,
  image,
  url,
}: {
  price: number
  beds: number
  baths: number
  sqft: number
  address: string
  image: string
  url: string
}) {
  return `
  <html>
    <body style="margin:0;padding:0;background:#f6f6f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
      
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td align="center">

            <!-- Container -->
            <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;margin:20px 0;">

              <!-- HEADER -->
              <tr>
                <td style="padding:20px;text-align:center;font-weight:600;font-size:18px;">
                  David Quinn Group
                </td>
              </tr>

              <!-- IMAGE -->
              <tr>
                <td>
                  <img src="${image}" width="600" style="display:block;width:100%;height:auto;" />
                </td>
              </tr>

              <!-- CONTENT -->
              <tr>
                <td style="padding:20px;">

                  <!-- PRICE -->
                  <div style="font-size:28px;font-weight:700;margin-bottom:8px;">
                    $${price.toLocaleString()}
                  </div>

                  <!-- ADDRESS -->
                  <div style="font-size:16px;color:#555;margin-bottom:16px;">
                    ${address}
                  </div>

                  <!-- DETAILS -->
                  <div style="font-size:14px;color:#333;margin-bottom:20px;">
                    ${beds} beds • ${baths} baths • ${sqft.toLocaleString()} sqft
                  </div>

                  <!-- CTA -->
                  <a href="${url}" 
                     style="display:inline-block;padding:14px 20px;background:#000;color:#fff;text-decoration:none;border-radius:6px;font-weight:600;">
                    View Listing
                  </a>

                </td>
              </tr>

              <!-- FOOTER -->
              <tr>
                <td style="padding:20px;font-size:12px;color:#999;text-align:center;">
                  You’re receiving this because you saved a search on David Quinn Group.
                  <br/><br/>
                  <a href="{{unsubscribe_url}}" style="color:#999;">Unsubscribe</a>
                </td>
              </tr>

            </table>

          </td>
        </tr>
      </table>

    </body>
  </html>
  `
}