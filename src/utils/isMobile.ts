export const isMobile = () => {
  return /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
};