/* eslint-disable no-unused-vars */
// import { useNavigate } from "react-router-dom"
import { useParams, useLocation } from "react-router-dom"
import { useEffect, useState } from "react";
import { arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "./hooks/useAuth";
import style from "./FlatDetails.module.css"
import api from "./api";


function FlatDetails() {

    const {flatID} = useParams();
    const location = useLocation();
    const {user, fetchUser} = useAuth();
    const flat = location.state?.row;

    console.log(flat.messages);

    const [senderData, setSenderData] = useState({});

    const [messagesToShow, setMessagesToShow] = useState([]);

    const targetPath =  `/homepage/flats/${flatID}`;
    const otherTargetPath = `/homepage/my-flats/${flatID}`;

    const [isTargetPath, setIsTargetPath] = useState(false);
 
    

    

    // useEffect(() => {
    //   if(isTargetPath){
    //     const fetchMessages = async () => {
    //       try {
    //       const messagesArray = await Promise.all(
    //         messages.map(async (flatID) => {
    //           try{
    //               const response = await api.get(`/flats/${flatID}`, {
    //                   headers: {
    //                       Authorization: `bearer ${user.data.activeToken}`
    //                   }
    //               });
  
    //               console.log(response);
      
    //               return response.data.data[0];
    //           }catch(error){
    //               console.error(`Flat with ID ${flatID} cannot be found`);
    //               console.error(error);
  
    //               return null;
    //           }
    //           })
    //       );
    //       // console.log(flatDataArray);
    //       const validFlats = messagesArray.filter(flat => flat !== null);
    //       setRows(validFlats);
    //       } catch (error) {
    //       console.error("Eroare la fetch flats:", error);
    //       }
    //     };
  
    //     if (favouriteFlats.length > 0) {
    //       fetchMessages();
    //     }
    //   }
    // }, [favouriteFlats]);

    
    
    const [messageContent, setMessageContent] = useState("");

    const handleSendMessage = async () => {
        if (!messageContent.trim()) return; 


        console.log(senderData);

        const message = {
          contents: messageContent,
          createdAt: new Date().toISOString(),
          flatId: flatID,
          userId: user.data._id
        };

        try {
            
            const response = await api.post("/addMessage", {
              ...message
            }, {
              headers: {
                Authorization: `bearer ${user.data.activeToken}`
              }
            })

            fetchUser();
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    useEffect(() => {
      if(user){
        if(location.pathname === targetPath){

          setIsTargetPath(true);

          
        }
        else if(location.pathname === otherTargetPath){

          setMessagesToShow(flat.messages);
        }
        
      }
    }, [user, flat, location.pathname, otherTargetPath, targetPath]);

    const [userMessages, setUserMessages] = useState([]);

    useEffect(() => {
  
      if(user.data?._id){
        const filtered = flat.messages.filter(
          (message) => message.userId == user.data._id
        );
  
        console.log(filtered);
        setUserMessages(filtered)

      }
    }, [user]);

    console.log(messagesToShow)


  return (
    <div className={style.flatDetailsDiv}>
      <link rel="preconnect" href="https://fonts.googleapis.com"/>
      <link rel="preconnect" href="https://fonts.gstatic.com"/>
      <link href="https://fonts.googleapis.com/css2?family=Comfortaa:wght@300..700&display=swap" rel="stylesheet"/>
      <div className={style.detailsDiv}>
        <div className={style.detailsHeader}>City</div>
        <div className={style.detailsInfo}>{flat.city}</div>
      </div>

      <div className={style.detailsDiv}>
        <div className={style.detailsHeader}>Street name</div>
        <div className={style.detailsInfo}>{flat.streetName}</div>
      </div>

      <div className={style.detailsDiv}>
        <div className={style.detailsHeader}>Street number</div>
        <div className={style.detailsInfo}>{flat.streetNumber}</div>
      </div>

      <div className={style.detailsDiv}>
        <div className={style.detailsHeader}>Area size</div>
        <div className={style.detailsInfo}>{flat.areaSize}</div>
      </div>

      <div className={style.detailsDiv}>
        <div className={style.detailsHeader}>Has AC</div>
        <div className={style.detailsInfo}>{flat.hasAC ? <div>Yes</div> : <div>No</div>}</div>
      </div>

      <div className={style.detailsDiv}>
        <div className={style.detailsHeader}>Year build</div>
        <div className={style.detailsInfo}>{flat.yearBuilt}</div>
      </div>

      <div className={style.detailsDiv}>
        <div className={style.detailsHeader}>Rent price</div>
        <div className={style.detailsInfo}>{flat.price}</div>
      </div>

      <div className={style.detailsDiv}>
        <div className={style.detailsHeader}>Date available</div>
        <div className={style.detailsInfo}>{new Date(flat.dateAvailable).toLocaleDateString("ro-RO")}</div>
      </div>
    {/* all flats messages => shows only the messages i sent */}
      {
        location.pathname === targetPath && 
        <div className={style.messagesDiv}>
          <div className={style.messagesHeader}>My messages</div>
          <div className={style.allMessages}>
          {userMessages.length > 0 ?  ( 
              userMessages.map((message, index) => (
              <div key={index} className={style.message}>
                <p className={style.messageContent}>{message.contents}</p>
                <p className={style.messageTime}>{new Date(message.createdAt).toLocaleString()}</p>
              </div>
            ))
            ) : (<p>No messages sent.</p>)}
          </div>
        </div>
      }
    {/* my flats messages => shows all the messages i received for that flat */}

      {location.pathname === otherTargetPath && 
        <div className={style.messagesDiv}>
          <div className={style.messagesHeader}>My messages</div>
          <div className={style.allMessages}>
            {messagesToShow.length > 0 ? (
                messagesToShow.map((message, index) => (
                <div key={index} className={style.message}>
                  <p className={style.messageContent}>{message.contents}</p>
                  <p className={style.messageTime}>{new Date(message.createdAt).toLocaleString()}</p>
                  <p className={style.messageSender}>by {message.userId}</p>
                </div>
              ))
            ) : (<p>No messages sent.</p>)}
          </div>
        </div>}
      {location.pathname === targetPath && 
        <div className={style.sendMessageDiv}>
          <textarea className={style.sendMessageBox} placeholder="Send the owner a message about this apartment" value={messageContent} onChange={(e) => setMessageContent(e.target.value)}></textarea>
          <button className={style.sendMessageButton} type="submit" onClick={handleSendMessage}>Send</button>
        </div>}
    </div>
  )
}

export default FlatDetails