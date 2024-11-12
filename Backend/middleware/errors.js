function errors(err,req,res,next){
    // Domyślnie ustaw kod błędu na 500, jeśli nie jest podany
    const statusCode = err.statusCode || 500;

    // Logowanie błędu na serwerze dla celów debugowania
    console.error(`[Error ${statusCode}]: ${err.message}`);

    // Przygotowanie odpowiedzi z błędem
    const errorResponse = {
        success: false,
        message: err.message || 'Wewnętrzny błąd serwera'
    };

    // Dodaj więcej informacji w środowisku deweloperskim
    if (process.env.NODE_ENV !== 'production') {
        errorResponse.stack = err.stack;
    }

    // Dodatkowe przykłady niestandardowych wiadomości błędów
    if (statusCode === 400) {
        errorResponse.message = 'Nieprawidłowe żądanie. Sprawdź dane wejściowe.';
    } else if (statusCode === 404) {
        errorResponse.message = 'Nie znaleziono zasobu.';
    } else if (statusCode === 401) {
        errorResponse.message = 'Brak autoryzacji. Uwierzytelnij się, aby uzyskać dostęp.';
    } else if (statusCode === 403) {
        errorResponse.message = 'Brak dostępu. Brak odpowiednich uprawnień.';
    }

    // Ustaw status i zwróć odpowiedź JSON
    res.status(statusCode).json(errorResponse);
}

module.exports=errors
