const { dynamodb } = require('../config');
const { v4: uuidv4 } = require('uuid');
const tableName = 'Products';

const Model = {
    create: async (data) => {
        const id = uuidv4();
        const params = {
            TableName: tableName,
            Item: { id, ...data }
        }
        try {
            await dynamodb.put(params).promise();
            return { id, ...data }
        } catch (error) {
            console.log(error);
            throw error;
        }
    },

    search: async (keyword) => {
        if (keyword && keyword.trim()) {
            const params = {
                TableName: tableName,
                FilterExpression: "contains(#name, :keyword)",
                ExpressionAttributeNames: {
                    "#name": "name"
                },
                ExpressionAttributeValues: {
                    ":keyword": keyword
                }
            };
            try {
                const res = await dynamodb.scan(params).promise();
                return res.Items;

            } catch (error) {
                console.log(error);
                throw error;
            }
        }
    },

    filter: async (type) => {
        if (type) {
            const params = {
                TableName: tableName,
                FilterExpression: "#type = :type",
                ExpressionAttributeNames: {
                    "#type": "type"
                },
                ExpressionAttributeValues: {
                    ":type": type
                }
            };
            try {
                const res = await dynamodb.scan(params).promise();
                return res.Items;
            } catch (error) {
                console.log(error);
                throw error;
            }
        }
    },

    update: async (id, data) => {
        if (data.image) {
            updateExpression += ", image = :image";
            expressionAttributeValues[":image"] = data.image;
        }

        const params = {
            TableName: tableName,
            Key: { id },
            UpdateExpression: "set #name = :name, price = :price, quantity = :quantity",
            ExpressionAttributeNames: {
                "#name": "name"
            },
            ExpressionAttributeValues: {
                ":name": data.name,
                ":price": data.price,
                ":quantity": data.quantity
            },
            ReturnValues: "ALL_NEW"
        };

        try {
            const res = await dynamodb.update(params).promise();
            return res.Attributes;
        } catch (error) {
            console.log(error);
            throw error;
        }
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
            console.log(error);
            throw error;
        }
    },

    getById: async (id) => {
        const params = {
            TableName: tableName,
            Key: { id }
        };
        try {
            const res = await dynamodb.get(params).promise();
            return res.Item;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
}

module.exports = Model;