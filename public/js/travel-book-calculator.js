// Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function () {
// Get the upload form and result table
    var formTravelBook = document.getElementById('upload-form-travel-book');
    var resultTableTravelBook = document.getElementById('result-table-travel-book');
    var uploadBtnTravelBook = document.querySelector('#upload-form-travel-book button[type="submit"]');


    document.getElementById("excel-file-travel-book").addEventListener('change', function () {
        if (this.files[0]) {
            uploadBtnTravelBook.disabled = false;
        } else {
            uploadBtnTravelBook.disabled = true;
        }
    });

// Handle form submit
    formTravelBook.addEventListener('submit', function (event) {
        // Prevent default form behavior
        event.preventDefault();

        // Get the uploaded file
        var file = document.getElementById('excel-file-travel-book').files[0];

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
        reader.onload = function (event) {
            // Parse the file data using XLSX
            var data = event.target.result;
            var workbook = XLSX.read(data, {type: 'binary'});

            // Process the data and generate the result table
            var table = processWorkbookTravelBook(workbook);

            // Set the result table in the div
            resultTableTravelBook.innerHTML = '';
            resultTableTravelBook.appendChild(table);
        };
    })

    function processWorkbookTravelBook(workbook) {
        // Create a table element
        var tableTravelBook = document.createElement('table');
        tableTravelBook.classList.add('table');

        // Create a table header row
        var headerRow = tableTravelBook.insertRow();
        var headersTravelBook = ['Jméno', 'Příjmení', 'Počet hodin na cestách', 'Počet najetých km', 'Proplatit'];
        for (var i = 0; i < headersTravelBook.length; i++) {
            var headerCell = document.createElement('th');
            headerCell.innerText = headersTravelBook[i];
            headerRow.appendChild(headerCell);
        }

        // Create an object to store the total number of hours worked and meal vouchers
        var employeeData = {};
        var celkemPenezProplatit = 0;

        // Loop through each sheet in the workbook
        workbook.SheetNames.forEach(function (sheetName) {
            var sheet = workbook.Sheets[sheetName];
            // Convert the sheet data to JSON format
            var jsonSheetData = XLSX.utils.sheet_to_json(sheet);

            // Loop through each row in the sheet data
            jsonSheetData.forEach(function (row) {
                // Check if the row corresponds to a working day with meal vouchers
                if ((row['Typ'] === 'SC') && row['Příchod'] && row['Odchod'] && row['Km']) {
                    // Get the employee's name and surname
                    var name = row['Jméno'];
                    var surname = row['Příjmení'];
                    var hoursOnTheRoads = row['Odchod'] - row['Příchod'];
                    var kmDrivenInTotal = row['Km'];
                    var moneyToPayTotal = kmDrivenInTotal * 5.2;

                    // Add the number of hours worked to the employee's total
                    if (!employeeData[name + ' ' + surname]) {
                        employeeData[name + ' ' + surname] = {
                            hoursWorked: 0,
                            kmDriven: 0,
                            moneyToPay: 0,
                        };
                    }
                    employeeData[name + ' ' + surname].hoursWorked += hoursOnTheRoads;
                    employeeData[name + ' ' + surname].kmDriven += kmDrivenInTotal;
                    employeeData[name + ' ' + surname].moneyToPay += moneyToPayTotal;
                    celkemPenezProplatit += moneyToPayTotal;
                }
            });
        });

        // Loop through the employee data and create a table row for each employee
        Object.keys(employeeData).forEach(function (key) {
            var dataRow = tableTravelBook.insertRow();
            var nameCell = dataRow.insertCell();
            var nameParts = key.split(' ');
            nameCell.innerText = nameParts[0];
            var surnameCell = dataRow.insertCell();
            surnameCell.innerText = nameParts[1];
            var hoursTravelledCell = dataRow.insertCell();
            hoursTravelledCell.innerText = employeeData[key].hoursWorked;
            var kmDrivenCell = dataRow.insertCell();
            kmDrivenCell.innerText = employeeData[key].kmDriven;
            var moneyToPayCell = dataRow.insertCell();
            moneyToPayCell.innerText = employeeData[key].moneyToPay.toFixed(2) + ' Kč';
        });

        var totalRow = tableTravelBook.insertRow();
        totalRow.classList.add('table-total');
        var totalLabelCell = totalRow.insertCell();
        totalLabelCell.classList.add('table-total-label');
        totalLabelCell.innerText = 'Celkem proplatit:';
        var spacerCell1 = totalRow.insertCell();
        var spacerCell2 = totalRow.insertCell();
        var spacerCell3 = totalRow.insertCell();
        totalLabelCell.colSpan = 1;
        var totalMoneyCell = totalRow.insertCell();
        totalMoneyCell.classList.add('table-total-value');
        totalMoneyCell.innerText = celkemPenezProplatit + ' Kč';
        totalMoneyCell.style.fontWeight = 'bold';

        return tableTravelBook;
    }
});
