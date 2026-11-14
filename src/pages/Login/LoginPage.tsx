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

function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { redirect } = useSearch({ from: "/login" });
  const { isLogged, login, logout } = useAuth();

  const handleSimulateLogin = () => {
    login();
    navigate({ to: redirect ?? "/" });
  };

  const handleLogout = () => {
    logout();
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
