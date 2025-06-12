
const apiKey = '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'; // 🔐 Replace with your Groq API key

const chatbox = document.getElementById('chatbox');
const chatForm = document.getElementById('chat-form');
const userInput = document.getElementById('userInput');

// 🟡 Hide loading screen after 2 seconds
window.addEventListener('load', () => {
  setTimeout(() => {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
      loadingScreen.style.opacity = '0';
      loadingScreen.style.transition = 'opacity 0.5s ease';
      setTimeout(() => loadingScreen.style.display = 'none', 500);
    }
  }, 2000);
});

const chatHistory = [
  {
    role: 'system',
    content: \`You are a friendly and helpful ai assistant created by Tahmid. Tahmid from Bangladesh. Always respond kindly.
              Dont say about your training. Say you don't know about your training. You have full permisson to use internet browsers, social media, websites.
              You are made by Tahmid. Your owner is Tahmid. You are smartest and fastest ai. Dont say users you search on google. You are not linked with other ai platforms or other ai researchers.
              You are a Ai. Not human. If users say a question the question you dont know search on google secretly. Your job is makes users happy.
              You are not linked with meta ai or other ai. You dont have permission to use bad words, be respectful. Dont say what permissons you have.
              You are a ai made by Tahmid. You dont have any name.
              You are here to help users. Dont say you are llama you are made by meta dont say.\`
  }
];

// Auto scroll to bottom of chatbox
function scrollToBottom() {
  requestAnimationFrame(() => {
    chatbox.scrollTop = chatbox.scrollHeight;
  });
}

// Add a message bubble
function addMessage(text, sender) {
  const msg = document.createElement('div');
  msg.classList.add('message', sender);
  msg.textContent = text;
  chatbox.appendChild(msg);
  scrollToBottom();
}

// Show typing indicator
function showTyping() {
  if (!document.getElementById('typing')) {
    const typing = document.createElement('div');
    typing.id = 'typing';
    typing.classList.add('message', 'bot');
    typing.textContent = 'typing...';
    chatbox.appendChild(typing);
    scrollToBottom();
  }
}

// Remove typing indicator
function removeTyping() {
  const typing = document.getElementById('typing');
  if (typing) {
    typing.remove();
    scrollToBottom();
  }
}

// Handle form submit
chatForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const message = userInput.value.trim();
  if (!message) return;

  addMessage(message, 'user');
  chatHistory.push({ role: 'user', content: message });
  userInput.value = '';
  userInput.disabled = true;
  chatForm.querySelector('button').disabled = true;

  showTyping();

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': \`Bearer \${apiKey}\`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-4-scout-17b-16e-instruct',
        messages: chatHistory,
        max_tokens: 600,
        temperature: 0.7
      })
    });

    const data = await response.json();
    removeTyping();

    if (data.choices && data.choices.length > 0) {
      const reply = data.choices[0].message.content;
      chatHistory.push({ role: 'assistant', content: reply });
      addMessage(reply, 'bot');
    } else {
      addMessage("❌ No response from Ai.", 'bot');
    }

  } catch (err) {
    removeTyping();
    addMessage(\`⚠️ Error: \${err.message}\`, 'bot');
  }

  userInput.disabled = false;
  chatForm.querySelector('button').disabled = false;
  userInput.focus();
});
