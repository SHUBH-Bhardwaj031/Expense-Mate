export const notFount = (req, resp, err) => {
  console.log("errr");
  // console.log(err.sta);
  console.log(err);
  // console.log(resp.statusCode);
  resp.status(404).json({
    message: "Route not found  !! ",
  });
};

export const errorHandler = (err, req, resp, next) => {
  const status = err.status || 500;
  const message = err.message || "Internal Server error";
  resp.status(status).json({
    message: message,
  });
};
