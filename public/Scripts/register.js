export function Register() {
    const registerForm = document.getElementById('registerForm');

    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Pobranie wartości z formularza
        const imie = document.getElementById('registerFirstname').value;
        const nazwisko = document.getElementById('registerLastname').value;
        const email = document.getElementById('registerEmail').value;
        const haslo = document.getElementById('registerPassword').value;
        const confirmhaslo = document.getElementById('registerConfirmPassword').value;
        const ulica = document.getElementById('registerStreet').value;
        const miejscowosc = document.getElementById('registerCity').value;
        const kod_pocztowy = document.getElementById('registerPostalCode').value;
        const panstwo = document.getElementById('registerCountry').value;

        // Walidacja haseł
        if (haslo !== confirmhaslo) {
            alert('Passwords do not match!');
            return;
        }

        // Prosty przykład walidacji wymaganych pól
        if (!imie || !nazwisko || !email || !haslo) {
            alert('Please fill in all required fields!');
            return;
        }

        // Przykładowe dane do rejestracji
        const registrationData = {
            imie,
            nazwisko,
            haslo,
            email,
            adres: {
                ulica,
                miejscowosc,
                kod_pocztowy,
                panstwo,
            },
        };

        // Wysyłanie danych do serwera
        fetch('http://localhost:3000/api/Uzytkownicy/Rejestracja', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(registrationData),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Registration failed!');
                }
                return response.json();
            })
            .then(data => {
                console.log('Registration successful:', data);
                alert('Registration successful! You can now log in.');

                // Zamknij modal po udanej rejestracji
                const registerModal = bootstrap.Modal.getInstance(document.getElementById('registerModal'));
                registerModal.hide();

                // Opcjonalnie otwórz modal logowania po rejestracji
                const loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
                loginModal.show();
            })
            .catch(error => {
                console.error('Registration error:', error);
                alert('Registration failed. Please try again.');
            });
    });
}
