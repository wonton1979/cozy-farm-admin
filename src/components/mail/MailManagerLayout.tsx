import {useEffect, useState} from "react";
import MessagePreviewBox from "./MessagePreviewBox.tsx";
import MessageDetailsFrame from "./MessageDetailsFrame.tsx";
import ReplyMessageFrame from "./ReplyMessageFrame.tsx";
import formatMessageDate from "../../utils/formatMessageDate.ts";

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


export const mockMessages: ContactMessage[] = [
    {
        id: 1,
        visitorName: "Emma Chen",
        visitorEmail: "emma.chen@example.com",
        visitorMessage:
            "Hi Jerry and Jane! I found Cozy Farm this evening and just wanted to say how lovely it is. I especially enjoyed meeting all the animals and discovering the little stories around the farm. Winston definitely made me laugh!",
        replyMessage: null,
        status: "NEW",
        createdAt: "2026-09-06T09:42:00Z",
        repliedAt: null,
    },
    {
        id: 2,
        visitorName: "Thomas Williams",
        visitorEmail: "thomas.williams@example.com",
        visitorMessage:
            "Hello! I really like the little railway running through the farm. Is there a story behind why Jerry and Jane have their own steam train? The whole scene reminds me of places I visited when I was younger.",
        replyMessage: null,
        status: "NEW",
        createdAt: "2026-09-06T08:15:00Z",
        repliedAt: null,
    },
    {
        id: 3,
        visitorName: "Sophie Anderson",
        visitorEmail: "sophie.anderson@example.com",
        visitorMessage:
            "Just a quick message to say that the artwork is beautiful. The lake, old windmill and farmhouse make the whole place feel incredibly peaceful. I hope you keep adding more little things to discover.",
        replyMessage: null,
        status: "NEW",
        createdAt: "2026-09-05T19:27:00Z",
        repliedAt: null,
    },
    {
        id: 4,
        visitorName: "Mohammed Rahman",
        visitorEmail: "mohammed.rahman@example.com",
        visitorMessage:
            "Hi! My daughter and I explored Cozy Farm together and she absolutely loved the chickens. We spent far too long clicking around trying to find every animal conversation. Thank you for making something so cheerful.",
        replyMessage: null,
        status: "NEW",
        createdAt: "2026-09-05T14:08:00Z",
        repliedAt: null,
    },
    {
        id: 5,
        visitorName: "Charlotte Worthington-Smythe",
        visitorEmail: "charlotte.ws@example.com",
        visitorMessage:
            "Hello Jerry and Jane. I stumbled across your farm completely by accident and ended up exploring it for much longer than I intended. There is something wonderfully relaxing about all the tiny details and quiet humour.",
        replyMessage: null,
        status: "NEW",
        createdAt: "2026-09-04T21:53:00Z",
        repliedAt: null,
    },
    {
        id: 6,
        visitorName: "Daniel Cooper",
        visitorEmail: "daniel.cooper@example.com",
        visitorMessage:
            "I loved the old tractor joke. It reminded me immediately of my grandfather insisting that his ancient tractor had absolutely nothing wrong with it.",
        replyMessage:
            "Thank you, Daniel! That is exactly the sort of old tractor we had in mind. Jerry would definitely agree with your grandfather that a tractor is perfectly fine as long as it eventually starts!",
        status: "REPLIED",
        createdAt: "2026-09-03T16:34:00Z",
        repliedAt: "2026-09-03T18:12:00Z",
    },
    {
        id: 7,
        visitorName: "Olivia Martin",
        visitorEmail: "olivia.martin@example.com",
        visitorMessage:
            "The little robin watching for worms might be my favourite detail on the whole farm. Such a tiny interaction, but it made the place feel alive.",
        replyMessage:
            "Thank you, Olivia! Robin takes his worm-watching responsibilities extremely seriously. We're glad you found him!",
        status: "REPLIED",
        createdAt: "2026-09-02T11:20:00Z",
        repliedAt: "2026-09-02T13:05:00Z",
    },
    {
        id: 8,
        visitorName: "James Patel",
        visitorEmail: "james.patel@example.com",
        visitorMessage:
            "Hi Jerry and Jane! Will you be adding more places to explore around Cozy Farm in the future? I really enjoyed finding the interactive landmarks.",
        replyMessage:
            "Hi James! We certainly have more ideas for the farm. We don't want to rush it though—we'd rather add small things that feel like they genuinely belong here. Thanks for visiting!",
        status: "REPLIED",
        createdAt: "2026-08-31T20:44:00Z",
        repliedAt: "2026-09-01T09:18:00Z",
    },
    {
        id: 9,
        visitorName: "Emily Thompson",
        visitorEmail: "emily.thompson@example.com",
        visitorMessage:
            "I showed Cozy Farm to my mum and she loved the countryside atmosphere. The whole thing has such a warm storybook feeling.",
        replyMessage:
            "That's lovely to hear, Emily. Please tell your mum we said hello, and thank you both for spending some time at the farm!",
        status: "REPLIED",
        createdAt: "2026-08-29T15:12:00Z",
        repliedAt: "2026-08-29T17:46:00Z",
    },
    {
        id: 10,
        visitorName: "Alexander Montgomery",
        visitorEmail: "alex.montgomery@example.com",
        visitorMessage:
            "The farm lake is such a nice little corner. I liked the idea that nothing moves too quickly there. Sometimes websites don't need to constantly demand your attention.",
        replyMessage:
            "Thank you, Alexander. That quiet feeling is exactly what we wanted the lake—and really the whole farm—to have. We're very happy that came across.",
        status: "REPLIED",
        createdAt: "2026-08-27T10:05:00Z",
        repliedAt: "2026-08-27T12:31:00Z",
    },
]

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
    const [messageData, setMessageData] = useState<ContactMessage[]>(mockMessages);

    const newMessages = messageData.filter(message => message.status === "NEW");
    const repliedMessages = messageData.filter(message => message.status === "REPLIED");

    const isValidMessage = (message:string|null) => {
        if(message === null) return false;
        const trimmed = message.trim();
        return trimmed.length >= 30 && trimmed.length <= 2000;
    }


    function handleClickPreviewMessageBox(messageId:number,messageIndex:number) {
        setErrorMessage("")
        setFocusedMessageIndex(messageIndex)
        if (messageListTab === "unreplied") {
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

    function handleMessageListTabChange(tabName:string){
        setMessageListTab(tabName)
        setErrorMessage("")
        setFocusedMessageIndex(0)
        if (tabName === "unreplied") {
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
        if( tabName === "replied"&&repliedMessages.length > 0) {
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
        if(!isValidMessage(replyMessage)){
            setErrorMessage("Don't forget to write a reply!")
            setIsSubmitting(false)
            return;
        }
        setMessageData(
            messageData.map((message) => {
                if (message.id === messageId) {
                    return {
                        ...message,
                        replyMessage: replyMessage,
                        status: "REPLIED",
                        repliedAt: new Date().toISOString(),
                    };
                }
                return message;
            })
        );
        setErrorMessage("")
        setMessageListTab("replied")
        return;
    }

    useEffect(() => {
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
    }, []);

    useEffect(() => {
        if(isSubmitting){
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
        }
    }, [messageData]);

    return (
        <div className="relative w-full h-screen overflow-hidden">
            <img src="/background-image.png" alt="Cozy Farm Post Office" className="w-full m-0 z-0 object-fill" />
            <img src="/message-tab.png" className="absolute left-[7%] top-[20%] w-[30%] h-[15%]" alt="message tab"/>
            <img src="/message-deatils-frame.png" className="absolute left-[39.7%] top-[22%] w-[56%] h-[50%]" alt="message details"/>
            <img src="/reply-frame.png" className="absolute left-[41.7%] top-[71%] w-[51.55%] h-[26%]" alt="reply frame"/>
            {
                messageListTab=="unreplied" && <img src="/send-letter-button.png" className="absolute left-[80%] top-[89.7%] w-[10%] h-[5%]" alt="reply button"/>
            }

            <div className="absolute left-[19%] top-[26%] w-[56%] h-[50%] font-hand">
                {newMessages.length}
            </div>

            <div className="absolute left-[32.8%] top-[26%] w-[56%] h-[50%] font-hand">
                {repliedMessages.length}
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
                newMessages.length > 0 &&  messageListTab === "unreplied"
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
                repliedMessages.length > 0 &&  messageListTab === "replied"
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

            <MessageDetailsFrame left={47.5} top={33} messageDetails={messageDetails}/>
            <ReplyMessageFrame left={47.5} top={70} messageId={messageDetails.messageId} isReplied={messageDetails.isReplied}
                               replyMessage={replyMessage}
                               setReplyMessage={setReplyMessage}
                               isSubmitting={isSubmitting}
                               setIsSubmitting={setIsSubmitting}
                               handleReplyMessageSubmit={handleReplyMessageSubmit}
                               errorMessage={errorMessage}
            />
        </div>
    );
}