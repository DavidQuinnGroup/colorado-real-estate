export type UnsubscribeTokenRecord = {
  token: string;
  userId: string;
  searchId: string | null;
  usedAt: Date | string | null;
};

export type UnsubscribeTokenStatus = 'missing_or_malformed' | 'not_found' | 'already_used' | 'active';

export type UnsubscribeTokenClassification =
  | {
      status: 'missing_or_malformed' | 'not_found';
      token: null;
      statusCode: 400 | 404;
      title: string;
      message: string;
    }
  | {
      status: 'already_used' | 'active';
      token: string;
      statusCode: 200;
      title: string;
      message: string;
    };

const MIN_TOKEN_LENGTH = 16;
const MAX_TOKEN_LENGTH = 200;
const TOKEN_PATTERN = /^[A-Za-z0-9._~:-]+$/;

export function normalizeUnsubscribeToken(value: string | null | undefined) {
  const token = value?.trim();

  if (!token || token.length < MIN_TOKEN_LENGTH || token.length > MAX_TOKEN_LENGTH) return null;
  if (!TOKEN_PATTERN.test(token)) return null;

  return token;
}

export function classifyUnsubscribeToken(
  token: string | null,
  record: UnsubscribeTokenRecord | null,
): UnsubscribeTokenClassification {
  if (!token) {
    return {
      status: 'missing_or_malformed',
      token: null,
      statusCode: 400,
      title: 'Invalid Link',
      message:
        'This unsubscribe link is missing or incomplete. Please contact David Quinn Group if you need help adjusting email preferences.',
    };
  }

  if (!record) {
    return {
      status: 'not_found',
      token: null,
      statusCode: 404,
      title: 'Link Not Found',
      message:
        'This unsubscribe link is no longer available. Please contact David Quinn Group if you need help adjusting email preferences.',
    };
  }

  if (record.usedAt) {
    return {
      status: 'already_used',
      token,
      statusCode: 200,
      title: 'Already Unsubscribed',
      message: 'This unsubscribe request was already completed. No additional changes were made.',
    };
  }

  return {
    status: 'active',
    token,
    statusCode: 200,
    title: 'You Are Unsubscribed',
    message: record.searchId
      ? 'You will no longer receive alerts for this saved search.'
      : 'You will no longer receive David Quinn Group listing alerts.',
  };
}

// /Users/davidquinn/david-quinn-group/colorado-real-estate/lib/unsubscribe/safety.ts
