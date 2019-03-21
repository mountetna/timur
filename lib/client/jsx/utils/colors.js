const colors = [
  '#3cb44b',
  '#4363d8',
  '#f58231',
  '#e6194B',
  '#ffe119',
  '#911eb4',
  '#bfef45',
  '#fabebe',
  '#42d4f4',
  '#f032e6',
  '#469990',
  '#e6beff',
  '#9A6324',
  '#fffac8',
  '#800000',
  '#aaffc3',
  '#808000',
  '#ffd8b1',
  '#000075',
  '#a9a9a9',
];

export const autoColors = (number) => Array.from({length: Math.ceil(number / colors.length)},() => colors).flat().slice(0,number);
