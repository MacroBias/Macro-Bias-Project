"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { toast } from "sonner";
import { clearSession, getSessionEmail, isSessionValid } from "@/lib/auth";
import { parseNumberInput } from "@/components/admin/admin-utils";

export type AccessRequest = {
  email: string;
  created_at: string | null;
};

export type MetricsForm = {
  macroBiasScore: string;
  sp500Ytd: string;
  macroBiasYtd: string;
  tenYearCagr: string;
  fiveYearCagr: string;
  twoYearCagr: string;
  maxDrawdownMacroBias: string;
  maxDrawdownSp500: string;
  atAGlance: string;
};

export type DashboardMetricsForm = {
  dailyMacroScore: string;
  monthlyMacroScore: string;
  regimeExplanation: string;
  navigationGuideText: string;
};

export type NavigationGuide = {
  id: string;
  title: string;
  description: string;
  body?: string;
  fileName?: string | null;
  filePath?: string | null;
  mimeType?: string | null;
  fileSizeBytes?: number | null;
  downloadUrl?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type NavigationGuideForm = {
  title: string;
  description: string;
  file: File | null;
};

export type Position = {
  id: string;
  exposureType: string;
  instrument: string;
  entryPrice: number;
  stopLoss: number;
  positionSize: number;
  unrealizedPnL: number;
  isActive: boolean;
  isInRunProgression: boolean;
  runProgressionOrder: number | null;
};

export type PositionForm = {
  exposureType: string;
  instrument: string;
  entryPrice: string;
  stopLoss: string;
  positionSize: string;
  unrealizedPnL: string;
  isActive: boolean;
  isInRunProgression: boolean;
  runProgressionOrder: string;
};

export type Product = {
  id: string;
  exposureType: "Long" | "Short";
  name: string;
  isin: string;
  leverage: string;
  liquidity: string;
  factsheetLink: string;
};

export type ProductForm = {
  exposureType: "Long" | "Short";
  name: string;
  isin: string;
  leverage: string;
  liquidity: string;
  factsheetLink: string;
};

export type PerformanceYearly = {
  id: string;
  year: number;
  macroBias: number;
  sp500: number;
  alpha: number;
};

export type PerformanceYearlyForm = {
  year: string;
  macroBias: string;
  sp500: string;
  alpha: string;
};

export type FrameworkSection = {
  id: string;
  slug: string;
  title: string;
  body: string;
  sortOrder: number;
  createdAt?: string;
  updatedAt?: string;
};

export type FrameworkSectionForm = {
  slug: string;
  title: string;
  body: string;
  sortOrder: string;
};

export type LegalSection = {
  id: string;
  slug: string;
  title: string;
  body: string;
  sortOrder: number;
  createdAt?: string;
  updatedAt?: string;
};

export type LegalSectionForm = {
  slug: string;
  title: string;
  body: string;
  sortOrder: string;
};

export type AdminRecord = {
  id: string;
  email: string;
  created_at: string | null;
};

const defaultMetrics: MetricsForm = {
  macroBiasScore: "0.73",
  sp500Ytd: "15.3",
  macroBiasYtd: "27.8",
  tenYearCagr: "18.4",
  fiveYearCagr: "22.1",
  twoYearCagr: "31.2",
  maxDrawdownMacroBias: "-18.7",
  maxDrawdownSp500: "-33.9",
  atAGlance:
    "Current macro conditions favor equity exposure. Liquidity conditions are supportive, volatility is contained, and economic indicators suggest continued growth momentum. Consider maintaining or increasing leveraged long positions according to your risk parameters.",
};

const defaultDashboardMetrics: DashboardMetricsForm = {
  dailyMacroScore: "0.68",
  monthlyMacroScore: "0.71",
  regimeExplanation:
    "Current macro conditions favor equity exposure. Liquidity conditions are supportive, volatility is contained, and economic indicators suggest continued growth momentum. Consider maintaining or increasing leveraged long positions according to your risk parameters.",
  navigationGuideText:
    "Use this section to explain how users should read the dashboard, navigate categories, and apply the data to positioning decisions.",
};

const emptyPosition: PositionForm = {
  exposureType: "",
  instrument: "",
  entryPrice: "",
  stopLoss: "",
  positionSize: "",
  unrealizedPnL: "",
  isActive: false,
  isInRunProgression: false,
  runProgressionOrder: "",
};

const emptyProduct: ProductForm = {
  exposureType: "Long",
  name: "",
  isin: "",
  leverage: "",
  liquidity: "",
  factsheetLink: "",
};

const emptyPerformanceYearly: PerformanceYearlyForm = {
  year: "",
  macroBias: "",
  sp500: "",
  alpha: "",
};

const emptyFrameworkSection: FrameworkSectionForm = {
  slug: "",
  title: "",
  body: "",
  sortOrder: "",
};

const emptyLegalSection: LegalSectionForm = {
  slug: "",
  title: "",
  body: "",
  sortOrder: "",
};

const emptyNavigationGuide: NavigationGuideForm = {
  title: "",
  description: "",
  file: null,
};

export function useAdminSession() {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const sessionEmail = getSessionEmail();
    if (!isSessionValid() || !sessionEmail) {
      clearSession();
      router.push("/");
      return;
    }
    setEmail(sessionEmail);
  }, [router]);

  return email;
}

