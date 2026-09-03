type ResolverResult = {
  resolution: string;
  reasons: readonly string[];
};

export function clientAuthorizationActionStatus(result?: ResolverResult, refreshError?: string) {
  const status = result ? `${result.resolution}: ${result.reasons.join(', ')}` : 'Synthetic authorization record updated.';
  return refreshError ? `${status}. Authorization history refresh failed: ${refreshError}` : status;
}
