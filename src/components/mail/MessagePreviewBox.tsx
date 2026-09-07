
type MessagePreviewBoxProps = {
    left: number
    top: number
    messageId:number,
    messageIndex:number,
    visitorName: string
    messageDate: string
    image: string
    handlerClick: (messageId: number, messageIndex: number) => void
}

export default function MessagePreviewBox({left,top,visitorName, messageId,
                                              messageIndex,messageDate,image,
                                              handlerClick}: MessagePreviewBoxProps) {

    return (
        <div
            className="absolute cursor-pointer select-none z-1"
            style={{
                left: `${left}%`,
                top: `${top}%`,
                width: "29%",
                height: "8%",
            }}
            onClick={()=>(
                handlerClick(messageId,messageIndex)
            )}
        >
            <img
                src={`${image}-message-box.png`}
                alt=""
            />

            <div className="absolute left-[20%] top-[23%] font-hand">
                {visitorName}
            </div>

            <div className="absolute right-[5%] top-[23%] font-hand">
                {messageDate}
            </div>
        </div>
    )
}