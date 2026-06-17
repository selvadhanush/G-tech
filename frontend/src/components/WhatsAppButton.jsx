import React from 'react';
import { motion } from 'framer-motion';

const WhatsAppButton = () => {
  const phoneNumber = '919363706040';
  const message = 'Hello G-TECH Innovation,\nI am interested in your services.';
  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

  return (
    <motion.a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-[#25D366] text-white rounded-full shadow-lg hover:bg-[#128C7E] transition-colors focus:outline-none focus:ring-4 focus:ring-green-300"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.15, rotate: 10 }}
      whileTap={{ scale: 0.9 }}
      title="Chat on WhatsApp"
    >
      <svg
        className="w-8 h-8 fill-current"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.73-1.458L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.863-9.73.001-2.595-1.013-5.035-2.856-6.88C16.638 2.15 14.194 1.139 12 1.139c-5.45 0-9.877 4.372-9.88 9.734-.001 1.738.484 3.43 1.402 4.908l-.985 3.597 3.708-.962zm11.23-5.6c-.276-.136-1.636-.798-1.888-.888-.254-.09-.439-.136-.622.136-.182.272-.707.888-.868 1.07-.159.18-.32.2-.596.064-.276-.136-1.168-.426-2.226-1.358-.822-.725-1.378-1.62-1.54-1.892-.162-.272-.017-.419.12-.556.124-.123.276-.317.414-.476.136-.159.182-.272.274-.453.092-.18.046-.339-.022-.476-.069-.136-.622-1.474-.852-2.028-.225-.536-.454-.462-.622-.47l-.53-.008c-.182 0-.477.068-.727.339-.25.272-.954.918-.954 2.24s.972 2.602 1.108 2.783c.136.18 1.913 2.879 4.636 4.028.648.273 1.155.437 1.55.56.65.203 1.242.174 1.71.105.522-.078 1.636-.659 1.868-1.295.232-.636.232-1.182.162-1.295-.069-.115-.254-.206-.53-.339z" />
      </svg>
    </motion.a>
  );
};

export default WhatsAppButton;
