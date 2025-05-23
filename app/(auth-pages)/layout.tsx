import periscopeLogo from "@/public/logos/image.png";
import chatBackground from "@/public/chat/background.png";
import Image from "next/image";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full grid grid-cols-2">
      {/* Left side - Auth form */}
      <div className="flex flex-col justify-center p-8 gap-8">
        <div className="w-full max-w-md mx-auto">
          <div className="mb-8">
            <Image src={periscopeLogo} alt="Periscope Logo" width={70} height={70} />
            <h1 className="text-2xl font-semibold mt-2 text-green-700">Periscope</h1>
          </div>
          {children}
        </div>
      </div>

      {/* Right side - Feature showcase */}
      <div 
        className="relative p-8 flex flex-col items-center justify-center"
        style={{
          backgroundImage: `url(${chatBackground.src})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="relative z-10 max-w-lg px-4">
          <h2 className="text-5xl font-bold text-black-900 mb-8 leading-tight">
            Manage WhatsApp Groups{" "}
            <span className="text-green-400">and Chats at scale</span>
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            Connect multiple numbers, create tasks & tickets, integrate with your systems, and automate your workflows on WhatsApp
          </p>
        </div>
      </div>
    </div>
  );
}
