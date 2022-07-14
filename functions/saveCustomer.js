const AWS = require("aws-sdk");

const ddb = new AWS.DynamoDB({ apiVersion: "2012-08-10" });

exports.lambdaHandler = async (event, context) => {
  try {
    const { id, name, email, notes, hobbies, address, dob, designation } =
      event;
    const tableParams = {
      TableName: "customer-table",
      Item: {
        pk: { S: email },
        name: { S: name },
        id: { S: id },
        designation: { S: designation },
        dob: { S: dob },
        hobbies: { S: JSON.stringify(hobbies) },
        address: { S: JSON.stringify(address) },
        notes: { S: JSON.stringify(notes) },
      },
    };
    const data = await ddb.putItem(tableParams).promise();
    console.log("save data --->", data);
    return { success: true };
  } catch (err) {
    console.log(err);
    throw new Error(err.message);
  }
};
