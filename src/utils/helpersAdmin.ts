import moment from "moment";
import { SelectInterface } from "../interfaces/InterfacesLocal";


moment.defineLocale("es", {
  invalidDate: " -",
});


export const roundOneDecimals = (value: number) => {
  return Math.ceil(value * 10) / 10;
};

export const roundTwoDecimals = (value: number) => {
  return Math.ceil(value * 100) / 100;
};

export const roundFourDecimals = (value: number) => {
  return Math.round(value * 10000) / 10000;
};

export const getPercent = (part: number = 0, total: number = 1) => {
  const percent = (part / total) * 100;
  return roundTwoDecimals(percent);
};

export const truncateValue = (
  value: number | string,
  precission?: number | string
) => {
  if (!value) {
    return 0;
  }

  if (!precission) {
    return Number(value);
  }

  const array = value.toString().split(".");
  const decimalPart = array[1]?.substring(0, Number(precission) || 0) || "0";
  return Number([array[0], decimalPart].join("."));
};

/*export const mathOperation = (
  value1: number,
  value2: number,
  operation: "addition" | "subtraction" | "multiplication" | "division",
  precission?: number | string
): number => {
  try {
    //Limit number to precission
    const operator1 = new bigDecimal(truncateValue(value1, precission));
    const operator2 = new bigDecimal(truncateValue(value2, precission));

    let result;
    switch (operation) {
      case "addition":
        result = operator1.add(operator2);
        break;
      case "subtraction":
        result = operator1.subtract(operator2);
        break;
      case "division":
        result = operator1.divide(operator2);
        break;
      case "multiplication":
        result = operator1.multiply(operator2);
        break;
    }

    return Number(truncateValue(result.getValue(), precission));
  } catch (error: any) {
    console.log(error);
    return 0;
  }
};*/

export const validateEmail = (email: string | null) => {
  if (email) {
    return (
      email.match(
        /^([A-Za-z0-9_\-.])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,4})$/
      ) !== null || "Formato inválido"
    );
  }
  return true;
};

export const validateLength = (data: string) => {
  if (data.length < 14) {
    return false;
  } else {
    return true;
  }
};

export const generateUrlParams = (
  options?: Record<string, string | number | boolean | null>
) => {
  let list: string[] = [];
  if (options) {
    for (const [key, value] of Object.entries(options)) {
      if (!value) continue;
      list.push(`${key}=${value}`);
    }
  }
  if (list.length !== 0) {
    return "?" + list.join("&");
  } else {
    return "";
  }
};

export const formatCurrency = (
  amount: number,
  currency?: string | null,
  precision: number = 2
) => {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: currency || "CUP",
    currencyDisplay: "code",
    maximumFractionDigits: precision,
  }).format(amount);
};

//Funcion para mostrar el los valores sin Currency
export const formatCurrencyWithOutCurrency = (
  amount: number,
  currency?: string,
  precision: number = 2
) => {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: currency || "CUP",
    currencyDisplay: "code",
    minimumFractionDigits: precision,
    maximumFractionDigits: precision,
  })
    .formatToParts(amount)
    .filter((x) => x.type !== "currency")
    .map((x) => x.value)
    .join("")
    .trim();
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

export const counterTimeAboutDate = (
  final_date: string,
  initial_date: string
) => {
  return initial_date ? moment(final_date).diff(initial_date, "d") : Infinity;
};

export const formatMaskAccount = (
  text: string,
  separator: string,
  countForSeparator: number
) => {
  return text !== "---"
    ? text
        ?.split("")
        .map((x, i) =>
          i > 0 && i % countForSeparator === 0 ? separator + x : x
        )
        .join("")
    : "---";
};

export const formatAddressAccount = (value: string, separator: string) => {
  if (value === undefined) {
    return "---";
  }

  let arr = value
    .split(" ")
    .map((x) => {
      if (x.match(/\b[0-9]+\b/g)) {
        return x.match(/.{1,4}/g)?.join(separator);
      } else {
        return x;
      }
    })
    .join(" ");

  return arr;
};

export const convert_positive = (a: number) => {
  if (a < 0) {
    a = a * -1;
  }
  return a;
};

export const create_array_number = (
  value_initial: number,
  value_final: number
) => {
  let results: SelectInterface[] = [];

  for (let i = value_initial; i <= value_final; i++) {
    results.push({
      id: i,
      name: i.toString(),
    });
  }

  return results;
};

export const getTimeArray = () => {
  const minutesInDay = 1440;
  const timeBlocksArr = [{ id: "0", name: "12:00 am" }];

  for (let i = 60; i <= minutesInDay - 60; i += 60) {
    const halfHourInLoop = i / 60;

    let formattedBlock = String(halfHourInLoop);
    const hour = formattedBlock.split(".")[0];
    const minute = 0; /* i % 60 === 0 ? '00' : '30' */
    formattedBlock = `${hour}`; /* :${minute} */

    let ampm = Number(hour) >= 12 ? "pm" : "am";

    const today = new Date();
    const timeString = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      Number(hour),
      Number(minute)
    );

    timeBlocksArr.push({
      id: formattedBlock,
      name: `${timeString.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })} ${ampm}`,
    });
  }

  return timeBlocksArr;
};

export const getMaxValue = (current: number = 0) => {
  let max: number = current;
  let pow = 1;
  while (max / 10 ** pow > 10) pow += 1;
  let resp: number;
  resp = Math.ceil((max * 1.1) / 10 ** (pow - 1)) * 10 ** (pow - 1);
  return resp;
};

export const prettyNumber = (current: number = 0) => {
  if (Math.abs(current / 10 ** 6) >= 1)
    return `${(current / 10 ** 6).toFixed(1)}M`;
  if (Math.abs(current / 10 ** 3) >= 1)
    return `${(current / 10 ** 3).toFixed(1)}k`;
  return current;
};

