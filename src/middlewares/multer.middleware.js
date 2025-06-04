import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb){
    cb(null, "./public/temp"); // Specify the directory to store uploaded files
  },
  filename: function(req, file, cb){
    
    cb(null, file.originalname); // Use the original file name
}
});

export const upload = multer({
    storage,
})