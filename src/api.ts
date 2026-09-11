import axios from "axios";
import type {ContactMessage} from "./components/mail/MailManagerLayout.tsx";

type Payload = {
    email: string;
    password: string;
}

type loginResponse = {
    token: string;
}

type pageable = {
    pageNumber: number;
}

type unrepliedMessagesResponse = {
    unrepliedMessages: {
        content: ContactMessage[];
        totalPages: number;
        pageable:pageable
    }
}

type repliedMessagesResponse = {
    repliedMessages: {
        content: ContactMessage[];
        totalPages: number;
        pageable:pageable
    }
}

export const publicApi = axios.create({
    baseURL: import.meta.env.VITE_API_BASE,
    timeout: 5000,
});

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE,
    timeout: 5000,
});

export const login = (payload:Payload) =>
    publicApi.post<loginResponse>("/admin/auth/login", { email:payload.email, password:payload.password})
        .then((res) => {
            return res.data;
        })

export const getUnrepliedMessages = (pageNumber:number = 0) =>
    api.get<unrepliedMessagesResponse>(`/admin/messages/unreplied?page=${pageNumber}`)
    .then((res) => {
        return res.data.unrepliedMessages;
    })

export const getRepliedMessages = (pageNumber:number = 0) =>
    api.get<repliedMessagesResponse>(`/admin/messages/replied?page=${pageNumber}`)
    .then((res) => {
        return res.data.repliedMessages;
    })

export const postReplyMessage = (messageToBeReply:string | null,messageId:number|null) =>
    api.post(`/admin/reply/${messageId}`, {messageToBeReply:messageToBeReply})
    .then((res) => {
        return res.data;
    })

export const deleteMessage = (messageId:number|null) =>
    api.delete(`/admin/messages/${messageId}`)
    .then((res) => {
        return res.data;
    })

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("authToken");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});
