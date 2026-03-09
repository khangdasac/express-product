require("dotenv").config();
const { s3 } = require("../config");

const randomString = numberCharacter => {
    return `${Math.random()
        .toString(36)
        .substring(2, numberCharacter + 2)}`;
};

const FILE_TYPE_MATCH = [
    "image/png",
    "image/jpeg",
    "image/jpg",
    "image/gif"
];

const uploadFile = async file => {
    const filePath = `${randomString(4)}-${new Date().getTime()}-${file?.originalname}`;

    if (FILE_TYPE_MATCH.indexOf(file.mimetype) === -1) {
        throw new Error(`${file?.originalname} is invalid!`);
    }

    const params = {
        Bucket: process.env.BUCKET_NAME,
        Body: file?.buffer,
        Key: filePath,
        ContentType: file?.mimetype
    };

    try {
        const data = await s3.upload(params).promise();
        console.log(`File uploaded successfully. ${data.Location}`);
        const fileName = data.Location;

        return fileName;
    } catch (error) {
        console.error("Error uploading file to AWS S3:", error);
    }
};

const deleteFile = async (fileUrl) => {
    try {
        const key = fileUrl.split("/").pop(); // lấy tên file từ URL

        const params = {
            Bucket: process.env.BUCKET_NAME,
            Key: key
        };

        await s3.deleteObject(params).promise();

        console.log("Old file deleted:", key);
    } catch (error) {
        console.log("Delete file error:", error);
    }
};


module.exports = { uploadFile, deleteFile };