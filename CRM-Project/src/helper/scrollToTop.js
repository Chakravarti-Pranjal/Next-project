export const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth", // Smooth scroll
  });
};

export const scrollToBottom = () => {
  window.scrollTo({
    top: document.documentElement.scrollHeight, // Scroll to the bottom of the page
    behavior: "smooth", // Smooth scroll
  });
};
