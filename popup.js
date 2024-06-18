document.addEventListener('DOMContentLoaded', async function () {
  const params = new URLSearchParams(window.location.search);
  const selectedText = decodeURIComponent(params.get('text'));
  document.getElementById('header').textContent = selectedText.charAt(0).toUpperCase() + selectedText.slice(1);
  const explanation = await sendToOpenAI(selectedText)
  document.getElementById('selected-text').textContent = explanation;
});

async function sendToOpenAI(text) {
  const messages = [
      {
          role: "system",
          content: "You are a helpful assistant that explains complex concepts in a clear and concise manner."
      },
      {
          role: "user",
          content: `Explain the following text: ${text}`
      }
  ];
  const response = await fetch("http://localhost:11434/v1/chat/completions", {
      method: "POST",
      headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ollama`
      },
      body: JSON.stringify({
        model: "llama3:8b",
        messages,
        max_tokens: 140,
        temperature: 0.5
      })
  });
  const data = await response.json();
  const explanation = data.choices[0].message.content.trim();
  return explanation
}