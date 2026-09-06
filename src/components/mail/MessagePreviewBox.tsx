type MessagePreviewBoxProps = {
    left: number
    top: number
    visitorName: string
    messageDate: string
    image: string
}

export default function MessagePreviewBox({
                                              left,
                                              top,
                                              visitorName,
                                              messageDate,
                                              image
                                          }: MessagePreviewBoxProps) {
    return (
        <div
            className="absolute cursor-pointer select-none z-1"
            style={{
                left: `${left}%`,
                top: `${top}%`,
                width: "29%",
                height: "8%",
            }}
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