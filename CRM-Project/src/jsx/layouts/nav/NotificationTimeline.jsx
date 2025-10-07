import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom'
import echo from '../../../echo';
import { useSubdomain } from '../../../context/SubdomainContext';

const NotificationTimeline = () => {
    const { faviconIcon, title } = useSubdomain();
    const [notififcationList, setNotififcationList] = useState([]);
    const tokenString = localStorage.getItem("token");
    const tokenData = JSON.parse(tokenString); // Now it's an object
    const token = tokenData.token; // Now it's an object
    const userId = tokenData.UserID;

    const dispatch = useDispatch();

    const colorClasses = ['primary', 'info', 'success', 'danger', 'warning', 'dark']; // your predefined classes
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

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await fetch("http://127.0.0.1:8000/api/notifications-list", {
                    method: "POST", // important
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        userId: tokenData.UserID,
                        companyId: tokenData.companyKey,
                        per_page: 10
                    }),
                });
                const result = await response.json();
                //console.log("Notification data is: ", result.Data);
                if (result.status) {
                    setNotififcationList(result.Data);
                    //console.log("Notification Count iss:", result.unreadCount);
                    dispatch({ type: "SET_NOTIFICATION_COUNT", payload: Number(result.unreadCount)});
                }
            } catch (error) {
                console.error("Failed to fetch chat users", error);
            }

        };

        fetchNotifications(); // fetch initially

        const channel = echo.channel(`user.${userId}`);
        channel.listen('.notification.received', (event) => {
            console.log("Notification Event:", event);
            // Show desktop notification
            //const { data } = event;
            
            const { id, sender_id, notifiable_id, data, read_at, notificationStatus, created_at, unreadCount } = event;
            const transformed = {
                id: id || Math.random().toString(), // fallback if no ID
                sender_id,
                notifiable_id,
                title: data?.title || '',
                body: data?.body || '',
                read_at,
                status: notificationStatus === 1 ? "Sent" : "Not Sent",
                time_ago: created_at ? moment(created_at).fromNow() : "Just now",
            };
            
            // Add notification to state
            setNotififcationList((prev) => [transformed, ...prev]);

            
            if (data && Notification.permission === "granted") {
                new Notification(`🔔 ${data.title || 'New'} Notification`, {
                    body: data.body,
                    icon: faviconIcon,
                });
            }
            dispatch({ type: "INCREMENT_NOTIFICATION_COUNT" }); // ✅ increase count
        });

        // Cleanup on unmount
        return () => {
            channel.stopListening('.notification.received');
            echo.leave(`user.${userId}`);
        };
    }, [userId]);

    return (
        <>
            <ul className="timeline">
                {notififcationList.map((notification, index) => (
                    <li key={index}>
                        <div className={`timeline-badge ${getRandomClass(index)}`} />
                        <Link
                            className="timeline-panel c-pointer text-muted"
                            to="#"
                        >
                            <span>{notification.time_ago}</span>
                            <h6 className="mb-0">
                                {notification.title}
                                {/* <strong className="text-primary">$500</strong>. */}
                            </h6>
                            <p className="mb-0">{notification.body}...</p>
                        </Link>
                    </li>
                ))}
                {/* <li>
                    <div className="timeline-badge info"></div>
                    <Link
                        className="timeline-panel c-pointer text-muted"
                        to="#"
                    >
                        <span>20 minutes ago</span>
                        <h6 className="mb-0">
                            New order placed{" "}
                            <strong className="text-info">#XF-2356.</strong>
                        </h6>
                        <p className="mb-0">
                            Quisque a consequat ante Sit amet magna at
                            volutapt...
                        </p>
                    </Link>
                </li>
                <li>
                    <div className="timeline-badge danger"></div>
                    <Link
                        className="timeline-panel c-pointer text-muted"
                        to="#"
                    >
                        <span>30 minutes ago</span>
                        <h6 className="mb-0">
                            john just buy your product{" "}
                            <strong className="text-warning">Sell $250</strong>
                        </h6>
                    </Link>
                </li>
                <li>
                    <div className="timeline-badge success"></div>
                    <Link
                        className="timeline-panel c-pointer text-muted"
                        to="#"
                    >
                        <span>15 minutes ago</span>
                        <h6 className="mb-0">
                            StumbleUpon is acquired by eBay.{" "}
                        </h6>
                    </Link>
                </li>
                <li>
                    <div className="timeline-badge warning"></div>
                    <Link
                        className="timeline-panel c-pointer text-muted"
                        to="#"
                    >
                        <span>20 minutes ago</span>
                        <h6 className="mb-0">
                            Mashable, a news website and blog, goes live.
                        </h6>
                    </Link>
                </li>
                <li>
                    <div className="timeline-badge dark"></div>
                    <Link
                        className="timeline-panel c-pointer text-muted"
                        to="#"
                    >
                        <span>20 minutes ago</span>
                        <h6 className="mb-0">
                            Mashable, a news website and blog, goes live.
                        </h6>
                    </Link>
                </li> */}
            </ul>
        </>
    )
}

export default NotificationTimeline