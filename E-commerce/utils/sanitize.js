exports.sanitizeUser = function (user) {
  return {
    id: user._id,
    username: user.name,
    email: user.email,
  };
};
