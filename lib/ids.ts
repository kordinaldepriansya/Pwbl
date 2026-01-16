export function cleanId(input: string) {
  return decodeURIComponent(input)
    .replace(/[\u200B-\u200D\uFEFF\r\n\t ]+/g, "")
    .trim();
}
