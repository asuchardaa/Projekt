$(document).ready(function () {
    // cache elements for better performance
    var $calculator = $('#calculator');
    var $fuelPriceCheck = $('#fuelPriceCheck');
    var $fuelTypeWrapper = $('#fuelTypeWrapper');
    var $fuelPriceWrapper = $('#fuelPriceWrapper');
    var $errorMessage = $('#error-container');

    // add event listener to fuelPriceCheck select
    $fuelPriceCheck.on('change', function () {
        if ($(this).val() === 'yes') {
            $fuelTypeWrapper.hide();
            $fuelPriceWrapper.show();
        } else {
            $fuelTypeWrapper.show();
            $fuelPriceWrapper.hide();
        }
    });

    // add submit event listener to calculator form
    $calculator.submit(function (event) {
        event.preventDefault();
        var distance = parseFloat($('#distance').val());
        var fuelPriceCheck = $fuelPriceCheck.val();
        var fuelType = $('#fuelType').val();
        var fuelPrice = 0;
        var wearAndTearPrice = 0;
        var errorMessageText = '';

        if (isNaN(distance) || distance <= 0) {
            errorMessageText += '<p>Zadejte platný počet najetých kilometrů!</p>';
        }

        if (fuelPriceCheck === 'yes') {
            fuelPrice = parseFloat($('#fuelPrice').val());
            if (isNaN(fuelPrice) || fuelPrice <= 0) {
                errorMessageText += '<p>Zadejte platnou cenu paliva!</p>';
            }
        } else {
            switch (fuelType) {
                case 'natural95':
                    fuelPrice = 41.20;
                    break;
                case 'natural98':
                    fuelPrice = 45.20;
                    break;
                case 'diesel':
                    fuelPrice = 44.10;
                    break;
                case 'electric':
                    fuelPrice = 8.20;
                    break;
                default:
                    errorMessageText += '<p>Zadejte platný druh paliva!</p>';
                    break;
            }
        }

        wearAndTearPrice = 5.20 * distance;

        var fuelConsumption = parseFloat($('#fuelConsumption').val());
        if (isNaN(fuelConsumption) || fuelConsumption <= 0) {
            errorMessageText += '<p>Zadejte platnou spotřebu paliva!</p>';
        }

        if (errorMessageText !== '') {
            $errorMessage.html('<p class="error">' + errorMessageText.toUpperCase() + '</p>');
        } else {
            $errorMessage.empty();
            var fuelCost = fuelPrice * distance * fuelConsumption / 100;
            var totalCost = fuelCost + wearAndTearPrice;

            var table = '<table class="table table-bordered">';
            table += '<tr><td><b>Cestovní náklady celkem:</b></td><td><strong>' + totalCost.toFixed(0) + ' Kč</strong></td></tr>';
            table += '<tr><td>Cestovní náklady: pohonné hmoty</td><td>' + fuelCost.toFixed(0) + ' Kč</td></tr>';
            table += '<tr><td>Cestovní náklady: opotřebení automobilu</td><td>' + wearAndTearPrice.toFixed(0) + ' Kč</td></tr>';
            table += '</table>';
            table += '<p style="text-align: right;">Celkové částky jsou zaokrouhlené na koruny dolů.</p>'

            $('#result').html(table);
        }
    });
});