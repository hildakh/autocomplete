export const sanitizeInput = (text: string) => {
  // TODO: add length limit?
  return text.trim().replace(/[^\w\s-]/gi, '');
}