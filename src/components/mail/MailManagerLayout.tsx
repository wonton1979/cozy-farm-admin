import {useState} from "react";
import MessagePreviewBox from "./MessagePreviewBox.tsx";
import MessageDetailsFrame from "./MessageDetailsFrame.tsx";
import ReplyMessageFrame from "./ReplyMessageFrame.tsx";

const MESSAGE = "Hi Jerry and Jane,\n" +
    "\n" +
    "I just wanted to send you a message after spending some time exploring Cozy Farm. I originally found the farm by accident while looking through a few countryside projects online, but I ended up staying much longer than I expected.\n" +
    "\n" +
    "There is something really charming about the whole place. I especially love all the small details around the farm, like the old windmill, the little railway, the vegetable patch, and all the animals wandering around. It feels like every corner has its own personality and its own little story.\n" +
    "\n" +
    "The chickens made me laugh, and I think Winston might already be my favourite character. I also really enjoyed finding the quieter parts of the farm. The lake in particular feels like somewhere I could happily sit for an afternoon doing absolutely nothing.\n" +
    "\n" +
    "I noticed that some things seem to have their own stories when you interact with them, which made me start clicking around everywhere to see what else I could discover. It gives the farm a lovely feeling of being alive rather than just being a picture to look at.\n" +
    "\n" +
    "I also wanted to say that the hand-drawn style works beautifully. Everything feels warm and slightly imperfect in exactly the right way. It reminds me of illustrations from children's storybooks I used to read when I was younger.\n" +
    "\n" +
    "Please keep working on the farm and adding little surprises when you have time. I would love to come back one day and discover that something has changed, a new animal has arrived, or perhaps there is another story waiting somewhere that wasn't there before.\n" +
    "\n" +
    "Thank you for making such a peaceful little corner of the internet. It genuinely made my evening a little brighter.\n" +
    "\n" +
    "Warm wishes,\n" +
    "\n" +
    "Daniel"

export default function MailManagerLayout() {
    const [messageListTab, setMessageListTab] = useState("Unreplied");

    return (
        <div className="relative w-full h-screen overflow-hidden">
            <img src="/background-image.png" alt="Cozy Farm Post Office" className="w-full m-0 z-0 object-fill" />
            <img src="/message-tab.png" className="absolute left-[7%] top-[20%] w-[30%] h-[15%]" alt="message tab"/>
            <img src="/message-deatils-frame.png" className="absolute left-[39.7%] top-[22%] w-[56%] h-[50%]" alt="message tab"/>
            <img src="/reply-frame.png" className="absolute left-[39.7%] top-[68%] w-[55.55%] h-[31%]" alt="message tab"/>
            <button
                type="button"
                onClick={()=>setMessageListTab("unreplied")}
                aria-label="unreplied tab"
                className="absolute left-[7%] top-[25%] w-[14%] h-[5%] cursor-pointer"/>

            <button
                type="button"
                onClick={()=>setMessageListTab("replied")}
                aria-label="replied tab"
                className="absolute left-[23%] top-[25%] w-[14%] h-[5%] cursor-pointer"/>

            <MessagePreviewBox left={7.5} top={33} visitorName={"Muxi Zhou"} messageDate={"2026-09-05 22:29:53"} image={"unreplied-focused"}/>
            <MessageDetailsFrame left={47.5} top={33} messageDate={"2026-09-05 22:29:53"} visitorName={"Daniel"} message={MESSAGE}/>
            <ReplyMessageFrame left={47.5} top={70}/>
        </div>
    );
}