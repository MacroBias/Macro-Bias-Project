"use client";

import {
  useAdminSession,
  useProducts,
} from "@/components/admin/admin-hooks";
import {
  compactInputClass,
  inputClass,
  labelClass,
  panelClass,
  sectionHeaderClass,
} from "@/components/admin/admin-styles";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";

export default function ProductsPage() {
  const email = useAdminSession();
  const {
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
  } = useProducts(email);

  return (
    <div className="space-y-6">
      <div className={sectionHeaderClass}>
        <div>
          <h2 className="text-lg font-semibold text-white">Products</h2>
          <p className="text-sm text-slate-400">
            Manage long/short products used on the dashboard.
          </p>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,280px)_minmax(0,1.7fr)]">
        <div className={panelClass}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white">New Product</p>
              <p className="text-xs text-slate-500">
                Add a new product configuration.
              </p>
            </div>
          </div>
          <div className="mt-4 grid gap-4">
            <label className={labelClass}>
              Exposure Type
              <select
                value={productDraft.exposureType}
                onChange={(event) =>
                  handleProductDraftChange(
                    "exposureType",
                    event.target.value as "Long" | "Short"
                  )
                }
                className={inputClass}
              >
                <option value="Long">Long</option>
                <option value="Short">Short</option>
              </select>
            </label>
            <label className={labelClass}>
              Name
              <input
                type="text"
                value={productDraft.name}
                onChange={(event) =>
                  handleProductDraftChange("name", event.target.value)
                }
                className={inputClass}
              />
            </label>
            <label className={labelClass}>
              ISIN
              <input
                type="text"
                value={productDraft.isin}
                onChange={(event) =>
                  handleProductDraftChange("isin", event.target.value)
                }
                className={inputClass}
              />
            </label>
            <label className={labelClass}>
              Leverage
              <input
                type="text"
                value={productDraft.leverage}
                onChange={(event) =>
                  handleProductDraftChange("leverage", event.target.value)
                }
                className={inputClass}
              />
            </label>
            <label className={labelClass}>
              Liquidity
              <input
                type="text"
                value={productDraft.liquidity}
                onChange={(event) =>
                  handleProductDraftChange("liquidity", event.target.value)
                }
                className={inputClass}
              />
            </label>
            <label className={labelClass}>
              Factsheet Link
              <input
                type="text"
                value={productDraft.factsheetLink}
                onChange={(event) =>
                  handleProductDraftChange("factsheetLink", event.target.value)
                }
                className={inputClass}
              />
            </label>
          </div>
          <div className="mt-4 flex items-center justify-end">
            <button
              type="button"
              onClick={handleAddProduct}
              disabled={isSavingProduct}
              className="rounded-xl border border-slate-800/60 bg-[#111827] px-4 py-3 text-sm text-slate-200 transition hover:border-slate-700/80 hover:bg-[#0b1527] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSavingProduct ? "Saving..." : "Add product"}
            </button>
          </div>
          {productsError ? (
            <div className="mt-3 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {productsError}
            </div>
          ) : null}
        </div>

        <div className={panelClass}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white">Product Catalog</p>
              <p className="text-xs text-slate-500">
                Edit or remove products already in use.
              </p>
            </div>
          </div>
          <div className="mt-4 overflow-hidden rounded-xl border border-slate-800/60">
            <table className="min-w-full table-fixed divide-y divide-slate-800 text-sm">
              <thead className="bg-[#0f1d33] text-left text-xs uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-medium">Exposure</th>
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="hidden px-4 py-3 font-medium lg:table-cell">ISIN</th>
                  <th className="px-4 py-3 font-medium">Leverage</th>
                  <th className="hidden px-4 py-3 font-medium xl:table-cell">Liquidity</th>
                  <th className="hidden px-4 py-3 font-medium xl:table-cell">Factsheet</th>
              <th className="px-2 py-3 font-medium text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 bg-[#0a1628]">
                {products.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-6 text-center text-slate-500">
                      No products yet.
                    </td>
                  </tr>
                ) : (
                  products.map((product) => {
                    const isEditing = editingProductId === product.id;
                    return (
                      <tr key={product.id}>
                        <td className="px-4 py-3 text-slate-200">
                          {isEditing ? (
                            <select
                              value={editingProduct?.exposureType ?? "Long"}
                              onChange={(event) =>
                                setEditingProduct((prev) =>
                                  prev
                                    ? {
                                        ...prev,
                                        exposureType: event.target.value as
                                          | "Long"
                                          | "Short",
                                      }
                                    : prev
                                )
                              }
                              className={compactInputClass}
                            >
                              <option value="Long">Long</option>
                              <option value="Short">Short</option>
                            </select>
                          ) : (
                            product.exposureType
                          )}
                        </td>
                        <td className="px-4 py-3 text-slate-200">
                          {isEditing ? (
                            <input
                              value={editingProduct?.name ?? ""}
                              onChange={(event) =>
                                setEditingProduct((prev) =>
                                  prev ? { ...prev, name: event.target.value } : prev
                                )
                              }
                              className={compactInputClass}
                            />
                          ) : (
                            product.name
                          )}
                        </td>
                        <td className="hidden px-4 py-3 text-slate-200 lg:table-cell">
                          {isEditing ? (
                            <input
                              value={editingProduct?.isin ?? ""}
                              onChange={(event) =>
                                setEditingProduct((prev) =>
                                  prev ? { ...prev, isin: event.target.value } : prev
                                )
                              }
                              className={compactInputClass}
                            />
                          ) : (
                            product.isin
                          )}
                        </td>
                        <td className="px-4 py-3 text-slate-200">
                          {isEditing ? (
                            <input
                              value={editingProduct?.leverage ?? ""}
                              onChange={(event) =>
                                setEditingProduct((prev) =>
                                  prev
                                    ? { ...prev, leverage: event.target.value }
                                    : prev
                                )
                              }
                              className={compactInputClass}
                            />
                          ) : (
                            product.leverage
                          )}
                        </td>
                        <td className="hidden px-4 py-3 text-slate-200 xl:table-cell">
                          {isEditing ? (
                            <input
                              value={editingProduct?.liquidity ?? ""}
                              onChange={(event) =>
                                setEditingProduct((prev) =>
                                  prev
                                    ? { ...prev, liquidity: event.target.value }
                                    : prev
                                )
                              }
                              className={compactInputClass}
                            />
                          ) : (
                            product.liquidity
                          )}
                        </td>
                        <td className="hidden max-w-[140px] overflow-hidden px-4 py-3 text-slate-200 xl:table-cell">
                          {isEditing ? (
                            <input
                              value={editingProduct?.factsheetLink ?? ""}
                              onChange={(event) =>
                                setEditingProduct((prev) =>
                                  prev
                                    ? { ...prev, factsheetLink: event.target.value }
                                    : prev
                                )
                              }
                              className={compactInputClass}
                            />
                          ) : product.factsheetLink ? (
                            <a
                              href={product.factsheetLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              title={product.factsheetLink}
                              className="block max-w-full truncate text-sky-400 hover:text-sky-300 hover:underline"
                            >
                              {product.factsheetLink.startsWith("http")
                                ? "View factsheet"
                                : product.factsheetLink}
                            </a>
                          ) : (
                            "—"
                          )}
                        </td>
                        <td className="px-2 py-3 text-right align-middle">
                          {isEditing ? (
                            <div className="flex flex-wrap items-center justify-end gap-1 sm:gap-2">
                              <button
                                type="button"
                                onClick={() => handleSaveProduct(product.id)}
                                className="rounded-lg border border-slate-700/60 px-2 py-1 text-[11px] text-slate-200 hover:border-slate-600/80"
                              >
                                Save
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingProductId(null);
                                  setEditingProduct(null);
                                }}
                                className="rounded-lg border border-slate-700/60 px-2 py-1 text-[11px] text-slate-400 hover:text-slate-200"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center justify-end">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <button
                                    type="button"
                                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-700/60 text-slate-200 hover:border-slate-600/80"
                                    aria-label="Open product actions"
                                  >
                                    <MoreHorizontal className="h-4 w-4" />
                                  </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                  align="end"
                                  className="min-w-36 bg-[#030712] text-slate-100"
                                >
                                  <DropdownMenuItem
                                    onSelect={() => handleEditProduct(product)}
                                  >
                                    <Pencil className="h-3.5 w-3.5" />
                                    <span>Edit</span>
                                  </DropdownMenuItem>
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <DropdownMenuItem
                                        onSelect={(event) => event.preventDefault()}
                                        variant="destructive"
                                      >
                                        <Trash2 className="h-3.5 w-3.5" />
                                        <span>Delete</span>
                                      </DropdownMenuItem>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent className="border-slate-800/60 bg-[#0a1628] text-slate-100">
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>
                                          Delete this product?
                                        </AlertDialogTitle>
                                        <AlertDialogDescription className="text-slate-400">
                                          This action cannot be undone. The product
                                          will be removed from the dashboard
                                          immediately.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel className="border-slate-700/60 bg-transparent text-slate-200 hover:bg-slate-800/40">
                                          Cancel
                                        </AlertDialogCancel>
                                        <AlertDialogAction
                                          onClick={() =>
                                            handleDeleteProduct(product.id)
                                          }
                                          className="bg-red-500 text-white hover:bg-red-400"
                                        >
                                          Delete
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
