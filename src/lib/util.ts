/**
 * A builder of repeat string
 *
 * @param count repeat count
 * @param str source string
 * @returns repeated string
 */
export function repeat(count: number, str: string): string {
  if (count <= 0) {
    return "";
  }
  const repU = repeat(Math.floor(count / 2), str);
  return repU + repU + ((count % 2) == 1 ? str : "");
}