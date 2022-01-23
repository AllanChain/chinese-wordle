export const xorStrings = (key: string, input: string) => {
  let output = ''
  for (let i = 0; i < input.length; i++) {
    const c = input.charCodeAt(i)
    const k = key.charCodeAt(i % key.length)
    output += String.fromCharCode(c ^ k)
  }
  return output
}
