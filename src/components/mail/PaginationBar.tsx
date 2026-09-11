import type {Dispatch,SetStateAction} from "react";

type PaginationBarProps = {
    left: number
    top: number
    totalPages: number
    currentPageNumber: number
    setCurrentPageNumber: Dispatch<SetStateAction<number>>
    loadMessages: (pageNumber: number) => void
}

export default function PaginationBar({left,top,totalPages,currentPageNumber,setCurrentPageNumber,loadMessages}: PaginationBarProps) {

    return (
        <div
            className="absolute select-none z-10 text-xl"
            style={{
                left: `${left}%`,
                top: `${top}%`,
                width: "22%",
                height: "10%",
            }}
        >
            <img src="/pagination-bar.png" className="w-full h-full object-fill" alt="pagination bar"/>
            <p
                className="absolute text-center text-[2cqw] z-10"
                style={{
                    left: "37%",
                    top: "28%",
                    width: "40%",
                }}
            >
                {totalPages}
            </p>
            <p
                className="absolute text-center text-[2cqw] z-10"
                style={{
                    left: "22%",
                    top: "28%",
                    width: "40%",
                }}
            >
                {currentPageNumber}
            </p>
            <button
                type="button"
                aria-label="previous page button"
                disabled={currentPageNumber === 1}
                onClick={() => {
                    setCurrentPageNumber(currentPageNumber-1)
                    loadMessages(currentPageNumber-1)
                }}
                className="absolute left-[20.4%] top-[33%] w-[15%] h-[16%] z-10 cursor-pointer"
            />
            <button
                type="button"
                disabled={currentPageNumber === totalPages}
                aria-label="next page button"
                onClick={() => {
                    setCurrentPageNumber(currentPageNumber+1)
                    loadMessages(currentPageNumber+1)
                }}
                className="absolute left-[61.4%] top-[33%] w-[15%] h-[16%] z-10 cursor-pointer"
            />
        </div>
    )
}