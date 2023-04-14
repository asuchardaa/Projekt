// Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function() {
    // Get the upload form and result table
    var form = document.getElementById('upload-form');
    var resultTable = document.getElementById('result-table');

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

            // Process the data and generate the result table
            var table = processWorkbook(workbook);

            // Set the result table in the div
            resultTable.innerHTML = '';
            resultTable.appendChild(table);
        };
    });
});

// Function to process the workbook data and generate the result text
// Function to process the workbook data and generate the result table
function processWorkbook(workbook) {
    // Create a table element
    var table = document.createElement('table');
    table.classList.add('table');

    // Create a table header row
    var headerRow = table.insertRow();
    var headers = ['Jméno', 'Příjmení', 'Počet hodin', 'Nárok na stravenky'];
    for (var i = 0; i < headers.length; i++) {
        var headerCell = document.createElement('th');
        headerCell.innerText = headers[i];
        headerRow.appendChild(headerCell);
    }

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

            // Create a table row for the employee data
            var dataRow = table.insertRow();
            var nameCell = dataRow.insertCell();
            nameCell.innerText = row['Jméno'];
            var surnameCell = dataRow.insertCell();
            surnameCell.innerText = row['Příjmení'];
            var hoursCell = dataRow.insertCell();
            hoursCell.innerText = row['Počet hodin'];
            var entitledCell = dataRow.insertCell();
            if (entitled) {
                entitledCell.innerText = 'Ano';
            } else {
                entitledCell.innerText = 'Ne';
            }
        });
    });

    return table;
}
