import { ReportsRepository } from './reports.repository';
import { initReportBuild } from '../../utils/reports';

import TimesBold from 'pdfjs/font/Times-Bold';
import { format } from 'date-fns';
import es from 'date-fns/locale/es';

export class ReportsBusiness {
  constructor(private repository = new ReportsRepository()) {}

  public async generateSalaryPDF() {
    const { report, filename, path } = initReportBuild('reporte-salarios');

    const cell = report.cell({ paddingBottom: 15 });
    cell.text(
      `Desglose de montos salariales para el mes de ${format(
        new Date(),
        'MMMM-yyyy',
        { locale: es }
      )}`,
      { fontSize: 13 }
    );

    const table = report.table({
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

    await report.end();

    return { filename, path };
  }
}
