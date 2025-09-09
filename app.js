// app.js
const GEMINI_API_KEY = "SUA_CHAVE_AQUI"; // substitua pela sua chave da API do Gemini
const GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

async function gerarImagemGemini(prompt) {
  try {
    const response = await fetch(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          { role: "user", parts: [{ text: prompt }] }
        ],
        generationConfig: {
          responseMimeType: "image/png" // pedindo imagem
        }
      })
    });

    if (!response.ok) {
      throw new Error("Erro na API Gemini: " + response.status);
    }

    const data = await response.json();

    // a API retorna a imagem em base64
    const base64Image = data.candidates?.[0]?.content?.parts?.[0]?.inline_data?.data;
    if (!base64Image) {
      throw new Error("Não foi possível gerar a imagem.");
    }

    return "data:image/png;base64," + base64Image;
  } catch (err) {
    console.error(err);
    alert("Falha ao gerar a imagem.");
    return null;
  }
}

// função auxiliar para montar o prompt com os itens escolhidos
function montarPrompt(state, catalog) {
  const escolhidos = catalog
    .filter(it => state.items[it.id]?.enabled && state.items[it.id].qty > 0)
    .map(it => {
      const s = state.items[it.id];
      return `${s.qty} ${it.unit} de ${it.name}`;
    });

  if (escolhidos.length === 0) {
    return "Um café da manhã simples.";
  }

  return "Gere uma imagem realista de um café da manhã com: " + escolhidos.join(", ");
}
