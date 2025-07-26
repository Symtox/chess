export const getOpponentColor = (color) => {
  return color === "black" ? "white" : "black"
}

export const padNumber = (number, length) => {
  const padding = '0'.repeat(length - `${number}`.length)
  return `${padding}${number}`
}