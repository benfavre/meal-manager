"use client"
import { useState, useEffect, useRef } from "react"
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarIcon, List, Settings, Plus, X, Trash2, Edit, ChevronDown, ChevronUp, Eye, EyeOff, ArrowUp, ArrowDown, Image as ImageIcon, Search, Copy, ShoppingCart, FileText, Printer, Clock, Grid, Truck, CreditCard, User, Building } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  getFilteredRowModel,
  ColumnFiltersState,
} from "@tanstack/react-table"
import { Toaster, toast } from 'sonner'
import Confetti from 'react-confetti'

interface Attribute {
  key: string
  value: string
}

interface OpeningHours {
  monday: { periods: { open: string; close: string }[] }
  tuesday: { periods: { open: string; close: string }[] }
  wednesday: { periods: { open: string; close: string }[] }
  thursday: { periods: { open: string; close: string }[] }
  friday: { periods: { open: string; close: string }[] }
  saturday: { periods: { open: string; close: string }[] }
  sunday: { periods: { open: string; close: string }[] }
}

interface Location {
  id: string
  name: string
  address: string
  openingHours: OpeningHours
}

interface ItemStock {
  [locationId: string]: number
}

interface Item {
  id: number
  name: string
  category: string
  price: number
  taxRate: number
  stock: ItemStock
  description?: string
  attributes: Attribute[]
  featuredImage?: string
  availableLocations: string[]
}

interface MealOffering {
  id: number
  name: string
  startDate: Date
  endDate: Date
  items: {
    Entrées: Item[]
    Plats: Item[]
    Accompagnements: Item[]
    Desserts: Item[]
  }
  status: 'draft' | 'published'
  locationId: string
}

interface MediaItem {
  id: number
  name: string
  url: string
  type: 'image' | 'video'
}

interface CartItem extends Item {
  quantity: number
}

interface Order {
  id: number
  customerName: string
  customerEmail: string
  customerPhone: string
  deliveryAddress: string
  items: CartItem[]
  totalAmount: number
  status: 'pending' | 'processing' | 'completed' | 'cancelled'
  createdAt: Date
  locationId: string
  shippingMethodId: string
  paymentMethodId: string
}

interface StockMovement {
  id: number
  itemId: number
  quantity: number
  type: 'increase' | 'decrease'
  reason: string
  date: Date
  locationId: string
}

interface ShippingMethod {
  id: string
  name: string
  description: string
  price: number
  estimatedDeliveryDays: number
  enabled: boolean
  availableLocations: string[]
}

interface PaymentMethod {
  id: string
  name: string
  description: string
  enabled: boolean
  availableLocations: string[]
}

interface ShopSettings {
  shopName: string
  shopDescription: string
  currency: string
  taxRate: number
  shippingFee: number
  emailAddress: string
  phoneNumber: string
  address: string
  locations: Location[]
  primaryLocationId: string
  shippingMethods: ShippingMethod[]
  paymentMethods: PaymentMethod[]
}

interface User {
  id: string
  name: string
  email: string
  role: 'Admin' | 'Shop manager' | 'Client'
}

interface Tenant {
  id: string
  name: string
  domain: string
  status: 'active' | 'pending' | 'suspended'
}

interface TenantRegistration {
  id: string
  tenantName: string
  ownerName: string
  email: string
  phoneNumber: string
  businessType: string
  status: 'pending' | 'approved' | 'rejected'
  submittedAt: Date
  shopConfig: {
    shopName: string
    shopDescription: string
    currency: string
    taxRate: number
    shippingFee: number
  }
}

interface AdminState {
  items: Item[]
  mealOfferings: MealOffering[]
  mediaItems: MediaItem[]
  cart: CartItem[]
  orders: Order[]
  stockMovements: StockMovement[]
  shopSettings: ShopSettings
  users: User[]
  currentUser: User | null
  tenants: Tenant[]
  currentTenant: Tenant | null
  tenantRegistrations: TenantRegistration[]
  isSuperAdminMode: boolean
  addItem: (item: Item) => void
  updateItem: (id: number, item: Partial<Item>) => void
  deleteItem: (id: number) => void
  addMealOffering: (mealOffering: MealOffering) => void
  editMealOffering: (id: number, updatedOffering: Partial<MealOffering>) => void
  deleteMealOffering: (id: number) => void
  duplicateMealOffering: (id: number) => void
  assignItem: (mealId: number, category: keyof MealOffering['items'], item: Item) => void
  removeItem: (mealId: number, category: keyof MealOffering['items'], itemId: number) => void
  toggleMealOfferingStatus: (id: number) => void
  sortMealItems: (mealId: number, category: keyof MealOffering['items'], oldIndex: number, newIndex: number) => void
  addMediaItem: (mediaItem: MediaItem) => void
  deleteMediaItem: (id: number) => void
  setItemFeaturedImage: (itemId: number, imageUrl: string) => void
  addToCart: (item: Item, locationId: string) => void
  removeFromCart: (itemId: number) => void
  updateCartItemQuantity: (itemId: number, quantity: number) => void
  clearCart: () => void
  addOrder: (order: Order) => void
  updateOrderStatus: (orderId: number, status: Order['status']) => void
  editOrder: (orderId: number, updatedOrder: Partial<Order>) => void
  addStockMovement: (movement: StockMovement) => void
  cancelStockMovement: (movementId: number) => void
  reserveStock: (items: CartItem[], locationId: string) => void
  releaseStock: (items: CartItem[], locationId: string) => void
  updateStock: (itemId: number, locationId: string, quantity: number) => void
  updateShopSettings: (settings: Partial<ShopSettings>) => void
  addLocation: (location: Location) => void
  updateLocation: (id: string, location: Partial<Location>) => void
  deleteLocation: (id: string) => void
  setPrimaryLocation: (id: string) => void
  addShippingMethod: (shippingMethod: ShippingMethod) => void
  updateShippingMethod: (id: string, shippingMethod: Partial<ShippingMethod>) => void
  deleteShippingMethod: (id: string) => void
  addPaymentMethod: (paymentMethod: PaymentMethod) => void
  updatePaymentMethod: (id: string, paymentMethod: Partial<PaymentMethod>) => void
  deletePaymentMethod: (id: string) => void
  setCurrentUser: (user: User | null) => void
  addTenant: (tenant: Tenant) => void
  updateTenant: (id: string, tenant: Partial<Tenant>) => void
  deleteTenant: (id: string) => void
  setCurrentTenant: (tenant: Tenant | null) => void
  addTenantRegistration: (registration: TenantRegistration) => void
  updateTenantRegistration: (id: string, registration: Partial<TenantRegistration>) => void
  deleteTenantRegistration: (id: string) => void
  toggleSuperAdminMode: () => void
}

