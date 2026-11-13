function isMirrorLabel(input) {
  const arrayedString = input
    .toLowerCase()
    .replaceAll(/[?.#!\s]/g, "")
    .split("");

  for (let i = 0; i < arrayedString.length; i++) {
    console.log(
      `arrayedString[${i}]`,
      arrayedString[i],
      arrayedString[arrayedString.length - (i + 1)],
    );
    if (arrayedString[i] !== arrayedString[arrayedString.length - (i + 1)])
      return false;
  }

  return true;
}

const data = "race a car";

console.log(isMirrorLabel(data));
