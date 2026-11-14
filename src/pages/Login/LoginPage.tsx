import { useNavigate, useSearch } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { LogIn, LogOut } from "lucide-react";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import { useAuth } from "@/contexts/AuthContext";
import { useAddCartItem, useLogout } from "@/hooks/useCart";
import { useToast } from "@/hooks/use-toast";
import { consumePendingPurchase } from "@/lib/pendingPurchase";

function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { redirect } = useSearch({ from: "/login" });
  const { isLogged, login } = useAuth();
  const { toast } = useToast();
  const { mutateAsync: addItem, isPending: isAdding } = useAddCartItem();
  const logoutWithCartClear = useLogout();

  const handleSimulateLogin = async () => {
    login();

    // A buy started while logged out completes right after the login
    const pendingPurchase = consumePendingPurchase();
    if (pendingPurchase) {
      try {
        await addItem(pendingPurchase);
        navigate({ to: "/cart" });
        return;
      } catch {
        toast({
          title: t("nftDetail.buyError"),
          variant: "destructive",
        });
      }
    }

    navigate({ to: redirect ?? "/" });
  };

  const handleLogout = () => {
    void logoutWithCartClear();
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] bg-background flex items-center justify-center px-4 py-16">
      <Card className="w-full max-w-md rounded-2xl">
        <CardHeader className="items-center text-center">
          <CardTitle>
            {isLogged ? t("login.loggedTitle") : t("login.title")}
          </CardTitle>
          <CardDescription>
            {isLogged ? t("login.loggedDescription") : t("login.subtitle")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLogged ? (
            <Button
              variant="outline"
              className="w-full gap-2"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5" />
              {t("navigation.logout")}
            </Button>
          ) : (
            <Button
              className="w-full gap-2"
              onClick={handleSimulateLogin}
              disabled={isAdding}
              aria-label={t("login.simulate")}
            >
              <LogIn className="h-5 w-5" />
              {t("login.simulate")}
            </Button>
          )}
        </CardContent>
        <CardFooter className="justify-center">
          <p className="text-xs text-muted-foreground">{t("login.hint")}</p>
        </CardFooter>
      </Card>
    </div>
  );
}

export default LoginPage;
