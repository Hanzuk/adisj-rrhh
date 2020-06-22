import { join } from 'path';
import fs from 'fs';
import { format } from 'date-fns';
import es from 'date-fns/locale/es';
import { Document, Image } from 'pdfjs';
import Times from 'pdfjs/font/Times-Roman';

interface ReportInfo {
  filename: string;
  path: string;
  report: Document;
}

export function initReportBuild(reportName: string): ReportInfo {
  const filename =
    `${reportName}-${format(new Date(), 'MMMM-yyyy', {
      locale: es,
    })}`.toUpperCase() + '.pdf';

  const path = join(__dirname, '../../public/downloads/', filename);

  const doc = new Document({ padding: 20, font: Times });
  doc.pipe(fs.createWriteStream(path));

  const img = new Image(
    fs.readFileSync(join(__dirname, '../../public/logo_adisj.jpg'))
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
    .add(format(new Date(), 'd MMMM yyyy', { locale: es }))
    .br()
    .add('Teléfono: 0000-0000', { underline: true, color: 0x00a6fb })
    .br()
    .add('Email: adisj@outlook.com', { underline: true, color: 0x00a6fb });

  return {
    filename,
    path,
    report: doc,
  };
}
