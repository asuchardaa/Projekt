const inpFile = document.getElementById('inpFile');
const btnUpload = document.getElementById('btnUpload');
const resultText = document.getElementById('resultText');
const fileError = document.getElementById('fileError');

inpFile.addEventListener('change', () => {
    if (inpFile.files.length === 0) {
        btnUpload.disabled = true;
        fileError.classList.remove('d-none');
    } else {
        btnUpload.disabled = false;
        fileError.classList.add('d-none');
    }
});

btnUpload.addEventListener('click', () => {
    const formData = new FormData();

    formData.append("pdfFile", inpFile.files[0]);

    fetch("/extract-text", {
        method: "post",
        body: formData
    }).then(response => {
        return response.text();
    }).then(extractedText => {
        resultText.value = extractedText.trim();
    });
});