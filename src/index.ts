import { existsSync } from "fs";
import {Workbook,Worksheet} from 'exceljs'

const fileA='./src/__tests__/sample/Book1_versionA.xlsx'
const fileB='./src/__tests__/sample/Book1_versionB.xlsx'

async function loadExcelFile(filePath:string):Promise<Workbook|null> {
    if (existsSync(filePath)){
        const workbook = new Workbook();
        await workbook.xlsx.readFile(filePath);
        return workbook
    }
    return null
}
function sheetList(wb:Workbook):string[]{
    const res= wb.worksheets.map(ws=>ws.name)
    return res
}

loadExcelFile(fileA).then((wb)=>{
    console.log(sheetList(<Workbook>wb))
})
// loadExcelFile(fileB).then(console.log)
