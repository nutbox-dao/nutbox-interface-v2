export const parseOperationStructure = (data) => {
    data = JSON.parse(data.value).userOperationHistories.edges
    data = data.map(o =>{
        let op = o.node;
        op.cursor = o.cursor;
        op.user = op.user.id;
        return op;
    })
    return data;
}