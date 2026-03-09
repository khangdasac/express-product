const e = require('express');
const { dynamodb } = require('../config');
const { v4: uuidv4 } = require('uuid');
const tableName = 'Products';

const ProductModel = {
    create: async data => {
        const id = uuidv4();
        const params = {
            TableName: tableName,
            Item: { id, ...data }
        }
        try {
            await dynamodb.put(params).promise();
            return { id, ...data }
        } catch (error) {
            console.log("ERROR: ", error);
        }
    },
    getAll: async() => {
        const params = {
            TableName: tableName
        };
        try {
            const res = await dynamodb.scan(params).promise();
            return res.Items;
        } catch (error) {
            console.log("ERROR: ", error);
        }
    },
    update: async(id, data) => {

    },
    delete: async(id) => {
        const params = {
            TableName: tableName,
            KeyCoditionExpression: 'id = :id',
            ExpressionAttributeValues: {
                ':id': id
            }
        }
        try {
            const res = await dynamodb.query(params).promise();
            return res.Items[0];
        } catch (error) {
            console.log("ERROR: ", error);
        }
    },
}

module.exports = ProductModel;