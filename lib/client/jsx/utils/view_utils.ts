export const recordMatchesRegex = (
  recordName: string | undefined,
  regexStr: string | undefined
): boolean => {
  if (!regexStr || !recordName) {
    return true;
  }

  const regex = new RegExp(regexStr);
  return !!recordName.match(regex);
};
