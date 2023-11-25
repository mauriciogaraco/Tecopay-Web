import {
  faDiagramProject,
  faSignInAlt,
  faSignOutAlt,
  faDollyBox,
  faTrash,
  faSlidersH,
  faMinusSquare,
  faCashRegister,
  faMoneyBill1Wave,
  faSquare,
  faWindowClose,
  faPlusSquare,
  faFile,
  faFileInvoice,
  faFileInvoiceDollar,
  faMinusCircle,
  faFire,
  faAdd,
  faLayerGroup,
  faCalculator,
  faThLarge,
  faBoxes,
  faPallet,
} from "@fortawesome/free-solid-svg-icons";
// import { infoPages } from "./dummy";
import moment from "moment";

export const translateOptions = (options) => {
  let list = [];
  const keys = Object.keys(options);
  keys.forEach((key) => {
    list.push(`${key}=${options[key]}`);
  });

  return list.join("&");
};

export const getMeasureSpanish = (value) => {
  let spanish = "";

  switch (value) {
    case "DRINK":
      spanish = "Trago";
      break;
    case "POUND":
      spanish = "Libra";
      break;
    case "KG":
      spanish = "Kg";
      break;
    case "UNIT":
      spanish = "Unidad";
      break;
    case "LITRE":
      spanish = "Litro";
      break;
    default:
      spanish = value;
  }

  return spanish;
};

export const getAccountAction = (value) => {
  let spanish = "";

  switch (value) {
    case "ACCOUNT_CREATED":
      spanish = "Cuenta creada";
      break;
    case "CARD_CREATED":
      spanish = "Tarjeta creada";
      break;
    default:
      spanish = value;
  }

  return spanish;
};

export const getOperationInventorySpanish = (value) => {
  let spanish = "";

  switch (value) {
    case "CLOSED":
      spanish = "Cerrado";
      break;
    case "OPEN":
      spanish = "Iniciado";
      break;

    default:
      spanish = value;
  }

  return spanish;
};

export const getAreaTypeSpanish = (value) => {
  let spanish = "";

  switch (value) {
    case "stock":
      spanish = "Almacenes";
      break;
    case "sale":
      spanish = "Puntos de ventas";
      break;
    case "manufacturer":
      spanish = "Procesados";
      break;
    default:
      spanish = value;
  }

  return spanish;
};

export const getStatusOrderSpanish = (value) => {
  let spanish = "";

  switch (value) {
    case "DELIVERED":
      spanish = "Entregada";
      break;
    case "IN_TRANSIT":
      spanish = "En tránsito";
      break;
    case "REFUNDED":
      spanish = "Reembolsado";
      break;
    case "PAYMENT_PENDING":
      spanish = "Pago pendiente";
      break;
    case "IN_PROCESS":
      spanish = "En proceso";
      break;
    case "WITH_ERRORS":
      spanish = "Con errores";
      break;
    case "CREATED":
      spanish = "Creada";
      break;
    case "BILLED":
      spanish = "Facturada";
      break;
    case "CANCELLED":
      spanish = "Cancelada";
      break;
    case "CLOSED":
      spanish = "Cerrada";
      break;
    case "COMPLETED":
      spanish = "Completada";
      break;
    default:
      spanish = value;
  }

  return spanish;
};

export const getStatusOrderIcon = (value) => {
  let spanish = "";

  switch (value) {
    case "IN_PROCESS":
      spanish = faFileInvoice;
      break;
    case "CREATED":
      spanish = faFile;
      break;
    case "BILLED":
      spanish = faFileInvoiceDollar;
      break;
    case "CANCELLED":
      spanish = faMinusCircle;
      break;
    case "CLOSED":
      spanish = faWindowClose;
      break;
    default:
      spanish = value;
  }

  return spanish;
};

export const getPaymentWayOrderSpanish = (value) => {
  let spanish = "";

  switch (value) {
    case "CASH":
      spanish = "Efectivo";
      break;
    case "TRANSFER":
      spanish = "Transf";
      break;
    case "CARD":
      spanish = "Tarjeta";
      break;
    case "CREDIT_POINTS":
      spanish = "Tecopay";
      break;
    default:
      spanish = value;
  }

  return spanish;
};

export const getCashOperationSpanish = (value) => {
  let spanish = "";

  switch (value) {
    case "MANUAL_WITHDRAW":
      spanish = "Extracción";
      break;
    case "MANUAL_DEPOSIT":
      spanish = "Depósito";
      break;
    case "MANUAL_FUND":
      spanish = "Fondo";
      break;
    default:
      spanish = value;
  }

  return spanish;
};

export const getTypeProductSpanish = (value) => {
  let spanish = "";

  switch (value) {
    case "RAW":
      spanish = "Materia prima";
      break;
    case "WASTE":
      spanish = "Desperdicio";
      break;
    case "MANUFACTURED":
      spanish = "Procesado";
      break;
    case "ASSET":
      spanish = "Activo";
      break;
    default:
      spanish = "Para vender";
  }

  return spanish;
};

