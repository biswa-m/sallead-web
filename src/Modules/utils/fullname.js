export function getFullName(user) {
  user = user || {};
  if (user.firstName || user.lastName)
    return `${user.firstName || ""} ${user.lastName || ""}`.trim();
  else if (user.title) return user.title; // in case of chatmap
}
