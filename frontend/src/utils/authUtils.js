import { jwtDecode } from 'jwt-decode';

export const getEmailFromToken = () => {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
        const decoded = jwtDecode(token);
        return decoded.email || null;
    } catch (error) {
        console.error('Failed to decode token:', error);
        return null;
    }
};
