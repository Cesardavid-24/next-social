import Image from "next/image";

const MessagesPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-white text-gray-500">
      <Image src="/messages.png" alt="Messages" width={64} height={64} className="opacity-50 mb-4" />
      <h3 className="text-xl font-semibold mb-2 text-gray-700">Tus Mensajes</h3>
      <p className="text-sm">Selecciona una conversación o envía un mensaje nuevo desde un perfil.</p>
    </div>
  );
};

export default MessagesPage;