/*export const exportExcel = async (
  data: Record<string, string | number>[],
  fileName: string
) => {
  const ws = utils.json_to_sheet(data);
  let colWidth: { wch: number }[] = [];
  data.forEach((row, idx) => {
    const cols = Object.entries(row);
    for (let index = 0; index < cols.length; index++) {
      const headerIndex = utils.encode_cell({ r: 0, c: index });
      ws[headerIndex].s = {
        font: { bold: true },
        alignment: { horizontal: index === 0 ? "left" : "center" },
      };
      const body_index = utils.encode_cell({ r: idx + 1, c: index });
      ws[body_index].s = {
        alignment: { horizontal: index === 0 ? "left" : "center" },
      };
      if (idx === 0) {
        colWidth.push({ wch: cols[index][0]?.toString().length });
      } else {
        const wch: number = cols[index][1]?.toString().length;
        if (wch > colWidth[index].wch) {
          colWidth.splice(index, 1, { wch });
        }
      }
    }
  });
  ws["!cols"] = colWidth;
  const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
  const excelBuffer = write(wb, { bookType: "xlsx", type: "array" });
  const excelData = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
  });

  FileSaver.saveAs(excelData, fileName + ".xlsx");
};*/

const WeekDay = (day: number) => {
  switch (day) {
    case 1:
      return "Lunes";

    case 2:
      return "Martes";

    case 3:
      return "Miércoles";

    case 4:
      return "Jueves";

    case 5:
      return "Viernes";

    case 6:
      return "Sábado";

    case 7:
      return "Domingo";

    default:
      return "";
  }
};

export const formatDate = (date_initial: string) => {
  const date_actual = moment().format("YYYY-MM-DD");
  const date_initial_mod = moment(date_initial).format("YYYY-MM-DD");

  const month_i = moment().month();
  const year_i = moment().year();

  const month_f = moment(date_initial).month();
  const year_f = moment(date_initial).year();

  const date = moment().diff(date_initial, "days");
  const date_after = moment(date_actual).diff(date_initial_mod, "day");

  if (date_after === -1) {
    return moment(date_initial).format("[Mañana a las] hh:mm A");
  }

  if (date === 0) {
    if (date_actual === date_initial_mod) {
      return `Hoy, ${moment(date_initial).format("hh:mm A")}, ${moment(
        date_initial
      ).fromNow()}`;
    } else {
      return `Ayer, ${moment(date_initial).format("hh:mm A")}, ${moment(
        date_initial
      ).fromNow()}`;
    }
  }

  if (date >= 1 && date <= 7) {
    return `${WeekDay(moment(date_initial).isoWeekday())} ${moment(
      date_initial
    ).format("DD, hh:mm A")} `;
  }

  if (month_i === month_f) {
    return `${WeekDay(moment(date_initial).isoWeekday())} ${moment(
      date_initial
    ).format("DD, hh:mm A")}`;
  } else {
    if (year_i === year_f) {
      return `${moment(date_initial).format("DD [de] MMMM, hh:mm A")}`;
    } else {
      return moment(date_initial).format("DD [de] MMMM [de] YYYY hh:mm A");
    }
  }
};

export const formatCalendar = (date?: string | null, article?: boolean) => {
  const dateObj = moment(date).toObject();
  const todayObj = moment().toObject();

  const diffYear = Math.abs(dateObj.years - todayObj.years);
  const diffMonth = Math.abs(dateObj.months - todayObj.months);
  const diffDay = dateObj.date - todayObj.date;

  if (date) {
    if (diffYear === 0) {
      if (diffMonth === 0) {
        if (diffDay === 1) return moment(date).format("[Mañana a las] hh:mm A");
        if (diffDay === 0) return moment(date).format("[Hoy a las] hh:mm A");
        if (diffDay === -1) return moment(date).format("[Ayer a las] hh:mm A");
      }
      return moment(date).format(
        `${article ? "[el]" : ""} D [de] MMM [a las] hh:mm A`
      );
    }
    return moment(date).format(
      `${article ? "[el]" : ""} DD/MM/YYYY${
        article ? " [a las]" : "[,]"
      } hh:mm A`
    );
  }
  return "-";
};

export const address_complete = (
  street: string,
  locality: string,
  municipality: string
) => {
  const addrees: string[] = [];

  if (street) {
    addrees.push(street);
  }
  if (locality) {
    addrees.push(locality);
  }
  if (municipality) {
    addrees.push(municipality);
  }

  if (addrees.length > 0) return addrees.join(", ");
  else return "---";
};

export const validateUserChar = (user: string) => {
  if (user) {
    return user.match(/^[A-Za-z0-9_\-.]{1,}$/) !== null;
  }
  return true;
};

export const calculateAmountTotalOfDifferentCurrencies = (
  amounts: Array<{ amount: number; codeCurrency: string }>
) => {
  const totals = amounts.reduce(
    (
      acc: Record<string, number>,
      curr: { amount: number; codeCurrency: string }
    ) => {
      acc[curr.codeCurrency] = (acc[curr.codeCurrency] || 0) + curr.amount;
      return acc;
    },
    {}
  );

  return Object.keys(totals).map((currency) => {
    return { codeCurrency: currency, amount: totals[currency] };
  });
};

export const cleanObject = (obj: Record<string, any>, elements: string[]) => {
  const objToArray = Object.entries(obj).filter(
    (itm) => !elements.includes(itm[0])
  );
  return Object.fromEntries(objToArray);
};

export const groupBy = (obj: Array<Record<any, any>>, key: string) => {
  return obj.reduce(function (rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
};

