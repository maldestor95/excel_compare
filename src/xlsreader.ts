import { existsSync } from "fs";
import {Workbook, Worksheet, Row,CellValue} from 'exceljs'
import { intersectionStringArray, _union } from "./util";

export class WorkbookUtils {
    wb:Workbook
    filename=""
    constructor(){
        this.wb=new Workbook()
    }
    get sheetList():string[]{
        return this.wb.worksheets.map(ws=>ws.name)
    }
    /**
     * convert a Row (Exceljs) to a joint string with a separator
     * @param rowToConvert Row
     * @param separator  character used as a separator. default is '|'
     * @returns  joint string with separator
     */
    static CSVifyRow(rowToConvert:Row, separator?:string):string {
        const arrayOfValue:CellValue[]=[]
        for (let index = 1; index < rowToConvert.cellCount; index++) {
            arrayOfValue.push(rowToConvert.getCell(index).value);
        }
        const sep=separator?separator:('|')
        return arrayOfValue.join(sep)
    }
    /**
     * load a workbook defined by a path
     * @param filePath 
     * @returns true/false for success/fail
     */
     async loadExcelFile(filePath:string):Promise<boolean> {
        if (existsSync(filePath)){
            const workbook = new Workbook();
            await workbook.xlsx.readFile(filePath);
            this.wb=workbook
            return true
        }
        return false
    }
}

function differenceperSheet(sheet1:Worksheet|null,sheet2:Worksheet|null,comparisonSheet:Worksheet){
    const separator=('|')
    const row1=sheet1?getRows(sheet1):[]
    const row2=sheet2?getRows(sheet2):[]
    const analyse= intersectionStringArray(row1,row2)
    formatHeaderRow(comparisonSheet, "Common between the two worksheet")
    analyse.intersection.forEach (r=> comparisonSheet.addRow(r.split(separator)))
    formatHeaderRow(comparisonSheet, "Not included in sheet1")
    analyse.diff1.forEach (r=> comparisonSheet.addRow(r.split(separator)))
    formatHeaderRow(comparisonSheet, "Not included in Sheet2")
    analyse.diff2.forEach (r=> comparisonSheet.addRow(r.split(separator)))
    return analyse
}
function formatHeaderRow(sheet:Worksheet, text:string){
    sheet.addRow([text])
    const row= sheet.lastRow
    if (row) {
         row.font ={size:16}
         row.border = {
            top: {style:'thick', color: {argb:'00000000'}},
            bottom: {style:'thick', color: {argb:'00000000'}},
         }
         row.height= 40
         row.alignment= {vertical:'middle'}
         row.fill={
            type: 'pattern',
            pattern:'solid',
            fgColor:{argb:'00DADA'},
         }
    }
}
function getRows(sheet:Worksheet):string[]{
    return <string[]>sheet.getRows(1,sheet.rowCount)?.map(row=>WorkbookUtils.CSVifyRow(row))
}
export function compareWorkbook (wb1:WorkbookUtils,wb2:WorkbookUtils):Workbook {
    // initiate WBcompare
    const WSList=_union(wb1.sheetList,wb2.sheetList)
    const WBcompare = new WorkbookUtils()
    WSList.forEach(ws=> {
        WBcompare.wb.addWorksheet(ws)
        differenceperSheet(wb1.wb.getWorksheet(ws),wb2.wb.getWorksheet(ws),WBcompare.wb.getWorksheet(ws))
    })
    return WBcompare.wb
}


