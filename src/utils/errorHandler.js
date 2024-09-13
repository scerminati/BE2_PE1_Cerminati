export const handleError = (res, error, message) => {
  console.error(error);
  res.status(500).render("error/error", { msg: message });
};
