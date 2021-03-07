import { Base64 } from 'js-base64';

export const toBase64 = (val?: string | null) => (val ? Base64.btoa(val) : '');
