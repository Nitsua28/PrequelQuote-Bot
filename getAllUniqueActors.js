const aws = require("aws-sdk");

aws.config.update({
  accessKeyId: "AKIA2YVQ44FPAE3SAN77",
  accessSecretKey: "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",
  region: "us-west-2",
});
const docClient = new aws.DynamoDB.DocumentClient();


var params = {
    TableName: "PrequelQuotes",
    ProjectionExpression: "Actor"

};
const hash = new Map()
hash["test"]=2
console.log("Scanning Movies table.");
docClient.scan(params, onScan);

function onScan(err, data) {
    if (err) {
        console.error("Unable to scan the table. Error JSON:", JSON.stringify(err, null, 2));
    } else {
        // print all the movies
        console.log("Scan succeeded.");
        data.Items.forEach(function(item) {
           if (!hash.has(item.Actor)){
             hash[item.Actor] = 1
           }
        });
        hash.forEach((item, i) => {
          console.log(i);
        });
        console.log(hash)
        // continue scanning if we have more movies, because
        // scan can retrieve a maximum of 1MB of data
        if (typeof data.LastEvaluatedKey != "undefined") {
            console.log("Scanning for more...");
            params.ExclusiveStartKey = data.LastEvaluatedKey;
            docClient.scan(params, onScan);
        }
    }
}
