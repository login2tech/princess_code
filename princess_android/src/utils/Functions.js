const hexToRGB = function(hex) {
  hex = parseInt(hex.slice(1), 16);
  const r = hex >> 16;
  const g = (hex >> 8) & 0xff;
  const b = hex & 0xff;
  return `rgb(${r},${g},${b})`;
};

const formatNumber = function(num) {
  return num > 999 ? (num / 1000).toFixed(1) + 'k' : num;
};

export default {
  hexToRGB: hexToRGB,
  formatNumber: formatNumber
};
