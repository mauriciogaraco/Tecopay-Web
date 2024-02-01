
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import query from '../../api/APIServices';


export type Entity = {
  totalItems: number;
  currentPage: number;
  totalPages: number;
  items: Item[];
}

export type Item = {
  id: number;
  name: string;
  address: string;
  phone: string;
  status: string;
  allowCreateAccount: boolean;
  profileImageId: number;
  owner: Owner;
  business: Business;
  category: Category[];
  profileImage: Image;
}

export type Business = {
  name: string;
}

export type Category = {
  id: number;
  name: string;
  color: string;
  isBasic: boolean;
  cardImageId: number;
  cardImage: Image;
  IssueEntityCategory: IssueEntityCategory;
}

export type IssueEntityCategory = {
  issueEntityId: number;
  categoryId: number;
  createdAt: Date;
  updatedAt: Date;
}

export type Image = {
  id: number;
  url: string;
  hash: string;
}

export type Owner = {
  id: number;
  fullName: string;
  email: string;
}


interface InitialState {
  loading: boolean;
  entities: Entity;
}


export const fetchEntities = createAsyncThunk(
  'init/entityStatus',
  async (_, thunkAPI) => {
    try {
      // Fetch data from the entity endpoint
      const entityResponse = await query.get('/entity');
      const entities = entityResponse.data;

      if (!entities) {
        return {};
      }

      //  // Extract the unique 'id' values
      //  const uniqueIds = Array.from(new Set(entities.map((entity: Entity) => entity.id)));

      //  // Make individual requests for each 'id' to the categories endpoint
      //  const entityCategoriesPromises = uniqueIds.map(async (id) => {
      //    const detailsResponse = await query.get(`/categories/${id}`);
      //    return detailsResponse.data; // Assuming detailsResponse.data is an array
      //  });

      //  // Wait for all requests to complete
      //  const entityCategories = await Promise.all(entityCategoriesPromises);

      //  // Combine the original entities with the details based on 'id'
      //  const combinedData = entities.map((entity: Entity) => {
      //    // Find the array of details that matches the entity's id
      //    const detailsArray = entityCategories.find((details) => details[0]?.issueEntityId === entity.id);

      //    const details = detailsArray ? detailsArray : [];

      //    return { ...entity, categories: details };
      //  });

      return entities;
    } catch (error) {
      // Handle errors here
      console.error('Error fetching data:', error);
      throw error;
    }
  },
);


const initialState: InitialState = {
  loading: false,
  entities: {
    totalItems: 0,
    currentPage: 0,
    totalPages: 0,
    items: [],
  },
};

const entitySlice = createSlice({
  initialState,
  name: 'entityState',
  reducers: {
    // ...
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEntities.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchEntities.fulfilled, (state, action) => {
        state.entities = action.payload;
        state.loading = false;
      })
      .addCase(fetchEntities.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default entitySlice.reducer;

