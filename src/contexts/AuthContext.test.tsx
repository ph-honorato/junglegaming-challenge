// AuthContext Tests
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import "@testing-library/jest-dom";
import { AuthProvider, useAuth } from "./AuthContext";

function AuthStateProbe() {
  const { isLogged, login, logout } = useAuth();
  return (
    <div>
      <span data-testid="auth-state">{String(isLogged)}</span>
      <button onClick={login}>do-login</button>
      <button onClick={logout}>do-logout</button>
    </div>
  );
}

function renderProbe() {
  return render(
    <AuthProvider>
      <AuthStateProbe />
    </AuthProvider>,
  );
}

beforeEach(() => {
  localStorage.clear();
});

describe("AuthContext", () => {
  it("starts logged out and persists the initial state", () => {
    renderProbe();

    expect(screen.getByTestId("auth-state")).toHaveTextContent("false");
    expect(localStorage.getItem("isLogged")).toBe("false");
  });

  it("logs in and persists to localStorage", () => {
    renderProbe();

    fireEvent.click(screen.getByRole("button", { name: "do-login" }));

    expect(screen.getByTestId("auth-state")).toHaveTextContent("true");
    expect(localStorage.getItem("isLogged")).toBe("true");
  });

  it("logs out and persists to localStorage", () => {
    localStorage.setItem("isLogged", "true");
    renderProbe();

    fireEvent.click(screen.getByRole("button", { name: "do-logout" }));

    expect(screen.getByTestId("auth-state")).toHaveTextContent("false");
    expect(localStorage.getItem("isLogged")).toBe("false");
  });

  it("restores the persisted session across remounts", () => {
    localStorage.setItem("isLogged", "true");

    const { unmount } = renderProbe();
    unmount();
    renderProbe();

    expect(screen.getByTestId("auth-state")).toHaveTextContent("true");
  });

  it("throws when useAuth is used outside AuthProvider", () => {
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    expect(() => render(<AuthStateProbe />)).toThrow(
      "useAuth must be used within an AuthProvider",
    );

    consoleErrorSpy.mockRestore();
  });
});
