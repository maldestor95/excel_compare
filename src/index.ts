import { Workbook } from 'exceljs';
import { compareWorkbook, WorkbookUtils} from "./xlsreader"

const fileA='./src/__tests__/sample/Book1_versionA.xlsx'
const fileB='./src/__tests__/sample/Book1_versionB.xlsx'
const comparisonPath = 'test3.xlsx'

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


const main = async  (fileAPath:string, fileBPath:string):Promise<Workbook>=>{
    const wb1:WorkbookUtils=new WorkbookUtils()
    const wb2:WorkbookUtils=new WorkbookUtils()
    await wb1.loadExcelFile(fileAPath)
    await wb2.loadExcelFile(fileBPath)
    const WBresult= compareWorkbook(wb1,wb2)
    return WBresult
}


const comparison= main(fileA,fileB)
comparison.then(wb=>{
    wb.xlsx.writeFile(comparisonPath)
    console.log(`${comparisonPath} written`)
})


