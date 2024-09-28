const asyncHandler = require("express-async-handler");

const ApiError = require("../utils/apiError");
const ApiFeatures = require("../utils/ApiFeatures");

const adjustModelName = (Model) => {
  return Model.collection.collectionName.replace("s", "").toUpperCase();
};

exports.getAll = (Model) =>
  asyncHandler(async (req, res, next) => {
    const page = req.query.page;

    let filter;
    if (req.filterObj) filter = req.filterObj;

    const apiFeatures = new ApiFeatures(Model.find(filter), req.query)
      .paginate()
      .filter()
      .search()
      .limitFields()
      .sort();

    const { mongooseQuery } = apiFeatures;

    const docs = await mongooseQuery;
    res.status(200).json({ results: docs.length, page, data: docs });
  });

exports.getOne = (Model, populationOptions) =>
  asyncHandler(async (req, res, next) => {
    const id = req.params.id;
    let query = Model.findById(id);
    if (populationOptions) {
      query = query.populate(populationOptions);
    }
    const doc = await query;
    const modelName = adjustModelName(Model);
    if (!doc) {
      next(new ApiError(`NO ${modelName} FOUND WITH THE ID ${id}`, 404));
      return;
    }
    res.status(200).json({ data: doc });
  });

exports.createOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const doc = await Model.create(req.body);
    res.status(201).json({ data: doc });
  });

exports.updateOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const id = req.params.id;
    const modelName = adjustModelName(Model);

    const doc = await Model.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    // trigger "save" event when updating the document
    doc.save();

    if (!doc) {
      next(new ApiError(`NO ${modelName} FOUND WITH THE ID ${id}`, 404));
      return;
    }
    return res.status(200).json({ data: doc });
  });

exports.deleteOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const id = req.params.id;

    const doc = await Model.findByIdAndDelete(id);
    const modelName = adjustModelName(Model);
    if (!doc) {
      next(new ApiError(`NO ${modelName} FOUND WITH THE ID ${id}`, 404));
      return;
    }

    return res.status(200).send("DELETION SUCCEEDED");
  });
