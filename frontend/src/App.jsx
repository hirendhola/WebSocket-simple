import { useEffect, useRef, useState } from 'react';
import './App.css';

function App() {
  const [messages, setMessages] = useState([]);
  const [showDisclaimer, setShowDisclaimer] = useState(true);
  const messageInputRef = useRef();
  const webSocketRef = useRef(null);


  useEffect(() => {
    webSocketRef.current = new WebSocket("wss://websocketsimple.glitch.me/");

    webSocketRef.current.onopen = (event) => {
      console.log("WebSocket connection opened", event.data);
    };

    webSocketRef.current.onmessage = (event) => {
      handleIncomingMessage(event.data);
    };

    webSocketRef.current.onclose = (event) => {
      console.log("WebSocket connection closed", event.data);
    };

    return () => {
      if (webSocketRef.current) {
        webSocketRef.current.close();
      }
    };
  }, []);

  const handleIncomingMessage = (message) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  };

  const sendMessage = () => {
    const messageInput = messageInputRef.current;
    const message = messageInput.value.trim();

    if (message !== "") {
      webSocketRef.current.send(message);

      messageInput.value = "";
    }
  };

  const closeDisclaimer = () => {
    setShowDisclaimer(false);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      sendMessage();
    }
  };


  return (
    <>
      <div className="container">

        <div className="child_container">
          {showDisclaimer ? (
            <div className="disclaimer-dialog">
              <div className="disclaimer-text">
                <b>Disclaimer:</b> This chat is for demonstration purposes only. Messages are not encrypted, and anyone with access to the communication channel can view the content. This project is designed for beginners to learn about WebSocket communication and should not be used for sensitive or private information.

              </div>
              <b>we dont store chat on database</b>
              <button className="btn" onClick={closeDisclaimer}>
                <b>Close</b>
              </button>
            </div>
          ) : <div className="chat_container">
            {messages.map((message, index) => (
              <p key={index} className="chat">
                {message}
              </p>
            ))}
          </div>
          }
        </div>
        {
          !showDisclaimer ? <div className="input_container">
            <input type="text" placeholder="write here" ref={messageInputRef} onKeyDown={handleKeyDown} />
            <button className="btn" onClick={sendMessage}>
              Send
            </button>
          </div> : null
        }

      </div>
    </>
  );
}

export default App;
