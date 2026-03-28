require("dotenv").config();
const { s3 } = require("../config");
const { v4: uuidv4 } = require('uuid');

const FILE_TYPE_MATCH = [
    "image/png",
    "image/jpeg",
    "image/jpg",
    "image/gif"
];

const uploadFile = async file => {
    const filePath = uuidv4();

    if (FILE_TYPE_MATCH.indexOf(file.mimetype) === -1)
        throw new Error('File type is invalid');

    const params = {
        Bucket: process.env.BUCKET_NAME,
        Body: file.buffer,
        Key: filePath,
        ContentType: file.mimetype
    };

    try {
        const data = await s3.upload(params).promise();
        const fileName = data.Location;

        return fileName;
    } catch (error) {
        throw new Error("Error");
    }
};

const deleteFile = async (fileUrl) => {
    try {
        const key = fileUrl.split("/").pop();

        const params = {
            Bucket: process.env.BUCKET_NAME,
            Key: key
        };

        await s3.deleteObject(params).promise();
    } catch (error) {
        throw new Error("Error");
    }
};


module.exports = { uploadFile, deleteFile };