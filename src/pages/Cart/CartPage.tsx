import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import {
  ArrowLeft,
  ChevronRight,
  Lock,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  X,
} from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Button,
  Input,
  Skeleton,
} from "@components";
import { useToast } from "@/hooks/use-toast";
import {
  useApplyCoupon,
  useCart,
  useRemoveCartItem,
  useRemoveCoupon,
  useUpdateCartItemQuantity,
} from "@/hooks/useCart";
import type { CartItem } from "@/types/cart";
import { formatEth } from "@/lib/format";

// Aligned columns for the desktop table layout (shared by header and rows)
// First column flexes to fit image + name; the rest are content-sized
const DESKTOP_ROW_GRID =
  "lg:grid lg:grid-cols-[minmax(0,1fr)_110px_130px_110px_44px] lg:items-center lg:gap-4";

function QuantityStepper({ item }: { item: CartItem }) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { mutate: updateQuantity, isPending } = useUpdateCartItemQuantity();
  const atMax = item.quantity >= item.maxQuantity;

  const handleUpdate = (quantity: number) =>
    updateQuantity(
      { itemId: item.id, quantity },
      {
        onError: () =>
          toast({
            title: t("cart.quantityError"),
            variant: "destructive",
          }),
      },
    );

  return (
    <div className="flex items-center gap-3">
      <Button
        type="button"
        size="icon"
        className="h-7 w-7 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-40"
        aria-label={t("cart.decreaseQuantity")}
        disabled={isPending || item.quantity <= 1}
        onClick={() => handleUpdate(item.quantity - 1)}
      >
        <Minus className="h-3.5 w-3.5" aria-hidden="true" />
      </Button>
      <span
        className="min-w-6 text-center font-mono text-sm font-bold text-foreground"
        aria-label={t("cart.table.editions")}
      >
        {item.quantity}
      </span>
      {atMax ? (
        <span
          className="flex h-7 w-7 items-center justify-center text-secondary"
          aria-label={t("cart.quantityLocked")}
        >
          <Lock className="h-4 w-4" aria-hidden="true" />
        </span>
      ) : (
        <Button
          type="button"
          size="icon"
          className="h-7 w-7 rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
          aria-label={t("cart.increaseQuantity")}
          disabled={isPending}
          onClick={() => handleUpdate(item.quantity + 1)}
        >
          <Plus className="h-3.5 w-3.5" aria-hidden="true" />
        </Button>
      )}
    </div>
  );
}

function CartItemRow({ item }: { item: CartItem }) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { mutate: removeItem, isPending } = useRemoveCartItem();

  const handleRemove = () =>
    removeItem(item.id, {
      onError: () =>
        toast({
          title: t("cart.removeError"),
          variant: "destructive",
        }),
    });

  return (
    <li
      className={`rounded-xl bg-surface p-4 lg:px-6 lg:py-4 ${
        isPending ? "opacity-60" : ""
      }`}
    >
      {/* Desktop: columns aligned with the table header above */}
      <div className={`flex items-center gap-4 ${DESKTOP_ROW_GRID}`}>
        {/* NFT (thumb + name + token id / edition) — one cell on desktop */}
        <div className="flex min-w-0 flex-1 items-center gap-4">
          <img
            src={item.image}
            alt={item.name}
            className="h-20 w-20 shrink-0 rounded-lg object-cover lg:h-16 lg:w-16"
            loading="lazy"
          />
          <div className="min-w-0">
            <p className="truncate font-bold text-foreground">{item.name}</p>
            {/* Desktop shows the token id, mobile shows the edition */}
            <p className="hidden text-sm text-secondary lg:block">
              {`${t("cart.tokenId")}: ${item.tokenId ?? ""}`}
            </p>
            <p className="text-sm text-secondary lg:hidden">
              {item.edition && item.maxEdition
                ? `${t("cart.edition")}: 1/${item.maxEdition}`
                : `${t("cart.tokenId")}: ${item.tokenId ?? ""}`}
            </p>
            {/* Mobile: unit price under the name */}
            <p className="mt-1 font-mono font-bold text-primary lg:hidden">
              {formatEth(item.unitPrice)}
            </p>
          </div>
        </div>

        {/* Desktop: unit price column */}
        <p className="hidden font-mono text-base text-foreground lg:block">
          {formatEth(item.unitPrice)}
        </p>

        {/* Editions column / mobile stepper */}
        <div className="ml-auto lg:ml-0">
          <QuantityStepper item={item} />
        </div>

        {/* Desktop: line total column */}
        <p className="hidden font-mono text-base font-bold text-primary lg:block">
          {formatEth(item.lineTotal)}
        </p>

        {/* Desktop: remove column */}
        <div className="hidden lg:block">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-lg text-secondary hover:bg-accent hover:text-foreground"
            aria-label={`${t("cart.remove")}: ${item.name}`}
            onClick={handleRemove}
          >
            <Trash2 className="h-5 w-5" aria-hidden="true" />
          </Button>
        </div>
      </div>

      {/* Mobile: remove button under the stepper */}
      <div className="mt-3 flex justify-end lg:hidden">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 gap-1.5 rounded-lg px-2 text-xs text-secondary hover:bg-accent hover:text-foreground"
          aria-label={`${t("cart.remove")}: ${item.name}`}
          onClick={handleRemove}
        >
          <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
          {t("cart.remove")}
        </Button>
      </div>
    </li>
  );
}