export function useAccessRequests(email: string | null) {
  const router = useRouter();
  const [requests, setRequests] = useState<AccessRequest[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const refreshedAt = useMemo(() => format(new Date(), "MMM dd, yyyy • HH:mm"), []);

  useEffect(() => {
    if (!email) return;
    const loadRequests = async () => {
      setIsLoading(true);
      const response = await fetch("/api/admin/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        setError(payload?.message || "Unable to load admin data.");
        setIsLoading(false);
        if (response.status === 403) {
          clearSession();
          router.push("/");
        }
        return;
      }

      const payload = await response.json();
      setRequests(payload?.requests ?? []);
      setError(null);
      setIsLoading(false);
    };

    loadRequests();
  }, [email, router]);

  return { requests, error, isLoading, refreshedAt };
}

export function useAdmins(email: string | null) {
  const [admins, setAdmins] = useState<AdminRecord[]>([]);
  const [adminsError, setAdminsError] = useState<string | null>(null);
  const [isLoadingAdmins, setIsLoadingAdmins] = useState(false);
  const [isSavingAdmin, setIsSavingAdmin] = useState(false);

  const loadAdmins = async (adminEmail: string) => {
    setIsLoadingAdmins(true);
    const response = await fetch(
      `/api/admin/admins?email=${encodeURIComponent(adminEmail)}`
    );
    if (!response.ok) {
      const payload = await response.json().catch(() => null);
      setAdminsError(payload?.message || "Unable to load admins.");
      setIsLoadingAdmins(false);
      return;
    }
    const payload = await response.json().catch(() => null);
    setAdmins(payload?.admins ?? []);
    setAdminsError(null);
    setIsLoadingAdmins(false);
  };

  useEffect(() => {
    if (!email) return;
    loadAdmins(email);
  }, [email]);

  const addAdmin = async (targetEmail: string) => {
    if (!email) {
      const message = "Missing admin email. Please sign in again.";
      setAdminsError(message);
      toast.error(message);
      return;
    }

    setIsSavingAdmin(true);
    setAdminsError(null);

    try {
      const response = await fetch("/api/admin/admins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, targetEmail }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        const message = payload?.message || "Unable to add admin.";
        setAdminsError(message);
        toast.error(message);
        setIsSavingAdmin(false);
        return;
      }

      const payload = await response.json().catch(() => null);
      if (payload?.admin) {
        setAdmins((prev) => [payload.admin, ...prev]);
        toast.success("Admin added.");
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to add admin.";
      setAdminsError(message);
      toast.error(message);
    } finally {
      setIsSavingAdmin(false);
    }
  };

  const removeAdmin = async (targetEmail: string) => {
    if (!email) {
      const message = "Missing admin email. Please sign in again.";
      setAdminsError(message);
      toast.error(message);
      return;
    }

    setIsSavingAdmin(true);
    setAdminsError(null);

    try {
      const response = await fetch("/api/admin/admins", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, targetEmail }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        const message = payload?.message || "Unable to remove admin.";
        setAdminsError(message);
        toast.error(message);
        setIsSavingAdmin(false);
        return;
      }

      setAdmins((prev) => prev.filter((item) => item.email !== targetEmail));
      toast.success("Admin removed.");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to remove admin.";
      setAdminsError(message);
      toast.error(message);
    } finally {
      setIsSavingAdmin(false);
    }
  };

  return {
    admins,
    adminsError,
    isLoadingAdmins,
    isSavingAdmin,
    addAdmin,
    removeAdmin,
    reloadAdmins: () => email && loadAdmins(email),
  };
}

export function useHomepageMetrics(email: string | null) {
  const [metrics, setMetrics] = useState<MetricsForm | null>(null);
  const [metricsError, setMetricsError] = useState<string | null>(null);
  const [isSavingMetrics, setIsSavingMetrics] = useState(false);
  const [metricsSavedAt, setMetricsSavedAt] = useState<string | null>(null);

  useEffect(() => {
    const loadMetrics = async () => {
      const response = await fetch("/api/admin/metrics");
      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        setMetricsError(payload?.message || "Unable to load metrics.");
        setMetrics(defaultMetrics);
        return;
      }

      const payload = await response.json().catch(() => null);
      const data = payload?.metrics;
      if (!data) {
        setMetrics(defaultMetrics);
        return;
      }

      setMetrics({
        macroBiasScore: String(data.macroBiasScore ?? ""),
        sp500Ytd: String(data.sp500Ytd ?? ""),
        macroBiasYtd: String(data.macroBiasYtd ?? ""),
        tenYearCagr: String(data.tenYearCagr ?? ""),
        fiveYearCagr: String(data.fiveYearCagr ?? ""),
        twoYearCagr: String(data.twoYearCagr ?? ""),
        maxDrawdownMacroBias: String(data.maxDrawdownMacroBias ?? ""),
        maxDrawdownSp500: String(data.maxDrawdownSp500 ?? ""),
        atAGlance: String(data.atAGlance ?? ""),
      });
      setMetricsSavedAt(data.updatedAt ?? null);
      setMetricsError(null);
    };

    loadMetrics();
  }, []);

  const handleMetricsChange = (field: keyof MetricsForm, value: string) => {
    setMetrics((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  const handleSaveMetrics = async () => {
    if (!email) {
      const message = "Missing admin email. Please sign in again.";
      setMetricsError(message);
      toast.error(message);
      return;
    }
    if (!metrics) return;

    setIsSavingMetrics(true);
    setMetricsError(null);

    try {
      const response = await fetch("/api/admin/metrics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          macroBiasScore: parseNumberInput(metrics.macroBiasScore, "macro bias score"),
          sp500Ytd: parseNumberInput(metrics.sp500Ytd, "S&P 500 YTD"),
          macroBiasYtd: parseNumberInput(metrics.macroBiasYtd, "macro bias YTD"),
          tenYearCagr: parseNumberInput(metrics.tenYearCagr, "10-year CAGR"),
          fiveYearCagr: parseNumberInput(metrics.fiveYearCagr, "5-year CAGR"),
          twoYearCagr: parseNumberInput(metrics.twoYearCagr, "2-year CAGR"),
          maxDrawdownMacroBias: parseNumberInput(
            metrics.maxDrawdownMacroBias,
            "max drawdown (macro bias)"
          ),
          maxDrawdownSp500: parseNumberInput(
            metrics.maxDrawdownSp500,
            "max drawdown (S&P 500)"
          ),
          atAGlance: metrics.atAGlance,
        }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        const message = payload?.message || "Unable to save metrics.";
        setMetricsError(message);
        toast.error(message);
        setIsSavingMetrics(false);
        return;
      }

      const payload = await response.json().catch(() => null);
      const data = payload?.metrics;
      if (data) {
        setMetrics({
          macroBiasScore: String(data.macroBiasScore ?? ""),
          sp500Ytd: String(data.sp500Ytd ?? ""),
          macroBiasYtd: String(data.macroBiasYtd ?? ""),
          tenYearCagr: String(data.tenYearCagr ?? ""),
          fiveYearCagr: String(data.fiveYearCagr ?? ""),
          twoYearCagr: String(data.twoYearCagr ?? ""),
          maxDrawdownMacroBias: String(data.maxDrawdownMacroBias ?? ""),
          maxDrawdownSp500: String(data.maxDrawdownSp500 ?? ""),
          atAGlance: String(data.atAGlance ?? ""),
        });
        setMetricsSavedAt(data.updatedAt ?? new Date().toISOString());
      }
      setMetricsError(null);
      toast.success("Homepage metrics saved.");
    } catch (saveError) {
      const message =
        saveError instanceof Error ? saveError.message : "Unable to save metrics.";
      setMetricsError(message);
      toast.error(message);
    } finally {
      setIsSavingMetrics(false);
    }
  };

  return {
    metrics,
    metricsError,
    isSavingMetrics,
    metricsSavedAt,
    handleMetricsChange,
    handleSaveMetrics,
  };
}

export function useDashboardMetrics(email: string | null) {
  const [dashboardMetrics, setDashboardMetrics] =
    useState<DashboardMetricsForm | null>(null);
  const [dashboardMetricsError, setDashboardMetricsError] = useState<string | null>(
    null
  );
  const [isSavingDashboardMetrics, setIsSavingDashboardMetrics] = useState(false);
  const [dashboardMetricsSavedAt, setDashboardMetricsSavedAt] = useState<string | null>(
    null
  );

  useEffect(() => {
    const loadDashboardMetrics = async () => {
      const response = await fetch("/api/admin/dashboard-metrics");
      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        setDashboardMetricsError(
          payload?.message || "Unable to load dashboard metrics."
        );
        setDashboardMetrics(defaultDashboardMetrics);
        return;
      }

      const payload = await response.json().catch(() => null);
      const data = payload?.metrics;
      if (!data) {
        setDashboardMetrics(defaultDashboardMetrics);
        return;
      }

      setDashboardMetrics({
        dailyMacroScore: String(data.dailyMacroScore ?? ""),
        monthlyMacroScore: String(data.monthlyMacroScore ?? ""),
        regimeExplanation: String(data.regimeExplanation ?? ""),
        navigationGuideText: String(data.navigationGuideText ?? ""),
      });
      setDashboardMetricsSavedAt(data.updatedAt ?? null);
      setDashboardMetricsError(null);
    };

    loadDashboardMetrics();
  }, []);

  const handleDashboardMetricsChange = (
    field: keyof DashboardMetricsForm,
    value: string
  ) => {
    setDashboardMetrics((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  const handleSaveDashboardMetrics = async () => {
    if (!email) {
      const message = "Missing admin email. Please sign in again.";
      setDashboardMetricsError(message);
      toast.error(message);
      return;
    }
    if (!dashboardMetrics) return;

    setIsSavingDashboardMetrics(true);
    setDashboardMetricsError(null);

    try {
      const response = await fetch("/api/admin/dashboard-metrics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          dailyMacroScore: parseNumberInput(
            dashboardMetrics.dailyMacroScore,
            "daily macro score"
          ),
          monthlyMacroScore: parseNumberInput(
            dashboardMetrics.monthlyMacroScore,
            "monthly macro score"
          ),
          regimeExplanation: dashboardMetrics.regimeExplanation,
          navigationGuideText: dashboardMetrics.navigationGuideText,
        }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        const message = payload?.message || "Unable to save metrics.";
        setDashboardMetricsError(message);
        toast.error(message);
        setIsSavingDashboardMetrics(false);
        return;
      }

      const payload = await response.json().catch(() => null);
      const data = payload?.metrics;
      if (data) {
        setDashboardMetrics({
          dailyMacroScore: String(data.dailyMacroScore ?? ""),
          monthlyMacroScore: String(data.monthlyMacroScore ?? ""),
          regimeExplanation: String(data.regimeExplanation ?? ""),
          navigationGuideText: String(data.navigationGuideText ?? ""),
        });
        setDashboardMetricsSavedAt(data.updatedAt ?? new Date().toISOString());
      }
      setDashboardMetricsError(null);
      toast.success("Dashboard metrics saved.");
    } catch (saveError) {
      const message =
        saveError instanceof Error ? saveError.message : "Unable to save metrics.";
      setDashboardMetricsError(message);
      toast.error(message);
    } finally {
      setIsSavingDashboardMetrics(false);
    }
  };

  return {
    dashboardMetrics,
    dashboardMetricsError,
    isSavingDashboardMetrics,
    dashboardMetricsSavedAt,
    handleDashboardMetricsChange,
    handleSaveDashboardMetrics,
  };
}

export function usePositions(email: string | null) {
  const [positions, setPositions] = useState<Position[]>([]);
  const [positionsError, setPositionsError] = useState<string | null>(null);
  const [isSavingPosition, setIsSavingPosition] = useState(false);
  const [positionDraft, setPositionDraft] = useState<PositionForm>(emptyPosition);
  const [editingPositionId, setEditingPositionId] = useState<string | null>(null);
  const [editingPosition, setEditingPosition] = useState<PositionForm | null>(null);

  useEffect(() => {
    const loadPositions = async () => {
      const response = await fetch("/api/admin/positions");
      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        setPositionsError(payload?.message || "Unable to load positions.");
        return;
      }
      const payload = await response.json().catch(() => null);
      setPositions(payload?.positions ?? []);
      setPositionsError(null);
    };

    loadPositions();
  }, []);

  const handlePositionDraftChange = <K extends keyof PositionForm>(
    field: K,
    value: PositionForm[K]
  ) => {
    setPositionDraft((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddPosition = async () => {
    if (!email) {
      const message = "Missing admin email. Please sign in again.";
      setPositionsError(message);
      toast.error(message);
      return;
    }

    setIsSavingPosition(true);
    setPositionsError(null);

    try {
      const response = await fetch("/api/admin/positions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          exposureType: positionDraft.exposureType,
          instrument: positionDraft.instrument,
          entryPrice: parseNumberInput(positionDraft.entryPrice, "entry price"),
          stopLoss: parseNumberInput(positionDraft.stopLoss, "stop loss"),
          positionSize: parseNumberInput(positionDraft.positionSize, "position size"),
          unrealizedPnL: parseNumberInput(
            positionDraft.unrealizedPnL,
            "unrealized P&L"
          ),
          isActive: positionDraft.isActive,
          isInRunProgression: positionDraft.isInRunProgression,
          runProgressionOrder: positionDraft.isInRunProgression
            ? parseNumberInput(
                positionDraft.runProgressionOrder,
                "run progression order"
              )
            : null,
        }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        const message = payload?.message || "Unable to add position.";
        setPositionsError(message);
        toast.error(message);
        setIsSavingPosition(false);
        return;
      }

      const payload = await response.json().catch(() => null);
      if (payload?.position) {
        setPositions((prev) => [payload.position, ...prev]);
        setPositionDraft(emptyPosition);
        toast.success("Position added.");
      }
    } catch (saveError) {
      const message =
        saveError instanceof Error ? saveError.message : "Unable to add position.";
      setPositionsError(message);
      toast.error(message);
    } finally {
      setIsSavingPosition(false);
    }
  };

  const handleEditPosition = (position: Position) => {
    setEditingPositionId(position.id);
    setEditingPosition({
      exposureType: position.exposureType,
      instrument: position.instrument,
      entryPrice: String(position.entryPrice),
      stopLoss: String(position.stopLoss),
      positionSize: String(position.positionSize),
      unrealizedPnL: String(position.unrealizedPnL),
      isActive: position.isActive,
      isInRunProgression: position.isInRunProgression,
      runProgressionOrder:
        position.runProgressionOrder != null
          ? String(position.runProgressionOrder)
          : "",
    });
  };

  const handleSavePosition = async (id: string) => {
    if (!email) {
      const message = "Missing admin email. Please sign in again.";
      setPositionsError(message);
      toast.error(message);
      return;
    }
    if (!editingPosition) return;

    setIsSavingPosition(true);
    setPositionsError(null);

    try {
      const response = await fetch("/api/admin/positions", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          id,
          exposureType: editingPosition.exposureType,
          instrument: editingPosition.instrument,
          entryPrice: parseNumberInput(editingPosition.entryPrice, "entry price"),
          stopLoss: parseNumberInput(editingPosition.stopLoss, "stop loss"),
          positionSize: parseNumberInput(editingPosition.positionSize, "position size"),
          unrealizedPnL: parseNumberInput(
            editingPosition.unrealizedPnL,
            "unrealized P&L"
          ),
          isActive: editingPosition.isActive,
          isInRunProgression: editingPosition.isInRunProgression,
          runProgressionOrder: editingPosition.isInRunProgression
            ? parseNumberInput(
                editingPosition.runProgressionOrder,
                "run progression order"
              )
            : null,
        }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        const message = payload?.message || "Unable to save position.";
        setPositionsError(message);
        toast.error(message);
        setIsSavingPosition(false);
        return;
      }

      const payload = await response.json().catch(() => null);
      if (payload?.position) {
        setPositions((prev) =>
          prev.map((item) => (item.id === id ? payload.position : item))
        );
        setEditingPositionId(null);
        setEditingPosition(null);
        toast.success("Position updated.");
      }
    } catch (saveError) {
      const message =
        saveError instanceof Error ? saveError.message : "Unable to save position.";
      setPositionsError(message);
      toast.error(message);
    } finally {
      setIsSavingPosition(false);
    }
  };

  const handleDeletePosition = async (id: string) => {
    if (!email) {
      const message = "Missing admin email. Please sign in again.";
      setPositionsError(message);
      toast.error(message);
      return;
    }

    setIsSavingPosition(true);
    setPositionsError(null);

    try {
      const response = await fetch("/api/admin/positions", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, id }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        const message = payload?.message || "Unable to delete position.";
        setPositionsError(message);
        toast.error(message);
        setIsSavingPosition(false);
        return;
      }

      setPositions((prev) => prev.filter((item) => item.id !== id));
      if (editingPositionId === id) {
        setEditingPositionId(null);
        setEditingPosition(null);
      }
      toast.success("Position deleted.");
    } catch (saveError) {
      const message =
        saveError instanceof Error ? saveError.message : "Unable to delete position.";
      setPositionsError(message);
      toast.error(message);
    } finally {
      setIsSavingPosition(false);
    }
  };

  return {
    positions,
    positionsError,
    isSavingPosition,
    positionDraft,
    editingPositionId,
    editingPosition,
    setEditingPosition,
    setEditingPositionId,
    handlePositionDraftChange,
    handleAddPosition,
    handleEditPosition,
    handleSavePosition,
    handleDeletePosition,
  };
}

export function useProducts(email: string | null) {
  const [products, setProducts] = useState<Product[]>([]);
  const [productsError, setProductsError] = useState<string | null>(null);
  const [isSavingProduct, setIsSavingProduct] = useState(false);
  const [productDraft, setProductDraft] = useState<ProductForm>(emptyProduct);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [editingProduct, setEditingProduct] = useState<ProductForm | null>(null);

  useEffect(() => {
    const loadProducts = async () => {
      const response = await fetch("/api/admin/products");
      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        setProductsError(payload?.message || "Unable to load products.");
        return;
      }
      const payload = await response.json().catch(() => null);
      setProducts(payload?.products ?? []);
      setProductsError(null);
    };

    loadProducts();
  }, []);

  const handleProductDraftChange = (field: keyof ProductForm, value: string) => {
    setProductDraft((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddProduct = async () => {
    if (!email) {
      const message = "Missing admin email. Please sign in again.";
      setProductsError(message);
      toast.error(message);
      return;
    }

    setIsSavingProduct(true);
    setProductsError(null);

    try {
      const response = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, ...productDraft }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        const message = payload?.message || "Unable to add product.";
        setProductsError(message);
        toast.error(message);
        setIsSavingProduct(false);
        return;
      }

      const payload = await response.json().catch(() => null);
      if (payload?.product) {
        setProducts((prev) => [payload.product, ...prev]);
        setProductDraft(emptyProduct);
        toast.success("Product added.");
      }
    } catch (saveError) {
      const message =
        saveError instanceof Error ? saveError.message : "Unable to add product.";
      setProductsError(message);
      toast.error(message);
    } finally {
      setIsSavingProduct(false);
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProductId(product.id);
    setEditingProduct({
      exposureType: product.exposureType,
      name: product.name,
      isin: product.isin,
      leverage: product.leverage,
      liquidity: product.liquidity,
      factsheetLink: product.factsheetLink,
    });
  };

  const handleSaveProduct = async (id: string) => {
    if (!email) {
      const message = "Missing admin email. Please sign in again.";
      setProductsError(message);
      toast.error(message);
      return;
    }
    if (!editingProduct) return;

    setIsSavingProduct(true);
    setProductsError(null);

    try {
      const response = await fetch("/api/admin/products", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, id, ...editingProduct }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        const message = payload?.message || "Unable to save product.";
        setProductsError(message);
        toast.error(message);
        setIsSavingProduct(false);
        return;
      }

      const payload = await response.json().catch(() => null);
      if (payload?.product) {
        setProducts((prev) =>
          prev.map((item) => (item.id === id ? payload.product : item))
        );
        setEditingProductId(null);
        setEditingProduct(null);
        toast.success("Product updated.");
      }
    } catch (saveError) {
      const message =
        saveError instanceof Error ? saveError.message : "Unable to save product.";
      setProductsError(message);
      toast.error(message);
    } finally {
      setIsSavingProduct(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!email) {
      const message = "Missing admin email. Please sign in again.";
      setProductsError(message);
      toast.error(message);
      return;
    }

    setIsSavingProduct(true);
    setProductsError(null);

    try {
      const response = await fetch("/api/admin/products", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, id }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        const message = payload?.message || "Unable to delete product.";
        setProductsError(message);
        toast.error(message);
        setIsSavingProduct(false);
        return;
      }

      setProducts((prev) => prev.filter((item) => item.id !== id));
      if (editingProductId === id) {
        setEditingProductId(null);
        setEditingProduct(null);
      }
      toast.success("Product deleted.");
    } catch (saveError) {
      const message =
        saveError instanceof Error ? saveError.message : "Unable to delete product.";
      setProductsError(message);
      toast.error(message);
    } finally {
      setIsSavingProduct(false);
    }
  };

  return {
    products,
    productsError,
    isSavingProduct,
    productDraft,
    editingProductId,
    editingProduct,
    setEditingProduct,
    setEditingProductId,
    handleProductDraftChange,
    handleAddProduct,
    handleEditProduct,
    handleSaveProduct,
    handleDeleteProduct,
  };
}

export function usePerformanceYearly(email: string | null) {
  const [performanceYearly, setPerformanceYearly] = useState<PerformanceYearly[]>(
    []
  );
  const [performanceYearlyError, setPerformanceYearlyError] = useState<string | null>(
    null
  );
  const [isSavingPerformanceYearly, setIsSavingPerformanceYearly] = useState(false);
  const [performanceDraft, setPerformanceDraft] =
    useState<PerformanceYearlyForm>(emptyPerformanceYearly);
  const [editingPerformanceId, setEditingPerformanceId] = useState<string | null>(
    null
  );
  const [editingPerformance, setEditingPerformance] =
    useState<PerformanceYearlyForm | null>(null);

  useEffect(() => {
    const loadPerformanceYearly = async () => {
      const response = await fetch("/api/admin/performance-yearly");
      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        setPerformanceYearlyError(payload?.message || "Unable to load performance.");
        return;
      }
      const payload = await response.json().catch(() => null);
      setPerformanceYearly(payload?.yearlyPerformance ?? []);
      setPerformanceYearlyError(null);
    };

    loadPerformanceYearly();
  }, []);

  const handlePerformanceDraftChange = (
    field: keyof PerformanceYearlyForm,
    value: string
  ) => {
    setPerformanceDraft((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddPerformanceYearly = async () => {
    if (!email) {
      const message = "Missing admin email. Please sign in again.";
      setPerformanceYearlyError(message);
      toast.error(message);
      return;
    }

    setIsSavingPerformanceYearly(true);
    setPerformanceYearlyError(null);

    try {
      const response = await fetch("/api/admin/performance-yearly", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          year: parseNumberInput(performanceDraft.year, "year"),
          macroBias: parseNumberInput(performanceDraft.macroBias, "macro bias"),
          sp500: parseNumberInput(performanceDraft.sp500, "S&P 500"),
          alpha: parseNumberInput(performanceDraft.alpha, "alpha"),
        }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        const message = payload?.message || "Unable to add performance row.";
        setPerformanceYearlyError(message);
        toast.error(message);
        setIsSavingPerformanceYearly(false);
        return;
      }

      const payload = await response.json().catch(() => null);
      if (payload?.yearlyPerformance) {
        setPerformanceYearly((prev) => [payload.yearlyPerformance, ...prev]);
        setPerformanceDraft(emptyPerformanceYearly);
        toast.success("Performance row added.");
      }
    } catch (saveError) {
      const message =
        saveError instanceof Error
          ? saveError.message
          : "Unable to add performance row.";
      setPerformanceYearlyError(message);
      toast.error(message);
    } finally {
      setIsSavingPerformanceYearly(false);
    }
  };

  const handleEditPerformance = (row: PerformanceYearly) => {
    setEditingPerformanceId(row.id);
    setEditingPerformance({
      year: String(row.year),
      macroBias: String(row.macroBias),
      sp500: String(row.sp500),
      alpha: String(row.alpha),
    });
  };

  const handleSavePerformance = async (id: string) => {
    if (!email) {
      const message = "Missing admin email. Please sign in again.";
      setPerformanceYearlyError(message);
      toast.error(message);
      return;
    }
    if (!editingPerformance) return;

    setIsSavingPerformanceYearly(true);
    setPerformanceYearlyError(null);

    try {
      const response = await fetch("/api/admin/performance-yearly", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          id,
          year: parseNumberInput(editingPerformance.year, "year"),
          macroBias: parseNumberInput(editingPerformance.macroBias, "macro bias"),
          sp500: parseNumberInput(editingPerformance.sp500, "S&P 500"),
          alpha: parseNumberInput(editingPerformance.alpha, "alpha"),
        }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        const message = payload?.message || "Unable to save performance row.";
        setPerformanceYearlyError(message);
        toast.error(message);
        setIsSavingPerformanceYearly(false);
        return;
      }

      const payload = await response.json().catch(() => null);
      if (payload?.yearlyPerformance) {
        setPerformanceYearly((prev) =>
          prev.map((item) => (item.id === id ? payload.yearlyPerformance : item))
        );
        setEditingPerformanceId(null);
        setEditingPerformance(null);
        toast.success("Performance row updated.");
      }
    } catch (saveError) {
      const message =
        saveError instanceof Error
          ? saveError.message
          : "Unable to save performance row.";
      setPerformanceYearlyError(message);
      toast.error(message);
    } finally {
      setIsSavingPerformanceYearly(false);
    }
  };

  const handleDeletePerformance = async (id: string) => {
    if (!email) {
      const message = "Missing admin email. Please sign in again.";
      setPerformanceYearlyError(message);
      toast.error(message);
      return;
    }

    setIsSavingPerformanceYearly(true);
    setPerformanceYearlyError(null);

    try {
      const response = await fetch("/api/admin/performance-yearly", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, id }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        const message = payload?.message || "Unable to delete performance row.";
        setPerformanceYearlyError(message);
        toast.error(message);
        setIsSavingPerformanceYearly(false);
        return;
      }

      setPerformanceYearly((prev) => prev.filter((item) => item.id !== id));
      if (editingPerformanceId === id) {
        setEditingPerformanceId(null);
        setEditingPerformance(null);
      }
      toast.success("Performance row deleted.");
    } catch (saveError) {
      const message =
        saveError instanceof Error
          ? saveError.message
          : "Unable to delete performance row.";
      setPerformanceYearlyError(message);
      toast.error(message);
    } finally {
      setIsSavingPerformanceYearly(false);
    }
  };

  return {
    performanceYearly,
    performanceYearlyError,
    isSavingPerformanceYearly,
    performanceDraft,
    editingPerformanceId,
    editingPerformance,
    setEditingPerformance,
    setEditingPerformanceId,
    handlePerformanceDraftChange,
    handleAddPerformanceYearly,
    handleEditPerformance,
    handleSavePerformance,
    handleDeletePerformance,
  };
}

