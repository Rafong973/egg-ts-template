require('module-alias/register')
import BaseService from '@base/baseService'

export default class downloadService extends BaseService {
  public async downloadCsv(dataList: object[], fieldMap: object, fileName: string) {
    const { ctx } = this
    dataList.unshift(fieldMap)
    const content = this.genRows(fieldMap, dataList)
    ctx.state.filename = fileName
    ctx.state.extension = 'csv'
    // 这样做可以防止中文乱码
    const msExcelBuffer = Buffer.concat([
      Buffer.from('\xEF\xBB\xBF', 'binary'), // BOM+utf8， 是office支持的格式
      Buffer.from(content)
    ])
    ctx.set('Content-disposition', `attachment; filename=${ctx.state.filename}.csv`)
    ctx.set('content-type', `${ctx.state.filename}.csv; charset=utf-8`)
    ctx.state.isDownloadCsv = true
    // this.returnSuccess(msExcelBuffer.toString('utf8'), true);
    ctx.body = msExcelBuffer.toString('utf8')
  }
  public genRows(fieldMap: any, dataList: any) {
    let result = ''
    dataList.forEach((data) => {
      const keys = Object.getOwnPropertyNames(fieldMap)
      keys.forEach((key) => {
        let cellContent = data[key] || ''
        if (data[key] === 0) {
          cellContent = 0
        }
        if (typeof cellContent === 'string') {
          cellContent = cellContent.replace(/,/g, '，')
        }
        if (fieldMap[key]) result += `"${cellContent}",`
      })
      result += '\n'
    })
    return result
  }
}
