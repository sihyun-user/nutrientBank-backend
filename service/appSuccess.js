const appSuccess = (obj) => {
  const {res, data, message} = obj;
  res.send({
    sattus: true,
    message,
    data
  })
};

module.exports = appSuccess;