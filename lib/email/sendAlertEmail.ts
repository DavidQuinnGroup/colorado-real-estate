import { Resend } from 'resend';

type SendAlertEmailInput = {
  to: string;
  address: string;
  price: number;
  efficiencyScore: number;
  hoursSavedWeekly: number;
};

const resend = new Resend(process.env.RESEND_API_KEY);
const HIGH_ROI_THRESHOLD = 90;

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}

function buildHighRoiEmailHtml({ address, price, efficiencyScore, hoursSavedWeekly }: SendAlertEmailInput) {
  return `
    <div style="font-family: sans-serif; max-width: 600px; border: 1px solid #eee; padding: 20px;">
      <h2 style="color: #00ff80; text-transform: uppercase; font-style: italic;">Efficiency Match Identified</h2>
      <p>Hi,</p>
      <p>My Intelligence Engine has flagged a new listing that aligns with your North Star Anchors.</p>

      <div style="background: #000; color: #fff; padding: 20px; text-align: center;">
        <h3 style="margin: 0; font-size: 24px;">${efficiencyScore} Efficiency Score</h3>
        <p style="color: #00ff80; font-weight: bold; margin-top: 5px;">SAVING YOU ${hoursSavedWeekly} HOURS PER WEEK</p>
      </div>

      <p style="margin-top: 20px;"><strong>Asset:</strong> ${address}</p>
      <p><strong>Value:</strong> $${price.toLocaleString()}</p>

      <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />

      <p style="font-size: 12px; color: #666; font-style: italic;">
        By quantifying time, we make the home search about lifestyle fit, not only price and bedrooms.
      </p>

      <a href="#" style="display: inline-block; background: #000; color: #fff; padding: 12px 25px; text-decoration: none; font-weight: bold; margin-top: 10px;">
        VIEW STRATEGY ANALYSIS
      </a>
    </div>
  `;
}

export async function sendAlertEmail(input: SendAlertEmailInput) {
  if (input.efficiencyScore < HIGH_ROI_THRESHOLD) {
    console.log(`[Nurture Filter] Skipping alert for ${input.address}. Score ${input.efficiencyScore} below authority threshold.`);
    return;
  }

  try {
    const response = await resend.emails.send({
      from: 'David Quinn Group <alerts@davidquinnrealestate.com>',
      to: input.to,
      subject: `PERFECT FIT: ${input.address} (+${input.hoursSavedWeekly} Hours/Week)`,
      html: buildHighRoiEmailHtml(input),
    });

    console.log('High-ROI email sent:', response);
  } catch (error) {
    console.error('Nurture Engine Failed:', getErrorMessage(error));
    throw error;
  }
}

// /Users/davidquinn/david-quinn-group/colorado-real-estate/lib/email/sendAlertEmail.ts
