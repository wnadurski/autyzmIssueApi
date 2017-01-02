const express = require("express")
const commandLineArgs = require('command-line-args')
const bodyParser = require("body-parser")

const optionDefinitions = require("./options")
const sender = require("./sender")

const options = commandLineArgs(optionDefinitions)

const app = express()
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.get("/", (req, res) => {
    res.send("Yo");
})

const requestParser = body => Object.assign({
    title: "",
    sender: "",
    copyTo: ""
}, body)

const debugRequestParser = body => Object.assign({
    title: "",
    sender: "",
    copyTo: body.sendTo || ""
}, body)

const requestHandler = (parser, defaultMailingList) => (request, response) => {
    defaultMailingList = defaultMailingList || []
    const body = parser(request.body)

    const copyTo = body.copyTo.split(";").filter(mail => mail !== "")
    const sendMessage = sender([defaultMailingList, ...copyTo])

    if (!body.content || !body.tag) {
        response.status(400).end("Treść i tag są wymagane")
        return;
    }

    sendMessage(body, (error, info) => {
        if (error) {
            console.log(error)
            response.status(500).end()
        }
        else {
            response.status(202).end()
        }
    })
}

app.post("/api/issues", requestHandler(requestParser, ['hysterus@gmail.com']));
app.post("/api/debug/issues", requestHandler(debugRequestParser, []));

const server = app.listen(options.port, () => {
    const host = server.address().address
    const port = server.address().port

    console.log("app listening at http://%s:%s", host, port)
})