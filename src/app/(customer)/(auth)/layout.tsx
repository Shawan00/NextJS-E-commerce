import Logo from "@/components/customer/logo";
import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen flex flex-col xl:flex-row">
      <div className="hidden sm:flex flex-col justify-start items-center w-full xl:w-1/3 h-1/2 min-h-[500px] xl:h-screen bg-[var(--secondary-background)] p-12">
        <div className="mb-4 xl:mb-8 self-start">
          <Logo />
        </div>
        <p className="text-4xl font-bold mb-4 text-primary">Hello, Welcome</p>
        <p className="text-gray-600 mb-4 xl:mb-12 font-medium">
          Enjoy your time with us and find amazing deals!
        </p>

        <div className="relative h-4/6 xl:w-full aspect-3/2">
          <Image
            src={"/illustration.png"}
            alt="Illustration"
            fill
            sizes="(max-width: 1280px) 50vw, 33vw"
            className="object-contain"
          />
        </div>
      </div>

      <div className="flex-1 flex justify-center items-center mx-3 my-5">{children}</div>

    </div>
  );
}