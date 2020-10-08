export function toUrlString(array: string | string[] | undefined) {
  if (!array) return "";

  if (typeof array === "string") return `/${array}`;

  return array.reduce((acc, item) => `${acc}/${item}`, "");
}
