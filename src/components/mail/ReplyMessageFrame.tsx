import * as React from "react";

type ReplyMessageFrameProps = {
    left: number
    top: number
}

export default function ReplyMessageFrame({left,top}: ReplyMessageFrameProps) {
    const handleSubmit = (e: React.SubmitEvent) => {

        e.preventDefault();

    };
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
            <form onSubmit={handleSubmit} className="absolute inset-0 font-hand text-[#4a3428]">

                <div className="mt-[4cqw] w-full">
                    <textarea
                        name="message"
                        className="mt-[0.75cqw] h-[8cqw] w-full resize-none bg-transparent border-none outline-none
                                        font-hand text-[1rem] leading-normal"
                    />
                </div>
            </form>
        </div>
    )
}
