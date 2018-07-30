/**
 * 参数1：[ 文件名称 ]
 * 参数2：[ 传输的文件流，类型：application/octet-stream]
 * 注意： 返回请求的responseType 必须是 arrayBuffer 才行
 */
export function downloadFile(fileName, content) {
    if ('msSaveOrOpenBlob' in window.navigator) {
        //ie10~11、edge
        let blob = new Blob([content]);
        window.navigator.msSaveOrOpenBlob(blob, fileName);
    } else {
        let aLink = window.document.createElement('a');
        let blob = new Blob([content]);
        let url = window.URL.createObjectURL(blob);
        aLink.download = fileName;
        aLink.href = url;
        aLink.click();
        
        window.URL.revokeObjectURL(url);
        aLink = null;
    };
};