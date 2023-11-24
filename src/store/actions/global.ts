import { createAction, createAsyncThunk } from "@reduxjs/toolkit";
import moment from "moment";
import query from "../../api/APIServices";

import { roundToTwoDecimal } from "../../utils/functions";
import { translateWeekDays } from "../../utils/translate";
import { setBusinessId } from "../slices/sessionSlice";
import { generateUrlParams } from "../../utils/helpers";

import { AxiosResponse } from "axios";

export const initSystem = createAction<any>("/user/myuser");

export const closeSystem = createAction<any>("general/closeSystem");

export const changeBusiness = createAsyncThunk(
  "general/load",
  async (businessId: number | null, thunkAPI) => {
    thunkAPI.dispatch(setBusinessId(businessId));
    return await Promise.all([
      query.get("/security/user"), //User data
      query.get("/administration/my-branches"), //Branches Data
      query.get("/administration/area?all_data=true"), //Areas
      query.get("/administration/measures"), // Measures
      query.get("/administration/productcategory?all_data=true"), //Product Categories
      query.get("/administration/salescategory?all_data=true"), //Product Categories Sales
      query.get("/security/users?all_data=true"), //System Users
      query.get("/security/roles/admin"), //roles
      query.get("/administration/my-business"), //business information
      query.get("/administration/variation/attributes"),
      query.get("/administration/supplier?all_data=true"), //Suppliers
      query.get(`/administration/paymentways`), //paymentWays
      query.get(`/administration/humanresource/personcategory?all_data=true`), //personCategories
      query.get(`/administration/humanresource/personpost?all_data=true`), //personPosts

    ]).then((resp) => {
      return {
        user: resp[0].data,
        branches: resp[1].data,
        areas: resp[2].data.items,
        measures: resp[3].data,
        productCategories: resp[4].data.items,
        salesCategories: resp[5].data.items,
        businessUsers: resp[6].data.items,
        roles: resp[7].data,
        business: resp[8].data,
        product_attributes: resp[9].data,
        suppliers: resp[10].data.items,
        paymentWays:resp[11].data,
        personCategories:resp[12].data.items,
        personPosts:resp[13].data.items,
      };
    });
  }
);

export const getGraphData = createAsyncThunk(
  "general/commonGraph",
  async ({
    dateMode,
    dateRange,
    businessMode,
  }: {
    dateMode: "yesterday" | "today" | "week" | "month" | "year" | "custom";
    dateRange?: { dateFrom: string; dateTo: string };
    businessMode: "single" | "group";
  }) => {
    let currentQuery: Promise<AxiosResponse<any, any>>[];

    if (businessMode === "single") {
      currentQuery = [
        query.get(`/report/incomes/sales/${dateMode}`),
        query.get(`/report/selled-products/most-selled/${dateMode}`),
      ];
    } else if (
      businessMode === "group" &&
      ["yesterday", "today", "custom"].includes(dateMode)
    ) {
      currentQuery = [
        query.get(`/report/incomes/total-sales${generateUrlParams(dateRange)}`),
      ];
    } else {
      currentQuery = [
        query.get(`/report/incomes/sales/${dateMode}`),
        query.get(`/report/selled-products/most-selled/${dateMode}`),
        query.get(`/report/incomes/total-sales${generateUrlParams(dateRange)}`),
      ];
    }

    /*const apiQuery = await Promise.all(currentQuery).then((resp) => {
      let dataToSend: GraphDataInterface | null = {
        businessMode: businessMode,
        dateMode,
      };

      if (
        businessMode === "single" ||
        (businessMode === "group" &&
          !["yesterday", "today", "custom"].includes(dateMode))
      ) {
        //business graph data------------------------------------------------
        let axisLabel: string[] = [];
        let totalSales: number[] = [];
        let totalCost: number[] = [];
        let grossProfit: number[] = [];
        let totalIncomes: number[] = [];
        let maxValue: number = 0;
        let minValue: number = 0;
        const sortedData = resp[0].data.sort((a: any, b: any) => {
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          return Number(dateA) - Number(dateB);
        });
        sortedData.forEach((item: LastIncomesInterface) => {
          if (item.date) {
            switch (dateMode) {
              case "week":
                axisLabel.push(translateWeekDays(item.day));
                break;
              case "month":
                axisLabel.push(moment(item.date).format("ddd D / M"));
                break;
              case "year":
                axisLabel.push(moment(item.date).format("MMMM Y"));
                break;

              default:
                break;
            }

            totalSales.push(roundToTwoDecimal(item.totalSales));
            totalCost.push(roundToTwoDecimal(item.totalCost));
            grossProfit.push(roundToTwoDecimal(item.grossProfit));
            totalIncomes.push(roundToTwoDecimal(item.totalIncomes));
            if (
              Math.max(
                item.totalSales,
                item.totalCost,
                item.grossProfit,
                item.totalIncomes
              ) > maxValue
            ) {
              maxValue = Math.max(
                item.totalSales,
                item.totalCost,
                item.grossProfit,
                item.totalIncomes
              );
            }
            if (
              Math.min(
                item.totalSales,
                item.totalCost,
                item.grossProfit,
                item.totalIncomes
              ) < minValue
            ) {
              minValue = Math.min(
                item.totalSales,
                item.totalCost,
                item.grossProfit,
                item.totalIncomes
              );
            }
          }
        });
        dataToSend.dateRange = {
          dateFrom: sortedData[0].date,
          dateTo: sortedData[sortedData.length - 1].date,
        };
        dataToSend.businessData = {
          axisLabel,
          totalSales,
          totalCost,
          grossProfit,
          totalIncomes,
          maxValue,
          minValue,
          mostSelled: resp[1].data,
        };
        //------------------------------------------------------------
      }

      if (businessMode === "group") {
        dataToSend.groupData = ["yesterday", "today", "custom"].includes(
          dateMode
        )
          ? resp[0].data
          : resp[2].data;
      }

      return dataToSend;
    });

    return apiQuery;
  }
)*/;})
