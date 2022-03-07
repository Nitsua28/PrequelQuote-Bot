var paramsQuery = {
    TableName : "PrequelQuotes",
    KeyConditionExpression: "#id = :id",
    ExpressionAttributeNames:{
        "#id": "ID"
    },
    ExpressionAttributeValues: {
        ":id": ""
    }
};

var paramsScan = {
    TableName: "PrequelQuotes",
    ProjectionExpression: "ID",
    ExpressionAttributeNames:{

    },
    ExpressionAttributeValues:{

    }


};

module.exports = {paramsScan,paramsQuery};
