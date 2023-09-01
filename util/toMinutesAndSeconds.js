module.exports = function toMinutesAndSeconds(ms) {
  ms = parseFloat(ms);
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const secondsRemainder = seconds % 60;

  return `${minutes}m ${secondsRemainder}s`;
}
