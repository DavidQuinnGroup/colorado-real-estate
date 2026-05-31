type SendAlertInput = {
  message: string;
  efficiencyScore?: number;
  isPrivate?: boolean;
};

type SlackTextObject = {
  type: 'mrkdwn';
  text: string;
};

type SlackBlock =
  | {
      type: 'section';
      text: SlackTextObject;
    }
  | {
      type: 'context';
      elements: SlackTextObject[];
    };

type SlackWebhookPayload = {
  text: string;
  blocks: SlackBlock[];
};

function getAlertLabel(isPrivate: boolean) {
  return isPrivate ? 'SHADOW INVENTORY' : 'MARKET MATCH';
}

function getGateStatus(isPrivate: boolean) {
  return isPrivate ? 'Locked' : 'Public';
}

function getScoreLabel(score: number | undefined) {
  return typeof score === 'number' ? String(score) : 'N/A';
}

function buildAlertPayload({ message, efficiencyScore, isPrivate = false }: SendAlertInput): SlackWebhookPayload {
  const alertLabel = getAlertLabel(isPrivate);
  const listingLabel = isPrivate ? 'Private Exclusive' : 'New Listing';

  return {
    text: `[REIE INTEL] ${alertLabel}: ${message}`,
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*${listingLabel} Intelligence Sync*\n${message}`,
        },
      },
      {
        type: 'context',
        elements: [
          {
            type: 'mrkdwn',
            text: `*Efficiency Score:* ${getScoreLabel(efficiencyScore)} | *Gate Status:* ${getGateStatus(isPrivate)}`,
          },
        ],
      },
    ],
  };
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}

export async function sendAlert(input: SendAlertInput) {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL;
  const payload = buildAlertPayload(input);

  console.log(`[DQG INTEL] Score: ${getScoreLabel(input.efficiencyScore)} | ${input.message}`);

  if (!webhookUrl) return;

  try {
    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    console.error('Internal alert synthesis failed:', getErrorMessage(error));
  }
}

// /Users/davidquinn/david-quinn-group/colorado-real-estate/lib/alerts/sendAlert.ts
