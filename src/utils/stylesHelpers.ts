import { GrUserManager, GrUserWorker } from "react-icons/gr";
import {
  FaProjectDiagram,
  FaBoxes,
  FaLayerGroup,
  FaPallet,
  FaPlus,
  FaSquare,
  FaFire,
  FaCalculator,
  FaSignInAlt,
  FaDolly,
  FaSignOutAlt,
  FaSlidersH,
  FaRegMinusSquare,
} from "react-icons/fa";
import { FaArrowsRotate, FaUserTie } from "react-icons/fa6";
import { TbSquareMinus } from "react-icons/tb";
import {
  faCashRegister,
  faDiagramProject,
  faMinusSquare,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { PiSignInBold, PiSignOutBold } from "react-icons/pi";
import { TbAdjustments } from "react-icons/tb";
import { IconType } from "react-icons";

export const getOperationIcon: (value: string) => IconType = (value) => {
  switch (value) {
    case "ENTRY":
      return FaSignInAlt;

    case "MOVEMENT":
      return FaDolly;

    case "OUT":
      return FaSignOutAlt;

    case "ADJUST":
      return FaSlidersH;

    case "TRANSFORMATION":
      return FaArrowsRotate;

    case "WASTE":
      return FaRegMinusSquare;

    default:
      return FaBoxes;
  }
};

export const getProductIcon = (value: string) => {
  switch (value) {
    case "PROCESSED":
      return faDiagramProject;

    case "REMOVED":
      return faTrash;

    case "WASTE":
      return faMinusSquare;

    case "SALE":
      return faCashRegister;

    default:
      return;
  }
};

export const getColorOperationType = (value: string | null) => {
  switch (value) {
    case "ENTRY":
      return "bg-emerald-100 text-emerald-800";

    case "MOVEMENT":
      return "bg-blue-100 text-blue-800";

    case "OUT":
      return "bg-orange-100 text-orange-800";

    case "ADJUST":
      return "text-yellow-800";

    case "TRANSFORMATION":
      return "bg-slate-100 text-slate-800";

    case "WASTE":
      return "bg-purple-100 text-purple-800";

    default:
      return "";
  }
};

export const getColorProductType = (value: string) => {
  switch (value) {
    case "PROCESSED":
      return "bg-purple-100 text-purple-800";

    case "REMOVED":
      return "bg-red-100 text-red-800";

    case "WASTE":
      return "bg-stone-100 text-stone-800";

    case "SALE":
      return "bg-fuchsia-100 text-fuchsia-800";

    default:
      return "";
  }
};

export const getProductTypes = (availableTypes: string) => {
  const allProductTypes = [
    {
      icon: FaLayerGroup,
      title: "Almacén",
      description:
        "Formato contable y tangible que se gestiona a través de operaciones de entradas y salidas de un área",
      value: "STOCK",
    },
    {
      icon: FaPallet,
      title: "Variable",
      description:
        "Productos contables y tangibles de almacén que corresonden a una misma agrupación y que cuentan con diferentes atributos",
      value: "VARIATION",
    },
    {
      icon: FaPlus,
      title: "Agregos",
      description: "Productos que hacen función de agrego en otros productos",
      value: "ADDON",
    },
    {
      icon: FaSquare,
      title: "Materia prima",
      description:
        "Productos sin elaborar y que sirven de base para los procesos de producción.",
      value: "RAW",
    },
    {
      icon: FaProjectDiagram,
      title: "Procesado",
      description:
        "Aquellos que son resultado de un proceso de producción utilizando materias primas.",
      value: "MANUFACTURED",
    },
    {
      icon: TbSquareMinus,
      title: "Desperdicio",
      description:
        "Recursos derivados de operaciones de procesado y que pueden ser considerado como merma, o productos sin utilidad.",
      value: "WASTE",
    },
    {
      icon: FaFire,
      title: "Elaborado",
      description: "Requiere una elaboración previa o procesado.",
      value: "MENU",
    },
    {
      icon: FaUserTie,
      title: "Servicio",
      description:
        "Formato para denominar las prestaciones de utilidades que no consisten en productos materiales.",
      value: "SERVICE",
    },
    {
      icon: FaCalculator,
      title: "Activos",
      description:
        "Bienes o servicios tangibles o intangibles que forman parte de los procesos del negocio.",
      value: "ASSET",
    },
    {
      icon: FaBoxes,
      title: "Combo",
      description:
        "Permite agrupa un conjunto de productos de formato Elaborado o de Almacén.",
      value: "COMBO",
    },
  ];

  const prodTypesArray = availableTypes.split(",");

  return allProductTypes.filter((items) =>
    prodTypesArray.includes(items.value)
  );
};

export const getUserTypes = (availableTypes: string) => {
  const allUserTypes = [
    {
      icon: GrUserManager,
      title: "Dirección",
      description:
        "Usuarios con privilegios administrativos y poseedores de correo electrónico con acceso a las terminales web y móviles.",
      value: "manager",
    },
    {
      icon: GrUserWorker,
      title: "Trabajador",
      description:
        "Usuarios con permisos básicos de acceso exclusivo a las terminales de punto de venta.",
      value: "worker",
    },
  ];

  const userTypesArray = availableTypes.split(",");

  return allUserTypes.filter((items) => userTypesArray.includes(items.value));
};

export const getCouponTypes = (availableTypes: string) => {
  const allCouponsTypes = [
    {
      icon: FaLayerGroup,
      title: "Descuento en porcentaje",
      description:
        "Aplica un descuento basado en un porcentaje al precio total de la compra.",
      value: "PERCENT",
    },
    {
      icon: FaPallet,
      title: "Descuento fijo de producto",
      description: "Reduce el precio de un artículo específico en el carrito.",
      value: "FIXED_PRODUCT",
    },
    {
      icon: FaPlus,
      title: "Descuento fijo en el carrito",
      description:
        "Ofrece un ahorro en una cantidad fija para toda la compra en el carrito.",
      value: "FIXED_CART",
    },
  ];

  const couponTypesArray = availableTypes.split(",");

  return allCouponsTypes.filter((items) =>
    couponTypesArray.includes(items.value)
  );
};

export const getOrdersOrigin = (availableTypes: string) => {
  const allOrdersOrigin = [
    {
      title: "Online",
      value: "online",
    },
    {
      title: "WooCommerce",
      value: "woo",
    },
    {
      title: "POS",
      value: "pos",
    },
  ];

  const ordersOriginArray = availableTypes.split(",");

  return allOrdersOrigin.filter((items) =>
    ordersOriginArray.includes(items.value)
  );
};

export const getCouponOrdersStatus = (availableTypes: string) => {
  const allCouponsTypes = [
    {
      icon: FaLayerGroup,
      title: "Creada",
      value: "CREATED",
    },
    {
      icon: FaPallet,
      title: "En proceso",
      value: "IN_PROCCESS",
    },
    {
      icon: FaPlus,
      title: "Completada",
      value: "COMPLETED",
    },
    {
      icon: FaLayerGroup,
      title: "Facturada",
      value: "BILLED",
    },
    {
      icon: FaPallet,
      title: "Pre facturada",
      value: "PRE_BILLED",
    },
    {
      icon: FaPlus,
      title: "Cancelada",
      value: "CANCELLED",
    },
  ];

  const couponTypesArray = availableTypes.split(",");

  return allCouponsTypes.filter((items) =>
    couponTypesArray.includes(items.value)
  );
};

export const getIconByMovementType: (movement?: string) => IconType = (
  movementType
) => {
  switch (movementType) {
    case "MOVEMENT":
    case "OUT":
      return PiSignOutBold;
    case "ADJUST":
      return TbAdjustments;
    default:
      return PiSignInBold;
  }
};
