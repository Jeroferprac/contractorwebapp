"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Package, 
  DollarSign, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Hash,
  Tag,
  BarChart3,
  Settings,
  Eye,
  Calendar,
  MapPin,
  Star,
  Activity,
  Layers,
  Zap,
  Shield,
  Target,
  Clock
} from "lucide-react";
import { Product } from "@/types/inventory";

interface ProductViewModalProps {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProductViewModal({ product, open, onOpenChange }: ProductViewModalProps) {
  if (!product) return null;

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

  const getStockStatus = (quantity: number, minStock: number) => {
    if (quantity <= 0) return { status: "Out of Stock", color: "bg-red-500 text-white" };
    if (quantity <= minStock) return { status: "Low Stock", color: "bg-yellow-500 text-white" };
    return { status: "In Stock", color: "bg-green-500 text-white" };
  };

  const stockStatus = getStockStatus(product.quantity || 0, product.min_stock_level || 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                {product.name}
              </DialogTitle>
              <p className="text-gray-600 dark:text-gray-400">Product Details & Information</p>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Quick Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg hover:shadow-xl transition-all duration-200">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm font-medium">Current Stock</p>
                    <p className="text-2xl font-bold">{product.quantity || 0}</p>
                  </div>
                  <BarChart3 className="h-10 w-10 text-blue-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg hover:shadow-xl transition-all duration-200">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm font-medium">Price</p>
                    <p className="text-2xl font-bold">{formatCurrency(product.price || 0)}</p>
                  </div>
                  <DollarSign className="h-10 w-10 text-green-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-200">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm font-medium">Category</p>
                    <p className="text-lg font-semibold">{product.category?.name || 'N/A'}</p>
                  </div>
                  <Tag className="h-10 w-10 text-purple-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-lg hover:shadow-xl transition-all duration-200">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100 text-sm font-medium">SKU</p>
                    <p className="text-lg font-semibold">{product.sku || 'N/A'}</p>
                  </div>
                  <Hash className="h-10 w-10 text-orange-200" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Card className="shadow-xl border-0 bg-white dark:bg-gray-800">
            <CardHeader className="border-b border-gray-200 dark:border-gray-700">
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-5 bg-gray-100 dark:bg-gray-700">
                  <TabsTrigger value="overview" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800">
                    <Eye className="w-4 h-4 mr-2" />
                    Overview
                  </TabsTrigger>
                  <TabsTrigger value="inventory" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Inventory
                  </TabsTrigger>
                  <TabsTrigger value="pricing" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800">
                    <DollarSign className="w-4 h-4 mr-2" />
                    Pricing
                  </TabsTrigger>
                  <TabsTrigger value="tracking" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800">
                    <Target className="w-4 h-4 mr-2" />
                    Tracking
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
                            <Package className="w-5 h-5 text-purple-500" />
                            Basic Information
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Product Name</label>
                              <p className="text-lg font-semibold text-gray-900 dark:text-white">{product.name}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">SKU</label>
                              <p className="text-lg text-gray-900 dark:text-white">{product.sku || 'Not specified'}</p>
                            </div>
                          </div>
                          <Separator />
                          <div>
                            <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Description</label>
                            <p className="text-lg text-gray-900 dark:text-white">{product.description || 'No description available'}</p>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Category</label>
                              <p className="text-lg text-gray-900 dark:text-white">{product.category?.name || 'Not specified'}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Brand</label>
                              <p className="text-lg text-gray-900 dark:text-white">{product.brand || 'Not specified'}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="border-0 shadow-sm bg-gray-50 dark:bg-gray-700">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-lg">
                            <Star className="w-5 h-5 text-yellow-500" />
                            Product Status
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Status</span>
                            <Badge className={getStatusColor(product.is_active ?? true)}>
                              {product.is_active ? 'Active' : 'Inactive'}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Stock Status</span>
                            <Badge className={stockStatus.color}>
                              {stockStatus.status}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Product ID</span>
                            <span className="text-sm font-mono text-gray-900 dark:text-white">{product.id}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Created</span>
                            <span className="text-sm text-gray-900 dark:text-white">
                              {product.created_at ? formatDate(product.created_at) : 'N/A'}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value="inventory" className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <Card className="border-0 shadow-sm bg-gray-50 dark:bg-gray-700">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-lg">
                            <BarChart3 className="w-5 h-5 text-blue-500" />
                            Stock Information
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Current Stock</label>
                              <p className="text-2xl font-bold text-blue-600">{product.quantity || 0}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Min Stock Level</label>
                              <p className="text-2xl font-bold text-orange-600">{product.min_stock_level || 0}</p>
                            </div>
                          </div>
                          <Separator />
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Max Stock Level</label>
                              <p className="text-lg text-gray-900 dark:text-white">{product.max_stock_level || 'Not set'}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Reorder Point</label>
                              <p className="text-lg text-gray-900 dark:text-white">{product.reorder_point || 'Not set'}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="border-0 shadow-sm bg-gray-50 dark:bg-gray-700">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-lg">
                            <Layers className="w-5 h-5 text-green-500" />
                            Stock Summary
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                            <div>
                              <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Available Stock</p>
                              <p className="text-xl font-bold text-blue-700 dark:text-blue-300">{product.quantity || 0} units</p>
                            </div>
                            <BarChart3 className="w-8 h-8 text-blue-500" />
                          </div>
                          <div className="flex items-center justify-between p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                            <div>
                              <p className="text-sm font-medium text-yellow-600 dark:text-yellow-400">Min Stock Level</p>
                              <p className="text-xl font-bold text-yellow-700 dark:text-yellow-300">{product.min_stock_level || 0} units</p>
                            </div>
                            <AlertTriangle className="w-8 h-8 text-yellow-500" />
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value="pricing" className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <Card className="border-0 shadow-sm bg-gray-50 dark:bg-gray-700">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-lg">
                            <DollarSign className="w-5 h-5 text-green-500" />
                            Pricing Information
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Sale Price</label>
                              <p className="text-2xl font-bold text-green-600">{formatCurrency(product.price || 0)}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Cost Price</label>
                              <p className="text-2xl font-bold text-blue-600">{formatCurrency(product.cost_price || 0)}</p>
                            </div>
                          </div>
                          <Separator />
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Profit Margin</label>
                              <p className="text-lg text-gray-900 dark:text-white">
                                {product.price && product.cost_price 
                                  ? `${(((product.price - product.cost_price) / product.price) * 100).toFixed(1)}%`
                                  : 'N/A'
                                }
                              </p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Tax Rate</label>
                              <p className="text-lg text-gray-900 dark:text-white">{product.tax_rate || 0}%</p>
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
                              <p className="text-sm font-medium text-green-600 dark:text-green-400">Total Value</p>
                              <p className="text-xl font-bold text-green-700 dark:text-green-300">
                                {formatCurrency((product.price || 0) * (product.quantity || 0))}
                              </p>
                            </div>
                            <DollarSign className="w-8 h-8 text-green-500" />
                          </div>
                          <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                            <div>
                              <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Cost Value</p>
                              <p className="text-xl font-bold text-blue-700 dark:text-blue-300">
                                {formatCurrency((product.cost_price || 0) * (product.quantity || 0))}
                              </p>
                            </div>
                            <TrendingUp className="w-8 h-8 text-blue-500" />
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value="tracking" className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <Card className="border-0 shadow-sm bg-gray-50 dark:bg-gray-700">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-lg">
                            <Target className="w-5 h-5 text-orange-500" />
                            Tracking Settings
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Track Stock</span>
                              <Badge className={product.track_stock ? "bg-green-500 text-white" : "bg-gray-500 text-white"}>
                                {product.track_stock ? 'Yes' : 'No'}
                              </Badge>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Track Expiry</span>
                              <Badge className={product.track_expiry ? "bg-green-500 text-white" : "bg-gray-500 text-white"}>
                                {product.track_expiry ? 'Yes' : 'No'}
                              </Badge>
                            </div>
                          </div>
                          <Separator />
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Barcode</label>
                              <p className="text-lg text-gray-900 dark:text-white">{product.barcode || 'Not specified'}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Weight</label>
                              <p className="text-lg text-gray-900 dark:text-white">{product.weight || 'Not specified'}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="border-0 shadow-sm bg-gray-50 dark:bg-gray-700">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-lg">
                            <Shield className="w-5 h-5 text-red-500" />
                            Safety & Compliance
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                            <div>
                              <p className="text-sm font-medium text-red-600 dark:text-red-400">Safety Stock</p>
                              <p className="text-xl font-bold text-red-700 dark:text-red-300">{product.min_stock_level || 0} units</p>
                            </div>
                            <Shield className="w-8 h-8 text-red-500" />
                          </div>
                          <div className="flex items-center justify-between p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                            <div>
                              <p className="text-sm font-medium text-yellow-600 dark:text-yellow-400">Reorder Point</p>
                              <p className="text-xl font-bold text-yellow-700 dark:text-yellow-300">{product.reorder_point || 'Not set'}</p>
                            </div>
                            <AlertTriangle className="w-8 h-8 text-yellow-500" />
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value="history" className="space-y-6">
                    <Card className="border-0 shadow-sm bg-gray-50 dark:bg-gray-700">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                          <Activity className="w-5 h-5 text-purple-500" />
                          Transaction History
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-center py-8">
                          <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-500 dark:text-gray-400">Transaction history will be available soon</p>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </div>
              </Tabs>
            </CardHeader>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
} 