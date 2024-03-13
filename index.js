const http = require('http');
const {v4:uuidv4} = require('uuid');
const errorHandle = require("./errorHandler");

const header = {
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With',
    'Access-Control-Allow-Origin': "*",
    'Access-Control-Allow-Methods': 'PATCH, POST, GET, OPTIONS, DELETE',
    'Content-Type': 'application/json'
}
const todolist = []

const requestListener = (req, res) => {
    console.log(req.url, req.method);
    let body = "";
    req.on('data', (chunk) => {
        body += chunk;
    });
    
    if (req.url == "/todos" && req.method == "GET") {
        res.writeHead(200, header);
        res.write(JSON.stringify(
            {
                "status": "Success",
                "data": todolist
            }
        ));
        res.end();
    }else if (req.url == "/todos" && req.method == "POST") {
        req.on('end', () => {
            try{
                const inputTitle = JSON.parse(body).title;
                if(inputTitle !== undefined){
                    const inputItem = {
                        "title": inputTitle,
                        "id": uuidv4()
                    }
                    todolist.push(inputItem);
                    res.writeHead(200, header);
                    res.write(JSON.stringify({
                        "status":"Success",
                        "data": todolist
                    }));
                    res.end();
                }else{
                    errorHandle(res, header);
                }
            }catch(error){
                errorHandle(res, header);
            }
        })

    }else if (req.url == "/todos" && req.method == "DELETE") {
        todolist.length = 0;
        res.writeHead(200, header);
        res.write(JSON.stringify(
            {
                "status": "Success",
                "data": todolist
            }
        ));
        res.end();
    }else if (req.url.startsWith("/todos/") && req.method == "DELETE"){
        const delID = req.url.split("/").pop();
        const index = todolist.findIndex(i => i.id == delID);
        if (index !== -1){
            todolist.splice(index, 1);
            res.writeHead(200, header);
            res.write(JSON.stringify(
                {
                    "status": "Success",
                    "data": todolist
                }
            ));
            res.end();
        }else{
            errorHandle(res, header);
        }
        
    }else if (req.url.startsWith("/todos/") && req.method == "PATCH"){
        req.on('end',()=>{
            try{
                const todoTitle = JSON.parse(body).title;
                const todoID = req.url.split("/").pop();
                const index = todolist.findIndex((i) => i.id == todoID);
                if (todoTitle !== undefined && index !== -1) {
                    todolist[index].title = todoTitle;
                    res.writeHead(200, header);
                    res.write(JSON.stringify(
                        {
                            "status": "Success",
                            "data": todolist
                        }
                    ));
                    res.end();
                }else{
                    errorHandle(res, header);
                }
            }catch{
                errorHandle(res, header);
            }
        })

    }else if (req.method == "OPTIONS") {
        res.writeHead(200, header);
        res.end();
    }else {
        res.writeHead(404, header);
        res.write(JSON.stringify(
            {
                "status": "Failed",
                "action": req.method,
                "data": todolist,
                "message": "No such route"
            }
        ));
        res.end();
    }
    //console.log("res end was here!")
}

const server = http.createServer(requestListener);
server.listen(process.env.PORT || 3005);
