document.addEventListener('DOMContentLoaded', function () {
  const mainText = document.getElementById('main-text');
  const terminalText = document.getElementById('terminal-text');
  const userInput = document.getElementById('user-input');
  const twitterLink = document.querySelector('.twitter-link');

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
      typeTwitterLink(); // Start typing Twitter link after "ONE WORD AI" is done
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

  // Typing effect for AI response
  function typeResponse(response, delay = 100) {
    let index = 0;
    function typeChar() {
      if (index < response.length) {
        terminalText.innerHTML += response.charAt(index);
        index++;
        setTimeout(typeChar, delay); // Speed of typing effect for response
      }
    }
    typeChar();
  }

  // Typing effect for Twitter Link
  const twitterText = "Twitter";
  let twitterIndex = 0;

  function typeTwitterLink() {
    if (twitterIndex < twitterText.length) {
      twitterLink.innerHTML += twitterText.charAt(twitterIndex);
      twitterIndex++;
      setTimeout(typeTwitterLink, 150); // Speed of typing effect for Twitter link
    }
  }

  typeTitle();

  // Event listener to capture the user's question
  userInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
      const question = userInput.value;
      if (question.trim()) {
        terminalText.innerHTML += `<br/>User: ${question}<br/>OWAI: `; // Prepend OWAI: but don't show answer yet

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
            userInput.value = ''; // Clear input after answer
            typeResponse(answer); // Use typing effect for AI response
          })
          .catch(error => {
            terminalText.innerHTML += `<br/>Error communicating with AI.`;
            console.error("Server response:", error.message);
          });
      }
    }
  });
});
