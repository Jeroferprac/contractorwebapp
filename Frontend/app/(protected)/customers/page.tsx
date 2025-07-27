"use client";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useEffect, useState } from "react";
import { useCustomerStore } from "@/store/customerStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { User, MapPin, CreditCard, Loader2, Eye, Edit2, Plus, Users, UserCheck, UserX, UserPlus, AlertTriangle, Mail, Phone, Calendar, CheckCircle, XCircle, Search, Filter, FileText, Tag, Info, Hash } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Customer } from "@/types/customer";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
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

type CustomerFormValues = {
  name: string;
  contact_person?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  country?: string;
  tax_id?: string;
  payment_terms: number;
  credit_limit?: number;
  price_list_id?: string;
  is_active: boolean;
};

const defaultValues: CustomerFormValues = {
  name: "",
  contact_person: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  zip_code: "",
  country: "",
  tax_id: "",
  payment_terms: 30,
  credit_limit: 0,
  price_list_id: "",
  is_active: true,
};

export default function CustomersPage() {
  const { data: session } = useSession();
  const { customers, loading, error, fetchCustomers, createCustomer, updateCustomer } = useCustomerStore();
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [viewCustomer, setViewCustomer] = useState<Customer | null>(null);
  const [submitting, setSubmitting] = useState(false);
  // Filter state
  const [search, setSearch] = useState("");
  const [customerFilter, setCustomerFilter] = useState<string>("all");

  const form = useForm<CustomerFormValues>({ defaultValues });

  // Get user display name from session
  const getUserDisplayName = () => {
    if (session?.user?.name) {
      return session.user.name;
    } else if (session?.user?.email) {
      return session.user.email.split('@')[0]; // Use email prefix as name
    }
    return "User";
  };

  const userDisplayName = getUserDisplayName();

  useEffect(() => {
    console.log('Fetching customers...');
    fetchCustomers();
  }, [fetchCustomers]);

  // Filter customers based on search and filter criteria
  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = !search || 
      customer.name.toLowerCase().includes(search.toLowerCase()) ||
      customer.contact_person?.toLowerCase().includes(search.toLowerCase()) ||
      customer.email?.toLowerCase().includes(search.toLowerCase()) ||
      customer.phone?.toLowerCase().includes(search.toLowerCase());

    const matchesCustomerFilter = customerFilter === "all" || 
      (customerFilter === "active" && customer.is_active === true) ||
      (customerFilter === "inactive" && customer.is_active === false);

    return matchesSearch && matchesCustomerFilter;
  });

  // Handle Enter key for search
  const handleSearchKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      // Search is now instant, no need to call handleFilter
      e.preventDefault();
    }
  };

  // Open edit modal
  const handleEdit = (customer: Customer) => {
    setEditId(customer.id);
    form.reset({
      name: customer.name || "",
      contact_person: customer.contact_person || "",
      email: customer.email || "",
      phone: customer.phone || "",
      address: customer.address || "",
      city: customer.city || "",
      state: customer.state || "",
      zip_code: customer.zip_code || "",
      country: customer.country || "",
      tax_id: customer.tax_id || "",
      payment_terms: customer.payment_terms || 30,
      credit_limit: customer.credit_limit || 0,
      price_list_id: customer.price_list_id || "",
      is_active: customer.is_active ?? true,
    });
    setShowModal(true);
  };

  // Add or Edit submit
  const onSubmit = async (values: CustomerFormValues) => {
    setSubmitting(true);
    try {
      console.log('Submitting customer data:', values);
      console.log('Form values type:', typeof values);
      console.log('Form values keys:', Object.keys(values));
      
      // Log each field individually
      Object.entries(values).forEach(([key, value]) => {
        console.log(`${key}:`, value, `(type: ${typeof value})`);
      });
      
      // Transform data to ensure proper types
      const transformedData = {
        ...values,
        // Convert empty strings to undefined
        contact_person: values.contact_person || undefined,
        email: values.email || undefined,
        phone: values.phone || undefined,
        address: values.address || undefined,
        city: values.city || undefined,
        state: values.state || undefined,
        zip_code: values.zip_code || undefined,
        country: values.country || undefined,
        tax_id: values.tax_id || undefined,
        price_list_id: values.price_list_id || undefined,
        // Ensure numbers are properly typed
        payment_terms: values.payment_terms ? Number(values.payment_terms) : 30,
        credit_limit: values.credit_limit ? Number(values.credit_limit) : undefined,
        // Ensure boolean is properly typed
        is_active: Boolean(values.is_active)
      };
      
      console.log('Transformed data:', transformedData);
      
      if (editId) {
        console.log('Updating customer with ID:', editId);
        await updateCustomer(editId, transformedData);
        toast.success("Customer updated");
      } else {
        console.log('Creating new customer');
        await createCustomer(transformedData);
        toast.success("Customer added");
      }
      
      setShowModal(false);
      setEditId(null);
      form.reset(defaultValues);
      
      // Refresh the customer list
      console.log('Refreshing customer list');
      await fetchCustomers();
    } catch (err: unknown) {
      console.error('Error in onSubmit:', err);
      console.error('Error details:', {
        name: err instanceof Error ? err.name : 'Unknown',
        message: err instanceof Error ? err.message : String(err),
        stack: err instanceof Error ? err.stack : undefined
      });
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
      <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 to-gray-100 dark:from-slate-900 dark:via-slate-800 dark:to-gray-900 px-4 py-4">
        {/* Welcome Message - Moved to Top */}
        <div className="max-w-5xl mx-auto mb-6">
          <div className="text-center">
            <h1 className="text-2xl md:text-3xl font-bold flex items-center justify-center gap-3 text-slate-800 dark:text-slate-100 mb-2">
              <User className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              Welcome back, <span className="text-blue-600 dark:text-blue-400">{userDisplayName}!</span>
            </h1>
            <p className="text-base text-slate-600 dark:text-slate-300">Here are your customers and their details.</p>
          </div>
        </div>
        {/* Stat Cards Row */}
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
          <Card className="flex flex-row items-center gap-3 bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800 text-white shadow-lg hover:shadow-xl rounded-2xl px-4 py-3 transition-all duration-200">
            <div className="bg-white/20 dark:bg-white/10 rounded-full p-2"><Users className="w-5 h-5" /></div>
            <div>
              <div className="text-xs uppercase tracking-wider opacity-90">Total</div>
              <div className="text-xl font-bold">{total}</div>
            </div>
          </Card>
          <Card className="flex flex-row items-center gap-3 bg-gradient-to-r from-emerald-600 to-emerald-700 dark:from-emerald-700 dark:to-emerald-800 text-white shadow-lg hover:shadow-xl rounded-2xl px-4 py-3 transition-all duration-200">
            <div className="bg-white/20 dark:bg-white/10 rounded-full p-2"><UserCheck className="w-5 h-5" /></div>
            <div>
              <div className="text-xs uppercase tracking-wider opacity-90">Active</div>
              <div className="text-xl font-bold">{active}</div>
            </div>
          </Card>
          <Card className="flex flex-row items-center gap-3 bg-gradient-to-r from-amber-600 to-amber-700 dark:from-amber-700 dark:to-amber-800 text-white shadow-lg hover:shadow-xl rounded-2xl px-4 py-3 transition-all duration-200">
            <div className="bg-white/20 dark:bg-white/10 rounded-full p-2"><UserX className="w-5 h-5" /></div>
            <div>
              <div className="text-xs uppercase tracking-wider opacity-90">Inactive</div>
              <div className="text-xl font-bold">{inactive}</div>
            </div>
          </Card>
          <Card className="flex flex-row items-center gap-3 bg-gradient-to-r from-purple-600 to-purple-700 dark:from-purple-700 dark:to-purple-800 text-white shadow-lg hover:shadow-xl rounded-2xl px-4 py-3 transition-all duration-200">
            <div className="bg-white/20 dark:bg-white/10 rounded-full p-2"><UserPlus className="w-5 h-5" /></div>
            <div>
              <div className="text-xs uppercase tracking-wider opacity-90">New This Month</div>
              <div className="text-xl font-bold">{newThisMonth}</div>
            </div>
          </Card>
        </div>
        {/* Filter/Search Bar */}
        <div className="max-w-5xl mx-auto mb-4">
          <div className="flex items-center gap-3 bg-white dark:bg-slate-800 rounded-xl p-4 shadow-lg border border-slate-200 dark:border-slate-700">
            {/* All Customers Dropdown */}
            <div className="flex items-center gap-2">
              <Select value={customerFilter} onValueChange={setCustomerFilter}>
                <SelectTrigger className="bg-slate-100 dark:bg-slate-700 border-0 text-slate-700 dark:text-slate-200 rounded-lg px-4 py-2 font-medium shadow-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 min-w-[180px]">
                  <SelectValue placeholder={`All Customers (${customers.length})`} />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-slate-800 border-0 text-slate-700 dark:text-slate-200">
                  <SelectItem value="all">All Customers ({customers.length})</SelectItem>
                  <SelectItem value="active">Active Customers ({active})</SelectItem>
                  <SelectItem value="inactive">Inactive Customers ({inactive})</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Search Input */}
            <div className="flex-1">
              <Input
                placeholder="Search customers..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                onKeyDown={handleSearchKey}
                className="bg-slate-100 dark:bg-slate-700 border-0 text-slate-700 dark:text-slate-200 rounded-lg px-4 py-2 shadow-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 placeholder:text-slate-500 dark:placeholder:text-slate-400"
              />
            </div>

            {/* Filters Button */}
            <Button 
              variant="outline" 
              className="bg-slate-100 dark:bg-slate-700 border-0 text-slate-700 dark:text-slate-200 rounded-lg px-4 py-2 hover:bg-slate-200 dark:hover:bg-slate-600 shadow-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 flex items-center gap-2 transition-colors"
              onClick={() => {
                // Toggle advanced filters visibility or open filter modal
                console.log('Advanced filters clicked');
              }}
            >
              <Filter className="w-4 h-4" />
              Filters
            </Button>
          </div>
        </div>
        {/* Main Card/Table Section */}
        <Card className="max-w-7xl mx-auto bg-white dark:bg-slate-800 border-0 shadow-2xl rounded-3xl overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900">
            <CardTitle className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              Customer Directory
            </CardTitle>
            <Button onClick={handleAdd} className="bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg hover:from-purple-600 hover:to-blue-600 font-bold rounded-xl px-4 py-1.5 transition-all flex items-center gap-2 hover:shadow-xl transform hover:scale-105 text-sm pb-2">
              <Plus className="w-3 h-3" /> Add Customer
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="py-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto mb-3"></div>
                <p className="text-gray-600 dark:text-gray-400 font-medium text-sm">Loading customers...</p>
              </div>
            ) : error ? (
              <div className="py-8 text-center">
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <AlertTriangle className="w-6 h-6 text-red-500" />
                </div>
                <p className="text-red-600 dark:text-red-400 font-medium text-sm">{error}</p>
              </div>
            ) : customers.length === 0 ? (
              <div className="py-8 text-center">
                <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Users className="w-6 h-6 text-gray-400" />
                </div>
                <p className="text-gray-600 dark:text-gray-400 font-medium text-sm">No customers found</p>
                <p className="text-gray-500 dark:text-gray-500 text-xs mt-1">Add your first customer to get started</p>
              </div>
            ) : filteredCustomers.length === 0 ? (
              <div className="py-8 text-center">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Search className="w-6 h-6 text-blue-500" />
                </div>
                <p className="text-blue-600 dark:text-blue-400 font-medium text-sm">No customers match your filters</p>
                <p className="text-blue-500 dark:text-blue-500 text-xs mt-1">Try adjusting your search criteria</p>
              </div>
            ) : (
              <div className="w-full overflow-hidden">
                <div className="rounded-md border border-slate-200 dark:border-slate-700">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 border-b-2 border-slate-300 dark:border-slate-600">
                        <TableHead className="font-semibold text-slate-700 dark:text-slate-200 text-left py-4 px-4 uppercase tracking-wide text-xs">Customer</TableHead>
                        <TableHead className="font-semibold text-slate-700 dark:text-slate-200 text-left py-4 px-4 uppercase tracking-wide text-xs">Contact</TableHead>
                        <TableHead className="font-semibold text-slate-700 dark:text-slate-200 text-left py-4 px-4 uppercase tracking-wide text-xs">Location</TableHead>
                        <TableHead className="font-semibold text-slate-700 dark:text-slate-200 text-left py-4 px-4 uppercase tracking-wide text-xs">Financial</TableHead>
                        <TableHead className="font-semibold text-slate-700 dark:text-slate-200 text-center py-4 px-4 uppercase tracking-wide text-xs">Status</TableHead>
                        <TableHead className="font-semibold text-slate-700 dark:text-slate-200 text-center py-4 px-4 uppercase tracking-wide text-xs">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredCustomers.map((c) => (
                        <TableRow key={c.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors border-b border-slate-100 dark:border-slate-700">
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600 text-xs font-medium text-white">
                                {c.name.charAt(0).toUpperCase()}
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="text-sm font-medium leading-none text-slate-900 dark:text-slate-100">{c.name}</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                                  {c.contact_person || 'No contact'}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="flex items-center space-x-2">
                                <Mail className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                                <span className="text-sm break-all text-slate-700 dark:text-slate-300">
                                  {c.email || 'No email'}
                                </span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Phone className="h-3 w-3 text-purple-600 dark:text-purple-400" />
                                <span className="text-sm truncate max-w-[150px] text-slate-700 dark:text-slate-300">
                                  {c.phone || 'No phone'}
                                </span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="flex items-center space-x-2">
                                <MapPin className="h-3 w-3 text-green-600 dark:text-green-400" />
                                <span className="text-sm truncate max-w-[120px] text-slate-700 dark:text-slate-300">
                                  {c.city || 'No city'}
                                </span>
                              </div>
                              <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[120px]">
                                {c.state || 'No state'}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="flex items-center space-x-2">
                                <CreditCard className="h-3 w-3 text-orange-600 dark:text-orange-400" />
                                <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                                  ${(c.credit_limit || 0).toLocaleString()}
                                </span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Calendar className="h-3 w-3 text-indigo-600 dark:text-indigo-400" />
                                <span className="text-xs text-slate-500 dark:text-slate-400">
                                  {c.payment_terms || 0}d terms
                                </span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="flex justify-center">
                              <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                                c.is_active 
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                                  : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                              }`}>
                                {c.is_active ? (
                                  <>
                                    <CheckCircle className="mr-1 h-3 w-3" />
                                    Active
                                  </>
                                ) : (
                                  <>
                                    <XCircle className="mr-1 h-3 w-3" />
                                    Inactive
                                  </>
                                )}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="flex items-center justify-center space-x-1">
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                className="h-8 w-8 p-0" 
                                onClick={() => setViewCustomer(c)}
                              >
                                <Eye className="h-4 w-4" />
                                <span className="sr-only">View customer</span>
                              </Button>
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                className="h-8 w-8 p-0" 
                                onClick={() => handleEdit(c)}
                              >
                                <Edit2 className="h-4 w-4" />
                                <span className="sr-only">Edit customer</span>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        {/* View Details Modal */}
        <Dialog open={!!viewCustomer} onOpenChange={() => setViewCustomer(null)}>
          <DialogContent className="bg-white dark:bg-[#232946] border-0 shadow-2xl rounded-2xl max-w-4xl w-full p-0 overflow-hidden">
            <DialogTitle className="sr-only">Customer Details</DialogTitle>
            <div className="relative">
              {/* Header with gradient background */}
              <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-4 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                      <Users className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">{viewCustomer?.name}</h2>
                      <p className="text-purple-100 text-sm">Customer Details</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      viewCustomer?.is_active 
                        ? 'bg-green-500/20 text-green-100' 
                        : 'bg-red-500/20 text-red-100'
                    }`}>
                      {viewCustomer?.is_active ? (
                        <>
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Active
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3 h-3 mr-1" />
                          Inactive
                        </>
                      )}
                    </span>
                  </div>
                </div>
              </div>

              {/* Content */}
              {viewCustomer && (
                <div className="p-3">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                    {/* Contact Information */}
                    <Card className="border-0 shadow-sm">
                      <CardHeader className="pb-1 pt-3 px-3">
                        <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                          <User className="w-3 h-3 text-purple-500" />
                          Contact Information
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-1 px-3 pb-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 p-1.5 bg-muted/30 rounded-md">
                            <div className="w-6 h-6 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                              <User className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs text-muted-foreground">Contact Person</p>
                              <p className="text-sm font-medium truncate">{viewCustomer.contact_person || 'Not specified'}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 p-1.5 bg-muted/30 rounded-md">
                            <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                              <Mail className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs text-muted-foreground">Email</p>
                              <p className="text-sm font-medium truncate">{viewCustomer.email || 'Not specified'}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 p-1.5 bg-muted/30 rounded-md">
                            <div className="w-6 h-6 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                              <Phone className="w-3 h-3 text-green-600 dark:text-green-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs text-muted-foreground">Phone</p>
                              <p className="text-sm font-medium truncate">{viewCustomer.phone || 'Not specified'}</p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Address Information */}
                    <Card className="border-0 shadow-sm">
                      <CardHeader className="pb-1 pt-3 px-3">
                        <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                          <MapPin className="w-3 h-3 text-purple-500" />
                          Address Information
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-1 px-3 pb-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 p-1.5 bg-muted/30 rounded-md">
                            <div className="w-6 h-6 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center">
                              <MapPin className="w-3 h-3 text-orange-600 dark:text-orange-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs text-muted-foreground">Address</p>
                              <p className="text-sm font-medium truncate">{viewCustomer.address || 'Not specified'}</p>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-1">
                            <div className="p-1.5 bg-muted/30 rounded-md">
                              <p className="text-xs text-muted-foreground">City</p>
                              <p className="text-sm font-medium truncate">{viewCustomer.city || 'Not specified'}</p>
                            </div>
                            <div className="p-1.5 bg-muted/30 rounded-md">
                              <p className="text-xs text-muted-foreground">State</p>
                              <p className="text-sm font-medium truncate">{viewCustomer.state || 'Not specified'}</p>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-1">
                            <div className="p-1.5 bg-muted/30 rounded-md">
                              <p className="text-xs text-muted-foreground">Zip Code</p>
                              <p className="text-sm font-medium truncate">{viewCustomer.zip_code || 'Not specified'}</p>
                            </div>
                            <div className="p-1.5 bg-muted/30 rounded-md">
                              <p className="text-xs text-muted-foreground">Country</p>
                              <p className="text-sm font-medium truncate">{viewCustomer.country || 'Not specified'}</p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Financial Information */}
                    <Card className="border-0 shadow-sm">
                      <CardHeader className="pb-1 pt-3 px-3">
                        <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                          <CreditCard className="w-3 h-3 text-purple-500" />
                          Financial Information
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-1 px-3 pb-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 p-1.5 bg-muted/30 rounded-md">
                            <div className="w-6 h-6 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                              <CreditCard className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs text-muted-foreground">Credit Limit</p>
                              <p className="text-sm font-medium">${(viewCustomer.credit_limit || 0).toLocaleString()}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 p-1.5 bg-muted/30 rounded-md">
                            <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                              <Calendar className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs text-muted-foreground">Payment Terms</p>
                              <p className="text-sm font-medium">{viewCustomer.payment_terms || 0} days</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 p-1.5 bg-muted/30 rounded-md">
                            <div className="w-6 h-6 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                              <FileText className="w-3 h-3 text-green-600 dark:text-green-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs text-muted-foreground">Tax ID</p>
                              <p className="text-sm font-medium truncate">{viewCustomer.tax_id || 'Not specified'}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 p-1.5 bg-muted/30 rounded-md">
                            <div className="w-6 h-6 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center">
                              <Tag className="w-3 h-3 text-orange-600 dark:text-orange-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs text-muted-foreground">Price List ID</p>
                              <p className="text-sm font-medium truncate">{viewCustomer.price_list_id || 'Not specified'}</p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Additional Information */}
                    <Card className="border-0 shadow-sm">
                      <CardHeader className="pb-1 pt-3 px-3">
                        <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                          <Info className="w-3 h-3 text-purple-500" />
                          Additional Information
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-1 px-3 pb-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 p-1.5 bg-muted/30 rounded-md">
                            <div className="w-6 h-6 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                              <Calendar className="w-3 h-3 text-gray-600 dark:text-gray-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs text-muted-foreground">Created At</p>
                              <p className="text-sm font-medium truncate">
                                {viewCustomer.created_at ? new Date(viewCustomer.created_at).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric'
                                }) : 'Not available'}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 p-1.5 bg-muted/30 rounded-md">
                            <div className="w-6 h-6 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                              <Hash className="w-3 h-3 text-gray-600 dark:text-gray-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs text-muted-foreground">Customer ID</p>
                              <p className="text-sm font-medium truncate">{viewCustomer.id}</p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
        {/* Add/Edit Modal */}
        <Dialog open={showModal} onOpenChange={(open) => { setShowModal(open); if (!open) { setEditId(null); form.reset(defaultValues); } }}>
          <DialogContent className="bg-card border border-muted-foreground/20 shadow-2xl rounded-2xl max-w-lg w-full p-0">
            <div className="relative p-8">

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
                              />
                            </FormControl>
                            <FormMessage className="text-red-500">
                              {form.formState.errors.name?.message}
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
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                        <FormField control={form.control} name="email" render={({ field }) => (
                          <FormItem className="relative">
                            <FormLabel className="font-medium text-muted-foreground">Email</FormLabel>
                            <FormControl>
                              <Input
                                type="email"
                                {...field}
                                placeholder="Enter email address"
                                className="bg-muted dark:bg-[#181f3a] border border-muted-foreground/20 rounded-lg px-4 py-2 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 shadow-sm transition-all hover:border-blue-400"
                              />
                            </FormControl>
                            <FormMessage />
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
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                        <FormField control={form.control} name="payment_terms" render={({ field }) => (
                          <FormItem className="relative">
                            <FormLabel className="font-medium text-muted-foreground">Payment Terms (days)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                {...field}
                                placeholder="Enter payment terms"
                                onChange={(e) => field.onChange(Number(e.target.value))}
                                className="bg-muted dark:bg-[#181f3a] border border-muted-foreground/20 rounded-lg px-4 py-2 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 shadow-sm transition-all hover:border-blue-400"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                        <FormField control={form.control} name="credit_limit" render={({ field }) => (
                          <FormItem className="relative">
                            <FormLabel className="font-medium text-muted-foreground">Credit Limit</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                {...field}
                                placeholder="Enter credit limit"
                                onChange={(e) => field.onChange(Number(e.target.value))}
                                className="bg-muted dark:bg-[#181f3a] border border-muted-foreground/20 rounded-lg px-4 py-2 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 shadow-sm transition-all hover:border-blue-400"
                              />
                            </FormControl>
                            <FormMessage />
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
                      <Button type="submit" className="bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg hover:from-purple-600 hover:to-blue-600 font-bold rounded-xl px-6 py-2 transition-all flex items-center gap-2 focus:ring-2 focus:ring-purple-400 w-full md:w-auto" disabled={submitting}>
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
      </div>
    </DashboardLayout>
  );
} 