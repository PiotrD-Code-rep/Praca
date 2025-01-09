function getJwtToken() {
    const cookies = document.cookie.split('; ');
    const tokenCookie = cookies.find(row => row.startsWith('token='));
    return tokenCookie ? tokenCookie.split('=')[1] : null;
}

// Pobierz listę użytkowników
async function fetchUsers() {
    const token = getJwtToken();
    const response = await fetch('/api/Uzytkownicy', {
        headers: {
            'Authorization': `Bearer ${token}`, // Dodaj token do nagłówka
        },
    });
    if (response.ok) {
        const users = await response.json();
        const userTable = document.getElementById('userTable');
        if (userTable) {
            userTable.innerHTML = users.map(user => `
                <tr>
                    <td>${user._id}</td>
                    <td>${user.imie}</td>
                    <td>${user.nazwisko}</td>
                    <td>${user.email}</td>
                    <td>${user.admin ? 'Tak' : 'Nie'}</td>
                    <td>
                        <button class="btn btn-warning btn-sm" onclick="editUser('${user._id}')">Edytuj</button>
                        <button class="btn btn-danger btn-sm" onclick="deleteUser('${user._id}')">Usuń</button>
                    </td>
                </tr>
            `).join('');
        }
    } else {
        alert("Błąd podczas pobierania użytkowników!");
    }
}

// Dodaj nowego użytkownika
async function addUser(user) {
    const token = getJwtToken();
    const response = await fetch('/api/Uzytkownicy', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(user),
    });
    if (response.ok) {
        fetchUsers();
    } else {
        alert("Błąd podczas dodawania użytkownika!");
    }
}

// Edytuj użytkownika
async function editUser(userId) {
    const token = getJwtToken();
    const response = await fetch(`/api/Uzytkownicy/${userId}`, {
        headers: {
            'Authorization': `Bearer ${token}`, // Dodaj token do nagłówka
        },
    });

    if (response.ok) {
        const user = await response.json();
        document.getElementById('userId').value = user._id;
        document.getElementById('userName').value = user.imie;
        document.getElementById('userSurname').value = user.nazwisko;
        document.getElementById('userEmail').value = user.email;
        document.getElementById('userPassword').value = ''; // Hasło można wymagać w osobnej edycji
        document.getElementById('userAdmin').checked = user.admin;
        document.getElementById('modalTitle').innerText = 'Edytuj użytkownika';
        showModal();
    } else {
        alert("Błąd podczas pobierania danych użytkownika!");
    }
}

// Usuń użytkownika
async function deleteUser(userId) {
    const token = getJwtToken();
    if (confirm('Czy na pewno chcesz usunąć tego użytkownika?')) {
        const response = await fetch(`/api/Uzytkownicy/${userId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        if (response.ok) {
            fetchUsers();
        } else {
            alert("Błąd podczas usuwania użytkownika!");
        }
    }
}


// Pokaż modal
function showModal() {
    const modalElement = document.getElementById('userModal');
    if (modalElement) {
        const modal = new bootstrap.Modal(modalElement);
        modal.show();
    } else {
        console.error("Nie znaleziono elementu modala z ID 'userModal'.");
    }
}

// Zamknij modal
function closeModal() {
    const modalElement = document.getElementById('userModal');
    if (modalElement) {
        const modal = bootstrap.Modal.getInstance(modalElement);
        modal.hide();
    } else {
        console.error("Nie znaleziono elementu modala z ID 'userModal'.");
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const userForm = document.getElementById('userForm');
    if (userForm) {
        userForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const userId = document.getElementById('userId').value;
            const user = {
                imie: document.getElementById('userName').value,
                nazwisko: document.getElementById('userSurname').value,
                email: document.getElementById('userEmail').value,
                haslo: document.getElementById('userPassword').value,
                adres: {
                    ulica: document.getElementById('userStreet').value,
                    miejscowosc: document.getElementById('userCity').value,
                    kod_pocztowy: document.getElementById('userPostalCode').value,
                    panstwo: document.getElementById('userCountry').value,
                },
                admin: document.getElementById('userAdmin').checked,
            };

            const token = getJwtToken();

            if (userId) {
                // Aktualizacja użytkownika
                const response = await fetch(`/AdminPanel/uzytkownicy/${userId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify(user),
                });
                if (response.ok) {
                    alert("Użytkownik zaktualizowany pomyślnie.");
                    fetchUsers();
                    closeModal();
                } else {
                    alert("Błąd podczas aktualizacji użytkownika.");
                }
            } else {
                // Dodawanie nowego użytkownika
                const response = await fetch('/AdminPanel/uzytkownicy', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify(user),
                });
                if (response.ok) {
                    alert("Użytkownik dodany pomyślnie.");
                    fetchUsers();
                    closeModal();
                } else {
                    alert("Błąd podczas dodawania użytkownika.");
                }
            }
        });
    }
});


function showAddUserForm() {
    // Wyzerowanie pól formularza
    document.getElementById('userId').value = '';
    document.getElementById('userName').value = '';
    document.getElementById('userSurname').value = '';
    document.getElementById('userEmail').value = '';
    document.getElementById('userPassword').value = '';
    document.getElementById('userAdmin').checked = false;

    // Ustaw tytuł modala
    document.getElementById('modalTitle').innerText = 'Dodaj użytkownika';

    // Wyświetl modal
    showModal();
}
// Inicjalizuj pobieranie użytkowników po załadowaniu DOM
document.addEventListener('DOMContentLoaded', fetchUsers);
