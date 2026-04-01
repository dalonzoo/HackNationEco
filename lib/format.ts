export const numberFormatter = new Intl.NumberFormat("it-IT", {
  maximumFractionDigits: 1
});

export const integerFormatter = new Intl.NumberFormat("it-IT", {
  maximumFractionDigits: 0
});

export const currencyFormatter = new Intl.NumberFormat("it-IT", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0
});

export function formatSignedNumber(value: number) {
  return `${value > 0 ? "+" : ""}${integerFormatter.format(value)}`;
}
