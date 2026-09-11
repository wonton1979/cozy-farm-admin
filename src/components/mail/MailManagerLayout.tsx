import {useEffect, useState} from "react";
import MessagePreviewBox from "./MessagePreviewBox.tsx";
import MessageDetailsFrame from "./MessageDetailsFrame.tsx";
import ReplyMessageFrame from "./ReplyMessageFrame.tsx";
import formatMessageDate from "../../utils/formatMessageDate.ts";
import LoginFrame from "./LoginFrame.tsx";
import {Auth} from "../../auth.ts";
import {deleteMessage, getRepliedMessages, getUnrepliedMessages, login, postReplyMessage} from "../../api.ts";
import PaginationBar from "./PaginationBar.tsx";

export type ContactMessageStatus = "NEW" | "REPLIED"

type MessageDetails = {
    messageId: number | null
    visitorName: string | null
    messageDate: string | null
    message: string | null
    replyMessage: string | null
    isReplied: boolean
}

export type ContactMessage = {
    id: number
    visitorName: string
    visitorEmail: string
    visitorMessage: string
    replyMessage: string | null
    status: ContactMessageStatus
    createdAt: string
    repliedAt: string | null
}

export default function MailManagerLayout() {
    const [messageListTab, setMessageListTab] = useState("unreplied");
    const [focusedMessageIndex, setFocusedMessageIndex] = useState(0);
    const [messageDetails, setMessageDetails] = useState<MessageDetails>(
        {
            messageId: null,
            visitorName: null,
            messageDate: null,
            message: null,
            replyMessage: null,
            isReplied: false,
        }
    );
    const [replyMessage, setReplyMessage] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loginErrorMessage, setLoginErrorMessage] = useState<string>("");
    const [newMessages, setNewMessages] = useState<ContactMessage[]>([]);
    const [repliedMessages, setRepliedMessages] = useState<ContactMessage[]>([]);
    const [totalPagesUnreplied, setTotalPagesUnreplied] = useState<number>(0);
    const [totalPagesReplied, setTotalPagesReplied] = useState<number>(0);
    const [currentPageNumberReplied, setCurrentPageNumberReplied] = useState<number>(0)
    const [currentPageNumberUnreplied, setCurrentPageNumberUnreplied] = useState<number>(0)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false)
    const [isDeleting, setIsDeleting] = useState<boolean>(false)

    const isValidMessage = (message:string|null) => {
        if(message === null) return false;
        const trimmed = message.trim();
        return trimmed.length >= 30 && trimmed.length <= 2000;
    }


    function handleClickPreviewMessageBox(messageId:number,messageIndex:number) {
        setErrorMessage("")
        setFocusedMessageIndex(messageIndex)
        if (messageListTab === "unreplied" && newMessages && newMessages.length > 0) {
            setMessageDetails({
                messageId: messageId,
                visitorName: newMessages[messageIndex].visitorName,
                messageDate: newMessages[messageIndex].createdAt,
                message: newMessages[messageIndex].visitorMessage,
                replyMessage: "",
                isReplied: false
            })
            setReplyMessage("")
            setIsSubmitting(false)
            return
        }
        if (messageListTab === "replied" && repliedMessages && repliedMessages.length > 0) {

            setMessageDetails(
                {
                    messageId: messageId,
                    visitorName: repliedMessages[messageIndex].visitorName,
                    messageDate: repliedMessages[messageIndex].createdAt,
                    message: repliedMessages[messageIndex].visitorMessage,
                    replyMessage: repliedMessages[messageIndex].replyMessage,
                    isReplied: true
                }
            )
            setReplyMessage(repliedMessages[messageIndex].replyMessage)
        }
    }

    function handleMessageListTabChange(tabName:string){
        setMessageListTab(tabName)
        setErrorMessage("")
        setFocusedMessageIndex(0)
        if (tabName === "unreplied" && newMessages && newMessages.length > 0) {
            if(newMessages.length > 0){
                setMessageDetails(
                    {
                        messageId: newMessages[0].id,
                        visitorName: newMessages[0].visitorName,
                        messageDate: newMessages[0].createdAt,
                        message: newMessages[0].visitorMessage,
                        replyMessage: null,
                        isReplied: false
                    }
                )
            }
            else {
                setMessageDetails(
                    {
                        messageId: null,
                        visitorName: null,
                        messageDate: null,
                        message: null,
                        replyMessage: null,
                        isReplied: false
                    }
                )
            }
            setIsSubmitting(false)
            setReplyMessage("")
            return
        }
        if( tabName === "replied" && repliedMessages && repliedMessages.length > 0) {
            setMessageDetails(
                {
                    messageId: repliedMessages[0].id,
                    visitorName: repliedMessages[0].visitorName,
                    messageDate: repliedMessages[0].createdAt,
                    message: repliedMessages[0].visitorMessage,
                    replyMessage: repliedMessages[0].replyMessage,
                    isReplied: true
                }
            )
            setIsSubmitting(true)
            setReplyMessage(repliedMessages[0].replyMessage)
            return
        }
    }

    function handleReplyMessageSubmit(messageId: number | null){
        if(!messageId){
            return;
        }

        if(!isValidMessage(replyMessage)){
            setErrorMessage("Don't forget to write a reply!")
            setIsSubmitting(false)
            return;
        }

        postReplyMessage(replyMessage,messageId).then(() => {
            setErrorMessage("")
            setMessageListTab("replied")
            loadMessages(0)
            return;
        })
    }

    function handleDeleteMessage(messageId:number |null){
        if(!messageId){
            return;
        }

        deleteMessage(messageId).then(() => {
            setIsDeleting(false)
            loadMessages(0)
        }).catch(
            (response) => {
                if (!response.ok) {
                    setErrorMessage("Something went wrong. can't load the unreplied messages");
                    return;
                }
            }
        )
    }

    function loadMessages(currentPageNumber:number){

        if(messageListTab === "unreplied"){
            getUnrepliedMessages(currentPageNumber-1).then((res) => {
                if(res.totalPages){
                    setTotalPagesUnreplied(res.totalPages);
                }
                if(res.pageable){
                    setCurrentPageNumberUnreplied(res.pageable.pageNumber+1);
                }

                if(res.content.length > 0){
                    setNewMessages(res.content);
                    setMessageDetails(
                        {
                            messageId: res.content[0].id,
                            visitorName: res.content[0].visitorName,
                            messageDate: res.content[0].createdAt,
                            message: res.content[0].visitorMessage,
                            replyMessage: null,
                            isReplied: false
                        }
                    )
                    setFocusedMessageIndex(0)
                }
            }).catch(
                (response) => {
                    if (!response.ok) {
                        setErrorMessage("Something went wrong. can't load the unreplied messages");
                        return;
                    }
                }
            );
        }
        if(messageListTab === "replied") {
            getRepliedMessages(currentPageNumber-1).then((res) => {
                if (res.totalPages) {
                    setTotalPagesReplied(res.totalPages);
                }
                if (res.pageable) {
                    setCurrentPageNumberReplied(res.pageable.pageNumber + 1);
                }
                if (res.content.length > 0) {
                    setRepliedMessages(res.content);
                    setMessageDetails(
                        {
                            messageId: res.content[0].id,
                            visitorName: res.content[0].visitorName,
                            messageDate: res.content[0].createdAt,
                            message: res.content[0].visitorMessage,
                            replyMessage: res.content[0].replyMessage,
                            isReplied: true
                        }
                    )
                    setFocusedMessageIndex(0)
                }
            }).catch(
                (response) => {
                    if (!response.ok) {
                        setErrorMessage("Something went wrong. can't load the replied message");
                        return;
                    }
                }
            );
        }
    }

    function handleLogin(){
        Auth.clear()
        login({
            email:email,
            password:password
        }).then((res) => {
            if(res.token){
                Auth.save(res.token)
                setIsLoggedIn(true)
                setLoginErrorMessage("")
            }
        }).catch(
            (response) => {

                if (response.status === 400 || response.status === 401) {
                    setLoginErrorMessage("Invalid email or password");
                    return;
                }

                if (!response.ok) {
                    setLoginErrorMessage("Something went wrong. Please try again.");
                    return;
                }
            }
        );

    }

    useEffect(() => {
        if(!isLoggedIn){
            return
        }

        getUnrepliedMessages(currentPageNumberUnreplied).then((res) => {
            if(res.totalPages){
                setTotalPagesUnreplied(res.totalPages);
            }
            if(res.pageable){
                setCurrentPageNumberUnreplied(res.pageable.pageNumber+1);
            }

            if(res.content.length > 0){
                setNewMessages(res.content);
                setMessageDetails(
                    {
                        messageId: res.content[0].id,
                        visitorName: res.content[0].visitorName,
                        messageDate: res.content[0].createdAt,
                        message: res.content[0].visitorMessage,
                        replyMessage: null,
                        isReplied: false
                    }
                )
            }
        }).catch(
            (response) => {
                if (!response.ok) {
                    setErrorMessage("Something went wrong. can't load the unreplied messages");
                    return;
                }
            }
        );

        getRepliedMessages(currentPageNumberReplied).then((res) => {
            if(res.totalPages){
                setTotalPagesReplied(res.totalPages);
            }
            if(res.pageable){
                setCurrentPageNumberReplied(res.pageable.pageNumber+1);
            }
            if (res.content.length > 0) {
                setRepliedMessages(res.content);
                setMessageDetails(
                    {
                        messageId: res.content[0].id,
                        visitorName: res.content[0].visitorName,
                        messageDate: res.content[0].createdAt,
                        message: res.content[0].visitorMessage,
                        replyMessage: res.content[0].replyMessage,
                        isReplied: true
                    }
                )
            }
        }).catch(
            (response) => {
                if (!response.ok) {
                    setErrorMessage("Something went wrong. can't load the replied message");
                    return;
                }
            }
        );

    }, [isLoggedIn]);


    if (!isLoggedIn) {
        return (
            <LoginFrame left={49} top={43} email={email} setEmail={setEmail}
                        password={password} setPassword={setPassword} handleLogin={handleLogin}
                        loginErrorMessage={loginErrorMessage}/>
        )
    }

    return (
        <div className="relative w-full h-screen overflow-hidden">
            <img src="/background-image.png" alt="Cozy Farm Post Office" className="w-full m-0 z-0 object-fill" />
            <img src="/message-tab.png" className="absolute left-[7%] top-[20%] w-[30%] h-[15%]" alt="message tab"/>
            <img src="/message-deatils-frame.png" className="absolute left-[39.7%] top-[22%] w-[56%] h-[50%]" alt="message details"/>
            <img src="/reply-frame.png" className="absolute left-[41.7%] top-[71%] w-[51.55%] h-[26%]" alt="reply frame"/>
            {
                messageListTab=="unreplied" ? <img src="/send-letter-button.png"
                                                   className="absolute left-[80%] top-[89.7%] w-[10%] h-[5%]"
                                                   alt="reply button"/> :
                    <img src="/delete-letter-button.png"
                         className="absolute left-[79.8%] top-[89%] w-[11.2%] h-[6.5%]"
                         alt="delete letter button"/>
            }

            <div className="absolute left-[18.8%] top-[25.5%] w-[56%] h-[50%] font-hand">
                {newMessages && newMessages.length}
            </div>

            <div className="absolute left-[32.8%] top-[26%] w-[56%] h-[50%] font-hand">
                {repliedMessages && repliedMessages.length}
            </div>
            <button

                type="button"
                onClick={()=>handleMessageListTabChange("unreplied")}
                aria-label="unreplied tab"
                className="absolute left-[7%] top-[25%] w-[14%] h-[5%] cursor-pointer"/>

            <button
                type="button"
                onClick={()=>handleMessageListTabChange("replied")}
                aria-label="replied tab"
                className="absolute left-[23%] top-[25%] w-[14%] h-[5%] cursor-pointer"/>

            {
                newMessages && newMessages.length > 0 &&  messageListTab === "unreplied"
                && newMessages.map((newMessage,index)=>{
                    const previewBoxImage = focusedMessageIndex === index ?
                        "unreplied-focused" : "unfocused";
                    return (
                        <MessagePreviewBox
                            key={newMessage.id}
                            left={7.5}
                            top={33 + index * 9}
                            messageId={newMessage.id}
                            visitorName={newMessage.visitorName}
                            messageDate={formatMessageDate(newMessage.createdAt)}
                            image={previewBoxImage}
                            messageIndex={index}
                            handlerClick={handleClickPreviewMessageBox}
                        />
                    )
                })
            }

            {
               repliedMessages && repliedMessages.length > 0 &&  messageListTab === "replied"
                && repliedMessages.map((newMessage,index)=>{
                    const previewBoxImage = focusedMessageIndex === index ?
                        "replied-focused" : "unfocused";
                    return (
                        <MessagePreviewBox
                            key={newMessage.id}
                            left={7.5}
                            top={33 + index * 9}
                            messageId={newMessage.id}
                            messageIndex={index}
                            visitorName={newMessage.visitorName}
                            messageDate={formatMessageDate(newMessage.createdAt)}
                            image={previewBoxImage}
                            handlerClick={handleClickPreviewMessageBox}
                        />
                    )
                })
            }
            <PaginationBar  left={17.3} top={81}
                            totalPages={ messageListTab === "unreplied" ? totalPagesUnreplied : totalPagesReplied}
                            currentPageNumber={messageListTab === "unreplied" ? currentPageNumberUnreplied : currentPageNumberReplied}
                            setCurrentPageNumber={messageListTab === "unreplied" ?
                                 setCurrentPageNumberUnreplied
                                :setCurrentPageNumberReplied}
                            loadMessages={loadMessages}
            />
            <MessageDetailsFrame left={47.5} top={33} messageDetails={messageDetails}/>
            <ReplyMessageFrame left={47.5} top={70} messageId={messageDetails.messageId} isReplied={messageDetails.isReplied}
                               replyMessage={replyMessage}
                               setReplyMessage={setReplyMessage}
                               isSubmitting={isSubmitting}
                               setIsSubmitting={setIsSubmitting}
                               handleReplyMessageSubmit={handleReplyMessageSubmit}
                               errorMessage={errorMessage}
                               setIsDeleteModalOpen={setIsDeleteModalOpen}
                               isDeleting={isDeleting}
                               setIsDeleting={setIsDeleting}
            />

            {isDeleteModalOpen && <div
                className={`absolute inset-0 z-40 flex items-center justify-center bg-black/20 backdrop-blur-sm`}
            >
                <img src="/delete-confirmation-modal.png" className="absolute left-[30%] top-[30%] w-[40%] h-[40%]" alt="message tab"/>
                <button type="button"  onClick={()=>{
                    setIsDeleteModalOpen(false)
                    setIsDeleting(false)
                }}
                        className={`absolute cursor-pointer`}
                        style={{
                            left: "37%",
                            top: "58%",
                            width: "10%",
                            height: "5%",
                        }}
                />
                <button type="button"  onClick={()=>{
                    handleDeleteMessage(messageDetails.messageId)
                    setIsDeleteModalOpen(false)
                }}
                        className={`absolute cursor-pointer`}
                        style={{
                            left: "51%",
                            top: "58%",
                            width: "10%",
                            height: "5%",
                        }}
                />
            </div>}
        </div>
    );
}
