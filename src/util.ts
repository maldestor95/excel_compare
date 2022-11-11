

export type intersectionType=
{ 'intersection': string[];
 'diff1': string[];
  'diff2': string[]; 
}
/**
 * Intersection between 2 arrays of string
 * @param stringArray1 
 * @param stringArray2 
 * @returns `{'intersection': intersection, 'diff1': diff1, 'diff2': diff2    }`
 */
export function intersectionStringArray(stringArray1: string[], stringArray2: string[]): intersectionType {
    let diff1: string[] = [];
    let diff2: string[] = [];
    let intersection: string[] = [];
    if ((stringArray1 != undefined) && (stringArray2 != undefined)) {
        diff1 = stringArray1.filter(x => !stringArray2.includes(x));
        diff2 = stringArray2.filter(x => !stringArray1.includes(x));
        intersection = stringArray2.filter(x => stringArray1.includes(x));
    }
    return ({
        'intersection': intersection, 'diff1': diff1, 'diff2': diff2
    });
}
