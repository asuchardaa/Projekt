const form = document.getElementById('contact-form');

form.addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the form from submitting

    // Display a success message
    const message = document.createElement('p');
    message.textContent = 'Vaše zpráva byla úspěšně odeslána.';
    message.style.color = 'red';
    message.style.fontSize = '1.5rem';
    message.style.fontWeight = 'bold';
    message.style.textAlign = 'center';
    message.style.marginTop = '1rem';
    message.style.marginBottom = '1rem';
    form.appendChild(message);

    // Clear the form fields
    form.reset();
});
