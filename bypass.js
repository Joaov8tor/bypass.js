import axios from "axios";

export default async function handler(req, res) {
    try {
        // Verifica se a URL foi passada corretamente
        const { url } = req.query;
        if (!url) {
            return res.status(400).json({ error: "URL não fornecida." });
        }

        // Proteção contra URLs inválidas
        const isValidUrl = /^https?:\/\/.+\..+/.test(url);
        if (!isValidUrl) {
            return res.status(400).json({ error: "URL inválida." });
        }

        // Faz a requisição para a API original
        const originalApi = `https://hahabypasser-secret-or-no.vercel.app/bypass?url=${encodeURIComponent(url)}`;
        const response = await axios.get(originalApi, { timeout: 8000 });

        // Verifica se a resposta contém um resultado válido
        if (!response.data || !response.data.result) {
            return res.status(500).json({ error: "Erro ao obter os dados." });
        }

        // Retorna os dados no formato desejado
        res.status(200).json({ result: response.data.result });
    } catch (error) {
        // Tratamento avançado de erros
        if (error.code === "ECONNABORTED") {
            return res.status(504).json({ error: "Tempo de resposta excedido." });
        }
        res.status(500).json({ error: "Erro interno ao processar a requisição." });
    }
}
