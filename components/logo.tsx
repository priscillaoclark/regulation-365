import Image from "next/image";

export default async function AppLogo() {
  return (
    <div>
      <Image
        className="hidden dark:block"
        src="/logo/white-logo.svg"
        alt="dark-mode-logo"
        width={75}
        height={75}
      />
      <Image
        className="block dark:hidden"
        src="/logo/black-logo.svg"
        alt="light-mode-logo"
        width={75}
        height={75}
      />
    </div>
  );
}
