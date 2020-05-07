const fs = require("fs");
const assert = require("chai").assert;
const path = require("path");
const AwsCloud = require("@microtica/component").AwsCloud;

const deployTemplate = JSON.stringify(require("../index.json"));

const { handler } = require("../index");
process.env.AWS_REGION = "eu-central-1";

before(async () => { });
after(async () => {
    fs.unlinkSync(path.join(__dirname, "generated.json"));
});

describe("Component tests", () => {
    it.skip("Should be able to respond to cfn event", async () => {
        const event = {
            "RequestType": "Create",
            "ServiceToken": "arn:aws:lambda:eu-central-1:678898389733:function:Blueprint-DEV-5-Resource1Lambda-7M47EKOC5TMR",
            "ResponseURL": "https://cloudformation-custom-resource-response-eucentral1.s3.eu-central-1.amazonaws.com/arn%3Aaws%3Acloudformation%3Aeu-central-1%3A678898389733%3Astack/Blueprint-DEV-5/120517e0-40b6-11e9-ad17-02d441bc2b52%7CResource1Transformer%7C8924cb48-97c4-406b-b070-d7fcc986feba?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20190307T085104Z&X-Amz-SignedHeaders=host&X-Amz-Expires=7200&X-Amz-Credential=AKIAI6O56J6OASP2XQ5A%2F20190307%2Feu-central-1%2Fs3%2Faws4_request&X-Amz-Signature=b51de60764d78aa8053e496dbaf38445ef7989302744a687636098b3a97c4a6b",
            "StackId": "arn:aws:cloudformation:eu-central-1:678898389733:stack/Blueprint-DEV-5/120517e0-40b6-11e9-ad17-02d441bc2b52",
            "RequestId": "8924cb48-97c4-406b-b070-d7fcc986feba",
            "LogicalResourceId": "Resource1Transformer",
            "ResourceType": "AWS::CloudFormation::CustomResource",
            "ResourceProperties": {
                "ServiceToken": "arn:aws:lambda:eu-central-1:678898389733:function:Blueprint-DEV-5-Resource1Lambda-7M47EKOC5TMR",
                "natInstanceType": "t2.micro",
                "s3Key": "outputs/index.json",
                "keyName": "microtica-dev-key",
                "s3Bucket": "x23aakx8p4pw4gn4xi65-ci-artifacts"
            }
        };
        const context = {
            getRemainingTimeInMillis: () => 300000,
            done: (result) => console.log(result)
        }
        handler(event, context);
    });

    it("Component deploy action should be valid", async () => {
        await AwsCloud.Component
            .validate(deployTemplate)
            .then(() => assert.isOk(true))
            .catch(err => assert.isOk(false, err.message));
    });

    it("Component deploy action should not be valid", async () => {
        const deployTemplatePath = path.join(__dirname, "../index.json");
        const destTempatePath = path.join(__dirname, "./generated.json");
        AwsCloud.Component.transformTemplate(
            deployTemplatePath,
            destTempatePath,
            (template) => {
                template.Parameters.resourceId.Type = "unsupported_type";
                return template;
            }
        );
        const destTemplate = JSON.stringify(require("./generated.json"));
        return AwsCloud.Component
            .validate(destTemplate)
            .then(() => assert.isOk(false))
            .catch(err => assert.isOk(true));
    });
});