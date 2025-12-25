const validate = (body) => {
  const errors = {};
  if (!body.email) {
    errors.email = "email is required";
  }
  if (!body.password) {
    errors.password = "password is required";
  }
  return errors;
};
