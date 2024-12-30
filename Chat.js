const chatHistoryKey = 'chat_history';

function loadChatHistory() {
  const history = JSON.parse(localStorage.getItem(chatHistoryKey)) || [];
  history.forEach(message => addMessage(message.text, message.sender));
}

function saveMessageToHistory(text, sender) {
  const history = JSON.parse(localStorage.getItem(chatHistoryKey)) || [];
  history.push({ text, sender });
  localStorage.setItem(chatHistoryKey, JSON.stringify(history));
}

async function sendMessage() {
  const message = messageInput.value.trim();
  if (!message) return;
  addMessage(message, 'user');
  saveMessageToHistory(message, 'user');
  messageInput.value = '';
  typingIndicator.style.display = 'block';
  try {
    const response = await fetch(`https://darkness.ashlynn.workers.dev/chat/?prompt=${encodeURIComponent(message)}&model=gpt-4o-mini`);
    const data = await response.json();
    typingIndicator.style.display = 'none';
    const botMessage = data.successful === 'success' && data.response ? data.response : 'An error occurred. Please try again.';
    addMessage(botMessage, 'bot');
    saveMessageToHistory(botMessage, 'bot');
  } catch (error) {
    console.error(error);
    typingIndicator.style.display = 'none';
    const errorMessage = 'An error occurred. Please try again.';
    addMessage(errorMessage, 'bot');
    saveMessageToHistory(errorMessage, 'bot');
  }
}

loadChatHistory();
