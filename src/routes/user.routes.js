import { Router } from "express";
import {
  changeCurrentPassword,
  createPlaylist,
  getChannelPlaylists,
  getCurrentUser,
  getUserChannelProfile,
  getWatchHistory,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
  updateAccountDetails,
  updateUserAvatar,
  updateUserCoverImage,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  channelVideos,
  commentOnVideo,
  dislikeVideo,
  getVideoUsingID,
  likeCommentOnVideo,
  likeVideo,
  publishVideo,
  unpublishVideo,
  uploadVideo,
} from "../controllers/video.controller.js";
const router = Router();

router.route("/register").post(
  //applied middleware
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  registerUser
);

router.route("/login").post(loginUser);

//secured routes
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/change-password").post(verifyJWT, changeCurrentPassword);
router.route("/current-user").get(verifyJWT, getCurrentUser);
router.route("/update-account").patch(verifyJWT, updateAccountDetails);

router
  .route("/avatar")
  .patch(verifyJWT, upload.single("avatar"), updateUserAvatar);
router
  .route("/cover-image")
  .patch(verifyJWT, upload.single("coverImage"), updateUserCoverImage);

router.route("/c/:username").get(verifyJWT, getUserChannelProfile);
router.route("/history").get(verifyJWT, getWatchHistory);

// User-handling for video upload and file upload
router.route("/upload-video").post(
  verifyJWT, //applied middleware
  upload.fields([
    {
      name: "videoFile",
      maxCount: 1,
    },
    {
      name: "thumbnail",
      maxCount: 1,
    },
  ]),
  uploadVideo
);

router.route("/channel-videos").get(verifyJWT, channelVideos);
router.route("/channel-playlists").get(verifyJWT, getChannelPlaylists);

router.route("/v/:videoId").post(verifyJWT, getVideoUsingID);
router.route("/v/:videoId/like").post(verifyJWT, likeVideo);
router.route("/v/:videoId/dislike").post(verifyJWT, dislikeVideo);
router.route("/v/:videoId/comment").post(verifyJWT, commentOnVideo);
router
  .route("/v/:videoId/like/comment/:commentId")
  .post(verifyJWT, likeCommentOnVideo);

router.route("/create-playlist").post(
  verifyJWT, 
  upload.fields([
    {
      name: "thumbnail",
      maxCount: 1,
    },
  ]),
  createPlaylist);

router.route("/v/:videoId/publish").put(verifyJWT, publishVideo);
router.route("/v/:videoId/unpublish").put(verifyJWT, unpublishVideo);

export default router;
