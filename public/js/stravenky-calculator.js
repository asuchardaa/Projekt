document.addEventListener('DOMContentLoaded', function () {
    var form = document.getElementById('upload-form');
    var resultTable = document.getElementById('result-table');
    var uploadBtn = document.querySelector('#upload-form button[type="submit"]');

    document.getElementById("excel-file").addEventListener('change', function () {
        if (this.files[0]) {
            uploadBtn.disabled = false;
        } else {
            uploadBtn.disabled = true;
        }
    });

    form.addEventListener('submit', function (event) {
        event.preventDefault();
        var file = document.getElementById('excel-file').files[0];

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
            var table = processWorkbook(workbook);
            resultTable.innerHTML = '';
            resultTable.appendChild(table);
        };
    });

    function processWorkbook(workbook) {
        var table = document.createElement('table');
        table.classList.add('table');
        var headerRow = table.insertRow();
        var headers = ['Jméno', 'Příjmení', 'Počet hodin v práci', 'Počet stravenek'];
        for (var i = 0; i < headers.length; i++) {
            var headerCell = document.createElement('th');
            headerCell.innerText = headers[i];
            headerRow.appendChild(headerCell);
        }

        var employeeData = {};
        var celkemStravenek = 0;
        workbook.SheetNames.forEach(function (sheetName) {
            var sheet = workbook.Sheets[sheetName];
            var jsonSheetData = XLSX.utils.sheet_to_json(sheet);
            jsonSheetData.forEach(function (row) {
                if ((row['Typ'] === 'P') && row['Příchod'] && row['Odchod']) {
                    var name = row['Jméno'];
                    var surname = row['Příjmení'];
                    var hoursWorked = row['Odchod'] - row['Příchod'];
                    if (!employeeData[name + ' ' + surname]) {
                        employeeData[name + ' ' + surname] = {
                            hoursWorked: 0,
                            mealVouchers: 0
                        };
                    }

                    employeeData[name + ' ' + surname].hoursWorked += hoursWorked;
                    if (hoursWorked >= 5) {
                        employeeData[name + ' ' + surname].mealVouchers += 1;
                        celkemStravenek += 1;
                    }
                }
            });
        });

        Object.keys(employeeData).forEach(function (key) {
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

        var totalRow = table.insertRow();
        totalRow.classList.add('table-total');
        var totalLabelCell = totalRow.insertCell();
        totalLabelCell.classList.add('table-total-label');
        totalLabelCell.innerText = 'Celkem stravenek:';
        // totalLabelCell.style.fontWeight = 'bold';
        // totalLabelCell.style.textAlign = 'left';
        var spaceCell1 = totalRow.insertCell();
        var spaceCell2 = totalRow.insertCell();
        totalLabelCell.colSpan = 1;
        var totalMealVouchersCell = totalRow.insertCell();
        totalMealVouchersCell.classList.add('table-total-value');
        totalMealVouchersCell.innerText = celkemStravenek;
        totalMealVouchersCell.style.fontWeight = 'bold';

        return table;
    }
});
