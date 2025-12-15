export function handleError(error: any) {
    if (error.response) {
        console.error(
            "Erro da API:",
            error.response.status,
            error.response.data,
        );

        switch (error.response.status) {
            case 400:
                throw new Error("Dados inválidos.");
            case 401:
                throw new Error("Não autorizado.");
            case 404:
                throw new Error("Registro não encontrado.");
            case 409:
                throw new Error(
                    "Conflito: já existe um cadastro com esses dados.",
                );
            case 500:
                throw new Error(
                    "Erro interno no servidor. Tente novamente mais tarde.",
                );
            default:
                throw new Error("Erro desconhecido na API.");
        }
    }

    if (error.request) {
        throw new Error("Servidor não respondeu. Verifique sua conexão.");
    }

    throw new Error("Erro inesperado no cliente.");
}