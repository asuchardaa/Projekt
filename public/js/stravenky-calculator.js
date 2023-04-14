// Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function() {
    // Get the upload form and result table
    var form = document.getElementById('upload-form');
    var resultTable = document.getElementById('result-table');
    var uploadBtn = document.querySelector('#upload-form button[type="submit"]');


    document.getElementById("excel-file").addEventListener('change', function() {
       if (this.files[0]) {
           uploadBtn.disabled = false;
       } else {
           uploadBtn.disabled = true;
       }
    });
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

// Function to process the workbook data and generate the result table
function processWorkbook(workbook) {
    // Create a table element
    var table = document.createElement('table');
    table.classList.add('table');

    // Create a table header row
    var headerRow = table.insertRow();
    var headers = ['Jméno', 'Příjmení', 'Počet hodin v práci', 'Počet stravenek'];
    for (var i = 0; i < headers.length; i++) {
        var headerCell = document.createElement('th');
        headerCell.innerText = headers[i];
        headerRow.appendChild(headerCell);
    }

    // Get the sheet data
    var sheet = workbook.Sheets[workbook.SheetNames[0]];

    // Convert the sheet data to JSON format
    var jsonSheetData = XLSX.utils.sheet_to_json(sheet);

    // Create an object to store the total number of hours worked and meal vouchers
    var employeeData = {};

    // Loop through each row in the sheet data
    jsonSheetData.forEach(function(row) {
        // Check if the row corresponds to a working day with meal vouchers
        if ((row['Typ'] === 'SC' || row['Typ'] === 'P') && row['Příchod'] && row['Odchod']) {
            // Get the employee's name and surname
            var name = row['Jméno'];
            var surname = row['Příjmení'];

            // Calculate the number of hours worked
            var hoursWorked = row['Odchod'] - row['Příchod'];

            // Add the number of hours worked to the employee's total
            if (!employeeData[name + ' ' + surname]) {
                employeeData[name + ' ' + surname] = {
                    hoursWorked: 0,
                    mealVouchers: 0
                };
            }
            employeeData[name + ' ' + surname].hoursWorked += hoursWorked;

            // Check if the employee is entitled to a meal voucher
            if (hoursWorked >= 7) {
                employeeData[name + ' ' + surname].mealVouchers += 1;
            }
        }
    });

    // Loop through the employee data and create a table row for each employee
    Object.keys(employeeData).forEach(function(key) {
        var dataRow = table.insertRow();
        var nameCell = dataRow.insertCell();
        var nameParts = key.split(' ');
        nameCell.innerText = nameParts[0];
        var surnameCell = dataRow.insertCell();
        surnameCell.innerText = nameParts[1];
        var hoursWorkedCell = dataRow.insertCell();
        hoursWorkedCell.innerText = employeeData[key].hoursWorked;
        var mealVouchersCell = dataRow.insertCell();
        mealVouchersCell.innerText = employeeData[key].mealVouchers;
    });

    // Add the table to the HTML document
    document.body.appendChild(table);
}


