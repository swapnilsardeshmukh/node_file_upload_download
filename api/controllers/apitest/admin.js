const { Cursor } = require('mongoose');
const QP = require('../../controllers/apitest/QP');
const multer = require('multer');
const path = require('path');
const { log } = require('console');
const uploadDir = 'uploads/';
const fs = require('fs');
const os = require('os');
const util = require('util');
const AWS = require('aws-sdk');

const config = require('../../../config')
// const s3 = new AWS.S3({
//     accessKeyId: config.s3.accesskey,
//     secretAccessKey: config.s3.secretkey,

// })
const s3 = new AWS.S3({ signatureVersion: 'v4', accessKeyId: config.s3.accesskey, secretAccessKey: config.s3.secretkey });

// mySql
exports.get_ttt_dashboard = async(req, res) => {
    const { db } = req;
    const tenantId = 1; 

    const qP = new QP(db);
    const SQL = 'call sp_ttt_admin_get_dashboard_data(?)';

    await qP.queryPromise(SQL, [tenantId]).then((result) => {
        console.log(result);
        return res.status(200).json({
            type: true,
            nominations: result[0],
            streams: result[1],
            header: "Train the Trainer",
            message: null
        });
    }).catch((error) => {
        return res.status(500).json({ type: false, data: [], message: 'Something went wrong. please try again later.' })
    });
};


exports.get_pg_data_query = async(req, res) => {
    const { db } = req;
    const id = 1; 

    const qP = new QP(db);
    const SQL = 'SELECT * FROM practice.company WHERE id = $1';

    await qP.queryPromise(SQL, [id]).then((result) => {
        console.log(result);
        return res.status(200).json({
            type: false,
            data: result.rows
            
        });
    }).catch((error) => {
        return res.status(500).json({ type: false, data: [], message: 'Something went wrong. please try again later.' })
    });
};

exports.get_pg_data_sp = async(req, res) => {
    const { db } = req;
    var id = 10000; 
    var rId ;
    var test ={};
   // const qP = new QP(db);
    var SQL = 'CALL practice.sp_check_lang_sql( $1 ,$2) ; ';

    await db.query(SQL, [id , rId]).then(async(result) => {
        console.log(result);
        // await qP.queryPromise('fetch all in $1',[test]) .then((result1) => {
        //     console.log(result1);
        //     return res.status(200).json({
        //         type: false,
        //         data: result1.rows
                
        //     });
        // }).catch((error) => {
        //     return res.status(500).json({ type: false, data: [], message: 'Something went wrong. please try again later.' })
        // });
        return res.status(200).json({
                    type: false,
                    data: result.rows
                    
                });
    }).catch((error) => {
        return res.status(500).json({ type: false, data: [], message: 'Something went wrong. please try again later.' })
    });
};


exports.get_pg_data_func = async(req, res) => {
    const { db } = req;
    const id = 10000; 

    const qP = new QP(db);
    //const SQL = 'SELECT practice.spcalling($1)';
    const SQL = 'SELECT * FROM practice.spcalling($1);';
     

    await qP.queryPromise(SQL, [id]).then((result) => {
        console.log(result);
        return res.status(200).json({
            type: false,
            data: result.rows
            
        });
    }).catch((error) => {
        return res.status(500).json({ type: false, data: [], message: 'Something went wrong. please try again later.' })
    });
};


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        try {
            if (!fs.existsSync(uploadDir)) {
                var createdPath =   fs.mkdirSync(uploadDir, { recursive: true }); // Creates folder (and parent folders if needed)
                console.log(createdPath);
                //recursive returns File Path if true else undefined
            }
            // const uploadDir = "C:/Users/DELL/Downloads/31032025";
           // const uploadDir = os.platform() === 'win32' ? "C:/Users/DELL/Downloads/31032025"  : "/mnt/efs/edge/moudocx"; 
           // process.platform is better than os.platform()
            cb(null, uploadDir); // Save files in "uploads" folder
        } catch (error) {
            console.error("Error in destination:", error);
            cb(error); // Pass the error to Multer
        }
    },
    filename: function (req, file, cb) {
        try {
            const uniqueName = file.fieldname + '-' + Date.now() + path.extname(file.originalname);
            cb(null, uniqueName);
        } catch (error) {
            console.error("Error in filename:", error);
            cb(error); // Pass the error to Multer
        }
    }
});