function CartSummaryCard() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data } = useCart();
  const applyCouponMutation = useApplyCoupon();
  const removeCouponMutation = useRemoveCoupon();
  const [couponCode, setCouponCode] = useState("");
  const [couponError, setCouponError] = useState<string | null>(null);

  if (!data) return null;
  const { summary } = data;

  const handleApplyCoupon = (event: React.FormEvent) => {
    event.preventDefault();
    const code = couponCode.trim();
    if (!code) return;
    setCouponError(null);
    applyCouponMutation.mutate(code, {
      onSuccess: () => setCouponCode(""),
      onError: () => setCouponError(t("cart.couponInvalid")),
    });
  };

  return (
    <section
      aria-label={t("cart.summary.title")}
      className="rounded-xl bg-surface p-6 lg:bg-transparent lg:p-0"
    >
      <h2 className="font-mono text-xl font-bold tracking-wide text-foreground">
        {t("cart.summary.title")}
      </h2>

      {/* Coupon */}
      <div className="mt-6">
        <label
          htmlFor="coupon-code"
          className="font-mono text-sm font-semibold text-foreground"
        >
          {t("cart.summary.couponLabel")}
        </label>
        <form onSubmit={handleApplyCoupon} className="mt-2 flex gap-2">
          <Input
            id="coupon-code"
            value={couponCode}
            onChange={(event) => setCouponCode(event.target.value)}
            placeholder={t("cart.summary.couponPlaceholder")}
            className="h-11 flex-1 rounded-lg border-border bg-background font-mono text-sm"
            aria-invalid={couponError ? true : undefined}
            aria-describedby={couponError ? "coupon-error" : undefined}
            autoComplete="off"
          />
          <Button
            type="submit"
            className="h-11 rounded-lg bg-primary px-5 font-bold text-primary-foreground hover:bg-primary/90"
            disabled={applyCouponMutation.isPending}
          >
            {t("cart.summary.apply")}
          </Button>
        </form>
        {couponError ? (
          <p
            id="coupon-error"
            role="alert"
            className="mt-2 text-sm text-destructive"
          >
            {couponError}
          </p>
        ) : null}
        {summary.coupon ? (
          <div className="mt-2 flex items-center justify-between rounded-lg border border-border bg-background px-3 py-2">
            <p className="text-sm text-secondary">
              <span className="font-mono font-bold text-foreground">
                {summary.coupon.code}
              </span>
              {` · ${t("cart.summary.discount")} (-) ${summary.coupon.discount}`}
            </p>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-6 w-6 rounded-full text-secondary hover:bg-accent hover:text-foreground"
              aria-label={`${t("cart.summary.removeCoupon")}: ${summary.coupon.code}`}
              onClick={() => removeCouponMutation.mutate()}
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
        ) : null}
      </div>

      {/* Values */}
      <dl className="mt-6 space-y-3 font-mono text-sm">
        <div className="flex items-baseline justify-between gap-4">
          <dt className="text-foreground">{t("cart.summary.subtotal")}</dt>
          <dd className="font-bold text-foreground">
            {formatEth(summary.subtotal)}
          </dd>
        </div>
        <div className="flex items-baseline justify-between gap-4">
          <dt className="text-foreground">{t("cart.summary.discount")}</dt>
          <dd className="font-bold text-foreground">
            {`(-) ${summary.discount}`}
          </dd>
        </div>
        <div className="flex items-baseline justify-between gap-4">
          <dt className="text-foreground">{t("cart.summary.networkFee")}</dt>
          <dd className="text-right">
            <span className="font-bold text-foreground">
              {formatEth(summary.networkFee)}
            </span>
            <span className="block text-xs text-primary">
              {t("cart.summary.feeHint")}
            </span>
          </dd>
        </div>
      </dl>

      <div className="mt-6 flex items-baseline justify-between gap-4 border-t border-border pt-4">
        <p className="font-mono text-lg font-bold text-foreground">
          {t("cart.summary.total")}
        </p>
        <p
          className="font-mono text-2xl font-bold text-primary"
          aria-label={t("cart.summary.total")}
        >
          {formatEth(summary.total)}
        </p>
      </div>

      <Button
        className="mt-6 h-12 w-full rounded-lg bg-primary font-bold text-primary-foreground hover:bg-primary/90"
        onClick={() => navigate({ to: "/checkout" })}
        disabled={data.items.length === 0}
      >
        {t("cart.summary.checkout")}
      </Button>

      <button
        type="button"
        className="mt-4 w-full text-center font-mono text-sm text-secondary transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
        onClick={() => navigate({ to: "/" })}
      >
        {t("cart.summary.continue")}
      </button>
    </section>
  );
}

