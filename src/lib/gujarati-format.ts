const gujaratiDigits = ["૦", "૧", "૨", "૩", "૪", "૫", "૬", "૭", "૮", "૯"];

export function formatGujaratiNumber(value: number): string {
  return String(value).replace(/\d/g, (digit) => gujaratiDigits[Number(digit)]);
}
