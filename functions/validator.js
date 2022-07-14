const AWS = require("aws-sdk");

const lambda = new AWS.Lambda();
const  ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});

const {LOG_FUNC_ARN} = process.env

exports.lambdaHandler = async (event, context) => {
  try {
    const status = {
      isValid: true,
      errMsg: "",
    };
    if (!event.id) {
      status.isValid = false;
      status.errMsg = "Customer Id not found";
    }
    if (!event.name) {
      status.isValid = false;
      status.errMsg = "Customer Name not found";
    }
    if (!event.email) {
      status.isValid = false;
      status.errMsg = "Customer Email not found";
    }

    const tableParams = {
      TableName: 'customer-table',
      Key: {
        'pk': {S: event.email}
      },
    };

    const ifCustomerExists = await ddb.getItem(tableParams).promise()

    console.log('customer data --->',ifCustomerExists)
    if(ifCustomerExists.Item){
      status.isValid = false;
      status.errMsg = "Email already taken";
    }

    if (!status.isValid) {
      const lambdaInvokeParams = {
        FunctionName: LOG_FUNC_ARN,
        Payload: JSON.stringify({
          pk: `Log-${new Date().getUTCMilliseconds()}`,
          errMsg: status.errMsg,
          success: "false"
        }),
      };
      await lambda.invoke(lambdaInvokeParams).promise();
      throw new Error("Validation error");
    }
    return ''
  } catch (err) {
    console.log(err);
    throw new Error(err.message);
  }
};
