import { useState, useEffect } from "react"
import { Link, useParams, useNavigate } from "react-router-dom"
import { ArrowLeft, Loader2, Plus, Trash, Upload } from 'lucide-react'
import toast from "react-hot-toast"

import { Button } from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Textarea } from "../../components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Separator } from "../../components/ui/separator"
import { Switch } from "../../components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { useProduct, useCreateProduct, useUpdateProduct } from "../../hooks/use-products"
import LoadingSpinner from "../../components/ui/loading-spinner"

export default function AdminNewProductPage() {
  const { id } = useParams<{ id: string }>()
  const isEditing = !!id
  const navigate = useNavigate()
  
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    categoryId: "",
    stock: "",
    features: "",
    colors: [{ name: "" }],
    storage: [{ size: "" }],
    trackInventory: true,
    allowBackorders: false,
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Fetch product data if editing
  const { data, isLoading: isLoadingProduct } = useProduct(id || "")
  
  // Mutations
  const createProduct = useCreateProduct()
  const updateProduct = useUpdateProduct(id || "")
  
  // Set form data when product data is loaded
  useEffect(() => {
    if (isEditing && data?.product) {
      const product = data.product
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price.toString(),
        categoryId: product.category?.id || "",
        stock: product.stock.toString(),
        features: Array.isArray(product.features) ? product.features.join("\n") : "",
        colors: product.colors?.map((color: string) => ({ name: color })) || [{ name: "" }],
        storage: product.storage?.map((size: string) => ({ size })) || [{ size: "" }],
        trackInventory: true,
        allowBackorders: false,
      })
    }
  }, [isEditing, data])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      // Prepare data for API
      const productData = new FormData()
      productData.append("name", formData.name)
      productData.append("description", formData.description)
      productData.append("price", formData.price)
      productData.append("categoryId", formData.categoryId)
      productData.append("stock", formData.stock)
      
      // Convert features from text to array
      const featuresArray = formData.features
        .split("\n")
        .map(feature => feature.trim())
        .filter(feature => feature.length > 0)
      
      productData.append("features", JSON.stringify(featuresArray))
      
      // Add colors and storage
      const colorsArray = formData.colors
        .map(color => color.name.trim())
        .filter(name => name.length > 0)
      
      const storageArray = formData.storage
        .map(item => item.size.trim())
        .filter(size => size.length > 0)
      
      productData.append("colors", JSON.stringify(colorsArray))
      productData.append("storage", JSON.stringify(storageArray))
      
      if (isEditing) {
        await updateProduct.mutateAsync(productData as any)
        toast.success("Product updated successfully")
      } else {
        await createProduct.mutateAsync(productData as any)
        toast.success("Product created successfully")
      }
      
      // Redirect to products page
      navigate("/admin/products")
    } catch (error) {
      console.error("Error saving product:", error)
      toast.error("Failed to save product. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }
  
  const handleAddColor = () => {
    setFormData(prev => ({
      ...prev,
      colors: [...prev.colors, { name: "" }]
    }))
  }
  
  const handleRemoveColor = (index: number) => {
    setFormData(prev => ({
      ...prev,
      colors: prev.colors.filter((_, i) => i !== index)
    }))
  }
  
  const handleColorChange = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      colors: prev.colors.map((color, i) => (i === index ? { name: value } : color))
    }))
  }
  
  const handleAddStorage = () => {
    setFormData(prev => ({
      ...prev,
      storage: [...prev.storage, { size: "" }]
    }))
  }
  
  const handleRemoveStorage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      storage: prev.storage.filter((_, i) => i !== index)
    }))
  }
  
  const handleStorageChange = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      storage: prev.storage.map((item, i) => (i === index ? { size: value } : item))
    }))
  }
  
  if (isEditing && isLoadingProduct) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/admin/products">
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only">Back</span>
            </Link>
          </Button>
          <h2 className="text-3xl font-bold tracking-tight">{isEditing ? "Edit Product" : "Add New Product"}</h2>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" disabled={isSubmitting}>
            Save as Draft
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              isEditing ? "Update Product" : "Publish Product"
            )}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="images">Images</TabsTrigger>
          <TabsTrigger value="pricing">Pricing & Inventory</TabsTrigger>
          <TabsTrigger value="attributes">Attributes</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>General Information</CardTitle>
              <CardDescription>Basic information about the product.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name</Label>
                <Input 
                  id="name" 
                  placeholder="Enter product name" 
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select 
                    value={formData.categoryId}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, categoryId: value }))}
                  >
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="phones">Phones</SelectItem>
                      <SelectItem value="cases">Cases</SelectItem>
                      <SelectItem value="chargers">Chargers</SelectItem>
                      <SelectItem value="headphones">Headphones</SelectItem>
                      <SelectItem value="accessories">Other Accessories</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="brand">Brand</Label>
                  <Select>
                    <SelectTrigger id="brand">
                      <SelectValue placeholder="Select brand" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="apple">Apple</SelectItem>
                      <SelectItem value="samsung">Samsung</SelectItem>
                      <SelectItem value="google">Google</SelectItem>
                      <SelectItem value="xiaomi">Xiaomi</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  placeholder="Enter product description" 
                  className="min-h-[150px]" 
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="features">Features</Label>
                <Textarea
                  id="features"
                  placeholder="Enter product features (one per line)"
                  className="min-h-[100px]"
                  value={formData.features}
                  onChange={(e) => setFormData(prev => ({ ...prev, features: e.target.value }))}
                />
                <p className="text-sm text-muted-foreground">
                  Enter each feature on a new line. These will be displayed as bullet points.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="images" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Product Images</CardTitle>
              <CardDescription>
                Upload images for the product. The first image will be used as the main image.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="border border-dashed rounded-lg p-4 flex flex-col items-center justify-center text-center h-[200px]">
                  <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm font-medium mb-1">Drag & drop or click to upload</p>
                  <p className="text-xs text-muted-foreground mb-4">SVG, PNG, JPG or GIF (max. 2MB)</p>
                  <Button variant="outline" size="sm">
                    Choose File
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pricing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pricing & Inventory</CardTitle>
              <CardDescription>Set pricing and inventory information for the product.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Regular Price ($)</Label>
                  <Input 
                    id="price" 
                    type="number" 
                    placeholder="0.00" 
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sale-price">Sale Price ($)</Label>
                  <Input id="sale-price" type="number" placeholder="0.00" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cost">Cost Price ($)</Label>
                  <Input id="cost" type="number" placeholder="0.00" />
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sku">SKU</Label>
                  <Input id="sku" placeholder="Enter SKU" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="barcode">Barcode</Label>
                  <Input id="barcode" placeholder="Enter barcode" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="stock">Stock Quantity</Label>
                  <Input 
                    id="stock" 
                    type="number" 
                    placeholder="0" 
                    value={formData.stock}
                    onChange={(e) => setFormData(prev => ({ ...prev, stock: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="low-stock">Low Stock Threshold</Label>
                  <Input id="low-stock" type="number" placeholder="10" />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch 
                  id="track-inventory" 
                  checked={formData.trackInventory}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, trackInventory: checked }))}
                />
                <Label htmlFor="track-inventory">Track inventory</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch 
                  id="allow-backorders" 
                  checked={formData.allowBackorders}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, allowBackorders: checked }))}
                />
                <Label htmlFor="allow-backorders">Allow backorders</Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="attributes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Product Attributes</CardTitle>
              <CardDescription>Add attributes like color, size, etc. for the product.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Colors</h3>
                  <Button variant="outline" size="sm" onClick={handleAddColor}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Color
                  </Button>
                </div>

                <div className="space-y-2">
                  {formData.colors.map((color, index) => (
                    <div key={index} className="flex items-center space-x-2 border p-3 rounded-md">
                      <Input 
                        placeholder="Color name" 
                        value={color.name} 
                        onChange={(e) => handleColorChange(index, e.target.value)}
                        className="flex-1" 
                      />
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleRemoveColor(index)}
                        disabled={formData.colors.length === 1}
                      >
                        <Trash className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Storage</h3>
                  <Button variant="outline" size="sm" onClick={handleAddStorage}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Storage Option
                  </Button>
                </div>

                <div className="space-y-2">
                  {formData.storage.map((item, index) => (
                    <div key={index} className="flex items-center space-x-2 border p-3 rounded-md">
                      <Input 
                        placeholder="Storage size" 
                        value={item.size} 
                        onChange={(e) => handleStorageChange(index, e.target.value)}
                        className="flex-1" 
                      />
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleRemoveStorage(index)}
                        disabled={formData.storage.length === 1}
                      >
                        <Trash className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
