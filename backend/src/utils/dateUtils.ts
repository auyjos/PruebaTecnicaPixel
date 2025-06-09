export const isValidDate = (dateString: string): boolean => {
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date.getTime());
};

export const formatDate = (date: Date): string => {
    return date.toISOString();
};

export const parseDate = (dateString: string): Date => {
    return new Date(dateString);
};

export const isDateInFuture = (dateString: string): boolean => {
    const date = new Date(dateString);
    const now = new Date();
    return date > now;
};
