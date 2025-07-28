'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Plus,
  Search,
  Edit,
  Eye,
  Tag,
  DollarSign,
  Calendar,
  CheckCircle,
  XCircle,
  FileText,
  TrendingUp,
  MoreVertical,
  Download,
  Share2,
  Trash2,
  FileDown,
  Filter
} from 'lucide-react';

import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';

import { PriceList } from '@/lib/priceList';
import { usePriceListStore } from '@/store/priceListStore';

// Form validation schema
const priceListSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  currency: z.string().default('USD'),
  is_active: z.boolean().default(true),
});

type PriceListFormValues = z.infer<typeof priceListSchema>;

export default function PriceListsPage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  
  const { priceLists, loading, fetchPriceLists, createPriceList, updatePriceList } = usePriceListStore();
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currencyFilter, setCurrencyFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');

  const form = useForm<PriceListFormValues>({
    resolver: zodResolver(priceListSchema),
    defaultValues: {
      name: '',
      description: '',
      currency: 'USD',
      is_active: true,
    },
  });

  useEffect(() => {
    console.log(' Price Lists Debug:');
    console.log('- Status:', status);
    console.log('- Session:', session);
    console.log('- Backend Token:', session?.user?.backendToken);
    console.log('- Token exists:', !!session?.user?.backendToken);
    
    if (status === 'authenticated') {
      if (session?.user?.backendToken) {
        console.log('✅ Fetching price lists...');
        const timer = setTimeout(() => {
          fetchPriceLists();
        }, 100);
        return () => clearTimeout(timer);
      } else {
        console.log('❌ No backend token, trying to refresh session...');
        update();
      }
    } else if (status === 'unauthenticated') {
      console.log('❌ User not authenticated, redirecting to login');
      router.push('/login');
    } else if (status === 'loading') {
      console.log('⏳ Session loading...');
    }
  }, [status, session, fetchPriceLists, router, update]);

  // Handle loading state
  if (status === 'loading') {
    return (
      <DashboardLayout title="Price Lists">
        <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 to-gray-100 dark:from-slate-900 dark:via-slate-800 dark:to-gray-900 px-4 py-4">
          <div className="max-w-7xl mx-auto text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto mb-3"></div>
            <p className="text-gray-600 dark:text-gray-400 font-medium text-sm">Loading session...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Handle unauthenticated state
  if (status === 'unauthenticated') {
    return (
      <DashboardLayout title="Price Lists">
        <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 to-gray-100 dark:from-slate-900 dark:via-slate-800 dark:to-gray-900 px-4 py-4">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">
              Please sign in to access Price Lists
            </h1>
            <Button onClick={() => router.push('/login')}>
              Sign In
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Filter price lists
  const filteredPriceLists = (priceLists || []).filter((pl) => {
    const matchesSearch = pl.name.toLowerCase().includes(search.toLowerCase()) ||
                         (pl.description && pl.description.toLowerCase().includes(search.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && pl.is_active) ||
                         (statusFilter === 'inactive' && !pl.is_active);
    
    const matchesCurrency = currencyFilter === 'all' || pl.currency === currencyFilter;
    
    const matchesDate = dateFilter === 'all' || (() => {
      const createdDate = new Date(pl.created_at);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - createdDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      switch (dateFilter) {
        case 'today': return diffDays === 0;
        case 'week': return diffDays <= 7;
        case 'month': return diffDays <= 30;
        case 'quarter': return diffDays <= 90;
        default: return true;
      }
    })();
    
    return matchesSearch && matchesStatus && matchesCurrency && matchesDate;
  });

  // Handle search key
  const handleSearchKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };

  // Open edit modal
  const handleEdit = (priceList: PriceList) => {
    setEditId(priceList.id);
    form.reset({
      name: priceList.name || "",
      description: priceList.description || "",
      currency: priceList.currency || "USD",
      is_active: priceList.is_active ?? true,
    });
    setShowModal(true);
  };

  // Add or Edit submit
  const onSubmit = async (values: PriceListFormValues) => {
    setSubmitting(true);
    try {
      if (editId) {
        await updatePriceList(editId, values);
        toast.success("Price list updated");
      } else {
        await createPriceList(values);
        toast.success("Price list added");
      }
      
      setShowModal(false);
      setEditId(null);
      form.reset();
    } catch (err: unknown) {
      console.error('Error in onSubmit:', err);
      const message = err instanceof Error ? err.message : String(err);
      toast.error(message || "Error saving price list");
    } finally {
      setSubmitting(false);
    }
  };

  // Open add modal
  const handleAdd = () => {
    setEditId(null);
    form.reset({
      name: '',
      description: '',
      currency: 'USD',
      is_active: true,
    });
    setShowModal(true);
  };

  // View price list details
  const handleView = (priceList: PriceList) => {
    router.push(`/price-lists/${priceList.id}`);
  };

  // Handle delete
  const handleDelete = async (priceListId: string) => {
    if (confirm('Are you sure you want to delete this price list?')) {
      try {
        // Note: deletePriceList function needs to be added to the store
        toast.success("Price list deleted");
      } catch (err) {
        toast.error("Failed to delete price list");
      }
    }
  };

  // Handle export CSV
  const handleExportCSV = () => {
    if (!priceLists || priceLists.length === 0) {
      toast.error("No price lists to export");
      return;
    }

    const headers = ['Name', 'Description', 'Currency', 'Status', 'Created Date', 'ID'];
    const csvContent = [
      headers.join(','),
      ...priceLists.map(pl => [
        `"${pl.name}"`,
        `"${pl.description || ''}"`,
        pl.currency,
        pl.is_active ? 'Active' : 'Inactive',
        new Date(pl.created_at).toLocaleDateString(),
        pl.id
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `price-lists-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    toast.success("Price lists exported to CSV");
  };

  // Stat calculations
  const total = priceLists?.length || 0;
  const active = priceLists?.filter(pl => pl.is_active).length || 0;
  const inactive = priceLists?.filter(pl => !pl.is_active).length || 0;
  const newThisMonth = priceLists?.filter(pl => pl.created_at && (new Date().getTime() - new Date(pl.created_at).getTime()) < 30 * 24 * 60 * 60 * 1000).length || 0;

  return (
    <DashboardLayout title="Price Lists">
      <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 to-gray-100 dark:from-slate-900 dark:via-slate-800 dark:to-gray-900 px-4 py-6">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">
                  Price Lists
                </h1>
                <p className="text-slate-600 dark:text-slate-300">
                  Manage your pricing strategies and product catalogs
                </p>
              </div>
              <Button onClick={handleAdd} className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg">
                <Plus className="w-4 h-4 mr-2" />
                New Price List
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
            <Card className="bg-gradient-to-br from-purple-500 via-purple-600 to-purple-700 text-white border-0 shadow-sm hover:shadow-md hover:scale-101 transition-all duration-300 cursor-pointer group">
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-xs font-medium mb-1">Total Lists</p>
                    <p className="text-xl font-bold">{total}</p>
                    <p className="text-purple-200 text-xs">All price lists</p>
                  </div>
                  <div className="bg-white/20 rounded-md p-1.5 group-hover:bg-white/30 group-hover:scale-110 transition-all duration-300">
                    <FileText className="w-4 h-4" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-emerald-500 via-emerald-600 to-emerald-700 text-white border-0 shadow-sm hover:shadow-md hover:scale-101 transition-all duration-300 cursor-pointer group">
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-emerald-100 text-xs font-medium mb-1">Active</p>
                    <p className="text-xl font-bold">{active}</p>
                    <p className="text-emerald-200 text-xs">Currently active</p>
                  </div>
                  <div className="bg-white/20 rounded-md p-1.5 group-hover:bg-white/30 group-hover:scale-110 transition-all duration-300">
                    <CheckCircle className="w-4 h-4" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 text-white border-0 shadow-sm hover:shadow-md hover:scale-101 transition-all duration-300 cursor-pointer group">
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-amber-100 text-xs font-medium mb-1">Inactive</p>
                    <p className="text-xl font-bold">{inactive}</p>
                    <p className="text-amber-200 text-xs">Currently inactive</p>
                  </div>
                  <div className="bg-white/20 rounded-md p-1.5 group-hover:bg-white/30 group-hover:scale-110 transition-all duration-300">
                    <XCircle className="w-4 h-4" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 text-white border-0 shadow-sm hover:shadow-md hover:scale-101 transition-all duration-300 cursor-pointer group">
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-xs font-medium mb-1">New This Month</p>
                    <p className="text-xl font-bold">{newThisMonth}</p>
                    <p className="text-blue-200 text-xs">Recently created</p>
                  </div>
                  <div className="bg-white/20 rounded-md p-1.5 group-hover:bg-white/30 group-hover:scale-110 transition-all duration-300">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search, Filters, and Export Section */}
          <Card className="mb-6 border-0 shadow-lg bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center">
                {/* Search Bar */}
                <div className="flex-1 max-w-md">
                  <div className="relative group">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-indigo-500 transition-colors duration-200" />
                    <Input
                      placeholder="Search price lists..."
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                      onKeyDown={handleSearchKey}
                      className="pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-400 dark:focus:border-indigo-400 transition-all duration-300 rounded-xl text-base font-medium shadow-sm hover:shadow-md"
                    />
                  </div>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-4">
                  {/* Status Filter */}
                  <div className="relative group">
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-44 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 rounded-xl px-4 py-3 text-base font-medium shadow-sm hover:shadow-md transition-all duration-200 group-hover:border-gray-300 dark:group-hover:border-gray-500">
                        <Filter className="w-4 h-4 mr-3 text-gray-500 group-hover:text-indigo-500 transition-colors duration-200" />
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-2 border-gray-200 dark:border-gray-600 shadow-lg">
                        <SelectItem value="all" className="py-3 px-4 hover:bg-gray-50 dark:hover:bg-gray-700">All Status</SelectItem>
                        <SelectItem value="active" className="py-3 px-4 hover:bg-gray-50 dark:hover:bg-gray-700">Active</SelectItem>
                        <SelectItem value="inactive" className="py-3 px-4 hover:bg-gray-50 dark:hover:bg-gray-700">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Currency Filter */}
                  <div className="relative group">
                    <Select value={currencyFilter} onValueChange={setCurrencyFilter}>
                      <SelectTrigger className="w-44 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 rounded-xl px-4 py-3 text-base font-medium shadow-sm hover:shadow-md transition-all duration-200 group-hover:border-gray-300 dark:group-hover:border-gray-500">
                        <DollarSign className="w-4 h-4 mr-3 text-gray-500 group-hover:text-indigo-500 transition-colors duration-200" />
                        <SelectValue placeholder="Currency" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-2 border-gray-200 dark:border-gray-600 shadow-lg">
                        <SelectItem value="all" className="py-3 px-4 hover:bg-gray-50 dark:hover:bg-gray-700">All Currencies</SelectItem>
                        <SelectItem value="USD" className="py-3 px-4 hover:bg-gray-50 dark:hover:bg-gray-700">USD</SelectItem>
                        <SelectItem value="EUR" className="py-3 px-4 hover:bg-gray-50 dark:hover:bg-gray-700">EUR</SelectItem>
                        <SelectItem value="GBP" className="py-3 px-4 hover:bg-gray-50 dark:hover:bg-gray-700">GBP</SelectItem>
                        <SelectItem value="INR" className="py-3 px-4 hover:bg-gray-50 dark:hover:bg-gray-700">INR</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Date Filter */}
                  <div className="relative group">
                    <Select value={dateFilter} onValueChange={setDateFilter}>
                      <SelectTrigger className="w-44 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 rounded-xl px-4 py-3 text-base font-medium shadow-sm hover:shadow-md transition-all duration-200 group-hover:border-gray-300 dark:group-hover:border-gray-500">
                        <Calendar className="w-4 h-4 mr-3 text-gray-500 group-hover:text-indigo-500 transition-colors duration-200" />
                        <SelectValue placeholder="Date Range" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-2 border-gray-200 dark:border-gray-600 shadow-lg">
                        <SelectItem value="all" className="py-3 px-4 hover:bg-gray-50 dark:hover:bg-gray-700">All Time</SelectItem>
                        <SelectItem value="today" className="py-3 px-4 hover:bg-gray-50 dark:hover:bg-gray-700">Today</SelectItem>
                        <SelectItem value="week" className="py-3 px-4 hover:bg-gray-50 dark:hover:bg-gray-700">This Week</SelectItem>
                        <SelectItem value="month" className="py-3 px-4 hover:bg-gray-50 dark:hover:bg-gray-700">This Month</SelectItem>
                        <SelectItem value="quarter" className="py-3 px-4 hover:bg-gray-50 dark:hover:bg-gray-700">This Quarter</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Export Button */}
                <div className="flex gap-3">
                  <Button
                    onClick={() => handleExportCSV()}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 px-6 py-3 rounded-xl font-semibold text-base"
                  >
                    <FileDown className="w-5 h-5 mr-2" />
                    Export CSV
                  </Button>
                  
                  {/* Clear Filters Button */}
                  {(statusFilter !== 'all' || currencyFilter !== 'all' || dateFilter !== 'all') && (
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setStatusFilter('all');
                        setCurrencyFilter('all');
                        setDateFilter('all');
                      }}
                      className="border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-400 dark:hover:border-gray-500 px-6 py-3 rounded-xl font-semibold text-base transition-all duration-200"
                    >
                      Clear Filters
                    </Button>
                  )}
                </div>
              </div>

              {/* Active Filters Display */}
              {(statusFilter !== 'all' || currencyFilter !== 'all' || dateFilter !== 'all') && (
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Active filters:</span>
                    {statusFilter !== 'all' && (
                      <Badge variant="secondary" className="bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400 px-3 py-1 rounded-full font-medium">
                        Status: {statusFilter}
                      </Badge>
                    )}
                    {currencyFilter !== 'all' && (
                      <Badge variant="secondary" className="bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400 px-3 py-1 rounded-full font-medium">
                        Currency: {currencyFilter}
                      </Badge>
                    )}
                    {dateFilter !== 'all' && (
                      <Badge variant="secondary" className="bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400 px-3 py-1 rounded-full font-medium">
                        Date: {dateFilter}
                      </Badge>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Content */}
          {loading ? (
            <Card className="border-0 shadow-lg">
              <CardContent className="p-12 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
                <p className="text-gray-600 dark:text-gray-400">Loading price lists...</p>
              </CardContent>
            </Card>
          ) : !priceLists || priceLists.length === 0 ? (
            <Card className="border-0 shadow-lg">
              <CardContent className="p-12 text-center">
                <Tag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">No price lists yet</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">Create your first price list to get started</p>
                <Button onClick={handleAdd} className="bg-gradient-to-r from-purple-600 to-blue-600">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Price List
                </Button>
              </CardContent>
            </Card>
          ) : filteredPriceLists.length === 0 ? (
            <Card className="border-0 shadow-lg">
              <CardContent className="p-12 text-center">
                <Search className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">No results found</h3>
                <p className="text-gray-600 dark:text-gray-400">Try adjusting your search</p>
              </CardContent>
            </Card>
          ) : (
            // Table View
            <Card className="border-0 shadow-lg">
              <CardHeader className="border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
                <CardTitle className="flex items-center gap-2 text-gray-800 dark:text-gray-100">
                  <Tag className="w-5 h-5 text-indigo-600" />
                  Price Lists ({filteredPriceLists.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                      <TableHead className="font-semibold text-gray-700 dark:text-gray-200 py-4 px-6">Price List</TableHead>
                      <TableHead className="font-semibold text-gray-700 dark:text-gray-200 py-4 px-6">Description</TableHead>
                      <TableHead className="font-semibold text-gray-700 dark:text-gray-200 py-4 px-6">Currency</TableHead>
                      <TableHead className="font-semibold text-gray-700 dark:text-gray-200 py-4 px-6">Status</TableHead>
                      <TableHead className="font-semibold text-gray-700 dark:text-gray-200 py-4 px-6">Created</TableHead>
                      <TableHead className="font-semibold text-gray-700 dark:text-gray-200 text-center py-4 px-6">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPriceLists.map((pl, index) => (
                      <TableRow 
                        key={pl.id} 
                        className={`hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                          index % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-gray-50/50 dark:bg-gray-800/50'
                        }`}
                      >
                        <TableCell className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center text-white font-semibold shadow-sm">
                              {pl.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900 dark:text-gray-100">{pl.name}</p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">ID: {pl.id}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="py-4 px-6">
                          <p className="text-sm text-gray-600 dark:text-gray-300 max-w-xs">
                            {pl.description || 'No description'}
                          </p>
                        </TableCell>
                        <TableCell className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="font-medium text-gray-900 dark:text-gray-100">{pl.currency}</span>
                          </div>
                        </TableCell>
                        <TableCell className="py-4 px-6">
                          <Badge 
                            variant={pl.is_active ? "default" : "secondary"}
                            className={`${
                              pl.is_active 
                                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                                : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
                            }`}
                          >
                            {pl.is_active ? (
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
                        </TableCell>
                        <TableCell className="py-4 px-6">
                          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(pl.created_at).toLocaleDateString()}</span>
                          </div>
                        </TableCell>
                        <TableCell className="py-4 px-6 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleView(pl)}
                              className="h-8 w-8 p-0 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4 text-blue-600" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(pl)}
                              className="h-8 w-8 p-0 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-md"
                              title="Edit"
                            >
                              <Edit className="w-4 h-4 text-green-600" />
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="h-8 w-8 p-0 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md"
                                  title="More Options"
                                >
                                  <MoreVertical className="w-4 h-4 text-gray-600" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuItem className="cursor-pointer">
                                  <Download className="w-4 h-4 mr-2" />
                                  Export
                                </DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer">
                                  <Share2 className="w-4 h-4 mr-2" />
                                  Share
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  onClick={() => handleDelete(pl.id)}
                                  className="text-red-600 dark:text-red-400 cursor-pointer"
                                >
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          {/* Add/Edit Modal */}
          <Dialog open={showModal} onOpenChange={setShowModal}>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Tag className="w-5 h-5 text-purple-600" />
                  {editId ? 'Edit Price List' : 'Create New Price List'}
                </DialogTitle>
                <DialogDescription>
                  {editId ? 'Update the price list information below.' : 'Create a new price list with the information below.'}
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                    name="currency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Currency</FormLabel>
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
                      onClick={() => setShowModal(false)}
                      disabled={submitting}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={submitting} className="bg-gradient-to-r from-purple-600 to-blue-600">
                      {submitting ? 'Saving...' : editId ? 'Update Price List' : 'Create Price List'}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </DashboardLayout>
  );
} 