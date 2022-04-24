export const parseOperationStructure = (data) => {
    data = JSON.parse(data.value).userOperationHistories.edges
    data = data.map(o =>{
        let op = o.node;
        op.cursor = o.cursor;
        op.user = op.user.id;
        op.asset = op.asset.substring(0, 2) !== "0x" ? '0x' + op.asset : op.asset
        return op;
    })
    return data;
}