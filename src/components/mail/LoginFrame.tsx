import * as React from "react";

type ReplyMessageFrameProps = {
    left: number
    top: number
    email: string
    setEmail: (email: string) => void
    password: string
    setPassword: (password: string) => void
    handleLogin: () => void
    loginErrorMessage: string
}

export default function LoginFrame({left,top,email,setEmail,password,setPassword,handleLogin,loginErrorMessage}: ReplyMessageFrameProps) {

    const handleSubmit = (e: React.SubmitEvent) => {
        e.preventDefault();
        handleLogin();
    };

    return (
        <div className="relative w-full h-screen overflow-hidden">
            <img src="/login-frame.png" className="w-full m-0 z-0 object-fill" alt="Login frame"/>
            <div
                className="absolute select-none z-1 text-xl"
                style={{
                    left: `${left}%`,
                    top: `${top}%`,
                    width: "16%",
                    height: "8%",
                }}
            >
                <form id="login-form" onSubmit={handleSubmit} noValidate className="absolute inset-0 font-hand text-[#4a3428]">

                    <div className="my-7">
                        <input
                            className="w-full p-2 bg-transparent border-none outline-none font-bold
                                        font-hand text-[1rem]"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <input
                            className="w-full p-2 bg-transparent border-none outline-none
                                        font-hand text-[1rem] font-bold"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                </form>

            </div>
            <p
                className="absolute text-center text-[1cqw] opacity-70"
                style={{
                    left: "31%",
                    top: "42%",
                    width: "40%",
                }}
            >
                {loginErrorMessage}
            </p>
            <button
                type="submit"
                form="login-form"
                aria-label="Login"
                className="absolute left-[37.4%] top-[65%] w-[28%] h-[8%] z-10 cursor-pointer"
            />
        </div>
    )
}