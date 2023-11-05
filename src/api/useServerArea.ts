import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  //updateAreas,
  //updateCurrentArea,
  //updateAreaAfterDelete,
} from "../store/slices/nomenclatorSlice";
import query from "./APIServices";
/*import {
  AreasInterface,
  PaginateInterface,
  Movement,
  DispatchItemInterface,
  StockAreaProducts,
  AreaResourcesInterface,
  ProductInterface,
  StockInventoryReport,
  StockReport,
  ShareArea,
  StockAviable,
  StockAviableInterface,
  StockAvailableCategoriesInterface,
} from "./../interfaces/ServerInterfaces";*/
import { toast } from "react-toastify";
import {
  //exportExcel,
  formatCurrency,
  generateUrlParams,
} from "../utils/helpers";
import useServer from "./useServer";
import { BasicType } from "../interfaces/InterfacesLocal";
//import { translateProductTypes } from "./utils/translate";

const useServerArea = () => {
  const dispatch = useAppDispatch();
  //const { business } = useAppSelector((state) => state.init);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [paginate, setPaginate] = useState<any | null>(null);
  const [allAreas, setAllAreas] = useState<any[]>([]);
  const [area, setArea] = useState<any | null>(null); //current Area
  const [allMovements, setAllMovements] = useState<any[]>([]);
  const [movement, setMovement] = useState<any | null>(null);
  const [allDispatches, setAllDispatches] = useState<any[]>(
    []
  );
  const [stockProducts, setStockProducts] = useState<any[]>([]); //Products of current Area
  const [stockToFilterProduct, setToFilterProduct] = useState<any[]>([]);
  const [stockToFilterCategory, setToFilterCategory] = useState<any[]>([]);
  const [despacho, setDespacho] = useState<any | null>(null);
  const [sharesAreas, setSharesAreas] = useState<any[]>([]);
  const [sharesAreasConfiguration, setSharesAreasConfiguration] = useState<
  any[]
  >([]);
  const [areaResources, setAreaResources] = useState<any[]>(
    []
  );
  const [quickProductReport, setQuickProductReport] =
    useState<any | null>(null);
  const [stockInvestmentReport, setStockInvestmentReport] =
    useState<any | null>(null);

  const [stockAviable, setStockAviable] = useState<any | null>(null);
  const [pendingDispatchCount, setPendingDispatchCount] = useState(0);
  const { manageErrors } = useServer();

  const updateStockProductState = (product: any) => {
    let newProdArray = [...stockProducts];
    const index = newProdArray.findIndex(
      (value) => value.product.id === product.id
    );
    if (index !== -1)
      newProdArray.splice(index, 1, { ...newProdArray[index], product });
    setStockProducts(newProdArray);
  };

  const getProductsByArea = async (
    areaId?: string,
    filter?: Record<string, string | number | boolean | null>
  ) => {
    setIsLoading(true);
    await query
      .get(`/administration/product/area/${areaId}${generateUrlParams(filter)}`)
      .then((resp) => {
        setStockProducts(resp.data.items);
        setPaginate({
          totalItems: resp.data.totalItems,
          totalPages: resp.data.totalPages,
          currentPage: resp.data.currentPage,
        });
      })
      .catch((e) => {
        manageErrors(e);
      });

    setIsLoading(false);
  };

  const getAllAreas = async (filter?: BasicType) => {
    setIsLoading(true);
    await query
      .get(`/administration/area${generateUrlParams(filter)}`)
      .then((resp) => {
        setAllAreas(resp.data.items);
        setPaginate({
          currentPage: resp.data.currentPage,
          totalItems: resp.data.totalItems,
          totalPages: resp.data.totalPages,
        });
      })
      .catch((e) => manageErrors(e));
    setIsLoading(false);
  };

  const getAreasToDispatch = async () => {
    setIsLoading(true);
    await Promise.all([
      query.get("/administration/area?type=STOCK&all_data=true"),
      query.get("/administration/sharedarea"),
    ])
      .then((resp) => {
        setAllAreas(resp[0].data.items);
        setSharesAreas(resp[1].data.items);
      })
      .catch((e) => manageErrors(e));
    setIsLoading(false);
  };

  const getSharesAreas = async () => {
    setIsLoading(true);
    await query
      .get("/administration/sharedarea")
      .then((resp) => setSharesAreas(resp.data.items))
      .catch((e) => manageErrors(e));
    setIsLoading(false);
  };

  const getArea = async (id: number) => {
    setIsLoading(true);
    await query
      .get(`/administration/area/${id}`)
      .then((resp) => {
        setArea(resp.data);
      })
      .catch((e) => {
        manageErrors(e);
      });
    setIsLoading(false);
  };

  const addArea = async (data: BasicType, closeModal: Function) => {
    setIsFetching(true);
    await query
      .post("/administration/area", data)
      .then((resp) => {
        //dispatch(updateAreas(resp.data));
        setAllAreas([resp.data, ...allAreas]);
        closeModal();
        toast.success("Área insertada correctamente");
      })
      .catch((e) => manageErrors(e));
    setIsFetching(false);
  };

  const deleteArea = async (id: string, callback: Function) => {
    setIsFetching(true);
    await query
      .deleteAPI(`/administration/area/${id}`, {})
      .then(() => {
        //dispatch(updateAreaAfterDelete(id));
        toast.success("Se elimino el área correctamente");
        callback();
      })
      .catch((error) => manageErrors(error));
    setIsFetching(false);
  };

  const updateArea = async (
    id: number,
    data: Record<string, string | number | boolean | (string | number)[]>,
    closeModal?: Function
  ) => {
    setIsFetching(true);
    await query
      .patch(`/administration/area/${id}`, data)
      .then((resp) => {
        setArea(resp.data);
        //dispatch(updateCurrentArea(resp.data));
        toast.success("Se actualizó el área correctamente");
        closeModal && closeModal();
      })
      .catch((e) => {
        manageErrors(e);
      });
    setIsFetching(false);
  };

  const getAreaResources = (id: string) => {
    setIsLoading(true);
    const promise = query.get(`/administration/resource/${id}`);
    promise
      .then((resp) => {
        setAreaResources(resp.data.items);
        setPaginate({
          currentPage: resp.data.currentPage,
          totalItems: resp.data.totalItems,
          totalPages: resp.data.totalPages,
        });
        setIsLoading(false);
      })
      .catch((e) => {
        setIsLoading(false);
        manageErrors(e);
      });
  };

  const addAreaResource = (
    areaId: string,
    data: Record<string, string | number | boolean>,
    closeModal: Function
  ) => {
    setIsFetching(true);
    const promise = query.post(`/administration/resource/${areaId}`, data);
    promise
      .then((resp) => {
        setAreaResources([resp.data, ...areaResources]);
        setIsFetching(false);
        closeModal();
      })
      .catch((e) => {
        manageErrors(e);
        setIsFetching(false);
      });
    toast.promise(promise, {
      success: "Recurso creado correctamente",
      pending: `Creando ${data.code} ...`,
    });
  };

  const updateAreaResource = (
    id: number,
    data: Record<string, string | number | boolean>,
    closeModal: Function
  ) => {
    setIsFetching(true);
    const promise = query.patch(`/administration/resource/${id}`, data);
    promise
      .then((resp) => {
        const resources = areaResources;
        const updElem = resources.findIndex((item) => item.id === id);
        resources.splice(updElem, 1, resp.data);
        setAreaResources(resources);
        closeModal();
        setIsFetching(false);
      })
      .catch((e) => {
        manageErrors(e);
        setIsFetching(false);
      });
    toast.promise(promise, {
      pending: "Actualizando el recurso, por favor espere ...",
      success: "Recurso actualizado",
    });
  };

  const deleteAreaResource = (id: string, closeModal: Function) => {
    setIsFetching(true);
    const promise = query.deleteAPI(`/administration/resource/${id}`, {});
    promise
      .then(() => {
        setAreaResources(
          areaResources.filter((item) => item.id !== Number(id))
        );
        setIsFetching(false);
        closeModal();
      })
      .catch((e) => manageErrors(e));
    toast.promise(promise, {
      pending: "Eliminando recurso ...",
      success: "Recurso eliminado con éxito.",
    });
  };

  const getMovementByArea = async (
    filter?: Record<string, string | boolean | number | null>
  ) => {
    setIsLoading(true);
    await query
      .get(`/administration/movement${generateUrlParams(filter)}`)
      .then((resp) => {
        setAllMovements(resp.data.items);
        setPaginate({
          currentPage: resp.data.currentPage,
          totalItems: resp.data.totalItems,
          totalPages: resp.data.totalPages,
        });
      })
      .catch((e) => manageErrors(e));

    setIsLoading(false);
  };

  const getMovement = async (id: number) => {
    setIsLoading(true);
    await query
      .get(`/administration/movement/${id}`)
      .then((resp) => {
        setMovement(resp.data);
      })
      .catch((e) => manageErrors(e));
    setIsLoading(false);
  };

  /*const addMovement = async (
    type: string,
    data: Record<string, any>,
    closeModal: Function
  ) => {
    const typeToApi = type === "MOVEMENT" ? "move" : type?.toLocaleLowerCase();
    setIsFetching(true);
    await query
      .post(`/administration/movement/bulk/${typeToApi}`, data)
      .then((resp) => {
        const newStock = [...stockProducts];
        let newCost = quickProductReport?.total_cost.amount ?? 0;
        let newSale = quickProductReport?.total_estimated_sales.amount ?? 0;
        let newTotalType = quickProductReport?.total_products_type ?? 0;
        resp.data.forEach((element: any) => {
          const index = newStock.findIndex(
            (item) => item.product.id === element.product.id
          );
          let priceAmount: number = 0;
          const price = element.product.prices.find(
            (price: any) => price.isMain
          );
          if (price) {
            //if (price.codeCurrency === business?.mainCurrency) {
              priceAmount = price.price;
            } else {
             // const exchangeRate = business?.availableCurrencies.find(
                //(item) => item.code === price?.codeCurrency
            //  )?.exchangeRate!;
              //priceAmount = price.price * exchangeRate;
            }
          }
          /*if (index !== -1) {
            let quantity: number = newStock[index].quantity;
            const variationIndex = newStock[index]?.variations?.findIndex(
              //(itm) => itm.variationId === element?.variation?.id
            );
            let variationQuantity =
              variationIndex !== -1
                ? newStock[index].variations[variationIndex].quantity
                : element.variation !== null
                ? 0
                : undefined;
            if (type === "MOVEMENT") {
              quantity -= element.quantity;
              if (variationQuantity) variationQuantity -= element.quantity;
              newCost -= element.quantity * newStock[index].product.averageCost;
              newSale -= element.quantity * priceAmount;
              if (quantity === 0) newTotalType--;
            } else {
              quantity += element.quantity;
              if (variationQuantity !== undefined)
                variationQuantity += element.quantity;
              newCost += element.quantity * element.product.averageCost;
              newSale += element.quantity * priceAmount;
              if (quantity === 0) newTotalType--;
            }
            newStock.splice(index, 1, {
              ...newStock[index],
              quantity,
            });
            if (variationIndex !== -1 && variationQuantity !== undefined) {
              const currentVar = newStock[index].variations[variationIndex];
              newStock[index].variations.splice(variationIndex, 1, {
                ...currentVar,
                quantity: variationQuantity,
              });
            } else if (variationQuantity !== undefined) {
              newStock[index].variations.push({
                id:0,
                variationId: element.variation.id,
                quantity: element.quantity,
                variation: {
                  id: element.variation.id,
                  name: element.variation.name,
                  attributes:[], 
                  description:"", 
                  image:[], 
                  onSale:false,
                  onSalePrice:null, 
                  price:null
                },
              });
            }
          } else {
            newTotalType++;
            newCost += element.quantity * element.product.averageCost;
            newSale += element.quantity * priceAmount;
            const variation = element.variation
              ? [
                  {
                    variationId: element.variation.id,
                    quantity: element.quantity,
                    variation: {
                      id: element.variation.id,
                      name: element.variation.name,
                    },
                  },
                ]
              : [];
            newStock.push({ ...element, variations: variation });
          }
        });
        setStockProducts(newStock.filter((itm) => itm.quantity !== 0));

        //Report---------------------------------------------------------
        quickProductReport &&
          setQuickProductReport({
            total_products_type: newTotalType,
            total_cost: { ...quickProductReport.total_cost, amount: newCost },
            total_estimated_sales: {
              ...quickProductReport.total_estimated_sales,
              amount: newSale,
            },
            total_estimated_profits: {
              ...quickProductReport.total_estimated_profits,
              amount: newSale - newCost,
            },
          });
        //------------------------------------------------------------------
        toast.success("Operación realizada con éxito");
        closeModal();
      })
      .catch((e) => manageErrors(e));
    setIsFetching(false);
  };
*/
  const deleteMovements = async (
    areaId: number | string,
    dateEnd: string,
    closeModal?: Function
  ) => {
    setIsFetching(true);
    await query
      .deleteAPI(`/administration/bulk-movement/delete`, { dateEnd, areaId })
      .then(() => {
        closeModal && closeModal();
        toast.success("Operaciones eliminadas con éxito");
      })
      .catch((e) => manageErrors(e));
    setIsFetching(false);
  }

  const deleteStockMovement = (
    id: number,
    data: { description: string },
    closeModal: Function
  ) => {
    setIsFetching(true);
    query
      .deleteAPI(`/administration/movement/${id}`, data)
      .then(() => {
        setIsFetching(false);
        closeModal();
      })
      .catch((e) => {
        setIsFetching(false);
        toast.error(
          e.response?.data?.message ?? "Error al eliminar la operación"
        );
      });
  };

  const getAllDispatches = async (
    filter?: Record<string, string | number | boolean | null>
  ) => {
    setIsLoading(true);
    await query
      .get(`/administration/dispatch${generateUrlParams(filter)}`)
      .then((resp) => {
        setAllDispatches(resp.data.items);
        setPaginate({
          currentPage: resp.data.currentPage,
          totalItems: resp.data.totalItems,
          totalPages: resp.data.totalPages,
        });
      })
      .catch((e) => manageErrors(e));

    setIsLoading(false);
  };

  const addDispatch = async (
    data: any, //DispatchItemInterface,
    closeModal: Function
  ) => {
    setIsFetching(true);
    await query
      .post("/administration/dispatch", data)
      .then((resp) => {
        setAllDispatches([resp.data, ...allDispatches]);
        toast.success("Operación realizada exitosamente");
        closeModal();
      })
      .catch((e) => manageErrors(e));
    setIsFetching(false);
  };

  const getDispatch = async (id: number) => {
    setIsLoading(true);
    await query
      .get("/administration/dispatch/" + id)
      .then((resp) => setDespacho(resp.data))
      .catch((e) => manageErrors(e));
    setIsLoading(false);
  };

  const responseDispatch = async (
    id: number,
    response: "ACCEPTED" | "REJECTED",
    closeModal: Function
  ) => {
    setIsFetching(true);
    await query
      .patch(`/administration/dispatch/${response}/${id}`, {})
      .then((resp) => {
        const idx = allDispatches.findIndex((item) => item.id === id);
        const updated = allDispatches;
        updated.splice(idx, 1, resp.data);
        setAllDispatches(updated);
        closeModal();
      })
      .catch((e) => manageErrors(e));
    setIsFetching(false);
  };

  const getStockInvestmentReport = async () => {
    setIsLoading(true);
    await query
      .get("/report/stock/inventory")
      .then((resp) => setStockInvestmentReport(resp.data))
      .catch((e) => manageErrors(e));
    setIsLoading(false);
  };

  const changeStockReportState = (idx: number, checked: boolean) => {
    if (stockInvestmentReport) {
      const { mainCurrency, result } = stockInvestmentReport;
      result.splice(idx, 1, { ...result[idx], active: checked });
      setStockInvestmentReport({ mainCurrency, result });
    }
  };

  const getStockAreaData = async (
    areaId: string,
    filter?: Record<string, string | number | boolean | null>
  ) => {
    setIsLoading(true);
    await Promise.all([
      query.get(
        `/administration/stock/quick-report/${areaId}${generateUrlParams({
          all_data: true,
          ...filter,
        })}`
      ), //Quick Stock Reports
      query.get(
        `/administration/product/area/${areaId}${generateUrlParams(filter)}`
      ),
    ]).then((resp) => {
      setQuickProductReport(resp[0].data);
      setStockProducts(resp[1].data.items);
      setPaginate({
        currentPage: resp[1].data.currentPage,
        totalItems: resp[1].data.totalItems,
        totalPages: resp[1].data.totalPages,
      });
    });
    setIsLoading(false);
  };

  /*const exportStockProducts = async (
    areaId: string,
    filename: string,
    filter: BasicType,
    callback?: Function
  ) => {
    setIsFetching(true);
    await query
      .get(
        `/administration/product/area/${areaId}${generateUrlParams({
          ...filter,
          all_data: true,
        })}`
      )
      .then((resp) => {
        const stockProd: StockAreaProducts[] = resp.data.items;
        const dataToExport: Record<string, string | number>[] = [];
        stockProd.map((item) => {
          const price = item.product.prices.find((price) => price.isMain);
          dataToExport.push({
            Producto: item.product.name,
            Tipo: translateProductTypes(item.product.type),
            "Categoría de venta": item.product.salesCategory?.name,
            "Categoría de almacén": item.product.productCategory?.name,
            [`Costo Unitario en ${business?.mainCurrency}`]: item.product.averageCost,
            Disponibilidad: item.quantity,
            [`Costo total en ${business?.mainCurrency}`]: item.quantity * item.product.averageCost,
            Precio: price?.price??"-",
            Moneda: price?.codeCurrency??"-",
          });
        });
        exportExcel(dataToExport, filename);
        callback && callback();
      })
      .catch((e) => manageErrors(e));
    setIsFetching(false);
  };*/

  //-------- AREAS COMPARTIDAS

  const getSharesAreasConfiguration = async () => {
    setIsLoading(true);
    await query
      .get("/administration/my-shared-area")
      .then((resp) => {
        setSharesAreasConfiguration(resp.data.rows);
      })
      .catch((e) => manageErrors(e));
    setIsLoading(false);
  };

  const addShareArea = async (data: BasicType, closeModal: Function) => {
    setIsFetching(true);

    await query
      .post("/administration/sharedarea", data)
      .then((resp) => {
        setSharesAreasConfiguration([resp.data, ...sharesAreasConfiguration]);
        closeModal();
        toast.success("Área compartida correctamente");
      })
      .catch((e) => manageErrors(e));
    setIsFetching(false);
  };

  const deleteShareArea = async (id: string, callback: Function) => {
    setIsFetching(true);
    await query
      .deleteAPI(`/administration/sharedarea/${id}`, {})
      .then(() => {
        setSharesAreasConfiguration(
          sharesAreasConfiguration.filter((item) => item.id !== Number(id))
        );
        callback();
        toast.success("Se eliminó la Cuenta correctamente");
      })
      .catch((error) => manageErrors(error));

    setIsFetching(false);
  };

  //availability stock

  /*const getAllStockAviables = async (
    filter: BasicType | undefined,
    is_only_category: boolean
  ) => {
    if (!stockAviable?.products) {
      setIsLoading(true);
      await query
        .get("/report/stock/disponibility")
        .then((resp) => {
          const mainCurrency = resp.data.mainCurrency;
          const products: StockAviableInterface[] = resp.data.result;
          products.sort((a, b) => a.productName.localeCompare(b.productName));
          const categories: StockAvailableCategoriesInterface[] = [];

          products.forEach((item) => {
            const index = categories.findIndex(
              (val) => val.salesCategoryName === item.salesCategoryName
            );
            if (index !== -1) {
              const current = { ...categories[index] };
              categories.splice(index, 1, {
                ...current,
                total_cost: item.total_cost + current.total_cost,
                total_disp: item.disponibility + current.total_disp,
                total_estimated_profits:
                  current.total_estimated_profits +
                  item.total_estimated_profits,
                total_estimated_sales:
                  current.total_estimated_sales + item.total_estimated_sales,
              });
            } else {
              categories.push({
                salesCategoryName: item.salesCategoryName,
                total_disp: item.disponibility,
                total_cost: item.total_cost,
                total_estimated_profits: item.total_estimated_profits,
                total_estimated_sales: item.total_estimated_sales,
                active: true,
              });
            }
          });
          categories.sort((a, b) =>
            a.salesCategoryName.localeCompare(b.salesCategoryName)
          );
          setStockAviable({ mainCurrency, products, categories });
          setToFilterCategory(categories);
          setToFilterProduct(products);
        })
        .catch((e) => manageErrors(e));
      setIsLoading(false);
    } else {
      if (filter?.search) {
        setIsLoading(true);
        const subcadena = filter.search.toString();
        const mainCurrency = stockAviable?.mainCurrency;

        let categories: StockAvailableCategoriesInterface[] | undefined = [];
        let products: StockAviableInterface[] | undefined = [];
        if (is_only_category && stockToFilterCategory.length > 0) {
          categories = stockToFilterCategory.filter((category) =>
            category.salesCategoryName
              .toLowerCase()
              .includes(subcadena.toLowerCase())
          );
        } else {
          if (!is_only_category && stockToFilterProduct.length > 0) {
            products = stockToFilterProduct.filter((product) =>
              product.productName
                .toLowerCase()
                .includes(subcadena.toLowerCase())
            );
          }
        }
        setStockAviable({ mainCurrency, products, categories });
      } else {
        const categories = stockToFilterCategory;
        let products = stockToFilterProduct;
        const mainCurrency = stockAviable?.mainCurrency;
        setStockAviable({ mainCurrency, products, categories });
      }
    }
    setIsLoading(false);
  };
*/
  const changeStockAviable = (idx: number, checked: boolean) => {
    if (stockAviable) {
      const products = [...stockAviable.products];
      products.splice(idx, 1, { ...products[idx], active: checked });
      setStockAviable({ ...stockAviable, products });
    }
  };
  const changeStockAviableCategory = (idx: number, checked: boolean) => {
    if (stockAviable) {
      const categories = [...stockAviable.categories];
      categories.splice(idx, 1, { ...categories[idx], active: checked });
      setStockAviable({ ...stockAviable, categories });
    }
  };

  const getTotalPendingDispatch = async (businessId: number) => {
    setIsLoading(true);
    try {
      const response = await query.get(
        `/administration/pending-dispatches/${businessId}`
      );
      setPendingDispatchCount(response.data.pending);
    } catch (error) {
      manageErrors(error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    isFetching,
    paginate,
    allAreas,
    sharesAreas,
    addShareArea,
    sharesAreasConfiguration,
    area,
    stockProducts,
    movement,
    allMovements,
    allDispatches,
    despacho,
    areaResources,
    stockInvestmentReport,
    quickProductReport,
    pendingDispatchCount,
    getAllAreas,
    getArea,
    addArea,
    updateArea,
    deleteArea,

    getMovementByArea,
    getMovement,
    deleteMovements,
    deleteStockMovement,
    addDispatch,
    getAllDispatches,
    getDispatch,
    responseDispatch,
    getSharesAreas,
    getProductsByArea,
    getAreaResources,
    updateAreaResource,
    deleteAreaResource,
    addAreaResource,
    updateStockProductState,
    getStockInvestmentReport,
    changeStockReportState,
    getStockAreaData,

    getSharesAreasConfiguration,
    deleteShareArea,
    getAreasToDispatch,

    stockAviable,
    changeStockAviable,
    changeStockAviableCategory,
    getTotalPendingDispatch,
  };
};

export default useServerArea;
