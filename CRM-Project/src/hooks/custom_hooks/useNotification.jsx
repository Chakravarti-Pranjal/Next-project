import React, { useEffect, useState } from 'react';
import { useSubdomain } from '../../context/SubdomainContext';
import axios from 'axios';
import echo from '../../echo';

const NotificationComponent = () => {
  const { faviconIcon, title } = useSubdomain();
  const authItem = JSON.parse(localStorage.getItem('token') || '{}');
  const bearerToken = authItem.token;
  const userId = authItem.UserID;
  const [notifications, setNotifications] = useState([]);

  // Request notification permission
  const requestNotificationPermission = () => {
    if ('Notification' in window) {
      Notification.requestPermission().then(permission => {
        if (permission === "granted") {
          //console.log("Notification permission granted.");
        } else {
          //console.log("Notification permission denied.");
        }
      });
    }
  };
 
  useEffect(() => {
    // Call the permission request on initial load
    requestNotificationPermission();

    // Subscribe to the user-specific channel
    const channel = echo.channel(`user.${userId}`);

    // Listen for the notification event
    channel.listen('.notification.received', (event) => {
      //console.log("Received notification:", event);
      
      // Add notification to state
      setNotifications((prevNotifications) => [event, ...prevNotifications]);

      // Show browser notification if permission is granted
      if (Notification.permission === "granted") {
        new Notification(`🔔 ${title} Notification`, {
          body: event.data.body,
          icon: faviconIcon,  // Optionally add an icon
        });
      }
    });

    // Cleanup on unmount
    return () => {
      channel.stopListening('.notification.received');
      echo.leave(`user.${userId}`);
    };
  }, [userId]);

};


export default NotificationComponent;
