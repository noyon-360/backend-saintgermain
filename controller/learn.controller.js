import httpStatus from "http-status";
import Learn from "../model/learn.model.js";
import AppError from "../errors/AppError.js";
import catchAsync from "../utils/catchAsync.js";
import sendResponse from "../utils/sendResponse.js";

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

/** Shape one Learn doc for the Learn screen cards. */
const mapLearnItem = (item, userId) => {
  const doc = typeof item.toObject === "function" ? item.toObject() : item;
  const published = doc.publishedDate ? new Date(doc.publishedDate) : null;
  const isLiked = userId
    ? (doc.likedBy || []).some((id) => id.toString() === userId.toString())
    : false;
  const isDownloaded = userId
    ? (doc.downloadedBy || []).some((id) => id.toString() === userId.toString())
    : false;

  return {
    _id: doc._id,
    type: doc.type,
    title: doc.title,
    thumbnail: doc.thumbnail || "",
    authorLabel: doc.authorLabel || "",
    publishedDate: doc.publishedDate,
    date: published
      ? `${MONTHS[published.getUTCMonth()]} ${published.getUTCDate()}, ${published.getUTCFullYear()}`
      : "",
    contentUrl: doc.contentUrl || "",
    likesCount: doc.likesCount || 0,
    downloadsCount: doc.downloadsCount || 0,
    sharesCount: doc.sharesCount || 0,
    isLiked,
    isDownloaded,
  };
};

// GET /learn?type=book|video&search=&page=&limit=
// Used by Learn screen (Book / Video tabs + search)
export const getLearnContent = catchAsync(async (req, res) => {
  const { type = "book", search = "", page = 1, limit = 10 } = req.query;

  const allowedTypes = ["book", "video"];
  if (!allowedTypes.includes(type)) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "type must be 'book' or 'video'"
    );
  }

  const filter = { isActive: true, type };
  if (search) {
    filter.title = { $regex: search, $options: "i" };
  }

  const skip = (Number(page) - 1) * Number(limit);

  const [items, total] = await Promise.all([
    Learn.find(filter).sort("-publishedDate").skip(skip).limit(Number(limit)),
    Learn.countDocuments(filter),
  ]);

  const data = items.map((item) => mapLearnItem(item, req.user?._id));

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Learn content fetched successfully",
    data,
    meta: { page: Number(page), limit: Number(limit), total },
  });
});

// GET /learn/:id  — READ MORE detail
export const getLearnContentById = catchAsync(async (req, res) => {
  const item = await Learn.findById(req.params.id);
  if (!item) {
    throw new AppError(httpStatus.NOT_FOUND, "Content not found");
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Content fetched successfully",
    data: mapLearnItem(item, req.user?._id),
  });
});

// PATCH /learn/:id/like  — heart icon
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
    data: { liked, isLiked: liked, likesCount: item.likesCount },
  });
});

// PATCH /learn/:id/download
export const registerDownload = catchAsync(async (req, res) => {
  const item = await Learn.findById(req.params.id);
  if (!item) {
    throw new AppError(httpStatus.NOT_FOUND, "Content not found");
  }

  // downloadsCount counts unique users, so re-downloading never inflates it.
  const alreadyDownloaded = item.downloadedBy.some(
    (u) => u.toString() === req.user._id.toString()
  );

  if (!alreadyDownloaded) {
    item.downloadedBy.push(req.user._id);
    item.downloadsCount += 1;
    await item.save();
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Download registered",
    data: {
      downloadUrl: item.contentUrl,
      downloadsCount: item.downloadsCount,
      isDownloaded: true,
    },
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

// POST /learn  — admin/content create
export const createLearnContent = catchAsync(async (req, res) => {
  const { type, title, authorLabel, thumbnail, contentUrl, publishedDate } =
    req.body;

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
    ...(publishedDate ? { publishedDate } : {}),
  });

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: `${type === "book" ? "Book" : "Video"} added successfully`,
    data: mapLearnItem(item, req.user?._id),
  });
});
