$(document).ready(function () {
    $('#calculator').submit(function (event) {
        event.preventDefault();
        var distance = parseFloat($('#distance').val());
        var fuelPriceCheck = $('input[name="fuelPriceCheck"]:checked').val();
        var fuelType = $('#fuelType').val();
        var fuelConsumption = parseFloat($('#fuelConsumption').val());
        var fuelPrice = 0;
        var wearAndTearPrice = 0;

        if (fuelPriceCheck === 'yes') {
            switch (fuelType) {
                case 'natural95':
                    fuelPrice = 31.50;
                    break;
                case 'natural98':
                    fuelPrice = 32.50;
                    break;
                case 'diesel':
                    fuelPrice = 30.00;
                    break;
                case 'electric':
                    fuelPrice = 6.00;
                    break;
            }
        }

        wearAndTearPrice = 5.20 * distance;

        var fuelCost = fuelPrice * distance * fuelConsumption / 100;
        var totalCost = fuelCost + wearAndTearPrice;

        $('#result').html('Cestovní náklady celkem: ' + totalCost.toFixed(2) + ' Kč. Cestovní náklady: pohonné hmoty ' + fuelCost.toFixed(2) + ' Kč a opotřebení automobilu ' + wearAndTearPrice.toFixed(2) + ' Kč.');
    });
});