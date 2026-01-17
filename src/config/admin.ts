// List of authorized admin emails
// In a real app, this would be in a database or environment variable
export const ADMIN_EMAILS = [
    'temitoperichardbanji@gmail.com',
    'admin@trbalchmey.com', // Placeholder
    'test@example.com' // Dev testing
];

export const isAdmin = (email: string | null | undefined): boolean => {
    if (!email) return false;
    return ADMIN_EMAILS.includes(email);
};