export function useFrameworkSections(email: string | null) {
  const [sections, setSections] = useState<FrameworkSection[]>([]);
  const [sectionsError, setSectionsError] = useState<string | null>(null);
  const [isSavingSection, setIsSavingSection] = useState(false);
  const [sectionDraft, setSectionDraft] =
    useState<FrameworkSectionForm>(emptyFrameworkSection);
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const [editingSection, setEditingSection] =
    useState<FrameworkSectionForm | null>(null);

  useEffect(() => {
    const loadSections = async () => {
      const response = await fetch("/api/admin/framework-sections");
      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        setSectionsError(payload?.message || "Unable to load framework sections.");
        return;
      }
      const payload = await response.json().catch(() => null);
      setSections(payload?.sections ?? []);
      setSectionsError(null);
    };

    loadSections();
  }, []);

  const handleSectionDraftChange = <K extends keyof FrameworkSectionForm>(
    field: K,
    value: FrameworkSectionForm[K]
  ) => {
    setSectionDraft((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddSection = async () => {
    if (!email) {
      const message = "Missing admin email. Please sign in again.";
      setSectionsError(message);
      toast.error(message);
      return;
    }

    setIsSavingSection(true);
    setSectionsError(null);

    try {
      const response = await fetch("/api/admin/framework-sections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          slug: sectionDraft.slug,
          title: sectionDraft.title,
          body: sectionDraft.body,
          sortOrder: parseNumberInput(sectionDraft.sortOrder, "sort order"),
        }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        const message = payload?.message || "Unable to add framework section.";
        setSectionsError(message);
        toast.error(message);
        setIsSavingSection(false);
        return;
      }

      const payload = await response.json().catch(() => null);
      if (payload?.section) {
        setSections((prev) => [...prev, payload.section]);
        setSectionDraft(emptyFrameworkSection);
        toast.success("Framework section added.");
      }
    } catch (saveError) {
      const message =
        saveError instanceof Error ? saveError.message : "Unable to add framework section.";
      setSectionsError(message);
      toast.error(message);
    } finally {
      setIsSavingSection(false);
    }
  };

  const handleEditSection = (section: FrameworkSection) => {
    setEditingSectionId(section.id);
    setEditingSection({
      slug: section.slug,
      title: section.title,
      body: section.body,
      sortOrder: String(section.sortOrder),
    });
  };

  const handleSaveSection = async (id: string) => {
    if (!email) {
      const message = "Missing admin email. Please sign in again.";
      setSectionsError(message);
      toast.error(message);
      return;
    }
    if (!editingSection) return;

    setIsSavingSection(true);
    setSectionsError(null);

    try {
      const response = await fetch("/api/admin/framework-sections", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          id,
          slug: editingSection.slug,
          title: editingSection.title,
          body: editingSection.body,
          sortOrder: parseNumberInput(editingSection.sortOrder, "sort order"),
        }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        const message = payload?.message || "Unable to save framework section.";
        setSectionsError(message);
        toast.error(message);
        setIsSavingSection(false);
        return;
      }

      const payload = await response.json().catch(() => null);
      if (payload?.section) {
        setSections((prev) =>
          prev.map((item) => (item.id === id ? payload.section : item))
        );
        setEditingSectionId(null);
        setEditingSection(null);
        toast.success("Framework section updated.");
      }
    } catch (saveError) {
      const message =
        saveError instanceof Error
          ? saveError.message
          : "Unable to save framework section.";
      setSectionsError(message);
      toast.error(message);
    } finally {
      setIsSavingSection(false);
    }
  };

  const handleDeleteSection = async (id: string) => {
    if (!email) {
      const message = "Missing admin email. Please sign in again.";
      setSectionsError(message);
      toast.error(message);
      return;
    }

    setIsSavingSection(true);
    setSectionsError(null);

    try {
      const response = await fetch("/api/admin/framework-sections", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, id }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        const message = payload?.message || "Unable to delete framework section.";
        setSectionsError(message);
        toast.error(message);
        setIsSavingSection(false);
        return;
      }

      setSections((prev) => prev.filter((item) => item.id !== id));
      if (editingSectionId === id) {
        setEditingSectionId(null);
        setEditingSection(null);
      }
      toast.success("Framework section deleted.");
    } catch (saveError) {
      const message =
        saveError instanceof Error
          ? saveError.message
          : "Unable to delete framework section.";
      setSectionsError(message);
      toast.error(message);
    } finally {
      setIsSavingSection(false);
    }
  };

  return {
    sections,
    sectionsError,
    isSavingSection,
    sectionDraft,
    editingSectionId,
    editingSection,
    setEditingSection,
    setEditingSectionId,
    handleSectionDraftChange,
    handleAddSection,
    handleEditSection,
    handleSaveSection,
    handleDeleteSection,
  };
}

