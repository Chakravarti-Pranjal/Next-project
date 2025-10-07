import React, { useEffect, useState } from 'react'
import avatar from "../../../images/avatar/1.jpg";
import { useDispatch, useSelector } from 'react-redux';
import { useSubdomain } from '../../../context/SubdomainContext';
import echo from '../../../echo';

const ChatTimeline = ({ onNote }) => {
    const baseUrl = import.meta.env.VITE_CHATNOTIFICATION_URI;
    const { faviconIcon, title } = useSubdomain();
    const [chatUsers, setChatUsers] = useState([]);
    const tokenString = localStorage.getItem("token");
    const tokenData = JSON.parse(tokenString); // Now it's an object
    const token = tokenData?.token; // Now it's an object
    const userId = tokenData?.UserID;
    const [openMsg, setOpenMsg] = useState(false);
    const [chatUserData, setChatUserData] = useState([]);

    const dispatch = useDispatch();

    // To open
    const handleOpen = () => dispatch({ type: "OPEN_MSG" });

    // To close
    const handleClose = () => dispatch({ type: "CLOSE_MSG" });

    const handleChatClick = () => {
        dispatch({ type: "ADD_CHAT" });
    };

    const handleNotificationClick = () => {
        dispatch({ type: "ADD_NOTIFICATION" });
    };

    // const chat11 = useSelector((state) => state.chatUserDataReducer.chatData);

    const handleChatUserData = () => {
        //dispatch({ type: "SAVE_CHAT_USER_DATA", payload: chatUserData});

    }

    // useEffect(() => {
    //     console.log("REDUCER DATA US  ",chat11);
    // },[chat11])

    const [show, setShow] = useState(false);

    const handleToggle = (isOpen) => {
        setShow(isOpen);
    };

    const handleLinkClick = () => {
        setShow(false); // Close the dropdown
    };

    const [showChat, setShowChat] = useState(false);

    const handleToggleChat = (isOpen) => {
        setShowChat(isOpen);
    };

    const handleLinkClickChat = () => {
        setShowChat(false); // Close the dropdown
    };

    useEffect(() => {
        const fetchChatUsers = async () => {
            try {
            const response = await fetch(`${baseUrl}chat-list`, {
                method: "POST",
                headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({
                userId: tokenData.UserID,
                companyId: tokenData.companyKey,
                }),
            });

            const result = await response.json();

            if (result.Status) {
                setChatUsers(result.Data);
            }
            } catch (error) {
            console.error("Failed to fetch chat users", error);
            }
        };

        fetchChatUsers();
    }, []); // 👈 Empty dependency array = only runs once

    useEffect(() => {
        const fetchChatUsers = async () => { /* ... */ };
        fetchChatUsers();
        const interval = setInterval(fetchChatUsers, 5000); // every 60s
        return () => clearInterval(interval);
    }, []);

    const colorClasses = ['media-primary', 'media-info', 'media-success', 'media-danger', 'media-warning']; // your predefined classes
    // Function to shuffle the array
    const shuffleArray = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]]; // Swap elements
        }
        return array;
    };

    const getRandomClass = (index) => {
        // Shuffle colorClasses every time the data is loaded
        const shuffledClasses = shuffleArray([...colorClasses]);
        return shuffledClasses[index % shuffledClasses.length];
    };

    return (
        <>
            <ul className="timeline">
                {chatUsers.map((user, index) => (
                    <li key={user.UserId} onClick={() => {
                        //handleChatUserData();
                        handleOpen()
                        onNote()
                        handleLinkClickChat()
                    }}>
                        <div className="timeline-panel c-pointer" onClick={() => setOpenMsg(true)}>
                            {user.ProfileLogoImageData == null ?
                                <div className={`media me-2 ${getRandomClass(index)}`}>{user.Name?.substring(0, 2).toUpperCase()}</div>
                                : (<div className="media me-2">
                                    <img alt="images" width={50} src={user.ProfileLogoImageData} />
                                </div>)}

                            <div className="media-body">
                                <h6 className="mb-1">{user.Name}</h6>
                                <small className="d-block">
                                    {user.last_message_time}
                                </small>
                            </div>
                        </div>
                    </li>
                ))}
                {/* <li>
                <div className="timeline-panel">
                    <div className="media me-2">
                    <img alt="images" width={50} src={avatar} />
                    </div>
                    <div className="media-body">
                    <h6 className="mb-1">Dr sultads Send you Photo</h6>
                    <small className="d-block">
                        29 July 2022 - 02:26 PM
                    </small>
                    </div>
                </div>
                </li>
                <li>
                <div className="timeline-panel">
                    <div className="media me-2 media-primary">KG</div>
                    <div className="media-body">
                    <h6 className="mb-1">
                        Resport created successfully
                    </h6>
                    <small className="d-block">
                        29 July 2022 - 02:26 PM
                    </small>
                    </div>
                </div>
                </li>
                <li>
                <div className="timeline-panel">
                    <div className="media me-2 media-success">
                    <i className="fa fa-home" />
                    </div>
                    <div className="media-body">
                    <h6 className="mb-1">Reminder : Treatment Time!</h6>
                    <small className="d-block">
                        29 July 2022 - 02:26 PM
                    </small>
                    </div>
                </div>
                </li>
                <li>
                <div className="timeline-panel">
                    <div className="media me-2">
                    <img alt="" width={50} src={avatar} />
                    </div>
                    <div className="media-body">
                    <h6 className="mb-1">Dr sultads Send you Photo</h6>
                    <small className="d-block">
                        29 July 2022 - 02:26 PM
                    </small>
                    </div>
                </div>
                </li>
                <li>
                <div className="timeline-panel">
                    <div className="media me-2 media-danger">KG</div>
                    <div className="media-body">
                    <h6 className="mb-1">
                        Resport created successfully
                    </h6>
                    <small className="d-block">
                        29 July 2022 - 02:26 PM
                    </small>
                    </div>
                </div>
                </li>
                <li>
                <div className="timeline-panel">
                    <div className="media me-2 media-primary">
                    <i className="fa fa-home" />
                    </div>
                    <div className="media-body">
                    <h6 className="mb-1">Reminder : Treatment Time!</h6>
                    <small className="d-block">
                        29 July 2022 - 02:26 PM
                    </small>
                    </div>
                </div>
                </li> */}
            </ul>
        </>
    );
}

export default ChatTimeline