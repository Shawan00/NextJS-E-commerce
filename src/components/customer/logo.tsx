import Image from "next/image";
import Link from "next/link";

export default function Logo() {
  return (
    <>
      <Link href={"/"}
        className="flex gap-2 items-center"
      >
        <div className="relative w-18 aspect-44/21">
          <Image
            src={"/logo.png"}
            alt="Logo"
            fill
            sizes="72px"
            className="object-contain"
            priority
          />
        </div>
        <span className="text-3xl font-semibold">FurStore</span>
      </Link>
    </>
  );
}