const upload = multer({ storage }).single('file'); // Define Multer middleware inside the controller

exports.uploadFile = async (req, res) => {
    upload(req, res, function (err) {
        if (err) {
            console.error("Error in file upload:", err);
            return res.status(500).json({ message: "File upload failed", error: err.message });
        }

        // Check if file is uploaded
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        console.log("File Uploaded Successfully:", req.file.filename);
        res.status(200).json({
            message: "File uploaded successfully",
            filename: req.file.filename,
            path: req.file.path,
        });
    });
};

const multiUpload = multer({ storage }).array('files', 2); // 'files' is the fieldname, max 5 files

exports.uploadMultipleFiles = async (req, res) => {
    console.log('__dirname :',__dirname );
    console.log('__basedir :',__basedir );
    // __dirname : D:\Practice\api\controllers\apitest 
    // __basedir : D:\Practice
    multiUpload(req, res, function (err) {
        if (err) {
            console.error("Error in file upload:", err);
            return res.status(500).json({ message: "File upload failed", error: err.message });
        }

        // Check if files are uploaded
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: "No files uploaded" });
        }

        // Extract file info
        const uploadedFiles = req.files.map(file => ({
            filename: file.filename,
            path: file.path
        }));

        console.log("Files Uploaded Successfully:", uploadedFiles);

        res.status(200).json({
            message: "Files uploaded successfully",
            files: uploadedFiles
        });
    });
};

const uploadAsync = util.promisify(upload); 

exports.uploadFileAsyncAwaitWay = async (req, res) => {
    try {
        await uploadAsync(req, res); // Wait for file upload

        if (!req.file) {
            return res.status(400).send('No file uploaded.');
        }

        res.send(`File uploaded to: ${path.join(uploadDir, req.file.filename)}`);
    } catch (error) {
        console.error("File upload error:", error);
        res.status(500).send('Error uploading file.');
    }
};


const uploadMiddlewareAsyncAwait = util.promisify(multiUpload); // Convert to a promise

// Async/Await Multiple File Upload Handler
exports.uploadMultiFileAsyncAwaitWay = async (req, res) => {
    try {
        await uploadMiddlewareAsyncAwait(req, res); // Wait for file upload

        if (!req.files || req.files.length === 0) {
            return res.status(400).send('No files uploaded.');
        }

        const uploadedFiles = req.files.map(file => file.filename);
        res.send(`Files uploaded: ${uploadedFiles.join(', ')}`);
        
    } catch (error) {
        console.error("File upload error:", error);
        res.status(500).send('Error uploading files.');
    }
};


exports.uploadFileAndThenMoveToS3 = async (req, res) => {
    try {
        // 1️⃣ **Upload to Local First**
        await uploadAsync(req, res);

        // 2️⃣ **Check if File is Uploaded**
        if (!req.file) return res.status(400).json({ message: "No file uploaded" });

        console.log("File Uploaded Locally:", req.file.filename);

        const filePath = req.file.path;
        const fileStream = fs.createReadStream(filePath);

        // 3️⃣ **Upload to S3**
        const params = {
            Bucket: config.s3.bucket,
            Key: `uploads/${req.file.filename}`,
            Body: fileStream,
            ACL: 'public-read'
        };

        const data = await s3.upload(params).promise();
        console.log("File Uploaded to S3:", data.Location);

        // 4️⃣ **Delete Local File**
        fs.unlink(filePath, (err) => {
            if (err) console.error("Failed to delete local file:", err);
            else console.log("Local file deleted successfully");
        });

        // 5️⃣ **Send Response**
        res.status(200).json({
            message: "File uploaded successfully",
            filename: req.file.filename,
            s3Url: data.Location
        });

    } catch (error) {
        console.error("Upload Error:", error);
        res.status(500).json({ message: "File upload failed", error: error.message });
    }
};
