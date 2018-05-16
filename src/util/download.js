/*
* 文件流js下载文件实例：（注意：请求的responseType 必须是 arrayBuffer）
*/
function handlePreview(file){
    if (!file.id) return;
    let _this = this;
    this.downloadLoading = true;
    downloadContract(file.id).then(res => {
        this.downloadLoading = false;
        //res.data是文件流
        downloadFile(file.name, res.data);
    }).catch(err => {
        console.error(err)
        this.downloadLoading = false;
    })
    function downloadFile(fileName, content) {
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
            _this.$nextTick(() => {
                window.URL.revokeObjectURL(url);
                aLink = null;
            });
        };
    };
}