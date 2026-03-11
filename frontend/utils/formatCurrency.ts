const formatter = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "EUR",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatCurrency(value: number): string {
  return formatter.format(value);
}
