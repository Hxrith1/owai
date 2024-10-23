document.addEventListener('DOMContentLoaded', function () {
    const mainText = document.getElementById('main-text');
    const terminalText = document.getElementById('terminal-text');
    const userInput = document.getElementById('user-input');
  
    // Typing effect for "ONE WORD AI"
    const titleText = "ONE WORD AI";
    let titleIndex = 0;
  
    function typeTitle() {
      if (titleIndex < titleText.length) {
        mainText.innerHTML += titleText.charAt(titleIndex);
        titleIndex++;
        setTimeout(typeTitle, 150); // Speed of typing effect for title
      } else {
        setTimeout(typeWriter, 1000); // Start "Ask me anything" after a short delay
      }
    }
  
    // Typing effect for "Ask me anything"
    const askMeAnythingText = "Ask me anything";
    let terminalIndex = 0;
  
    function typeWriter() {
      if (terminalIndex < askMeAnythingText.length) {
        terminalText.innerHTML += askMeAnythingText.charAt(terminalIndex);
        terminalIndex++;
        setTimeout(typeWriter, 100); 
      } else {
        userInput.style.display = 'block';
        userInput.focus(); // Focus the input after typing effect
      }
    }
  
 
    typeTitle();
  
    // Event listener to capture the user's question
    userInput.addEventListener('keypress', function (e) {
      if (e.key === 'Enter') {
        const question = userInput.value;
        if (question.trim()) {
          fetch('/api/ask', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ question })
          })
          .then(response => {
            if (!response.ok) {
              return response.text().then(text => { throw new Error(text) });
            }
            return response.json();
          })
          .then(data => {
            const answer = data.answer || 'unknown';
            terminalText.innerHTML += `<br/>User: ${question}<br/>OWAI: ${answer}`;
            userInput.value = ''; 
          })
          .catch(error => {
            terminalText.innerHTML += `<br/>Error communicating with AI.`;
            console.error("Server response:", error.message);
          });
        }
      }
    });
  });
  