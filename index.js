const express = require('express');
const fileUpload = require('express-fileupload');
const pdfParse = require('pdf-parse');
const nodemailer = require('nodemailer');

const app = express();

app.use("/", express.static('public'));
app.use(fileUpload());
app.use(express.json());

app.post("/extract-text", (req, res) => {
    if (!req.files || !req.files.pdfFile) {
        res.status(400);
        res.end();
        return;
    }

    pdfParse(req.files.pdfFile.data)
        .then(result => {
            res.send(result.text);
        })
        .catch(error => {
            console.error(error);
            res.status(500).send('Failed to extract text from PDF.');
        });
});

app.listen(3000, () => {
    console.log("Server started on port 3000");
});
