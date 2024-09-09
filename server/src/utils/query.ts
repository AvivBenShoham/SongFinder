export const getQueryParamList = (value?: string | string[]) =>
  value ? (typeof value === 'string' ? [value] : value) : [];