const useAdminStore = create<AdminState>()(
  persist(
    (set, get) => ({
      items: [],
      mealOfferings: [],
      mediaItems: [],
      cart: [],
      orders: [],
      stockMovements: [],
      shopSettings: {
        shopName: '',
        shopDescription: '',
        currency: 'EUR',
        taxRate: 20,
        shippingFee: 5,
        emailAddress: '',
        phoneNumber: '',
        address: '',
        locations: [],
        primaryLocationId: '',
        shippingMethods: [],
        paymentMethods: [],
      },
      users: [
        { id: '1', name: 'Admin User', email: 'admin@example.com', role: 'Admin' },
        { id: '2', name: 'Shop Manager', email: 'manager@example.com', role: 'Shop manager' },
        { id: '3', name: 'Client User', email: 'client@example.com', role: 'Client' },
      ],
      currentUser: null,
      tenants: [
        { id: '1', name: 'Tenant 1', domain: 'tenant1.example.com', status: 'active' },
        { id: '2', name: 'Tenant 2', domain: 'tenant2.example.com', status: 'active' },
      ],
      currentTenant: null,
      tenantRegistrations: [],
      isSuperAdminMode: false,
      addItem: (item) => set((state) => ({ items: [...state.items, item] })),
      updateItem: (id, updatedItem) => set((state) => ({
        items: state.items.map(item => item.id === id ? { ...item, ...updatedItem } : item)
      })),
      deleteItem: (id) => set((state) => ({ items: state.items.filter(item => item.id !== id) })),
      addMealOffering: (mealOffering) => set((state) => ({ mealOfferings: [...state.mealOfferings, mealOffering] })),
      editMealOffering: (id, updatedOffering) => set((state) => ({
        mealOfferings: state.mealOfferings.map(offering =>
          offering.id === id ? { ...offering, ...updatedOffering } : offering
        )
      })),
      deleteMealOffering: (id) => set((state) => ({
        mealOfferings: state.mealOfferings.filter(offering => offering.id !== id)
      })),
      duplicateMealOffering: (id) => set((state) => {
        const offeringToDuplicate = state.mealOfferings.find(offering => offering.id === id)
        if (offeringToDuplicate) {
          const newOffering = {
            ...offeringToDuplicate,
            id: Date.now(),
            name: `${offeringToDuplicate.name} (Copy)`,
            status: 'draft' as const
          }
          return { mealOfferings: [...state.mealOfferings, newOffering] }
        }
        return state
      }),
      assignItem: (mealId, category, item) => set((state) => ({
        mealOfferings: state.mealOfferings.map(meal =>
          meal.id === mealId
            ? { ...meal, items: { ...meal.items, [category]: [...meal.items[category], item] } }
            : meal
        )
      })),
      removeItem: (mealId, category, itemId) => set((state) => ({
        mealOfferings: state.mealOfferings.map(meal =>
          meal.id === mealId
            ? { ...meal, items: { ...meal.items, [category]: meal.items[category].filter(item => item.id !== itemId) } }
            : meal
        )
      })),
      toggleMealOfferingStatus: (id) => set((state) => ({
        mealOfferings: state.mealOfferings.map(offering =>
          offering.id === id
            ? { ...offering, status: offering.status === 'draft' ? 'published' : 'draft' }
            : offering
        )
      })),
      sortMealItems: (mealId, category, oldIndex, newIndex) => set((state) => ({
        mealOfferings: state.mealOfferings.map(meal =>
          meal.id === mealId
            ? {
                ...meal,
                items: {
                  ...meal.items,
                  [category]: Array.from(meal.items[category]).map((item, index) => {
                    if (index === oldIndex) return meal.items[category][newIndex]
                    if (index === newIndex) return meal.items[category][oldIndex]
                    return item
                  })
                }
              }
            : meal
        )
      })),
      addMediaItem: (mediaItem) => set((state) => ({ mediaItems: [...state.mediaItems, mediaItem] })),
      deleteMediaItem: (id) => set((state) => ({ mediaItems: state.mediaItems.filter(item => item.id !== id) })),
      setItemFeaturedImage: (itemId, imageUrl) => set((state) => ({
        items: state.items.map(item =>
          item.id === itemId ? { ...item, featuredImage: imageUrl } : item
        )
      })),
      addToCart: (item, locationId) => set((state) => {
        if (!item.availableLocations.includes(locationId)) {
          toast.error('This item is not available at the selected location')
          return state
        }
        if (item.stock[locationId] <= 0) {
          toast.error('This item is out of stock at the selected location')
          return state
        }
        const existingItem = state.cart.find(cartItem => cartItem.id === item.id)
        if (existingItem) {
          if (existingItem.quantity >= item.stock[locationId]) {
            toast.error('Cannot add more of this item')
            return state
          }
          return {
            cart: state.cart.map(cartItem =>
              cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem
            )
          }
        } else {
          return { cart: [...state.cart, { ...item, quantity: 1 }] }
        }
      }),
      removeFromCart: (itemId) => set((state) => ({
        cart: state.cart.filter(item => item.id !== itemId)
      })),
      updateCartItemQuantity: (itemId, quantity) => set((state) => ({
        cart: state.cart.map(item =>
          item.id === itemId ? { ...item, quantity } : item
        )
      })),
      clearCart: () => set({ cart: [] }),
      addOrder: (order) => set((state) => {
        const newState = { orders: [...state.orders, order] }
        get().reserveStock(order.items, order.locationId)
        return newState
      }),
      updateOrderStatus: (orderId, status) => set((state) => {
        const updatedOrders = state.orders.map(order => {
          if (order.id === orderId) {
            if (order.status === 'pending' && status === 'processing') {
              get().reserveStock(order.items, order.locationId)
            } else if (order.status === 'processing' && status === 'cancelled') {
              get().releaseStock(order.items, order.locationId)
            }
            return { ...order, status }
          }
          return order
        })
        return { orders: updatedOrders }
      }),
      editOrder: (orderId, updatedOrder) => set((state) => ({
        orders: state.orders.map(order =>
          order.id === orderId ? { ...order, ...updatedOrder } : order
        )
      })),
      addStockMovement: (movement) => set((state) => ({
        stockMovements: [...state.stockMovements, movement]
      })),
      cancelStockMovement: (movementId) => set((state) => {
        const movementToCancel = state.stockMovements.find(m => m.id === movementId)
        if (movementToCancel) {
          const updatedStockMovements = state.stockMovements.filter(m => m.id !== movementId)
          const updatedItems = state.items.map(item => {
            if (item.id === movementToCancel.itemId) {
              const stockChange = movementToCancel.type === 'decrease' ? movementToCancel.quantity : -movementToCancel.quantity
              return {
                ...item,
                stock: {
                  ...item.stock,
                  [movementToCancel.locationId]: (item.stock[movementToCancel.locationId] || 0) + stockChange
                }
              }
            }
            return item
          })
          return {
            stockMovements: updatedStockMovements,
            items: updatedItems
          }
        }
        return state
      }),
      reserveStock: (items, locationId) => {
        items.forEach(item => {
          get().updateStock(item.id, locationId, -item.quantity)
          get().addStockMovement({
            id: Date.now(),
            itemId: item.id,
            quantity: item.quantity,
            type: 'decrease',
            reason: 'Order reservation',
            date: new Date(),
            locationId: locationId
          })
        })
      },
      releaseStock: (items, locationId) => {
        items.forEach(item => {
          get().updateStock(item.id, locationId, item.quantity)
          get().addStockMovement({
            id: Date.now(),
            itemId: item.id,
            quantity: item.quantity,
            type: 'increase',
            reason: 'Order cancellation',
            date: new Date(),
            locationId: locationId
          })
        })
      },
      updateStock: (itemId, locationId, quantity) => set((state) => ({
        items: state.items.map(item =>
          item.id === itemId ? {
            ...item,
            stock: {
              ...item.stock,
              [locationId]: (item.stock[locationId] || 0) + quantity
            }
          } : item
        )
      })),
      updateShopSettings: (settings) => set((state) => ({
        shopSettings: { ...state.shopSettings, ...settings }
      })),
      addLocation: (location) => set((state) => ({
        shopSettings: {
          ...state.shopSettings,
          locations: [...state.shopSettings.locations, location],
          primaryLocationId: state.shopSettings.primaryLocationId || location.id
        }
      })),
      updateLocation: (id, updatedLocation) => set((state) => ({
        shopSettings: {
          ...state.shopSettings,
          locations: state.shopSettings.locations.map(location =>
            location.id === id ? { ...location, ...updatedLocation } : location
          )
        }
      })),
      deleteLocation: (id) => set((state) => ({
        shopSettings: {
          ...state.shopSettings,
          locations: state.shopSettings.locations.filter(location => location.id !== id),
          primaryLocationId: state.shopSettings.primaryLocationId === id
            ? state.shopSettings.locations[0]?.id || ''
            : state.shopSettings.primaryLocationId
        }
      })),
      setPrimaryLocation: (id) => set((state) => ({
        shopSettings: {
          ...state.shopSettings,
          primaryLocationId: id
        }
      })),
      addShippingMethod: (shippingMethod) => set((state) => ({
        shopSettings: {
          ...state.shopSettings,
          shippingMethods: [...state.shopSettings.shippingMethods, shippingMethod]
        }
      })),
      updateShippingMethod: (id, updatedShippingMethod) => set((state) => ({
        shopSettings: {
          ...state.shopSettings,
          shippingMethods: state.shopSettings.shippingMethods.map(method =>
            method.id === id ? { ...method, ...updatedShippingMethod } : method
          )
        }
      })),
      deleteShippingMethod: (id) => set((state) => ({
        shopSettings: {
          ...state.shopSettings,
          shippingMethods: state.shopSettings.shippingMethods.filter(method => method.id !== id)
        }
      })),
      addPaymentMethod: (paymentMethod) => set((state) => ({
        shopSettings: {
          ...state.shopSettings,
          paymentMethods: [...state.shopSettings.paymentMethods, paymentMethod]
        }
      })),
      updatePaymentMethod: (id, updatedPaymentMethod) => set((state) => ({
        shopSettings: {
          ...state.shopSettings,
          paymentMethods: state.shopSettings.paymentMethods.map(method =>
            method.id === id ? { ...method, ...updatedPaymentMethod } : method
          )
        }
      })),
      deletePaymentMethod: (id) => set((state) => ({
        shopSettings: {
          ...state.shopSettings,
          paymentMethods: state.shopSettings.paymentMethods.filter(method => method.id !== id)
        }
      })),
      setCurrentUser: (user) => set({ currentUser: user }),
      addTenant: (tenant) => set((state) => ({ tenants: [...state.tenants, tenant] })),
      updateTenant: (id, updatedTenant) => set((state) => ({
        tenants: state.tenants.map(tenant =>
          tenant.id === id ? { ...tenant, ...updatedTenant } : tenant
        )
      })),
      deleteTenant: (id) => set((state) => ({
        tenants: state.tenants.filter(tenant => tenant.id !== id)
      })),
      setCurrentTenant: (tenant) => set({ currentTenant: tenant }),
      addTenantRegistration: (registration) => set((state) => ({
        tenantRegistrations: [...state.tenantRegistrations, registration]
      })),
      updateTenantRegistration: (id, updatedRegistration) => set((state) => ({
        tenantRegistrations: state.tenantRegistrations.map(registration =>
          registration.id === id ? { ...registration, ...updatedRegistration } : registration
        )
      })),
      deleteTenantRegistration: (id) => set((state) => ({
        tenantRegistrations: state.tenantRegistrations.filter(registration => registration.id !== id)
      })),
      toggleSuperAdminMode: () => set((state) => ({ isSuperAdminMode: !state.isSuperAdminMode })),
    }),
    {
      name: 'admin-storage',
      getStorage: () => localStorage,
    }
  )
)

