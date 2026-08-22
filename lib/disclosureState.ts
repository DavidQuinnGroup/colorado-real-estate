export type DisclosureState = 'collapsed' | 'expanded';

export function getDisclosureState(open: boolean): DisclosureState {
  return open ? 'expanded' : 'collapsed';
}
