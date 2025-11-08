const ContactService = require("../services/contact.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");
const { ObjectId } = require("mongodb"); // <-- THÊM DÒNG NÀY

exports.create = async (req, res, next) => {
  if (!req.body?.name) return next(new ApiError(400, "Name can not be empty"));
  try {
    const sv = new ContactService(MongoDB.client);
    const doc = await sv.create(req.body);
    console.log("CREATE DOC >>>", doc); // log để chắc chắn
    if (!doc) return next(new ApiError(500, "Create failed"));
    return res.status(201).json(doc); // <-- luôn là JSON
  } catch (e) {
    return next(
      new ApiError(500, "An error occurred while creating the contact")
    );
  }
};

// Lấy tất cả (hỗ trợ ?name=abc)
exports.findAll = async (req, res, next) => {
  let documents = [];
  try {
    const contactService = new ContactService(MongoDB.client);
    const { name } = req.query;

    documents = name
      ? await contactService.findByName(name)
      : await contactService.find({});

    return res.status(200).json(documents); // ✅ JSON thay vì res.send(...)
  } catch (error) {
    return next(
      new ApiError(500, "An error occurred while retrieving contacts")
    );
  }
};

// Lấy theo id
exports.findOne = async (req, res, next) => {
  const { id } = req.params;

  // 1) Validate id trước khi query
  if (!ObjectId.isValid(id)) {
    return next(new ApiError(400, "Invalid contact id"));
  }

  try {
    const contactService = new ContactService(MongoDB.client);
    const document = await contactService.findById(id);

    if (!document) {
      return next(new ApiError(404, "Contact not found"));
    }

    // 2) Trả JSON chuẩn
    return res.status(200).json(document);
  } catch (error) {
    return next(new ApiError(500, `Error retrieving contact with id=${id}`));
  }
};

// Cập nhật theo id
exports.update = async (req, res, next) => {
  // 1) Validate body
  if (!req.body || Object.keys(req.body).length === 0) {
    return next(new ApiError(400, "Data to update can not be empty"));
  }

  // 2) Validate id
  const { id } = req.params;
  if (!ObjectId.isValid(id)) {
    return next(new ApiError(400, "Invalid contact id"));
  }

  try {
    const contactService = new ContactService(MongoDB.client);

    // 3) Thực hiện cập nhật
    const document = await contactService.update(id, req.body);

    // 4) Không tìm thấy
    if (!document) {
      return next(new ApiError(404, "Contact not found"));
    }

    // 5) Trả JSON chuẩn (có thể trả luôn document sau update)
    return res.status(200).json({
      message: "Contact was updated successfully",
      document, // document sau update
    });
  } catch (error) {
    return next(new ApiError(500, `Error updating contact with id=${id}`));
  }
};

// Xóa theo id
exports.delete = async (req, res, next) => {
  try {
    const sv = new ContactService(MongoDB.client);
    const doc = await sv.delete(req.params.id);
    if (!doc) return next(new ApiError(404, "Contact not found"));
    return res
      .status(200)
      .json({ message: "Contact was deleted successfully" });
  } catch (err) {
    return next(
      new ApiError(500, `Could not delete contact with id=${req.params.id}`)
    );
  }
};

// Xóa tất cả
exports.deleteAll = async (req, res, next) => {
  try {
    const sv = new ContactService(MongoDB.client);
    const count = await sv.deleteAll();
    return res.status(200).json({ message: `${count} contacts were deleted` });
  } catch (err) {
    return next(
      new ApiError(500, "An error occurred while removing all contacts")
    );
  }
};

// Lấy tất cả favorite
exports.findAllFavorite = async (req, res, next) => {
  try {
    const sv = new ContactService(MongoDB.client);
    const docs = await sv.findFavorite();
    return res.status(200).json(docs);
  } catch (err) {
    return next(
      new ApiError(500, "An error occurred while retrieving favorite contacts")
    );
  }
};
