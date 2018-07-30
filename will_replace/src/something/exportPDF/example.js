import pdf from './pdfmake.js'
import vfsFn from './vfs_fonts.js'
vfsFn(pdf)
down()
function down() {
    var dd = {
        content: [
            '中英文测试',
            'Another paragraphs'
        ],
        defaultStyle: {
            font: 'Roboto'
        }
    };
    pdf.fonts = {
        Roboto: {
            normal: 'Roboto-Regular.ttf',
            bold: 'Roboto-Regular.ttf',
            italics: 'Roboto-Regular.ttf',
            bolditalics: 'Roboto-Regular.ttf'
        }
    };
    pdf.createPdf(dd).download();
}