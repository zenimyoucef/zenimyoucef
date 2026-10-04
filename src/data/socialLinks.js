export const socialLinks = [
  { label: "GitHub", url: "https://github.com/zenimyoucef" },
  { label: "LinkedIn", url: "https://www.linkedin.com/in/zenim-youcef" },
  { label: "WhatsApp", url: "https://wa.me/213540753528" },
];
export const contactUrl = socialLinks.find(
  (link) => link.label === "WhatsApp",
).url;
export const navigationLinks = [
  { label: "Work", href: "#work" },
  { label: "Playground", href: "#playground" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];
