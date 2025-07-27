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
  FileText, 
  Building, 
  Calendar, 
  DollarSign, 
  Package,
  Truck,
  CheckCircle,
  Clock,
  AlertTriangle,
  XCircle,
  Eye,
  Trash2,
  TrendingUp,
  Activity,
  MapPin,
  Phone,
  Mail,
  Star,
  Hash,
  BarChart3
} from "lucide-react";
import { toast } from "sonner";

interface PurchaseOrder {
  id: string;
  po_number: string;
  supplier_id: string;
  supplier_name: string;
  order_date: string;
  expected_delivery_date: string;
  status: string;
  total_amount: number;
  notes?: string;
  items: PurchaseOrderItem[];
  created_at: string;
  updated_at: string;
}

interface PurchaseOrderItem {
  id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export default function PurchaseOrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const purchaseOrderId = params.id as string;
  
  const [purchaseOrder, setPurchaseOrder] = useState<PurchaseOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPurchaseOrder = async () => {
      if (!purchaseOrderId) return;
      
      setLoading(true);
      setError(null);
      
      try {
        // Mock data for demonstration
        const mockPurchaseOrder: PurchaseOrder = {
          id: purchaseOrderId,
          po_number: `PO-${purchaseOrderId.slice(0, 8).toUpperCase()}`,
          supplier_id: "supplier-123",
          supplier_name: "ABC Supplies Inc.",
          order_date: "2024-01-15",
          expected_delivery_date: "2024-01-25",
          status: "pending",
          total_amount: 12500.00,
          notes: "Please ensure all items are in good condition and properly packaged.",
          items: [
            {
              id: "item-1",
              product_id: "prod-1",
              product_name: "Steel Beams 6m",
              quantity: 50,
              unit_price: 150.00,
              total_price: 7500.00
            },
            {
              id: "item-2",
              product_id: "prod-2",
              product_name: "Concrete Mix Bags",
              quantity: 100,
              unit_price: 25.00,
              total_price: 2500.00
            },
            {
              id: "item-3",
              product_id: "prod-3",
              product_name: "Safety Helmets",
              quantity: 25,
              unit_price: 100.00,
              total_price: 2500.00
            }
          ],
          created_at: "2024-01-15T10:30:00Z",
          updated_at: "2024-01-15T10:30:00Z"
        };
        
        setPurchaseOrder(mockPurchaseOrder);
      } catch (err) {
        console.error('Error fetching purchase order:', err);
        setError(err instanceof Error ? err.message : 'Failed to load purchase order');
      } finally {
        setLoading(false);
      }
    };

