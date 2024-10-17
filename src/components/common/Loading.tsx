import Logo from "@/assets/images/turinghut.png";
import Image from "next/image";

export default function Loading() {
  return (
    <div className="flex justify-center items-center h-screen animate-pulse">
      <Image width={192} height={192} src={Logo.src} alt="logo" />
    </div>
  );
}
