const AWS = require("aws-sdk");

const ddb = new AWS.DynamoDB({ apiVersion: "2012-08-10" });

exports.lambdaHandler = async (event, context) => {
  try {
    const { pk, errMsg, success } = event;
    const tableParams = {
      TableName: "customer-table",
      Item: {
        pk: { S: pk },
        errMsg: { S: errMsg },
        success: { S: success },
      },
    };
    const data = await ddb.putItem(tableParams).promise();
    console.log("log data --->", data);
    return { success: true };
  } catch (err) {
    console.log(err);
    throw new Error(err.message);
  }
};
