import { XLSREADER,compareXLS } from "./xlsreader"

const fileA='./src/__tests__/sample/Book1_versionA.xlsx'
const fileB='./src/__tests__/sample/Book1_versionB.xlsx'

/* Steps Comparison of 2 excels files
inputs fileA, file B as workbook
output fileComp
- direct comparison between fileA & file B
- sheets created for all files  (differences + intersection)
    - for each sheets, display
        intersection
        diffA
        diffB
output is a workbook 
*/
async function loadData (file1: string, file2:string){
    const reader = new XLSREADER()
    await reader.loadExcelFile(file1).then(()=>{
        console.log(reader.WorkbookList)
    })
    await reader.loadExcelFile(file2).then(()=>{
        console.log(reader.WorkbookList)
    })
    return reader
}

loadData(fileA,fileB).then((reader)=>{
const wb1=reader.wb[0].wb
const wb2=reader.wb[1].wb
const comparison= new compareXLS(wb1,wb2)
comparison.differenceperSheet(wb1.worksheets[1],wb2.worksheets[1])
})
