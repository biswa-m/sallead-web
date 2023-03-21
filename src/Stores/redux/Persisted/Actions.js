import { createActions } from "reduxsauce";

const { Types, Creators } = createActions({
  setPState: ["data"],
  resetPState: null,
  
  setPScreenState: ["screen", "data"],
  
  fetchMyProfile: null,
});

export const StoreTypes = Types;
export default Creators;
