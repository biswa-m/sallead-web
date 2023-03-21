export const getPhoneNumber = (user) => {
  try {
    return {
      phoneNo: `+${user.countryCode || ""}${user.phone || ""}`,
      formated: `+${user.countryCode || ""} ${user.phone?.substr(0, 5) || ""} ${
        user.phone?.substr(5) || ""
      }`,
    };
  } catch (e) {
    console.warn(e.message);
    return { phoneNo: "", formated: "" };
  }
};
