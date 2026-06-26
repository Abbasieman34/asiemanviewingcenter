import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Lock } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import PasswordInput from "@/components/PasswordInput";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const RESET_META = {
  title: "Reset Password — Asieman Viewing Center",
  description: "Set a new password for your Asieman Viewing Center admin account.",
  canonicalPath: "/reset-password",
};

const ResetPassword = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isRecovery, setIsRecovery] = useState(false);

  useEffect(() => {
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    if (hashParams.get("type") === "recovery") {
      setIsRecovery(true);
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setIsRecovery(true);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleReset = async () => {
    if (!password || !confirmPassword) {
      toast.error("Please fill in both fields");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      toast.success("Password updated successfully!");
      navigate("/login");
    } catch (error: any) {
      toast.error(error.message || "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  const toggleVisibility = () => setShowPassword(!showPassword);

  if (!isRecovery) {
    return (
      <PageLayout {...RESET_META}>
        <div className="flex items-center justify-center py-20 px-4">
          <div className="bg-card border border-border rounded-xl p-8 w-full max-w-sm space-y-4 text-center">
            <Lock className="h-8 w-8 text-muted-foreground mx-auto" />
            <p className="text-muted-foreground">Invalid or expired reset link.</p>
            <Button onClick={() => navigate("/login")} variant="outline" className="w-full">
              Back to Login
            </Button>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout {...RESET_META}>
      <div className="flex items-center justify-center py-20 px-4">
        <div className="bg-card border border-border rounded-xl p-8 w-full max-w-sm space-y-6">
          <div className="flex items-center gap-2 justify-center text-primary">
            <Lock className="h-6 w-6" />
            <h1 className="text-2xl">RESET PASSWORD</h1>
          </div>

          <div className="space-y-3">
            <PasswordInput
              value={password}
              onChange={setPassword}
              placeholder="New password"
              ariaLabel="New password"
              showPassword={showPassword}
              onToggleVisibility={toggleVisibility}
            />
            <PasswordInput
              value={confirmPassword}
              onChange={setConfirmPassword}
              placeholder="Confirm new password"
              ariaLabel="Confirm new password"
              showPassword={showPassword}
              onToggleVisibility={toggleVisibility}
              onKeyDown={(e) => e.key === "Enter" && handleReset()}
              showToggle={false}
            />
            <Button
              onClick={handleReset}
              disabled={loading}
              className="w-full gold-gradient text-primary-foreground font-semibold"
            >
              {loading ? "Updating..." : "Update Password"}
            </Button>
          </div>

          <p className="text-xs text-center text-muted-foreground">
            <button onClick={() => navigate("/login")} className="text-primary hover:underline">
              Back to Login
            </button>
          </p>
        </div>
      </div>
    </PageLayout>
  );
};

export default ResetPassword;