function TenantSignup() {
  const { addTenantRegistration } = useAdminStore()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    tenantName: '',
    ownerName: '',
    email: '',
    phoneNumber: '',
    businessType: '',
    shopName: '',
    shopDescription: '',
    currency: 'EUR',
    taxRate: '20',
    shippingFee: '5',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newRegistration: TenantRegistration = {
      id: Date.now().toString(),
      tenantName: formData.tenantName,
      ownerName: formData.ownerName,
      email: formData.email,
      phoneNumber: formData.phoneNumber,
      businessType: formData.businessType,
      status: 'pending',
      submittedAt: new Date(),
      shopConfig: {
        shopName: formData.shopName,
        shopDescription: formData.shopDescription,
        currency: formData.currency,
        taxRate: parseFloat(formData.taxRate),
        shippingFee: parseFloat(formData.shippingFee),
      },
    }
    addTenantRegistration(newRegistration)
    toast.success('Tenant registration submitted successfully')
    // Reset form and go back to step 1
    setFormData({
      tenantName: '',
      ownerName: '',
      email: '',
      phoneNumber: '',
      businessType: '',
      shopName: '',
      shopDescription: '',
      currency: 'EUR',
      taxRate: '20',
      shippingFee: '5',
    })
    setStep(1)
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Sign Up as a New Tenant</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {step === 1 && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="tenantName">Tenant Name</Label>
                  <Input
                    id="tenantName"
                    name="tenantName"
                    value={formData.tenantName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ownerName">Owner Name</Label>
                  <Input
                    id="ownerName"
                    name="ownerName"
                    value={formData.ownerName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="businessType">Business Type</Label>
                  <Input
                    id="businessType"
                    name="businessType"
                    value={formData.businessType}
                    onChange={handleChange}
                    required
                  />
                </div>
                <Button type="button" onClick={() => setStep(2)}>Next</Button>
              </>
            )}
            {step === 2 && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="shopName">Shop Name</Label>
                  <Input
                    id="shopName"
                    name="shopName"
                    value={formData.shopName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="shopDescription">Shop Description</Label>
                  <Textarea
                    id="shopDescription"
                    name="shopDescription"
                    value={formData.shopDescription}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select
                    value={formData.currency}
                    onValueChange={(value) => handleSelectChange('currency', value)}
                  >
                    <SelectTrigger id="currency">
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="EUR">Euro (€)</SelectItem>
                      <SelectItem value="USD">US Dollar ($)</SelectItem>
                      <SelectItem value="GBP">British Pound (£)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="taxRate">Tax Rate (%)</Label>
                  <Input
                    id="taxRate"
                    name="taxRate"
                    type="number"
                    value={formData.taxRate}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="shippingFee">Default Shipping Fee</Label>
                  <Input
                    id="shippingFee"
                    name="shippingFee"
                    type="number"
                    value={formData.shippingFee}
                    onChange={handleChange}
                    required
                  />
                </div>
                <Button type="button" onClick={() => setStep(1)}>Back</Button>
                <Button type="submit" className="ml-2">Submit</Button>
              </>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

function TenantsAdministration() {
  const { tenants, updateTenant, deleteTenant } = useAdminStore()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<Tenant['status'] | 'all'>('all')

  const filteredTenants = tenants.filter(tenant =>
    tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (statusFilter === 'all' || tenant.status === statusFilter)
  )

  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-bold text-gray-800">Tenants Administration</h2>
      <div className="flex space-x-4">
        <div className="flex-1">
          <Input
            placeholder="Search by tenant name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-48">
          <Select value={statusFilter} onValueChange={(value: Tenant['status'] | 'all') => setStatusFilter(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tenant Name</TableHead>
                <TableHead>Domain</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTenants.map((tenant) => (
                <TableRow key={tenant.id}>
                  <TableCell>{tenant.name}</TableCell>
                  <TableCell>{tenant.domain}</TableCell>
                  <TableCell>
                    <Badge variant={
                      tenant.status === 'active' ? 'default' :
                      tenant.status === 'pending' ? 'secondary' :
                      'destructive'
                    }>
                      {tenant.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={tenant.status}
                      onValueChange={(value: Tenant['status']) => {
                        updateTenant(tenant.id, { status: value })
                        toast.success(`Tenant status updated to ${value}`)
                      }}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Change status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="suspended">Suspended</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        deleteTenant(tenant.id)
                        toast.success('Tenant deleted successfully')
                      }}
                      className="ml-2"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

function AdminBar() {
  const { users, currentUser, setCurrentUser, tenants, currentTenant, setCurrentTenant, isSuperAdminMode, toggleSuperAdminMode } = useAdminStore()
  const [isSignInOpen, setIsSignInOpen] = useState(false)
  const [isRegisterOpen, setIsRegisterOpen] = useState(false)

  const handleRoleChange = (role: 'Admin' | 'Shop manager' | 'Client') => {
    const user = users.find(u => u.role === role)
    if (user) {
      setCurrentUser(user)
    }
  }

  const handleUserChange = (userId: string) => {
    const user = users.find(u => u.id === userId)
    if (user) {
      setCurrentUser(user)
    }
  }

  const handleTenantChange = (tenantId: string) => {
    const tenant = tenants.find(t => t.id === tenantId)
    if (tenant) {
      setCurrentTenant(tenant)
    }
  }

  return (
    <div className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <div className="flex space-x-4">
        <Select onValueChange={handleRoleChange} value={currentUser?.role || ''}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Admin">Admin</SelectItem>
            <SelectItem value="Shop manager">Shop manager</SelectItem>
            <SelectItem value="Client">Client</SelectItem>
          </SelectContent>
        </Select>
        <Select onValueChange={handleUserChange} value={currentUser?.id || ''}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select user" />
          </SelectTrigger>
          <SelectContent>
            {users.map((user) => (
              <SelectItem key={user.id} value={user.id}>{user.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select onValueChange={handleTenantChange} value={currentTenant?.id || ''}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select tenant" />
          </SelectTrigger>
          <SelectContent>
            {tenants.map((tenant) => (
              <SelectItem key={tenant.id} value={tenant.id}>{tenant.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Switch
            checked={isSuperAdminMode}
            onCheckedChange={toggleSuperAdminMode}
            id="super-admin-mode"
          />
          <Label htmlFor="super-admin-mode">Super Admin Mode</Label>
        </div>
        {currentUser ? (
          <Button variant="ghost" onClick={() => setCurrentUser(null)}>Sign Out</Button>
        ) : (
          <>
            <Button variant="ghost" onClick={() => setIsSignInOpen(true)}>Sign In</Button>
            <Button variant="ghost" onClick={() => setIsRegisterOpen(true)}>Register</Button>
          </>
        )}
      </div>
      <SignInDialog open={isSignInOpen} onOpenChange={setIsSignInOpen} />
      <RegisterDialog open={isRegisterOpen} onOpenChange={setIsRegisterOpen} />
    </div>
  )
}

function SignInDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const { users, setCurrentUser } = useAdminStore()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("test")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const user = users.find(u => u.email === email)
    if (user && password === "test") {
      setCurrentUser(user)
      onOpenChange(false)
      toast.success('Signed in successfully')
    } else {
      toast.error('Invalid credentials')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Sign In</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full">Sign In</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function RegisterDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const { users, setCurrentUser } = useAdminStore()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("test")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newUser: User = {
      id: (users.length + 1).toString(),
      name,
      email,
      role: 'Client'
    }
    setCurrentUser(newUser)
    onOpenChange(false)
    toast.success('Registered successfully')
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Register</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full">Register</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default function AdminDashboard() {
  const { currentUser, isSuperAdminMode } = useAdminStore()
  const [activeTab, setActiveTab] = useState("meal-planner")

  const getMenuItems = () => {
    const commonItems = [
      { label: "Meal Ordering", icon: ShoppingCart, tab: "meal-ordering" },
      { label: "My Orders", icon: FileText, tab: "my-orders" },
    ]

    const adminItems = [
      { label: "Meal Planner", icon: CalendarIcon, tab: "meal-planner" },
      { label: "Items", icon: List, tab: "items" },
      { label: "Media Gallery", icon: ImageIcon, tab: "media-gallery" },
      { label: "Orders", icon: FileText, tab: "orders" },
      { label: "Stock Movements", icon: ArrowUp, tab: "stock-movements" },
      { label: "Shipping Methods", icon: Truck, tab: "shipping-methods" },
      { label: "Payment Methods", icon: CreditCard, tab: "payment-methods" },
      { label: "Settings", icon: Settings, tab: "settings" },
    ]

    const shopManagerItems = [
      { label: "Meal Planner", icon: CalendarIcon, tab: "meal-planner" },
      { label: "Items", icon: List, tab: "items" },
      { label: "Media Gallery", icon: ImageIcon, tab: "media-gallery" },
      { label: "Orders", icon: FileText, tab: "orders" },
      { label: "Stock Movements", icon: ArrowUp, tab: "stock-movements" },
    ]

    const superAdminItems = [
      { label: "Tenant Registrations", icon: Building, tab: "tenant-registrations" },
      { label: "Tenants Administration", icon: Building, tab: "tenants-administration" },
    ]

    let items = commonItems

    if (currentUser?.role === "Admin") {
      items = [...items, ...adminItems]
    } else if (currentUser?.role === "Shop manager") {
      items = [...items, ...shopManagerItems]
    }

    if (isSuperAdminMode) {
      items = [...items, ...superAdminItems]
    }

    // Add Tenant Signup tab for users who are not logged in
    if (!currentUser) {
      items.push({ label: "Tenant Signup", icon: User, tab: "tenant-signup" })
    }

    return items
  }

  const menuItems = getMenuItems()

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <AdminBar />
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-md">
          <div className="p-4">
            <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
          </div>
          <nav className="mt-6">
            {menuItems.map((item) => (
              <a
                key={item.tab}
                href="#"
                className={`flex items-center px-4 py-2 text-gray-700 ${activeTab === item.tab ? "bg-gray-200" : "hover:bg-gray-200"}`}
                onClick={() => setActiveTab(item.tab)}
              >
                <item.icon className="w-5 h-5 mr-2" />
                {item.label}
              </a>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-6xl mx-auto">
            {activeTab === "meal-planner" && <MealPlanner />}
            {activeTab === "items" && <ItemManagement />}
            {activeTab === "media-gallery" && <MediaGallery />}
            {activeTab === "meal-ordering" && <MealOrdering />}
            {activeTab === "orders" && <Orders />}
            {activeTab === "my-orders" && <MyOrders />}
            {activeTab === "stock-movements" && <StockMovements />}
            {activeTab === "shipping-methods" && <ShippingMethodSettings />}
            {activeTab === "payment-methods" && <PaymentMethodSettings />}
            {activeTab === "settings" && <ShopSettings />}
            {activeTab === "tenant-registrations" && isSuperAdminMode && <TenantRegistrations />}
            {activeTab === "tenants-administration" && isSuperAdminMode && <TenantsAdministration />}
            {activeTab === "tenant-signup" && <TenantSignup />}
          </div>
        </main>
        <Toaster />
      </div>
    </div>
  )
}

function MealPlanner() {
  const { mealOfferings, items, addMealOffering, editMealOffering, deleteMealOffering, duplicateMealOffering, assignItem, removeItem, toggleMealOfferingStatus, sortMealItems, shopSettings } = useAdminStore()
  const [openPopovers, setOpenPopovers] = useState<{ [key: string]: boolean }>({})
  const [editingOffering, setEditingOffering] = useState<MealOffering | null>(null)
  const [expandedOfferings, setExpandedOfferings] = useState<number[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [dateFilter, setDateFilter] = useState("")
  const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'published'>('all')
  const [locationFilter, setLocationFilter] = useState<string>('all')

  const handleAddMealOffering = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const name = formData.get("meal-name") as string
    const startDate = new Date(formData.get("start-date") as string)
    const endDate = new Date(formData.get("end-date") as string)
    const status = formData.get("status") as 'draft' | 'published'
    const locationId = formData.get("location") as string

    if (name && startDate && endDate && locationId) {
      const newMealOffering: MealOffering = {
        id: Date.now(),
        name,
        startDate,
        endDate,
        items: {
          Entrées: [],
          Plats: [],
          Accompagnements: [],
          Desserts: []
        },
        status,
        locationId
      }
      addMealOffering(newMealOffering)
      toast.success('New meal offering added successfully')
    }
  }

  const togglePopover = (key: string, value: boolean) => {
    setOpenPopovers(prev => ({ ...prev, [key]: value }))
  }

  const toggleExpanded = (id: number) => {
    setExpandedOfferings(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    )
  }

  const categories: Array<keyof MealOffering['items']> = ['Entrées', 'Plats', 'Accompagnements', 'Desserts']

  const filteredMealOfferings = mealOfferings.filter(offering => 
    offering.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (dateFilter ? new Date(offering.startDate) >= new Date(dateFilter) : true) &&
    (statusFilter === 'all' || offering.status === statusFilter) &&
    (locationFilter === 'all' || offering.locationId === locationFilter)
  )

  return (
    <>
      <h2 className="text-3xl font-bold text-gray-800 mb-8">Meal Planner</h2>
      
      {/* Meal Offering Form */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Create Meal Offering</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddMealOffering} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="meal-name">Meal Name</Label>
                <Input id="meal-name" name="meal-name" placeholder="Enter meal name" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="start-date">Start Date and Time</Label>
                <Input id="start-date" name="start-date" type="datetime-local" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end-date">End Date and Time</Label>
                <Input id="end-date" name="end-date" type="datetime-local" required />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select name="status" defaultValue="draft">
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Select name="location" defaultValue={shopSettings.primaryLocationId}>
                  <SelectTrigger id="location">
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    {shopSettings.locations.map((location) => (
                      <SelectItem key={location.id} value={location.id}>{location.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button type="submit" className="w-full">
              <Plus className="w-4 h-4 mr-2" /> Add Meal Offering
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Meal Offerings List */}
      <Card>
        <CardHeader>
          <CardTitle>Scheduled Meal Offerings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex space-x-4">
            <div className="flex-1">
              <Label htmlFor="search-meals">Search Meals</Label>
              <Input
                id="search-meals"
                placeholder="Search by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex-1">
              <Label htmlFor="date-filter">Filter by Date</Label>
              <Input
                id="date-filter"
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              />
            </div>
            <div className="flex-1">
              <Label htmlFor="status-filter">Filter by Status</Label>
              <Select value={statusFilter} onValueChange={(value: 'all' | 'draft' | 'published') => setStatusFilter(value)}>
                <SelectTrigger id="status-filter">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <Label htmlFor="location-filter">Filter by Location</Label>
              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger id="location-filter">
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  {shopSettings.locations.map((location) => (
                    <SelectItem key={location.id} value={location.id}>{location.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <ScrollArea className="h-[600px]">
            {filteredMealOfferings.length > 0 ? (
              <ul className="space-y-8">
                {filteredMealOfferings.map((offering) => (
                  <li key={offering.id} className="bg-gray-100 rounded p-4">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleExpanded(offering.id)}
                          aria-expanded={expandedOfferings.includes(offering.id)}
                        >
                          {expandedOfferings.includes(offering.id) ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                          <span className="sr-only">
                            {expandedOfferings.includes(offering.id) ? "Collapse" : "Expand"}
                          </span>
                        </Button>
                        <h3 className="font-bold text-lg">
                          {offering.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {new Date(offering.startDate).toLocaleString()} to {new Date(offering.endDate).toLocaleString()}
                        </p>
                        <Badge variant={offering.status === 'published' ? "default" : "secondary"}>
                          {offering.status}
                        </Badge>
                        <Badge variant="outline">
                          {shopSettings.locations.find(l => l.id === offering.locationId)?.name || 'Unknown Location'}
                        </Badge>
                      </div>
                      <div className="space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            toggleMealOfferingStatus(offering.id)
                            toast.success(`Meal offering status changed to ${offering.status === 'published' ? 'draft' : 'published'}`)
                          }}
                        >
                          {offering.status === 'published' ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                          {offering.status === 'published' ? 'Unpublish' : 'Publish'}
                        </Button>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Edit className="w-4 h-4 mr-2" /> Edit
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Edit Meal Offering</DialogTitle>
                            </DialogHeader>
                            <EditMealOfferingForm
                              offering={offering}
                              onSave={(updatedOffering) => {
                                editMealOffering(offering.id, updatedOffering)
                                setEditingOffering(null)
                                toast.success('Meal offering updated successfully')
                              }}
                              onCancel={() => setEditingOffering(null)}
                            />
                          </DialogContent>
                        </Dialog>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            duplicateMealOffering(offering.id)
                            toast.success('Meal offering duplicated successfully')
                          }}
                        >
                          <Copy className="w-4 h-4 mr-2" /> Duplicate
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            deleteMealOffering(offering.id)
                            toast.success('Meal offering deleted successfully')
                          }}
                        >
                          <Trash2 className="w-4 h-4 mr-2" /> Delete
                        </Button>
                      </div>
                    </div>
                    {expandedOfferings.includes(offering.id) && (
                      <div className="mt-4 space-y-4">
                        {categories.map((category) => (
                          <div key={category} className="bg-white p-4 rounded-lg">
                            <h4 className="font-semibold mb-2">{category}</h4>
                            <ul className="space-y-2 mb-4">
                              {offering.items[category].map((item, index) => (
                                <li key={item.id} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                                  <span>{item.name} - €{item.price?.toFixed(2) ?? 'N/A'} - Tax: {item.taxRate}% - Stock: {item.stock[offering.locationId] ?? 'N/A'}</span>
                                  <div className="flex items-center space-x-2">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => sortMealItems(offering.id, category, index, Math.max(0, index - 1))}
                                      disabled={index === 0}
                                    >
                                      <ArrowUp className="w-4 h-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => sortMealItems(offering.id, category, index, Math.min(offering.items[category].length - 1, index + 1))}
                                      disabled={index === offering.items[category].length - 1}
                                    >
                                      <ArrowDown className="w-4 h-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => {
                                        removeItem(offering.id, category, item.id)
                                        toast.success(`${item.name} removed from ${category}`)
                                      }}
                                    >
                                      <X className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </li>
                              ))}
                            </ul>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" className="w-full justify-start">
                                  <Plus className="mr-2 h-4 w-4" /> Add {category}
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-[800px]">
                                <DialogHeader>
                                  <DialogTitle>Add {category}</DialogTitle>
                                </DialogHeader>
                                <DataTable
                                  columns={columns}
                                  data={items.filter(item => item.category === category && item.stock[offering.locationId] > 0 && item.availableLocations.includes(offering.locationId))}
                                  onItemSelect={(item) => {
                                    assignItem(offering.id, category, item)
                                    togglePopover(`${offering.id}-${category}`, false)
                                    toast.success(`${item.name} added to ${category}`)
                                  }}
                                />
                              </DialogContent>
                            </Dialog>
                          </div>
                        ))}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-gray-500">No meal offerings found.</p>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </>
  )
}

function EditMealOfferingForm({ offering, onSave, onCancel }: { offering: MealOffering, onSave: (updatedOffering: Partial<MealOffering>) => void, onCancel: () => void }) {
  const [name, setName] = useState(offering.name)
  const [startDate, setStartDate] = useState(offering.startDate.toISOString().slice(0, 16))
  const [endDate, setEndDate] = useState(offering.endDate.toISOString().slice(0, 16))
  const [status, setStatus] = useState(offering.status)
  const [locationId, setLocationId] = useState(offering.locationId)
  const { shopSettings } = useAdminStore()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      name,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      status,
      locationId
    })
    toast.success('Meal offering updated successfully')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="edit-meal-name">Meal Name</Label>
        <Input
          id="edit-meal-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="edit-start-date">Start Date and Time</Label>
        <Input
          id="edit-start-date"
          type="datetime-local"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="edit-end-date">End Date and Time</Label>
        <Input
          id="edit-end-date"
          type="datetime-local"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="edit-status">Status</Label>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger id="edit-status">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="published">Published</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="edit-location">Location</Label>
        <Select value={locationId} onValueChange={setLocationId}>
          <SelectTrigger id="edit-location">
            <SelectValue placeholder="Select location" />
          </SelectTrigger>
          <SelectContent>
            {shopSettings.locations.map((location) => (
              <SelectItem key={location.id} value={location.id}>{location.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Save Changes</Button>
      </div>
    </form>
  )
}

const columns: ColumnDef<Item>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => `€${row.original.price?.toFixed(2) ?? 'N/A'}`,
  },
  {
    accessorKey: "taxRate",
    header: "Tax Rate",
    cell: ({ row }) => `${row.original.taxRate}%`,
  },
  {
    accessorKey: "stock",
    header: "Stock",
    cell: ({ row }) => {
      const stockEntries = Object.entries(row.original.stock)
      return stockEntries.map(([locationId, stockValue]) => (
        <div key={locationId}>{locationId}: {stockValue}</div>
      ))
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const item = row.original
      return (
        <Button
          onClick={() => {
            // This will be handled in the DataTable component
          }}
        >
          Add
        </Button>
      )
    },
  },
]

function DataTable({
  columns,
  data,
  onItemSelect,
}: {
  columns: ColumnDef<Item>[]
  data: Item[]
  onItemSelect: (item: Item) => void
}) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  })

  return (
    <div>
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter names..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {cell.column.id === "actions" ? (
                        <Button onClick={() => onItemSelect(row.original)}>
                          Add
                        </Button>
                      ) : (
                        flexRender(cell.column.columnDef.cell, cell.getContext())
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  )
}

function ItemManagement() {
  const { items, addItem, updateItem, deleteItem, setItemFeaturedImage, shopSettings } = useAdminStore()
  const [newItemName, setNewItemName] = useState("")
  const [newItemCategory, setNewItemCategory] = useState("")
  const [newItemPrice, setNewItemPrice] = useState("")
  const [newItemTaxRate, setNewItemTaxRate] = useState("0")
  const [newItemStock, setNewItemStock] = useState<ItemStock>({})
  const [newItemDescription, setNewItemDescription] = useState("")
  const [newItemAttributes, setNewItemAttributes] = useState<Attribute[]>([{ key: "", value: "" }])
  const [newItemAvailableLocations, setNewItemAvailableLocations] = useState<string[]>([])
  const [editingItem, setEditingItem] = useState<Item | null>(null)
  const [isMediaLibraryOpen, setIsMediaLibraryOpen] = useState(false)
  const [currentItemForImage, setCurrentItemForImage] = useState<number | null>(null)

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault()
    if (newItemName && newItemCategory && newItemPrice) {
      const newItem: Item = {
        id: Date.now(),
        name: newItemName,
        category: newItemCategory,
        price: parseFloat(newItemPrice),
        taxRate: parseFloat(newItemTaxRate),
        stock: newItemStock,
        description: newItemDescription,
        attributes: newItemAttributes.filter(attr => attr.key && attr.value),
        availableLocations: newItemAvailableLocations,
      }
      addItem(newItem)
      resetForm()
      toast.success('Item added successfully')
    }
  }

  const handleUpdateItem = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingItem) {
      updateItem(editingItem.id, editingItem)
      setEditingItem(null)
      toast.success('Item updated successfully')
    }
  }

  const resetForm = () => {
    setNewItemName("")
    setNewItemCategory("")
    setNewItemPrice("")
    setNewItemTaxRate("0")
    setNewItemStock({})
    setNewItemDescription("")
    setNewItemAttributes([{ key: "", value: "" }])
    setNewItemAvailableLocations([])
  }

  const handleAttributeChange = (index: number, field: 'key' | 'value', value: string) => {
    const updatedAttributes = editingItem
      ? [...editingItem.attributes]
      : [...newItemAttributes]
    updatedAttributes[index] = { ...updatedAttributes[index], [field]: value }
    if (editingItem) {
      setEditingItem({ ...editingItem, attributes: updatedAttributes })
    } else {
      setNewItemAttributes(updatedAttributes)
    }
  }

  const addAttribute = () => {
    if (editingItem) {
      setEditingItem({
        ...editingItem,
        attributes: [...editingItem.attributes, { key: "", value: "" }]
      })
    } else {
      setNewItemAttributes([...newItemAttributes, { key: "", value: "" }])
    }
  }

  const removeAttribute = (index: number) => {
    if (editingItem) {
      const updatedAttributes = editingItem.attributes.filter((_, i) => i !== index)
      setEditingItem({ ...editingItem, attributes: updatedAttributes })
    } else {
      const updatedAttributes = newItemAttributes.filter((_, i) => i !== index)
      setNewItemAttributes(updatedAttributes)
    }
  }

  const openMediaLibrary = (itemId: number) => {
    setCurrentItemForImage(itemId)
    setIsMediaLibraryOpen(true)
  }

  const handleSelectImage = (imageUrl: string) => {
    if (currentItemForImage !== null) {
      setItemFeaturedImage(currentItemForImage, imageUrl)
      setIsMediaLibraryOpen(false)
      setCurrentItemForImage(null)
      toast.success('Featured image updated')
    }
  }

  const handleStockChange = (locationId: string, value: string) => {
    const stockValue = parseInt(value) || 0
    if (editingItem) {
      setEditingItem({
        ...editingItem,
        stock: { ...editingItem.stock, [locationId]: stockValue }
      })
    } else {
      setNewItemStock({ ...newItemStock, [locationId]: stockValue })
    }
  }

  const handleAvailableLocationChange = (locationId: string, checked: boolean) => {
    if (editingItem) {
      const updatedLocations = checked
        ? [...editingItem.availableLocations, locationId]
        : editingItem.availableLocations.filter(id => id !== locationId)
      setEditingItem({ ...editingItem, availableLocations: updatedLocations })
    } else {
      const updatedLocations = checked
        ? [...newItemAvailableLocations, locationId]
        : newItemAvailableLocations.filter(id => id !== locationId)
      setNewItemAvailableLocations(updatedLocations)
    }
  }

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-8">Item Management</h2>
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>{editingItem ? "Edit Item" : "Add New Item"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={editingItem ? handleUpdateItem : handleAddItem} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="item-name">Item Name</Label>
                <Input
                  id="item-name"
                  value={editingItem ? editingItem.name : newItemName}
                  onChange={(e) => editingItem ? setEditingItem({ ...editingItem, name: e.target.value }) : setNewItemName(e.target.value)}
                  placeholder="Enter item name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="item-category">Category</Label>
                <Select
                  value={editingItem ? editingItem.category : newItemCategory}
                  onValueChange={(value) => editingItem ? setEditingItem({ ...editingItem, category: value }) : setNewItemCategory(value)}
                  required
                >
                  <SelectTrigger id="item-category">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Entrées">Entrées</SelectItem>
                    <SelectItem value="Plats">Plats</SelectItem>
                    <SelectItem value="Accompagnements">Accompagnements</SelectItem>
                    <SelectItem value="Desserts">Desserts</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="item-price">Price (€)</Label>
                <Input
                  id="item-price"
                  type="number"
                  step="0.01"
                  value={editingItem ? editingItem.price : newItemPrice}
                  onChange={(e) => editingItem ? setEditingItem({ ...editingItem, price: parseFloat(e.target.value) }) : setNewItemPrice(e.target.value)}
                  placeholder="Enter price in euros"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="item-tax-rate">Tax Rate</Label>
                <Select
                  value={editingItem ? editingItem.taxRate.toString() : newItemTaxRate}
                  onValueChange={(value) => editingItem ? setEditingItem({ ...editingItem, taxRate: parseFloat(value) }) : setNewItemTaxRate(value)}
                  required
                >
                  <SelectTrigger id="item-tax-rate">
                    <SelectValue placeholder="Select tax rate" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">0%</SelectItem>
                    <SelectItem value="5">5%</SelectItem>
                    <SelectItem value="10">10%</SelectItem>
                    <SelectItem value="20">20%</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Stock by Location</Label>
              {shopSettings.locations.map((location) => (
                <div key={location.id} className="flex items-center space-x-2">
                  <Label htmlFor={`stock-${location.id}`}>{location.name}</Label>
                  <Input
                    id={`stock-${location.id}`}
                    type="number"
                    value={editingItem ? editingItem.stock[location.id] || 0 : newItemStock[location.id] || 0}
                    onChange={(e) => handleStockChange(location.id, e.target.value)}
                    placeholder="Enter stock quantity"
                  />
                </div>
              ))}
            </div>
            <div className="space-y-2">
              <Label>Available Locations</Label>
              {shopSettings.locations.map((location) => (
                <div key={location.id} className="flex items-center space-x-2">
                  <Switch
                    id={`location-${location.id}`}
                    checked={editingItem ? editingItem.availableLocations.includes(location.id) : newItemAvailableLocations.includes(location.id)}
                    onCheckedChange={(checked) => handleAvailableLocationChange(location.id, checked)}
                  />
                  <Label htmlFor={`location-${location.id}`}>{location.name}</Label>
                </div>
              ))}
            </div>
            <div className="space-y-2">
              <Label htmlFor="item-description">Description (Optional)</Label>
              <Textarea
                id="item-description"
                value={editingItem ? editingItem.description : newItemDescription}
                onChange={(e) => editingItem ? setEditingItem({ ...editingItem, description: e.target.value }) : setNewItemDescription(e.target.value)}
                placeholder="Enter item description"
              />
            </div>
            <div className="space-y-2">
              <Label>Attributes</Label>
              {(editingItem ? editingItem.attributes : newItemAttributes).map((attr, index) => (
                <div key={index} className="flex space-x-2">
                  <Input
                    placeholder="Key"
                    value={attr.key}
                    onChange={(e) => handleAttributeChange(index, 'key', e.target.value)}
                  />
                  <Input
                    placeholder="Value"
                    value={attr.value}
                    onChange={(e) => handleAttributeChange(index, 'value', e.target.value)}
                  />
                  <Button type="button" variant="outline" onClick={() => removeAttribute(index)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              <Button type="button" variant="outline" onClick={addAttribute}>
                <Plus className="w-4 h-4 mr-2" /> Add Attribute
              </Button>
            </div>
            <Button type="submit" className="w-full">
              {editingItem ? "Update Item" : "Add Item"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Item List</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px]">
            <div className="space-y-4">
              {["Entrées", "Plats", "Accompagnements", "Desserts"].map((category) => (
                <div key={category}>
                  <h3 className="font-semibold mb-2">{category}</h3>
                  <ul className="space-y-2">
                    {items
                      .filter((item) => item.category === category)
                      .map((item) => (
                        <li key={item.id} className="flex items-center justify-between bg-gray-100 p-2 rounded">
                          <div className="flex items-center space-x-2">
                            {item.featuredImage ? (
                              <img src={item.featuredImage} alt={item.name} className="w-10 h-10 object-cover rounded" />
                            ) : (
                              <div className="w-10 h-10 bg-gray-300 rounded flex items-center justify-center">
                                <ImageIcon className="w-6 h-6 text-gray-500" />
                              </div>
                            )}
                            <div>
                              <span className="font-medium">{item.name}</span>
                              <span className="ml-2 text-sm text-gray-600">Price: €{item.price?.toFixed(2) ?? 'N/A'}</span>
                              <span className="ml-2 text-sm text-gray-600">Tax: {item.taxRate}%</span>
                              {Object.entries(item.stock).map(([locationId, stockValue]) => (
                                <span key={locationId} className="ml-2 text-sm text-gray-600">
                                  {shopSettings.locations.find(l => l.id === locationId)?.name}: {stockValue}
                                </span>
                              ))}
                              <div className="text-sm text-gray-600">
                                Available at: {item.availableLocations.map(id => shopSettings.locations.find(l => l.id === id)?.name).join(', ')}
                              </div>
                            </div>
                          </div>
                          <div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openMediaLibrary(item.id)}
                              className="mr-2"
                            >
                              <ImageIcon className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setEditingItem(item)}
                              className="mr-2"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                deleteItem(item.id)
                                toast.success('Item deleted successfully')
                              }}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </li>
                      ))}
                  </ul>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
      {isMediaLibraryOpen && (
        <MediaLibraryPopup onClose={() => setIsMediaLibraryOpen(false)} onSelect={handleSelectImage} />
      )}
    </div>
  )
}

function MediaGallery() {
  const { mediaItems, addMediaItem, deleteMediaItem } = useAdminStore()
  const [searchTerm, setSearchTerm] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const filteredMediaItems = mediaItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const newMediaItem: MediaItem = {
          id: Date.now(),
          name: file.name,
          url: reader.result as string,
          type: file.type.startsWith('image/') ? 'image' : 'video',
        }
        addMediaItem(newMediaItem)
        toast.success('Media item added successfully')
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-800">Media Gallery</h2>
        <Button onClick={() => fileInputRef.current?.click()}>
          <Plus className="w-4 h-4 mr-2" /> Upload New File
        </Button>
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileUpload}
          accept="image/*,video/*"
        />
      </div>
      <div className="flex items-center space-x-2">
        <Search className="w-5 h-5 text-gray-500" />
        <Input
          placeholder="Search media..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredMediaItems.map((item) => (
          <div key={item.id} className="relative group">
            {item.type === 'image' ? (
              <img src={item.url} alt={item.name} className="w-full h-40 object-cover rounded-lg" />
            ) : (
              <video src={item.url} className="w-full h-40 object-cover rounded-lg" />
            )}
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  deleteMediaItem(item.id)
                  toast.success('Media item deleted successfully')
                }}
              >
                <Trash2 className="w-4 h-4 mr-2" /> Delete
              </Button>
            </div>
            <p className="mt-2 text-sm text-gray-600 truncate">{item.name}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function MediaLibraryPopup({ onClose, onSelect }: { onClose: () => void; onSelect: (imageUrl: string) => void }) {
  const { mediaItems } = useAdminStore()
  const [searchTerm, setSearchTerm] = useState("")

  const filteredMediaItems = mediaItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) && item.type === 'image'
  )

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Select Image</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Search className="w-5 h-5 text-gray-500" />
            <Input
              placeholder="Search images..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
          <div className="grid grid-cols-3 gap-4 max-h-[400px] overflow-y-auto">
            {filteredMediaItems.map((item) => (
              <div key={item.id} className="relative group cursor-pointer" onClick={() => onSelect(item.url)}>
                <img src={item.url} alt={item.name} className="w-full h-32 object-cover rounded-lg" />
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="secondary" size="sm">Select</Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function MealOrdering() {
  const { mealOfferings, addToCart, cart, removeFromCart, updateCartItemQuantity, shopSettings } = useAdminStore()
  const [selectedOffering, setSelectedOffering] = useState<MealOffering | null>(null)
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
  const [selectedLocationId, setSelectedLocationId] = useState(shopSettings.primaryLocationId)
  const [viewMode, setViewMode] = useState<'card' | 'list'>('card')
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const currentDate = new Date()
    const activeOffering = mealOfferings.find(offering => 
      offering.status === 'published' &&
      new Date(offering.startDate) <= currentDate &&
      new Date(offering.endDate) >= currentDate &&
      offering.locationId === selectedLocationId
    )
    setSelectedOffering(activeOffering || null)
  }, [mealOfferings, selectedLocationId])

  const handleLocationChange = (locationId: string) => {
    setSelectedLocationId(locationId)
    setSelectedOffering(null)
  }

  const handleOfferingChange = (offeringId: string) => {
    const offering = mealOfferings.find(o => o.id.toString() === offeringId)
    if (offering) {
      setSelectedOffering(offering)
    }
  }

  const categories: Array<keyof MealOffering['items']> = ['Entrées', 'Plats', 'Accompagnements', 'Desserts']

  const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0)

  const filteredItems = selectedOffering
    ? categories.flatMap(category =>
        selectedOffering.items[category].filter(item =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    : []

  return (
    <div className="flex flex-col md:flex-row gap-8">
      <div className="flex-grow">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Meal Ordering</h2>
        <div className="mb-6">
          <Label htmlFor="location">Select Location</Label>
          <Select value={selectedLocationId} onValueChange={handleLocationChange}>
            <SelectTrigger id="location">
              <SelectValue placeholder="Select a location" />
            </SelectTrigger>
            <SelectContent>
              {shopSettings.locations.map((location) => (
                <SelectItem key={location.id} value={location.id}>{location.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="mb-6">
          <Label htmlFor="meal-offering">Select Meal Offering</Label>
          <Select
            value={selectedOffering?.id.toString()}
            onValueChange={handleOfferingChange}
          >
            <SelectTrigger id="meal-offering">
              <SelectValue placeholder="Select a meal offering" />
            </SelectTrigger>
            <SelectContent>
              {mealOfferings
                .filter(offering => offering.status === 'published' && offering.locationId === selectedLocationId)
                .map(offering => (
                  <SelectItem key={offering.id} value={offering.id.toString()}>
                    {offering.name} ({new Date(offering.startDate).toLocaleDateString()} - {new Date(offering.endDate).toLocaleDateString()})
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>

        {selectedOffering && (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Button
                  variant={viewMode === 'card' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('card')}
                >
                  <Grid className="w-4 h-4 mr-2" />
                  Card View
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="w-4 h-4 mr-2" />
                  List View
                </Button>
              </div>
              <div className="relative w-64">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {categories.map((category) => (
              <div key={category}>
                <h3 className="text-xl font-semibold mb-4">{category}</h3>
                {viewMode === 'card' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {selectedOffering.items[category]
                      .filter(item =>
                        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        item.description?.toLowerCase().includes(searchTerm.toLowerCase())
                      )
                      .map(item => (
                        <Card key={item.id} className="flex flex-col">
                          <CardHeader>
                            <CardTitle>{item.name}</CardTitle>
                          </CardHeader>
                          <CardContent className="flex-grow">
                            {item.featuredImage && (
                              <img src={item.featuredImage} alt={item.name} className="w-full h-40 object-cover rounded-lg mb-4" />
                            )}
                            <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                            <div className="space-y-1">
                              {item.attributes.map((attr, index) => (
                                <p key={index} className="text-sm">
                                  <span className="font-semibold">{attr.key}:</span> {attr.value}
                                </p>
                              ))}
                            </div>
                            <div className="mt-4">
                              <p className="font-semibold">Price: €{item.price.toFixed(2)}</p>
                              <p className="text-sm text-gray-600">Tax: {item.taxRate}%</p>
                              <p className="font-semibold">
                                Price (T.T.C.): €{(item.price * (1 + item.taxRate / 100)).toFixed(2)}
                              </p>
                              <p className="text-sm text-gray-600">Stock: {item.stock[selectedLocationId] || 0}</p>
                            </div>
                          </CardContent>
                          <CardContent className="pt-0">
                            <Button 
                              onClick={() => {
                                addToCart(item, selectedLocationId)
                                toast.success(`${item.name} added to cart`)
                              }}
                              disabled={!item.availableLocations.includes(selectedLocationId) || !item.stock[selectedLocationId] || item.stock[selectedLocationId] <= 0}
                              className="w-full"
                            >
                              {!item.availableLocations.includes(selectedLocationId) ? 'Not Available' : 
                               item.stock[selectedLocationId] > 0 ? 'Add to Cart' : 'Out of Stock'}
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Image</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Stock</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedOffering.items[category]
                        .filter(item =>
                          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.description?.toLowerCase().includes(searchTerm.toLowerCase())
                        )
                        .map(item => (
                          <TableRow key={item.id}>
                            <TableCell>
                              {item.featuredImage && (
                                <img src={item.featuredImage} alt={item.name} className="w-16 h-16 object-cover rounded" />
                              )}
                            </TableCell>
                            <TableCell>{item.name}</TableCell>
                            <TableCell>{item.description}</TableCell>
                            <TableCell>€{item.price.toFixed(2)}</TableCell>
                            <TableCell>{item.stock[selectedLocationId] || 0}</TableCell>
                            <TableCell>
                              <Button 
                                onClick={() => {
                                  addToCart(item, selectedLocationId)
                                  toast.success(`${item.name} added to cart`)
                                }}
                                disabled={!item.availableLocations.includes(selectedLocationId) || !item.stock[selectedLocationId] || item.stock[selectedLocationId] <= 0}
                                size="sm"
                              >
                                {!item.availableLocations.includes(selectedLocationId) ? 'Not Available' : 
                                 item.stock[selectedLocationId] > 0 ? 'Add to Cart' : 'Out of Stock'}
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="md:w-1/3">
        <Card className="sticky top-4">
          <CardHeader>
            <CardTitle>Your Cart</CardTitle>
          </CardHeader>
          <CardContent>
            {cart.length === 0 ? (
              <p>Your cart is empty.</p>
            ) : (
              <div className="space-y-4">
                {cart.map(item => (
                  <div key={item.id} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-500">€{item.price.toFixed(2)} x {item.quantity}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateCartItemQuantity(item.id, Math.max(1, item.quantity - 1))}
                      >
                        -
                      </Button>
                      <span>{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateCartItemQuantity(item.id, item.quantity + 1)}
                        disabled={item.quantity >= (item.stock[selectedLocationId] || 0)}
                      >
                        +
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          removeFromCart(item.id)
                          toast.success(`${item.name} removed from cart`)
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                <div className="border-t pt-4">
                  <p className="font-bold text-lg">Total: €{totalPrice.toFixed(2)}</p>
                </div>
                <Button className="w-full" onClick={() => setIsCheckoutOpen(true)}>
                  Proceed to Checkout
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      {isCheckoutOpen && <OrderCheckout onClose={() => setIsCheckoutOpen(false)} selectedLocationId={selectedLocationId} />}
    </div>
  )
}

function OrderCheckout({ onClose, selectedLocationId }: { onClose: () => void; selectedLocationId: string }) {
  const { cart, addOrder, clearCart, shopSettings, currentUser } = useAdminStore()
  const [customerName, setCustomerName] = useState(currentUser?.name || "")
  const [customerEmail, setCustomerEmail] = useState(currentUser?.email || "")
  const [customerPhone, setCustomerPhone] = useState("")
  const [deliveryAddress, setDeliveryAddress] = useState("")
  const [showConfetti, setShowConfetti] = useState(false)
  const [orderConfirmed, setOrderConfirmed] = useState(false)
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null)
  const [selectedShippingMethod, setSelectedShippingMethod] = useState<string>("")
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("")

  const totalAmount = cart.reduce((total, item) => total + item.price * item.quantity, 0)
  const selectedShipping = shopSettings.shippingMethods.find(method => method.id === selectedShippingMethod)
  const totalWithShipping = totalAmount + (selectedShipping?.price || 0)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedShippingMethod || !selectedPaymentMethod) {
      toast.error('Please select both shipping and payment methods')
      return
    }
    const newOrder: Order = {
      id: Date.now(),
      customerName,
      customerEmail,
      customerPhone,
      deliveryAddress,
      items: cart,
      totalAmount: totalWithShipping,
      status: 'pending',
      createdAt: new Date(),
      locationId: selectedLocationId,
      shippingMethodId: selectedShippingMethod,
      paymentMethodId: selectedPaymentMethod,
    }
    addOrder(newOrder)
    clearCart()
    setShowConfetti(true)
    setOrderConfirmed(true)
    setConfirmedOrder(newOrder)
    setTimeout(() => setShowConfetti(false), 5000)
  }

  if (orderConfirmed && confirmedOrder) {
    return (
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Order Confirmation</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>Thank you for your order, {confirmedOrder.customerName}!</p>
            <p>Order ID: {confirmedOrder.id}</p>
            <p>Total Amount: €{confirmedOrder.totalAmount.toFixed(2)}</p>
            <h3 className="font-semibold">Order Details:</h3>
            <ul className="list-disc pl-5">
              {confirmedOrder.items.map((item) => (
                <li key={item.id}>
                  {item.name} x {item.quantity} - €{(item.price * item.quantity).toFixed(2)}
                </li>
              ))}
            </ul>
            <p>Shipping Method: {shopSettings.shippingMethods.find(m => m.id === confirmedOrder.shippingMethodId)?.name}</p>
            <p>Payment Method: {shopSettings.paymentMethods.find(m => m.id === confirmedOrder.paymentMethodId)?.name}</p>
            <p>We'll send a confirmation email to {confirmedOrder.customerEmail} shortly.</p>
            <Button onClick={onClose} className="w-full">Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Checkout</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="customer-name">Name</Label>
            <Input
              id="customer-name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="customer-email">Email</Label>
            <Input
              id="customer-email"
              type="email"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="customer-phone">Phone</Label>
            <Input
              id="customer-phone"
              type="tel"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="delivery-address">Delivery Address</Label>
            <Textarea
              id="delivery-address"
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={shopSettings.locations.find(l => l.id === selectedLocationId)?.name || ''}
              disabled
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="shipping-method">Shipping Method</Label>
            <Select value={selectedShippingMethod} onValueChange={setSelectedShippingMethod}>
              <SelectTrigger id="shipping-method">
                <SelectValue placeholder="Select shipping method" />
              </SelectTrigger>
              <SelectContent>
                {shopSettings.shippingMethods
                  .filter(method => method.enabled && method.availableLocations.includes(selectedLocationId))
                  .map((method) => (
                    <SelectItem key={method.id} value={method.id}>
                      {method.name} - €{method.price.toFixed(2)}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="payment-method">Payment Method</Label>
            <Select value={selectedPaymentMethod} onValueChange={setSelectedPaymentMethod}>
              <SelectTrigger id="payment-method">
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                {shopSettings.paymentMethods
                  .filter(method => method.enabled && method.availableLocations.includes(selectedLocationId))
                  .map((method) => (
                    <SelectItem key={method.id} value={method.id}>{method.name}</SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
          <div className="border-t pt-4">
            <h3 className="font-semibold mb-2">Order Summary</h3>
            {cart.map((item) => (
              <div key={item.id} className="flex justify-between items-center mb-2">
                <span>{item.name} x {item.quantity}</span>
                <span>€{(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            {selectedShipping && (
              <div className="flex justify-between items-center mb-2">
                <span>Shipping: {selectedShipping.name}</span>
                <span>€{selectedShipping.price.toFixed(2)}</span>
              </div>
            )}
            <div className="font-bold text-lg mt-4">
              Total: €{totalWithShipping.toFixed(2)}
            </div>
          </div>
          <Button type="submit" className="w-full">
            Place Order
          </Button>
        </form>
      </DialogContent>
      {showConfetti && <Confetti />}
    </Dialog>
  )
}

function Orders() {
  const { orders, updateOrderStatus, shopSettings } = useAdminStore()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<Order['status'] | 'all'>('all')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [locationFilter, setLocationFilter] = useState<string>('all')

  const filteredOrders = orders.filter(order => 
    (order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
     order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (statusFilter === 'all' || order.status === statusFilter) &&
    (locationFilter === 'all' || order.locationId === locationFilter)
  )

  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-bold text-gray-800">Orders</h2>
      <div className="flex space-x-4">
        <div className="flex-1">
          <Input
            placeholder="Search by customer name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-48">
          <Select value={statusFilter} onValueChange={(value: Order['status'] | 'all') => setStatusFilter(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="w-48">
          <Select value={locationFilter} onValueChange={setLocationFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              {shopSettings.locations.map((location) => (
                <SelectItem key={location.id} value={location.id}>{location.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Total Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id} className="cursor-pointer hover:bg-gray-100" onClick={() => setSelectedOrder(order)}>
                  <TableCell>{order.id}</TableCell>
                  <TableCell>{order.customerName}</TableCell>
                  <TableCell>€{order.totalAmount.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant={
                      order.status === 'completed' ? 'default' :
                      order.status === 'processing' ? 'secondary' :
                      order.status === 'cancelled' ? 'destructive' : 'outline'
                    }>
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(order.createdAt).toLocaleString()}</TableCell>
                  <TableCell>{shopSettings.locations.find(l => l.id === order.locationId)?.name || 'Unknown'}</TableCell>
                  <TableCell>
                    <Select
                      value={order.status}
                      onValueChange={(value: Order['status']) => {
                        updateOrderStatus(order.id, value)
                        toast.success(`Order status updated to ${value}`)
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Update status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      {selectedOrder && (
        <OrderDetails order={selectedOrder} onClose={() => setSelectedOrder(null)} />
      )}
    </div>
  )
}

function OrderDetails({ order, onClose }: { order: Order; onClose: () => void }) {
  const { editOrder, shopSettings } = useAdminStore()
  const [editMode, setEditMode] = useState(false)
  const [editedOrder, setEditedOrder] = useState(order)

  const handleSave = () => {
    editOrder(order.id, editedOrder)
    setEditMode(false)
    toast.success('Order updated successfully')
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Order Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {editMode ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="edit-customer-name">Customer Name</Label>
                <Input
                  id="edit-customer-name"
                  value={editedOrder.customerName}
                  onChange={(e) => setEditedOrder({ ...editedOrder, customerName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-customer-email">Customer Email</Label>
                <Input
                  id="edit-customer-email"
                  value={editedOrder.customerEmail}
                  onChange={(e) => setEditedOrder({ ...editedOrder, customerEmail: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-customer-phone">Customer Phone</Label>
                <Input
                  id="edit-customer-phone"
                  value={editedOrder.customerPhone}
                  onChange={(e) => setEditedOrder({ ...editedOrder, customerPhone: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-delivery-address">Delivery Address</Label>
                <Textarea
                  id="edit-delivery-address"
                  value={editedOrder.deliveryAddress}
                  onChange={(e) => setEditedOrder({ ...editedOrder, deliveryAddress: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-location">Location</Label>
                <Select
                  value={editedOrder.locationId}
                  onValueChange={(value) => setEditedOrder({ ...editedOrder, locationId: value })}
                >
                  <SelectTrigger id="edit-location">
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    {shopSettings.locations.map((location) => (
                      <SelectItem key={location.id} value={location.id}>{location.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </>
          ) : (
            <>
              <p><strong>Customer Name:</strong> {order.customerName}</p>
              <p><strong>Customer Email:</strong> {order.customerEmail}</p>
              <p><strong>Customer Phone:</strong> {order.customerPhone}</p>
              <p><strong>Delivery Address:</strong> {order.deliveryAddress}</p>
              <p><strong>Location:</strong> {shopSettings.locations.find(l => l.id === order.locationId)?.name || 'Unknown'}</p>
              <p><strong>Shipping Method:</strong> {shopSettings.shippingMethods.find(m => m.id === order.shippingMethodId)?.name || 'Unknown'}</p>
              <p><strong>Payment Method:</strong> {shopSettings.paymentMethods.find(m => m.id === order.paymentMethodId)?.name || 'Unknown'}</p>
            </>
          )}
          <div className="border-t pt-4">
            <h3 className="font-semibold mb-2">Order Items</h3>
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between items-center mb-2">
                <span>{item.name} x {item.quantity}</span>
                <span>€{(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="font-bold text-lg mt-4">
              Total: €{order.totalAmount.toFixed(2)}
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            {editMode ? (
              <>
                <Button onClick={handleSave}>Save Changes</Button>
                <Button variant="outline" onClick={() => setEditMode(false)}>Cancel</Button>
              </>
            ) : (
              <>
                <Button onClick={() => setEditMode(true)}>Edit Order</Button>
                <Button onClick={handlePrint}>
                  <Printer className="w-4 h-4 mr-2" /> Print Receipt
                </Button>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function MyOrders() {
  const { orders, shopSettings, currentUser } = useAdminStore()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<Order['status'] | 'all'>('all')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  const filteredOrders = orders.filter(order => 
    order.customerEmail === currentUser?.email &&
    (order.id.toString().includes(searchTerm) ||
     order.customerName.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (statusFilter === 'all' || order.status === statusFilter)
  )

  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-bold text-gray-800">My Orders</h2>
      <div className="flex space-x-4">
        <div className="flex-1">
          <Input
            placeholder="Search by order ID or name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-48">
          <Select value={statusFilter} onValueChange={(value: Order['status'] | 'all') => setStatusFilter(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Total Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id} className="cursor-pointer hover:bg-gray-100" onClick={() => setSelectedOrder(order)}>
                  <TableCell>{order.id}</TableCell>
                  <TableCell>€{order.totalAmount.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant={
                      order.status === 'completed' ? 'default' :
                      order.status === 'processing' ? 'secondary' :
                      order.status === 'cancelled' ? 'destructive' : 'outline'
                    }>
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(order.createdAt).toLocaleString()}</TableCell>
                  <TableCell>{shopSettings.locations.find(l => l.id === order.locationId)?.name || 'Unknown'}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm" onClick={() => setSelectedOrder(order)}>
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      {selectedOrder && (
        <Dialog open={true} onOpenChange={() => setSelectedOrder(null)}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Order Details</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p><strong>Order ID:</strong> {selectedOrder.id}</p>
              <p><strong>Date:</strong> {new Date(selectedOrder.createdAt).toLocaleString()}</p>
              <p><strong>Status:</strong> {selectedOrder.status}</p>
              <p><strong>Delivery Address:</strong> {selectedOrder.deliveryAddress}</p>
              <p><strong>Location:</strong> {shopSettings.locations.find(l => l.id === selectedOrder.locationId)?.name || 'Unknown'}</p>
              <p><strong>Shipping Method:</strong> {shopSettings.shippingMethods.find(m => m.id === selectedOrder.shippingMethodId)?.name || 'Unknown'}</p>
              <p><strong>Payment Method:</strong> {shopSettings.paymentMethods.find(m => m.id === selectedOrder.paymentMethodId)?.name || 'Unknown'}</p>
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-2">Order Items</h3>
                {selectedOrder.items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center mb-2">
                    <span>{item.name} x {item.quantity}</span>
                    <span>€{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                <div className="font-bold text-lg mt-4">
                  Total: €{selectedOrder.totalAmount.toFixed(2)}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

function StockMovements() {
  const { stockMovements, items, cancelStockMovement, shopSettings } = useAdminStore()
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState<'all' | 'increase' | 'decrease'>('all')
  const [locationFilter, setLocationFilter] = useState<string>('all')

  const filteredMovements = stockMovements.filter(movement => 
    (items.find(item => item.id === movement.itemId)?.name.toLowerCase().includes(searchTerm.toLowerCase()) || '') &&
    (typeFilter === 'all' || movement.type === typeFilter) &&
    (locationFilter === 'all' || movement.locationId === locationFilter)
  )

  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-bold text-gray-800">Stock Movements</h2>
      <div className="flex space-x-4">
        <div className="flex-1">
          <Input
            placeholder="Search by item name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-48">
          <Select value={typeFilter} onValueChange={(value: 'all' | 'increase' | 'decrease') => setTypeFilter(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="increase">Increase</SelectItem>
              <SelectItem value="decrease">Decrease</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="w-48">
          <Select value={locationFilter} onValueChange={setLocationFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              {shopSettings.locations.map((location) => (
                <SelectItem key={location.id} value={location.id}>{location.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Item</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMovements.map((movement) => {
                const item = items.find(item => item.id === movement.itemId)
                return (
                  <TableRow key={movement.id}>
                    <TableCell>{new Date(movement.date).toLocaleString()}</TableCell>
                    <TableCell>{item?.name || 'Unknown Item'}</TableCell>
                    <TableCell>{movement.quantity}</TableCell>
                    <TableCell>
                      <Badge variant={movement.type === 'increase' ? 'default' : 'destructive'}>
                        {movement.type}
                      </Badge>
                    </TableCell>
                    <TableCell>{movement.reason}</TableCell>
                    <TableCell>{shopSettings.locations.find(l => l.id === movement.locationId)?.name || 'Unknown'}</TableCell>
                    <TableCell>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          cancelStockMovement(movement.id)
                          toast.success('Stock movement cancelled successfully')
                        }}
                      >
                        Cancel
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

function ShippingMethodSettings() {
  const { shopSettings, addShippingMethod, updateShippingMethod, deleteShippingMethod } = useAdminStore()
  const [editingMethod, setEditingMethod] = useState<ShippingMethod | null>(null)

  const handleAddShippingMethod = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const newShippingMethod: ShippingMethod = {
      id: Date.now().toString(),
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      price: parseFloat(formData.get('price') as string),
      estimatedDeliveryDays: parseInt(formData.get('estimatedDeliveryDays') as string),
      enabled: true,
      availableLocations: shopSettings.locations.map(location => location.id),
    }
    addShippingMethod(newShippingMethod)
    event.currentTarget.reset()
    toast.success('Shipping method added successfully')
  }

  const handleUpdateShippingMethod = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (editingMethod) {
      const formData = new FormData(event.currentTarget)
      const updatedMethod: Partial<ShippingMethod> = {
        name: formData.get('name') as string,
        description: formData.get('description') as string,
        price: parseFloat(formData.get('price') as string),
        estimatedDeliveryDays: parseInt(formData.get('estimatedDeliveryDays') as string),
        enabled: formData.get('enabled') === 'on',
        availableLocations: Array.from(formData.getAll('availableLocations') as string[]),
      }
      updateShippingMethod(editingMethod.id, updatedMethod)
      setEditingMethod(null)
      toast.success('Shipping method updated successfully')
    }
  }

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-gray-800">Shipping Method Settings</h2>
      
      <Card>
        <CardHeader>
          <CardTitle>Add New Shipping Method</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddShippingMethod} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Method Name</Label>
              <Input id="name" name="name" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>
              <Input id="price" name="price" type="number" step="0.01" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="estimatedDeliveryDays">Estimated Delivery Days</Label>
              <Input id="estimatedDeliveryDays" name="estimatedDeliveryDays" type="number" required />
            </div>
            <Button type="submit">Add Shipping Method</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Existing Shipping Methods</CardTitle>
        </CardHeader>
        <CardContent>
          {shopSettings.shippingMethods.map((method) => (
            <div key={method.id} className="mb-4 p-4 border rounded">
              <h3 className="font-semibold">{method.name}</h3>
              <p>{method.description}</p>
              <p>Price: €{method.price.toFixed(2)}</p>
              <p>Estimated Delivery: {method.estimatedDeliveryDays} days</p>
              <p>Status: {method.enabled ? 'Enabled' : 'Disabled'}</p>
              <div className="mt-2">
                <Button variant="outline" size="sm" onClick={() => setEditingMethod(method)}>
                  Edit
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm" 
                  className="ml-2"
                  onClick={() => {
                    deleteShippingMethod(method.id)
                    toast.success('Shipping method deleted successfully')
                  }}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {editingMethod && (
        <Dialog open={true} onOpenChange={() => setEditingMethod(null)}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Shipping Method</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleUpdateShippingMethod} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Method Name</Label>
                <Input id="edit-name" name="name" defaultValue={editingMethod.name} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea id="edit-description" name="description" defaultValue={editingMethod.description} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-price">Price</Label>
                <Input id="edit-price" name="price" type="number" step="0.01" defaultValue={editingMethod.price} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-estimatedDeliveryDays">Estimated Delivery Days</Label>
                <Input id="edit-estimatedDeliveryDays" name="estimatedDeliveryDays" type="number" defaultValue={editingMethod.estimatedDeliveryDays} required />
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="edit-enabled" name="enabled" defaultChecked={editingMethod.enabled} />
                <Label htmlFor="edit-enabled">Enabled</Label>
              </div>
              <div className="space-y-2">
                <Label>Available Locations</Label>
                {shopSettings.locations.map((location) => (
                  <div key={location.id} className="flex items-center space-x-2">
                    <Switch 
                      id={`location-${location.id}`} 
                      name="availableLocations" 
                      value={location.id} 
                      defaultChecked={editingMethod.availableLocations.includes(location.id)}
                    />
                    <Label htmlFor={`location-${location.id}`}>{location.name}</Label>
                  </div>
                ))}
              </div>
              <Button type="submit">Update Shipping Method</Button>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

function PaymentMethodSettings() {
  const { shopSettings, addPaymentMethod, updatePaymentMethod, deletePaymentMethod } = useAdminStore()
  const [editingMethod, setEditingMethod] = useState<PaymentMethod | null>(null)

  const handleAddPaymentMethod = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const newPaymentMethod: PaymentMethod = {
      id: Date.now().toString(),
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      enabled: true,
      availableLocations: shopSettings.locations.map(location => location.id),
    }
    addPaymentMethod(newPaymentMethod)
    event.currentTarget.reset()
    toast.success('Payment method added successfully')
  }

  const handleUpdatePaymentMethod = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (editingMethod) {
      const formData = new FormData(event.currentTarget)
      const updatedMethod: Partial<PaymentMethod> = {
        name: formData.get('name') as string,
        description: formData.get('description') as string,
        enabled: formData.get('enabled') === 'on',
        availableLocations: Array.from(formData.getAll('availableLocations') as string[]),
      }
      updatePaymentMethod(editingMethod.id, updatedMethod)
      setEditingMethod(null)
      toast.success('Payment method updated successfully')
    }
  }

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-gray-800">Payment Method Settings</h2>
      
      <Card>
        <CardHeader>
          <CardTitle>Add New Payment Method</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddPaymentMethod} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Method Name</Label>
              <Input id="name" name="name" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" required />
            </div>
            <Button type="submit">Add Payment Method</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Existing Payment Methods</CardTitle>
        </CardHeader>
        <CardContent>
          {shopSettings.paymentMethods.map((method) => (
            <div key={method.id} className="mb-4 p-4 border rounded">
              <h3 className="font-semibold">{method.name}</h3>
              <p>{method.description}</p>
              <p>Status: {method.enabled ? 'Enabled' : 'Disabled'}</p>
              <div className="mt-2">
                <Button variant="outline" size="sm" onClick={() => setEditingMethod(method)}>
                  Edit
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm" 
                  className="ml-2"
                  onClick={() => {
                    deletePaymentMethod(method.id)
                    toast.success('Payment method deleted successfully')
                  }}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {editingMethod && (
        <Dialog open={true} onOpenChange={() => setEditingMethod(null)}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Payment Method</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleUpdatePaymentMethod} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Method Name</Label>
                <Input id="edit-name" name="name" defaultValue={editingMethod.name} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea id="edit-description" name="description" defaultValue={editingMethod.description} required />
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="edit-enabled" name="enabled" defaultChecked={editingMethod.enabled} />
                <Label htmlFor="edit-enabled">Enabled</Label>
              </div>
              <div className="space-y-2">
                <Label>Available Locations</Label>
                {shopSettings.locations.map((location) => (
                  <div key={location.id} className="flex items-center space-x-2">
                    <Switch 
                      id={`location-${location.id}`} 
                      name="availableLocations" 
                      value={location.id} 
                      defaultChecked={editingMethod.availableLocations.includes(location.id)}
                    />
                    <Label htmlFor={`location-${location.id}`}>{location.name}</Label>
                  </div>
                ))}
              </div>
              <Button type="submit">Update Payment Method</Button>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

function ShopSettings() {
  const { shopSettings, updateShopSettings, addLocation, updateLocation, deleteLocation, setPrimaryLocation } = useAdminStore()
  const [editingLocation, setEditingLocation] = useState<Location | null>(null)

  const handleShopSettingsChange = (field: keyof ShopSettings, value: string | number) => {
    updateShopSettings({ [field]: value })
  }

  const handleAddLocation = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const newLocation: Location = {
      id: Date.now().toString(),
      name: formData.get('locationName') as string,
      address: formData.get('locationAddress') as string,
      openingHours: {
        monday: { periods: [{ open: '09:00', close: '17:00' }] },
        tuesday: { periods: [{ open: '09:00', close: '17:00' }] },
        wednesday: { periods: [{ open: '09:00', close: '17:00' }] },
        thursday: { periods: [{ open: '09:00', close: '17:00' }] },
        friday: { periods: [{ open: '09:00', close: '17:00' }] },
        saturday: { periods: [{ open: '10:00', close: '14:00' }] },
        sunday: { periods: [] },
      },
    }
    addLocation(newLocation)
    event.currentTarget.reset()
    toast.success('Location added successfully')
  }

  const handleUpdateLocation = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (editingLocation) {
      const formData = new FormData(event.currentTarget)
      const updatedLocation: Partial<Location> = {
        name: formData.get('locationName') as string,
        address: formData.get('locationAddress') as string,
        openingHours: {
          monday: { periods: getOpeningHoursPeriods(formData, 'monday') },
          tuesday: { periods: getOpeningHoursPeriods(formData, 'tuesday') },
          wednesday: { periods: getOpeningHoursPeriods(formData, 'wednesday') },
          thursday: { periods: getOpeningHoursPeriods(formData, 'thursday') },
          friday: { periods: getOpeningHoursPeriods(formData, 'friday') },
          saturday: { periods: getOpeningHoursPeriods(formData, 'saturday') },
          sunday: { periods: getOpeningHoursPeriods(formData, 'sunday') },
        },
      }
      updateLocation(editingLocation.id, updatedLocation)
      setEditingLocation(null)
      toast.success('Location updated successfully')
    }
  }

  const getOpeningHoursPeriods = (formData: FormData, day: string) => {
    const periods = []
    let i = 0
    while (formData.get(`${day}-open-${i}`)) {
      periods.push({
        open: formData.get(`${day}-open-${i}`) as string,
        close: formData.get(`${day}-close-${i}`) as string,
      })
      i++
    }
    return periods
  }

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-gray-800">Shop Settings</h2>
      
      <Card>
        <CardHeader>
          <CardTitle>General Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="shopName">Shop Name</Label>
              <Input
                id="shopName"
                value={shopSettings.shopName}
                onChange={(e) => handleShopSettingsChange('shopName', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="shopDescription">Shop Description</Label>
              <Textarea
                id="shopDescription"
                value={shopSettings.shopDescription}
                onChange={(e) => handleShopSettingsChange('shopDescription', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Select
                value={shopSettings.currency}
                onValueChange={(value) => handleShopSettingsChange('currency', value)}
              >
                <SelectTrigger id="currency">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EUR">Euro (€)</SelectItem>
                  <SelectItem value="USD">US Dollar ($)</SelectItem>
                  <SelectItem value="GBP">British Pound (£)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="taxRate">Tax Rate (%)</Label>
              <Input
                id="taxRate"
                type="number"
                value={shopSettings.taxRate}
                onChange={(e) => handleShopSettingsChange('taxRate', parseFloat(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="shippingFee">Shipping Fee</Label>
              <Input
                id="shippingFee"
                type="number"
                value={shopSettings.shippingFee}
                onChange={(e) => handleShopSettingsChange('shippingFee', parseFloat(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="emailAddress">Email Address</Label>
              <Input
                id="emailAddress"
                type="email"
                value={shopSettings.emailAddress}
                onChange={(e) => handleShopSettingsChange('emailAddress', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                value={shopSettings.phoneNumber}
                onChange={(e) => handleShopSettingsChange('phoneNumber', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                value={shopSettings.address}
                onChange={(e) => handleShopSettingsChange('address', e.target.value)}
              />
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Locations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {shopSettings.locations.map((location) => (
              <div key={location.id} className="flex items-center justify-between p-4 bg-gray-100 rounded-lg">
                <div>
                  <h3 className="font-semibold">{location.name}</h3>
                  <p className="text-sm text-gray-600">{location.address}</p>
                </div>
                <div className="space-x-2">
                  {location.id === shopSettings.primaryLocationId ? (
                    <Badge>Primary</Badge>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setPrimaryLocation(location.id)
                        toast.success(`${location.name} set as primary location`)
                      }}
                    >
                      Set as Primary
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingLocation(location)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      deleteLocation(location.id)
                      toast.success(`${location.name} deleted successfully`)
                    }}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <h3 className="font-semibold mb-2">Add New Location</h3>
            <form onSubmit={handleAddLocation} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="locationName">Location Name</Label>
                <Input id="locationName" name="locationName" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="locationAddress">Address</Label>
                <Textarea id="locationAddress" name="locationAddress" required />
              </div>
              <Button type="submit">Add Location</Button>
            </form>
          </div>

          {editingLocation && (
            <Dialog open={true} onOpenChange={() => setEditingLocation(null)}>
              <DialogContent className="max-w-4xl">
                <DialogHeader>
                  <DialogTitle>Edit Location</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleUpdateLocation} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="editLocationName">Location Name</Label>
                    <Input
                      id="editLocationName"
                      name="locationName"
                      defaultValue={editingLocation.name}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="editLocationAddress">Address</Label>
                    <Textarea
                      id="editLocationAddress"
                      name="locationAddress"
                      defaultValue={editingLocation.address}
                      required
                    />
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-semibold">Opening Hours</h4>
                    {Object.entries(editingLocation.openingHours).map(([day, { periods }]) => (
                      <div key={day} className="space-y-2">
                        <Label>{day.charAt(0).toUpperCase() + day.slice(1)}</Label>
                        {periods.map((period, index) => (
                          <div key={index} className="flex space-x-2">
                            <Input
                              type="time"
                              name={`${day}-open-${index}`}
                              defaultValue={period.open}
                            />
                            <Input
                              type="time"
                              name={`${day}-close-${index}`}
                              defaultValue={period.close}
                            />
                            {index === periods.length - 1 && (
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  const updatedLocation = { ...editingLocation }
                                  updatedLocation.openingHours[day as keyof OpeningHours].periods.push({ open: '', close: '' })
                                  setEditingLocation(updatedLocation)
                                }}
                              >
                                Add Period
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                  <DialogFooter>
                    <Button type="submit">Save Changes</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function TenantRegistrations() {
  const { tenantRegistrations, updateTenantRegistration, deleteTenantRegistration, addTenant } = useAdminStore()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<TenantRegistration['status'] | 'all'>('all')

  const filteredRegistrations = tenantRegistrations.filter(registration =>
    (registration.tenantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
     registration.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
     registration.email.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (statusFilter === 'all' || registration.status === statusFilter)
  )

  const handleApprove = (registration: TenantRegistration) => {
    updateTenantRegistration(registration.id, { status: 'approved' })
    addTenant({
      id: registration.id,
      name: registration.tenantName,
      domain: `${registration.tenantName.toLowerCase().replace(/\s+/g, '-')}.example.com`,
      status: 'active'
    })
    toast.success(`${registration.tenantName} approved and added as a tenant`)
  }

  const handleReject = (registration: TenantRegistration) => {
    updateTenantRegistration(registration.id, { status: 'rejected' })
    toast.success(`${registration.tenantName} registration rejected`)
  }

  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-bold text-gray-800">Tenant Registrations</h2>
      <div className="flex space-x-4">
        <div className="flex-1">
          <Input
            placeholder="Search by tenant name, owner name, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-48">
          <Select value={statusFilter} onValueChange={(value: TenantRegistration['status'] | 'all') => setStatusFilter(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tenant Name</TableHead>
                <TableHead>Owner Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone Number</TableHead>
                <TableHead>Business Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Submitted At</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRegistrations.map((registration) => (
                <TableRow key={registration.id}>
                  <TableCell>{registration.tenantName}</TableCell>
                  <TableCell>{registration.ownerName}</TableCell>
                  <TableCell>{registration.email}</TableCell>
                  <TableCell>{registration.phoneNumber}</TableCell>
                  <TableCell>{registration.businessType}</TableCell>
                  <TableCell>
                    <Badge variant={
                      registration.status === 'approved' ? 'default' :
                      registration.status === 'rejected' ? 'destructive' : 'outline'
                    }>
                      {registration.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(registration.submittedAt).toLocaleString()}</TableCell>
                  <TableCell>
                    {registration.status === 'pending' && (
                      <>
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => handleApprove(registration)}
                          className="mr-2"
                        >
                          Approve
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleReject(registration)}
                        >
                          Reject
                        </Button>
                      </>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        deleteTenantRegistration(registration.id)
                        toast.success('Registration deleted successfully')
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}