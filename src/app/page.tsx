"use client";

import { useState, useEffect, useRef, useMemo } from "react"
import { create } from "zustand"
import { persist } from 'zustand/middleware'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
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
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
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
import { Checkbox } from "@/components/ui/checkbox"

// Types
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

interface Client {
  name: string
  email: string
  phone: string
  totalOrders: number
  totalSpent: number
  lastOrderDate: Date
}

// Global strings
const GLOBAL_STRINGS = {
  MEAL_PLANNER: "Meal Planner",
  ITEMS: "Items",
  MEDIA_GALLERY: "Media Gallery",
  MEAL_ORDERING: "Meal Ordering",
  ORDERS: "Orders",
  MY_ORDERS: "My Orders",
  STOCK_MOVEMENTS: "Stock Movements",
  SHIPPING_METHODS: "Shipping Methods",
  PAYMENT_METHODS: "Payment Methods",
  SETTINGS: "Settings",
  TENANT_REGISTRATIONS: "Tenant Registrations",
  TENANTS_ADMINISTRATION: "Tenants Administration",
  TENANT_SIGNUP: "Tenant Signup",
  MY_CLIENTS: "My Clients",
  ADMIN_DASHBOARD: "Admin Dashboard",
}

// Column headers
const COLUMN_HEADERS = {
  NAME: "Name",
  EMAIL: "Email",
  PHONE: "Phone",
  TOTAL_ORDERS: "Total Orders",
  TOTAL_SPENT: "Total Spent",
  LAST_ORDER_DATE: "Last Order Date",
}

// Global Store
interface GlobalState {
  users: User[]
  tenants: Tenant[]
  currentUser: User | null
  currentTenant: Tenant | null
  isSuperAdminMode: boolean
  setCurrentUser: (user: User | null) => void
  addTenant: (tenant: Tenant) => void
  updateTenant: (id: string, tenant: Partial<Tenant>) => void
  deleteTenant: (id: string) => void
  setCurrentTenant: (tenant: Tenant | null) => void
  toggleSuperAdminMode: () => void
}

const useGlobalStore = create<GlobalState>()(
  persist(
    (set) => ({
      users: [
        { id: '1', name: 'Admin User', email: 'admin@example.com', role: 'Admin' },
        { id: '2', name: 'Shop Manager', email: 'manager@example.com', role: 'Shop manager' },
        { id: '3', name: 'Client User', email: 'client@example.com', role: 'Client' },
      ],
      tenants: [
        { id: '1', name: 'Tenant 1', domain: 'tenant1.example.com', status: 'active' },
        { id: '2', name: 'Tenant 2', domain: 'tenant2.example.com', status: 'active' },
      ],
      currentUser: null,
      currentTenant: null,
      isSuperAdminMode: false,
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
      toggleSuperAdminMode: () => set((state) => ({ isSuperAdminMode: !state.isSuperAdminMode })),
    }),
    {
      name: 'global-storage',
      getStorage: () => localStorage,
    }
  )
)

// Tenant Store
interface TenantState {
  items: Item[]
  mealOfferings: MealOffering[]
  mediaItems: MediaItem[]
  cart: CartItem[]
  orders: Order[]
  stockMovements: StockMovement[]
  shopSettings: ShopSettings
  tenantRegistrations: TenantRegistration[]
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
  addTenantRegistration: (registration: TenantRegistration) => void
  updateTenantRegistration: (id: string, registration: Partial<TenantRegistration>) => void
  deleteTenantRegistration: (id: string) => void
}

const createTenantStore = (tenantId: string) => create<TenantState>()(
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
      tenantRegistrations: [],
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
          meal.id === mealI
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
    }),
    {
      name: `tenant-storage-${tenantId}`,
      getStorage: () => localStorage,
    }
  )
)

