export const sanitizeInput = (text: string) => {
  return text.trim().replace(/[^\w\s-]/gi, '');
};