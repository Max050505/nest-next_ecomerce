
const transliteration: Record<string, string> = {
  а: "a", б: "b", в: "v", г: "h", ґ: "g",
  д: "d", е: "e", є: "ie", ж: "zh", з: "z",
  и: "y", і: "i", ї: "i", й: "i", к: "k",
  л: "l", м: "m", н: "n", о: "o", п: "p",
  р: "r", с: "s", т: "t", у: "u", ф: "f",
  х: "kh", ц: "ts", ч: "ch", ш: "sh", щ: "shch",
  ю: "iu", я: "ia", ь: "", "'": "", "’": "",
  ы: "y", э: "e", ё: "yo", ъ: "",
};

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .split("")
    .map((char) => transliteration[char] ?? char)
    .join("")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