export function useLegalSections(email: string | null) {
  const [sections, setSections] = useState<LegalSection[]>([]);
  const [sectionsError, setSectionsError] = useState<string | null>(null);
  const [isSavingSection, setIsSavingSection] = useState(false);
  const [sectionDraft, setSectionDraft] =
    useState<LegalSectionForm>(emptyLegalSection);
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const [editingSection, setEditingSection] =
    useState<LegalSectionForm | null>(null);

  useEffect(() => {
    const loadSections = async () => {
      const response = await fetch("/api/admin/legal-sections");
      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        setSectionsError(payload?.message || "Unable to load legal sections.");
        return;
      }
      const payload = await response.json().catch(() => null);
      setSections(payload?.sections ?? []);
      setSectionsError(null);
    };

    loadSections();
  }, []);

  const handleSectionDraftChange = <K extends keyof LegalSectionForm>(
    field: K,
    value: LegalSectionForm[K]
  ) => {
    setSectionDraft((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddSection = async () => {
    if (!email) {
      const message = "Missing admin email. Please sign in again.";
      setSectionsError(message);
      toast.error(message);
      return;
    }

    setIsSavingSection(true);
    setSectionsError(null);

    try {
      const response = await fetch("/api/admin/legal-sections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          slug: sectionDraft.slug,
          title: sectionDraft.title,
          body: sectionDraft.body,
          sortOrder: parseNumberInput(sectionDraft.sortOrder, "sort order"),
        }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        const message = payload?.message || "Unable to add legal section.";
        setSectionsError(message);
        toast.error(message);
        setIsSavingSection(false);
        return;
      }

      const payload = await response.json().catch(() => null);
      if (payload?.section) {
        setSections((prev) => [...prev, payload.section]);
        setSectionDraft(emptyLegalSection);
        toast.success("Legal section added.");
      }
    } catch (saveError) {
      const message =
        saveError instanceof Error ? saveError.message : "Unable to add legal section.";
      setSectionsError(message);
      toast.error(message);
    } finally {
      setIsSavingSection(false);
    }
  };

  const handleEditSection = (section: LegalSection) => {
    setEditingSectionId(section.id);
    setEditingSection({
      slug: section.slug,
      title: section.title,
      body: section.body,
      sortOrder: String(section.sortOrder),
    });
  };

  const handleSaveSection = async (id: string) => {
    if (!email) {
      const message = "Missing admin email. Please sign in again.";
      setSectionsError(message);
      toast.error(message);
      return;
    }
    if (!editingSection) return;

    setIsSavingSection(true);
    setSectionsError(null);

    try {
      const response = await fetch("/api/admin/legal-sections", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          id,
          slug: editingSection.slug,
          title: editingSection.title,
          body: editingSection.body,
          sortOrder: parseNumberInput(editingSection.sortOrder, "sort order"),
        }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        const message = payload?.message || "Unable to save legal section.";
        setSectionsError(message);
        toast.error(message);
        setIsSavingSection(false);
        return;
      }

      const payload = await response.json().catch(() => null);
      if (payload?.section) {
        setSections((prev) =>
          prev.map((item) => (item.id === id ? payload.section : item))
        );
        setEditingSectionId(null);
        setEditingSection(null);
        toast.success("Legal section updated.");
      }
    } catch (saveError) {
      const message =
        saveError instanceof Error
          ? saveError.message
          : "Unable to save legal section.";
      setSectionsError(message);
      toast.error(message);
    } finally {
      setIsSavingSection(false);
    }
  };

  const handleDeleteSection = async (id: string) => {
    if (!email) {
      const message = "Missing admin email. Please sign in again.";
      setSectionsError(message);
      toast.error(message);
      return;
    }

    setIsSavingSection(true);
    setSectionsError(null);

    try {
      const response = await fetch("/api/admin/legal-sections", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, id }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        const message = payload?.message || "Unable to delete legal section.";
        setSectionsError(message);
        toast.error(message);
        setIsSavingSection(false);
        return;
      }

      setSections((prev) => prev.filter((item) => item.id !== id));
      if (editingSectionId === id) {
        setEditingSectionId(null);
        setEditingSection(null);
      }
      toast.success("Legal section deleted.");
    } catch (saveError) {
      const message =
        saveError instanceof Error
          ? saveError.message
          : "Unable to delete legal section.";
      setSectionsError(message);
      toast.error(message);
    } finally {
      setIsSavingSection(false);
    }
  };

  return {
    sections,
    sectionsError,
    isSavingSection,
    sectionDraft,
    editingSectionId,
    editingSection,
    setEditingSection,
    setEditingSectionId,
    handleSectionDraftChange,
    handleAddSection,
    handleEditSection,
    handleSaveSection,
    handleDeleteSection,
  };
}