export const getNewProductTittle = (value) => {
  let spanish = "";

  switch (value) {
    case "RAW":
      spanish = "materia prima";
      break;
    case "WASTE":
      spanish = "desperdicio";
      break;
    case "MANUFACTURED":
      spanish = "procesado";
      break;
    case "ASSET":
      spanish = "activo";
      break;
    case "STOCK":
      spanish = "producto de almacén";
      break;
    case "MENU":
      spanish = "producto eleborado";
      break;
    case "ADDON":
      spanish = "agrego";
      break;
    case "SERVICE":
      spanish = "servicio";
      break;
    case "COMBO":
      spanish = "combo";
      break;
    case "VARIATION":
      spanish = "producto variable";
      break;
    default:
      spanish = "para vender";
  }

  return spanish;
};

// export const getAreaTypePlanFree = (value) => {
//   let area = {};

//   switch (value) {
//     case "SALE":
//       area = {
//         image: infoPages.PuntosDeVenta.image,
//         title: infoPages.PuntosDeVenta.title,
//         text: infoPages.PuntosDeVenta.text,
//       };
//       break;
//     case "STOCK":
//       area = {
//         image: infoPages.Almacenes.image,
//         title: infoPages.Almacenes.title,
//         text: infoPages.Almacenes.text,
//       };
//       break;
//     case "MANUFACTURER":
//       area = {
//         image: infoPages.Procesados.image,
//         title: infoPages.Procesados.title,
//         text: infoPages.Procesados.text,
//       };
//       break;

//     default:
//       area = value;
//   }

//   return area;
// };

export const getOperationIcon = (value) => {
  let icon = "";

  switch (value) {
    case "ENTRY":
      icon = faSignInAlt;
      break;
    case "MOVEMENT":
      icon = faDollyBox;
      break;
    case "OUT":
      icon = faSignOutAlt;
      break;
    case "PROCESSED":
      icon = faDiagramProject;
      break;
    case "REMOVED":
      icon = faTrash;
      break;
    case "ADJUST":
      icon = faSlidersH;
      break;
    case "WASTE":
      icon = faMinusSquare;
      break;
    case "SALE":
      icon = faCashRegister;
      break;
    default:
      icon = value;
  }

  return icon;
};

export const getOperationInventoryIcon = (value) => {
  let icon = "";

  switch (value) {
    case "CLOSED":
      icon = faWindowClose;
      break;
    case "OPEN":
      icon = faPlusSquare;
      break;

    default:
      icon = value;
  }

  return icon;
};

export const getProductTypeIcon = (value) => {
  let icon = "";
  switch (value) {
    case "RAW":
      icon = faSquare;
      break;
    case "WASTE":
      icon = faMinusSquare;
      break;
    case "MANUFACTURED":
      icon = faDiagramProject;
      break;
    case "ASSET":
      icon = faCalculator;
      break;
    case "ADDON":
      icon = faAdd;
      break;
    case "STOCK":
      icon = faLayerGroup;
      break;
    case "MENU":
      icon = faFire;
      break;
    case "SERVICE":
      icon = faThLarge;
      break;
    case "COMBO":
      icon = faBoxes;
      break;
    case "VARIATION":
      icon = faPallet;
      break;
    default:
      icon = faMoneyBill1Wave;
  }
  return icon;
};

export const getOperationSpanish = (value) => {
  let spanish = "";

  switch (value) {
    case "ENTRY":
      spanish = "Entrada";
      break;
    case "MOVEMENT":
      spanish = "Traslado";
      break;
    case "OUT":
      spanish = "Salida";
      break;
    case "PROCESSED":
      spanish = "Procesado";
      break;
    case "REMOVED":
      spanish = "Eliminado";
      break;
    case "ADJUST":
      spanish = "Ajuste";
      break;
    case "WASTE":
      spanish = "Desperdicios";
      break;
    case "SALE":
      spanish = "Venta";
      break;
    default:
      spanish = value;
  }

  return spanish;
};

export const isReadyForSale = (value) => {
  switch (value) {
    case "RAW":
      return false;
    case "":
      return false;
    case "MANUFACTURED":
      return false;
    case "WASTE":
      return false;
    case "ASSET":
      return false;
    default:
      return true;
  }
};

export function printPrice(price) {
  if (!price) {
    return "0.00";
  }

  return price.toFixed(2);
}

export function printPriceFourDigits(price) {
  if (!price) {
    return "0.00";
  }

  return price.toFixed(4);
}

export const roundToTwoDecimal = (value) => {
  if (value === 0) {
    return 0;
  }
  return Math.ceil(value * 100) / 100;
};

export const roundToFourDecimal = (value) => {
  if (value === 0) {
    return 0;
  }
  return Math.round(value * 10000) / 10000;
};

export const formatDateTime = (date, article) => {

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
        `${article ? "[el]" : ""} D [de] MMM`
      );
    }
    return moment(date).format(
      `${article ? "[el]" : ""} D [de] MMM YYYY`
    );
  }
  return "-";
};