export const formatText = (text: string) =>
  text.toLocaleLowerCase().replaceAll(/[^a-zA-Z0-9]+/gm, "");
