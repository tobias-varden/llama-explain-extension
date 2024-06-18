document.addEventListener('DOMContentLoaded', async function () {
  const params = new URLSearchParams(window.location.search);
  const selectedText = decodeURIComponent(params.get('text'));
  document.getElementById('header').textContent = selectedText.charAt(0).toUpperCase() + selectedText.slice(1);
  const prompt = `Explain the following text: ${selectedText}`
  const explanation = await sendToOpenAI(prompt)
  document.getElementById('selected-text').textContent = explanation;
});

let messages = [
  {
    role: "system",
    content: "You are a helpful assistant that explains complex concepts in a clear and concise manner."
  }
]

async function sendToOpenAI(message) {
  console.log(message)
  messages =[ 
      ...messages,
      {
          role: "user",
          content: message
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
  messages = [...messages, {role: "assistant", content: explanation}]
  
  return explanation
}


document.getElementById('ask-btn').addEventListener('click', async function () {
  sendFollowUpQuestion();
});

document.getElementById('follow-up-input').addEventListener('keypress', async function (event) {
  if (event.key === 'Enter') {
    sendFollowUpQuestion();
  }
});

async function sendFollowUpQuestion() {
  document.getElementById('selected-text').textContent = "Asking follow-up question..."
  const followUpQuestion = document.getElementById('follow-up-input').value;
  const response = await sendToOpenAI(followUpQuestion);
  document.getElementById('selected-text').textContent = response;
  document.getElementById('follow-up-input').value = ""
}