function CartSkeleton() {
  return (
    <div aria-hidden="true" className="space-y-4">
      {[0, 1, 2].map((index) => (
        <div key={index} className="rounded-xl bg-surface p-4 lg:px-6">
          <div className="flex items-center gap-4">
            <Skeleton className="skeleton-shimmer h-20 w-20 rounded-lg" />
            <div className="flex-1 space-y-2">
              <Skeleton className="skeleton-shimmer h-4 w-40" />
              <Skeleton className="skeleton-shimmer h-3 w-28" />
            </div>
            <Skeleton className="skeleton-shimmer h-7 w-24 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

function CartPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data, isPending, isError, refetch } = useCart();

  const items = data?.items ?? [];
  const hasItems = items.length > 0;

  return (
    <div className="mx-auto w-full max-w-[1200px] px-4 pb-16 sm:px-6 lg:px-8">
      {/* Mobile top bar */}
      <div className="flex items-center gap-3 py-4 lg:hidden">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-9 w-9 rounded-full border border-border"
          aria-label={t("cart.back")}
          onClick={() => navigate({ to: "/" })}
        >
          <ArrowLeft className="h-5 w-5" aria-hidden="true" />
        </Button>
        <h1 className="text-lg font-bold text-foreground">{t("cart.title")}</h1>
      </div>

      {/* Desktop breadcrumb */}
      <Breadcrumb className="hidden py-6 lg:flex">
        <BreadcrumbList className="font-mono text-sm">
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <button type="button" onClick={() => navigate({ to: "/" })}>
                {t("cart.breadcrumb.home")}
              </button>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <button type="button" onClick={() => navigate({ to: "/" })}>
                {t("cart.breadcrumb.marketplace")}
              </button>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbPage className="font-mono">
              {t("cart.breadcrumb.cart")}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-10">
        {/* Items */}
        <section aria-busy={isPending} aria-label={t("cart.title")}>
          {isPending ? (
            <CartSkeleton />
          ) : isError ? (
            <div className="rounded-xl bg-surface p-10 text-center">
              <p className="font-bold text-foreground">
                {t("cart.error.title")}
              </p>
              <p className="mt-2 text-sm text-secondary">
                {t("cart.error.description")}
              </p>
              <Button
                className="mt-6 bg-primary font-bold text-primary-foreground hover:bg-primary/90"
                onClick={() => refetch()}
              >
                {t("cart.error.retry")}
              </Button>
            </div>
          ) : !hasItems ? (
            <div className="rounded-xl bg-surface p-10 text-center">
              <ShoppingBag
                className="mx-auto h-10 w-10 text-secondary"
                aria-hidden="true"
              />
              <p className="mt-4 font-bold text-foreground">
                {t("cart.empty.title")}
              </p>
              <p className="mt-2 text-sm text-secondary">
                {t("cart.empty.description")}
              </p>
              <Button
                className="mt-6 bg-primary font-bold text-primary-foreground hover:bg-primary/90"
                onClick={() => navigate({ to: "/" })}
              >
                {t("cart.empty.cta")}
              </Button>
            </div>
          ) : (
            <>
              {/* Desktop table header */}
              <div
                className={`hidden border-b border-border pb-3 font-mono text-sm font-semibold text-secondary ${DESKTOP_ROW_GRID}`}
              >
                <span>{t("cart.table.nfts")}</span>
                <span>{t("cart.table.price")}</span>
                <span>{t("cart.table.editions")}</span>
                <span>{t("cart.table.total")}</span>
                <span className="sr-only">{t("cart.remove")}</span>
              </div>

              <ul className="mt-4 space-y-3 lg:mt-6 lg:space-y-2">
                {items.map((item) => (
                  <CartItemRow key={item.id} item={item} />
                ))}
              </ul>
            </>
          )}
        </section>

        {/* Summary (right column on desktop, panel after items on mobile) */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          {isPending || isError ? (
            <div className="rounded-xl bg-surface p-6" aria-hidden="true">
              <Skeleton className="skeleton-shimmer h-6 w-56" />
              <Skeleton className="skeleton-shimmer mt-6 h-11 w-full rounded-lg" />
              <div className="mt-6 space-y-3">
                <Skeleton className="skeleton-shimmer h-4 w-full" />
                <Skeleton className="skeleton-shimmer h-4 w-full" />
                <Skeleton className="skeleton-shimmer h-4 w-3/4" />
              </div>
              <Skeleton className="skeleton-shimmer mt-6 h-12 w-full rounded-lg" />
            </div>
          ) : (
            <CartSummaryCard />
          )}
        </aside>
      </div>
    </div>
  );
}

export default CartPage;
