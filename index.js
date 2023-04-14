const express = require('express');
const fileUpload = require('express-fileupload');
const pdfParse = require('pdf-parse');

const app = express();

app.use("/", express.static('public'));
app.use(fileUpload());

app.post("/extract-text", (req, res) => {
    if (!req.files && !req.files.pdfFile) {
        res.status(400);
        res.end();
        return;
    }

    pdfParse(req.files.pdfFile.data).then(result => {
        res.send(result.text);
    });
});

try {
    app.listen(3000, () => {
        console.log("Server started on port 3000");
    });
} catch (error) {
    console.error("Failed to start server:", error);
}