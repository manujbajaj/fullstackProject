import multer from "multer";


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/temp')
  },
  filename: function (req, file, cb) {
    const filename=Date.now()+"-"+file.originalname;
    cb(null, filename);
  },
})

export const upload = multer({ storage: storage })


// import multer from "multer";
// import fs from "fs"

// const storage=multer.diskStorage({
//   destination:function (req, file, cb) {
//     cb(null, './public/temp')
//   },
//   filename:function (req, file, cb) {
//     const name=Date.now()+'-'+file.originalname;
//     cb(null, name)
//   },
// })

// export const upload = multer({ storage: storage })