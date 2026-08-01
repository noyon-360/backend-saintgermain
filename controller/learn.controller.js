import httpStatus from "http-status";
import Learn from "../model/learn.model.js";
import AppError from "../errors/AppError.js";
import catchAsync from "../utils/catchAsync.js";
import sendResponse from "../utils/sendResponse.js";

// GET /learn?type=book|video&search=&page=&limit=
export const getLearnContent = catchAsync(async (req, res) => {
  const { type = "book", search = "", page = 1, limit = 10 } = req.query;

  const filter = { isActive: true, type };
  if (search) {
    filter.title = { $regex: search, $options: "i" };
  }

  const skip = (Number(page) - 1) * Number(limit);

  const [items, total] = await Promise.all([
    Learn.find(filter).sort("-publishedDate").skip(skip).limit(Number(limit)),
    Learn.countDocuments(filter),
  ]);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Learn content fetched successfully",
    data: items,
    meta: { page: Number(page), limit: Number(limit), total },
  });
});

// GET /learn/:id
export const getLearnContentById = catchAsync(async (req, res) => {
  const item = await Learn.findById(req.params.id);
  if (!item) {
    throw new AppError(httpStatus.NOT_FOUND, "Content not found");
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Content fetched successfully",
    data: item,
  });
});

// PATCH /learn/:id/like
export const toggleLike = catchAsync(async (req, res) => {
  const item = await Learn.findById(req.params.id);
  if (!item) {
    throw new AppError(httpStatus.NOT_FOUND, "Content not found");
  }

  const idx = item.likedBy.findIndex(
    (u) => u.toString() === req.user._id.toString()
  );

  let liked;
  if (idx > -1) {
    item.likedBy.splice(idx, 1);
    item.likesCount = Math.max(0, item.likesCount - 1);
    liked = false;
  } else {
    item.likedBy.push(req.user._id);
    item.likesCount += 1;
    liked = true;
  }

  await item.save();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: liked ? "Liked" : "Unliked",
    data: { liked, likesCount: item.likesCount },
  });
});

// PATCH /learn/:id/download
export const registerDownload = catchAsync(async (req, res) => {
  const item = await Learn.findByIdAndUpdate(
    req.params.id,
    { $inc: { downloadsCount: 1 } },
    { new: true }
  );
  if (!item) {
    throw new AppError(httpStatus.NOT_FOUND, "Content not found");
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Download registered",
    data: { downloadUrl: item.contentUrl, downloadsCount: item.downloadsCount },
  });
});

// PATCH /learn/:id/share
export const registerShare = catchAsync(async (req, res) => {
  const item = await Learn.findByIdAndUpdate(
    req.params.id,
    { $inc: { sharesCount: 1 } },
    { new: true }
  );
  if (!item) {
    throw new AppError(httpStatus.NOT_FOUND, "Content not found");
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Share registered",
    data: { sharesCount: item.sharesCount },
  });
});


export const createLearnContent = catchAsync(async (req, res) => {
  const { type, title, authorLabel, thumbnail, contentUrl } = req.body;

  if (!type || !["book", "video"].includes(type)) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "type is required and must be 'book' or 'video'"
    );
  }

  if (!title || !contentUrl) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "title and contentUrl are required"
    );
  }

  const item = await Learn.create({
    type,
    title,
    authorLabel,
    thumbnail,
    contentUrl,
  });

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: `${type === "book" ? "Book" : "Video"} added successfully`,
    data: item,
  });
});