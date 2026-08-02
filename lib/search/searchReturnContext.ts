export const SEARCH_RETURN_SOURCE_PARAM = 'from';
export const SEARCH_RETURN_SOURCE_VALUE = 'search';
export const SEARCH_RETURN_PATH_PARAM = 'returnTo';
export const SEARCH_RETURN_SELECTED_PARAM = 'selected';
export const SEARCH_RETURN_VIEW_PARAM = 'view';

export const SEARCH_RETURN_ALLOWED_CRITERIA = [
  'q',
  'city',
  'minPrice',
  'maxPrice',
  'beds',
  'baths',
  'propertyType',
] as const;

export type SearchReturnView = 'list' | 'map';

export type SearchReturnContext = {
  source: typeof SEARCH_RETURN_SOURCE_VALUE;
  selectedPropertyId: string | null;
  view: SearchReturnView | null;
};

export type PropertySearchReturnContext = {
  returnTo: string;
};

type SearchParamsLike = URLSearchParams | Record<string, string | string[] | undefined>;

const MAX_RETURN_PATH_LENGTH = 900;
const MAX_SEARCH_VALUE_LENGTH = 120;
const PROPERTY_ID_PATTERN = /^[A-Za-z0-9._~-]{1,160}$/;

function firstValue(value: string | string[] | undefined) {
  if (Array.isArray(value)) return value[0] || null;
  return value || null;
}

function getParam(params: SearchParamsLike, key: string) {
  if (params instanceof URLSearchParams) return params.get(key);
  return firstValue(params[key]);
}

function isSafeParamValue(value: string) {
  if (!value || value.length > MAX_SEARCH_VALUE_LENGTH) return false;
  return !/[\u0000-\u001f\u007f]/.test(value);
}

function isSafePropertyId(value: string | null) {
  return Boolean(value && PROPERTY_ID_PATTERN.test(value));
}

export function isSearchReturnView(value: string | null): value is SearchReturnView {
  return value === 'list' || value === 'map';
}

export function buildSearchReturnPath(currentParams: URLSearchParams, selectedPropertyId: string, view: string | null) {
  const nextParams = new URLSearchParams();

  for (const key of SEARCH_RETURN_ALLOWED_CRITERIA) {
    const value = currentParams.get(key);
    if (value && isSafeParamValue(value)) nextParams.set(key, value);
  }

  nextParams.set(SEARCH_RETURN_SOURCE_PARAM, SEARCH_RETURN_SOURCE_VALUE);
  if (isSafePropertyId(selectedPropertyId)) nextParams.set(SEARCH_RETURN_SELECTED_PARAM, selectedPropertyId);
  if (isSearchReturnView(view)) nextParams.set(SEARCH_RETURN_VIEW_PARAM, view);

  return `/search?${nextParams.toString()}`;
}

export function isSafeSearchReturnPath(value: string | null): value is string {
  if (!value || value.length > MAX_RETURN_PATH_LENGTH) return false;
  if (!value.startsWith('/search')) return false;
  if (value.startsWith('//') || value.includes('://')) return false;

  let parsed: URL;
  try {
    parsed = new URL(value, 'https://davidquinngroup.com');
  } catch {
    return false;
  }

  if (parsed.pathname !== '/search') return false;

  for (const key of parsed.searchParams.keys()) {
    if (
      !SEARCH_RETURN_ALLOWED_CRITERIA.includes(key as (typeof SEARCH_RETURN_ALLOWED_CRITERIA)[number]) &&
      key !== SEARCH_RETURN_SOURCE_PARAM &&
      key !== SEARCH_RETURN_SELECTED_PARAM &&
      key !== SEARCH_RETURN_VIEW_PARAM
    ) {
      return false;
    }
  }

  const source = parsed.searchParams.get(SEARCH_RETURN_SOURCE_PARAM);
  if (source && source !== SEARCH_RETURN_SOURCE_VALUE) return false;

  const selected = parsed.searchParams.get(SEARCH_RETURN_SELECTED_PARAM);
  if (selected && !isSafePropertyId(selected)) return false;

  const view = parsed.searchParams.get(SEARCH_RETURN_VIEW_PARAM);
  if (view && !isSearchReturnView(view)) return false;

  for (const key of SEARCH_RETURN_ALLOWED_CRITERIA) {
    const value = parsed.searchParams.get(key);
    if (value && !isSafeParamValue(value)) return false;
  }

  return true;
}

export function buildPropertyHrefWithSearchReturn(propertyHref: string, searchReturnPath: string | null) {
  if (!isSafeSearchReturnPath(searchReturnPath)) return propertyHref;
  const safeReturnPath = searchReturnPath;

  const params = new URLSearchParams();
  params.set(SEARCH_RETURN_SOURCE_PARAM, SEARCH_RETURN_SOURCE_VALUE);
  params.set(SEARCH_RETURN_PATH_PARAM, safeReturnPath);

  return `${propertyHref}?${params.toString()}`;
}

export function parseSearchReturnContext(params: SearchParamsLike): SearchReturnContext | null {
  if (getParam(params, SEARCH_RETURN_SOURCE_PARAM) !== SEARCH_RETURN_SOURCE_VALUE) return null;

  const selected = getParam(params, SEARCH_RETURN_SELECTED_PARAM);
  const view = getParam(params, SEARCH_RETURN_VIEW_PARAM);

  return {
    source: SEARCH_RETURN_SOURCE_VALUE,
    selectedPropertyId: isSafePropertyId(selected) ? selected : null,
    view: isSearchReturnView(view) ? view : null,
  };
}

export function parsePropertySearchReturnContext(params: SearchParamsLike): PropertySearchReturnContext | null {
  if (getParam(params, SEARCH_RETURN_SOURCE_PARAM) !== SEARCH_RETURN_SOURCE_VALUE) return null;

  const returnTo = getParam(params, SEARCH_RETURN_PATH_PARAM);
  if (!isSafeSearchReturnPath(returnTo)) return null;
  const safeReturnTo = returnTo;

  return { returnTo: safeReturnTo };
}
