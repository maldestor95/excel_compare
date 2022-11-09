import { existsSync } from "fs";
import {Workbook, Worksheet, Row,CellValue} from 'exceljs'

class WorkbookLudo extends Workbook {
    wb:Workbook
    filename:string
    constructor(){
        super()
        this.wb=new Workbook()
        this.filename=""
    }
    get sheetList():string[]{
        const res= this.wb.worksheets.map(ws=>ws.name)
        return res
    }
    set SetWb(wb:Workbook) {
        this.wb=wb
    }
}
export class XLSREADER {
    wb:{'file':string, 'wb':Workbook}[]
    constructor(){
        this.wb=[]
    }
    async loadExcelFile(filePath:string,position?:number):Promise<boolean> {
        if (existsSync(filePath)){
            const workbook = new Workbook();
            await workbook.xlsx.readFile(filePath);
            if (position) {this.wb[position]={file:filePath, wb:workbook}}
            else this.wb.push({file:filePath, wb:workbook})
            return true
        }
        return false
    }

    get WorkbookList ():string[]{
        return this.wb.map(w=>w.file)}
}

/**
 * convert a Row (Exceljs) to a joint string with a separator
 * @param rowToConvert Row
 * @param separator  character used as a separator. default is '|'
 * @returns  joint string with separator
 */
function CSVifyRow(rowToConvert:Row, separator?:string):string {
    const arrayOfValue:CellValue[]=[]
    for (let index = 1; index < rowToConvert.cellCount; index++) {
        arrayOfValue.push(rowToConvert.getCell(index).value);
    }
    const sep=separator?separator:('|')
    return arrayOfValue.join(sep)
}

function intersection (stringArray1:string[],stringArray2:string[]):{'intersection':string[],'diff1':string[],'diff2':string[]} {
    let diff1:string[]=[]
    let diff2:string[]=[]
    let intersection:string[]=[]
    if ((stringArray1!=undefined) && (stringArray2!=undefined)) { 
        diff1 = stringArray1.filter(x=>!stringArray2.includes(x))
        diff2 = stringArray2.filter(x=>!stringArray1.includes(x))
        intersection  = stringArray2.filter(x=>stringArray1.includes(x))
    }
    return ({
        'intersection':intersection,'diff1':diff1,'diff2':diff2
    })
}
export class compareXLS{
    wb1:Workbook
    wb2:Workbook
    wsList1:string[]
    wsList2:string[]
    comparisonWorkbook:Workbook
    separator: string
    constructor(wb1:Workbook,wb2:Workbook){
        this.wb1=wb1
        this.wb2=wb2
        this.comparisonWorkbook= new Workbook()
        this.separator=('|')
        this.wsList1=[]
        this.wsList2=[]
        this.wb1.eachSheet(ws=>this.wsList1.push(ws.name))
        this.wb1.eachSheet(ws=>this.wsList2.push(ws.name))

    }
    differenceperSheet(sheet1:Worksheet,sheet2:Worksheet){
        console.log(`Sheet1: row length ${sheet1.rowCount} | name : ${sheet1.name}`)
        console.log(`Sheet2: row length ${sheet2.rowCount} | name : ${sheet2.name}`)
        const row1=this.getRows(sheet1)
        const row2=this.getRows(sheet2)
        const analyse= intersection(row1,row2)
        const comparisonSheet= this.comparisonWorkbook.addWorksheet(sheet1.name)
        comparisonSheet.addRow(["Intersection"])
        analyse.intersection.forEach (r=> comparisonSheet.addRow(r.split(this.separator)))
        comparisonSheet.addRow(["Diff1"])
        analyse.diff1.forEach (r=> comparisonSheet.addRow(r.split(this.separator)))
        comparisonSheet.addRow(["Diff2"])
        analyse.diff2.forEach (r=> comparisonSheet.addRow(r.split(this.separator)))
        return analyse
    }
    private getRows(sheet:Worksheet):string[]{
        return <string[]>sheet.getRows(1,sheet.rowCount)?.map(row=>CSVifyRow(row))
    }

}