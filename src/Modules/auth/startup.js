import PersistedActions from "../../Stores/redux/Persisted/Actions";
// import UnpersistedActions from "../../Stores/redux/Unpersisted/Actions";
import { store } from "../../store";
import apiModule from "../api/apiModule";

export const fetchMyProfile = async () => {
  const { user } = await apiModule.fetchMyProfile();
  // console.warn(user, Math.random());
  store.dispatch(
    PersistedActions.setPScreenState("AUTH", {
      user,
    })
  );
};

export const initAuth = async () => {
  await fetchMyProfile();
};

export const startup = async () => {};
