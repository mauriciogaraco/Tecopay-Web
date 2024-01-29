
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import query from '../../api/APIServices';


type Entity = {
  id: number;
  name: string;
  address: string;
  phone: string;
  status: string;
  allowCreateAccount: boolean;
  profileImageId: number;
  owner: Owner;
  business: Business;
  category?: number;
  profileImage: ProfileImage;
  categories: categories[];
}

export type categories = {
  id: number;
  name: string;
  color: string;
  cardImageId: number;
  issueEntityId: number;
  createdAt: Date;
  updatedAt: Date;
}


type Business = {
  externalId: number;
  name: string;
}

type Owner = {
  fullName: string;
  email: string;
}

type ProfileImage = {
  id: number;
  url: string;
  hash: string;
}


interface InitialState {
  loading: boolean;
  entities: Entity[];
}


export const fetchEntities = createAsyncThunk(
  'init/entityStatus',
  async (_, thunkAPI) => {
    try {
      // Fetch data from the entity endpoint
      const entityResponse = await query.get('/entity');
      const entities = entityResponse.data?.items;

      if (!entities) {
        return [];
      }

      // Extract the unique 'id' values
      const uniqueIds = Array.from(new Set(entities.map((entity: Entity) => entity.id)));

      // Make individual requests for each 'id' to the categories endpoint
      const entityCategoriesPromises = uniqueIds.map(async (id) => {
        const detailsResponse = await query.get(`/categories/${id}`);
        return detailsResponse.data; // Assuming detailsResponse.data is an array
      });

      // Wait for all requests to complete
      const entityCategories = await Promise.all(entityCategoriesPromises);

      // Combine the original entities with the details based on 'id'
      const combinedData = entities.map((entity: Entity) => {
        // Find the array of details that matches the entity's id
        const detailsArray = entityCategories.find((details) => details[0]?.issueEntityId === entity.id);

        const details = detailsArray ? detailsArray : [];

        return { ...entity, categories: details };
      });

      return combinedData;
    } catch (error) {
      // Handle errors here
      console.error('Error fetching data:', error);
      throw error;
    }
  },
);


const initialState: InitialState = {
  loading: false,
  entities: [],
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

