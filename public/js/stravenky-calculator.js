// Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function() {
    // Get the upload form and result textarea
    var form = document.getElementById('upload-form');
    var resultTextArea = document.getElementById('result-text');

    // Handle form submit
    form.addEventListener('submit', function(event) {
        // Prevent default form behavior
        event.preventDefault();

        // Get the uploaded file
        var file = document.getElementById('excel-file').files[0];

        // If no file was selected, show an error message and return
        if (!file) {
            document.getElementById('file-error').classList.remove('d-none');
            return;
        }

        // Hide any existing error message
        document.getElementById('file-error').classList.add('d-none');

        // Read the file using FileReader
        var reader = new FileReader();
        reader.readAsBinaryString(file);

        // Handle file reading completion
        reader.onload = function(event) {
            // Parse the file data using XLSX
            var data = event.target.result;
            var workbook = XLSX.read(data, {type: 'binary'});

            // Process the data and generate the result text
            var result = processWorkbook(workbook);

            // Set the result text in the textarea
            resultTextArea.value = result;
        };
    });
});

// Function to process the workbook data and generate the result text
function processWorkbook(workbook) {
    var result = '';
    result += 'Jméno | příjmení | počet hodin | nárok na stravenky\n';
    result += '---------------------------------------------------------\n';

    // Loop through each sheet in the workbook
    workbook.SheetNames.forEach(function(sheetName) {
        // Get the sheet data
        var sheet = workbook.Sheets[sheetName];

        // Convert the sheet data to JSON format
        var jsonSheetData = XLSX.utils.sheet_to_json(sheet);

        // Loop through each row in the sheet data
        jsonSheetData.forEach(function(row) {
            // Check if the employee is entitled to meal vouchers
            var entitled = false;
            if (row['Počet hodin'] >= 7) {
                entitled = true;
            }

            // Add the employee's information and entitlement to the result text
            result += row['Jméno'] + ' ' + row['Příjmení'] + ': ';
            result += row['Počet hodin'] + ' hodin';
            if (entitled) {
                result += ' - nárok na stravenky';
            } else {
                result += ' - bez nároku na stravenky';
            }
            result += '\n';
        });
    });

    return result;
}




