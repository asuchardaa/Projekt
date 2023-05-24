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
    const fileReader = new FileReader();

    fileReader.onload = function() {
        const typedArray = new Uint8Array(this.result);

        pdfjsLib.getDocument({data: typedArray}).promise.then(pdfDocument => {
            console.log('PDF loaded');

            const numPages = pdfDocument.numPages;
            let currentPage = 1;
            let textContent = "";

            function extractText() {
                pdfDocument.getPage(currentPage).then(page => {
                    console.log('Page loaded');

                    page.getTextContent().then(text => {
                        let lastY = text.items[0].transform[5];

                        text.items.forEach(item => {
                            if (Math.abs(item.transform[5] - lastY) > 1) {
                                textContent += '\n';
                                lastY = item.transform[5];
                            }

                            textContent += item.str + " ";
                        });

                        if (currentPage < numPages) {
                            currentPage++;
                            extractText();
                        } else {
                            resultText.value = textContent;
                        }
                    });
                });
            }

            extractText();

        }, error => {
            console.error(error);
        });
    };

    fileReader.readAsArrayBuffer(inpFile.files[0]);
});
