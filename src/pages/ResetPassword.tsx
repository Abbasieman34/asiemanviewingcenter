import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Eye, EyeOff } from "lucide-react";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

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

  if (!isRecovery) {
    return (
      <div className="min-h-screen bg-background">
        <Helmet>
          <title>Reset Password — Asieman Viewing Center</title>
          <meta name="description" content="Set a new password for your Asieman Viewing Center admin account." />
          <link rel="canonical" href="https://asiemanviewingcenter.lovable.app/reset-password" />
          <meta property="og:url" content="https://asiemanviewingcenter.lovable.app/reset-password" />
        </Helmet>
        <Header />
        <div className="flex items-center justify-center py-20 px-4">
          <div className="bg-card border border-border rounded-xl p-8 w-full max-w-sm space-y-4 text-center">
            <Lock className="h-8 w-8 text-muted-foreground mx-auto" />
            <p className="text-muted-foreground">Invalid or expired reset link.</p>
            <Button onClick={() => navigate("/login")} variant="outline" className="w-full">
              Back to Login
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Reset Password — Asieman Viewing Center</title>
        <meta name="description" content="Set a new password for your Asieman Viewing Center admin account." />
        <link rel="canonical" href="https://asiemanviewingcenter.lovable.app/reset-password" />
        <meta property="og:url" content="https://asiemanviewingcenter.lovable.app/reset-password" />
      </Helmet>
      <Header />
      <div className="flex items-center justify-center py-20 px-4">
        <div className="bg-card border border-border rounded-xl p-8 w-full max-w-sm space-y-6">
          <div className="flex items-center gap-2 justify-center text-primary">
            <Lock className="h-6 w-6" />
            <h1 className="text-2xl">RESET PASSWORD</h1>
          </div>

          <div className="space-y-3">
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type={showPassword ? "text" : "password"}
                aria-label="New password"
                placeholder="New password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 pr-10"
              />
              <button
                type="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type={showPassword ? "text" : "password"}
                aria-label="Confirm new password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleReset()}
                className="pl-10"
              />
            </div>
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
    </div>
  );
};

export default ResetPassword;
