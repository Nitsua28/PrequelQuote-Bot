const paramsQuery = {
  TableName: 'PrequelQuotes',
  KeyConditionExpression: '#id = :id',
  ExpressionAttributeNames: {
    '#id': 'ID'
  },
  ExpressionAttributeValues: {
    ':id': ''
  }
}

// var paramsScan = {
//     TableName: "PrequelQuotes",
//     ProjectionExpression: "#id",
//     ExpressionAttributeNames:{
//       "#id": "ID"
//     },
//     ExpressionAttributeValues:{
//
//     }
//
//
// };

module.exports = { paramsQuery }
