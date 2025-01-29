const lowByteOffset: number = 14;
const highByteOffset: number = -9;

const internalChars: number[] = [
  0x00, 0x0A, 0x0D,
  0x20,
  0x22, 0x24,
  0x40, 0x5B, 0x5C,
  0x7B, 0x7D, 0x7E, 0x80,
  0xA3, 0xA4, 0xA7, 0xBD,
  0x3B, // ;
  0x5D, // ]
  0x5F, // _
  0x3D, // =
  0x23, // #
  0x2F, // /
];

const defaultEscapeChr: number = 0x10;

const escapeList: Record<number, number> = {
  0x80: 0x20AC, 0x82: 0x201A, 0x83: 0x0192, 0x84: 0x201E,
  0x85: 0x2026, 0x86: 0x2020, 0x87: 0x2021, 0x88: 0x02C6,
  0x89: 0x2030, 0x8A: 0x0160, 0x8B: 0x2039, 0x8C: 0x0152,
  0x8E: 0x017D, 0x91: 0x2018, 0x92: 0x2019, 0x93: 0x201C,
  0x94: 0x201D, 0x95: 0x2022, 0x96: 0x2013, 0x97: 0x2014,
  0x98: 0x02DC, 0x99: 0x2122, 0x9A: 0x0161, 0x9B: 0x203A,
  0x9C: 0x0153, 0x9E: 0x017E, 0x9F: 0x0178,
};

const charMap: Record<number, number> = {
  0x20AC: 0x80, 0x201A: 0x82, 0x0192: 0x83, 0x201E: 0x84,
  0x2026: 0x85, 0x2020: 0x86, 0x2021: 0x87, 0x02C6: 0x88,
  0x2030: 0x89, 0x0160: 0x8A, 0x2039: 0x8B, 0x0152: 0x8C,
  0x017D: 0x8E, 0x2018: 0x91, 0x2019: 0x92, 0x201C: 0x93,
  0x201D: 0x94, 0x2022: 0x95, 0x2013: 0x96, 0x2014: 0x97,
  0x02DC: 0x98, 0x2122: 0x99, 0x0161: 0x9A, 0x203A: 0x9B,
  0x0153: 0x9C, 0x017E: 0x9E, 0x0178: 0x9F
};

const encode = (input: string, whitespace: boolean = false): string => {
  const separator: string = whitespace ? ' ' : '';
  let result: string[] = [];
  for (let i = 0; i < input.length; i++) {
    result.push(buildHex(input[i], separator));
  }
  return result.join(separator);
}

function decode(input: string): string {
  const hex = input.replace(/ /g, '');
  return parseHex(hex);
}

function buildHex(char: string, separator: string): string {
  const codePoint: number | undefined = char.codePointAt(0);
  if (!codePoint || codePoint < 256) {
    return char;
  }

  const hex: string = codePoint.toString(16);
  let low: number = parseInt(hex.slice(-2), 16);
  let high: number = parseInt(hex.slice(0, 2), 16);

  let escapeChr: number = defaultEscapeChr;
  if (internalChars.includes(high)) {
    escapeChr += 2;
  }
  if (internalChars.includes(low)) {
    escapeChr++;
  }

  switch (escapeChr) {
    case defaultEscapeChr + 1:
      low += lowByteOffset;
      break;
    case defaultEscapeChr + 2:
      high += highByteOffset;
      break;
    case defaultEscapeChr + 3:
      low += lowByteOffset;
      high += highByteOffset;
      break;
  }

  return [escapeChr, low, high].map(c => c.toString(16).toUpperCase().padStart(2, '0')).join(separator);
}

function parseHex(hexCode: string): string {
  let chars: string[] = [];
  for (let i: number = 0; i < hexCode.length; i += 2) {
    let hex: string = `${hexCode[i]}${hexCode[i + 1]}`;
    let dec: number = parseInt(hex, 16);
    if (dec < 0x10 || dec > 0x13) {
      chars.push(String.fromCodePoint(dec));
      continue;
    }

    let low: number = parseInt(hexCode.slice(i + 2, i + 4), 16);
    let high: number = parseInt(hexCode.slice(i + 4, i + 6), 16);

    i += 4;

    switch (dec) {
      case defaultEscapeChr + 1:
        low -= lowByteOffset;
        break;
      case defaultEscapeChr + 2:
        high -= highByteOffset;
        break;
      case defaultEscapeChr + 3:
        low -= lowByteOffset;
        high -= highByteOffset;
        break;
    }

    const hexCodes: string[] = [
      high.toString(16).padStart(2, '0'),
      low.toString(16).padStart(2, '0'),
    ];
    const code: string = hexCodes.join('');
    const codePoint: number = parseInt(code, 16);
    const char = String.fromCodePoint(codePoint);
    chars.push(char);
  }
  return chars.join('');
}

export { encode, decode };

export default defineNuxtPlugin(nuxtApp => {
  nuxtApp.provide('eu4', { encode, decode });
});