    fetchPurchaseOrder();
  }, [purchaseOrderId]);

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

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return "bg-gradient-to-r from-yellow-500 to-orange-500 text-white";
      case 'approved':
        return "bg-gradient-to-r from-blue-500 to-cyan-500 text-white";
      case 'shipped':
        return "bg-gradient-to-r from-purple-500 to-pink-500 text-white";
      case 'delivered':
        return "bg-gradient-to-r from-green-500 to-emerald-500 text-white";
      case 'cancelled':
        return "bg-gradient-to-r from-red-500 to-pink-500 text-white";
      default:
        return "bg-gradient-to-r from-gray-500 to-gray-600 text-white";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'approved':
        return <CheckCircle className="w-4 h-4" />;
      case 'shipped':
        return <Truck className="w-4 h-4" />;
      case 'delivered':
        return <CheckCircle className="w-4 h-4" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4" />;
      default:
        return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const handleEdit = () => {
    toast.info('Edit functionality coming soon');
  };

  const handleDelete = () => {
    if (!purchaseOrder) return;
    
    if (!confirm('Are you sure you want to delete this purchase order?')) return;
    
    toast.success("Purchase order deleted");
    router.push('/inventory/purchase-orders');
  };

  if (loading) {
    return (
      <DashboardLayout session={session} title="Purchase Order Details">
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500 mx-auto mb-6"></div>
              <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">Loading Purchase Order</h3>
              <p className="text-gray-500 dark:text-gray-400">Please wait while we fetch the information...</p>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !purchaseOrder) {
    return (
      <DashboardLayout session={session} title="Purchase Order Details">
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center max-w-md mx-auto">
              <div className="w-20 h-20 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertTriangle className="w-10 h-10 text-red-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Purchase Order Not Found</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">{error || 'The purchase order you are looking for does not exist.'}</p>
              <Button 
                onClick={() => router.push('/inventory/purchase-orders')}
                className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Purchase Orders
              </Button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout session={session} title="Purchase Order Details">
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="flex items-center gap-4">
                <Button 
                  variant="outline" 
                  onClick={() => router.push('/inventory/purchase-orders')}
                  className="flex items-center gap-2 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </Button>
                <div>
                  <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                      <FileText className="w-6 h-6 text-white" />
                    </div>
                    {purchaseOrder.po_number}
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400 mt-2">Purchase Order Details & Information</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Badge className={getStatusColor(purchaseOrder.status)}>
                  {getStatusIcon(purchaseOrder.status)}
                  <span className="ml-1 capitalize">{purchaseOrder.status}</span>
                </Badge>
                <Button 
                  onClick={handleEdit}
                  className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Order
                </Button>
                <Button 
                  variant="destructive"
                  onClick={handleDelete}
                  className="shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
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
                    <p className="text-blue-100 text-sm font-medium">Total Amount</p>
                    <p className="text-2xl font-bold">{formatCurrency(purchaseOrder.total_amount)}</p>
                  </div>
                  <DollarSign className="h-10 w-10 text-blue-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg hover:shadow-xl transition-all duration-200">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm font-medium">Items</p>
                    <p className="text-2xl font-bold">{purchaseOrder.items.length}</p>
                  </div>
                  <Package className="h-10 w-10 text-green-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-200">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm font-medium">Order Date</p>
                    <p className="text-lg font-semibold">{formatDate(purchaseOrder.order_date)}</p>
                  </div>
                  <Calendar className="h-10 w-10 text-purple-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-lg hover:shadow-xl transition-all duration-200">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100 text-sm font-medium">Expected Delivery</p>
                    <p className="text-lg font-semibold">{formatDate(purchaseOrder.expected_delivery_date)}</p>
                  </div>
                  <Truck className="h-10 w-10 text-orange-200" />
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
                    <Eye className="w-4 h-4 mr-2" />
                    Overview
                  </TabsTrigger>
                  <TabsTrigger value="items" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800">
                    <Package className="w-4 h-4 mr-2" />
                    Items
                  </TabsTrigger>
                  <TabsTrigger value="supplier" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800">
                    <Building className="w-4 h-4 mr-2" />
                    Supplier
                  </TabsTrigger>
                  <TabsTrigger value="timeline" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800">
                    <Activity className="w-4 h-4 mr-2" />
                    Timeline
                  </TabsTrigger>
                </TabsList>

                <div className="mt-6">
                  <TabsContent value="overview" className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <Card className="border-0 shadow-sm bg-gray-50 dark:bg-gray-700">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-lg">
                            <FileText className="w-5 h-5 text-purple-500" />
                            Order Information
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">PO Number</label>
                              <p className="text-lg font-semibold text-gray-900 dark:text-white">{purchaseOrder.po_number}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Status</label>
                              <Badge className={getStatusColor(purchaseOrder.status)}>
                                {getStatusIcon(purchaseOrder.status)}
                                <span className="ml-1 capitalize">{purchaseOrder.status}</span>
                              </Badge>
                            </div>
                          </div>
                          <Separator />
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Order Date</label>
                              <p className="text-lg text-gray-900 dark:text-white">{formatDate(purchaseOrder.order_date)}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Expected Delivery</label>
                              <p className="text-lg text-gray-900 dark:text-white">{formatDate(purchaseOrder.expected_delivery_date)}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="border-0 shadow-sm bg-gray-50 dark:bg-gray-700">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-lg">
                            <Star className="w-5 h-5 text-yellow-500" />
                            Financial Summary
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Amount</span>
                            <span className="text-2xl font-bold text-green-600">{formatCurrency(purchaseOrder.total_amount)}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Number of Items</span>
                            <span className="text-lg text-gray-900 dark:text-white">{purchaseOrder.items.length}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Order ID</span>
                            <span className="text-sm font-mono text-gray-900 dark:text-white">{purchaseOrder.id}</span>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {purchaseOrder.notes && (
                      <Card className="border-0 shadow-sm bg-gray-50 dark:bg-gray-700">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-lg">
                            <Hash className="w-5 h-5 text-blue-500" />
                            Notes
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-900 dark:text-white">{purchaseOrder.notes}</p>
                        </CardContent>
                      </Card>
                    )}
                  </TabsContent>

                  <TabsContent value="items" className="space-y-6">
                    <Card className="border-0 shadow-sm bg-gray-50 dark:bg-gray-700">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                          <Package className="w-5 h-5 text-green-500" />
                          Order Items
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Product</TableHead>
                              <TableHead>Quantity</TableHead>
                              <TableHead>Unit Price</TableHead>
                              <TableHead>Total</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {purchaseOrder.items.map((item) => (
                              <TableRow key={item.id}>
                                <TableCell className="font-medium">{item.product_name}</TableCell>
                                <TableCell>{item.quantity}</TableCell>
                                <TableCell>{formatCurrency(item.unit_price)}</TableCell>
                                <TableCell className="font-semibold">{formatCurrency(item.total_price)}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                          <div className="flex justify-between items-center">
                            <span className="text-lg font-semibold text-gray-900 dark:text-white">Total Amount</span>
                            <span className="text-2xl font-bold text-green-600">{formatCurrency(purchaseOrder.total_amount)}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="supplier" className="space-y-6">
                    <Card className="border-0 shadow-sm bg-gray-50 dark:bg-gray-700">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                          <Building className="w-5 h-5 text-blue-500" />
                          Supplier Information
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Supplier Name</label>
                            <p className="text-lg font-semibold text-gray-900 dark:text-white">{purchaseOrder.supplier_name}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Supplier ID</label>
                            <p className="text-lg text-gray-900 dark:text-white">{purchaseOrder.supplier_id}</p>
                          </div>
                        </div>
                        <Separator />
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-gray-500" />
                            <span className="text-gray-600 dark:text-gray-400">Address: Not available</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-gray-500" />
                            <span className="text-gray-600 dark:text-gray-400">Phone: Not available</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-gray-500" />
                            <span className="text-gray-600 dark:text-gray-400">Email: Not available</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="timeline" className="space-y-6">
                    <Card className="border-0 shadow-sm bg-gray-50 dark:bg-gray-700">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                          <Activity className="w-5 h-5 text-purple-500" />
                          Order Timeline
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-center gap-4">
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">Order Created</p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">{formatDate(purchaseOrder.created_at)}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">Pending Approval</p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">Awaiting approval</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                            <div>
                              <p className="font-medium text-gray-500">Order Shipped</p>
                              <p className="text-sm text-gray-400">Not yet shipped</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                            <div>
                              <p className="font-medium text-gray-500">Order Delivered</p>
                              <p className="text-sm text-gray-400">Expected: {formatDate(purchaseOrder.expected_delivery_date)}</p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </div>
              </Tabs>
            </CardHeader>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
