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
            throw error;
        }
    },

    search: async (keyword) => {
        const params = {
            TableName: tableName
        };

        if (keyword && keyword.trim() !== "") {
            params.FilterExpression = "contains(#name, :keyword)";
            params.ExpressionAttributeNames = {
                "#name": "name"
            };
            params.ExpressionAttributeValues = {
                ":keyword": keyword
            };
        }

        try {
            const res = await dynamodb.scan(params).promise();
            return res.Items;
            
        } catch (error) {
            console.log("ERROR:", error);
            throw error;
        }
    },

    update: async (id, data) => {

    },

    delete: async (id) => {
        const params = {
            TableName: tableName,
            Key: { id }
        };
        try {
            const res = await dynamodb.delete(params).promise();
            return true;
        } catch (error) {
            console.log("ERROR: ", error);
            throw error;
        }
    }
}

module.exports = ProductModel;