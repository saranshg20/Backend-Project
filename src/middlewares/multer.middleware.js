import multer from "multer";

// using diskStorage not memoryStorage
// this is due to limited memory available
// will create issue for video files

//cb ==> callback
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/temp')
    },
    filename: function (req, file, cb) {
        // can define unique names for every file
        // to avoid any issue
        // though chances are less
        // as files will be for very small duration in the server
      cb(null, file.originalname)
    }
})
  
export const upload = multer({ 
    storage: storage
})

