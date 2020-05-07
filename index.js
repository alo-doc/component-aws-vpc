const path = require("path");
const { NestedComponent } = require("@microtica/component").AwsCloud;
const component = new NestedComponent(
    path.join(__dirname, "index.json"), 
    path.join(__dirname, "schema.json"), 
    handleCreate,
    handleUpdate
);

async function handleUpdate() {
    return {}; 
}

async function handleCreate() {
    const [vpcCidr] = await component.generateVpcCidr();
    const [
        privateSubnet1Cidr,
        privateSubnet2Cidr,
        publicSubnet1Cidr,
        publicSubnet2Cidr
    ] = await component.generateSubnetCidr(vpcCidr, 4);
    const [subnet1Az, subnet2Az] = await component.getAvailabilityZones();

    return {
        vpcCidr,
        subnet1Az,
        subnet2Az,
        privateSubnet1Cidr,
        privateSubnet2Cidr,
        publicSubnet1Cidr,
        publicSubnet2Cidr 
    };
}

module.exports = component;