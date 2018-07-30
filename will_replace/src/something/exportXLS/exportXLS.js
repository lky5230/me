/*
* 导出excel.xls
*   head: ['标题1', '标题2', '标题3']
*   row: [
*     [1,2,3],
*     [2,3,4],
*     [3,4,5],
*   ]
*/
export function exportXLS(head, row){
  //表头
  let header = '<tr>';
  for(let i=0; i<head.length; i++){
    header += '<td>'+head[i]+'</td>';
  }
  header += '</tr>';

  //表体
  let rowBody = []
  for(let i=0; i<row.length; i++){
    let body = '<tr>'
    for(let j=0; j<row[i].length; j++){
      body += '<td>'+row[i][j]+'</td>';
    }
    body += '</tr>'
    rowBody.push(body);
  }

  //准备blob数组
  let con = [
    "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:x='urn:schemas-microsoft-com:office:excel' xmlns='http://www.w3.org/TR/REC-html40'>",
    "<meta http-equiv='content-type' content='application/vnd.ms-excel; charset=UTF-8'>",
    "<head>",
    "<!--[if gte mso 9]>",
    "<xml>",
    "<x:ExcelWorkbook>",
    "<x:ExcelWorksheets>",
    "<x:ExcelWorksheet>",
    "<x:Name>",
    "xlsWorksheetName",
    "</x:Name>",
    "<x:WorksheetOptions>",
    "<x:DisplayGridlines/>",
    "</x:WorksheetOptions>",
    "</x:ExcelWorksheet>",
    "</x:ExcelWorksheets>",
    "</x:ExcelWorkbook>",
    "</xml>",
    "<![endif]-->",
    "</head>",
    "<body>",
    "<table><thead>",

    header,

    "</thead><tbody>",

    ...rowBody,

    "</tbody></table>",

    "</body>",

    "</html>"

  ];

  let blob = new Blob(con, {type: 'application/vnd.ms-xls'});

  saveAs(blob, '文件名'+'.xls');

  function saveAs(blob, filename) {
    let type = blob.type;
    let force_saveable_type = 'application/octet-stream';
    // 强制下载，而非浏览器中打开
    if (type && type != force_saveable_type) {
        let slice = blob.slice || blob.webkitSlice || blob.mozSlice;
        blob = slice.call(blob, 0, blob.size, force_saveable_type);
    }

    let url = window.URL.createObjectURL(blob);
    let save_link = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
    save_link.href = url;
    save_link.download = filename;

    let event = document.createEvent('MouseEvents');
    event.initMouseEvent(
      'click', 
      true, 
      false, 
      window, 
      0, 
      0, 
      0, 
      0, 
      0, 
      false, 
      false, 
      false, 
      false, 
      0, 
      null
    );
    save_link.dispatchEvent(event);
    window.URL.revokeObjectURL(url);
  };
}
