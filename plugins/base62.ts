export class Base62 {
  public static readonly DICT: string[] = [
    '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V',
    'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r',
    's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
  ];

  public static readonly REVERSE_DICT: Record<string, number> = {
    '0': 0, '1': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9,
    'A': 10, 'B': 11, 'C': 12, 'D': 13, 'E': 14, 'F': 15, 'G': 16, 'H': 17, 'I': 18, 'J': 19,
    'K': 20, 'L': 21, 'M': 22, 'N': 23, 'O': 24, 'P': 25, 'Q': 26, 'R': 27, 'S': 28, 'T': 29,
    'U': 30, 'V': 31, 'W': 32, 'X': 33, 'Y': 34, 'Z': 35,
    'a': 36, 'b': 37, 'c': 38, 'd': 39, 'e': 40, 'f': 41, 'g': 42, 'h': 43, 'i': 44, 'j': 45,
    'k': 46, 'l': 47, 'm': 48, 'n': 49, 'o': 50, 'p': 51, 'q': 52, 'r': 53, 's': 54, 't': 55,
    'u': 56, 'v': 57, 'w': 58, 'x': 59, 'y': 60, 'z': 61,
  };

  public static string(length: number = 8): string {
    const dictLength = Base62.DICT.length;
    return Array.from({ length }, () => Base62.DICT[Math.floor(Math.random() * dictLength)]).join('');
  }

  public static decToBase62(num: number | string): string {
    const to = Base62.DICT.length;
    const result: string[] = [];
    let n = BigInt(num);

    while (n > 0) {
      result.push(Base62.DICT[Number(n % BigInt(to))]);
      n = n / BigInt(to);
    }

    return result.reverse().join('');
  }

  public static base62ToDec(num: string): string {
    const from = Base62.DICT.length;
    return num.split('').reduce((acc, char) => {
      if (!(char in Base62.REVERSE_DICT)) {
        throw new Error(`Invalid character in Base62 string: ${char}`);
      }
      return (BigInt(acc) * BigInt(from) + BigInt(Base62.REVERSE_DICT[char])).toString();
    }, '0');
  }
}

export default defineNuxtPlugin(nuxtApp => {
  nuxtApp.provide('base62', Base62);
});
