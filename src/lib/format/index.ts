export function toCapitalizedWords(name: string) {
  const words = name.match(/[A-Za-z][a-z]*/g) ?? [];

  return words.map(capitalize).join(" ");
}

function capitalize(word: string) {
  return word.charAt(0).toUpperCase() + word.substring(1);
}

export function convertToSnakeCase(str: string) {
  str =
    str[0]!.toLowerCase() +
    str
      .slice(1, str.length)
      .replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
  str = str.replaceAll(" _", "_");

  return str.replaceAll(" ", "_").replace(/(^_*|_*$)/g, "");
}
