function constructFormBody(data) {
    var formBody = [];
    
    for(let property in data) {
        let encodedKey = encodeURIComponent(property);
        let encodedValue = encodeURIComponent(data[property]);
        formBody.push(encodedKey + "=" + encodedValue);
    }
    
    formBody = formBody.join("&");

    return formBody;
}
