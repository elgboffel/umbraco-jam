export function toUrlString(array: string | string[] | undefined): string {
  if (!array) return "";

  if (typeof array === "string") return `/${array}`;

  return array.reduce((acc, item) => `${acc}/${item}`, "");
}
