"use client"

import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { getSuppliers, createSupplier, createProduct, updateSupplier, deleteSupplier } from "@/lib/inventory"
import { SupplierModal, type SupplierFormData } from "./components/SupplierModal"
import { AddProductForm } from "../products/components/AddProductForm"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { SaleForm, type SaleFormData } from "../sales/components/SaleForm"
import { createSale } from "@/lib/inventory"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import type { CreateProductData, CreateSaleData } from "@/types/inventory";
import { Plus, Users, UserCheck, UserX, UserPlus } from "lucide-react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar";
import { cn } from "@/lib/utils"; // If you have a classnames utility, otherwise use className directly
import type { Supplier } from "./components/SuppliersTable";
import { Mail, Phone, MapPin, Calendar, BadgeCheck, ClipboardCopy } from "lucide-react";
import QuickActions from "../components/QuickActions";

type Activity = { action: string; item: string; time: string };

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [search, setSearch] = useState("")
  const [modalOpen, setModalOpen] = useState(false)
  const [modalLoading, setModalLoading] = useState(false)
  const [editSupplier, setEditSupplier] = useState<Supplier | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [addProductOpen, setAddProductOpen] = useState(false)
  const [createOrderOpen, setCreateOrderOpen] = useState(false)
  const [orderLoading, setOrderLoading] = useState(false)
  const { toast } = useToast()
  const [viewSupplier, setViewSupplier] = useState<Supplier | null>(null);

  const [activities, setActivities] = useState<Activity[]>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("suppliers_activities");
      if (stored) {
        try {
          return (JSON.parse(stored) as Activity[]).map((a) => ({
            ...a,
            time: typeof a.time === "string" ? a.time : String(a.time),
          }));
        } catch {
          return [];
        }
      }
    }
    return [];
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("suppliers_activities", JSON.stringify(activities))
    }
  }, [activities])

  useEffect(() => {
    getSuppliers()
      .then((data) => setSuppliers(data))
  }, [])

  const filteredSuppliers = suppliers.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email?.toLowerCase().includes(search.toLowerCase()) ||
      s.phone?.toLowerCase().includes(search.toLowerCase()) ||
      s.contact_person?.toLowerCase().includes(search.toLowerCase()),
  )

  // Add Supplier
  const handleAddSupplier = async (data: SupplierFormData) => {
    setModalLoading(true);
    try {
      const newSupplier = await createSupplier(data);
      setSuppliers((prev) => [newSupplier, ...prev]);
      toast({ title: "Supplier added", description: `${data.name} was added successfully.`, variant: "success" });
      setModalOpen(false);
      setActivities((prev: Activity[]) => [
        { action: "Added Supplier", item: data.name, time: new Date().toLocaleTimeString() },
        ...prev,
      ]);
    } catch (err: unknown) {
      const error = err as Error;
      toast({ title: "Error", description: error.message || "Failed to add supplier", variant: "destructive" });
    } finally {
      setModalLoading(false);
    }
  }

  // Add Product
  const handleAddProduct = async (form: CreateProductData) => {
    try {
      await createProduct(form);
      setAddProductOpen(false);
      toast({
        title: "Product added",
        description: `Product '${form.name}' was added successfully.`,
        variant: "success",
      });
    } catch (err: unknown) {
      const error = err as Error;
      toast({ title: "Error", description: error.message || "Failed to add product", variant: "destructive" });
    }
  }

  // Edit Supplier
  const handleEditSupplier = async (data: SupplierFormData) => {
    if (!editSupplier) return;
    setModalLoading(true);
    try {
      const updated = await updateSupplier(editSupplier.id!, data);
      setSuppliers((prev) => prev.map((s) => (s.id === editSupplier.id ? updated : s)));
      toast({ title: "Supplier updated", description: `${data.name} was updated successfully.`, variant: "success" });
      setEditSupplier(null);
      setModalOpen(false);
      setActivities((prev: Activity[]) => [
        { action: "Updated Supplier", item: data.name, time: new Date().toLocaleTimeString() },
        ...prev,
      ]);
    } catch (err: unknown) {
      const error = err as Error;
      toast({ title: "Error", description: error.message || "Failed to update supplier", variant: "destructive" });
    } finally {
      setModalLoading(false);
    }
  }

  // Delete Supplier
  const handleDeleteSupplier = async (id: string) => {
    try {
      await deleteSupplier(id);
      setSuppliers((prev) => prev.filter((s) => s.id !== id));
      toast({ title: "Supplier deleted", description: `Supplier was deleted successfully.`, variant: "success" });
      setDeleteId(null);
      setActivities((prev: Activity[]) => [
        { action: "Deleted Supplier", item: id, time: new Date().toLocaleTimeString() },
        ...prev,
      ]);
    } catch (err: unknown) {
      const error = err as Error;
      toast({ title: "Error", description: error.message || "Failed to delete supplier", variant: "destructive" });
    }
  }

  // Export to CSV for suppliers
  function handleExport() {
    const rows = [
      ["Name", "Contact Person", "Email", "Phone", "Payment Terms"],
      ...filteredSuppliers.map((s) => [
        s.name,
        s.contact_person,
        s.email,
        s.phone,
        s.payment_terms ?? "",
      ]),
    ]
    const csv = rows
      .map((r) =>
        r
          .map(String)
          .map((x) => `"${x.replace(/"/g, '""')}"`)
          .join(","),
      )
      .join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "suppliers_export.csv"
    a.click()
    URL.revokeObjectURL(url)
  }

  async function handleCreateOrder(form: SaleFormData) {
    setOrderLoading(true);
    try {
      const saleData: CreateSaleData = {
        ...form,
        total_amount: Number(form.total_amount) || 0,
        items: form.items.map(item => ({
          ...item,
          quantity: Number(item.quantity) || 0,
          unit_price: Number(item.unit_price) || 0,
        })),
      };
      await createSale(saleData);
      setCreateOrderOpen(false);
      toast({
        title: "Order placed",
        description: `Order for '${form.customer_name}' was created successfully.`,
        variant: "success",
      });
    } catch (err: unknown) {
      const error = err as Error;
      toast({ title: "Error", description: error.message || "Failed to create order", variant: "destructive" });
    } finally {
      setOrderLoading(false);
    }
  }

  // --- Overview Card Data ---
  const totalSuppliers = suppliers.length;
  // Removed activeSuppliers and inactiveSuppliers (is_active not present)
  const newThisMonth = suppliers.filter((s) => {
    if (!s.created_at) return false;
    const created = new Date(s.created_at);
    const now = new Date();
    return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
  }).length;

  // Add the handler function at the top-level of the component
  const handleViewSupplier = (supplier: Supplier) => {
    setViewSupplier(supplier);
  };

  return (
    <DashboardLayout title="Suppliers">
      <div className="p-4 lg:p-6 min-h-screen bg-gray-50 dark:bg-[#10172a]">
        <div className="mb-6 flex justify-end">
          <QuickActions
            onAddProduct={() => setAddProductOpen(true)}
            onAddSupplier={() => { setEditSupplier(null); setModalOpen(true); }}
            onCreateOrder={() => setCreateOrderOpen(true)}
            onExport={handleExport}
          />
        </div>
        {/* Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <Card className="rounded-2xl shadow-md border-0 bg-gradient-to-br from-blue-400 to-blue-600 text-white transition-transform duration-200 hover:scale-105 hover:shadow-2xl cursor-pointer">
            <CardContent className="flex flex-col items-start p-5">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-6 h-6 text-white opacity-80" />
                <span className="text-lg font-semibold">Total Suppliers</span>
              </div>
              <div className="text-3xl font-bold">{totalSuppliers}</div>
            </CardContent>
          </Card>
          <Card className="rounded-2xl shadow-md border-0 bg-gradient-to-br from-purple-400 to-purple-600 text-white transition-transform duration-200 hover:scale-105 hover:shadow-2xl cursor-pointer">
            <CardContent className="flex flex-col items-start p-5">
              <div className="flex items-center gap-2 mb-2">
                <UserPlus className="w-6 h-6 text-white opacity-80" />
                <span className="text-lg font-semibold">New This Month</span>
              </div>
              <div className="text-3xl font-bold">{newThisMonth}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Actions Bar */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <select className="rounded-lg border border-gray-200 dark:border-gray-700 px-4 py-2 bg-white dark:bg-[#232b3e] text-sm shadow-sm text-gray-900 dark:text-white">
            <option>All Status</option>
            <option>Active</option>
            <option>Inactive</option>
          </select>
          <input
            className="rounded-lg border border-gray-200 dark:border-gray-700 px-4 py-2 bg-white dark:bg-[#232b3e] text-sm shadow-sm text-gray-900 dark:text-white flex-1 min-w-[200px]"
            placeholder="Search suppliers..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <Button
            onClick={() => {
              setEditSupplier(null);
              setModalOpen(true);
            }}
            className="bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold rounded-lg px-6 py-2 shadow hover:from-purple-600 hover:to-blue-600 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Supplier
          </Button>
          <Button
            variant="outline"
            className="rounded-lg px-5 py-2 font-semibold border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#232b3e] text-gray-900 dark:text-white shadow-sm flex items-center gap-2"
            onClick={handleExport}
          >
            Export
          </Button>
        </div>

        {/* Table Card */}
        <Card className="rounded-2xl shadow-xl mb-6 bg-white text-gray-900 border-0 dark:bg-[#192132] dark:text-white">
          <CardContent className="p-0">
            {/* Desktop Table */}
            <div className="hidden md:block">
              <div className="overflow-x-auto rounded-2xl">
                <Table className="min-w-full border-separate border-spacing-0">
                  <TableHeader>
                    <TableRow className="bg-gradient-to-r from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 sticky top-0 z-10 rounded-t-2xl">
                      <TableHead className="text-blue-900 dark:text-blue-200 font-bold py-3 px-4 rounded-tl-2xl">Name</TableHead>
                      <TableHead className="text-blue-900 dark:text-blue-200 font-bold py-3 px-4">Status</TableHead>
                      <TableHead className="text-blue-900 dark:text-blue-200 font-bold py-3 px-4">Email</TableHead>
                      <TableHead className="text-blue-900 dark:text-blue-200 font-bold py-3 px-4">Phone</TableHead>
                      <TableHead className="text-blue-900 dark:text-blue-200 font-bold py-3 px-4 rounded-tr-2xl">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSuppliers.map((supplier, idx) => (
                      <TableRow
                        key={supplier.id}
                        className={cn(
                          "group transition-all duration-200",
                          idx % 2 === 0
                            ? "bg-gray-50 dark:bg-[#232b3e]"
                            : "bg-white dark:bg-[#1a2236]",
                          "hover:shadow-lg hover:ring-2 hover:ring-blue-200 dark:hover:ring-blue-800 hover:z-10"
                        )}
                        style={{ borderRadius: "1rem" }}
                      >
                        <TableCell className="rounded-l-2xl py-2 px-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10 shadow-md ring-2 ring-blue-400">
                              {/* <AvatarImage src={supplier.imageUrl} alt={supplier.name} /> */}
                              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-400 text-white font-bold">
                                {supplier.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")
                                  .toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-semibold text-base">{supplier.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="py-2 px-4">
                          <span className={cn(
                            "inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold shadow",
                            supplier.is_active !== false
                              ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                              : "bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400"
                          )}>
                            {supplier.is_active !== false ? (
                              <>
                                <svg className="w-3 h-3 fill-green-500" viewBox="0 0 8 8"><circle cx="4" cy="4" r="4" /></svg>
                                Active
                              </>
                            ) : (
                              <>
                                <svg className="w-3 h-3 fill-gray-400" viewBox="0 0 8 8"><circle cx="4" cy="4" r="4" /></svg>
                                Inactive
                              </>
                            )}
                          </span>
                        </TableCell>
                        <TableCell className="py-2 px-4">
                          <span className="text-sm font-mono">{supplier.email}</span>
                        </TableCell>
                        <TableCell className="py-2 px-4">
                          <span className="text-sm font-mono">{supplier.phone}</span>
                        </TableCell>
                        <TableCell className="rounded-r-2xl py-2 px-4">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-blue-100 dark:hover:bg-blue-900">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => {
                                  setEditSupplier(supplier);
                                  setModalOpen(true);
                                }}
                              >
                                <Pencil className="w-4 h-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => setDeleteId(supplier.id!)}
                                className="text-red-600"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleViewSupplier(supplier)}
                              >
                                <MoreHorizontal className="w-4 h-4 mr-2" />
                                View
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
            {/* Mobile Cards */}
            <div className="md:hidden space-y-3">
              {filteredSuppliers.map((supplier) => (
                <div
                  key={supplier.id}
                  className="bg-white dark:bg-[#232b3e] border border-gray-200 dark:border-gray-800 rounded-xl p-4 flex flex-col gap-2 shadow transition-transform duration-200 hover:scale-[1.02] hover:shadow-xl"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 shadow-md ring-2 ring-blue-400">
                      {/* <AvatarImage src={supplier.imageUrl} alt={supplier.name} /> */}
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-400 text-white font-bold">
                        {supplier.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-semibold text-base">{supplier.name}</span>
                    <span className={`ml-auto px-3 py-1 rounded-full text-xs font-semibold shadow
                      ${supplier.is_active !== false
                        ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                        : "bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400"
                      }`}>
                      {supplier.is_active !== false ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1 pl-2">
                    <div className="text-xs text-gray-500 dark:text-gray-400">Email: <span className="text-sm text-gray-900 dark:text-white">{supplier.email}</span></div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Phone: <span className="text-sm text-gray-900 dark:text-white">{supplier.phone}</span></div>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => {
                        setEditSupplier(supplier);
                        setModalOpen(true);
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      className="flex-1"
                      onClick={() => setDeleteId(supplier.id!)}
                    >
                      Delete
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => handleViewSupplier(supplier)}
                    >
                      View
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            {/* Pagination (placeholder, implement as needed) */}
            <div className="flex justify-end p-4">
              {/* <PaginationComponent ... /> */}
            </div>
                </CardContent>
              </Card>

        {/* (Removed TopSuppliersChart and sidebar cards for a cleaner, more compact layout) */}

        {/* Add Product Dialog */}
        <Dialog open={addProductOpen} onOpenChange={setAddProductOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Product</DialogTitle>
            </DialogHeader>
            <AddProductForm onSubmit={handleAddProduct} onCancel={() => setAddProductOpen(false)} />
          </DialogContent>
        </Dialog>

        {/* Add/Edit Supplier Dialog */}
        <SupplierModal
          open={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setEditSupplier(null);
          }}
          onSubmit={editSupplier ? handleEditSupplier : handleAddSupplier}
          initialData={
            editSupplier
              ? {
                  name: editSupplier.name,
                  contact_person: editSupplier.contact_person,
                  email: editSupplier.email,
                  phone: editSupplier.phone,
                  street: editSupplier.street,
                  city: editSupplier.city,
                  state: editSupplier.state,
                  pincode: editSupplier.pincode,
                  payment_terms: editSupplier.payment_terms,
                }
              : undefined
          }
          loading={modalLoading}
        />

        {/* Create Order Dialog */}
        <Dialog open={createOrderOpen} onOpenChange={setCreateOrderOpen}>
          <DialogContent className="p-0">
            <DialogHeader>
              <DialogTitle>Create Order</DialogTitle>
            </DialogHeader>
            <SaleForm onSubmit={handleCreateOrder} onCancel={() => setCreateOrderOpen(false)} loading={orderLoading} />
          </DialogContent>
        </Dialog>

        {/* Delete Confirm Dialog (AlertDialog) */}
        <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the supplier.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => deleteId && handleDeleteSupplier(deleteId)}>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* View Supplier Modal */}
        <Dialog open={!!viewSupplier} onOpenChange={() => setViewSupplier(null)}>
          <DialogContent className="max-w-md bg-white/80 dark:bg-[#181c2a]/80 border-0 shadow-2xl rounded-2xl backdrop-blur-md animate-fade-in">
            <DialogHeader>
              <DialogTitle className="text-2xl font-extrabold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent tracking-tight">
                Supplier Details
              </DialogTitle>
            </DialogHeader>
            {viewSupplier && (
              <div className="space-y-6 p-2">
                <div className="flex items-center gap-5">
                  <Avatar className="h-20 w-20 shadow-lg ring-4 ring-blue-400/60">
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white font-extrabold text-3xl">
                      {viewSupplier.name.split(" ").map((n) => n[0]).join("").toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="text-xl font-bold text-slate-900 dark:text-white">{viewSupplier.name}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-300">Contact: {viewSupplier.contact_person}</div>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4 text-base">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-blue-500" />
                    <span className="font-semibold text-gray-700 dark:text-gray-200">Email:</span>
                    <span className="text-gray-900 dark:text-white break-all">{viewSupplier.email}</span>
                    <button type="button" className="ml-1 p-1 hover:bg-blue-100 dark:hover:bg-blue-900 rounded" onClick={() => navigator.clipboard.writeText(viewSupplier.email)} title="Copy Email">
                      <ClipboardCopy className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-blue-500" />
                    <span className="font-semibold text-gray-700 dark:text-gray-200">Phone:</span>
                    <span className="text-gray-900 dark:text-white">{viewSupplier.phone}</span>
                    <button type="button" className="ml-1 p-1 hover:bg-blue-100 dark:hover:bg-blue-900 rounded" onClick={() => navigator.clipboard.writeText(viewSupplier.phone)} title="Copy Phone">
                      <ClipboardCopy className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-blue-500" />
                    <span className="font-semibold text-gray-700 dark:text-gray-200">Street:</span>
                    <span className="text-gray-900 dark:text-white">{viewSupplier.street || <span className="text-gray-400">-</span>}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-blue-500" />
                    <span className="font-semibold text-gray-700 dark:text-gray-200">City:</span>
                    <span className="text-gray-900 dark:text-white">{viewSupplier.city || <span className="text-gray-400">-</span>}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-blue-500" />
                    <span className="font-semibold text-gray-700 dark:text-gray-200">State:</span>
                    <span className="text-gray-900 dark:text-white">{viewSupplier.state || <span className="text-gray-400">-</span>}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-blue-500" />
                    <span className="font-semibold text-gray-700 dark:text-gray-200">Pincode:</span>
                    <span className="text-gray-900 dark:text-white">{viewSupplier.pincode || <span className="text-gray-400">-</span>}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <BadgeCheck className="w-5 h-5 text-blue-500" />
                    <span className="font-semibold text-gray-700 dark:text-gray-200">Payment Terms:</span>
                    <span className="text-gray-900 dark:text-white">{viewSupplier.payment_terms !== undefined ? `${viewSupplier.payment_terms} days` : <span className="text-gray-400">-</span>}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-gray-700 dark:text-gray-200">ID:</span>
                    <span className="text-xs font-mono text-gray-900 dark:text-white break-all">{viewSupplier.id}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-blue-500" />
                    <span className="font-semibold text-gray-700 dark:text-gray-200">Created At:</span>
                    <span className="text-gray-900 dark:text-white">{viewSupplier.created_at ? new Date(viewSupplier.created_at).toLocaleString() : <span className="text-gray-400">-</span>}</span>
                  </div>
                </div>
                <div className="flex justify-end pt-2">
                  <Button variant="outline" onClick={() => setViewSupplier(null)}>
                    Close
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
