function errorHandle(res, header) {
    res.writeHead(400, header);
    res.write(JSON.stringify({
        "status":"False",
        "message": "Invalid data structure, or no such id number."
    }));
    res.end();
}

module.exports = errorHandle;