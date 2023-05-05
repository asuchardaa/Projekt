document.addEventListener('DOMContentLoaded', function () {
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

    formTravelBook.addEventListener('submit', function (event) {
        event.preventDefault();
        var file = document.getElementById('excel-file-travel-book').files[0];

        if (!file) {
            document.getElementById('file-error').classList.remove('d-none');
            return;
        }

        document.getElementById('file-error').classList.add('d-none');
        var reader = new FileReader();
        reader.readAsBinaryString(file);
        reader.onload = function (event) {
            var data = event.target.result;
            var workbook = XLSX.read(data, {type: 'binary'});
            var table = processWorkbookTravelBook(workbook);
            resultTableTravelBook.innerHTML = '';
            resultTableTravelBook.appendChild(table);
        };
    })

    function processWorkbookTravelBook(workbook) {
        var tableTravelBook = document.createElement('table');
        tableTravelBook.classList.add('table');
        var headerRow = tableTravelBook.insertRow();
        var headersTravelBook = ['Jméno', 'Příjmení', 'Počet hodin na cestách', 'Proplatit'];
        for (var i = 0; i < headersTravelBook.length; i++) {
            var headerCell = document.createElement('th');
            headerCell.innerText = headersTravelBook[i];
            headerRow.appendChild(headerCell);
        }

        var employeeData = {};
        var celkemPenezProplatit = 0;
        workbook.SheetNames.forEach(function (sheetName) {
            var sheet = workbook.Sheets[sheetName];
            var jsonSheetData = XLSX.utils.sheet_to_json(sheet);
            jsonSheetData.forEach(function (row) {
                if ((row['Typ'] === 'SC') && row['Příchod'] && row['Odchod']) {
                    var name = row['Jméno'];
                    var surname = row['Příjmení'];
                    var hoursOnTheRoads = row['Odchod'] - row['Příchod'];
                    var moneyToPayTotal;
                    if (hoursOnTheRoads >= 5 && hoursOnTheRoads <= 12) {
                        moneyToPayTotal = 129;
                    } else if (hoursOnTheRoads > 12 && hoursOnTheRoads <= 18) {
                        moneyToPayTotal = 196;
                    } else {
                        moneyToPayTotal = 307;
                    }

                    if (!employeeData[name + ' ' + surname]) {
                        employeeData[name + ' ' + surname] = {
                            hoursWorked: 0,
                            kmDriven: 0,
                            moneyToPay: 0,
                        };
                    }
                    employeeData[name + ' ' + surname].hoursWorked += hoursOnTheRoads;
                    employeeData[name + ' ' + surname].moneyToPay += moneyToPayTotal;
                    celkemPenezProplatit += moneyToPayTotal;
                }
            });
        });

        Object.keys(employeeData).forEach(function (key) {
            var dataRow = tableTravelBook.insertRow();
            var nameCell = dataRow.insertCell();
            var nameParts = key.split(' ');
            nameCell.innerText = nameParts[0];
            var surnameCell = dataRow.insertCell();
            surnameCell.innerText = nameParts[1];
            var hoursTravelledCell = dataRow.insertCell();
            hoursTravelledCell.innerText = employeeData[key].hoursWorked;
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
        totalLabelCell.colSpan = 1;
        var totalMoneyCell = totalRow.insertCell();
        totalMoneyCell.classList.add('table-total-value');
        totalMoneyCell.innerText = celkemPenezProplatit.toFixed(2) + ' Kč';
        totalMoneyCell.style.fontWeight = 'bold';

        return tableTravelBook;
    }
});