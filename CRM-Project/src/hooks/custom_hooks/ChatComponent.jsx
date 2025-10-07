// ChatComponent.jsx
import React, { useEffect, useState } from 'react';
import echo from '../../echo';
import { useSubdomain } from '../../context/SubdomainContext';

const ChatComponent = () => {
    const { faviconIcon, title } = useSubdomain();
    const userData = JSON.parse(localStorage.getItem('token'));
    const token = userData.token;
    const userId = userData.UserID;
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [receiverId, setReceiverId] = useState(''); // set receiver ID manually or from a select

    useEffect(() => {

        // Check if the user has granted permission for notifications
        if (Notification.permission !== "granted") {
            Notification.requestPermission().then(permission => {
                console.log('Notification permission:', permission);
            });
        }

        // Continue your existing echo listener for real-time chat
        if (userId) {
            // Listen for new messages on the channel
            echo.channel(`chat.${userId}`)
                .listen('chat.message', (e) => {
                    console.log('New message event:', e);  // Log the entire event data to check its structure
                    if (e && e.message) {
                        const { message, sender_id } = e.message; // Destructure message and sender_id safely

                        // Only set the message if it has valid data
                        if (message && sender_id !== undefined) {
                            setMessages(prev => [...prev, { message, sender_id }]);
                        }
                    }
                });
        }
    }, [userId, title, faviconIcon]);

    const sendMessage = async () => {

        if (!input || !receiverId) return;

        const response = await fetch('http://127.0.0.1:8000/api/chat-send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                receiver_id: receiverId,
                sender_id: 35,
                message: input,
            }),
        });

        const res = await response.json();
        //console.log(res);

        if (res.Status === true) {
            const { sender_id, receiver_id, message } = res.Data;  // Extract from Data
            setMessages(prev => [...prev, { message, sender_id, receiver_id }]);
            setInput('');

            // Send a browser notification when the message is successfully sent
            if (Notification.permission === "granted") {
                new Notification(`🔔 ${title} Notification`, {
                    body: message,  // Use res.data.message or any other property from your response
                    icon: faviconIcon,  // Optional icon for the notification
                });
            }

        } else {
            console.log('Failed to send message:', res.Message);
        }
    };

    return (
        <div className="p-4 max-w-md mx-auto border rounded">
            <h2 className="text-xl font-semibold mb-2">Chat</h2>

            <input
                className="w-full border p-2 mb-2"
                placeholder="Receiver ID"
                value={receiverId}
                onChange={(e) => setReceiverId(e.target.value)}
            />

            <div className="h-64 overflow-y-auto border p-2 mb-2 bg-gray-100">
                {messages.map((msg, idx) => (
                    <div key={idx} className="mb-1">
                        <strong>{msg.sender_id === userId ? 'You' : 'Other'}:</strong> {msg.message}
                    </div>
                ))}
            </div>

            <input
                className="w-full border p-2 mb-2"
                placeholder="Type your message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
            />

            <button
                className="w-full bg-blue-500 p-2 rounded"
                onClick={sendMessage}
            >
                Send
            </button>
        </div>
    );
};

export default ChatComponent;
