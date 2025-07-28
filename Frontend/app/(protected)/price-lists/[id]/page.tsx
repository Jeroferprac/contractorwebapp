'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  ArrowLeft,
  Edit,
  Plus,
  Search,
  Filter,
  Tag,
  DollarSign,
  Calendar,
  CheckCircle,
  XCircle,
  Package,
  Settings,
  Trash2,
  MoreHorizontal,
  FileText,
  TrendingUp,
  Star,
  Clock,
  User,
  MapPin,
  Phone,
  Mail,
  CreditCard,
  ShoppingCart,
  Eye,
  Save,
  X
} from 'lucide-react';

import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { getPriceList, updatePriceList, getPriceListItems, addPriceListItem, PriceList, PriceListItem, UpdatePriceListData, AddPriceListItemData } from '@/lib/priceList';

// Form validation schemas
const priceListSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  is_active: z.boolean().default(true),
});

const priceListItemSchema = z.object({
  product_id: z.string().min(1, 'Product is required'),
  unit_price: z.number().min(0, 'Price must be positive'),
  currency: z.string().min(1, 'Currency is required'),
});

type PriceListFormValues = z.infer<typeof priceListSchema>;
type PriceListItemFormValues = z.infer<typeof priceListItemSchema>;

export default function PriceListDetailPage({ params }: { params: { id: string } }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [priceList, setPriceList] = useState<PriceList | null>(null);
  const [priceListItems, setPriceListItems] = useState<PriceListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch] = useState('');

  const form = useForm<PriceListFormValues>({
    resolver: zodResolver(priceListSchema),
    defaultValues: {
      name: '',
      description: '',
      is_active: true,
    },
  });

  const itemForm = useForm<PriceListItemFormValues>({
    resolver: zodResolver(priceListItemSchema),
    defaultValues: {
      product_id: '',
      unit_price: 0,
      currency: 'USD',
    },
  });

  // Fetch price list and items
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [priceListData, itemsData] = await Promise.all([
        getPriceList(params.id),
        getPriceListItems(params.id)
      ]);
      
      setPriceList(priceListData);
      setPriceListItems(itemsData);
      
      // Set form values
      form.reset({
        name: priceListData.name || "",
        description: priceListData.description || "",
        is_active: priceListData.is_active ?? true,
      });
    } catch (err) {
      console.error('Error fetching price list data:', err);
      setError('Failed to load price list');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === 'authenticated') {
      fetchData();
    }
  }, [status, params.id]);

  // Handle unauthenticated state
  if (status === 'unauthenticated') {
    return (
      <DashboardLayout title="Price List Details">
        <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 to-gray-100 dark:from-slate-900 dark:via-slate-800 dark:to-gray-900 px-4 py-4">
          <div className="max-w-5xl mx-auto text-center">
            <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">
              Please sign in to access Price List Details
            </h1>
            <Button onClick={() => router.push('/login')}>
              Sign In
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Filter items
  const filteredItems = priceListItems.filter((item) => 
    item.product_name.toLowerCase().includes(search.toLowerCase())
  );

  // Handle edit submit
  const onSubmitEdit = async (values: PriceListFormValues) => {
    setSubmitting(true);
    try {
      console.log('Updating price list:', values);
      await updatePriceList(params.id, values);
      toast.success("Price list updated");
      setShowEditModal(false);
      await fetchData(); // Refresh data
    } catch (err: unknown) {
      console.error('Error updating price list:', err);
      const message = err instanceof Error ? err.message : String(err);
      toast.error(message || "Error updating price list");
    } finally {
      setSubmitting(false);
    }
  };

  // Handle add item submit
  const onSubmitAddItem = async (values: PriceListItemFormValues) => {
    setSubmitting(true);
    try {
      console.log('Adding price list item:', values);
      await addPriceListItem(params.id, values);
      toast.success("Item added to price list");
      setShowAddItemModal(false);
      itemForm.reset({
        product_id: '',
        unit_price: 0,
        currency: 'USD',
      });
      await fetchData(); // Refresh data
    } catch (err: unknown) {
      console.error('Error adding price list item:', err);
      const message = err instanceof Error ? err.message : String(err);
      toast.error(message || "Error adding item");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Price List Details">
        <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 to-gray-100 dark:from-slate-900 dark:via-slate-800 dark:to-gray-900 px-4 py-4">
          <div className="max-w-5xl mx-auto text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400 font-medium">Loading price list details...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !priceList) {
    return (
      <DashboardLayout title="Price List Details">
        <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 to-gray-100 dark:from-slate-900 dark:via-slate-800 dark:to-gray-900 px-4 py-4">
          <div className="max-w-5xl mx-auto text-center">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle className="w-8 h-8 text-red-500" />
            </div>
            <h1 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-2">Error Loading Price List</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-4">{error || 'Price list not found'}</p>
            <Button onClick={() => router.push('/price-lists')}>
              Back to Price Lists
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title={`Price List: ${priceList.name}`}>
      <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 to-gray-100 dark:from-slate-900 dark:via-slate-800 dark:to-gray-900 px-4 py-4">
        {/* Header */}
        <div className="max-w-7xl mx-auto mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/price-lists')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Price Lists
              </Button>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-3">
                  <Tag className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                  {priceList.name}
                </h1>
                <p className="text-base text-slate-600 dark:text-slate-300 mt-1">
                  Price List Details & Products
                </p>
              </div>
            </div>
            <Button
              onClick={() => setShowEditModal(true)}
              className="bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg hover:from-purple-600 hover:to-blue-600"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit Price List
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto">
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="products">Products ({priceListItems.length})</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium opacity-90">Total Products</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{priceListItems.length}</div>
                    <p className="text-xs opacity-75 mt-1">Items in this price list</p>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium opacity-90">Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      {priceList.is_active ? (
                        <>
                          <CheckCircle className="w-5 h-5" />
                          <span className="text-lg font-bold">Active</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-5 h-5" />
                          <span className="text-lg font-bold">Inactive</span>
                        </>
                      )}
                    </div>
                    <p className="text-xs opacity-75 mt-1">
                      {priceList.is_active ? 'Available for use' : 'Not available'}
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-r from-purple-600 to-purple-700 text-white">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium opacity-90">Created</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-lg font-bold">
                      {new Date(priceList.created_at).toLocaleDateString()}
                    </div>
                    <p className="text-xs opacity-75 mt-1">
                      {new Date(priceList.created_at).toLocaleTimeString()}
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-r from-orange-600 to-orange-700 text-white">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium opacity-90">Last Updated</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-lg font-bold">
                      {new Date(priceList.updated_at).toLocaleDateString()}
                    </div>
                    <p className="text-xs opacity-75 mt-1">
                      {new Date(priceList.updated_at).toLocaleTimeString()}
                    </p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-600" />
                    Price List Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Name</label>
                      <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">{priceList.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Status</label>
                      <div className="mt-1">
                        <Badge variant={priceList.is_active ? "default" : "secondary"}>
                          {priceList.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Description</label>
                    <p className="text-slate-900 dark:text-slate-100 mt-1">
                      {priceList.description || 'No description provided'}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Products Tab */}
            <TabsContent value="products" className="space-y-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Package className="w-5 h-5 text-blue-600" />
                    Products in Price List
                  </CardTitle>
                  <Button
                    onClick={() => setShowAddItemModal(true)}
                    className="bg-gradient-to-r from-purple-500 to-blue-500 text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Product
                  </Button>
                </CardHeader>
                <CardContent>
                  {/* Search Bar */}
                  <div className="mb-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        placeholder="Search products..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  {/* Products Table */}
                  {priceListItems.length === 0 ? (
                    <div className="text-center py-8">
                      <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No products added</h3>
                      <p className="text-gray-500 dark:text-gray-400 mb-4">
                        Add products to this price list to get started.
                      </p>
                      <Button
                        onClick={() => setShowAddItemModal(true)}
                        className="bg-gradient-to-r from-purple-500 to-blue-500 text-white"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add First Product
                      </Button>
                    </div>
                  ) : (
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Product</TableHead>
                            <TableHead>Unit Price</TableHead>
                            <TableHead>Currency</TableHead>
                            <TableHead>Added</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredItems.map((item) => (
                            <TableRow key={item.id}>
                              <TableCell>
                                <div className="flex items-center space-x-3">
                                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-blue-700 text-xs font-medium text-white">
                                    {item.product_name.charAt(0).toUpperCase()}
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                                      {item.product_name}
                                    </p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                      ID: {item.product_id}
                                    </p>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                                  ${item.unit_price.toFixed(2)}
                                </span>
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline">{item.currency}</Badge>
                              </TableCell>
                              <TableCell>
                                <div className="text-sm text-slate-500 dark:text-slate-400">
                                  {new Date(item.created_at).toLocaleDateString()}
                                </div>
                              </TableCell>
                              <TableCell className="text-right">
                                <Button variant="ghost" size="sm">
                                  <Eye className="w-4 h-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5 text-blue-600" />
                    Price List Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Price List ID</label>
                      <p className="text-sm text-slate-900 dark:text-slate-100 font-mono bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded mt-1">
                        {priceList.id}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Created At</label>
                      <p className="text-sm text-slate-900 dark:text-slate-100 mt-1">
                        {new Date(priceList.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Last Updated</label>
                    <p className="text-sm text-slate-900 dark:text-slate-100 mt-1">
                      {new Date(priceList.updated_at).toLocaleString()}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Edit Price List Modal */}
        <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Edit className="w-5 h-5 text-blue-600" />
                Edit Price List
              </DialogTitle>
              <DialogDescription>
                Update the price list information below.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmitEdit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter price list name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Enter price list description (optional)"
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="is_active"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Active Status</FormLabel>
                        <FormDescription>
                          Enable this price list for use
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowEditModal(false)}
                    disabled={submitting}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={submitting}>
                    {submitting ? 'Saving...' : 'Save Changes'}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        {/* Add Product Modal */}
        <Dialog open={showAddItemModal} onOpenChange={setShowAddItemModal}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-blue-600" />
                Add Product to Price List
              </DialogTitle>
              <DialogDescription>
                Add a new product with pricing to this price list.
              </DialogDescription>
            </DialogHeader>
            <Form {...itemForm}>
              <form onSubmit={itemForm.handleSubmit(onSubmitAddItem)} className="space-y-4">
                <FormField
                  control={itemForm.control}
                  name="product_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product ID *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter product ID" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={itemForm.control}
                  name="unit_price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Unit Price *</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.01" 
                          placeholder="0.00" 
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={itemForm.control}
                  name="currency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Currency *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select currency" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="USD">USD</SelectItem>
                          <SelectItem value="EUR">EUR</SelectItem>
                          <SelectItem value="GBP">GBP</SelectItem>
                          <SelectItem value="INR">INR</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowAddItemModal(false)}
                    disabled={submitting}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={submitting}>
                    {submitting ? 'Adding...' : 'Add Product'}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
} 