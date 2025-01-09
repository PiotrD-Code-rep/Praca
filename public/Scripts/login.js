export function Login() {
    const loginForm = document.getElementById('loginForm');

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Pobranie wartości z formularza
        const email = document.getElementById('loginEmail').value;
        const haslo = document.getElementById('loginPassword').value;

        // Prosty przykład walidacji
        if (!email || !haslo) {
            alert('Please fill in both email and password!');
            return;
        }

        // Przykładowe dane do logowania
        const loginData = {
            email,
            haslo,
        };

        // Wysyłanie danych do serwera
        fetch('http://localhost:3000/api/Uzytkownicy/Logowanie', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(loginData),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Login failed!');
                }
                return response.json();
            })
            .then(data => {
                console.log('Login successful:', data);

              
                alert('Login successful!');

                // Zamknij modal po udanym logowaniu
                const loginModal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
                loginModal.hide();

                // Przykład przekierowania po logowaniu
                //  window.location.href = '/'; // Zmień na swój URL
            })
            .catch(error => {
                console.error('Login error:', error);
                alert('Invalid credentials or server error.');
            });
    });
}
