const AWS = require("aws-sdk");
const s3 = new AWS.S3({ apiVersion: "2006-03-01" });
const stepfunction = new AWS.StepFunctions();

const { STEP_FUNC_ARN } = process.env;

exports.lambdaHandler = async (event, context) => {
  try {
    const bucketName = "importcustomer";
    const objKey = "customer.json";

    const s3Params = {
      Bucket: bucketName,
      Key: objKey,
    };

    const getObjectResp = await s3.getObject(s3Params).promise();

    let customers =
      getObjectResp && getObjectResp.Body
        ? Buffer.from(getObjectResp.Body)
        : "";
    customers = JSON.parse(customers);

    const count = customers.customers.length;
    const pages = count / 500;

    const paginate = (array, page_size, page_number) => {
      return array.slice(
        page_number * page_size,
        page_number * page_size + page_size
      );
    };

    for (let i = 0; i < pages; i++) {
      let result = paginate(customers.customers, 500, i);
      let stepFunParams = {
        stateMachineArn: STEP_FUNC_ARN,
        input: JSON.stringify({
          count: result.length,
          data: { customers: result },
        }),
      };
      let step = await stepfunction.startExecution(stepFunParams).promise();
    }
    return {
      statusCode: 200,
      message: "step functions started",
    };
  } catch (err) {
    console.log(err);
    return err;
  }
};
