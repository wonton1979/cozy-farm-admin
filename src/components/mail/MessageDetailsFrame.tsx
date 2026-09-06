type MessageDetailsFrameProps = {
    left: number
    top: number
    visitorName: string
    messageDate: string
    message: string
}

export default function MessageDetailsFrame({left,top,visitorName,messageDate,message}: MessageDetailsFrameProps) {
    return (
        <div
            className="absolute select-none z-1 text-xl"
            style={{
                left: `${left}%`,
                top: `${top}%`,
                width: "43%",
                height: "8%",
            }}
        >

            <div className="absolute left-[12%] transform translate-y-[-135%] font-hand">
                {visitorName}
            </div>

            <div className="absolute  top-[10%] font-hand text-[1rem]">
                {messageDate}
            </div>

            <div className="mt-[4cqw] w-full">
                <textarea
                    value={message}
                    name="message"
                    readOnly={true}
                    className="mt-[0.75cqw] h-[17cqw] w-full resize-none bg-transparent border-none outline-none
                                    font-hand text-[1rem] leading-normal"
                />
            </div>
        </div>
    )
}




