"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  ArrowLeft, 
  Edit, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  CreditCard, 
  Calendar,
  Building,
  FileText,
  DollarSign,
  Activity,
  Eye,
  Trash2,
  CheckCircle,
  XCircle,
  TrendingUp,
  Clock,
  AlertTriangle,
  Star
} from "lucide-react";
import { Customer } from "@/types/customer";
import { toast } from "sonner";
import { getCustomer, updateCustomer } from "@/lib/customer";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";

interface CustomerFormValues {
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
}

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

export default function CustomerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const customerId = params.customerId as string;
  
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [salesHistory, setSalesHistory] = useState([]);
  const [paymentHistory, setPaymentHistory] = useState([]);

  const form = useForm<CustomerFormValues>({ defaultValues });

  useEffect(() => {
    const fetchCustomerData = async () => {
      if (!customerId) return;
      
      setLoading(true);
      setError(null);
      
      try {
        console.log('Fetching customer data for ID:', customerId);
        const customerData = await getCustomer(customerId);
        console.log('Customer data fetched:', customerData);
        setCustomer(customerData);
        
        // Initialize form with customer data
        form.reset({
          name: customerData.name || "",
          contact_person: customerData.contact_person || "",
          email: customerData.email || "",
          phone: customerData.phone || "",
          address: customerData.address || "",
          city: customerData.city || "",
          state: customerData.state || "",
          zip_code: customerData.zip_code || "",
          country: customerData.country || "",
          tax_id: customerData.tax_id || "",
          payment_terms: customerData.payment_terms || 30,
          credit_limit: customerData.credit_limit || 0,
          price_list_id: customerData.price_list_id || "",
          is_active: customerData.is_active ?? true,
        });
      } catch (err) {
        console.error('Error fetching customer:', err);
        setError(err instanceof Error ? err.message : 'Failed to load customer');
      } finally {
        setLoading(false);
      }
    };

    fetchCustomerData();
  }, [customerId, form]);

  const handleEdit = () => {
    setShowEditModal(true);
  };

  const handleSubmit = async (values: CustomerFormValues) => {
    if (!customer) return;
    
    setSubmitting(true);
    try {
      console.log('Updating customer with values:', values);
      await updateCustomer(customer.id, values);
      toast.success("Customer updated successfully");
      
      // Refresh customer data
      const updatedCustomer = await getCustomer(customer.id);
      setCustomer(updatedCustomer);
      setShowEditModal(false);
    } catch (err) {
      console.error('Error updating customer:', err);
      toast.error(err instanceof Error ? err.message : 'Failed to update customer');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!customer) return;
    
    if (!confirm('Are you sure you want to deactivate this customer?')) return;
    
    try {
      await updateCustomer(customer.id, { is_active: false });
      toast.success("Customer deactivated");
      router.push('/customers');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to deactivate customer');
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive 
      ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white" 
      : "bg-gradient-to-r from-red-500 to-pink-500 text-white";
  };

  if (loading) {
    return (
      <DashboardLayout session={session} title="Customer Details">
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500 mx-auto mb-6"></div>
              <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">Loading Customer Details</h3>
              <p className="text-gray-500 dark:text-gray-400">Please wait while we fetch the information...</p>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !customer) {
    return (
      <DashboardLayout session={session} title="Customer Details">
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center max-w-md mx-auto">
              <div className="w-20 h-20 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertTriangle className="w-10 h-10 text-red-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Customer Not Found</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">{error || 'The customer you are looking for does not exist.'}</p>
              <Button 
                onClick={() => router.push('/customers')}
                className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Customers
              </Button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout session={session} title="Customer Details">
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="flex items-center gap-4">
                <Button 
                  variant="outline" 
                  onClick={() => router.push('/customers')}
                  className="flex items-center gap-2 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </Button>
                <div>
                  <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    {customer.name}
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400 mt-2">Customer Profile & Information</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Badge className={getStatusColor(customer.is_active ?? true)}>
                  {customer.is_active ? (
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
                </Badge>
                <Button 
                  onClick={handleEdit}
                  className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Customer
                </Button>
                <Button 
                  variant="destructive"
                  onClick={handleDelete}
                  className="shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Deactivate
                </Button>
              </div>
            </div>
          </div>

          {/* Quick Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg hover:shadow-xl transition-all duration-200">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm font-medium">Credit Limit</p>
                    <p className="text-2xl font-bold">{formatCurrency(customer.credit_limit || 0)}</p>
                  </div>
                  <CreditCard className="h-10 w-10 text-blue-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg hover:shadow-xl transition-all duration-200">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm font-medium">Payment Terms</p>
                    <p className="text-2xl font-bold">{customer.payment_terms || 0} days</p>
                  </div>
                  <Calendar className="h-10 w-10 text-green-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-200">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm font-medium">Location</p>
                    <p className="text-lg font-semibold">{customer.city || 'N/A'}</p>
                  </div>
                  <MapPin className="h-10 w-10 text-purple-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-lg hover:shadow-xl transition-all duration-200">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100 text-sm font-medium">Tax ID</p>
                    <p className="text-lg font-semibold">{customer.tax_id || 'N/A'}</p>
                  </div>
                  <FileText className="h-10 w-10 text-orange-200" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Card className="shadow-xl border-0 bg-white dark:bg-gray-800">
            <CardHeader className="border-b border-gray-200 dark:border-gray-700">
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-4 bg-gray-100 dark:bg-gray-700">
                  <TabsTrigger value="overview" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800">
                    <User className="w-4 h-4 mr-2" />
                    Overview
                  </TabsTrigger>
                  <TabsTrigger value="contact" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800">
                    <Mail className="w-4 h-4 mr-2" />
                    Contact Info
                  </TabsTrigger>
                  <TabsTrigger value="financial" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800">
                    <DollarSign className="w-4 h-4 mr-2" />
                    Financial
                  </TabsTrigger>
                  <TabsTrigger value="history" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800">
                    <Activity className="w-4 h-4 mr-2" />
                    History
                  </TabsTrigger>
                </TabsList>

                <div className="mt-6">
                  <TabsContent value="overview" className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <Card className="border-0 shadow-sm bg-gray-50 dark:bg-gray-700">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-lg">
                            <User className="w-5 h-5 text-purple-500" />
                            Basic Information
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Customer Name</label>
                              <p className="text-lg font-semibold text-gray-900 dark:text-white">{customer.name}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Contact Person</label>
                              <p className="text-lg text-gray-900 dark:text-white">{customer.contact_person || 'Not specified'}</p>
                            </div>
                          </div>
                          <Separator />
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Email Address</label>
                              <p className="text-lg text-gray-900 dark:text-white">{customer.email || 'Not specified'}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Phone Number</label>
                              <p className="text-lg text-gray-900 dark:text-white">{customer.phone || 'Not specified'}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="border-0 shadow-sm bg-gray-50 dark:bg-gray-700">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-lg">
                            <Star className="w-5 h-5 text-yellow-500" />
                            Customer Status
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Status</span>
                            <Badge className={getStatusColor(customer.is_active ?? true)}>
                              {customer.is_active ? 'Active' : 'Inactive'}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Customer ID</span>
                            <span className="text-sm font-mono text-gray-900 dark:text-white">{customer.id}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Created</span>
                            <span className="text-sm text-gray-900 dark:text-white">
                              {customer.created_at ? formatDate(customer.created_at) : 'N/A'}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value="contact" className="space-y-6">
                    <Card className="border-0 shadow-sm bg-gray-50 dark:bg-gray-700">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                          <MapPin className="w-5 h-5 text-blue-500" />
                          Address Information
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Full Address</label>
                          <p className="text-lg text-gray-900 dark:text-white">{customer.address || 'Not specified'}</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="text-sm font-medium text-gray-600 dark:text-gray-400">City</label>
                            <p className="text-lg text-gray-900 dark:text-white">{customer.city || 'Not specified'}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-600 dark:text-gray-400">State</label>
                            <p className="text-lg text-gray-900 dark:text-white">{customer.state || 'Not specified'}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-600 dark:text-gray-400">ZIP Code</label>
                            <p className="text-lg text-gray-900 dark:text-white">{customer.zip_code || 'Not specified'}</p>
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Country</label>
                          <p className="text-lg text-gray-900 dark:text-white">{customer.country || 'Not specified'}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="financial" className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <Card className="border-0 shadow-sm bg-gray-50 dark:bg-gray-700">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-lg">
                            <DollarSign className="w-5 h-5 text-green-500" />
                            Financial Information
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Credit Limit</label>
                              <p className="text-2xl font-bold text-green-600">{formatCurrency(customer.credit_limit || 0)}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Payment Terms</label>
                              <p className="text-2xl font-bold text-blue-600">{customer.payment_terms || 0} days</p>
                            </div>
                          </div>
                          <Separator />
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Tax ID</label>
                              <p className="text-lg text-gray-900 dark:text-white">{customer.tax_id || 'Not specified'}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Price List ID</label>
                              <p className="text-lg text-gray-900 dark:text-white">{customer.price_list_id || 'Not specified'}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="border-0 shadow-sm bg-gray-50 dark:bg-gray-700">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-lg">
                            <TrendingUp className="w-5 h-5 text-purple-500" />
                            Financial Summary
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                            <div>
                              <p className="text-sm font-medium text-green-600 dark:text-green-400">Available Credit</p>
                              <p className="text-xl font-bold text-green-700 dark:text-green-300">{formatCurrency(customer.credit_limit || 0)}</p>
                            </div>
                            <CreditCard className="w-8 h-8 text-green-500" />
                          </div>
                          <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                            <div>
                              <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Payment Terms</p>
                              <p className="text-xl font-bold text-blue-700 dark:text-blue-300">{customer.payment_terms || 0} days</p>
                            </div>
                            <Calendar className="w-8 h-8 text-blue-500" />
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value="history" className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <Card className="border-0 shadow-sm bg-gray-50 dark:bg-gray-700">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-lg">
                            <Activity className="w-5 h-5 text-orange-500" />
                            Sales History
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          {salesHistory.length > 0 ? (
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Date</TableHead>
                                  <TableHead>Amount</TableHead>
                                  <TableHead>Status</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {salesHistory.map((sale: any) => (
                                  <TableRow key={sale.id}>
                                    <TableCell>{new Date(sale.date).toLocaleDateString()}</TableCell>
                                    <TableCell>{formatCurrency(sale.amount)}</TableCell>
                                    <TableCell>{sale.status}</TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          ) : (
                            <div className="text-center py-8">
                              <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                              <p className="text-gray-500 dark:text-gray-400">No sales history available</p>
                            </div>
                          )}
                        </CardContent>
                      </Card>

                      <Card className="border-0 shadow-sm bg-gray-50 dark:bg-gray-700">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-lg">
                            <Clock className="w-5 h-5 text-green-500" />
                            Payment History
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          {paymentHistory.length > 0 ? (
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Date</TableHead>
                                  <TableHead>Amount</TableHead>
                                  <TableHead>Method</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {paymentHistory.map((payment: any) => (
                                  <TableRow key={payment.id}>
                                    <TableCell>{new Date(payment.date).toLocaleDateString()}</TableCell>
                                    <TableCell>{formatCurrency(payment.amount)}</TableCell>
                                    <TableCell>{payment.method}</TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          ) : (
                            <div className="text-center py-8">
                              <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                              <p className="text-gray-500 dark:text-gray-400">No payment history available</p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                </div>
              </Tabs>
            </CardHeader>
          </Card>
        </div>

        {/* Edit Modal */}
        <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white">Edit Customer</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    rules={{ required: "Name is required" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name *</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="contact_person"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact Person</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="zip_code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ZIP Code</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="tax_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tax ID</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="payment_terms"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Payment Terms (days)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="credit_limit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Credit Limit</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="price_list_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price List ID</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="is_active"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Active Customer</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />

                <div className="flex justify-end gap-3">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setShowEditModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={submitting}
                    className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                  >
                    {submitting ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
} 