import ComplianceLanding from "@/components/hero";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";

export default async function Index() {
  return (
    <div className="full-width-section">
      <ComplianceLanding />
    </div>
  );
}