export function useNavigationGuides(email: string | null) {
  const [guides, setGuides] = useState<NavigationGuide[]>([]);
  const [guidesError, setGuidesError] = useState<string | null>(null);
  const [isSavingGuide, setIsSavingGuide] = useState(false);
  const [guideDraft, setGuideDraft] = useState<NavigationGuideForm>(emptyNavigationGuide);
  const [editingGuideId, setEditingGuideId] = useState<string | null>(null);
  const [editingGuide, setEditingGuide] = useState<NavigationGuideForm | null>(null);

  useEffect(() => {
    const loadGuides = async () => {
      const response = await fetch("/api/admin/navigation-guides");
      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        setGuidesError(payload?.message || "Unable to load navigation guides.");
        return;
      }
      const payload = await response.json().catch(() => null);
      setGuides(payload?.guides ?? []);
      setGuidesError(null);
    };

    loadGuides();
  }, []);

  const handleGuideDraftChange = <K extends keyof NavigationGuideForm>(
    field: K,
    value: NavigationGuideForm[K]
  ) => {
    setGuideDraft((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddGuide = async () => {
    if (!email) {
      const message = "Missing admin email. Please sign in again.";
      setGuidesError(message);
      toast.error(message);
      return;
    }

    setIsSavingGuide(true);
    setGuidesError(null);

    try {
      const form = new FormData();
      form.append("email", email);
      form.append("title", guideDraft.title);
      form.append("description", guideDraft.description);
      if (guideDraft.file) {
        form.append("file", guideDraft.file);
      }

      const response = await fetch("/api/admin/navigation-guides", {
        method: "POST",
        body: form,
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        const message = payload?.message || "Unable to add navigation guide.";
        setGuidesError(message);
        toast.error(message);
        setIsSavingGuide(false);
        return;
      }

      const payload = await response.json().catch(() => null);
      if (payload?.guide) {
        setGuides((prev) => [...prev, payload.guide]);
        setGuideDraft(emptyNavigationGuide);
        toast.success("Navigation guide added.");
      }
    } catch (saveError) {
      const message =
        saveError instanceof Error
          ? saveError.message
          : "Unable to add navigation guide.";
      setGuidesError(message);
      toast.error(message);
    } finally {
      setIsSavingGuide(false);
    }
  };

  const handleEditGuide = (guide: NavigationGuide) => {
    setEditingGuideId(guide.id);
    setEditingGuide({
      title: guide.title,
      description: guide.description,
      file: null,
    });
  };

  const handleSaveGuide = async (id: string) => {
    if (!email) {
      const message = "Missing admin email. Please sign in again.";
      setGuidesError(message);
      toast.error(message);
      return;
    }
    if (!editingGuide) return;

    setIsSavingGuide(true);
    setGuidesError(null);

    try {
      const form = new FormData();
      form.append("email", email);
      form.append("id", id);
      form.append("title", editingGuide.title);
      form.append("description", editingGuide.description);
      if (editingGuide.file) {
        form.append("file", editingGuide.file);
      }

      const response = await fetch("/api/admin/navigation-guides", {
        method: "PUT",
        body: form,
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        const message = payload?.message || "Unable to save navigation guide.";
        setGuidesError(message);
        toast.error(message);
        setIsSavingGuide(false);
        return;
      }

      const payload = await response.json().catch(() => null);
      if (payload?.guide) {
        setGuides((prev) => prev.map((item) => (item.id === id ? payload.guide : item)));
        setEditingGuideId(null);
        setEditingGuide(null);
        toast.success("Navigation guide updated.");
      }
    } catch (saveError) {
      const message =
        saveError instanceof Error
          ? saveError.message
          : "Unable to save navigation guide.";
      setGuidesError(message);
      toast.error(message);
    } finally {
      setIsSavingGuide(false);
    }
  };

  const handleDeleteGuide = async (id: string) => {
    if (!email) {
      const message = "Missing admin email. Please sign in again.";
      setGuidesError(message);
      toast.error(message);
      return;
    }

    setIsSavingGuide(true);
    setGuidesError(null);

    try {
      const response = await fetch("/api/admin/navigation-guides", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, id }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        const message = payload?.message || "Unable to delete navigation guide.";
        setGuidesError(message);
        toast.error(message);
        setIsSavingGuide(false);
        return;
      }

      setGuides((prev) => prev.filter((item) => item.id !== id));
      if (editingGuideId === id) {
        setEditingGuideId(null);
        setEditingGuide(null);
      }
      toast.success("Navigation guide deleted.");
    } catch (saveError) {
      const message =
        saveError instanceof Error
          ? saveError.message
          : "Unable to delete navigation guide.";
      setGuidesError(message);
      toast.error(message);
    } finally {
      setIsSavingGuide(false);
    }
  };

  return {
    guides,
    guidesError,
    isSavingGuide,
    guideDraft,
    editingGuideId,
    editingGuide,
    setEditingGuide,
    setEditingGuideId,
    handleGuideDraftChange,
    handleAddGuide,
    handleEditGuide,
    handleSaveGuide,
    handleDeleteGuide,
  };
}
