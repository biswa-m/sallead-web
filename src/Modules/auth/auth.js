import { store } from "../../store";
import PersistedActions from "../../Stores/redux/Persisted/Actions";
import UnpersistedActions from "../../Stores/redux/Unpersisted/Actions";

const authModule = {};

authModule.login = (user) => {
  store.dispatch(
    PersistedActions.setPScreenState("AUTH", {
      user,
    })
  );
};

authModule.logout = async () => {
  console.info("Logging out");

  if (store) {
    store.dispatch(UnpersistedActions.resetVState());
    store.dispatch(PersistedActions.resetPState());
  }
};

authModule.confirmAndLogout = async () => {
  if (window.confirm("Confirm Logout", "Are you sure, you want to logout ?"))
    authModule.logout();
};

export default authModule;
