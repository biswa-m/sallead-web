export const toLocaleString = (x) =>
  x || x === 0
    ? x.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    : "";

export const monthDiff = (d1x, d2x) => {
  var months;
  const d1 = new Date(d1x),
    d2 = new Date(new Date(d2x).getTime() + 1000 * 60 * 60 * 24);
  months = (d2.getFullYear() - d1.getFullYear()) * 12;
  months -= d1.getMonth();
  months += d2.getMonth();
  return months <= 0 ? 0 : months;
};

export const dayDiff = (d1x, d2x) => {
  return (
    (new Date(d2x).getTime() - new Date(d1x).getTime()) / (1000 * 60 * 60 * 24)
  );
};

export const calcTotalOfList = (arr = [], keys = []) => {
  let res = {};
  for (let i = 0; i < arr.length; i++) {
    const el = arr[i];
    for (let j = 0; j < keys.length; j++) {
      const key = keys[j];
      res[key] = (res[key] || 0) + el[key];
    }
  }

  return res;
};

export const alphabets = [
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z",
];
