module.exports = (p) => {
  if (p === undefined) return true;
  else return typeof (p * 1) === "number" && p > 0;
};
