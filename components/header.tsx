import Image from "next/image";
import Link from "next/link";
import AppLogo from "@/components/logo";
import HeaderAuth from "@/components/header-auth";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import { EnvVarWarning } from "@/components/env-var-warning";

const Header = () => {
  return (
    <nav className="bg-background text-foreground fixed top-0 left-0 w-full flex justify-center border-b border-b-foreground/10 h-16">
      <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
        <div className="flex gap-5 items-center font-semibold text-l">
          <AppLogo />
          <Link href={"/"}>Regulation 365</Link>
          <div className="flex items-center gap-2"></div>
        </div>
        {!hasEnvVars ? <EnvVarWarning /> : <HeaderAuth />}
      </div>
    </nav>
  );
};

export default Header;
