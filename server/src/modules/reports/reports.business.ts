import { ReportsRepository } from './reports.repository';

import pdf from 'pdfjs';
import Times from 'pdfjs/font/Times-Roman';
import TimesBold from 'pdfjs/font/Times-Bold';
import fs from 'fs';
import path from 'path';
import moment from 'moment';

export class ReportsBusiness {
  constructor(private business = new ReportsRepository()) {}

  public async generateSalaryPDF() {
    moment.locale('es');
    const filename =
      `Reporte-salarial-${moment().format('MMMM-YYYY')}`.toUpperCase() + '.pdf';
    const reportPath = path.join(
      __dirname,
      '../../../public/downloads/',
      filename
    );

    const doc = new pdf.Document({ padding: 20, font: Times });
    doc.pipe(fs.createWriteStream(reportPath));

    const img = new pdf.Image(
      fs.readFileSync(path.join(__dirname, '../../../public/logo_adisj.jpg'))
    );

    const header = doc
      .header()
      .table({ widths: [null, null], paddingBottom: 15 })
      .row();
    header.cell().image(img, { height: 100 });
    header
      .cell()
      .text({ textAlign: 'right' })
      .add('San Juan, Puriscal, San José, Costa Rica')
      .br()
      .add(moment().format('dddd, MMMM Do YYYY'))
      .br()
      .add('Teléfono: 0000-0000', { underline: true, color: 0x00a6fb })
      .br()
      .add('Email: adisj@outlook.com', { underline: true, color: 0x00a6fb });

    const cell = doc.cell({ paddingBottom: 15 });
    cell.text(
      `Desglose de montos salariales para el mes de ${moment().format('MMMM')}`,
      { fontSize: 13 }
    );

    const table = doc.table({
      widths: ['*', '*', '*', '*', '*'],
      padding: 5,
      borderWidth: 0.5,
    });
    const th = table.header({ font: TimesBold, fontSize: 11 });
    th.cell('Empleado');
    th.cell('Por ver');
    th.cell('Total salario bruto');
    th.cell('Total deducciones');
    th.cell('Total salario neto');

    const tr = table.row({ fontSize: 10 });
    tr.cell('Carlos Segundo Amador');
    tr.cell('Por ahora nada');
    tr.cell('$ 122,720.52', { textAlign: 'right' });
    tr.cell('$ 12,689.30', { textAlign: 'right' });
    tr.cell('$ 110,031', { textAlign: 'right' });

    await doc.end();

    return filename;
  }
}
