import { ReportsRepository } from './reports.repository';
import { initReportBuild } from '../../utils/reports';
import numeral from 'numeral';
import TimesBold from 'pdfjs/font/Times-Bold';
import { format, lightFormat } from 'date-fns';
import es from 'date-fns/locale/es';
import { WagesBusiness } from '../wages/wages.business';

numeral.locale('cr');

numeral.register('locale', 'cr', {
  delimiters: {
    thousands: ',',
    decimal: '.',
  },
  abbreviations: {
    thousand: 'k',
    million: 'm',
    billion: 'b',
    trillion: 't',
  },
  ordinal: function (number) {
    return number === 1 ? 'er' : 'ème';
  },
  currency: {
    symbol: '₡ ',
  },
});

export class ReportsBusiness {
  constructor(private repository = new ReportsRepository(), private salaryRepo = new WagesBusiness()) {}

  public async generateSalaryPDF(employeesIds: string[], year: number, month: number) {
    let calcs = [];

    for (const id of employeesIds) {
      const data = await Promise.all([
        this.salaryRepo.getBasicSalaryData(parseInt(id), year, month),
        this.salaryRepo.getSalaryCalc(parseInt(id), year, month),
      ]);

      calcs.push({ ...data[0], ...data[1] });
    }

    const { report, filename, path } = initReportBuild('reporte-salarios');

    const currentMonth = format(new Date(), 'MMMM yyyy', { locale: es });
    const cell = report.cell({ paddingBottom: 15 });
    cell
      .text(
        `Desglose de montos salariales para el mes de ${currentMonth.charAt(0).toUpperCase() + currentMonth.slice(1)}`,
        {
          fontSize: 13,
        }
      )
      .br();
    cell.text('Salarios regulares', { fontSize: 14 });

    const table = report.table({
      widths: ['*', '*', '*', '*', '*', '*', '*'],
      padding: 5,
      borderWidth: 0.5,
    });

    const th = table.header({ font: TimesBold, fontSize: 11 });
    th.cell('Empleado');
    th.cell('Salario por hora');
    th.cell('Salario bruto');
    th.cell('Impuesto renta');
    th.cell('C.C.S.S');
    th.cell('Salario neto');
    th.cell('Aguinaldo');

    let brutos = 0;
    let rentas = 0;
    let deducciones = 0;
    let netos = 0;
    let aguinaldos = 0;

    for (const item of calcs) {
      brutos += item.salario_bruto;
      rentas += item.impuesto_renta;
      deducciones += item.total_deduccion;
      netos += item.salario_neto;
      aguinaldos += item.salario_bruto / 12;

      const tr = table.row({ fontSize: 10 });
      tr.cell(item.empleado);
      tr.cell(`${numeral(item.salario_hora).format('0,0.00')}`, { textAlign: 'right' });
      tr.cell(`${numeral(item.salario_bruto).format('0,0.00')}`, { textAlign: 'right' });
      tr.cell(`${numeral(item.impuesto_renta).format('0,0.00')}`, { textAlign: 'right' });
      tr.cell(`${numeral(item.total_deduccion).format('0,0.00')}`, { textAlign: 'right' });
      tr.cell(`${numeral(item.salario_neto).format('0,0.00')}`, { textAlign: 'right' });
      tr.cell(`${numeral(item.salario_bruto / 12).format('0,0.00')}`, { textAlign: 'right' });
    }

    const totalCell = report.cell({ paddingTop: 15 });
    totalCell
      .cell()
      .text(`Total en salarios brutos: ${numeral(brutos).format('0,0.00')}`, { font: TimesBold, fontSize: 12 });
    totalCell
      .cell()
      .text(`Total en impuestos de renta: ${numeral(rentas).format('0,0.00')}`, { font: TimesBold, fontSize: 12 });
    totalCell
      .cell()
      .text(`Total en cargas sociales: ${numeral(deducciones).format('0,0.00')}`, { font: TimesBold, fontSize: 12 });
    totalCell
      .cell()
      .text(`Total en salarios netos: ${numeral(netos).format('0,0.00')}`, { font: TimesBold, fontSize: 12 });
    totalCell
      .cell()
      .text(`Total en aguinaldos: ${numeral(aguinaldos).format('0,0.00')}`, { font: TimesBold, fontSize: 12 })
      .br();
    totalCell.cell().text('Salarios especiales (Choferes)', { fontSize: 14 }).br();

    const specialtable = report.table({
      widths: ['*', '*', '*'],
      padding: 5,
      borderWidth: 0.5,
    });

    const th2 = specialtable.header({ font: TimesBold, fontSize: 11 });
    th2.cell('Empleado');
    th2.cell('Total deducido');
    th2.cell('Salario');

    for (const item of calcs) {
      if (item.salario_especial_chofer && item.total_deduccion_especial) {
        const tr = specialtable.row({ fontSize: 10 });
        tr.cell(item.empleado);
        tr.cell(`${numeral(item.total_deduccion_especial).format('0,0.00')}`, { textAlign: 'right' });
        tr.cell(`${numeral(item.salario_especial_chofer).format('0,0.00')}`, { textAlign: 'right' });
      }
    }

    await report.end();

    return { filename, path };
  }

  public async generateQualityPDF() {
    const quality = await this.repository.getQualityData();

    const { report, filename, path } = initReportBuild('control-calidad');

    const currentMonth = format(new Date(), 'MMMM yyyy', { locale: es });
    const cell = report.cell({ paddingBottom: 15 });
    cell
      .text(
        `Felicitaciones y amonestaciones para el mes de ${
          currentMonth.charAt(0).toUpperCase() + currentMonth.slice(1)
        }`,
        {
          fontSize: 13,
        }
      )
      .br();
    cell.text('Felicitaciones registradas', { font: TimesBold, fontSize: 13 });

    const table = report.table({
      widths: ['*', '*', '*'],
      padding: 5,
      borderHorizontalWidths: (i) => {
        return i < 2 ? 1 : 0.1;
      },
    });

    const th = table.header({ font: TimesBold, fontSize: 11 });
    th.cell('Empleado');
    th.cell('Motivo de la felicitacion');
    th.cell('Fecha de registro');

    for (const item of quality.felicitaciones) {
      const tr = table.row({ fontSize: 10 });
      tr.cell(item.nombre);
      tr.cell(`${item.descripcion}`);
      tr.cell(`${lightFormat(new Date(item.fecha), 'dd-MM-yyyy')}`, { textAlign: 'right' });
    }

    const totalCell = report.cell({ paddingTop: 15 });
    totalCell.cell().text(`Amonestaciones registradas`, { font: TimesBold, fontSize: 13 }).br();

    const specialtable = report.table({
      widths: ['*', '*', '*'],
      padding: 5,
      borderHorizontalWidths: (i) => {
        return i < 2 ? 1 : 0.1;
      },
    });

    const th2 = specialtable.header({ font: TimesBold, fontSize: 11 });
    th2.cell('Empleado');
    th2.cell('Motivo de la amonestacion');
    th2.cell('Fecha de registro');

    for (const item of quality.amonestaciones) {
      const tr = specialtable.row({ fontSize: 10 });
      tr.cell(item.nombre);
      tr.cell(`${item.descripcion}`);
      tr.cell(`${lightFormat(new Date(item.fecha), 'dd-MM-yyyy')}`, { textAlign: 'right' });
    }

    await report.end();

    return { filename, path };
  }
}
