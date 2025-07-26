"use client";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useEffect, useState } from "react";
import { useCustomerStore } from "@/store/customerStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { User, MapPin, CreditCard, X, Loader2, Eye, Edit2, Trash2, Plus } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Customer } from "@/types/customer";
import { toast } from "sonner";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Users, UserCheck, UserX, UserPlus } from "lucide-react";

const stateOptions = [
  "NY", "CA", "TX", "FL", "IL", "Other"
];

type CustomerFormValues = {
  name: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  is_active: boolean;
};

const defaultValues: CustomerFormValues = {
  name: "",
  email: "",
  phone: "",
  city: "",
  state: "",
  is_active: true,
};

export default function CustomersPage() {
  const { customers, loading, error, fetchCustomers, createCustomer, updateCustomer } = useCustomerStore();
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [viewCustomer, setViewCustomer] = useState<Customer | null>(null);
  const [submitting, setSubmitting] = useState(false);
  // Filter state
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("all");
  const [isActive, setIsActive] = useState<string>("all");

  const form = useForm<CustomerFormValues>({ defaultValues });

  useEffect(() => {
    fetchCustomers();
  }, []);

  // Fetch with filters
  const handleFilter = () => {
    fetchCustomers({
      search: search || undefined,
      city: city || undefined,
      state: state === "all" ? undefined : state,
      is_active: isActive === "all" ? undefined : isActive === "true"
    });
  };

  // Handle Enter key for search
  const handleSearchKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleFilter();
  };

  // Open edit modal
  const handleEdit = (customer: Customer) => {
    setEditId(customer.id);
    form.reset({
      name: customer.name || "",
      email: customer.email || "",
      phone: customer.phone || "",
      city: customer.city || "",
      state: customer.state || "",
      is_active: customer.is_active ?? true,
    });
    setShowModal(true);
  };

  // Open delete dialog
  const handleDelete = (id: string) => {
    setDeleteId(id);
    setShowDelete(true);
  };

  // Confirm delete (deactivate)
  const confirmDelete = async () => {
    if (!deleteId) return;
    setSubmitting(true);
    try {
      await updateCustomer(deleteId, { is_active: false });
      toast.success("Customer deactivated");
      setShowDelete(false);
      setDeleteId(null);
      handleFilter();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      toast.error(message || "Error deactivating customer");
    } finally {
      setSubmitting(false);
    }
  };

  // Add or Edit submit
  const onSubmit = async (values: CustomerFormValues) => {
    setSubmitting(true);
    try {
      if (editId) {
        await updateCustomer(editId, values);
        toast.success("Customer updated");
      } else {
        await createCustomer(values);
        toast.success("Customer added");
      }
      setShowModal(false);
      setEditId(null);
      form.reset(defaultValues);
      handleFilter();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      toast.error(message || "Error saving customer");
    } finally {
      setSubmitting(false);
    }
  };

  // Open add modal
  const handleAdd = () => {
    setEditId(null);
    form.reset(defaultValues);
    setShowModal(true);
  };

  // Stat calculations
  const total = customers.length;
  const active = customers.filter(c => c.is_active).length;
  const inactive = customers.filter(c => !c.is_active).length;
  // For demo: new this month = last 30 days
  const newThisMonth = customers.filter(c => c.created_at && (new Date().getTime() - new Date(c.created_at).getTime()) < 30 * 24 * 60 * 60 * 1000).length;

  return (
    <DashboardLayout title="Customers">
      <div className="min-h-screen w-full bg-[#f6f8fc] dark:bg-gradient-to-br dark:from-[#232946] dark:via-[#181f3a] dark:to-[#1a1e2e] px-4 py-10">
        {/* Stat Cards Row */}
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <Card className="flex flex-row items-center gap-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg rounded-2xl px-6 py-5">
            <div className="bg-white/20 rounded-full p-3"><Users className="w-7 h-7" /></div>
            <div>
              <div className="text-xs uppercase tracking-wider">Total</div>
              <div className="text-2xl font-bold">{total}</div>
            </div>
          </Card>
          <Card className="flex flex-row items-center gap-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg rounded-2xl px-6 py-5">
            <div className="bg-white/20 rounded-full p-3"><UserCheck className="w-7 h-7" /></div>
            <div>
              <div className="text-xs uppercase tracking-wider">Active</div>
              <div className="text-2xl font-bold">{active}</div>
            </div>
          </Card>
          <Card className="flex flex-row items-center gap-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg rounded-2xl px-6 py-5">
            <div className="bg-white/20 rounded-full p-3"><UserX className="w-7 h-7" /></div>
            <div>
              <div className="text-xs uppercase tracking-wider">Inactive</div>
              <div className="text-2xl font-bold">{inactive}</div>
            </div>
          </Card>
          <Card className="flex flex-row items-center gap-4 bg-gradient-to-r from-green-400 to-cyan-500 text-white shadow-lg rounded-2xl px-6 py-5">
            <div className="bg-white/20 rounded-full p-3"><UserPlus className="w-7 h-7" /></div>
            <div>
              <div className="text-xs uppercase tracking-wider">New This Month</div>
              <div className="text-2xl font-bold">{newThisMonth}</div>
            </div>
          </Card>
        </div>
        {/* Header Section */}
        <div className="max-w-5xl mx-auto mb-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-2 text-[#232946] dark:text-white">
                <User className="w-8 h-8 text-cyan-400" />
                Welcome back, <span className="text-cyan-400">User!</span>
              </h2>
              <div className="text-base text-blue-600 dark:text-blue-200 mt-1">Here are your customers and their details.</div>
            </div>
          </div>
        </div>
        {/* Filter/Search Bar */}
        <div className="max-w-5xl mx-auto mb-8">
          <div className="flex flex-col md:flex-row gap-3 md:gap-4 items-center bg-white dark:bg-[#232946] rounded-full p-5 shadow-xl border border-blue-100 dark:border-blue-900">
            <Input
              placeholder="Search by name..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={handleSearchKey}
              className="rounded-full bg-white dark:bg-[#181f3a] border-0 text-[#232946] dark:text-cyan-100 md:w-64 shadow-none focus:ring-2 focus:ring-purple-400"
            />
            <Input
              placeholder="City"
              value={city}
              onChange={e => setCity(e.target.value)}
              className="rounded-full bg-white dark:bg-[#181f3a] border-0 text-[#232946] dark:text-cyan-100 md:w-40 shadow-none focus:ring-2 focus:ring-purple-400"
            />
            <Select value={state} onValueChange={setState}>
              <SelectTrigger className="rounded-full bg-white dark:bg-[#181f3a] border-0 text-[#232946] dark:text-cyan-100 md:w-40 shadow-none focus:ring-2 focus:ring-purple-400">
                <SelectValue placeholder="State" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-[#181f3a] border-0 text-[#232946] dark:text-cyan-100">
                <SelectItem value="all">All States</SelectItem>
                {stateOptions.map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={isActive} onValueChange={setIsActive}>
              <SelectTrigger className="rounded-full bg-white dark:bg-[#181f3a] border-0 text-[#232946] dark:text-cyan-100 md:w-32 shadow-none focus:ring-2 focus:ring-purple-400">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-[#181f3a] border-0 text-[#232946] dark:text-cyan-100">
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="true">Active</SelectItem>
                <SelectItem value="false">Inactive</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleFilter} className="rounded-full bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold shadow-lg px-8 py-2 hover:from-purple-600 hover:to-blue-600 transition-all">Filter</Button>
          </div>
        </div>
        {/* Main Card/Table Section */}
        <Card className="max-w-5xl mx-auto bg-white dark:bg-[#232946] border-0 shadow-2xl rounded-3xl overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xl font-bold text-[#232946] dark:text-white">Customers</CardTitle>
            <Button onClick={handleAdd} className="bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold rounded-xl shadow-lg px-8 py-2 hover:from-purple-600 hover:to-blue-600 transition-all flex items-center"><Plus className="mr-2 w-5 h-5" /> Add Customer</Button>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="py-8 text-center text-blue-600 dark:text-muted-foreground">Loading...</div>
            ) : error ? (
              <div className="py-8 text-center text-red-400">{error}</div>
            ) : (
              <div>
                <Table>
                  <TableHeader>
                    <TableRow className="bg-[#f3f4f6] dark:bg-[#232946]/80 border-b border-blue-200 dark:border-blue-900">
                      <TableHead className="text-left px-5 py-4 font-bold text-lg text-[#232946] dark:text-white align-middle" style={{minWidth:'180px'}}>Name</TableHead>
                      <TableHead className="text-left px-5 py-4 font-bold text-lg text-[#232946] dark:text-white align-middle">Email</TableHead>
                      <TableHead className="text-left px-5 py-4 font-bold text-lg text-[#232946] dark:text-white align-middle">Phone</TableHead>
                      <TableHead className="text-left px-5 py-4 font-bold text-lg text-[#232946] dark:text-white align-middle">City</TableHead>
                      <TableHead className="text-left px-5 py-4 font-bold text-lg text-[#232946] dark:text-white align-middle">State</TableHead>
                      <TableHead className="text-left px-5 py-4 font-bold text-lg text-[#232946] dark:text-white align-middle">Active</TableHead>
                      <TableHead className="text-right px-5 py-4 font-bold text-lg text-[#232946] dark:text-white align-middle">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {customers.map((c) => (
                      <TableRow key={c.id} className="transition-colors hover:bg-blue-50 dark:hover:bg-[#232946]/60">
                        <TableCell className="px-5 py-4 font-medium text-cyan-700 dark:text-cyan-200 align-middle" style={{minWidth:'180px'}}>{c.name}</TableCell>
                        <TableCell className="px-5 py-4 text-[#232946] dark:text-foreground font-medium align-middle">{c.email}</TableCell>
                        <TableCell className="px-5 py-4 text-[#232946] dark:text-foreground font-medium align-middle">{c.phone}</TableCell>
                        <TableCell className="px-5 py-4 text-[#232946] dark:text-foreground font-medium align-middle">{c.city}</TableCell>
                        <TableCell className="px-5 py-4 text-[#232946] dark:text-foreground font-medium align-middle">{c.state}</TableCell>
                        <TableCell className="px-5 py-4 text-[#232946] dark:text-foreground font-medium align-middle">{c.is_active ? "Yes" : "No"}</TableCell>
                        <TableCell className="px-5 py-4 flex gap-2 justify-end align-middle">
                          <Button size="sm" variant="ghost" className="text-cyan-500 hover:bg-cyan-100 dark:text-cyan-400 dark:hover:bg-cyan-900/30 rounded-lg" onClick={() => setViewCustomer(c)}><Eye className="w-4 h-4" /></Button>
                          <Button size="sm" variant="ghost" className="text-cyan-500 hover:bg-cyan-100 dark:text-cyan-400 dark:hover:bg-cyan-900/30 rounded-lg" onClick={() => handleEdit(c)}><Edit2 className="w-4 h-4" /></Button>
                          <Button size="sm" variant="ghost" className="text-red-500 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900/30 rounded-lg" onClick={() => handleDelete(c.id)}><Trash2 className="w-4 h-4" /></Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {customers.length === 0 && <div className="py-8 text-center text-blue-600 dark:text-muted-foreground">No customers found.</div>}
              </div>
            )}
          </CardContent>
        </Card>
        {/* View Details Modal */}
        <Dialog open={!!viewCustomer} onOpenChange={() => setViewCustomer(null)}>
          <DialogContent className="bg-card border-0 shadow-2xl rounded-2xl max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-cyan-400 flex items-center gap-2">
                <Eye className="w-5 h-5" /> Customer Details
              </DialogTitle>
              <DialogClose asChild>
                <button className="absolute right-4 top-4 text-muted-foreground text-2xl">×</button>
              </DialogClose>
            </DialogHeader>
            {viewCustomer && (
              <div className="space-y-2 pt-2">
                <Table>
                  <TableBody>
                    <TableRow><TableCell className="font-semibold">Name</TableCell><TableCell>{viewCustomer.name}</TableCell></TableRow>
                    <TableRow><TableCell className="font-semibold">Contact Person</TableCell><TableCell>{viewCustomer.contact_person}</TableCell></TableRow>
                    <TableRow><TableCell className="font-semibold">Email</TableCell><TableCell>{viewCustomer.email}</TableCell></TableRow>
                    <TableRow><TableCell className="font-semibold">Phone</TableCell><TableCell>{viewCustomer.phone}</TableCell></TableRow>
                    <TableRow><TableCell className="font-semibold">Address</TableCell><TableCell>{viewCustomer.address}</TableCell></TableRow>
                    <TableRow><TableCell className="font-semibold">City</TableCell><TableCell>{viewCustomer.city}</TableCell></TableRow>
                    <TableRow><TableCell className="font-semibold">State</TableCell><TableCell>{viewCustomer.state}</TableCell></TableRow>
                    <TableRow><TableCell className="font-semibold">Zip Code</TableCell><TableCell>{viewCustomer.zip_code}</TableCell></TableRow>
                    <TableRow><TableCell className="font-semibold">Country</TableCell><TableCell>{viewCustomer.country}</TableCell></TableRow>
                    <TableRow><TableCell className="font-semibold">Tax ID</TableCell><TableCell>{viewCustomer.tax_id}</TableCell></TableRow>
                    <TableRow><TableCell className="font-semibold">Payment Terms</TableCell><TableCell>{viewCustomer.payment_terms}</TableCell></TableRow>
                    <TableRow><TableCell className="font-semibold">Credit Limit</TableCell><TableCell>{viewCustomer.credit_limit}</TableCell></TableRow>
                    <TableRow><TableCell className="font-semibold">Price List ID</TableCell><TableCell>{viewCustomer.price_list_id}</TableCell></TableRow>
                    <TableRow><TableCell className="font-semibold">Active</TableCell><TableCell>{viewCustomer.is_active ? "Yes" : "No"}</TableCell></TableRow>
                    <TableRow><TableCell className="font-semibold">Created At</TableCell><TableCell>{viewCustomer.created_at ? new Date(viewCustomer.created_at).toLocaleString() : "-"}</TableCell></TableRow>
                  </TableBody>
                </Table>
              </div>
            )}
          </DialogContent>
        </Dialog>
        {/* Add/Edit Modal */}
        <Dialog open={showModal} onOpenChange={(open) => { setShowModal(open); if (!open) { setEditId(null); form.reset(defaultValues); } }}>
          <DialogContent className="bg-card border border-muted-foreground/20 shadow-2xl rounded-2xl max-w-lg w-full p-0">
            <div className="relative p-8">
              <button
                type="button"
                onClick={() => { setShowModal(false); setEditId(null); form.reset(defaultValues); }}
                className="absolute top-4 right-4 text-purple-400 hover:text-blue-400 rounded-full p-2 transition-colors"
                aria-label="Close"
              >
                <X size={24} />
              </button>
              <DialogHeader>
                <DialogTitle className="text-3xl font-extrabold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent mb-6 text-center tracking-tight">
                  {editId ? "Edit Customer" : "Add Customer"}
                </DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-0">
                  <div className="space-y-8 max-h-[60vh] overflow-y-auto pr-2">
                    {/* Contact Info Section */}
                    <div>
                      <div className="flex items-center gap-2 mb-1 text-xs font-semibold uppercase text-muted-foreground tracking-wider">
                        <User className="w-4 h-4 text-purple-400" /> Contact Info
                      </div>
                      <div className="text-lg font-bold text-purple-500 mb-3">Contact Information</div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField control={form.control} name="name" rules={{ required: "Name is required" }} render={({ field }) => (
                          <FormItem className="relative">
                            <FormLabel className="font-medium text-muted-foreground">Name *</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                required
                                placeholder="Enter customer name"
                                className="bg-muted dark:bg-[#181f3a] border border-muted-foreground/20 rounded-lg px-4 py-2 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 shadow-sm transition-all hover:border-blue-400"
                                onFocus={() => field.ref.current?.classList.add('ring-2', 'ring-purple-400')}
                                onBlur={() => field.ref.current?.classList.remove('ring-2', 'ring-purple-400')}
                                onError={() => field.ref.current?.classList.add('ring-2', 'ring-red-500')}
                                onValid={() => field.ref.current?.classList.remove('ring-2', 'ring-red-500')}
                              />
                            </FormControl>
                            <FormMessage className="flex items-center gap-1 text-red-500">
                              <X className="w-3 h-3" />{form.formState.errors.name?.message}
                            </FormMessage>
                          </FormItem>
                        )} />
                        <FormField control={form.control} name="contact_person" render={({ field }) => (
                          <FormItem className="relative">
                            <FormLabel className="font-medium text-muted-foreground">Contact Person</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="Enter contact person"
                                className="bg-muted dark:bg-[#181f3a] border border-muted-foreground/20 rounded-lg px-4 py-2 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 shadow-sm transition-all hover:border-blue-400"
                                onFocus={() => field.ref.current?.classList.add('ring-2', 'ring-purple-400')}
                                onBlur={() => field.ref.current?.classList.remove('ring-2', 'ring-purple-400')}
                                onError={() => field.ref.current?.classList.add('ring-2', 'ring-red-500')}
                                onValid={() => field.ref.current?.classList.remove('ring-2', 'ring-red-500')}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                        <FormField control={form.control} name="email" rules={{ pattern: { value: /^[^@\s]+@[^@\s]+\.[^@\s]+$/, message: "Invalid email" } }} render={({ field }) => (
                          <FormItem className="relative">
                            <FormLabel className="font-medium text-muted-foreground">Email</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="email"
                                placeholder="user@example.com"
                                className="bg-muted dark:bg-[#181f3a] border border-muted-foreground/20 rounded-lg px-4 py-2 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 shadow-sm transition-all hover:border-blue-400"
                                onFocus={() => field.ref.current?.classList.add('ring-2', 'ring-purple-400')}
                                onBlur={() => field.ref.current?.classList.remove('ring-2', 'ring-purple-400')}
                                onError={() => field.ref.current?.classList.add('ring-2', 'ring-red-500')}
                                onValid={() => field.ref.current?.classList.remove('ring-2', 'ring-red-500')}
                              />
                            </FormControl>
                            <FormMessage className="flex items-center gap-1 text-red-500">
                              <X className="w-3 h-3" />{form.formState.errors.email?.message}
                            </FormMessage>
                          </FormItem>
                        )} />
                        <FormField control={form.control} name="phone" render={({ field }) => (
                          <FormItem className="relative">
                            <FormLabel className="font-medium text-muted-foreground">Phone</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="Enter phone number"
                                className="bg-muted dark:bg-[#181f3a] border border-muted-foreground/20 rounded-lg px-4 py-2 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 shadow-sm transition-all hover:border-blue-400"
                                onFocus={() => field.ref.current?.classList.add('ring-2', 'ring-purple-400')}
                                onBlur={() => field.ref.current?.classList.remove('ring-2', 'ring-purple-400')}
                                onError={() => field.ref.current?.classList.add('ring-2', 'ring-red-500')}
                                onValid={() => field.ref.current?.classList.remove('ring-2', 'ring-red-500')}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                      </div>
                    </div>
                    <hr className="my-4 border-muted-foreground/20" />
                    {/* Address Section */}
                    <div>
                      <div className="flex items-center gap-2 mb-1 text-xs font-semibold uppercase text-muted-foreground tracking-wider">
                        <MapPin className="w-4 h-4 text-purple-400" /> Address
                      </div>
                      <div className="text-lg font-bold text-purple-500 mb-3">Address Details</div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField control={form.control} name="address" render={({ field }) => (
                          <FormItem className="relative">
                            <FormLabel className="font-medium text-muted-foreground">Address</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="Enter address"
                                className="bg-muted dark:bg-[#181f3a] border border-muted-foreground/20 rounded-lg px-4 py-2 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 shadow-sm transition-all hover:border-blue-400"
                                onFocus={() => field.ref.current?.classList.add('ring-2', 'ring-purple-400')}
                                onBlur={() => field.ref.current?.classList.remove('ring-2', 'ring-purple-400')}
                                onError={() => field.ref.current?.classList.add('ring-2', 'ring-red-500')}
                                onValid={() => field.ref.current?.classList.remove('ring-2', 'ring-red-500')}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                        <FormField control={form.control} name="city" render={({ field }) => (
                          <FormItem className="relative">
                            <FormLabel className="font-medium text-muted-foreground">City</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="Enter city"
                                className="bg-muted dark:bg-[#181f3a] border border-muted-foreground/20 rounded-lg px-4 py-2 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 shadow-sm transition-all hover:border-blue-400"
                                onFocus={() => field.ref.current?.classList.add('ring-2', 'ring-purple-400')}
                                onBlur={() => field.ref.current?.classList.remove('ring-2', 'ring-purple-400')}
                                onError={() => field.ref.current?.classList.add('ring-2', 'ring-red-500')}
                                onValid={() => field.ref.current?.classList.remove('ring-2', 'ring-red-500')}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                        <FormField control={form.control} name="state" render={({ field }) => (
                          <FormItem className="relative">
                            <FormLabel className="font-medium text-muted-foreground">State</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Enter state" className="bg-muted dark:bg-[#181f3a] border border-muted-foreground/20 rounded-lg px-4 py-2 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 shadow-sm transition-all hover:border-blue-400" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                        <FormField control={form.control} name="zip_code" render={({ field }) => (
                          <FormItem className="relative">
                            <FormLabel className="font-medium text-muted-foreground">Zip Code</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="Enter zip code"
                                className="bg-muted dark:bg-[#181f3a] border border-muted-foreground/20 rounded-lg px-4 py-2 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 shadow-sm transition-all hover:border-blue-400"
                                onFocus={() => field.ref.current?.classList.add('ring-2', 'ring-purple-400')}
                                onBlur={() => field.ref.current?.classList.remove('ring-2', 'ring-purple-400')}
                                onError={() => field.ref.current?.classList.add('ring-2', 'ring-red-500')}
                                onValid={() => field.ref.current?.classList.remove('ring-2', 'ring-red-500')}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                        <FormField control={form.control} name="country" render={({ field }) => (
                          <FormItem className="relative">
                            <FormLabel className="font-medium text-muted-foreground">Country</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Enter country" className="bg-muted dark:bg-[#181f3a] border border-muted-foreground/20 rounded-lg px-4 py-2 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 shadow-sm transition-all hover:border-blue-400" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                      </div>
                    </div>
                    <hr className="my-4 border-muted-foreground/20" />
                    {/* Financials Section */}
                    <div>
                      <div className="flex items-center gap-2 mb-1 text-xs font-semibold uppercase text-muted-foreground tracking-wider">
                        <CreditCard className="w-4 h-4 text-purple-400" /> Financials
                      </div>
                      <div className="text-lg font-bold text-purple-500 mb-3">Financial Details</div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField control={form.control} name="tax_id" render={({ field }) => (
                          <FormItem className="relative">
                            <FormLabel className="font-medium text-muted-foreground">Tax ID</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="Enter tax ID"
                                className="bg-muted dark:bg-[#181f3a] border border-muted-foreground/20 rounded-lg px-4 py-2 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 shadow-sm transition-all hover:border-blue-400"
                                onFocus={() => field.ref.current?.classList.add('ring-2', 'ring-purple-400')}
                                onBlur={() => field.ref.current?.classList.remove('ring-2', 'ring-purple-400')}
                                onError={() => field.ref.current?.classList.add('ring-2', 'ring-red-500')}
                                onValid={() => field.ref.current?.classList.remove('ring-2', 'ring-red-500')}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                        <FormField control={form.control} name="payment_terms" rules={{ pattern: { value: /^\d*$/, message: "Must be a number" } }} render={({ field }) => (
                          <FormItem className="relative">
                            <FormLabel className="font-medium text-muted-foreground">Payment Terms</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="number"
                                placeholder="e.g. 30"
                                className="bg-muted dark:bg-[#181f3a] border border-muted-foreground/20 rounded-lg px-4 py-2 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 shadow-sm transition-all hover:border-blue-400"
                                onFocus={() => field.ref.current?.classList.add('ring-2', 'ring-purple-400')}
                                onBlur={() => field.ref.current?.classList.remove('ring-2', 'ring-purple-400')}
                                onError={() => field.ref.current?.classList.add('ring-2', 'ring-red-500')}
                                onValid={() => field.ref.current?.classList.remove('ring-2', 'ring-red-500')}
                              />
                            </FormControl>
                            <div className="text-xs text-muted-foreground">Number of days for payment (e.g., 30)</div>
                            <FormMessage className="flex items-center gap-1 text-red-500">
                              <X className="w-3 h-3" />{form.formState.errors.payment_terms?.message}
                            </FormMessage>
                          </FormItem>
                        )} />
                        <FormField control={form.control} name="credit_limit" rules={{ pattern: { value: /^\d*\.?\d*$/, message: "Must be a number" } }} render={({ field }) => (
                          <FormItem className="relative">
                            <FormLabel className="font-medium text-muted-foreground">Credit Limit</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="number"
                                placeholder="e.g. 100000"
                                className="bg-muted dark:bg-[#181f3a] border border-muted-foreground/20 rounded-lg px-4 py-2 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 shadow-sm transition-all hover:border-blue-400"
                                onFocus={() => field.ref.current?.classList.add('ring-2', 'ring-purple-400')}
                                onBlur={() => field.ref.current?.classList.remove('ring-2', 'ring-purple-400')}
                                onError={() => field.ref.current?.classList.add('ring-2', 'ring-red-500')}
                                onValid={() => field.ref.current?.classList.remove('ring-2', 'ring-red-500')}
                              />
                            </FormControl>
                            <div className="text-xs text-muted-foreground">Maximum allowed credit (₹)</div>
                            <FormMessage className="flex items-center gap-1 text-red-500">
                              <X className="w-3 h-3" />{form.formState.errors.credit_limit?.message}
                            </FormMessage>
                          </FormItem>
                        )} />
                        <FormField control={form.control} name="price_list_id" render={({ field }) => (
                          <FormItem className="relative">
                            <FormLabel className="font-medium text-muted-foreground">Price List ID</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="Enter price list ID"
                                className="bg-muted dark:bg-[#181f3a] border border-muted-foreground/20 rounded-lg px-4 py-2 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 shadow-sm transition-all hover:border-blue-400"
                                onFocus={() => field.ref.current?.classList.add('ring-2', 'ring-purple-400')}
                                onBlur={() => field.ref.current?.classList.remove('ring-2', 'ring-purple-400')}
                                onError={() => field.ref.current?.classList.add('ring-2', 'ring-red-500')}
                                onValid={() => field.ref.current?.classList.remove('ring-2', 'ring-red-500')}
                              />
                            </FormControl>
                            <div className="text-xs text-muted-foreground">(Optional) Reference to price list</div>
                            <FormMessage />
                          </FormItem>
                        )} />
                      </div>
                    </div>
                  </div>
                  {/* Active toggle and actions */}
                  <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-4 border-t border-muted-foreground/10 mt-4">
                    <FormField control={form.control} name="is_active" render={({ field }) => (
                      <FormItem className="flex flex-row items-center gap-2">
                        <FormLabel className="mr-2 font-medium text-muted-foreground">Active</FormLabel>
                        <FormControl>
                          <input type="checkbox" checked={field.value} onChange={field.onChange} className="accent-cyan-500 w-5 h-5 transition-colors" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <div className="flex gap-2 w-full md:w-auto justify-end">
                      <Button type="button" variant="ghost" className="rounded-xl px-6 py-2 text-purple-500 dark:text-purple-300 border border-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/20 w-full md:w-auto" onClick={() => { setShowModal(false); setEditId(null); form.reset(defaultValues); }}>Cancel</Button>
                      <Button type="submit" className="bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold rounded-xl shadow-lg px-6 py-2 hover:from-purple-600 hover:to-blue-600 transition-all flex items-center gap-2 focus:ring-2 focus:ring-purple-400 w-full md:w-auto" disabled={submitting}>
                        {submitting && <Loader2 className="animate-spin w-5 h-5 mr-2" />}
                        {editId ? "Save Changes" : "Add Customer"}
                      </Button>
                    </div>
                  </div>
                </form>
              </Form>
            </div>
          </DialogContent>
        </Dialog>
        {/* Delete Confirmation Dialog */}
        <Dialog open={showDelete} onOpenChange={setShowDelete}>
          <DialogContent className="bg-card border-0 shadow-2xl rounded-2xl max-w-sm">
            <DialogHeader>
              <DialogTitle className="text-lg text-red-400 font-bold">Delete Customer</DialogTitle>
              <DialogClose asChild>
                <button className="absolute right-4 top-4 text-muted-foreground text-2xl">×</button>
              </DialogClose>
            </DialogHeader>
            <div className="py-4 text-foreground">Are you sure you want to deactivate this customer? This action cannot be undone.</div>
            <div className="flex gap-3 justify-end">
              <Button variant="ghost" onClick={() => setShowDelete(false)} className="text-blue-500 dark:text-blue-200">Cancel</Button>
              <Button variant="destructive" onClick={confirmDelete} disabled={submitting}>{submitting && <Loader2 className="animate-spin w-5 h-5 mr-2" />}Deactivate</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
} 