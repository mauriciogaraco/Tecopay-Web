import moment from "moment";
import _default from "chart.js/dist/plugins/plugin.tooltip";


export const generateUrlParams = (
  options?: Record<string, string | number | boolean | null | undefined>
) => {
  let list: string[] = [];
  if (options) {
    for (const [key, value] of Object.entries(options)) {
      if (!value) continue;
      list.push(`${key}=${value}`);
    }
  }
  if (list.length !== 0) {
    return '?' + list.join('&');
  } else {
    return '';
  }
};

export const formatCalendar = (date?: string | null, article?: boolean) => {
  const diffYear = Math.abs(moment(date).year() - moment().year());
  const diffMonth = Math.abs(moment(date).month() - moment().month());
  const diffWeek = Math.abs(moment(date).weeks() - moment().weeks());
  const diffDay = moment(date).day() - moment().day();

  if (date) {
    if (diffYear === 0) {
      if (diffMonth === 0) {
        if (diffWeek >= 1)
          return moment(date).format(
            `${article ? '[el]' : ''} ddd D [a las] hh:mm A`
          );
        if (diffDay === 1) return moment(date).format('[Mañana a las] hh:mm A');
        if (diffDay === 0) return moment(date).format('[Hoy a las] hh:mm A');
        if (diffDay === -1) return moment(date).format('[Ayer a las] hh:mm A');
      }
      return moment(date).format(
        `${article ? '[el]' : ''} D [de] MMM [a las] hh:mm A`
      );
    }
    return moment(date).format(
      `${article ? '[el]' : ''} DD/MM/YYYY${
        article ? ' [a las]' : '[,]'
      } hh:mm A`
    );
  }
  return '-';
};

export const formatCurrency = (
  amount: number,
  currency?: string | null,
  precision: number = 2
) => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: currency || 'CUP',
    currencyDisplay: 'code',
    maximumFractionDigits: precision,
  }).format(amount);
};

export const translateMonthName = (month: string) => {
  return {
    January: 'Enero',
    February: 'Febrero',
    March: 'Marzo',
    April: 'Abril',
    May: 'Mayo',
    June: 'Junio',
    July: 'Julio',
    August: 'Agosto',
    September: 'Septiembre',
    October: 'Octubre',
    November: 'Noviembre',
    December: 'Diciembre',
  }[month];
};

export const translateDayName = (day: string) => {
  return {
    Monday: 'Lunes',
    Tuesday: 'Martes',
    Wednesday: 'Miércoles',
    Thursday: 'Jueves',
    Friday: 'Viernes',
    Saturday: 'Sábado',
    Sunday: 'Domingo',
  }[day];
};

export const getMaxValue = (current: number = 0) => {
  let max: number = current;
  let pow = 1;
  while (max / 10 ** pow > 10) pow += 1;
  let resp: number;
  resp = Math.ceil((max * 1.1) / 10 ** (pow - 1)) * 10 ** (pow - 1);
  return resp;
};

export const maxValueFromArray = (array: number[]) => {
  return Math.max(...array);
};

export const minValueFromArray = (array: number[]) => {
  return Math.min(...array);
};

export const deleteUndefinedAttr = (object: any) => {
  let newObj: any = {};
  const data = Object.entries(object);
  for (const [key, value] of data) {
    if (value !== undefined) {
      newObj[key] = value;
    }
  }
  return newObj;
};

export const validateEmail = (email: string | null) => {
  if (email) {
    return (
      email.match(
        /^([A-Za-z0-9_\-.])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,4})$/
      ) !== null
    );
  }
  return true;
};
