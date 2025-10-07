export function checkPrice(data) {
  if (typeof data === "number" && !isNaN(data)) {
    return Math.round(data);
  }

  const parsedNumber = parseFloat(data);
  if (
    !isNaN(parsedNumber) &&
    data !== "" &&
    data !== null &&
    data !== undefined
  ) {
    return Math.round(parsedNumber);
  }

  return 0;
}
