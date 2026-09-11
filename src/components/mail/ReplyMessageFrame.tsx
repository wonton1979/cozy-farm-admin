import * as React from "react";

type ReplyMessageFrameProps = {
    left: number
    top: number
    messageId: number| null
    isReplied: boolean
    replyMessage: string | null
    setReplyMessage: React.Dispatch<React.SetStateAction<string | null>>
    isSubmitting: boolean
    setIsSubmitting: React.Dispatch<React.SetStateAction<boolean>>
    handleReplyMessageSubmit: (messageId: number | null) => void
    errorMessage: string | null
    isDeleting: boolean
    setIsDeleteModalOpen: React.Dispatch<React.SetStateAction<boolean>>
    setIsDeleting: React.Dispatch<React.SetStateAction<boolean>>
}

export default function ReplyMessageFrame({left,top,isReplied,replyMessage,setReplyMessage,messageId,
                                              isSubmitting,setIsSubmitting,isDeleting,setIsDeleteModalOpen,setIsDeleting,
                                              handleReplyMessageSubmit,errorMessage}: ReplyMessageFrameProps) {

    const handleSubmit = (e: React.SubmitEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        handleReplyMessageSubmit(messageId);
    };

    return (
        <div
            className="absolute select-none z-1 text-xl"
            style={{
                left: `${left}%`,
                top: `${top}%`,
                width: "40%",
                height: "8%",
            }}
        >
            <form onSubmit={handleSubmit} className="absolute inset-0 font-hand text-[#4a3428]">

                <div className="mt-[4cqw] w-full">
                    <textarea
                        name="message"
                        value={replyMessage ?? ""}
                        onChange={(e) => setReplyMessage(e.target.value)}
                        disabled={isReplied}
                        className="mt-[0.75cqw] h-[8cqw] w-full resize-none bg-transparent border-none outline-none
                                        font-hand text-[1rem] leading-normal"
                    />
                </div>
                <button type="submit" disabled={isSubmitting} className={`absolute ${isSubmitting ? "" : "cursor-pointer"}`}
                    style={{
                        left: "78%",
                        top: "270%",
                        width: "23%",
                        height: "25%",
                    }}
                >
                </button>
            </form>
            <p
                className="absolute text-center text-[1cqw] opacity-70"
                style={{
                    left: "30%",
                    top: "276%",
                    width: "40%",
                }}
            >
                {errorMessage}
            </p>
            <button type="button" disabled={isDeleting} onClick={()=>{
                setIsDeleteModalOpen(true)
                setIsDeleting(true)
            }}
                    className={`absolute ${isDeleting ? "" : "cursor-pointer"}`}
                    style={{
                        left: "73%",
                        top: "260%",
                        width: "35%",
                        height: "12%",
                    }}
            >
            </button>
        </div>
    )
}
