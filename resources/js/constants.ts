import { sample, times } from "lodash";
import { BrickWall, Handshake, HeartHandshakeIcon } from "lucide-react";

export const baseUrl = import.meta.env.VITE_APP_URL;
export const apiUrl = `${baseUrl}api/`;
export const appVersion = `0.0.1`;
export const imageUrl = `https://loremflickr.com/`;
export const isLocal = process.env.NODE_ENV !== 'production';
export const imgThumb = import.meta.env.VITE_APP_THUMBNAIL;
export const imgLarge = import.meta.env.VITE_APP_LARGE;
export const fileUrl = import.meta.env.VITE_APP_FILE_LINK;
export const xApiKey = import.meta.env.VITE_X_API_KEY;
export const loginURL = import.meta.env.VITE_LOGIN_URL;
export const registerURL = import.meta.env.VITE_REGISTER_URL;
export const crispID = import.meta.env.VITE_CRISP_WEBSITE_ID;
export const toEn = (s: any) =>
    s.replace(/[\u0660-\u0669\u06f0-\u06f9]/g, (a: any) => a.charCodeAt(0) & 15);
export const whatsappUrl = (phone: string | number, message?: string) => `https://api.whatsapp.com/send?phone=${phone}&${message ? `text=${message}` : ``}`;

export const getImage = (name?: string) => {
    return `/images/${name}`;
};

export const getThumb = (name?: string) => {
    return `/${imgThumb}${name}`;
};

export const getLarge = (name?: string) => {
    return `/${imgLarge}${name}`;
};

export const getFile = (name?: string) => {
    return `${fileUrl}${name}`;
};

export const getIcon = (name?: string) => {
    return `/icons/ui/${name}`;
};

export function classNames(...classes: any) {
    return classes.filter(Boolean).join(" ");
}


export function generateRandomString(length = 12) {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    return times(length, () => sample(chars)).join('');
}
