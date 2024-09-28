const slugify = require("slugify");

module.exports = (v, { req }) => {
  req.body.slug = slugify(v);
  return Promise.resolve();
};
