'use client'

import { useState, useEffect, useRef } from "react"
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
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

// Custom hook to use the tenant store
const useTenantStore = (tenantId: string) => {
    const [store, setStore] = useState<ReturnType<typeof createTenantStore> | null>(null)

    useEffect(() => {
        const newStore = createTenantStore(tenantId)
        setStore(newStore)
    }, [tenantId])

    return store
}

// Utility function for logging
const logInfo = (message: string, data?: any) => {
    if (process.env.NODE_ENV === 'development') {
        console.log(`[INFO] ${message}`, data)
    }
}

export default function AdminDashboard() {
    const { currentUser, currentTenant, isSuperAdminMode } = useGlobalStore()
    const [activeTab, setActiveTab] = useState("meal-planner")
    const tenantStore = useTenantStore(currentTenant?.id || 'default')

    useEffect(() => {
        if (tenantStore) {
            logInfo('Tenant store initialized', { tenantId: currentTenant?.id })
        }
    }, [tenantStore, currentTenant])

    const getMenuItems = () => {
        const commonItems = [
            { label: "Meal Ordering", icon: ShoppingCart, tab: "meal-ordering" },
            { label: "My Orders", icon: FileText, tab: "my-orders" },
            { label: "My Clients", icon: User, tab: "my-clients" },
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
    const { users, setCurrentUser } = useGlobalStore()
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
    const { users, setCurrentUser } = useGlobalStore()
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

function MealPlanner() {
    const { currentTenant } = useGlobalStore()
    const tenantStore = useTenantStore(currentTenant?.id || 'default')
    const { mealOfferings, items, addMealOffering, editMealOffering, deleteMealOffering, duplicateMealOffering, assignItem, removeItem, toggleMealOfferingStatus, sortMealItems, shopSettings } = tenantStore?.getState() || {}
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

        if (name && startDate && endDate && locationId && addMealOffering) {
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

    const filteredMealOfferings = mealOfferings?.filter(offering =>
        offering.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (dateFilter ? new Date(offering.startDate) >= new Date(dateFilter) : true) &&
        (statusFilter === 'all' || offering.status === statusFilter) &&
        (locationFilter === 'all' || offering.locationId === locationFilter)
    ) || []

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
                                <Select name="location" defaultValue={shopSettings?.primaryLocationId}>
                                    <SelectTrigger id="location">
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
                                    {shopSettings?.locations.map((location) => (
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
                                                    {shopSettings?.locations.find(l => l.id === offering.locationId)?.name || 'Unknown Location'}
                                                </Badge>
                                            </div>
                                            <div className="space-x-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => {
                                                        if (toggleMealOfferingStatus) {
                                                            toggleMealOfferingStatus(offering.id)
                                                            toast.success(`Meal offering status changed to ${offering.status === 'published' ? 'draft' : 'published'}`)
                                                        }
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
                                                                if (editMealOffering) {
                                                                    editMealOffering(offering.id, updatedOffering)
                                                                    setEditingOffering(null)
                                                                    toast.success('Meal offering updated successfully')
                                                                }
                                                            }}
                                                            onCancel={() => setEditingOffering(null)}
                                                        />
                                                    </DialogContent>
                                                </Dialog>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => {
                                                        if (duplicateMealOffering) {
                                                            duplicateMealOffering(offering.id)
                                                            toast.success('Meal offering duplicated successfully')
                                                        }
                                                    }}
                                                >
                                                    <Copy className="w-4 h-4 mr-2" /> Duplicate
                                                </Button>
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() => {
                                                        if (deleteMealOffering) {
                                                            deleteMealOffering(offering.id)
                                                            toast.success('Meal offering deleted successfully')
                                                        }
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
                                                                            onClick={() => {
                                                                                if (sortMealItems) {
                                                                                    sortMealItems(offering.id, category, index, Math.max(0, index - 1))
                                                                                }
                                                                            }}
                                                                            disabled={index === 0}
                                                                        >
                                                                            <ArrowUp className="w-4 h-4" />
                                                                        </Button>
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="sm"
                                                                            onClick={() => {
                                                                                if (sortMealItems) {
                                                                                    sortMealItems(offering.id, category, index, Math.min(offering.items[category].length - 1, index + 1))
                                                                                }
                                                                            }}
                                                                            disabled={index === offering.items[category].length - 1}
                                                                        >
                                                                            <ArrowDown className="w-4 h-4" />
                                                                        </Button>
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="sm"
                                                                            onClick={() => {
                                                                                if (removeItem) {
                                                                                    removeItem(offering.id, category, item.id)
                                                                                    toast.success(`${item.name} removed from ${category}`)
                                                                                }
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
                                                                    data={items?.filter(item => item.category === category && item.stock[offering.locationId] > 0 && item.availableLocations.includes(offering.locationId)) || []}
                                                                    onItemSelect={(item) => {
                                                                        if (assignItem) {
                                                                            assignItem(offering.id, category, item)
                                                                            togglePopover(`${offering.id}-${category}`, false)
                                                                            toast.success(`${item.name} added to ${category}`)
                                                                        }
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
    const { currentTenant } = useGlobalStore()
    const tenantStore = useTenantStore(currentTenant?.id || 'default')
    const { shopSettings } = tenantStore?.getState() || {}
    const [name, setName] = useState(offering.name)
    const [startDate, setStartDate] = useState(offering.startDate.toISOString().slice(0, 16))
    const [endDate, setEndDate] = useState(offering.endDate.toISOString().slice(0, 16))
    const [status, setStatus] = useState(offering.status)
    const [locationId, setLocationId] = useState(offering.locationId)

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
                        {shopSettings?.locations.map((location) => (
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
    const { currentTenant } = useGlobalStore()
    const tenantStore = useTenantStore(currentTenant?.id || 'default')
    const { items, addItem, updateItem, deleteItem, setItemFeaturedImage, shopSettings } = tenantStore?.getState() || {}
    const [newItemName, setNewItemName] = useState("")
    const [newItemCategory, setNewItemCategory] = useState("")
    const [newItemPrice, setNewItemPrice] = useState("")
    const [newItemTaxRate, setNewItemTaxRate] = useState("0")
    const [newItemStock, setNewItemStock] = useState<ItemStock>({})
    const [newItemDescription, setNewItemDescription] = useState("")
    const [newItemAttributes, setNewItemAttributes] = useState<Attribute[]>([{ key: "", value: "" }])
    const [newItemAvailableLocations, setNewItemAvailableLocations] = useState<string[]>([])
    const [editingItem, setEditingItem] = useState<Item | null>(null)
    const [searchTerm, setSearchTerm] = useState("")
    const [categoryFilter, setCategoryFilter] = useState("all")

    const handleAddItem = (event: React.FormEvent) => {
        event.preventDefault()
        if (addItem) {
            const newItem: Item = {
                id: Date.now(),
                name: newItemName,
                category: newItemCategory,
                price: parseFloat(newItemPrice),
                taxRate: parseFloat(newItemTaxRate),
                stock: newItemStock,
                description: newItemDescription,
                attributes: newItemAttributes.filter(attr => attr.key && attr.value),
                availableLocations: newItemAvailableLocations
            }
            addItem(newItem)
            setNewItemName("")
            setNewItemCategory("")
            setNewItemPrice("")
            setNewItemTaxRate("0")
            setNewItemStock({})
            setNewItemDescription("")
            setNewItemAttributes([{ key: "", value: "" }])
            setNewItemAvailableLocations([])
            toast.success('New item added successfully')
        }
    }

    const handleUpdateItem = (event: React.FormEvent) => {
        event.preventDefault()
        if (updateItem && editingItem) {
            updateItem(editingItem.id, editingItem)
            setEditingItem(null)
            toast.success('Item updated successfully')
        }
    }

    const handleDeleteItem = (id: number) => {
        if (deleteItem) {
            deleteItem(id)
            toast.success('Item deleted successfully')
        }
    }

    const handleImageUpload = (itemId: number, event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file && setItemFeaturedImage) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setItemFeaturedImage(itemId, reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const filteredItems = items?.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (categoryFilter === "all" || item.category === categoryFilter)
    ) || []

    const categories = Array.from(new Set(items?.map(item => item.category)))

    return (
        <>
            <h2 className="text-3xl font-bold text-gray-800 mb-8">Item Management</h2>

            {/* Add Item Form */}
            <Card className="mb-8">
                <CardHeader>
                    <CardTitle>Add New Item</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleAddItem} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="item-name">Item Name</Label>
                                <Input
                                    id="item-name"
                                    value={newItemName}
                                    onChange={(e) => setNewItemName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="item-category">Category</Label>
                                <Input
                                    id="item-category"
                                    value={newItemCategory}
                                    onChange={(e) => setNewItemCategory(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="item-price">Price</Label>
                                <Input
                                    id="item-price"
                                    type="number"
                                    step="0.01"
                                    value={newItemPrice}
                                    onChange={(e) => setNewItemPrice(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="item-tax-rate">Tax Rate (%)</Label>
                                <Input
                                    id="item-tax-rate"
                                    type="number"
                                    step="0.1"
                                    value={newItemTaxRate}
                                    onChange={(e) => setNewItemTaxRate(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Stock</Label>
                            {shopSettings?.locations.map((location) => (
                                <div key={location.id} className="flex items-center space-x-2">
                                    <Label htmlFor={`stock-${location.id}`}>{location.name}</Label>
                                    <Input
                                        id={`stock-${location.id}`}
                                        type="number"
                                        value={newItemStock[location.id] || ""}
                                        onChange={(e) => setNewItemStock(prev => ({ ...prev, [location.id]: parseInt(e.target.value) }))}
                                    />
                                </div>
                            ))}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="item-description">Description</Label>
                            <Textarea
                                id="item-description"
                                value={newItemDescription}
                                onChange={(e) => setNewItemDescription(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Attributes</Label>
                            {newItemAttributes.map((attr, index) => (
                                <div key={index} className="flex space-x-2">
                                    <Input
                                        placeholder="Key"
                                        value={attr.key}
                                        onChange={(e) => {
                                            const newAttributes = [...newItemAttributes]
                                            newAttributes[index].key = e.target.value
                                            setNewItemAttributes(newAttributes)
                                        }}
                                    />
                                    <Input
                                        placeholder="Value"
                                        value={attr.value}
                                        onChange={(e) => {
                                            const newAttributes = [...newItemAttributes]
                                            newAttributes[index].value = e.target.value
                                            setNewItemAttributes(newAttributes)
                                        }}
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => {
                                            const newAttributes = newItemAttributes.filter((_, i) => i !== index)
                                            setNewItemAttributes(newAttributes)
                                        }}
                                    >
                                        Remove
                                    </Button>
                                </div>
                            ))}
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setNewItemAttributes([...newItemAttributes, { key: "", value: "" }])}
                            >
                                Add Attribute
                            </Button>
                        </div>
                        <div className="space-y-2">
                            <Label>Available Locations</Label>
                            {shopSettings?.locations.map((location) => (
                                <div key={location.id} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={`location-${location.id}`}
                                        checked={newItemAvailableLocations.includes(location.id)}
                                        onCheckedChange={(checked) => {
                                            if (checked) {
                                                setNewItemAvailableLocations([...newItemAvailableLocations, location.id])
                                            } else {
                                                setNewItemAvailableLocations(newItemAvailableLocations.filter(id => id !== location.id))
                                            }
                                        }}
                                    />
                                    <Label htmlFor={`location-${location.id}`}>{location.name}</Label>
                                </div>
                            ))}
                        </div>
                        <Button type="submit" className="w-full">
                            Add Item
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {/* Item List */}
            <Card>
                <CardHeader>
                    <CardTitle>Item List</CardTitle>
                </CardHeader>
                <CardContent>
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
                            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                                <SelectTrigger id="category-filter">
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Categories</SelectItem>
                                    {categories.map((category) => (
                                        <SelectItem key={category} value={category}>{category}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <ScrollArea className="h-[600px]">
                        {filteredItems.length > 0 ? (
                            <ul className="space-y-4">
                                {filteredItems.map((item) => (
                                    <li key={item.id} className="bg-gray-100 rounded p-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h3 className="font-bold">{item.name}</h3>
                                                <p className="text-sm text-gray-600">Category: {item.category}</p>
                                                <p className="text-sm text-gray-600">Price: €{item.price?.toFixed(2) ?? 'N/A'}</p>
                                                <p className="text-sm text-gray-600">Tax Rate: {item.taxRate}%</p>
                                                <p className="text-sm text-gray-600">Description: {item.description}</p>
                                                <div className="text-sm text-gray-600">
                                                    Stock:
                                                    {Object.entries(item.stock).map(([locationId, stockValue]) => (
                                                        <span key={locationId} className="ml-2">
                                                            {shopSettings?.locations.find(l => l.id === locationId)?.name}: {stockValue}
                                                        </span>
                                                    ))}
                                                </div>
                                                <div className="text-sm text-gray-600">
                                                    Available Locations:
                                                    {item.availableLocations.map(locationId => (
                                                        <span key={locationId} className="ml-2">
                                                            {shopSettings?.locations.find(l => l.id === locationId)?.name}
                                                        </span>
                                                    ))}
                                                </div>
                                                <div className="text-sm text-gray-600">
                                                    Attributes:
                                                    {item.attributes.map((attr, index) => (
                                                        <span key={index} className="ml-2">
                                                            {attr.key}: {attr.value}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="flex space-x-2">
                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <Button variant="outline" size="sm">
                                                            <Edit className="w-4 h-4 mr-2" /> Edit
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent>
                                                        <DialogHeader>
                                                            <DialogTitle>Edit Item</DialogTitle>
                                                        </DialogHeader>
                                                        <EditItemForm
                                                            item={item}
                                                            onSave={(updatedItem) => {
                                                                if (updateItem) {
                                                                    updateItem(item.id, updatedItem)
                                                                    toast.success('Item updated successfully')
                                                                }
                                                            }}
                                                        />
                                                    </DialogContent>
                                                </Dialog>
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() => handleDeleteItem(item.id)}
                                                >
                                                    <Trash2 className="w-4 h-4 mr-2" /> Delete
                                                </Button>
                                            </div>
                                        </div>
                                        <div className="mt-2">
                                            {item.featuredImage && (
                                                <img src={item.featuredImage} alt={item.name} className="w-32 h-32 object-cover rounded" />
                                            )}
                                            <Input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => handleImageUpload(item.id, e)}
                                                className="mt-2"
                                            />
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-center text-gray-500">No items found.</p>
                        )}
                    </ScrollArea>
                </CardContent>
            </Card>
        </>
    )
}

function EditItemForm({ item, onSave }: { item: Item, onSave: (updatedItem: Partial<Item>) => void }) {
    const { currentTenant } = useGlobalStore()
    const tenantStore = useTenantStore(currentTenant?.id || 'default')
    const { shopSettings } = tenantStore?.getState() || {}
    const [name, setName] = useState(item.name)
    const [category, setCategory] = useState(item.category)
    const [price, setPrice] = useState(item.price?.toString() || "")
    const [taxRate, setTaxRate] = useState(item.taxRate.toString())
    const [stock, setStock] = useState(item.stock)
    const [description, setDescription] = useState(item.description || "")
    const [attributes, setAttributes] = useState(item.attributes)
    const [availableLocations, setAvailableLocations] = useState(item.availableLocations)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSave({
            name,
            category,
            price: parseFloat(price),
            taxRate: parseFloat(taxRate),
            stock,
            description,
            attributes,
            availableLocations
        })
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="edit-item-name">Item Name</Label>
                <Input
                    id="edit-item-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="edit-item-category">Category</Label>
                <Input
                    id="edit-item-category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="edit-item-price">Price</Label>
                <Input
                    id="edit-item-price"
                    type="number"
                    step="0.01"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="edit-item-tax-rate">Tax Rate (%)</Label>
                <Input
                    id="edit-item-tax-rate"
                    type="number"
                    step="0.1"
                    value={taxRate}
                    onChange={(e) => setTaxRate(e.target.value)}
                    required
                />
            </div>
            <div className="space-y-2">
                <Label>Stock</Label>
                {shopSettings?.locations.map((location) => (
                    <div key={location.id} className="flex items-center space-x-2">
                        <Label htmlFor={`edit-stock-${location.id}`}>{location.name}</Label>
                        <Input
                            id={`edit-stock-${location.id}`}
                            type="number"
                            value={stock[location.id] || ""}
                            onChange={(e) => setStock(prev => ({ ...prev, [location.id]: parseInt(e.target.value) }))}
                        />
                    </div>
                ))}
            </div>
            <div className="space-y-2">
                <Label htmlFor="edit-item-description">Description</Label>
                <Textarea
                    id="edit-item-description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </div>
            <div className="space-y-2">
                <Label>Attributes</Label>
                {attributes.map((attr, index) => (
                    <div key={index} className="flex space-x-2">
                        <Input
                            placeholder="Key"
                            value={attr.key}
                            onChange={(e) => {
                                const newAttributes = [...attributes]
                                newAttributes[index].key = e.target.value
                                setAttributes(newAttributes)
                            }}
                        />
                        <Input
                            placeholder="Value"
                            value={attr.value}
                            onChange={(e) => {
                                const newAttributes = [...attributes]
                                newAttributes[index].value = e.target.value
                                setAttributes(newAttributes)
                            }}
                        />
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                                const newAttributes = attributes.filter((_, i) => i !== index)
                                setAttributes(newAttributes)
                            }}
                        >
                            Remove
                        </Button>
                    </div>
                ))}
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => setAttributes([...attributes, { key: "", value: "" }])}
                >
                    Add Attribute
                </Button>
            </div>
            <div className="space-y-2">
                <Label>Available Locations</Label>
                {shopSettings?.locations.map((location) => (
                    <div key={location.id} className="flex items-center space-x-2">
                        <Checkbox
                            id={`edit-location-${location.id}`}
                            checked={availableLocations.includes(location.id)}
                            onCheckedChange={(checked) => {
                                if (checked) {
                                    setAvailableLocations([...availableLocations, location.id])
                                } else {
                                    setAvailableLocations(availableLocations.filter(id => id !== location.id))
                                }
                            }}
                        />
                        <Label htmlFor={`edit-location-${location.id}`}>{location.name}</Label>
                    </div>
                ))}
            </div>
            <Button type="submit">Save Changes</Button>
        </form>
    )
}

function MediaGallery() {
    const { currentTenant } = useGlobalStore()
    const tenantStore = useTenantStore(currentTenant?.id || 'default')
    const { mediaItems, addMediaItem, deleteMediaItem } = tenantStore?.getState() || {}
    const [searchTerm, setSearchTerm] = useState("")
    const [typeFilter, setTypeFilter] = useState<'all' | 'image' | 'video'>('all')

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file && addMediaItem) {
            const reader = new FileReader()
            reader.onloadend = () => {
                const newMediaItem: MediaItem = {
                    id: Date.now(),
                    name: file.name,
                    url: reader.result as string,
                    type: file.type.startsWith('image/') ? 'image' : 'video'
                }
                addMediaItem(newMediaItem)
                toast.success('Media item added successfully')
            }
            reader.readAsDataURL(file)
        }
    }

    const handleDeleteMediaItem = (id: number) => {
        if (deleteMediaItem) {
            deleteMediaItem(id)
            toast.success('Media item deleted successfully')
        }
    }

    const filteredMediaItems = mediaItems?.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (typeFilter === 'all' || item.type === typeFilter)
    ) || []

    return (
        <>
            <h2 className="text-3xl font-bold text-gray-800 mb-8">Media Gallery</h2>

            <Card className="mb-8">
                <CardHeader>
                    <CardTitle>Upload Media</CardTitle>
                </CardHeader>
                <CardContent>
                    <Input
                        type="file"
                        accept="image/*,video/*"
                        onChange={handleFileUpload}
                    />
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Media Items</CardTitle>
                </CardHeader>
                <CardContent>
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
                                <SelectTrigger id="type-filter">
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All</SelectItem>
                                    <SelectItem value="image">Images</SelectItem>
                                    <SelectItem value="video">Videos</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <ScrollArea className="h-[600px]">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredMediaItems.map((item) => (
                                <div key={item.id} className="bg-gray-100 rounded p-4">
                                    <div className="mb-2">
                                        {item.type === 'image' ? (
                                            <img src={item.url} alt={item.name} className="w-full h-48 object-cover rounded" />
                                        ) : (
                                            <video src={item.url} className="w-full h-48 object-cover rounded" controls />
                                        )}
                                    </div>
                                    <p className="font-bold">{item.name}</p>
                                    <p className="text-sm text-gray-600">Type: {item.type}</p>
                                    <div className="mt-2 flex justify-between">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => {
                                                navigator.clipboard.writeText(item.url)
                                                toast.success('URL copied to clipboard')
                                            }}
                                        >
                                            <Copy className="w-4 h-4 mr-2" /> Copy URL
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => handleDeleteMediaItem(item.id)}
                                        >
                                            <Trash2 className="w-4 h-4 mr-2" /> Delete
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                </CardContent>
            </Card>
        </>
    )
}

function MealOrdering() {
    const { currentTenant, currentUser } = useGlobalStore()
    const tenantStore = useTenantStore(currentTenant?.id || 'default')
    const { mealOfferings, items, cart, addToCart, removeFromCart, updateCartItemQuantity, clearCart, addOrder, shopSettings } = tenantStore?.getState() || {}
    const [selectedLocation, setSelectedLocation] = useState(shopSettings?.primaryLocationId || '')
    const [selectedDate, setSelectedDate] = useState<Date | null>(null)
    const [selectedMealOffering, setSelectedMealOffering] = useState<MealOffering | null>(null)
    const [showCart, setShowCart] = useState(false)
    const [shippingMethod, setShippingMethod] = useState<ShippingMethod | null>(null)
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null)
    const [customerInfo, setCustomerInfo] = useState({
        name: currentUser?.name || '',
        email: currentUser?.email || '',
        phone: '',
        address: ''
    })

    useEffect(() => {
        if (selectedLocation && selectedDate) {
            const offering = mealOfferings?.find(offering =>
                offering.locationId === selectedLocation &&
                new Date(offering.startDate) <= selectedDate &&
                new Date(offering.endDate) >= selectedDate &&
                offering.status === 'published'
            )
            setSelectedMealOffering(offering || null)
        } else {
            setSelectedMealOffering(null)
        }
    }, [selectedLocation, selectedDate, mealOfferings])

    const handleAddToCart = (item: Item) => {
        if (addToCart && selectedLocation) {
            addToCart(item, selectedLocation)
        }
    }

    const handleRemoveFromCart = (itemId: number) => {
        if (removeFromCart) {
            removeFromCart(itemId)
        }
    }

    const handleUpdateCartItemQuantity = (itemId: number, quantity: number) => {
        if (updateCartItemQuantity) {
            updateCartItemQuantity(itemId, quantity)
        }
    }

    const handleClearCart = () => {
        if (clearCart) {
            clearCart()
        }
    }

    const handlePlaceOrder = () => {
        if (addOrder && cart && cart.length > 0 && selectedLocation && shippingMethod && paymentMethod) {
            const newOrder: Order = {
                id: Date.now(),
                customerName: customerInfo.name,
                customerEmail: customerInfo.email,
                customerPhone: customerInfo.phone,
                deliveryAddress: customerInfo.address,
                items: cart,
                totalAmount: calculateTotal(),
                status: 'pending',
                createdAt: new Date(),
                locationId: selectedLocation,
                shippingMethodId: shippingMethod.id,
                paymentMethodId: paymentMethod.id
            }
            addOrder(newOrder)
            clearCart()
            setShowCart(false)
            toast.success('Order placed successfully!')
        } else {
            toast.error('Please fill in all required information and select shipping and payment methods.')
        }
    }

    const calculateTotal = () => {
        const itemsTotal = cart?.reduce((total, item) => total + (item.price * item.quantity), 0) || 0
        const shippingCost = shippingMethod?.price || 0
        return itemsTotal + shippingCost
    }

    return (
        <>
            <h2 className="text-3xl font-bold text-gray-800 mb-8">Meal Ordering</h2>

            <Card className="mb-8">
                <CardHeader>
                    <CardTitle>Select Location and Date</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="location">Location</Label>
                            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                                <SelectTrigger id="location">
                                    <SelectValue placeholder="Select location" />
                                </SelectTrigger>
                                <SelectContent>
                                    {shopSettings?.locations.map((location) => (
                                        <SelectItem key={location.id} value={location.id}>{location.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="date">Date</Label>
                            <Input
                                id="date"
                                type="date"
                                value={selectedDate?.toISOString().split('T')[0] || ''}
                                onChange={(e) => setSelectedDate(e.target.value ? new Date(e.target.value) : null)}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {selectedMealOffering ? (
                <Card>
                    <CardHeader>
                        <CardTitle>{selectedMealOffering.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Tabs defaultValue="Entrées">
                            <TabsList>
                                {Object.keys(selectedMealOffering.items).map((category) => (
                                    <TabsTrigger key={category} value={category}>{category}</TabsTrigger>
                                ))}
                            </TabsList>
                            {Object.entries(selectedMealOffering.items).map(([category, categoryItems]) => (
                                <TabsContent key={category} value={category}>
                                    <ScrollArea className="h-[400px]">
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {categoryItems.map((item) => (
                                                <Card key={item.id}>
                                                    <CardHeader>
                                                        <CardTitle>{item.name}</CardTitle>
                                                    </CardHeader>
                                                    <CardContent>
                                                        {item.featuredImage && (
                                                            <img src={item.featuredImage} alt={item.name} className="w-full h-32 object-cover rounded mb-2" />
                                                        )}
                                                        <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                                                        <p className="font-bold">€{item.price?.toFixed(2) ?? 'N/A'}</p>
                                                        <p className="text-sm text-gray-600">Tax: {item.taxRate}%</p>
                                                        <p className="text-sm text-gray-600">Stock: {item.stock[selectedLocation] ?? 'N/A'}</p>
                                                        <Button
                                                            className="mt-2"
                                                            onClick={() => handleAddToCart(item)}
                                                            disabled={!item.stock[selectedLocation] || item.stock[selectedLocation] <= 0}
                                                        >
                                                            Add to Cart
                                                        </Button>
                                                    </CardContent>
                                                </Card>
                                            ))}
                                        </div>
                                    </ScrollArea>
                                </TabsContent>
                            ))}
                        </Tabs>
                    </CardContent>
                </Card>
            ) : (
                <p className="text-center text-gray-500">No meal offering available for the selected location and date.</p>
            )}

            <Button className="mt-4" onClick={() => setShowCart(true)}>
                View Cart ({cart?.length || 0} items)
            </Button>

            <Dialog open={showCart} onOpenChange={setShowCart}>
                <DialogContent className="sm:max-w-[800px]">
                    <DialogHeader>
                        <DialogTitle>Your Cart</DialogTitle>
                    </DialogHeader>
                    {cart && cart.length > 0 ? (
                        <>
                            <ScrollArea className="h-[400px]">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Item</TableHead>
                                            <TableHead>Price</TableHead>
                                            <TableHead>Quantity</TableHead>
                                            <TableHead>Total</TableHead>
                                            <TableHead>Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {cart.map((item) => (
                                            <TableRow key={item.id}>
                                                <TableCell>{item.name}</TableCell>
                                                <TableCell>€{item.price?.toFixed(2) ?? 'N/A'}</TableCell>
                                                <TableCell>
                                                    <Input
                                                        type="number"
                                                        min="1"
                                                        value={item.quantity}
                                                        onChange={(e) => handleUpdateCartItemQuantity(item.id, parseInt(e.target.value))}
                                                        className="w-16"
                                                    />
                                                </TableCell>
                                                <TableCell>€{((item.price || 0) * item.quantity).toFixed(2)}</TableCell>
                                                <TableCell>
                                                    <Button variant="destructive" size="sm" onClick={() => handleRemoveFromCart(item.id)}>
                                                        Remove
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </ScrollArea>
                            <div className="mt-4">
                                <h3 className="font-bold mb-2">Customer Information</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <Input
                                        placeholder="Name"
                                        value={customerInfo.name}
                                        onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                                    />
                                    <Input
                                        placeholder="Email"
                                        type="email"
                                        value={customerInfo.email}
                                        onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                                    />
                                    <Input
                                        placeholder="Phone"
                                        value={customerInfo.phone}
                                        onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                                    />
                                    <Input
                                        placeholder="Address"
                                        value={customerInfo.address}
                                        onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="mt-4">
                                <h3 className="font-bold mb-2">Shipping Method</h3>
                                <Select onValueChange={(value) => setShippingMethod(shopSettings?.shippingMethods.find(m => m.id === value) || null)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select shipping method" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {shopSettings?.shippingMethods
                                            .filter(method => method.enabled && method.availableLocations.includes(selectedLocation))
                                            .map((method) => (
                                                <SelectItem key={method.id} value={method.id}>
                                                    {method.name} - €{method.price.toFixed(2)}
                                                </SelectItem>
                                            ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="mt-4">
                                <h3 className="font-bold mb-2">Payment Method</h3>
                                <Select onValueChange={(value) => setPaymentMethod(shopSettings?.paymentMethods.find(m => m.id === value) || null)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select payment method" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {shopSettings?.paymentMethods
                                            .filter(method => method.enabled && method.availableLocations.includes(selectedLocation))
                                            .map((method) => (
                                                <SelectItem key={method.id} value={method.id}>{method.name}</SelectItem>
                                            ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="mt-4 flex justify-between items-center">
                                <p className="font-bold">Total: €{calculateTotal().toFixed(2)}</p>
                                <div className="space-x-2">
                                    <Button variant="outline" onClick={handleClearCart}>Clear Cart</Button>
                                    <Button onClick={handlePlaceOrder}>Place Order</Button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <p className="text-center text-gray-500">Your cart is empty.</p>
                    )}
                </DialogContent>
            </Dialog>
        </>
    )
}

function Orders() {
    const { currentTenant } = useGlobalStore()
    const tenantStore = useTenantStore(currentTenant?.id || 'default')
    const { orders, updateOrderStatus, editOrder, shopSettings } = tenantStore?.getState() || {}
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState<Order['status'] | 'all'>('all')
    const [locationFilter, setLocationFilter] = useState<string>('all')
    const [dateFilter, setDateFilter] = useState("")
    const [editingOrder, setEditingOrder] = useState<Order | null>(null)

    const handleUpdateStatus = (orderId: number, newStatus: Order['status']) => {
        if (updateOrderStatus) {
            updateOrderStatus(orderId, newStatus)
            toast.success(`Order status updated to ${newStatus}`)
        }
    }

    const handleEditOrder = (updatedOrder: Partial<Order>) => {
        if (editOrder && editingOrder) {
            editOrder(editingOrder.id, updatedOrder)
            setEditingOrder(null)
            toast.success('Order updated successfully')
        }
    }

    const filteredOrders = orders?.filter(order =>
        (order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (statusFilter === 'all' || order.status === statusFilter) &&
        (locationFilter === 'all' || order.locationId === locationFilter) &&
        (dateFilter ? new Date(order.createdAt) >= new Date(dateFilter) : true)
    ) || []

    return (
        <>
            <h2 className="text-3xl font-bold text-gray-800 mb-8">Orders</h2>

            <Card>
                <CardHeader>
                    <CardTitle>Order List</CardTitle>
                </CardHeader>
                <CardContent>
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
                                <SelectTrigger id="status-filter">
                                    <SelectValue placeholder="Select status" />
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
                                <SelectTrigger id="location-filter">
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
                    <ScrollArea className="h-[600px]">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Order ID</TableHead>
                                    <TableHead>Customer</TableHead>
                                    <TableHead>Total Amount</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Location</TableHead>
                                    <TableHead>Created At</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredOrders.map((order) => (
                                    <TableRow key={order.id}>
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
                                        <TableCell>{shopSettings?.locations.find(l => l.id === order.locationId)?.name || 'Unknown'}</TableCell>
                                        <TableCell>{new Date(order.createdAt).toLocaleString()}</TableCell>
                                        <TableCell>
                                            <div className="flex space-x-2">
                                                <Select
                                                    onValueChange={(value: Order['status']) => handleUpdateStatus(order.id, value)}
                                                    defaultValue={order.status}
                                                >
                                                    <SelectTrigger className="w-[120px]">
                                                        <SelectValue placeholder="Update status" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="pending">Pending</SelectItem>
                                                        <SelectItem value="processing">Processing</SelectItem>
                                                        <SelectItem value="completed">Completed</SelectItem>
                                                        <SelectItem value="cancelled">Cancelled</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <Button variant="outline" size="sm">
                                                            <Edit className="w-4 h-4 mr-2" /> Edit
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent>
                                                        <DialogHeader>
                                                            <DialogTitle>Edit Order</DialogTitle>
                                                        </DialogHeader>
                                                        <EditOrderForm
                                                            order={order}
                                                            onSave={handleEditOrder}
                                                            onCancel={() => setEditingOrder(null)}
                                                        />
                                                    </DialogContent>
                                                </Dialog>
                                                <Button variant="outline" size="sm" onClick={() => window.print()}>
                                                    <Printer className="w-4 h-4 mr-2" /> Print
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </ScrollArea>
                </CardContent>
            </Card>
        </>
    )
}

function EditOrderForm({ order, onSave, onCancel }: { order: Order, onSave: (updatedOrder: Partial<Order>) => void, onCancel: () => void }) {
    const { currentTenant } = useGlobalStore()
    const tenantStore = useTenantStore(currentTenant?.id || 'default')
    const { shopSettings } = tenantStore?.getState() || {}
    const [customerName, setCustomerName] = useState(order.customerName)
    const [customerEmail, setCustomerEmail] = useState(order.customerEmail)
    const [customerPhone, setCustomerPhone] = useState(order.customerPhone)
    const [deliveryAddress, setDeliveryAddress] = useState(order.deliveryAddress)
    const [status, setStatus] = useState(order.status)
    const [locationId, setLocationId] = useState(order.locationId)
    const [shippingMethodId, setShippingMethodId] = useState(order.shippingMethodId)
    const [paymentMethodId, setPaymentMethodId] = useState(order.paymentMethodId)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSave({
            customerName,
            customerEmail,
            customerPhone,
            deliveryAddress,
            status,
            locationId,
            shippingMethodId,
            paymentMethodId
        })
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="edit-customer-name">Customer Name</Label>
                <Input
                    id="edit-customer-name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    required
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="edit-customer-email">Customer Email</Label>
                <Input
                    id="edit-customer-email"
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    required
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="edit-customer-phone">Customer Phone</Label>
                <Input
                    id="edit-customer-phone"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    required
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="edit-delivery-address">Delivery Address</Label>
                <Textarea
                    id="edit-delivery-address"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
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
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
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
                        {shopSettings?.locations.map((location) => (
                            <SelectItem key={location.id} value={location.id}>{location.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div className="space-y-2">
                <Label htmlFor="edit-shipping-method">Shipping Method</Label>
                <Select value={shippingMethodId} onValueChange={setShippingMethodId}>
                    <SelectTrigger id="edit-shipping-method">
                        <SelectValue placeholder="Select shipping method" />
                    </SelectTrigger>
                    <SelectContent>
                        {shopSettings?.shippingMethods.map((method) => (
                            <SelectItem key={method.id} value={method.id}>{method.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div className="space-y-2">
                <Label htmlFor="edit-payment-method">Payment Method</Label>
                <Select value={paymentMethodI} onValueChange={setPaymentMethodId}>
                    <SelectTrigger id="edit-payment-method">
                        <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                    <SelectContent>
                        {shopSettings?.paymentMethods.map((method) => (
                            <SelectItem key={method.id} value={method.id}>{method.name}</SelectItem>
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

function MyOrders() {
    const { currentTenant, currentUser } = useGlobalStore()
    const tenantStore = useTenantStore(currentTenant?.id || 'default')
    const { orders, shopSettings } = tenantStore?.getState() || {}
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState<Order['status'] | 'all'>('all')
    const [dateFilter, setDateFilter] = useState("")

    const filteredOrders = orders?.filter(order =>
        order.customerEmail === currentUser?.email &&
        (order.id.toString().includes(searchTerm) ||
            order.customerName.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (statusFilter === 'all' || order.status === statusFilter) &&
        (dateFilter ? new Date(order.createdAt) >= new Date(dateFilter) : true)
    ) || []

    return (
        <>
            <h2 className="text-3xl font-bold text-gray-800 mb-8">My Orders</h2>

            <Card>
                <CardHeader>
                    <CardTitle>Order History</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <Label htmlFor="search-orders">Search Orders</Label>
                            <Input
                                id="search-orders"
                                placeholder="Search by order ID or name..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div>
                            <Label htmlFor="status-filter">Filter by Status</Label>
                            <Select value={statusFilter} onValueChange={(value: Order['status'] | 'all') => setStatusFilter(value)}>
                                <SelectTrigger id="status-filter">
                                    <SelectValue placeholder="Select status" />
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
                    <ScrollArea className="h-[600px]">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Order ID</TableHead>
                                    <TableHead>Total Amount</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Location</TableHead>
                                    <TableHead>Created At</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredOrders.map((order) => (
                                    <TableRow key={order.id}>
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
                                        <TableCell>{shopSettings?.locations.find(l => l.id === order.locationId)?.name || 'Unknown'}</TableCell>
                                        <TableCell>{new Date(order.createdAt).toLocaleString()}</TableCell>
                                        <TableCell>
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button variant="outline" size="sm">
                                                        View Details
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent>
                                                    <DialogHeader>
                                                        <DialogTitle>Order Details</DialogTitle>
                                                    </DialogHeader>
                                                    <div className="space-y-4">
                                                        <div>
                                                            <h3 className="font-bold">Order Items:</h3>
                                                            <ul className="list-disc list-inside">
                                                                {order.items.map((item, index) => (
                                                                    <li key={index}>
                                                                        {item.name} - Quantity: {item.quantity} - Price: €{(item.price * item.quantity).toFixed(2)}
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                        <div>
                                                            <h3 className="font-bold">Shipping Address:</h3>
                                                            <p>{order.deliveryAddress}</p>
                                                        </div>
                                                        <div>
                                                            <h3 className="font-bold">Shipping Method:</h3>
                                                            <p>{shopSettings?.shippingMethods.find(m => m.id === order.shippingMethodId)?.name || 'Unknown'}</p>
                                                        </div>
                                                        <div>
                                                            <h3 className="font-bold">Payment Method:</h3>
                                                            <p>{shopSettings?.paymentMethods.find(m => m.id === order.paymentMethodId)?.name || 'Unknown'}</p>
                                                        </div>
                                                    </div>
                                                </DialogContent>
                                            </Dialog>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </ScrollArea>
                </CardContent>
            </Card>
        </>
    )
}

function StockMovements() {
    const { currentTenant } = useGlobalStore()
    const tenantStore = useTenantStore(currentTenant?.id || 'default')
    const { stockMovements, items, cancelStockMovement, updateStock, shopSettings } = tenantStore?.getState() || {}
    const [searchTerm, setSearchTerm] = useState("")
    const [typeFilter, setTypeFilter] = useState<'all' | 'increase' | 'decrease'>('all')
    const [locationFilter, setLocationFilter] = useState<string>('all')
    const [dateFilter, setDateFilter] = useState("")
    const [newMovement, setNewMovement] = useState<Partial<StockMovement>>({
        itemId: 0,
        quantity: 0,
        type: 'increase',
        reason: '',
        locationId: ''
    })

    const handleAddStockMovement = (event: React.FormEvent) => {
        event.preventDefault()
        if (updateStock && newMovement.itemId && newMovement.quantity && newMovement.locationId) {
            updateStock(
                newMovement.itemId,
                newMovement.locationId,
                newMovement.type === 'increase' ? newMovement.quantity : -newMovement.quantity
            )
            setNewMovement({
                itemId: 0,
                quantity: 0,
                type: 'increase',
                reason: '',
                locationId: ''
            })
            toast.success('Stock movement added successfully')
        }
    }

    const handleCancelMovement = (movementId: number) => {
        if (cancelStockMovement) {
            cancelStockMovement(movementId)
            toast.success('Stock movement cancelled successfully')
        }
    }

    const filteredMovements = stockMovements?.filter(movement =>
        (items?.find(item => item.id === movement.itemId)?.name.toLowerCase().includes(searchTerm.toLowerCase()) || movement.reason.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (typeFilter === 'all' || movement.type === typeFilter) &&
        (locationFilter === 'all' || movement.locationId === locationFilter) &&
        (dateFilter ? new Date(movement.date) >= new Date(dateFilter) : true)
    ) || []

    return (
        <>
            <h2 className="text-3xl font-bold text-gray-800 mb-8">Stock Movements</h2>

            <Card className="mb-8">
                <CardHeader>
                    <CardTitle>Add Stock Movement</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleAddStockMovement} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="item">Item</Label>
                                <Select
                                    value={newMovement.itemId?.toString() || ''}
                                    onValueChange={(value) => setNewMovement({ ...newMovement, itemId: parseInt(value) })}
                                >
                                    <SelectTrigger id="item">
                                        <SelectValue placeholder="Select item" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {items?.map((item) => (
                                            <SelectItem key={item.id} value={item.id.toString()}>{item.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="quantity">Quantity</Label>
                                <Input
                                    id="quantity"
                                    type="number"
                                    value={newMovement.quantity || ''}
                                    onChange={(e) => setNewMovement({ ...newMovement, quantity: parseInt(e.target.value) })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="type">Type</Label>
                                <Select
                                    value={newMovement.type}
                                    onValueChange={(value: 'increase' | 'decrease') => setNewMovement({ ...newMovement, type: value })}
                                >
                                    <SelectTrigger id="type">
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="increase">Increase</SelectItem>
                                        <SelectItem value="decrease">Decrease</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="reason">Reason</Label>
                                <Input
                                    id="reason"
                                    value={newMovement.reason}
                                    onChange={(e) => setNewMovement({ ...newMovement, reason: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="location">Location</Label>
                                <Select
                                    value={newMovement.locationId}
                                    onValueChange={(value) => setNewMovement({ ...newMovement, locationId: value })}
                                >
                                    <SelectTrigger id="location">
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
                        <Button type="submit" className="w-full">
                            Add Stock Movement
                        </Button>
                    </form>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Stock Movement History</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="mb-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                            <Label htmlFor="search-movements">Search Movements</Label>
                            <Input
                                id="search-movements"
                                placeholder="Search by item name or reason..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div>
                            <Label htmlFor="type-filter">Filter by Type</Label>
                            <Select value={typeFilter} onValueChange={(value: 'all' | 'increase' | 'decrease') => setTypeFilter(value)}>
                                <SelectTrigger id="type-filter">
                                    <SelectValue placeholder="Select type" />
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
                                <SelectTrigger id="location-filter">
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
                    <ScrollArea className="h-[600px]">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Item</TableHead>
                                    <TableHead>Quantity</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Reason</TableHead>
                                    <TableHead>Location</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredMovements.map((movement) => (
                                    <TableRow key={movement.id}>
                                        <TableCell>{items?.find(item => item.id === movement.itemId)?.name}</TableCell>
                                        <TableCell>{movement.quantity}</TableCell>
                                        <TableCell>
                                            <Badge variant={movement.type === 'increase' ? 'default' : 'destructive'}>
                                                {movement.type}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{movement.reason}</TableCell>
                                        <TableCell>{shopSettings?.locations.find(l => l.id === movement.locationId)?.name || 'Unknown'}</TableCell>
                                        <TableCell>{new Date(movement.date).toLocaleString()}</TableCell>
                                        <TableCell>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => handleCancelMovement(movement.id)}
                                            >
                                                Cancel
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </ScrollArea>
                </CardContent>
            </Card>
        </>
    )
}

function ShippingMethodSettings() {
    const { currentTenant } = useGlobalStore()
    const tenantStore = useTenantStore(currentTenant?.id || 'default')
    const { shopSettings, updateShopSettings } = tenantStore?.getState() || {}
    const [newMethod, setNewMethod] = useState<Partial<ShippingMethod>>({
        name: '',
        description: '',
        price: 0,
        estimatedDeliveryDays: 0,
        enabled: true,
        availableLocations: []
    })

    const handleAddShippingMethod = (event: React.FormEvent) => {
        event.preventDefault()
        if (updateShopSettings && shopSettings) {
            const newShippingMethod: ShippingMethod = {
                id: Date.now().toString(),
                ...newMethod as ShippingMethod
            }
            updateShopSettings({
                shippingMethods: [...shopSettings.shippingMethods, newShippingMethod]
            })
            setNewMethod({
                name: '',
                description: '',
                price: 0,
                estimatedDeliveryDays: 0,
                enabled: true,
                availableLocations: []
            })
            toast.success('Shipping method added successfully')
        }
    }

    const handleUpdateShippingMethod = (id: string, updatedMethod: Partial<ShippingMethod>) => {
        if (updateShopSettings && shopSettings) {
            const updatedMethods = shopSettings.shippingMethods.map(method =>
                method.id === id ? { ...method, ...updatedMethod } : method
            )
            updateShopSettings({ shippingMethods: updatedMethods })
            toast.success('Shipping method updated successfully')
        }
    }

    const handleDeleteShippingMethod = (id: string) => {
        if (updateShopSettings && shopSettings) {
            const updatedMethods = shopSettings.shippingMethods.filter(method => method.id !== id)
            updateShopSettings({ shippingMethods: updatedMethods })
            toast.success('Shipping method deleted successfully')
        }
    }

    return (
        <>
            <h2 className="text-3xl font-bold text-gray-800 mb-8">Shipping Method Settings</h2>

            <Card className="mb-8">
                <CardHeader>
                    <CardTitle>Add New Shipping Method</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleAddShippingMethod} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    value={newMethod.name}
                                    onChange={(e) => setNewMethod({ ...newMethod, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Input
                                    id="description"
                                    value={newMethod.description}
                                    onChange={(e) => setNewMethod({ ...newMethod, description: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="price">Price</Label>
                                <Input
                                    id="price"
                                    type="number"
                                    step="0.01"
                                    value={newMethod.price}
                                    onChange={(e) => setNewMethod({ ...newMethod, price: parseFloat(e.target.value) })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="estimatedDeliveryDays">Estimated Delivery Days</Label>
                                <Input
                                    id="estimatedDeliveryDays"
                                    type="number"
                                    value={newMethod.estimatedDeliveryDays}
                                    onChange={(e) => setNewMethod({ ...newMethod, estimatedDeliveryDays: parseInt(e.target.value) })}
                                    required
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Available Locations</Label>
                            {shopSettings?.locations.map((location) => (
                                <div key={location.id} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={`location-${location.id}`}
                                        checked={newMethod.availableLocations?.includes(location.id)}
                                        onCheckedChange={(checked) => {
                                            if (checked) {
                                                setNewMethod({
                                                    ...newMethod,
                                                    availableLocations: [...(newMethod.availableLocations || []), location.id]
                                                })
                                            } else {
                                                setNewMethod({
                                                    ...newMethod,
                                                    availableLocations: newMethod.availableLocations?.filter(id => id !== location.id)
                                                })
                                            }
                                        }}
                                    />
                                    <Label htmlFor={`location-${location.id}`}>{location.name}</Label>
                                </div>
                            ))}
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="enabled"
                                checked={newMethod.enabled}
                                onCheckedChange={(checked) => setNewMethod({ ...newMethod, enabled: checked as boolean })}
                            />
                            <Label htmlFor="enabled">Enabled</Label>
                        </div>
                        <Button type="submit" className="w-full">
                            Add Shipping Method
                        </Button>
                    </form>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Existing Shipping Methods</CardTitle>
                </CardHeader>
                <CardContent>
                    <ScrollArea className="h-[400px]">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Description</TableHead>
                                    <TableHead>Price</TableHead>
                                    <TableHead>Estimated Delivery Days</TableHead>
                                    <TableHead>Enabled</TableHead>
                                    <TableHead>Available Locations</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {shopSettings?.shippingMethods.map((method) => (
                                    <TableRow key={method.id}>
                                        <TableCell>{method.name}</TableCell>
                                        <TableCell>{method.description}</TableCell>
                                        <TableCell>€{method.price.toFixed(2)}</TableCell>
                                        <TableCell>{method.estimatedDeliveryDays}</TableCell>
                                        <TableCell>
                                            <Switch
                                                checked={method.enabled}
                                                onCheckedChange={(checked) => handleUpdateShippingMethod(method.id, { enabled: checked })}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            {method.availableLocations.map(locationId =>
                                                shopSettings.locations.find(l => l.id === locationId)?.name
                                            ).join(', ')}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex space-x-2">
                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <Button variant="outline" size="sm">
                                                            <Edit className="w-4 h-4 mr-2" /> Edit
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent>
                                                        <DialogHeader>
                                                            <DialogTitle>Edit Shipping Method</DialogTitle>
                                                        </DialogHeader>
                                                        <EditShippingMethodForm
                                                            method={method}
                                                            onSave={(updatedMethod) => handleUpdateShippingMethod(method.id, updatedMethod)}
                                                        />
                                                    </DialogContent>
                                                </Dialog>
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() => handleDeleteShippingMethod(method.id)}
                                                >
                                                    <Trash2 className="w-4 h-4 mr-2" /> Delete
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </ScrollArea>
                </CardContent>
            </Card>
        </>
    )
}

function EditShippingMethodForm({ method, onSave }: { method: ShippingMethod, onSave: (updatedMethod: Partial<ShippingMethod>) => void }) {
    const { currentTenant } = useGlobalStore()
    const tenantStore = useTenantStore(currentTenant?.id || 'default')
    const { shopSettings } = tenantStore?.getState() || {}
    const [name, setName] = useState(method.name)
    const [description, setDescription] = useState(method.description)
    const [price, setPrice] = useState(method.price.toString())
    const [estimatedDeliveryDays, setEstimatedDeliveryDays] = useState(method.estimatedDeliveryDays.toString())
    const [enabled, setEnabled] = useState(method.enabled)
    const [availableLocations, setAvailableLocations] = useState(method.availableLocations)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSave({
            name,
            description,
            price: parseFloat(price),
            estimatedDeliveryDays: parseInt(estimatedDeliveryDays),
            enabled,
            availableLocations
        })
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="edit-name">Name</Label>
                <Input
                    id="edit-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Input
                    id="edit-description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="edit-price">Price</Label>
                <Input
                    id="edit-price"
                    type="number"
                    step="0.01"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="edit-estimatedDeliveryDays">Estimated Delivery Days</Label>
                <Input
                    id="edit-estimatedDeliveryDays"
                    type="number"
                    value={estimatedDeliveryDays}
                    onChange={(e) => setEstimatedDeliveryDays(e.target.value)}
                    required
                />
            </div>
            <div className="space-y-2">
                <Label>Available Locations</Label>
                {shopSettings?.locations.map((location) => (
                    <div key={location.id} className="flex items-center space-x-2">
                        <Checkbox
                            id={`edit-location-${location.id}`}
                            checked={availableLocations.includes(location.id)}
                            onCheckedChange={(checked) => {
                                if (checked) {
                                    setAvailableLocations([...availableLocations, location.id])
                                } else {
                                    setAvailableLocations(availableLocations.filter(id => id !== location.id))
                                }
                            }}
                        />
                        <Label htmlFor={`edit-location-${location.id}`}>{location.name}</Label>
                    </div>
                ))}
            </div>
            <div className="flex items-center space-x-2">
                <Checkbox
                    id="edit-enabled"
                    checked={enabled}
                    onCheckedChange={(checked) => setEnabled(checked as boolean)}
                />
                <Label htmlFor="edit-enabled">Enabled</Label>
            </div>
            <Button type="submit">Save Changes</Button>
        </form>
    )
}

function PaymentMethodSettings() {
    const { currentTenant } = useGlobalStore()
    const tenantStore = useTenantStore(currentTenant?.id || 'default')
    const { shopSettings, updateShopSettings } = tenantStore?.getState() || {}
    const [newMethod, setNewMethod] = useState<Partial<PaymentMethod>>({
        name: '',
        description: '',
        enabled: true,
        availableLocations: []
    })

    const handleAddPaymentMethod = (event: React.FormEvent) => {
        event.preventDefault()
        if (updateShopSettings && shopSettings) {
            const newPaymentMethod: PaymentMethod = {
                id: Date.now().toString(),
                ...newMethod as PaymentMethod
            }
            updateShopSettings({
                paymentMethods: [...shopSettings.paymentMethods, newPaymentMethod]
            })
            setNewMethod({
                name: '',
                description: '',
                enabled: true,
                availableLocations: []
            })
            toast.success('Payment method added successfully')
        }
    }

    const handleUpdatePaymentMethod = (id: string, updatedMethod: Partial<PaymentMethod>) => {
        if (updateShopSettings && shopSettings) {
            const updatedMethods = shopSettings.paymentMethods.map(method =>
                method.id === id ? { ...method, ...updatedMethod } : method
            )
            updateShopSettings({ paymentMethods: updatedMethods })
            toast.success('Payment method updated successfully')
        }
    }

    const handleDeletePaymentMethod = (id: string) => {
        if (updateShopSettings && shopSettings) {
            const updatedMethods = shopSettings.paymentMethods.filter(method => method.id !== id)
            updateShopSettings({ paymentMethods: updatedMethods })
            toast.success('Payment method deleted successfully')
        }
    }

    return (
        <>
            <h2 className="text-3xl font-bold text-gray-800 mb-8">Payment Method Settings</h2>

            <Card className="mb-8">
                <CardHeader>
                    <CardTitle>Add New Payment Method</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleAddPaymentMethod} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    value={newMethod.name}
                                    onChange={(e) => setNewMethod({ ...newMethod, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Input
                                    id="description"
                                    value={newMethod.description}
                                    onChange={(e) => setNewMethod({ ...newMethod, description: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Available Locations</Label>
                            {shopSettings?.locations.map((location) => (
                                <div key={location.id} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={`location-${location.id}`}
                                        checked={newMethod.availableLocations?.includes(location.id)}
                                        onCheckedChange={(checked) => {
                                            if (checked) {
                                                setNewMethod({
                                                    ...newMethod,
                                                    availableLocations: [...(newMethod.availableLocations || []), location.id]
                                                })
                                            } else {
                                                setNewMethod({
                                                    ...newMethod,
                                                    availableLocations: newMethod.availableLocations?.filter(id => id !== location.id)
                                                })
                                            }
                                        }}
                                    />
                                    <Label htmlFor={`location-${location.id}`}>{location.name}</Label>
                                </div>
                            ))}
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="enabled"
                                checked={newMethod.enabled}
                                onCheckedChange={(checked) => setNewMethod({ ...newMethod, enabled: checked as boolean })}
                            />
                            <Label htmlFor="enabled">Enabled</Label>
                        </div>
                        <Button type="submit" className="w-full">
                            Add Payment Method
                        </Button>
                    </form>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Existing Payment Methods</CardTitle>
                </CardHeader>
                <CardContent>
                    <ScrollArea className="h-[400px]">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Description</TableHead>
                                    <TableHead>Enabled</TableHead>
                                    <TableHead>Available Locations</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {shopSettings?.paymentMethods.map((method) => (
                                    <TableRow key={method.id}>
                                        <TableCell>{method.name}</TableCell>
                                        <TableCell>{method.description}</TableCell>
                                        <TableCell>
                                            <Switch
                                                checked={method.enabled}
                                                onCheckedChange={(checked) => handleUpdatePaymentMethod(method.id, { enabled: checked })}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            {method.availableLocations.map(locationId =>
                                                shopSettings.locations.find(l => l.id === locationId)?.name
                                            ).join(', ')}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex space-x-2">
                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <Button variant="outline" size="sm">
                                                            <Edit className="w-4 h-4 mr-2" /> Edit
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent>
                                                        <DialogHeader>
                                                            <DialogTitle>Edit Payment Method</DialogTitle>
                                                        </DialogHeader>
                                                        <EditPaymentMethodForm
                                                            method={method}
                                                            onSave={(updatedMethod) => handleUpdatePaymentMethod(method.id, updatedMethod)}
                                                        />
                                                    </DialogContent>
                                                </Dialog>
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() => handleDeletePaymentMethod(method.id)}
                                                >
                                                    <Trash2 className="w-4 h-4 mr-2" /> Delete
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </ScrollArea>
                </CardContent>
            </Card>
        </>
    )
}

function EditPaymentMethodForm({ method, onSave }: { method: PaymentMethod, onSave: (updatedMethod: Partial<PaymentMethod>) => void }) {
    const { currentTenant } = useGlobalStore()
    const tenantStore = useTenantStore(currentTenant?.id || 'default')
    const { shopSettings } = tenantStore?.getState() || {}
    const [name, setName] = useState(method.name)
    const [description, setDescription] = useState(method.description)
    const [enabled, setEnabled] = useState(method.enabled)
    const [availableLocations, setAvailableLocations] = useState(method.availableLocations)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSave({
            name,
            description,
            enabled,
            availableLocations
        })
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="edit-name">Name</Label>
                <Input
                    id="edit-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Input
                    id="edit-description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                />
            </div>
            <div className="space-y-2">
                <Label>Available Locations</Label>
                {shopSettings?.locations.map((location) => (
                    <div key={location.id} className="flex items-center space-x-2">
                        <Checkbox
                            id={`edit-location-${location.id}`}
                            checked={availableLocations.includes(location.id)}
                            onCheckedChange={(checked) => {
                                if (checked) {
                                    setAvailableLocations([...availableLocations, location.id])
                                } else {
                                    setAvailableLocations(availableLocations.filter(id => id !== location.id))
                                }
                            }}
                        />
                        <Label htmlFor={`edit-location-${location.id}`}>{location.name}</Label>
                    </div>
                ))}
            </div>
            <div className="flex items-center space-x-2">
                <Checkbox
                    id="edit-enabled"
                    checked={enabled}
                    onCheckedChange={(checked) => setEnabled(checked as boolean)}
                />
                <Label htmlFor="edit-enabled">Enabled</Label>
            </div>
            <Button type="submit">Save Changes</Button>
        </form>
    )
}

function ShopSettings() {
    const { currentTenant } = useGlobalStore()
    const tenantStore = useTenantStore(currentTenant?.id || 'default')
    const { shopSettings, updateShopSettings } = tenantStore?.getState() || {}
    const [activeTab, setActiveTab] = useState("general")

    const handleUpdateSettings = (updatedSettings: Partial<ShopSettings>) => {
        if (updateShopSettings) {
            updateShopSettings(updatedSettings)
            toast.success('Settings updated successfully')
        }
    }

    return (
        <>
            <h2 className="text-3xl font-bold text-gray-800 mb-8">Shop Settings</h2>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="general">General</TabsTrigger>
                    <TabsTrigger value="locations">Locations</TabsTrigger>
                    <TabsTrigger value="opening-hours">Opening Hours</TabsTrigger>
                    <TabsTrigger value="email-templates">Email Templates</TabsTrigger>
                </TabsList>
                <TabsContent value="general">
                    <Card>
                        <CardHeader>
                            <CardTitle>General Settings</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <GeneralSettingsForm settings={shopSettings} onSave={handleUpdateSettings} />
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="locations">
                    <Card>
                        <CardHeader>
                            <CardTitle>Locations</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <LocationsSettingsForm settings={shopSettings} onSave={handleUpdateSettings} />
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="opening-hours">
                    <Card>
                        <CardHeader>
                            <CardTitle>Opening Hours</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <OpeningHoursSettingsForm settings={shopSettings} onSave={handleUpdateSettings} />
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="email-templates">
                    <Card>
                        <CardHeader>
                            <CardTitle>Email Templates</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <EmailTemplatesSettingsForm settings={shopSettings} onSave={handleUpdateSettings} />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </>
    )
}

function GeneralSettingsForm({ settings, onSave }: { settings?: ShopSettings, onSave: (updatedSettings: Partial<ShopSettings>) => void }) {
    const [shopName, setShopName] = useState(settings?.shopName || '')
    const [shopDescription, setShopDescription] = useState(settings?.shopDescription || '')
    const [currency, setCurrency] = useState(settings?.currency || 'EUR')
    const [taxRate, setTaxRate] = useState(settings?.taxRate.toString() || '0')
    const [shippingFee, setShippingFee] = useState(settings?.shippingFee.toString() || '0')
    const [emailAddress, setEmailAddress] = useState(settings?.emailAddress || '')
    const [phoneNumber, setPhoneNumber] = useState(settings?.phoneNumber || '')
    const [address, setAddress] = useState(settings?.address || '')

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSave({
            shopName,
            shopDescription,
            currency,
            taxRate: parseFloat(taxRate),
            shippingFee: parseFloat(shippingFee),
            emailAddress,
            phoneNumber,
            address
        })
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="shopName">Shop Name</Label>
                <Input
                    id="shopName"
                    value={shopName}
                    onChange={(e) => setShopName(e.target.value)}
                    required
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="shopDescription">Shop Description</Label>
                <Textarea
                    id="shopDescription"
                    value={shopDescription}
                    onChange={(e) => setShopDescription(e.target.value)}
                    required
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Select value={currency} onValueChange={setCurrency}>
                    <SelectTrigger id="currency">
                        <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="EUR">Euro (EUR)</SelectItem>
                        <SelectItem value="USD">US Dollar (USD)</SelectItem>
                        <SelectItem value="GBP">British Pound (GBP)</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="space-y-2">
                <Label htmlFor="taxRate">Tax Rate (%)</Label>
                <Input
                    id="taxRate"
                    type="number"
                    step="0.01"
                    value={taxRate}
                    onChange={(e) => setTaxRate(e.target.value)}
                    required
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="shippingFee">Default Shipping Fee</Label>
                <Input
                    id="shippingFee"
                    type="number"
                    step="0.01"
                    value={shippingFee}
                    onChange={(e) => setShippingFee(e.target.value)}
                    required
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="emailAddress">Email Address</Label>
                <Input
                    id="emailAddress"
                    type="email"
                    value={emailAddress}
                    onChange={(e) => setEmailAddress(e.target.value)}
                    required
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                    id="phoneNumber"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                />
            </div>
            <Button type="submit">Save Changes</Button>
        </form>
    )
}

function LocationsSettingsForm({ settings, onSave }: { settings?: ShopSettings, onSave: (updatedSettings: Partial<ShopSettings>) => void }) {
    const [locations, setLocations] = useState<Location[]>(settings?.locations || [])
    const [primaryLocationId, setPrimaryLocationId] = useState(settings?.primaryLocationId || '')
    const [newLocation, setNewLocation] = useState<Partial<Location>>({
        name: '',
        address: '',
        openingHours: {
            monday: { periods: [] },
            tuesday: { periods: [] },
            wednesday: { periods: [] },
            thursday: { periods: [] },
            friday: { periods: [] },
            saturday: { periods: [] },
            sunday: { periods: [] }
        }
    })

    const handleAddLocation = (e: React.FormEvent) => {
        e.preventDefault()
        if (newLocation.name && newLocation.address) {
            const location: Location = {
                id: Date.now().toString(),
                ...newLocation as Location
            }
            setLocations([...locations, location])
            setNewLocation({
                name: '',
                address: '',
                openingHours: {
                    monday: { periods: [] },
                    tuesday: { periods: [] },
                    wednesday: { periods: [] },
                    thursday: { periods: [] },
                    friday: { periods: [] },
                    saturday: { periods: [] },
                    sunday: { periods: [] }
                }
            })
            if (locations.length === 0) {
                setPrimaryLocationId(location.id)
            }
        }
    }

    const handleUpdateLocation = (id: string, updatedLocation: Partial<Location>) => {
        setLocations(locations.map(location =>
            location.id === id ? { ...location, ...updatedLocation } : location
        ))
    }

    const handleDeleteLocation = (id: string) => {
        setLocations(locations.filter(location => location.id !== id))
        if (primaryLocationId === id) {
            setPrimaryLocationId(locations[0]?.id || '')
        }
    }

    const handleSave = () => {
        onSave({
            locations,
            primaryLocationId
        })
    }

    return (
        <div className="space-y-8">
            <div>
                <h3 className="text-lg font-semibold mb-4">Add New Location</h3>
                <form onSubmit={handleAddLocation} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="locationName">Location Name</Label>
                        <Input
                            id="locationName"
                            value={newLocation.name}
                            onChange={(e) => setNewLocation({ ...newLocation, name: e.target.value })}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="locationAddress">Address</Label>
                        <Textarea
                            id="locationAddress"
                            value={newLocation.address}
                            onChange={(e) => setNewLocation({ ...newLocation, address: e.target.value })}
                            required
                        />
                    </div>
                    <Button type="submit">Add Location</Button>
                </form>
            </div>

            <div>
                <h3 className="text-lg font-semibold mb-4">Existing Locations</h3>
                {locations.map((location) => (
                    <Card key={location.id} className="mb-4">
                        <CardHeader>
                            <CardTitle>{location.name}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <div>
                                    <Label>Address</Label>
                                    <p>{location.address}</p>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id={`primary-${location.id}`}
                                        checked={primaryLocationId === location.id}
                                        onCheckedChange={() => setPrimaryLocationId(location.id)}
                                    />
                                    <Label htmlFor={`primary-${location.id}`}>Primary Location</Label>
                                </div>
                                <div className="flex space-x-2">
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button variant="outline">
                                                <Edit className="w-4 h-4 mr-2" /> Edit
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>Edit Location</DialogTitle>
                                            </DialogHeader>
                                            <EditLocationForm
                                                location={location}
                                                onSave={(updatedLocation) => handleUpdateLocation(location.id, updatedLocation)}
                                            />
                                        </DialogContent>
                                    </Dialog>
                                    <Button variant="destructive" onClick={() => handleDeleteLocation(location.id)}>
                                        <Trash2 className="w-4 h-4 mr-2" /> Delete
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Button onClick={handleSave}>Save All Changes</Button>
        </div>
    )
}

function EditLocationForm({ location, onSave }: { location: Location, onSave: (updatedLocation: Partial<Location>) => void }) {
    const [name, setName] = useState(location.name)
    const [address, setAddress] = useState(location.address)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSave({ name, address })
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="edit-location-name">Location Name</Label>
                <Input
                    id="edit-location-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="edit-location-address">Address</Label>
                <Textarea
                    id="edit-location-address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                />
            </div>
            <Button type="submit">Save Changes</Button>
        </form>
    )
}

function OpeningHoursSettingsForm({ settings, onSave }: { settings?: ShopSettings, onSave: (updatedSettings: Partial<ShopSettings>) => void }) {
    const [locations, setLocations] = useState<Location[]>(settings?.locations || [])
    const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null)

    const handleUpdateOpeningHours = (locationId: string, day: keyof OpeningHours, periods: { open: string; close: string }[]) => {
        setLocations(locations.map(location => {
            if (location.id === locationId) {
                return {
                    ...location,
                    openingHours: {
                        ...location.openingHours,
                        [day]: { periods }
                    }
                }
            }
            return location
        }))
    }

    const handleSave = () => {
        onSave({ locations })
    }

    const selectedLocation = locations.find(location => location.id === selectedLocationId)

    return (
        <div className="space-y-8">
            <div className="space-y-2">
                <Label htmlFor="location-select">Select Location</Label>
                <Select value={selectedLocationId || ''} onValueChange={setSelectedLocationId}>
                    <SelectTrigger id="location-select">
                        <SelectValue placeholder="Select a location" />
                    </SelectTrigger>
                    <SelectContent>
                        {locations.map((location) => (
                            <SelectItem key={location.id} value={location.id}>{location.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {selectedLocation && (
                <div>
                    <h3 className="text-lg font-semibold mb-4">Opening Hours for {selectedLocation.name}</h3>
                    {Object.entries(selectedLocation.openingHours).map(([day, { periods }]) => (
                        <div key={day} className="mb-4">
                            <h4 className="font-medium mb-2 capitalize">{day}</h4>
                            {periods.map((period, index) => (
                                <div key={index} className="flex items-center space-x-2 mb-2">
                                    <Input
                                        type="time"
                                        value={period.open}
                                        onChange={(e) => {
                                            const newPeriods = [...periods]
                                            newPeriods[index].open = e.target.value
                                            handleUpdateOpeningHours(selectedLocation.id, day as keyof OpeningHours, newPeriods)
                                        }}
                                    />
                                    <span>to</span>
                                    <Input
                                        type="time"
                                        value={period.close}
                                        onChange={(e) => {
                                            const newPeriods = [...periods]
                                            newPeriods[index].close = e.target.value
                                            handleUpdateOpeningHours(selectedLocation.id, day as keyof OpeningHours, newPeriods)
                                        }}
                                    />
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => {
                                            const newPeriods = periods.filter((_, i) => i !== index)
                                            handleUpdateOpeningHours(selectedLocation.id, day as keyof OpeningHours, newPeriods)
                                        }}
                                    >
                                        Remove
                                    </Button>
                                </div>
                            ))}
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    const newPeriods = [...periods, { open: '09:00', close: '17:00' }]
                                    handleUpdateOpeningHours(selectedLocation.id, day as keyof OpeningHours, newPeriods)
                                }}
                            >
                                Add Period
                            </Button>
                        </div>
                    ))}
                </div>
            )}

            <Button onClick={handleSave}>Save All Changes</Button>
        </div>
    )
}

function EmailTemplatesSettingsForm({ settings, onSave }: { settings?: ShopSettings, onSave: (updatedSettings: Partial<ShopSettings>) => void }) {
    // This is a placeholder for email templates. In a real application, you would have a more complex
    // structure for managing email templates, possibly with a rich text editor for content creation.
    const [orderConfirmationTemplate, setOrderConfirmationTemplate] = useState('')
    const [shippingConfirmationTemplate, setShippingConfirmationTemplate] = useState('')

    const handleSave = () => {
        // In a real application, you would save these templates to your backend or state management system
        onSave({
            // emailTemplates: {
            //   orderConfirmation: orderConfirmationTemplate,
            //   shippingConfirmation: shippingConfirmationTemplate
            // }
        })
    }

    return (
        <div className="space-y-8">
            <div className="space-y-4">
                <h3 className="text-lg font-semibold">Order Confirmation Email</h3>
                <Textarea
                    value={orderConfirmationTemplate}
                    onChange={(e) => setOrderConfirmationTemplate(e.target.value)}
                    rows={10}
                    placeholder="Enter your order confirmation email template here..."
                />
            </div>

            <div className="space-y-4">
                <h3 className="text-lg font-semibold">Shipping Confirmation Email</h3>
                <Textarea
                    value={shippingConfirmationTemplate}
                    onChange={(e) => setShippingConfirmationTemplate(e.target.value)}
                    rows={10}
                    placeholder="Enter your shipping confirmation email template here..."
                />
            </div>

            <Button onClick={handleSave}>Save Templates</Button>
        </div>
    )
}

function TenantRegistrations() {
    const { currentTenant } = useGlobalStore()
    const tenantStore = useTenantStore(currentTenant?.id || 'default')
    const { tenantRegistrations, updateTenantRegistration, deleteTenantRegistration } = tenantStore?.getState() || {}
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState<TenantRegistration['status'] | 'all'>('all')

    const handleUpdateStatus = (id: string, newStatus: TenantRegistration['status']) => {
        if (updateTenantRegistration) {
            updateTenantRegistration(id, { status: newStatus })
            toast.success(`Registration status updated to ${newStatus}`)
        }
    }

    const handleDeleteRegistration = (id: string) => {
        if (deleteTenantRegistration) {
            deleteTenantRegistration(id)
            toast.success('Registration deleted successfully')
        }
    }

    const filteredRegistrations = tenantRegistrations?.filter(registration =>
        (registration.tenantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            registration.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            registration.email.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (statusFilter === 'all' || registration.status === statusFilter)
    ) || []

    return (
        <>
            <h2 className="text-3xl font-bold text-gray-800 mb-8">Tenant Registrations</h2>

            <Card>
                <CardHeader>
                    <CardTitle>Registration List</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="mb-4 flex space-x-4">
                        <div className="flex-1">
                            <Label htmlFor="search-registrations">Search Registrations</Label>
                            <Input
                                id="search-registrations"
                                placeholder="Search by tenant name, owner name, or email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex-1">
                            <Label htmlFor="status-filter">Filter by Status</Label>
                            <Select value={statusFilter} onValueChange={(value: TenantRegistration['status'] | 'all') => setStatusFilter(value)}>
                                <SelectTrigger id="status-filter">
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Statuses</SelectItem>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="approved">Approved</SelectItem>
                                    <SelectItem value="rejected">Rejected</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <ScrollArea className="h-[600px]">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Tenant Name</TableHead>
                                    <TableHead>Owner Name</TableHead>
                                    <TableHead>Email</TableHead>
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
                                        <TableCell>{registration.businessType}</TableCell>
                                        <TableCell>
                                            <Badge variant={
                                                registration.status === 'approved' ? 'default' :
                                                    registration.status === 'rejected' ? 'destructive' : 'secondary'
                                            }>
                                                {registration.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{new Date(registration.submittedAt).toLocaleString()}</TableCell>
                                        <TableCell>
                                            <div className="flex space-x-2">
                                                <Select
                                                    onValueChange={(value: TenantRegistration['status']) => handleUpdateStatus(registration.id, value)}
                                                    defaultValue={registration.status}
                                                >
                                                    <SelectTrigger className="w-[120px]">
                                                        <SelectValue placeholder="Update status" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="pending">Pending</SelectItem>
                                                        <SelectItem value="approved">Approve</SelectItem>
                                                        <SelectItem value="rejected">Reject</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <Button variant="outline" size="sm">
                                                            <Eye className="w-4 h-4 mr-2" /> View
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent>
                                                        <DialogHeader>
                                                            <DialogTitle>Registration Details</DialogTitle>
                                                        </DialogHeader>
                                                        <RegistrationDetailsView registration={registration} />
                                                    </DialogContent>
                                                </Dialog>
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() => handleDeleteRegistration(registration.id)}
                                                >
                                                    <Trash2 className="w-4 h-4 mr-2" /> Delete
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </ScrollArea>
                </CardContent>
            </Card>
        </>
    )
}

function RegistrationDetailsView({ registration }: { registration: TenantRegistration }) {
    return (
        <div className="space-y-4">
            <div>
                <h3 className="font-semibold">Tenant Information</h3>
                <p>Tenant Name: {registration.tenantName}</p>
                <p>Owner Name: {registration.ownerName}</p>
                <p>Email: {registration.email}</p>
                <p>Phone Number: {registration.phoneNumber}</p>
                <p>Business Type: {registration.businessType}</p>
                <p>Status: {registration.status}</p>
                <p>Submitted At: {new Date(registration.submittedAt).toLocaleString()}</p>
            </div>
            <div>
                <h3 className="font-semibold">Shop Configuration</h3>
                <p>Shop Name: {registration.shopConfig.shopName}</p>
                <p>Shop Description: {registration.shopConfig.shopDescription}</p>
                <p>Currency: {registration.shopConfig.currency}</p>
                <p>Tax Rate: {registration.shopConfig.taxRate}%</p>
                <p>Shipping Fee: {registration.shopConfig.shipping}</p>
            </div>
        </div>
    )
}

function TenantsAdministration() {
    const { tenants, addTenant, updateTenant, deleteTenant } = useGlobalStore()
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState<Tenant['status'] | 'all'>('all')
    const [newTenant, setNewTenant] = useState<Partial<Tenant>>({
        name: '',
        domain: '',
        status: 'pending'
    })

    const handleAddTenant = (event: React.FormEvent) => {
        event.preventDefault()
        if (newTenant.name && newTenant.domain) {
            addTenant({
                id: Date.now().toString(),
                ...newTenant as Tenant
            })
            setNewTenant({
                name: '',
                domain: '',
                status: 'pending'
            })
            toast.success('New tenant added successfully')
        }
    }

    const handleUpdateTenantStatus = (id: string, newStatus: Tenant['status']) => {
        updateTenant(id, { status: newStatus })
        toast.success(`Tenant status updated to ${newStatus}`)
    }

    const handleDeleteTenant = (id: string) => {
        deleteTenant(id)
        toast.success('Tenant deleted successfully')
    }

    const filteredTenants = tenants.filter(tenant =>
        (tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            tenant.domain.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (statusFilter === 'all' || tenant.status === statusFilter)
    )

    return (
        <>
            <h2 className="text-3xl font-bold text-gray-800 mb-8">Tenants Administration</h2>

            <Card className="mb-8">
                <CardHeader>
                    <CardTitle>Add New Tenant</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleAddTenant} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="tenant-name">Tenant Name</Label>
                                <Input
                                    id="tenant-name"
                                    value={newTenant.name}
                                    onChange={(e) => setNewTenant({ ...newTenant, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="tenant-domain">Domain</Label>
                                <Input
                                    id="tenant-domain"
                                    value={newTenant.domain}
                                    onChange={(e) => setNewTenant({ ...newTenant, domain: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="tenant-status">Status</Label>
                            <Select
                                value={newTenant.status}
                                onValueChange={(value: Tenant['status']) => setNewTenant({ ...newTenant, status: value })}
                            >
                                <SelectTrigger id="tenant-status">
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="suspended">Suspended</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <Button type="submit" className="w-full">
                            Add Tenant
                        </Button>
                    </form>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Tenant List</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="mb-4 flex space-x-4">
                        <div className="flex-1">
                            <Label htmlFor="search-tenants">Search Tenants</Label>
                            <Input
                                id="search-tenants"
                                placeholder="Search by name or domain..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex-1">
                            <Label htmlFor="status-filter">Filter by Status</Label>
                            <Select value={statusFilter} onValueChange={(value: Tenant['status'] | 'all') => setStatusFilter(value)}>
                                <SelectTrigger id="status-filter">
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Statuses</SelectItem>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="suspended">Suspended</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <ScrollArea className="h-[400px]">
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
                                                    tenant.status === 'suspended' ? 'destructive' : 'secondary'
                                            }>
                                                {tenant.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex space-x-2">
                                                <Select
                                                    onValueChange={(value: Tenant['status']) => handleUpdateTenantStatus(tenant.id, value)}
                                                    defaultValue={tenant.status}
                                                >
                                                    <SelectTrigger className="w-[120px]">
                                                        <SelectValue placeholder="Update status" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="pending">Pending</SelectItem>
                                                        <SelectItem value="active">Active</SelectItem>
                                                        <SelectItem value="suspended">Suspended</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <Button variant="outline" size="sm">
                                                            <Edit className="w-4 h-4 mr-2" /> Edit
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent>
                                                        <DialogHeader>
                                                            <DialogTitle>Edit Tenant</DialogTitle>
                                                        </DialogHeader>
                                                        <EditTenantForm
                                                            tenant={tenant}
                                                            onSave={(updatedTenant) => {
                                                                updateTenant(tenant.id, updatedTenant)
                                                                toast.success('Tenant updated successfully')
                                                            }}
                                                        />
                                                    </DialogContent>
                                                </Dialog>
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() => handleDeleteTenant(tenant.id)}
                                                >
                                                    <Trash2 className="w-4 h-4 mr-2" /> Delete
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </ScrollArea>
                </CardContent>
            </Card>
        </>
    )
}

function EditTenantForm({ tenant, onSave }: { tenant: Tenant, onSave: (updatedTenant: Partial<Tenant>) => void }) {
    const [name, setName] = useState(tenant.name)
    const [domain, setDomain] = useState(tenant.domain)
    const [status, setStatus] = useState(tenant.status)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSave({ name, domain, status })
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="edit-tenant-name">Tenant Name</Label>
                <Input
                    id="edit-tenant-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="edit-tenant-domain">Domain</Label>
                <Input
                    id="edit-tenant-domain"
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    required
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="edit-tenant-status">Status</Label>
                <Select value={status} onValueChange={(value: Tenant['status']) => setStatus(value)}>
                    <SelectTrigger id="edit-tenant-status">
                        <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="suspended">Suspended</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <Button type="submit">Save Changes</Button>
        </form>
    )
}

function TenantSignup() {
    const { currentTenant } = useGlobalStore()
    const tenantStore = useTenantStore(currentTenant?.id || 'default')
    const { addTenantRegistration } = tenantStore?.getState() || {}
    const [formData, setFormData] = useState<Partial<TenantRegistration>>({
        tenantName: '',
        ownerName: '',
        email: '',
        phoneNumber: '',
        businessType: '',
        shopConfig: {
            shopName: '',
            shopDescription: '',
            currency: 'EUR',
            taxRate: 20,
            shippingFee: 5
        }
    })

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleShopConfigChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            shopConfig: {
                ...prev.shopConfig,
                [name]: name === 'taxRate' || name === 'shippingFee' ? parseFloat(value) : value
            }
        }))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (addTenantRegistration) {
            const newRegistration: TenantRegistration = {
                id: Date.now().toString(),
                ...formData as TenantRegistration,
                status: 'pending',
                submittedAt: new Date()
            }
            addTenantRegistration(newRegistration)
            toast.success('Tenant registration submitted successfully')
            // Reset form
            setFormData({
                tenantName: '',
                ownerName: '',
                email: '',
                phoneNumber: '',
                businessType: '',
                shopConfig: {
                    shopName: '',
                    shopDescription: '',
                    currency: 'EUR',
                    taxRate: 20,
                    shippingFee: 5
                }
            })
        }
    }

    return (
        <>
            <h2 className="text-3xl font-bold text-gray-800 mb-8">Tenant Signup</h2>

            <Card>
                <CardHeader>
                    <CardTitle>Register Your Tenant</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="tenantName">Tenant Name</Label>
                                    <Input
                                        id="tenantName"
                                        name="tenantName"
                                        value={formData.tenantName}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="ownerName">Owner Name</Label>
                                    <Input
                                        id="ownerName"
                                        name="ownerName"
                                        value={formData.ownerName}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phoneNumber">Phone Number</Label>
                                    <Input
                                        id="phoneNumber"
                                        name="phoneNumber"
                                        value={formData.phoneNumber}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="businessType">Business Type</Label>
                                <Input
                                    id="businessType"
                                    name="businessType"
                                    value={formData.businessType}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold">Shop Configuration</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="shopName">Shop Name</Label>
                                    <Input
                                        id="shopName"
                                        name="shopName"
                                        value={formData.shopConfig?.shopName}
                                        onChange={handleShopConfigChange}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="shopDescription">Shop Description</Label>
                                    <Input
                                        id="shopDescription"
                                        name="shopDescription"
                                        value={formData.shopConfig?.shopDescription}
                                        onChange={handleShopConfigChange}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="currency">Currency</Label>
                                    <Select
                                        name="currency"
                                        value={formData.shopConfig?.currency}
                                        onValueChange={(value) => handleShopConfigChange({ target: { name: 'currency', value } } as React.ChangeEvent<HTMLSelectElement>)}
                                    >
                                        <SelectTrigger id="currency">
                                            <SelectValue placeholder="Select currency" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="EUR">Euro (EUR)</SelectItem>
                                            <SelectItem value="USD">US Dollar (USD)</SelectItem>
                                            <SelectItem value="GBP">British Pound (GBP)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="taxRate">Tax Rate (%)</Label>
                                    <Input
                                        id="taxRate"
                                        name="taxRate"
                                        type="number"
                                        step="0.01"
                                        value={formData.shopConfig?.taxRate}
                                        onChange={handleShopConfigChange}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="shippingFee">Shipping Fee</Label>
                                    <Input
                                        id="shippingFee"
                                        name="shippingFee"
                                        type="number"
                                        step="0.01"
                                        value={formData.shopConfig?.shippingFee}
                                        onChange={handleShopConfigChange}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <Button type="submit" className="w-full">
                            Submit Registration
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </>
    )
}

function MyClients() {
    const { currentTenant, currentUser } = useGlobalStore()
    const tenantStore = useTenantStore(currentTenant?.id || 'default')
    const { orders } = tenantStore?.getState() || {}
    const [searchTerm, setSearchTerm] = useState("")
    const [sortColumn, setSortColumn] = useState<keyof Client>("name")
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

    // Derive clients from orders
    const clients = useMemo(() => {
        const clientMap = new Map<string, Client>()
        orders?.forEach(order => {
            if (!clientMap.has(order.customerEmail)) {
                clientMap.set(order.customerEmail, {
                    name: order.customerName,
                    email: order.customerEmail,
                    phone: order.customerPhone,
                    totalOrders: 1,
                    totalSpent: order.totalAmount,
                    lastOrderDate: order.createdAt
                })
            } else {
                const client = clientMap.get(order.customerEmail)!
                client.totalOrders += 1
                client.totalSpent += order.totalAmount
                if (new Date(order.createdAt) > new Date(client.lastOrderDate)) {
                    client.lastOrderDate = order.createdAt
                }
            }
        })
        return Array.from(clientMap.values())
    }, [orders])

    const sortedClients = useMemo(() => {
        return [...clients].sort((a, b) => {
            if (a[sortColumn] < b[sortColumn]) return sortDirection === "asc" ? -1 : 1
            if (a[sortColumn] > b[sortColumn]) return sortDirection === "asc" ? 1 : -1
            return 0
        })
    }, [clients, sortColumn, sortDirection])

    const filteredClients = sortedClients.filter(client =>
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.phone.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const handleSort = (column: keyof Client) => {
        if (column === sortColumn) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc")
        } else {
            setSortColumn(column)
            setSortDirection("asc")
        }
    }

    return (
        <>
            <h2 className="text-3xl font-bold text-gray-800 mb-8">My Clients</h2>

            <Card>
                <CardHeader>
                    <CardTitle>Client List</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="mb-4">
                        <Label htmlFor="search-clients">Search Clients</Label>
                        <Input
                            id="search-clients"
                            placeholder="Search by name, email, or phone..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <ScrollArea className="h-[600px]">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead onClick={() => handleSort("name")} className="cursor-pointer">
                                        Name {sortColumn === "name" && (sortDirection === "asc" ? "↑" : "↓")}
                                    </TableHead>
                                    <TableHead onClick={() => handleSort("email")} className="cursor-pointer">
                                        Email {sortColumn === "email" && (sortDirection === "asc" ? "↑" : "↓")}
                                    </TableHead>
                                    <TableHead onClick={() => handleSort("phone")} className="cursor-pointer">
                                        Phone {sortColumn === "phone" && (sortDirection === "asc" ? "↑" : "↓")}
                                    </TableHead>
                                    <TableHead onClick={() => handleSort("totalOrders")} className="cursor-pointer">
                                        Total Orders {sortColumn === "totalOrders" && (sortDirection === "asc" ? "↑" : "↓")}
                                    </TableHead>
                                    <TableHead onClick={() => handleSort("totalSpent")} className="cursor-pointer">
                                        Total Spent {sortColumn === "totalSpent" && (sortDirection === "asc" ? "↑" : "↓")}
                                    </TableHead>
                                    <TableHead onClick={() => handleSort("lastOrderDate")} className="cursor-pointer">
                                        Last Order Date {sortColumn === "lastOrderDate" && (sortDirection === "asc" ? "↑" : "↓")}
                                    </TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredClients.map((client) => (
                                    <TableRow key={client.email}>
                                        <TableCell>{client.name}</TableCell>
                                        <TableCell>{client.email}</TableCell>
                                        <TableCell>{client.phone}</TableCell>
                                        <TableCell>{client.totalOrders}</TableCell>
                                        <TableCell>€{client.totalSpent.toFixed(2)}</TableCell>
                                        <TableCell>{new Date(client.lastOrderDate).toLocaleDateString()}</TableCell>
                                        <TableCell>
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button variant="outline" size="sm">
                                                        <Eye className="w-4 h-4 mr-2" /> View Details
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent>
                                                    <DialogHeader>
                                                        <DialogTitle>Client Details</DialogTitle>
                                                    </DialogHeader>
                                                    <ClientDetailsView client={client} orders={orders?.filter(order => order.customerEmail === client.email) || []} />
                                                </DialogContent>
                                            </Dialog>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </ScrollArea>
                </CardContent>
            </Card>
        </>
    )
}

function ClientDetailsView({ client, orders }: { client: Client, orders: Order[] }) {
    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold mb-2">Client Information</h3>
                <p><strong>Name:</strong> {client.name}</p>
                <p><strong>Email:</strong> {client.email}</p>
                <p><strong>Phone:</strong> {client.phone}</p>
                <p><strong>Total Orders:</strong> {client.totalOrders}</p>
                <p><strong>Total Spent:</strong> €{client.totalSpent.toFixed(2)}</p>
                <p><strong>Last Order Date:</strong> {new Date(client.lastOrderDate).toLocaleDateString()}</p>
            </div>
            <div>
                <h3 className="text-lg font-semibold mb-2">Order History</h3>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Order ID</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Total Amount</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {orders.map((order) => (
                            <TableRow key={order.id}>
                                <TableCell>{order.id}</TableCell>
                                <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
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
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}