// Utility function for logging
const logInfo = (message: string, data?: any) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[INFO] ${message}`, data)
  }
}

export default function AdminDashboard() {
  const { currentUser, currentTenant, isSuperAdminMode } = useGlobalStore()
  const [activeTab, setActiveTab] = useState("meal-planner")
  const tenantStore = createTenantStore(currentTenant?.id || 'default')

  useEffect(() => {
    logInfo('Tenant store initialized', { tenantId: currentTenant?.id })
  }, [currentTenant])

  const getMenuItems = () => {
    const commonItems = [
      { label: GLOBAL_STRINGS.MEAL_ORDERING, icon: ShoppingCart, tab: "meal-ordering" },
      { label: GLOBAL_STRINGS.MY_ORDERS, icon: FileText, tab: "my-orders" },
      { label: GLOBAL_STRINGS.MY_CLIENTS, icon: User, tab: "my-clients" },
    ]

    const adminItems = [
      { label: GLOBAL_STRINGS.MEAL_PLANNER, icon: CalendarIcon, tab: "meal-planner" },
      { label: GLOBAL_STRINGS.ITEMS, icon: List, tab: "items" },
      { label: GLOBAL_STRINGS.MEDIA_GALLERY, icon: ImageIcon, tab: "media-gallery" },
      { label: GLOBAL_STRINGS.ORDERS, icon: FileText, tab: "orders" },
      { label: GLOBAL_STRINGS.STOCK_MOVEMENTS, icon: ArrowUp, tab: "stock-movements" },
      { label: GLOBAL_STRINGS.SHIPPING_METHODS, icon: Truck, tab: "shipping-methods" },
      { label: GLOBAL_STRINGS.PAYMENT_METHODS, icon: CreditCard, tab: "payment-methods" },
      { label: GLOBAL_STRINGS.SETTINGS, icon: Settings, tab: "settings" },
    ]

    const shopManagerItems = [
      { label: GLOBAL_STRINGS.MEAL_PLANNER, icon: CalendarIcon, tab: "meal-planner" },
      { label: GLOBAL_STRINGS.ITEMS, icon: List, tab: "items" },
      { label: GLOBAL_STRINGS.MEDIA_GALLERY, icon: ImageIcon, tab: "media-gallery" },
      { label: GLOBAL_STRINGS.ORDERS, icon: FileText, tab: "orders" },
      { label: GLOBAL_STRINGS.STOCK_MOVEMENTS, icon: ArrowUp, tab: "stock-movements" },
    ]

    const superAdminItems = [
      { label: GLOBAL_STRINGS.TENANT_REGISTRATIONS, icon: Building, tab: "tenant-registrations" },
      { label: GLOBAL_STRINGS.TENANTS_ADMINISTRATION, icon: Building, tab: "tenants-administration" },
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
      items.push({ label: GLOBAL_STRINGS.TENANT_SIGNUP, icon: User, tab: "tenant-signup" })
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
            <h1 className="text-2xl font-bold text-gray-800">{GLOBAL_STRINGS.ADMIN_DASHBOARD}</h1>
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
            {activeTab === "my-clients" && <MyClients />}
          </div>
        </main>
        <Toaster />
      </div>
    </div>
  )
}

function AdminBar() {
  const { users, currentUser, setCurrentUser, tenants, currentTenant, setCurrentTenant, isSuperAdminMode, toggleSuperAdminMode } = useGlobalStore()
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
    if (user) setCurrentUser(user)
  }

  const handleTenantChange = (tenantId: string) => {
    const tenant = tenants.find(t => t.id === tenantId)
    if (tenant) {
      setCurrentTenant(tenant)
    }
  }

  return (
    <div className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <div className="flex space-x-4" suppressHydrationWarning>
        <Select onValueChange={handleRoleChange} value={currentUser?.role || undefined}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Admin">Admin</SelectItem>
            <SelectItem value="Shop manager">Shop manager</SelectItem>
            <SelectItem value="Client">Client</SelectItem>
          </SelectContent>
        </Select>
        <Select onValueChange={handleUserChange} value={currentUser?.id || undefined}>
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
  const { users, setCurrentUser } = useGlobalStore()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("test")

  const formSchema = z.object({
    email: z.string().email({
      message: "Please enter a valid email address.",
    }),
    password: z.string().min(4, {
      message: "Password must be at least 4 characters.",
    }),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    const user = users.find(u => u.email === values.email)
    if (user && values.password === "test") {
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
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">Sign In</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

function RegisterDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const { users, setCurrentUser } = useGlobalStore()

  const formSchema = z.object({
    name: z.string().min(2, {
      message: "Name must be at least 2 characters.",
    }),
    email: z.string().email({
      message: "Please enter a valid email address.",
    }),
    password: z.string().min(4, {
      message: "Password must be at least 4 characters.",
    }),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    const newUser: User = {
      id: (users.length + 1).toString(),
      name: values.name,
      email: values.email,
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
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">Register</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

function MealPlanner() {
  const { currentTenant } = useGlobalStore()
  const tenantStore = createTenantStore(currentTenant?.id || 'default')
  const { mealOfferings, items, addMealOffering, editMealOffering, deleteMealOffering, duplicateMealOffering, assignItem, removeItem, toggleMealOfferingStatus, sortMealItems, shopSettings } = tenantStore.getState()
  const [openPopovers, setOpenPopovers] = useState<{ [key: string]: boolean }>({})
  const [editingOffering, setEditingOffering] = useState<MealOffering | null>(null)
  const [expandedOfferings, setExpandedOfferings] = useState<number[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [dateFilter, setDateFilter] = useState("")
  const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'published'>('all')
  const [locationFilter, setLocationFilter] = useState<string>('all')

  const formSchema = z.object({
    name: z.string().min(2, {
      message: "Meal name must be at least 2 characters.",
    }),
    startDate: z.string().min(1, {
      message: "Start date is required.",
    }),
    endDate: z.string().min(1, {
      message: "End date is required.",
    }),
    status: z.enum(['draft', 'published']),
    locationId: z.string().min(1, {
      message: "Location is required.",
    }),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      startDate: "",
      endDate: "",
      status: "draft",
      locationId: shopSettings?.primaryLocationId || "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (addMealOffering) {
      const newMealOffering: MealOffering = {
        id: Date.now(),
        name: values.name,
        startDate: new Date(values.startDate),
        endDate: new Date(values.endDate),
        items: {
          Entrées: [],
          Plats: [],
          Accompagnements: [],
          Desserts: []
        },
        status: values.status,
        locationId: values.locationId
      }
      addMealOffering(newMealOffering)
      toast.success('New meal offering added successfully')
      form.reset()
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

  const filteredMealOfferings = mealOfferings?.filter(offering =>
    offering.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (dateFilter ? new Date(offering.startDate) >= new Date(dateFilter) : true) &&
    (statusFilter === 'all' || offering.status === statusFilter) &&
    (locationFilter === 'all' || offering.locationId === locationFilter)
  ) || []

  return (
    <>
      <h2 className="text-3xl font-bold text-gray-800 mb-8">{GLOBAL_STRINGS.MEAL_PLANNER}</h2>

      {/* Meal Offering Form */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Create Meal Offering</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Meal Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter meal name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Date and Time</FormLabel>
                      <FormControl>
                        <Input type="datetime-local" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Date and Time</FormLabel>
                      <FormControl>
                        <Input type="datetime-local" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="published">Published</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="locationId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select location" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {shopSettings?.locations && shopSettings.locations.length > 0 ? (
                            shopSettings.locations.map((location) => (
                              <SelectItem key={location.id} value={location.id}>{location.name}</SelectItem>
                            ))
                          ) : (
                            <SelectItem value="default">Default Location</SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit" className="w-full">
                <Plus className="w-4 h-4 mr-2" /> Add Meal Offering
              </Button>
            </form>
          </Form>
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
                <SelectTrigger>
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
                <SelectTrigger>
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  {shopSettings?.locations.map((location) => (
                    <SelectItem key={location.id} value={location.id}>{location.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          {filteredMealOfferings.map((offering) => (
            <Card key={offering.id} className="mb-4">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>{offering.name}</CardTitle>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={() => toggleExpanded(offering.id)}>
                      {expandedOfferings.includes(offering.id) ? <ChevronUp /> : <ChevronDown />}
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setEditingOffering(offering)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => duplicateMealOffering && duplicateMealOffering(offering.id)}>
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => deleteMealOffering && deleteMealOffering(offering.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant={offering.status === 'published' ? 'default' : 'secondary'}
                      size="sm"
                      onClick={() => toggleMealOfferingStatus && toggleMealOfferingStatus(offering.id)}
                    >
                      {offering.status === 'published' ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  {new Date(offering.startDate).toLocaleString()} - {new Date(offering.endDate).toLocaleString()}
                </div>
                <div className="text-sm">
                  <Badge variant={offering.status === 'published' ? 'default' : 'secondary'}>
                    {offering.status}
                  </Badge>
                </div>
                <div className="text-sm">
                  Location: {shopSettings?.locations.find(loc => loc.id === offering.locationId)?.name || 'Unknown'}
                </div>
              </CardHeader>
              {expandedOfferings.includes(offering.id) && (
                <CardContent>
                  {categories.map((category) => (
                    <div key={category} className="mb-4">
                      <h4 className="text-lg font-semibold mb-2">{category}</h4>
                      <div className="space-y-2">
                        {offering.items[category].map((item, index) => (
                          <div key={item.id} className="flex items-center justify-between bg-gray-100 p-2 rounded">
                            <span>{item.name}</span>
                            <div className="flex space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => sortMealItems && sortMealItems(offering.id, category, index, Math.max(0, index - 1))}
                                disabled={index === 0}
                              >
                                <ArrowUp className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => sortMealItems && sortMealItems(offering.id, category, index, Math.min(offering.items[category].length - 1, index + 1))}
                                disabled={index === offering.items[category].length - 1}
                              >
                                <ArrowDown className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => removeItem && removeItem(offering.id, category, item.id)}
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                      <Popover open={openPopovers[`${offering.id}-${category}`]} onOpenChange={(open) => togglePopover(`${offering.id}-${category}`, open)}>
                        <PopoverTrigger asChild>
                          <Button variant="outline" size="sm" className="mt-2">
                            <Plus className="w-4 h-4 mr-2" /> Add Item
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80">
                          <div className="space-y-4">
                            <h4 className="font-medium">Add Item to {category}</h4>
                            <ScrollArea className="h-[200px]">
                              {items?.filter(item => !offering.items[category].some(i => i.id === item.id)).map((item) => (
                                <div key={item.id} className="flex items-center justify-between py-2">
                                  <span>{item.name}</span>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      assignItem && assignItem(offering.id, category, item)
                                      togglePopover(`${offering.id}-${category}`, false)
                                    }}
                                  >
                                    Add
                                  </Button>
                                </div>
                              ))}
                            </ScrollArea>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                  ))}
                </CardContent>
              )}
            </Card>
          ))}
        </CardContent>
      </Card>

      {/* Edit Meal Offering Dialog */}
      {editingOffering && (
        <Dialog open={!!editingOffering} onOpenChange={() => setEditingOffering(null)}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Meal Offering</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit((values) => {
                if (editMealOffering && editingOffering) {
                  editMealOffering(editingOffering.id, {
                    name: values.name,
                    startDate: new Date(values.startDate),
                    endDate: new Date(values.endDate),
                    status: values.status,
                    locationId: values.locationId
                  })
                  setEditingOffering(null)
                  toast.success('Meal offering updated successfully')
                }
              })} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Meal Name</FormLabel>
                      <FormControl>
                        <Input {...field} defaultValue={editingOffering.name} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Date and Time</FormLabel>
                      <FormControl>
                        <Input type="datetime-local" {...field} defaultValue={new Date(editingOffering.startDate).toISOString().slice(0, 16)} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Date and Time</FormLabel>
                      <FormControl>
                        <Input type="datetime-local" {...field} defaultValue={new Date(editingOffering.endDate).toISOString().slice(0, 16)} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={editingOffering.status}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="published">Published</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="locationId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={editingOffering.locationId}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select location" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {shopSettings?.locations.map((location) => (
                            <SelectItem key={location.id} value={location.id}>{location.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit">Update Meal Offering</Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}

function ItemManagement() {
  const { currentTenant } = useGlobalStore()
  const tenantStore = createTenantStore(currentTenant?.id || 'default')
  const { items, addItem, updateItem, deleteItem, shopSettings } = tenantStore.getState()
  const [editingItem, setEditingItem] = useState<Item | null>(null)
  const [isAddItemDialogOpen, setIsAddItemDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null)
  const [locationFilter, setLocationFilter] = useState<string | null>(null)

  const formSchema = z.object({
    name: z.string().min(2, {
      message: "Item name must be at least 2 characters.",
    }),
    category: z.string().min(1, {
      message: "Category is required.",
    }),
    price: z.number().min(0, {
      message: "Price must be a positive number.",
    }),
    taxRate: z.number().min(0).max(100, {
      message: "Tax rate must be between 0 and 100.",
    }),
    description: z.string().optional(),
    availableLocations: z.array(z.string()).min(1, {
      message: "At least one location must be selected.",
    }),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      category: "",
      price: 0,
      taxRate: 20,
      description: "",
      availableLocations: [],
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (editingItem) {
      updateItem && updateItem(editingItem.id, {
        ...values,
        stock: editingItem.stock,
        attributes: editingItem.attributes,
      })
      setEditingItem(null)
      toast.success('Item updated successfully')
    } else {
      const newItem: Item = {
        id: Date.now(),
        ...values,
        stock: {},
        attributes: [],
      }
      addItem && addItem(newItem)
      setIsAddItemDialogOpen(false)
      toast.success('New item added successfully')
    }
    form.reset()
  }

  const filteredItems = items?.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (!categoryFilter || item.category === categoryFilter) &&
    (!locationFilter || item.availableLocations.includes(locationFilter))
  ) || []

  const uniqueCategories = Array.from(new Set(items?.map(item => item.category)))

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">{GLOBAL_STRINGS.ITEMS}</h2>
        <Button onClick={() => setIsAddItemDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" /> Add New Item
        </Button>
      </div>

      <div className="mb-4 flex space-x-4">
        <div className="flex-1">
          <Label htmlFor="search-items">Search Items</Label>
          <Input
            id="search-items"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex-1">
          <Label htmlFor="category-filter">Filter by Category</Label>
          <Select value={categoryFilter || 'all'} onValueChange={(value) => setCategoryFilter(value === '' ? null : value)}>
            <SelectTrigger>
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {uniqueCategories.map((category) => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1">
          <Label htmlFor="location-filter">Filter by Location</Label>
          <Select value={locationFilter || 'all'} onValueChange={(value) => setLocationFilter(value === '' ? null : value)}>
            <SelectTrigger>
              <SelectValue placeholder="All Locations" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={"all"}>All Locations</SelectItem>
              {shopSettings?.locations.map((location) => (
                <SelectItem key={location.id} value={location.id}>{location.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <Card key={item.id} className="flex flex-col">
            <CardHeader>
              <CardTitle>{item.name}</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
              <p><strong>Category:</strong> {item.category}</p>
              <p><strong>Price:</strong> {shopSettings?.currency} {item.price.toFixed(2)}</p>
              <p><strong>Tax Rate:</strong> {item.taxRate}%</p>
              {item.description && <p><strong>Description:</strong> {item.description}</p>}
              <p><strong>Available Locations:</strong> {item.availableLocations.map(locId => shopSettings?.locations.find(loc => loc.id === locId)?.name).join(', ')}</p>
            </CardContent>
            <CardFooter className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setEditingItem(item)}>
                <Edit className="w-4 h-4 mr-2" /> Edit
              </Button>
              <Button variant="destructive" onClick={() => deleteItem && deleteItem(item.id)}>
                <Trash2 className="w-4 h-4 mr-2" /> Delete
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Dialog open={isAddItemDialogOpen || !!editingItem} onOpenChange={(open) => {
        if (!open) {
          setIsAddItemDialogOpen(false)
          setEditingItem(null)
        }
      }}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingItem ? 'Edit Item' : 'Add New Item'}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Item Name</FormLabel>
                    <FormControl>
                      <Input {...field} defaultValue={editingItem?.name} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <Input {...field} defaultValue={editingItem?.category} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} defaultValue={editingItem?.price} onChange={(e) => field.onChange(parseFloat(e.target.value))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="taxRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tax Rate (%)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.1" {...field} defaultValue={editingItem?.taxRate} onChange={(e) => field.onChange(parseFloat(e.target.value))} />
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
                    <FormLabel>Description (Optional)</FormLabel>
                    <FormControl>
                      <Textarea {...field} defaultValue={editingItem?.description} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="availableLocations"
                render={() => (
                  <FormItem>
                    <FormLabel>Available Locations</FormLabel>
                    <FormControl>
                      <div className="space-y-2">
                        {shopSettings?.locations.map((location) => (
                          <div key={location.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={`location-${location.id}`}
                              checked={form.watch('availableLocations').includes(location.id)}
                              onCheckedChange={(checked) => {
                                const currentLocations = form.getValues('availableLocations')
                                if (checked) {
                                  form.setValue('availableLocations', [...currentLocations, location.id])
                                } else {
                                  form.setValue('availableLocations', currentLocations.filter(id => id !== location.id))
                                }
                              }}
                            />
                            <Label htmlFor={`location-${location.id}`}>{location.name}</Label>
                          </div>
                        ))}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">{editingItem ? 'Update Item' : 'Add Item'}</Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  )
}

function MediaGallery() {
  const { currentTenant } = useGlobalStore()
  const tenantStore = createTenantStore(currentTenant?.id || 'default')
  const { mediaItems, addMediaItem, deleteMediaItem, setItemFeaturedImage, items } = tenantStore.getState()
  const [selectedItem, setSelectedItem] = useState<Item | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState<'all' | 'image' | 'video'>('all')

  const filteredMediaItems = mediaItems?.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (typeFilter === 'all' || item.type === typeFilter)
  ) || []

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const newMediaItem: MediaItem = {
          id: Date.now(),
          name: file.name,
          url: reader.result as string,
          type: file.type.startsWith('image/') ? 'image' : 'video'
        }
        addMediaItem && addMediaItem(newMediaItem)
        toast.success('Media item uploaded successfully')
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">{GLOBAL_STRINGS.MEDIA_GALLERY}</h2>
        <div>
          <input
            type="file"
            id="file-upload"
            className="hidden"
            onChange={handleFileUpload}
            accept="image/*,video/*"
          />
          <label htmlFor="file-upload" className="cursor-pointer">
            <Button as="span">
              <Plus className="w-4 h-4 mr-2" /> Upload Media
            </Button>
          </label>
        </div>
      </div>

      <div className="mb-4 flex space-x-4">
        <div className="flex-1">
          <Label htmlFor="search-media">Search Media</Label>
          <Input
            id="search-media"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex-1">
          <Label htmlFor="type-filter">Filter by Type</Label>
          <Select value={typeFilter} onValueChange={(value: 'all' | 'image' | 'video') => setTypeFilter(value)}>
            <SelectTrigger>
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="image">Images</SelectItem>
              <SelectItem value="video">Videos</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredMediaItems.map((item) => (
          <Card key={item.id} className="flex flex-col">
            <CardContent className="p-4 flex-grow">
              {item.type === 'image' ? (
                <img src={item.url} alt={item.name} className="w-full h-40 object-cover rounded-md" />
              ) : (
                <video src={item.url} className="w-full h-40 object-cover rounded-md" controls />
              )}
              <h3 className="mt-2 font-semibold truncate">{item.name}</h3>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setSelectedItem(items?.find(i => i.featuredImage === item.url) || null)}>
                <Eye className="w-4 h-4 mr-2" /> View Usage
              </Button>
              <Button variant="destructive" onClick={() => deleteMediaItem && deleteMediaItem(item.id)}>
                <Trash2 className="w-4 h-4 mr-2" /> Delete
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Media Usage</DialogTitle>
          </DialogHeader>
          {selectedItem ? (
            <div>
              <p>This image is used as the featured image for:</p>
              <p className="font-semibold">{selectedItem.name}</p>
            </div>
          ) : (
            <p>This image is not used as a featured image for any item.</p>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

function MealOrdering() {
  const { currentTenant } = useGlobalStore()
  const tenantStore = createTenantStore(currentTenant?.id || 'default')
  const { mealOfferings, items, cart, addToCart, removeFromCart, updateCartItemQuantity, clearCart, addOrder, shopSettings } = tenantStore.getState()
  const [selectedMealOffering, setSelectedMealOffering] = useState<MealOffering | null>(null)
  const [selectedLocation, setSelectedLocation] = useState<string>(shopSettings?.primaryLocationId || '')
  const [searchTerm, setSearchTerm] = useState("")
  const [showOrderForm, setShowOrderForm] = useState(false)

  const filteredMealOfferings = mealOfferings?.filter(offering =>
    offering.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    offering.status === 'published' &&
    new Date(offering.startDate) <= new Date() &&
    new Date(offering.endDate) >= new Date() &&
    offering.locationId === selectedLocation
  ) || []

  const formSchema = z.object({
    customerName: z.string().min(2, { message: "Name must be at least 2 characters." }),
    customerEmail: z.string().email({ message: "Please enter a valid email address." }),
    customerPhone: z.string().min(10, { message: "Please enter a valid phone number." }),
    deliveryAddress: z.string().min(5, { message: "Please enter a valid delivery address." }),
    shippingMethodId: z.string().min(1, { message: "Please select a shipping method." }),
    paymentMethodId: z.string().min(1, { message: "Please select a payment method." }),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customerName: "",
      customerEmail: "",
      customerPhone: "",
      deliveryAddress: "",
      shippingMethodId: "",
      paymentMethodId: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (addOrder) {
      const shippingMethod = shopSettings?.shippingMethods.find(method => method.id === values.shippingMethodId)
      const totalAmount = cart.reduce((total, item) => total + item.price * item.quantity, 0) + (shippingMethod?.price || 0)

      const newOrder: Order = {
        id: Date.now(),
        ...values,
        items: cart,
        totalAmount,
        status: 'pending',
        createdAt: new Date(),
        locationId: selectedLocation,
      }

      addOrder(newOrder)
      clearCart && clearCart()
      setShowOrderForm(false)
      toast.success('Order placed successfully!')
    }
  }

  return (
    <>
      <h2 className="text-3xl font-bold text-gray-800 mb-8">{GLOBAL_STRINGS.MEAL_ORDERING}</h2>

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
          <Label htmlFor="location-select">Select Location</Label>
          <Select value={selectedLocation} onValueChange={setSelectedLocation}>
            <SelectTrigger>
              <SelectValue placeholder="Select location" />
            </SelectTrigger>
            <SelectContent>
              {shopSettings?.locations.map((location) => (
                <SelectItem key={location.id} value={location.id}>{location.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {filteredMealOfferings.map((offering) => (
          <Card key={offering.id} className="flex flex-col">
            <CardHeader>
              <CardTitle>{offering.name}</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
              <p>Start: {new Date(offering.startDate).toLocaleString()}</p>
              <p>End: {new Date(offering.endDate).toLocaleString()}</p>
              <p>Location: {shopSettings?.locations.find(loc => loc.id === offering.locationId)?.name}</p>
            </CardContent>
            <CardFooter>
              <Button onClick={() => setSelectedMealOffering(offering)}>View Menu</Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {selectedMealOffering && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{selectedMealOffering.name} Menu</CardTitle>
          </CardHeader>
          <CardContent>
            {Object.entries(selectedMealOffering.items).map(([category, items]) => (
              <div key={category} className="mb-4">
                <h3 className="text-xl font-semibold mb-2">{category}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {items.map((item) => (
                    <Card key={item.id}>
                      <CardHeader>
                        <CardTitle>{item.name}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p>Price: {shopSettings?.currency} {item.price.toFixed(2)}</p>
                        {item.description && <p>{item.description}</p>}
                      </CardContent>
                      <CardFooter>
                        <Button onClick={() => addToCart && addToCart(item, selectedLocation)}>Add to Cart</Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {cart.length > 0 && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Your Cart</CardTitle>
          </CardHeader>
          <CardContent>
            {cart.map((item) => (
              <div key={item.id} className="flex justify-between items-center mb-2">
                <span>{item.name}</span>
                <div>
                  <Button variant="outline" size="sm" onClick={() => updateCartItemQuantity && updateCartItemQuantity(item.id, Math.max(1, item.quantity - 1))}>-</Button>
                  <span className="mx-2">{item.quantity}</span>
                  <Button variant="outline" size="sm" onClick={() => updateCartItemQuantity && updateCartItemQuantity(item.id, item.quantity + 1)}>+</Button>
                  <Button variant="destructive" size="sm" className="ml-2" onClick={() => removeFromCart && removeFromCart(item.id)}>Remove</Button>
                </div>
              </div>
            ))}
            <div className="mt-4">
              <strong>Total: {shopSettings?.currency} {cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)}</strong>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={() => setShowOrderForm(true)}>Proceed to Checkout</Button>
          </CardFooter>
        </Card>
      )}

      {showOrderForm && (
        <Card>
          <CardHeader>
            <CardTitle>Complete Your Order</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="customerName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="customerEmail"
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
                  name="customerPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input type="tel" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="deliveryAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Delivery Address</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="shippingMethodId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Shipping Method</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select shipping method" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {shopSettings?.shippingMethods
                            .filter(method => method.enabled && method.availableLocations.includes(selectedLocation))
                            .map((method) => (
                              <SelectItem key={method.id} value={method.id}>
                                {method.name} - {shopSettings?.currency} {method.price.toFixed(2)}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="paymentMethodId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payment Method</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select payment method" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {shopSettings?.paymentMethods
                            .filter(method => method.enabled && method.availableLocations.includes(selectedLocation))
                            .map((method) => (
                              <SelectItem key={method.id} value={method.id}>{method.name}</SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit">Place Order</Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}
    </>
  )
}

function Orders() {
  const { currentTenant } = useGlobalStore()
  const tenantStore = createTenantStore(currentTenant?.id || 'default')
  const { orders, updateOrderStatus, editOrder, shopSettings } = tenantStore.getState()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<Order['status'] | 'all'>('all')
  const [locationFilter, setLocationFilter] = useState<string>('all')
  const [dateFilter, setDateFilter] = useState<string>('')
  const [editingOrder, setEditingOrder] = useState<Order | null>(null)

  const filteredOrders = orders?.filter(order =>
    (order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (statusFilter === 'all' || order.status === statusFilter) &&
    (locationFilter === 'all' || order.locationId === locationFilter) &&
    (!dateFilter || new Date(order.createdAt).toDateString() === new Date(dateFilter).toDateString())
  ).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()) || []

  const formSchema = z.object({
    customerName: z.string().min(2, { message: "Name must be at least 2 characters." }),
    customerEmail: z.string().email({ message: "Please enter a valid email address." }),
    customerPhone: z.string().min(10, { message: "Please enter a valid phone number." }),
    deliveryAddress: z.string().min(5, { message: "Please enter a valid delivery address." }),
    status: z.enum(['pending', 'processing', 'completed', 'cancelled']),
    shippingMethodId: z.string().min(1, { message: "Please select a shipping method." }),
    paymentMethodId: z.string().min(1, { message: "Please select a payment method." }),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customerName: "",
      customerEmail: "",
      customerPhone: "",
      deliveryAddress: "",
      status: 'pending',
      shippingMethodId: "",
      paymentMethodId: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (editingOrder && editOrder) {
      editOrder(editingOrder.id, values)
      setEditingOrder(null)
      toast.success('Order updated successfully')
    }
  }

  return (
    <>
      <h2 className="text-3xl font-bold text-gray-800 mb-8">{GLOBAL_STRINGS.ORDERS}</h2>

      <div className="mb-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <Label htmlFor="search-orders">Search Orders</Label>
          <Input
            id="search-orders"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="status-filter">Filter by Status</Label>
          <Select value={statusFilter} onValueChange={(value: Order['status'] | 'all') => setStatusFilter(value)}>
            <SelectTrigger>
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="location-filter">Filter by Location</Label>
          <Select value={locationFilter} onValueChange={setLocationFilter}>
            <SelectTrigger>
              <SelectValue placeholder="All Locations" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              {shopSettings?.locations.map((location) => (
                <SelectItem key={location.id} value={location.id}>{location.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="date-filter">Filter by Date</Label>
          <Input
            id="date-filter"
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-4">
        {filteredOrders.map((order) => (
          <Card key={order.id}>
            <CardHeader>
              <CardTitle>Order #{order.id}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p><strong>Customer:</strong> {order.customerName}</p>
                  <p><strong>Email:</strong> {order.customerEmail}</p>
                  <p><strong>Phone:</strong> {order.customerPhone}</p>
                  <p><strong>Address:</strong> {order.deliveryAddress}</p>
                </div>
                <div>
                  <p><strong>Status:</strong> {order.status}</p>
                  <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>
                  <p><strong>Location:</strong> {shopSettings?.locations.find(loc => loc.id === order.locationId)?.name}</p>
                  <p><strong>Total:</strong> {shopSettings?.currency} {order.totalAmount.toFixed(2)}</p>
                </div>
              </div>
              <div className="mt-4">
                <h4 className="font-semibold mb-2">Items:</h4>
                <ul>
                  {order.items.map((item) => (
                    <li key={item.id}>{item.name} x {item.quantity}</li>
                  ))}
                </ul>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Select
                value={order.status}
                onValueChange={(value: Order['status']) => updateOrderStatus && updateOrderStatus(order.id, value)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Change Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={() => setEditingOrder(order)}>
                <Edit className="w-4 h-4 mr-2" /> Edit Order
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Dialog open={!!editingOrder} onOpenChange={() => setEditingOrder(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Order #{editingOrder?.id}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="customerName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Customer Name</FormLabel>
                    <FormControl>
                      <Input {...field} defaultValue={editingOrder?.customerName} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="customerEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Customer Email</FormLabel>
                    <FormControl>
                      <Input {...field} defaultValue={editingOrder?.customerEmail} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="customerPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Customer Phone</FormLabel>
                    <FormControl>
                      <Input {...field} defaultValue={editingOrder?.customerPhone} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="deliveryAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Delivery Address</FormLabel>
                    <FormControl>
                      <Textarea {...field} defaultValue={editingOrder?.deliveryAddress} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={editingOrder?.status}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="shippingMethodId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Shipping Method</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={editingOrder?.shippingMethodId}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select shipping method" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {shopSettings?.shippingMethods.map((method) => (
                          <SelectItem key={method.id} value={method.id}>{method.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="paymentMethodId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Method</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={editingOrder?.paymentMethodId}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select payment method" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {shopSettings?.paymentMethods.map((method) => (
                          <SelectItem key={method.id} value={method.id}>{method.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Update Order</Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  )
}

function MyOrders() {
  const { currentUser, currentTenant } = useGlobalStore()
  const tenantStore = createTenantStore(currentTenant?.id || 'default')
  const { orders, shopSettings } = tenantStore.getState()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<Order['status'] | 'all'>('all')
  const [dateFilter, setDateFilter] = useState<string>('')

  const userOrders = orders?.filter(order => order.customerEmail === currentUser?.email) || []

  const filteredOrders = userOrders.filter(order =>
    order.id.toString().includes(searchTerm) &&
    (statusFilter === 'all' || order.status === statusFilter) &&
    (!dateFilter || new Date(order.createdAt).toDateString() === new Date(dateFilter).toDateString())
  ).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

  return (
    <>
      <h2 className="text-3xl font-bold text-gray-800 mb-8">{GLOBAL_STRINGS.MY_ORDERS}</h2>

      <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="search-orders">Search Orders</Label>
          <Input
            id="search-orders"
            placeholder="Search by order number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="status-filter">Filter by Status</Label>
          <Select value={statusFilter} onValueChange={(value: Order['status'] | 'all') => setStatusFilter(value)}>
            <SelectTrigger>
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="date-filter">Filter by Date</Label>
          <Input
            id="date-filter"
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-4">
        {filteredOrders.map((order) => (
          <Card key={order.id}>
            <CardHeader>
              <CardTitle>Order #{order.id}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p><strong>Status:</strong> {order.status}</p>
                  <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>
                  <p><strong>Total:</strong> {shopSettings?.currency} {order.totalAmount.toFixed(2)}</p>
                </div>
                <div>
                  <p><strong>Delivery Address:</strong> {order.deliveryAddress}</p>
                  <p><strong>Location:</strong> {shopSettings?.locations.find(loc => loc.id === order.locationId)?.name}</p>
                </div>
              </div>
              <div className="mt-4">
                <h4 className="font-semibold mb-2">Items:</h4>
                <ul>
                  {order.items.map((item) => (
                    <li key={item.id}>{item.name} x {item.quantity}</li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  )
}

function StockMovements() {
  const { currentTenant } = useGlobalStore()
  const tenantStore = createTenantStore(currentTenant?.id || 'default')
  const { stockMovements, items, addStockMovement, cancelStockMovement, updateStock, shopSettings } = tenantStore.getState()
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState<'all' | 'increase' | 'decrease'>('all')
  const [locationFilter, setLocationFilter] = useState<string>('all')
  const [dateFilter, setDateFilter] = useState<string>('')
  const [isAddMovementOpen, setIsAddMovementOpen] = useState(false)

  const filteredMovements = stockMovements?.filter(movement =>
    items?.find(item => item.id === movement.itemId)?.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (typeFilter === 'all' || movement.type === typeFilter) &&
    (locationFilter === 'all' || movement.locationId === locationFilter) &&
    (!dateFilter || new Date(movement.date).toDateString() === new Date(dateFilter).toDateString())
  ).sort((a, b) => b.date.getTime() - a.date.getTime()) || []

  const formSchema = z.object({
    itemId: z.number(),
    quantity: z.number().int().positive(),
    type: z.enum(['increase', 'decrease']),
    reason: z.string().min(1, "Reason is required"),
    locationId: z.string().min(1, "Location is required"),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      itemId: 0,
      quantity: 1,
      type: 'increase',
      reason: '',
      locationId: shopSettings?.primaryLocationId || '',
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (addStockMovement && updateStock) {
      const newMovement: StockMovement = {
        id: Date.now(),
        ...values,
        date: new Date(),
      }
      addStockMovement(newMovement)
      updateStock(
        values.itemId,
        values.locationId,
        values.type === 'increase' ? values.quantity : -values.quantity
      )
      setIsAddMovementOpen(false)
      toast.success('Stock movement added successfully')
      form.reset()
    }
  }

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">{GLOBAL_STRINGS.STOCK_MOVEMENTS}</h2>
        <Button onClick={() => setIsAddMovementOpen(true)}>
          <Plus className="w-4 h-4 mr-2" /> Add Stock Movement
        </Button>
      </div>

      <div className="mb-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <Label htmlFor="search-movements">Search Movements</Label>
          <Input
            id="search-movements"
            placeholder="Search by item name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="type-filter">Filter by Type</Label>
          <Select value={typeFilter} onValueChange={(value: 'all' | 'increase' | 'decrease') => setTypeFilter(value)}>
            <SelectTrigger>
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="increase">Increase</SelectItem>
              <SelectItem value="decrease">Decrease</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="location-filter">Filter by Location</Label>
          <Select value={locationFilter} onValueChange={setLocationFilter}>
            <SelectTrigger>
              <SelectValue placeholder="All Locations" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              {shopSettings?.locations.map((location) => (
                <SelectItem key={location.id} value={location.id}>{location.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="date-filter">Filter by Date</Label>
          <Input
            id="date-filter"
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-4">
        {filteredMovements.map((movement) => {
          const item = items?.find(i => i.id === movement.itemId)
          return (
            <Card key={movement.id}>
              <CardHeader>
                <CardTitle>{item?.name || 'Unknown Item'}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p><strong>Type:</strong> {movement.type}</p>
                    <p><strong>Quantity:</strong> {movement.quantity}</p>
                    <p><strong>Reason:</strong> {movement.reason}</p>
                  </div>
                  <div>
                    <p><strong>Date:</strong> {new Date(movement.date).toLocaleString()}</p>
                    <p><strong>Location:</strong> {shopSettings?.locations.find(loc => loc.id === movement.locationId)?.name}</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="destructive" onClick={() => cancelStockMovement && cancelStockMovement(movement.id)}>
                  Cancel Movement
                </Button>
              </CardFooter>
            </Card>
          )
        })}
      </div>

      <Dialog open={isAddMovementOpen} onOpenChange={setIsAddMovementOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Stock Movement</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="itemId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Item</FormLabel>
                    <Select onValueChange={(value) => field.onChange(parseInt(value))} defaultValue={field.value.toString()}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select item" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {items?.map((item) => (
                          <SelectItem key={item.id} value={item.id.toString()}>{item.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} onChange={(e) => field.onChange(parseInt(e.target.value))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="increase">Increase</SelectItem>
                        <SelectItem value="decrease">Decrease</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="reason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reason</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="locationId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select location" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {shopSettings?.locations.map((location) => (
                          <SelectItem key={location.id} value={location.id}>{location.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Add Movement</Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  )
}

function ShippingMethodSettings() {
  const { currentTenant } = useGlobalStore()
  const tenantStore = createTenantStore(currentTenant?.id || 'default')
  const { shopSettings, addShippingMethod, updateShippingMethod, deleteShippingMethod } = tenantStore.getState()
  const [editingMethod, setEditingMethod] = useState<ShippingMethod | null>(null)
  const [isAddMethodOpen, setIsAddMethodOpen] = useState(false)

  const formSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters."),
    description: z.string(),
    price: z.number().min(0, "Price must be a positive number."),
    estimatedDeliveryDays: z.number().int().min(0, "Estimated delivery days must be a positive integer."),
    enabled: z.boolean(),
    availableLocations: z.array(z.string()).min(1, "At least one location must be selected."),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      estimatedDeliveryDays: 1,
      enabled: true,
      availableLocations: [],
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (editingMethod) {
      updateShippingMethod && updateShippingMethod(editingMethod.id, values)
      setEditingMethod(null)
      toast.success('Shipping method updated successfully')
    } else {
      const newMethod: ShippingMethod = {
        id: Date.now().toString(),
        ...values,
      }
      addShippingMethod && addShippingMethod(newMethod)
      setIsAddMethodOpen(false)
      toast.success('New shipping method added successfully')
    }
    form.reset()
  }

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">{GLOBAL_STRINGS.SHIPPING_METHODS}</h2>
        <Button onClick={() => setIsAddMethodOpen(true)}>
          <Plus className="w-4 h-4 mr-2" /> Add Shipping Method
        </Button>
      </div>

      <div className="space-y-4">
        {shopSettings?.shippingMethods.map((method) => (
          <Card key={method.id}>
            <CardHeader>
              <CardTitle>{method.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p><strong>Description:</strong> {method.description}</p>
              <p><strong>Price:</strong> {shopSettings.currency} {method.price.toFixed(2)}</p>
              <p><strong>Estimated Delivery Days:</strong> {method.estimatedDeliveryDays}</p>
              <p><strong>Status:</strong> {method.enabled ? 'Enabled' : 'Disabled'}</p>
              <p><strong>Available Locations:</strong> {method.availableLocations.map(locId => shopSettings.locations.find(loc => loc.id === locId)?.name).join(', ')}</p>
            </CardContent>
            <CardFooter className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setEditingMethod(method)}>
                <Edit className="w-4 h-4 mr-2" /> Edit
              </Button>
              <Button variant="destructive" onClick={() => deleteShippingMethod && deleteShippingMethod(method.id)}>
                <Trash2 className="w-4 h-4 mr-2" /> Delete
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Dialog open={isAddMethodOpen || !!editingMethod} onOpenChange={(open) => {
        if (!open) {
          setIsAddMethodOpen(false)
          setEditingMethod(null)
        }
      }}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingMethod ? 'Edit Shipping Method' : 'Add Shipping Method'}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} defaultValue={editingMethod?.name} />
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
                      <Textarea {...field} defaultValue={editingMethod?.description} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} defaultValue={editingMethod?.price} onChange={(e) => field.onChange(parseFloat(e.target.value))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="estimatedDeliveryDays"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estimated Delivery Days</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} defaultValue={editingMethod?.estimatedDeliveryDays} onChange={(e) => field.onChange(parseInt(e.target.value))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="enabled"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        Enabled
                      </FormLabel>
                      <FormDescription>
                        This shipping method will be available for customers to select.
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="availableLocations"
                render={() => (
                  <FormItem>
                    <FormLabel>Available Locations</FormLabel>
                    <FormControl>
                      <div className="space-y-2">
                        {shopSettings?.locations.map((location) => (
                          <div key={location.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={`location-${location.id}`}
                              checked={form.watch('availableLocations').includes(location.id)}
                              onCheckedChange={(checked) => {
                                const currentLocations = form.getValues('availableLocations')
                                if (checked) {
                                  form.setValue('availableLocations', [...currentLocations, location.id])
                                } else {
                                  form.setValue('availableLocations', currentLocations.filter(id => id !== location.id))
                                }
                              }}
                            />
                            <Label htmlFor={`location-${location.id}`}>{location.name}</Label>
                          </div>
                        ))}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">{editingMethod ? 'Update Method' : 'Add Method'}</Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  )
}

function PaymentMethodSettings() {
  const { currentTenant } = useGlobalStore()
  const tenantStore = createTenantStore(currentTenant?.id || 'default')
  const { shopSettings, addPaymentMethod, updatePaymentMethod, deletePaymentMethod } = tenantStore.getState()
  const [editingMethod, setEditingMethod] = useState<PaymentMethod | null>(null)
  const [isAddMethodOpen, setIsAddMethodOpen] = useState(false)

  const formSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters."),
    description: z.string(),
    enabled: z.boolean(),
    availableLocations: z.array(z.string()).min(1, "At least one location must be selected."),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      enabled: true,
      availableLocations: [],
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (editingMethod) {
      updatePaymentMethod && updatePaymentMethod(editingMethod.id, values)
      setEditingMethod(null)
      toast.success('Payment method updated successfully')
    } else {
      const newMethod: PaymentMethod = {
        id: Date.now().toString(),
        ...values,
      }
      addPaymentMethod && addPaymentMethod(newMethod)
      setIsAddMethodOpen(false)
      toast.success('New payment method added successfully')
    }
    form.reset()
  }

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">{GLOBAL_STRINGS.PAYMENT_METHODS}</h2>
        <Button onClick={() => setIsAddMethodOpen(true)}>
          <Plus className="w-4 h-4 mr-2" /> Add Payment Method
        </Button>
      </div>

      <div className="space-y-4">
        {shopSettings?.paymentMethods.map((method) => (
          <Card key={method.id}>
            <CardHeader>
              <CardTitle>{method.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p><strong>Description:</strong> {method.description}</p>
              <p><strong>Status:</strong> {method.enabled ? 'Enabled' : 'Disabled'}</p>
              <p><strong>Available Locations:</strong> {method.availableLocations.map(locId => shopSettings.locations.find(loc => loc.id === locId)?.name).join(', ')}</p>
            </CardContent>
            <CardFooter className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setEditingMethod(method)}>
                <Edit className="w-4 h-4 mr-2" /> Edit
              </Button>
              <Button variant="destructive" onClick={() => deletePaymentMethod && deletePaymentMethod(method.id)}>
                <Trash2 className="w-4 h-4 mr-2" /> Delete
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Dialog open={isAddMethodOpen || !!editingMethod} onOpenChange={(open) => {
        if (!open) {
          setIsAddMethodOpen(false)
          setEditingMethod(null)
        }
      }}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingMethod ? 'Edit Payment Method' : 'Add Payment Method'}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} defaultValue={editingMethod?.name} />
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
                      <Textarea {...field} defaultValue={editingMethod?.description} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="enabled"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        Enabled
                      </FormLabel>
                      <FormDescription>
                        This payment method will be available for customers to select.
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="availableLocations"
                render={() => (
                  <FormItem>
                    <FormLabel>Available Locations</FormLabel>
                    <FormControl>
                      <div className="space-y-2">
                        {shopSettings?.locations.map((location) => (
                          <div key={location.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={`location-${location.id}`}
                              checked={form.watch('availableLocations').includes(location.id)}
                              onCheckedChange={(checked) => {
                                const currentLocations = form.getValues('availableLocations')
                                if (checked) {
                                  form.setValue('availableLocations', [...currentLocations, location.id])
                                } else {
                                  form.setValue('availableLocations', currentLocations.filter(id => id !== location.id))
                                }
                              }}
                            />
                            <Label htmlFor={`location-${location.id}`}>{location.name}</Label>
                          </div>
                        ))}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">{editingMethod ? 'Update Method' : 'Add Method'}</Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  )
}

function ShopSettings() {
  const { currentTenant } = useGlobalStore()
  const tenantStore = createTenantStore(currentTenant?.id || 'default')
  const { shopSettings, updateShopSettings, addLocation, updateLocation, deleteLocation, setPrimaryLocation } = tenantStore.getState()
  const [editingLocation, setEditingLocation] = useState<Location | null>(null)
  const [isAddLocationOpen, setIsAddLocationOpen] = useState(false)

  const formSchema = z.object({
    shopName: z.string().min(2, "Shop name must be at least 2 characters."),
    shopDescription: z.string(),
    currency: z.string().min(1, "Currency is required."),
    taxRate: z.number().min(0).max(100, "Tax rate must be between 0 and 100."),
    shippingFee: z.number().min(0, "Shipping fee must be a positive number."),
    emailAddress: z.string().email("Must be a valid email address."),
    phoneNumber: z.string().min(10, "Phone number must be at least 10 characters."),
    address: z.string().min(5, "Address must be at least 5 characters."),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      shopName: shopSettings?.shopName || "",
      shopDescription: shopSettings?.shopDescription || "",
      currency: shopSettings?.currency || "",
      taxRate: shopSettings?.taxRate || 0,
      shippingFee: shopSettings?.shippingFee || 0,
      emailAddress: shopSettings?.emailAddress || "",
      phoneNumber: shopSettings?.phoneNumber || "",
      address: shopSettings?.address || "",
    },
  })

  const locationFormSchema = z.object({
    name: z.string().min(2, "Location name must be at least 2 characters."),
    address: z.string().min(5, "Address must be at least 5 characters."),
    openingHours: z.object({
      monday: z.object({ periods: z.array(z.object({ open: z.string(), close: z.string() })) }),
      tuesday: z.object({ periods: z.array(z.object({ open: z.string(), close: z.string() })) }),
      wednesday: z.object({ periods: z.array(z.object({ open: z.string(), close: z.string() })) }),
      thursday: z.object({ periods: z.array(z.object({ open: z.string(), close: z.string() })) }),
      friday: z.object({ periods: z.array(z.object({ open: z.string(), close: z.string() })) }),
      saturday: z.object({ periods: z.array(z.object({ open: z.string(), close: z.string() })) }),
      sunday: z.object({ periods: z.array(z.object({ open: z.string(), close: z.string() })) }),
    }),
  })

  const locationForm = useForm<z.infer<typeof locationFormSchema>>({
    resolver: zodResolver(locationFormSchema),
    defaultValues: {
      name: "",
      address: "",
      openingHours: {
        monday: { periods: [{ open: "09:00", close: "17:00" }] },
        tuesday: { periods: [{ open: "09:00", close: "17:00" }] },
        wednesday: { periods: [{ open: "09:00", close: "17:00" }] },
        thursday: { periods: [{ open: "09:00", close: "17:00" }] },
        friday: { periods: [{ open: "09:00", close: "17:00" }] },
        saturday: { periods: [{ open: "10:00", close: "14:00" }] },
        sunday: { periods: [] },
      },
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    updateShopSettings && updateShopSettings(values)
    toast.success('Shop settings updated successfully')
  }

  function onLocationSubmit(values: z.infer<typeof locationFormSchema>) {
    if (editingLocation) {
      updateLocation && updateLocation(editingLocation.id, values)
      setEditingLocation(null)
      toast.success('Location updated successfully')
    } else {
      const newLocation: Location = {
        id: Date.now().toString(),
        ...values,
      }
      addLocation && addLocation(newLocation)
      setIsAddLocationOpen(false)
      toast.success('New location added successfully')
    }
    locationForm.reset()
  }

  return (
    <>
      <h2 className="text-3xl font-bold text-gray-800 mb-8">{GLOBAL_STRINGS.SETTINGS}</h2>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>General Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="shopName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Shop Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="shopDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Shop Description</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
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
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="taxRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tax Rate (%)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} onChange={(e) => field.onChange(parseFloat(e.target.value))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="shippingFee"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Default Shipping Fee</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} onChange={(e) => field.onChange(parseFloat(e.target.value))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="emailAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Update Settings</Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Locations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {shopSettings?.locations.map((location) => (
              <Card key={location.id}>
                <CardHeader>
                  <CardTitle>{location.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p><strong>Address:</strong> {location.address}</p>
                  <p><strong>Opening Hours:</strong></p>
                  <ul>
                    {Object.entries(location.openingHours).map(([day, { periods }]) => (
                      <li key={day}>
                        {day}: {periods.length > 0
                          ? periods.map((period, index) => (
                            <span key={index}>
                              {period.open} - {period.close}
                              {index < periods.length - 1 ? ', ' : ''}
                            </span>
                          ))
                          : 'Closed'}
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <div>
                    {location.id === shopSettings.primaryLocationId ? (
                      <Badge>Primary Location</Badge>
                    ) : (
                      <Button variant="outline" onClick={() => setPrimaryLocation && setPrimaryLocation(location.id)}>
                        Set as Primary
                      </Button>
                    )}
                  </div>
                  <div className="space-x-2">
                    <Button variant="outline" onClick={() => setEditingLocation(location)}>
                      <Edit className="w-4 h-4 mr-2" /> Edit
                    </Button>
                    <Button variant="destructive" onClick={() => deleteLocation && deleteLocation(location.id)}>
                      <Trash2 className="w-4 h-4 mr-2" /> Delete
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
          <Button className="mt-4" onClick={() => setIsAddLocationOpen(true)}>
            <Plus className="w-4 h-4 mr-2" /> Add Location
          </Button>
        </CardContent>
      </Card>

      <Dialog open={isAddLocationOpen || !!editingLocation} onOpenChange={(open) => {
        if (!open) {
          setIsAddLocationOpen(false)
          setEditingLocation(null)
        }
      }}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingLocation ? 'Edit Location' : 'Add Location'}</DialogTitle>
          </DialogHeader>
          <Form {...locationForm}>
            <form onSubmit={locationForm.handleSubmit(onLocationSubmit)} className="space-y-4">
              <FormField
                control={locationForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location Name</FormLabel>
                    <FormControl>
                      <Input {...field} defaultValue={editingLocation?.name} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={locationForm.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Textarea {...field} defaultValue={editingLocation?.address} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day) => (
                <FormField
                  key={day}
                  control={locationForm.control}
                  name={`openingHours.${day}.periods` as any}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{day.charAt(0).toUpperCase() + day.slice(1)} Opening Hours</FormLabel>
                      <FormControl>
                        <div className="space-y-2">
                          {field.value.map((period: any, index: number) => (
                            <div key={index} className="flex space-x-2">
                              <Input
                                type="time"
                                value={period.open}
                                onChange={(e) => {
                                  const newPeriods = [...field.value]
                                  newPeriods[index].open = e.target.value
                                  field.onChange(newPeriods)
                                }}
                              />
                              <Input
                                type="time"
                                value={period.close}
                                onChange={(e) => {
                                  const newPeriods = [...field.value]
                                  newPeriods[index].close = e.target.value
                                  field.onChange(newPeriods)
                                }}
                              />
                              <Button
                                type="button"
                                variant="destructive"
                                onClick={() => {
                                  const newPeriods = field.value.filter((_: any, i: number) => i !== index)
                                  field.onChange(newPeriods)
                                }}
                              >
                                Remove
                              </Button>
                            </div>
                          ))}
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              field.onChange([...field.value, { open: "09:00", close: "17:00" }])
                            }}
                          >
                            Add Period
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
              <Button type="submit">{editingLocation ? 'Update Location' : 'Add Location'}</Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  )
}

function TenantRegistrations() {
  const { currentTenant } = useGlobalStore()
  const tenantStore = createTenantStore(currentTenant?.id || 'default')
  const { tenantRegistrations, addTenantRegistration, updateTenantRegistration, deleteTenantRegistration } = tenantStore.getState()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<TenantRegistration['status'] | 'all'>('all')
  const [dateFilter, setDateFilter] = useState<string>('')
  const [editingRegistration, setEditingRegistration] = useState<TenantRegistration | null>(null)

  const filteredRegistrations = tenantRegistrations?.filter(registration =>
    (registration.tenantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      registration.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      registration.email.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (statusFilter === 'all' || registration.status === statusFilter) &&
    (!dateFilter || new Date(registration.submittedAt).toDateString() === new Date(dateFilter).toDateString())
  ).sort((a, b) => b.submittedAt.getTime() - a.submittedAt.getTime()) || []

  const formSchema = z.object({
    tenantName: z.string().min(2, "Tenant name must be at least 2 characters."),
    ownerName: z.string().min(2, "Owner name must be at least 2 characters."),
    email: z.string().email("Must be a valid email address."),
    phoneNumber: z.string().min(10, "Phone number must be at least 10 characters."),
    businessType: z.string().min(2, "Business type must be at least 2 characters."),
    status: z.enum(['pending', 'approved', 'rejected']),
    shopConfig: z.object({
      shopName: z.string().min(2, "Shop name must be at least 2 characters."),
      shopDescription: z.string(),
      currency: z.string().min(1, "Currency is required."),
      taxRate: z.number().min(0).max(100, "Tax rate must be between 0 and 100."),
      shippingFee: z.number().min(0, "Shipping fee must be a positive number."),
    }),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tenantName: "",
      ownerName: "",
      email: "",
      phoneNumber: "",
      businessType: "",
      status: "pending",
      shopConfig: {
        shopName: "",
        shopDescription: "",
        currency: "EUR",
        taxRate: 20,
        shippingFee: 5,
      },
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (editingRegistration) {
      updateTenantRegistration && updateTenantRegistration(editingRegistration.id, {
        ...values,
        submittedAt: editingRegistration.submittedAt,
      })
      setEditingRegistration(null)
      toast.success('Tenant registration updated successfully')
    } else {
      const newRegistration: TenantRegistration = {
        id: Date.now().toString(),
        ...values,
        submittedAt: new Date(),
      }
      addTenantRegistration && addTenantRegistration(newRegistration)
      toast.success('New tenant registration added successfully')
    }
    form.reset()
  }

  return (
    <>
      <h2 className="text-3xl font-bold text-gray-800 mb-8">{GLOBAL_STRINGS.TENANT_REGISTRATIONS}</h2>

      <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="search-registrations">Search Registrations</Label>
          <Input
            id="search-registrations"
            placeholder="Search by tenant name, owner name, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="status-filter">Filter by Status</Label>
          <Select value={statusFilter} onValueChange={(value: TenantRegistration['status'] | 'all') => setStatusFilter(value)}>
            <SelectTrigger>
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="date-filter">Filter by Date</Label>
          <Input
            id="date-filter"
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-4">
        {filteredRegistrations.map((registration) => (
          <Card key={registration.id}>
            <CardHeader>
              <CardTitle>{registration.tenantName}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p><strong>Owner:</strong> {registration.ownerName}</p>
                  <p><strong>Email:</strong> {registration.email}</p>
                  <p><strong>Phone:</strong> {registration.phoneNumber}</p>
                  <p><strong>Business Type:</strong> {registration.businessType}</p>
                </div>
                <div>
                  <p><strong>Status:</strong> {registration.status}</p>
                  <p><strong>Submitted At:</strong> {new Date(registration.submittedAt).toLocaleString()}</p>
                  <p><strong>Shop Name:</strong> {registration.shopConfig.shopName}</p>
                  <p><strong>Currency:</strong> {registration.shopConfig.currency}</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setEditingRegistration(registration)}>
                <Edit className="w-4 h-4 mr-2" /> Edit
              </Button>
              <Button variant="destructive" onClick={() => deleteTenantRegistration && deleteTenantRegistration(registration.id)}>
                <Trash2 className="w-4 h-4 mr-2" /> Delete
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Dialog open={!!editingRegistration} onOpenChange={() => setEditingRegistration(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Tenant Registration</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="tenantName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tenant Name</FormLabel>
                    <FormControl>
                      <Input {...field} defaultValue={editingRegistration?.tenantName} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="ownerName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Owner Name</FormLabel>
                    <FormControl>
                      <Input {...field} defaultValue={editingRegistration?.ownerName} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} defaultValue={editingRegistration?.email} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input {...field} defaultValue={editingRegistration?.phoneNumber} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="businessType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Type</FormLabel>
                    <FormControl>
                      <Input {...field} defaultValue={editingRegistration?.businessType} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={editingRegistration?.status}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="shopConfig.shopName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Shop Name</FormLabel>
                    <FormControl>
                      <Input {...field} defaultValue={editingRegistration?.shopConfig.shopName} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="shopConfig.shopDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Shop Description</FormLabel>
                    <FormControl>
                      <Textarea {...field} defaultValue={editingRegistration?.shopConfig.shopDescription} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="shopConfig.currency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Currency</FormLabel>
                    <FormControl>
                      <Input {...field} defaultValue={editingRegistration?.shopConfig.currency} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="shopConfig.taxRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tax Rate (%)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} defaultValue={editingRegistration?.shopConfig.taxRate} onChange={(e) => field.onChange(parseFloat(e.target.value))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="shopConfig.shippingFee"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Shipping Fee</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} defaultValue={editingRegistration?.shopConfig.shippingFee} onChange={(e) => field.onChange(parseFloat(e.target.value))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Update Registration</Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  )
}

function TenantsAdministration() {
  const { tenants, addTenant, updateTenant, deleteTenant } = useGlobalStore()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<Tenant['status'] | 'all'>('all')
  const [editingTenant, setEditingTenant] = useState<Tenant | null>(null)
  const [isAddTenantOpen, setIsAddTenantOpen] = useState(false)

  const filteredTenants = tenants.filter(tenant =>
    tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (statusFilter === 'all' || tenant.status === statusFilter)
  )

  const formSchema = z.object({
    name: z.string().min(2, "Tenant name must be at least 2 characters."),
    domain: z.string().min(3, "Domain must be at least 3 characters."),
    status: z.enum(['active', 'pending', 'suspended']),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      domain: "",
      status: "pending",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (editingTenant) {
      updateTenant(editingTenant.id, values)
      setEditingTenant(null)
      toast.success('Tenant updated successfully')
    } else {
      const newTenant: Tenant = {
        id: Date.now().toString(),
        ...values,
      }
      addTenant(newTenant)
      setIsAddTenantOpen(false)
      toast.success('New tenant added successfully')
    }
    form.reset()
  }

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">{GLOBAL_STRINGS.TENANTS_ADMINISTRATION}</h2>
        <Button onClick={() => setIsAddTenantOpen(true)}>
          <Plus className="w-4 h-4 mr-2" /> Add Tenant
        </Button>
      </div>

      <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="search-tenants">Search Tenants</Label>
          <Input
            id="search-tenants"
            placeholder="Search by tenant name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="status-filter">Filter by Status</Label>
          <Select value={statusFilter} onValueChange={(value: Tenant['status'] | 'all') => setStatusFilter(value)}>
            <SelectTrigger>
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-4">
        {filteredTenants.map((tenant) => (
          <Card key={tenant.id}>
            <CardHeader>
              <CardTitle>{tenant.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p><strong>Domain:</strong> {tenant.domain}</p>
              <p><strong>Status:</strong> {tenant.status}</p>
            </CardContent>
            <CardFooter className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setEditingTenant(tenant)}>
                <Edit className="w-4 h-4 mr-2" /> Edit
              </Button>
              <Button variant="destructive" onClick={() => deleteTenant(tenant.id)}>
                <Trash2 className="w-4 h-4 mr-2" /> Delete
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Dialog open={isAddTenantOpen || !!editingTenant} onOpenChange={(open) => {
        if (!open) {
          setIsAddTenantOpen(false)
          setEditingTenant(null)
        }
      }}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingTenant ? 'Edit Tenant' : 'Add Tenant'}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tenant Name</FormLabel>
                    <FormControl>
                      <Input {...field} defaultValue={editingTenant?.name} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="domain"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Domain</FormLabel>
                    <FormControl>
                      <Input {...field} defaultValue={editingTenant?.domain} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={editingTenant?.status || field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="suspended">Suspended</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">{editingTenant ? 'Update Tenant' : 'Add Tenant'}</Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  )
}

function TenantSignup() {
  const { currentTenant } = useGlobalStore()
  const tenantStore = createTenantStore(currentTenant?.id || 'default')
  const { addTenantRegistration } = tenantStore.getState()
  const [isSubmitted, setIsSubmitted] = useState(false)

  const formSchema = z.object({
    tenantName: z.string().min(2, "Tenant name must be at least 2 characters."),
    ownerName: z.string().min(2, "Owner name must be at least 2 characters."),
    email: z.string().email("Must be a valid email address."),
    phoneNumber: z.string().min(10, "Phone number must be at least 10 characters."),
    businessType: z.string().min(2, "Business type must be at least 2 characters."),
    shopConfig: z.object({
      shopName: z.string().min(2, "Shop name must be at least 2 characters."),
      shopDescription: z.string(),
      currency: z.string().min(1, "Currency is required."),
      taxRate: z.number().min(0).max(100, "Tax rate must be between 0 and 100."),
      shippingFee: z.number().min(0, "Shipping fee must be a positive number."),
    }),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tenantName: "",
      ownerName: "",
      email: "",
      phoneNumber: "",
      businessType: "",
      shopConfig: {
        shopName: "",
        shopDescription: "",
        currency: "EUR",
        taxRate: 20,
        shippingFee: 5,
      },
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (addTenantRegistration) {
      const newRegistration: TenantRegistration = {
        id: Date.now().toString(),
        ...values,
        status: 'pending',
        submittedAt: new Date(),
      }
      addTenantRegistration(newRegistration)
      setIsSubmitted(true)
      toast.success('Tenant registration submitted successfully')
    }
  }

  if (isSubmitted) {
    return (
      <Card className="max-w-md mx-auto mt-10">
        <CardHeader>
          <CardTitle>Thank You for Registering!</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Your tenant registration has been submitted successfully. We will review your application and get back to you soon.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <h2 className="text-3xl font-bold text-gray-800 mb-8">{GLOBAL_STRINGS.TENANT_SIGNUP}</h2>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Register Your Tenant</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="tenantName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tenant Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="ownerName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Owner Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="businessType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Type</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="shopConfig.shopName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Shop Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="shopConfig.shopDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Shop Description</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="shopConfig.currency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Currency</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="shopConfig.taxRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tax Rate (%)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} onChange={(e) => field.onChange(parseFloat(e.target.value))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="shopConfig.shippingFee"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Default Shipping Fee</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} onChange={(e) => field.onChange(parseFloat(e.target.value))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">Submit Registration</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  )
}

function MyClients() {
  const { currentTenant } = useGlobalStore()
  const tenantStore = createTenantStore(currentTenant?.id || 'default')
  const { orders } = tenantStore.getState()
  const [searchTerm, setSearchTerm] = useState("")
  const [sortConfig, setSortConfig] = useState<{ key: keyof Client; direction: 'asc' | 'desc' } | null>(null)

  // Aggregate client data from orders
  const clients = useMemo(() => {
    const clientMap = new Map<string, Client>()

    orders?.forEach(order => {
      if (!clientMap.has(order.customerEmail)) {
        clientMap.set(order.customerEmail, {
          name: order.customerName,
          email: order.customerEmail,
          phone: order.customerPhone,
          totalOrders: 0,
          totalSpent: 0,
          lastOrderDate: new Date(0)
        })
      }

      const client = clientMap.get(order.customerEmail)!
      client.totalOrders++
      client.totalSpent += order.totalAmount
      client.lastOrderDate = new Date(Math.max(client.lastOrderDate.getTime(), new Date(order.createdAt).getTime()))
    })

    return Array.from(clientMap.values())
  }, [orders])

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.phone.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const sortedClients = useMemo(() => {
    if (sortConfig !== null) {
      return [...filteredClients].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1
        }
        return 0
      })
    }
    return filteredClients
  }, [filteredClients, sortConfig])

  const requestSort = (key: keyof Client) => {
    let direction: 'asc' | 'desc' = 'asc'
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc'
    }
    setSortConfig({ key, direction })
  }

  const columns: ColumnDef<Client>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => requestSort('name')}
          >
            {COLUMN_HEADERS.NAME}
            {sortConfig?.key === 'name' && (sortConfig.direction === 'asc' ? ' 🔼' : ' 🔽')}
          </Button>
        )
      },
    },
    {
      accessorKey: "email",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => requestSort('email')}
          >
            {COLUMN_HEADERS.EMAIL}
            {sortConfig?.key === 'email' && (sortConfig.direction === 'asc' ? ' 🔼' : ' 🔽')}
          </Button>
        )
      },
    },
    {
      accessorKey: "phone",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => requestSort('phone')}
          >
            {COLUMN_HEADERS.PHONE}
            {sortConfig?.key === 'phone' && (sortConfig.direction === 'asc' ? ' 🔼' : ' 🔽')}
          </Button>
        )
      },
    },
    {
      accessorKey: "totalOrders",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => requestSort('totalOrders')}
          >
            {COLUMN_HEADERS.TOTAL_ORDERS}
            {sortConfig?.key === 'totalOrders' && (sortConfig.direction === 'asc' ? ' 🔼' : ' 🔽')}
          </Button>
        )
      },
    },
    {
      accessorKey: "totalSpent",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => requestSort('totalSpent')}
          >
            {COLUMN_HEADERS.TOTAL_SPENT}
            {sortConfig?.key === 'totalSpent' && (sortConfig.direction === 'asc' ? ' 🔼' : ' 🔽')}
          </Button>
        )
      },
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("totalSpent"))
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(amount)
        return <div className="font-medium">{formatted}</div>
      },
    },
    {
      accessorKey: "lastOrderDate",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => requestSort('lastOrderDate')}
          >
            {COLUMN_HEADERS.LAST_ORDER_DATE}
            {sortConfig?.key === 'lastOrderDate' && (sortConfig.direction === 'asc' ? ' 🔼' : ' 🔽')}
          </Button>
        )
      },
      cell: ({ row }) => {
        return <div>{new Date(row.getValue("lastOrderDate")).toLocaleDateString()}</div>
      },
    },
  ]

  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

  const table = useReactTable({
    data: sortedClients,
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
    <>
      <h2 className="text-3xl font-bold text-gray-800 mb-8">{GLOBAL_STRINGS.MY_CLIENTS}</h2>

      <div className="mb-4">
        <Input
          placeholder="Search clients..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
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
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
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
    </>
  )
}