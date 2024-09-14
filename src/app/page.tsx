"use client"
import { useState, useEffect, useRef } from "react"
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarIcon, List, Settings, Plus, X, Trash2, Edit, ChevronDown, ChevronUp, Eye, EyeOff, ArrowUp, ArrowDown, Image as ImageIcon, Search, Copy, ShoppingCart, FileText, Printer, Clock, Grid, Truck, CreditCard, User, Building, Users, Globe, Mail } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Calendar } from "@/components/ui/calendar"
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
import { cn } from "@/lib/utils"

// Translations
const translations = {
  en: {
    adminDashboard: "Admin Dashboard",
    mealPlanner: "Meal Planner",
    items: "Items",
    mediaGallery: "Media Gallery",
    mealOrdering: "Meal Ordering",
    orders: "Orders",
    myOrders: "My Orders",
    stockMovements: "Stock Movements",
    shippingMethods: "Shipping Methods",
    paymentMethods: "Payment Methods",
    settings: "Settings",
    clients: "Clients",
    tenantRegistrations: "Tenant Registrations",
    usersAdministration: "Users Administration",
    tenantSignup: "Tenant Signup",
    signIn: "Sign In",
    signOut: "Sign Out",
    register: "Register",
    language: "Language",
    selectRole: "Select role",
    selectUser: "Select user",
    selectTenant: "Select tenant",
    superAdminMode: "Super Admin Mode",
    itemNotAvailableAtLocation: "This item is not available at the selected location",
    itemOutOfStock: "This item is out of stock at the selected location",
    cannotAddMoreOfThisItem: "Cannot add more of this item",
    tenantRegistrationSubmitted: "Tenant registration submitted successfully",
    signUpAsNewTenant: "Sign Up as a New Tenant",
    tenantName: "Tenant Name",
    ownerName: "Owner Name",
    email: "Email",
    phoneNumber: "Phone Number",
    businessType: "Business Type",
    next: "Next",
    back: "Back",
    submit: "Submit",
    shopName: "Shop Name",
    shopDescription: "Shop Description",
    currency: "Currency",
    selectCurrency: "Select currency",
    taxRate: "Tax Rate (%)",
    defaultShippingFee: "Default Shipping Fee",
    selectLanguage: "Select language",
    tenantsAdministration: "Tenants Administration",
    searchByTenantName: "Search by tenant name...",
    filterByStatus: "Filter by status",
    all: "All",
    active: "Active",
    pending: "Pending",
    suspended: "Suspended",
    domain: "Domain",
    status: "Status",
    actions: "Actions",
    changeStatus: "Change status",
    changeLanguage: "Change language",
    tenantStatusUpdated: "Tenant status updated to {{status}}",
    tenantLanguageUpdated: "Tenant language updated to {{language}}",
    tenantDeleted: "Tenant deleted successfully",
    admin: "Admin",
    shopManager: "Shop manager",
    client: "Client",
    superAdmin: "Super Admin",
    invalidCredentials: "Invalid credentials",
    signedInSuccessfully: "Signed in successfully",
    registeredSuccessfully: "Registered successfully",
    name: "Name",
    password: "Password",
    selectMenuItem: "Select menu item",
    createMealOffering: "Create Meal Offering",
    mealName: "Meal Name",
    startDateAndTime: "Start Date and Time",
    endDateAndTime: "End Date and Time",
    location: "Location",
    addMealOffering: "Add Meal Offering",
    scheduledMealOfferings: "Scheduled Meal Offerings",
    searchMeals: "Search Meals",
    filterByDate: "Filter by Date",
    filterByLocation: "Filter by Location",
    allLocations: "All Locations",
    unpublish: "Unpublish",
    publish: "Publish",
    edit: "Edit",
    duplicate: "Duplicate",
    delete: "Delete",
    editMealOffering: "Edit Meal Offering",
    saveChanges: "Save Changes",
    cancel: "Cancel",
    addItem: "Add Item",
    itemManagement: "Item Management",
    editItem: "Edit Item",
    addNewItem: "Add New Item",
    itemName: "Item Name",
    category: "Category",
    selectCategory: "Select a category",
    price: "Price",
    selectTaxRate: "Select tax rate",
    stockByLocation: "Stock by Location",
    availableLocations: "Available Locations",
    description: "Description (Optional)",
    attributes: "Attributes",
    key: "Key",
    value: "Value",
    addAttribute: "Add Attribute",
    updateItem: "Update Item",
    itemList: "Item List",
    uploadNewFile: "Upload New File",
    searchMedia: "Search media...",
    selectImage: "Select Image",
    searchImages: "Search images...",
    selectLocation: "Select Location",
    selectMealOffering: "Select Meal Offering",
    cardView: "Card View",
    listView: "List View",
    searchItems: "Search items...",
    addToCart: "Add to Cart",
    notAvailable: "Not Available",
    outOfStock: "Out of Stock",
    yourCart: "Your Cart",
    proceedToCheckout: "Proceed to Checkout",
    checkout: "Checkout",
    customerName: "Name",
    customerEmail: "Email",
    customerPhone: "Phone",
    deliveryAddress: "Delivery Address",
    shippingMethod: "Shipping Method",
    selectShippingMethod: "Select shipping method",
    paymentMethod: "Payment Method",
    selectPaymentMethod: "Select payment method",
    orderSummary: "Order Summary",
    shipping: "Shipping",
    total: "Total",
    placeOrder: "Place Order",
    orderConfirmation: "Order Confirmation",
    thankYouForYourOrder: "Thank you for your order, {{name}}!",
    orderId: "Order ID",
    totalAmount: "Total Amount",
    orderDetails: "Order Details",
    close: "Close",
    searchByCustomerNameOrEmail: "Search by customer name or email...",
    date: "Date",
    updateStatus: "Update status",
    viewDetails: "View Details",
    editOrder: "Edit Order",
    printReceipt: "Print Receipt",
    searchByOrderIdOrName: "Search by order ID or name...",
    searchByItemName: "Search by item name...",
    filterByType: "Filter by type",
    increase: "Increase",
    decrease: "Decrease",
    quantity: "Quantity",
    type: "Type",
    reason: "Reason",
    shippingMethodSettings: "Shipping Method Settings",
    addNewShippingMethod: "Add New Shipping Method",
    methodName: "Method Name",
    estimatedDeliveryDays: "Estimated Delivery Days",
    addShippingMethod: "Add Shipping Method",
    existingShippingMethods: "Existing Shipping Methods",
    enabled: "Enabled",
    setAsPrimary: "Set as Primary",
    updateShippingMethod: "Update Shipping Method",
    paymentMethodSettings: "Payment Method Settings",
    addNewPaymentMethod: "Add New Payment Method",
    addPaymentMethod: "Add Payment Method",
    existingPaymentMethods: "Existing Payment Methods",
    updatePaymentMethod: "Update Payment Method",
    shopSettings: "Shop Settings",
    generalSettings: "General Settings",
    locations: "Locations",
    addNewLocation: "Add New Location",
    locationName: "Location Name",
    address: "Address",
    addLocation: "Add Location",
    editLocation: "Edit Location",
    openingHours: "Opening Hours",
    addPeriod: "Add Period",
    searchByTenantNameOwnerNameOrEmail: "Search by tenant name, owner name, or email...",
    submittedAt: "Submitted At",
    approve: "Approve",
    reject: "Reject",
    addNewUser: "Add New User",
    addUser: "Add User",
    existingUsers: "Existing Users",
    searchByNameOrEmail: "Search by name or email...",
    filterByRole: "Filter by role",
    editUser: "Edit User",
    updateUser: "Update User",
    clientsDashboard: "Clients Dashboard",
    clientList: "Client List",
    emailTemplates: "Email Templates",
    addNewTemplate: "Add New Template",
    templateName: "Template Name",
    subject: "Subject",
    body: "Body",
    addTemplate: "Add Template",
    updateTemplate: "Update Template",
    emailLogs: "Email Logs",
    recipient: "Recipient",
    sentAt: "Sent At",
    globalEmails: "Global Emails",
    addNewEmail: "Add New Email",
    sender: "Sender",
    addEmail: "Add Email",
    updateEmail: "Update Email",
    clickAndCollect: "Click and Collect",
    bookingLimit: "Booking Limit",
    pickupDateAndTime: "Pickup Date and Time",
    selectPickupDateAndTime: "Select Pickup Date and Time",
    filterByOrderType: "Filter by Order Type",
    collectTime: "Collect Time",
  },
  fr: {
    adminDashboard: "Tableau de Bord Admin",
    mealPlanner: "Planificateur de Repas",
    items: "Articles",
    mediaGallery: "Galerie Média",
    mealOrdering: "Commande de Repas",
    orders: "Commandes",
    myOrders: "Mes Commandes",
    stockMovements: "Mouvements de Stock",
    shippingMethods: "Méthodes d'Expédition",
    paymentMethods: "Méthodes de Paiement",
    settings: "Paramètres",
    clients: "Clients",
    tenantRegistrations: "Inscriptions des Locataires",
    tenantsAdministration: "Administration des Locataires",
    usersAdministration: "Administration des Utilisateurs",
    tenantSignup: "Inscription du Locataire",
    signIn: "Se Connecter",
    signOut: "Se Déconnecter",
    register: "S'inscrire",
    language: "Langue",
    selectRole: "Sélectionner un rôle",
    selectUser: "Sélectionner un utilisateur",
    selectTenant: "Sélectionner un locataire",
    superAdminMode: "Mode Super Admin",
    itemNotAvailableAtLocation: "Cet article n'est pas disponible à l'emplacement sélectionné",
    itemOutOfStock: "Cet article est en rupture de stock à l'emplacement sélectionné",
    cannotAddMoreOfThisItem: "Impossible d'ajouter plus de cet article",
    tenantRegistrationSubmitted: "Inscription du locataire soumise avec succès",
    signUpAsNewTenant: "S'inscrire en tant que nouveau locataire",
    tenantName: "Nom du locataire",
    ownerName: "Nom du propriétaire",
    email: "Email",
    phoneNumber: "Numéro de téléphone",
    businessType: "Type d'entreprise",
    next: "Suivant",
    back: "Retour",
    submit: "Soumettre",
    shopName: "Nom de la boutique",
    shopDescription: "Description de la boutique",
    currency: "Devise",
    selectCurrency: "Sélectionner une devise",
    taxRate: "Taux de taxe (%)",
    defaultShippingFee: "Frais d'expédition par défaut",
    selectLanguage: "Sélectionner une langue",
    searchByTenantName: "Rechercher par nom de locataire...",
    filterByStatus: "Filtrer par statut",
    all: "Tous",
    active: "Actif",
    pending: "En attente",
    suspended: "Suspendu",
    domain: "Domaine",
    status: "Statut",
    actions: "Actions",
    changeStatus: "Changer le statut",
    changeLanguage: "Changer la langue",
    tenantStatusUpdated: "Statut du locataire mis à jour à {{status}}",
    tenantLanguageUpdated: "Langue du locataire mise à jour à {{language}}",
    tenantDeleted: "Locataire supprimé avec succès",
    admin: "Admin",
    shopManager: "Gestionnaire de boutique",
    client: "Client",
    superAdmin: "Super Admin",
    invalidCredentials: "Identifiants invalides",
    signedInSuccessfully: "Connecté avec succès",
    registeredSuccessfully: "Enregistré avec succès",
    name: "Nom",
    password: "Mot de passe",
    selectMenuItem: "Sélectionner un élément du menu",
    createMealOffering: "Créer une offre de repas",
    mealName: "Nom du repas",
    startDateAndTime: "Date et heure de début",
    endDateAndTime: "Date et heure de fin",
    location: "Emplacement",
    addMealOffering: "Ajouter une offre de repas",
    scheduledMealOfferings: "Offres de repas programmées",
    searchMeals: "Rechercher des repas",
    filterByDate: "Filtrer par date",
    filterByLocation: "Filtrer par emplacement",
    allLocations: "Tous les emplacements",
    unpublish: "Dépublier",
    publish: "Publier",
    edit: "Modifier",
    duplicate: "Dupliquer",
    delete: "Supprimer",
    editMealOffering: "Modifier l'offre de repas",
    saveChanges: "Enregistrer les modifications",
    cancel: "Annuler",
    addItem: "Ajouter un article",
    itemManagement: "Gestion des articles",
    editItem: "Modifier l'article",
    addNewItem: "Ajouter un nouvel article",
    itemName: "Nom de l'article",
    category: "Catégorie",
    selectCategory: "Sélectionner une catégorie",
    price: "Prix",
    selectTaxRate: "Sélectionner le taux de taxe",
    stockByLocation: "Stock par emplacement",
    availableLocations: "Emplacements disponibles",
    description: "Description (Optionnel)",
    attributes: "Attributs",
    key: "Clé",
    value: "Valeur",
    addAttribute: "Ajouter un attribut",
    updateItem: "Mettre à jour l'article",
    itemList: "Liste des articles",
    uploadNewFile: "Télécharger un nouveau fichier",
    searchMedia: "Rechercher des médias...",
    selectImage: "Sélectionner une image",
    searchImages: "Rechercher des images...",
    selectLocation: "Sélectionner un emplacement",
    selectMealOffering: "Sélectionner une offre de repas",
    cardView: "Vue en carte",
    listView: "Vue en liste",
    searchItems: "Rechercher des articles...",
    addToCart: "Ajouter au panier",
    notAvailable: "Non disponible",
    outOfStock: "En rupture de stock",
    yourCart: "Votre panier",
    proceedToCheckout: "Passer à la caisse",
    checkout: "Paiement",
    customerName: "Nom",
    customerEmail: "Email",
    customerPhone: "Téléphone",
    deliveryAddress: "Adresse de livraison",
    shippingMethod: "Méthode d'expédition",
    selectShippingMethod: "Sélectionner une méthode d'expédition",
    paymentMethod: "Méthode de paiement",
    selectPaymentMethod: "Sélectionner une méthode de paiement",
    orderSummary: "Résumé de la commande",
    shipping: "Expédition",
    total: "Total",
    placeOrder: "Passer la commande",
    orderConfirmation: "Confirmation de commande",
    thankYouForYourOrder: "Merci pour votre commande, {{name}} !",
    orderId: "ID de commande",
    totalAmount: "Montant total",
    orderDetails: "Détails de la commande",
    close: "Fermer",
    searchByCustomerNameOrEmail: "Rechercher par nom ou email du client...",
    date: "Date",
    updateStatus: "Mettre à jour le statut",
    viewDetails: "Voir les détails",
    editOrder: "Modifier la commande",
    printReceipt: "Imprimer le reçu",
    searchByOrderIdOrName: "Rechercher par ID ou nom de commande...",
    searchByItemName: "Rechercher par nom d'article...",
    filterByType: "Filtrer par type",
    increase: "Augmentation",
    decrease: "Diminution",
    quantity: "Quantité",
    type: "Type",
    reason: "Raison",
    shippingMethodSettings: "Paramètres des méthodes d'expédition",
    addNewShippingMethod: "Ajouter une nouvelle méthode d'expédition",
    methodName: "Nom de la méthode",
    estimatedDeliveryDays: "Jours de livraison estimés",
    addShippingMethod: "Ajouter une méthode d'expédition",
    existingShippingMethods: "Méthodes d'expédition existantes",
    enabled: "Activé",
    setAsPrimary: "Définir comme principal",
    updateShippingMethod: "Mettre à jour la méthode d'expédition",
    paymentMethodSettings: "Paramètres des méthodes de paiement",
    addNewPaymentMethod: "Ajouter une nouvelle méthode de paiement",
    addPaymentMethod: "Ajouter une méthode de paiement",
    existingPaymentMethods: "Méthodes de paiement existantes",
    updatePaymentMethod: "Mettre à jour la méthode de paiement",
    shopSettings: "Paramètres de la boutique",
    generalSettings: "Paramètres généraux",
    locations: "Emplacements",
    addNewLocation: "Ajouter un nouvel emplacement",
    locationName: "Nom de l'emplacement",
    address: "Adresse",
    addLocation: "Ajouter un emplacement",
    editLocation: "Modifier l'emplacement",
    openingHours: "Heures d'ouverture",
    addPeriod: "Ajouter une période",
    searchByTenantNameOwnerNameOrEmail: "Rechercher par nom de locataire, nom du propriétaire ou email...",
    submittedAt: "Soumis le",
    approve: "Approuver",
    reject: "Rejeter",
    addNewUser: "Ajouter un nouvel utilisateur",
    addUser: "Ajouter un utilisateur",
    existingUsers: "Utilisateurs existants",
    searchByNameOrEmail: "Rechercher par nom ou email...",
    filterByRole: "Filtrer par rôle",
    editUser: "Modifier l'utilisateur",
    updateUser: "Mettre à jour l'utilisateur",
    clientsDashboard: "Tableau de bord des clients",
    clientList: "Liste des clients",
    emailTemplates: "Modèles d'email",
    addNewTemplate: "Ajouter un nouveau modèle",
    templateName: "Nom du modèle",
    subject: "Sujet",
    body: "Corps",
    addTemplate: "Ajouter un modèle",
    updateTemplate: "Mettre à jour le modèle",
    emailLogs: "Journaux d'emails",
    recipient: "Destinataire",
    sentAt: "Envoyé le",
    globalEmails: "Emails globaux",
    addNewEmail: "Ajouter un nouvel email",
    sender: "Expéditeur",
    addEmail: "Ajouter un email",
    updateEmail: "Mettre à jour l'email",
    clickAndCollect: "Cliquer et collecter",
    bookingLimit: "Limite de réservation",
    pickupDateAndTime: "Date et heure de collecte",
    selectPickupDateAndTime: "Sélectionner la date et l'heure de collecte",
    filterByOrderType: "Filtrer par type de commande",
    collectTime: "Heure de collecte",
  }
}

// Custom translation function
function _t(key: string, lang: string): string {
  return translations[lang || "fr"][key] || key
}

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
  tenantId: string
  name: string
  address: string
  openingHours: OpeningHours
}

interface ItemStock {
  [locationId: string]: number
}

interface Item {
  id: number
  tenantId: string
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
  tenantId: string
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
  tenantId: string
  name: string
  url: string
  type: 'image' | 'video'
}

interface Cart {
  tenantId: string;
  locationId: string;
  items: CartItem[];
}

interface CartItem extends Item {
  quantity: number
}

interface Order {
  id: number
  tenantId: string
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
  orderType: 'delivery' | 'click-and-collect'
  collectTime?: Date
}

interface StockMovement {
  id: number
  tenantId: string
  itemId: number
  quantity: number
  type: 'increase' | 'decrease'
  reason: string
  date: Date
  locationId: string
}

interface ShippingMethod {
  id: string
  tenantId: string
  name: string
  description: string
  price: number
  estimatedDeliveryDays: number
  enabled: boolean
  availableLocations: string[]
  type: 'delivery' | 'click-and-collect'
  bookingLimit?: number
}

interface PaymentMethod {
  id: string
  tenantId: string
  name: string
  description: string
  enabled: boolean
  availableLocations: string[]
}

interface ShopSettings {
  tenantId: string
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
  language: string
}

interface User {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Shop manager' | 'Client' | 'Super Admin';
  tenantId: string;
  preferredLanguage: string;
}

interface Tenant {
  id: string;
  name: string;
  domain: string;
  status: 'active' | 'pending' | 'suspended';
  language: string;
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
    language: string
  }
}

interface EmailTemplate {
  id: string
  tenantId: string
  name: string
  subject: string
  body: string
}

interface EmailLog {
  id: string
  tenantId: string
  templateId: string
  recipient: string
  subject: string
  body: string
  sentAt: Date
}

interface GlobalEmail {
  id: string
  sender: string
  recipient: string
  subject: string
  body: string
  sentAt: Date
}

interface AdminState {
  items: Item[]
  mealOfferings: MealOffering[]
  mediaItems: MediaItem[]
  carts: Cart[];
  addToCart: (tenantId: string, locationId: string, item: CartItem) => void;
  removeFromCart: (tenantId: string, locationId: string, itemId: string) => void;
  updateCartItemQuantity: (tenantId: string, locationId: string, itemId: string, quantity: number) => void;
  clearCart: (tenantId: string, locationId: string) => void;
  getCart: (tenantId: string, locationId: string) => Cart | undefined;
  orders: Order[]
  stockMovements: StockMovement[]
  shopSettings: ShopSettings[];
  getShopSettings: (tenantId: string) => ShopSettings;
  updateShopSettings: (tenantId: string, settings: Partial<ShopSettings>) => void;
  users: User[]
  currentUser: User | null
  tenants: Tenant[]
  currentTenant: Tenant | null
  tenantRegistrations: TenantRegistration[]
  isSuperAdminMode: boolean
  emailTemplates: EmailTemplate[]
  emailLogs: EmailLog[]
  globalEmails: GlobalEmail[]
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
  // addToCart: (item: Item, locationId: string) => void
  // removeFromCart: (itemId: number) => void
  // updateCartItemQuantity: (itemId: number, quantity: number) => void
  // clearCart: () => void
  addOrder: (order: Order) => void
  updateOrderStatus: (orderId: number, status: Order['status']) => void
  editOrder: (orderId: number, updatedOrder: Partial<Order>) => void
  addStockMovement: (movement: StockMovement) => void
  cancelStockMovement: (movementId: number) => void
  reserveStock: (items: CartItem[], locationId: string) => void
  releaseStock: (items: CartItem[], locationId: string) => void
  updateStock: (itemId: number, locationId: string, quantity: number) => void
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
  addUser: (user: User) => void
  updateUser: (id: string, user: Partial<User>) => void
  deleteUser: (id: string) => void
  addTenant: (tenant: Tenant) => void
  updateTenant: (id: string, tenant: Partial<Tenant>) => void
  deleteTenant: (id: string) => void
  setCurrentTenant: (tenant: Tenant | null) => void
  addTenantRegistration: (registration: TenantRegistration) => void
  updateTenantRegistration: (id: string, registration: Partial<TenantRegistration>) => void
  deleteTenantRegistration: (id: string) => void
  toggleSuperAdminMode: () => void
  setLanguage: (language: string) => void
  setUserPreferredLanguage: (userId: string, language: string) => void
  setTenantLanguage: (tenantId: string, language: string) => void
  addEmailTemplate: (template: EmailTemplate) => void
  updateEmailTemplate: (id: string, template: Partial<EmailTemplate>) => void
  deleteEmailTemplate: (id: string) => void
  addEmailLog: (log: EmailLog) => void
  deleteEmailLog: (id: string) => void
  addGlobalEmail: (email: GlobalEmail) => void
  updateGlobalEmail: (id: string, email: Partial<GlobalEmail>) => void
  deleteGlobalEmail: (id: string) => void
}

// Utility functions for cart storage
const getCartStorageKey = (tenantId: string, locationId: string) => `cart_${tenantId}_${locationId}`;

const getCartFromStorage = (tenantId: string, locationId: string): Cart | undefined => {
  const storageKey = getCartStorageKey(tenantId, locationId);
  const storedCart = localStorage.getItem(storageKey);
  return storedCart ? JSON.parse(storedCart) : undefined;
};

const setCartToStorage = (cart: Cart) => {
  const storageKey = getCartStorageKey(cart.tenantId, cart.locationId);
  localStorage.setItem(storageKey, JSON.stringify(cart));
};

const createTenantStorage = (tenantId: string) => ({
  getItem: (name: string) => {
    const value = localStorage.getItem(`${name}_${tenantId}`)
    return value ? JSON.parse(value) : null
  },
  setItem: (name: string, value: any) => {
    localStorage.setItem(`${name}_${tenantId}`, JSON.stringify(value))
  },
  removeItem: (name: string) => {
    localStorage.removeItem(`${name}_${tenantId}`)
  },
})

const globalStorage = createJSONStorage(() => localStorage)


const useAdminStore = create<AdminState>()(
  persist(
    (set, get) => ({
      items: [],
      mealOfferings: [],
      mediaItems: [],
      carts: [],
      orders: [],
      stockMovements: [],
      // shopSettings: [],
      shopSettings: [
        {
          tenantId: '1',
          shopName: 'My Shop',
          shopDescription: 'This is my shop',
          currency: 'EUR',
          taxRate: 20,
          shippingFee: 5,
          emailAddress: "test@example.com",
          phoneNumber: "1234567890",
          address: "123 Main St",
          language: 'en',
          locations: [
            {
              id: '1',
              tenantId: '1',
              name: 'Main Location',
              address: '123 Main St',
              openingHours: {
                monday: { periods: [{ open: '09:00', close: '17:00' }] },
                tuesday: { periods: [{ open: '09:00', close: '17:00' }] },
                wednesday: { periods: [{ open: '09:00', close: '17:00' }] },
                thursday: { periods: [{ open: '09:00', close: '17:00' }] },
                friday: { periods: [{ open: '09:00', close: '17:00' }] },
                saturday: { periods: [{ open: '09:00', close: '17:00' }] },
                sunday: { periods: [] },
              }
            }
          ],
          primaryLocationId: '1',
          shippingMethods: [],
          paymentMethods: [],
        }
      ],

      getShopSettings: (tenantId: string) => {
        // const settings = get().shopSettings.find(s => s.tenantId === tenantId);
        // if (settings) return settings;

        // // If settings don't exist for this tenant, create default settings
        // const defaultSettings: ShopSettings = {
        //   tenantId,
        //   shopName: '',
        //   shopDescription: '',
        //   currency: 'EUR',
        //   taxRate: 20,
        //   shippingFee: 5,
        //   emailAddress: '',
        //   phoneNumber: '',
        //   address: '',
        //   locations: [],
        //   primaryLocationId: '',
        //   shippingMethods: [],
        //   paymentMethods: [],
        //   language: 'en',
        // };
        // set(state => ({ shopSettings: [...state.shopSettings, defaultSettings] }));
        // return defaultSettings;

        // handle shop settings, maybe create a new shop settings if it doesn't exist or return the existing one
        const localStorage = createTenantStorage(tenantId);
        const shopSettings = localStorage.getItem('shopSettings');
        return shopSettings || {
          tenantId,
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
          language: 'en',
        };
        // return get().shopSettings.find(s => s.tenantId === tenantId) || {
        //   tenantId,
        //   shopName: '',
        //   shopDescription: '',
        //   currency: 'EUR',
        //   taxRate: 20,
        //   shippingFee: 5,
        //   emailAddress: '',
        //   phoneNumber: '',
        //   address: '',
        //   locations: [],
        //   primaryLocationId: '',
        //   shippingMethods: [],
        //   paymentMethods: [],
        //   language: 'en',
        // };

      },
      updateShopSettings: (tenantId: string, settings: Partial<ShopSettings>) => {
        set(state => {
          console.log('updateShopSettings', state.currentTenant, tenantId, settings)
          const shopSettings = { ...state.shopSettings, ...settings };
          const localStorage = createTenantStorage(tenantId);
          localStorage.setItem('shopSettings', shopSettings);
          return { shopSettings };
        });
        // set(state => ({
        //   shopSettings: state.shopSettings.map(s =>
        //     s.tenantId === tenantId ? { ...s, ...settings } : s
        //   )
        // }));
      },
      // setCurrentTenant: (tenant: Tenant | null) => {
      //   set({ currentTenant: tenant });
      //   if (tenant) {
      //     const tenantStorage = createTenantStorage(tenant.id);
      //     set({ storage: tenantStorage });
      //   } else {
      //     set({ storage: globalStorage });
      //   }
      // },
      users: [
        { id: '1', name: 'Admin User', email: 'admin@example.com', role: 'Admin', tenantId: '1', preferredLanguage: 'en' },
        { id: '2', name: 'Shop Manager', email: 'manager@example.com', role: 'Shop manager', tenantId: '1', preferredLanguage: 'en' },
        { id: '3', name: 'Client User', email: 'client@example.com', role: 'Client', tenantId: '1', preferredLanguage: 'en' },
        { id: '4', name: 'Super Admin', email: 'superadmin@example.com', role: 'Super Admin', tenantId: '', preferredLanguage: 'en' },
      ],
      currentUser: null,
      tenants: [
        { id: '1', name: 'Tenant 1', domain: 'tenant1.example.com', status: 'active', language: 'en' },
        { id: '2', name: 'Tenant 2', domain: 'tenant2.example.com', status: 'active', language: 'fr' },
      ],
      currentTenant: null,
      tenantRegistrations: [],
      isSuperAdminMode: false,
      emailTemplates: [],
      emailLogs: [],
      globalEmails: [],
      addItem: (item) => set((state) => {
        const tenantId = state.currentTenant?.id || ''
        return { items: [...state.items, { ...item, tenantId }] }
      }),
      updateItem: (id, updatedItem) => set((state) => ({
        items: state.items.map(item => item.id === id ? { ...item, ...updatedItem } : item)
      })),
      deleteItem: (id) => set((state) => ({ items: state.items.filter(item => item.id !== id) })),
      addMealOffering: (mealOffering) => set((state) => {
        const tenantId = state.currentTenant?.id || ''
        return { mealOfferings: [...state.mealOfferings, { ...mealOffering, tenantId }] }
      }),
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
      addMediaItem: (mediaItem) => set((state) => {
        const tenantId = state.currentTenant?.id || ''
        return { mediaItems: [...state.mediaItems, { ...mediaItem, tenantId }] }
      }),
      deleteMediaItem: (id) => set((state) => ({ mediaItems: state.mediaItems.filter(item => item.id !== id) })),
      setItemFeaturedImage: (itemId, imageUrl) => set((state) => ({
        items: state.items.map(item =>
          item.id === itemId ? { ...item, featuredImage: imageUrl } : item
        )
      })),
      addToCart: (tenantId, locationId, item) => set((state) => {
        const existingCartIndex = state.carts.findIndex(
          (cart) => cart.tenantId === tenantId && cart.locationId === locationId
        );

        if (existingCartIndex !== -1) {
          const updatedCarts = [...state.carts];
          const existingCart = updatedCarts[existingCartIndex];
          const existingItemIndex = existingCart.items.findIndex((i) => i.id === item.id);

          if (existingItemIndex !== -1) {
            existingCart.items[existingItemIndex].quantity += item.quantity;
          } else {
            existingCart.items.push(item);
          }

          setCartToStorage(existingCart);
          return { carts: updatedCarts };
        } else {
          const newCart: Cart = {
            tenantId,
            locationId,
            items: [item],
          };
          setCartToStorage(newCart);
          return { carts: [...state.carts, newCart] };
        }
      }),
      removeFromCart: (tenantId, locationId, itemId) => set((state) => {
        const updatedCarts = state.carts.map((cart) => {
          if (cart.tenantId === tenantId && cart.locationId === locationId) {
            const updatedItems = cart.items.filter((item) => item.id !== itemId);
            const updatedCart = { ...cart, items: updatedItems };
            setCartToStorage(updatedCart);
            return updatedCart;
          }
          return cart;
        });
        return { carts: updatedCarts };
      }),
      updateCartItemQuantity: (tenantId, locationId, itemId, quantity) => set((state) => {
        const updatedCarts = state.carts.map((cart) => {
          if (cart.tenantId === tenantId && cart.locationId === locationId) {
            const updatedItems = cart.items.map((item) => {
              if (item.id === itemId) {
                return { ...item, quantity };
              }
              return item;
            });
            const updatedCart = { ...cart, items: updatedItems };
            setCartToStorage(updatedCart);
            return updatedCart;
          }
          return cart;
        });
        return { carts: updatedCarts };
      }),
      clearCart: (tenantId, locationId) => set((state) => {
        const updatedCarts = state.carts.filter(
          (cart) => !(cart.tenantId === tenantId && cart.locationId === locationId)
        );
        localStorage.removeItem(getCartStorageKey(tenantId, locationId));
        return { carts: updatedCarts };
      }),
      getCart: (tenantId, locationId) => {
        const state = get();
        const cart = state.carts.find(
          (cart) => cart.tenantId === tenantId && cart.locationId === locationId
        );
        if (cart) {
          return cart;
        }
        const storedCart = getCartFromStorage(tenantId, locationId);
        if (storedCart) {
          set((state) => ({ carts: [...state.carts, storedCart] }));
          return storedCart;
        }
        return undefined;
      },
      addOrder: (order) => set((state) => {
        const tenantId = state.currentTenant?.id || ''
        const newState = { orders: [...state.orders, { ...order, tenantId }] }
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
      addStockMovement: (movement) => set((state) => {
        const tenantId = state.currentTenant?.id || ''
        return { stockMovements: [...state.stockMovements, { ...movement, tenantId }] }
      }),
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
            tenantId: get().currentTenant?.id || '',
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
            tenantId: get().currentTenant?.id || '',
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
      // addShippingMethod: (shippingMethod: ShippingMethod) => set((state) => ({
      //   shopSettings: {
      //     ...state.shopSettings,
      //     shippingMethods: [...state.shopSettings.shippingMethods, { ...shippingMethod, tenantId: state.currentTenant?.id || '' }]
      //   }
      // })),

      // addPaymentMethod: (paymentMethod: PaymentMethod) => set((state) => ({
      //   shopSettings: {
      //     ...state.shopSettings,
      //     paymentMethods: [...state.shopSettings.paymentMethods, { ...paymentMethod, tenantId: state.currentTenant?.id || '' }]
      //   }
      // })),
      // Add method to set current tenant
      // setCurrentTenant: (tenant: Tenant | null) => set({ currentTenant: tenant }),
      addLocation: (location) => set((state) => ({
        shopSettings: {
          ...state.shopSettings,
          locations: [...state.shopSettings?.filter(s => s.tenantId === location.tenantId).map(s => ({
            ...s,
            locations: [...s.locations, location]
          }))],
          // locations: state.shopSettings.filter(s => s.tenantId === location.tenantId).map(s => ({
          //   ...s,
          //   locations: [...s.locations, location]
          // })),
          // primaryLocationId: state.shopSettings.primaryLocationId || location.id
          primaryLocationId: state.shopSettings.filter(s => s.tenantId === location.tenantId).map(s => ({
            ...s,
            primaryLocationId: s.primaryLocationId || location.id
          }))
        }
      })),
      updateLocation: (id, updatedLocation) => set((state) => ({
        shopSettings: {
          ...state.shopSettings,
          // locations: state.shopSettings?.locations?.map(location =>
          //   location.id === id ? { ...location, ...updatedLocation } : location
          // )
          locations: state.shopSettings.filter(s => s.tenantId === updatedLocation.tenantId).map(s => ({
            ...s,
            locations: s.locations.map(location =>
              location.id === id ? { ...location, ...updatedLocation } : location
            )
          }))
        }
      })),
      deleteLocation: (id) => set((state) => ({
        shopSettings: {
          ...state.shopSettings,
          // locations: state.shopSettings?.locations?.filter(location => location.id !== id),
          locations: state.shopSettings.filter(s => s.tenantId === location.tenantId).map(s => ({
            ...s,
            locations: s.locations.filter(location => location.id !== id)
          })),
          // primaryLocationId: state.shopSettings.primaryLocationId === id
          //   ? state.shopSettings?.locations[0]?.id || ''
          //   : state.shopSettings.primaryLocationId
          primaryLocationId: state.shopSettings.filter(s => s.tenantId === location.tenantId).map(s => ({
            ...s,
            primaryLocationId: s.primaryLocationId === id
              ? s.locations[0]?.id || ''
              : s.primaryLocationId
          }))
        }
      })),
      setPrimaryLocation: (id) => set((state) => ({
        shopSettings: {
          ...state.shopSettings,
          primaryLocationId: id
        }
      })),
      addShippingMethod: (shippingMethod) => set((state) => {
        const tenantId = state.currentTenant?.id || ''
        return {
          shopSettings: {
            ...state.shopSettings,
            // shippingMethods: [...state.shopSettings.shippingMethods, { ...shippingMethod, tenantId }]
            shippingMethods: state.shopSettings.filter(s => s.tenantId === tenantId).map(s => ({
              ...s,
              shippingMethods: [...s.shippingMethods, { ...shippingMethod, tenantId }]
            }))
          }
        }
      }),
      updateShippingMethod: (id, updatedShippingMethod) => set((state) => ({
        shopSettings: {
          ...state.shopSettings,
          // shippingMethods: state.shopSettings.shippingMethods.map(method =>
          //   method.id === id ? { ...method, ...updatedShippingMethod } : method
          // )
          shippingMethods: state.shopSettings.filter(s => s.tenantId === updatedShippingMethod.tenantId).map(s => ({
            ...s,
            shippingMethods: s.shippingMethods.map(method =>
              method.id === id ? { ...method, ...updatedShippingMethod } : method
            )
          })
          )
        }
      })),
      deleteShippingMethod: (id) => set((state) => ({
        shopSettings: {
          ...state.shopSettings,
          // shippingMethods: state.shopSettings.shippingMethods.filter(method => method.id !== id)
          shippingMethods: state.shopSettings.filter(s => s.tenantId === location.tenantId).map(s => ({
            ...s,
            shippingMethods: s.shippingMethods.filter(method => method.id !== id)
          }))
        }
      })),
      addPaymentMethod: (paymentMethod) => set((state) => {
        const tenantId = state.currentTenant?.id || ''
        return {
          shopSettings: {
            ...state.shopSettings,
            // paymentMethods: [...state.shopSettings.paymentMethods, { ...paymentMethod, tenantId }]
            paymentMethods: state.shopSettings.filter(s => s.tenantId === tenantId).map(s => ({
              ...s,
              paymentMethods: [...s.paymentMethods, { ...paymentMethod, tenantId }]
            }))
          }
        }
      }),
      updatePaymentMethod: (id, updatedPaymentMethod) => set((state) => ({
        shopSettings: {
          ...state.shopSettings,
          // paymentMethods: state.shopSettings.paymentMethods.map(method =>
          //   method.id === id ? { ...method, ...updatedPaymentMethod } : method
          // )
          paymentMethods: state.shopSettings.filter(s => s.tenantId === updatedPaymentMethod.tenantId).map(s => ({
            ...s,
            paymentMethods: s.paymentMethods.map(method =>
              method.id === id ? { ...method, ...updatedPaymentMethod } : method
            )
          })
          )
        }
      })),
      deletePaymentMethod: (id) => set((state) => ({
        shopSettings: {
          ...state.shopSettings,
          // paymentMethods: state.shopSettings.paymentMethods.filter(method => method.id !== id)
          paymentMethods: state.shopSettings.filter(s => s.tenantId === location.tenantId).map(s => ({
            ...s,
            paymentMethods: s.paymentMethods.filter(method => method.id !== id)
          }))
        }
      })),
      setCurrentUser: (user) => set({ currentUser: user }),
      addUser: (user) => set((state) => ({ users: [...state.users, user] })),
      updateUser: (id, updatedUser) => set((state) => ({
        users: state.users.map(user => user.id === id ? { ...user, ...updatedUser } : user)
      })),
      deleteUser: (id) => set((state) => ({
        users: state.users.filter(user => user.id !== id)
      })),
      addTenant: (tenant) => set((state) => ({ tenants: [...state.tenants, tenant] })),
      updateTenant: (id, updatedTenant) => set((state) => ({
        tenants: state.tenants.map(tenant =>
          tenant.id === id ? { ...tenant, ...updatedTenant } : tenant
        )
      })),
      deleteTenant: (id) => set((state) => ({
        tenants: state.tenants.filter(tenant => tenant.id !== id)
      })),
      setCurrentTenant: (tenant) => {
        set({ currentTenant: tenant })
        if (tenant) {
          const tenantStorage = createTenantStorage(tenant.id)
          console.log('Switching to tenant storage', tenantStorage)
          set({ storage: tenantStorage })
        } else {
          set({ storage: globalStorage })
        }
      },
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
      setLanguage: (language) => set((state) => ({
        shopSettings: { ...state.shopSettings, language }
      })),
      setUserPreferredLanguage: (userId, language) => set((state) => ({
        users: state.users.map(user =>
          user.id === userId ? { ...user, preferredLanguage: language } : user
        )
      })),
      setTenantLanguage: (tenantId, language) => set((state) => ({
        tenants: state.tenants.map(tenant =>
          tenant.id === tenantId ? { ...tenant, language } : tenant
        )
      })),
      addEmailTemplate: (template) => set((state) => {
        const tenantId = state.currentTenant?.id || ''
        return { emailTemplates: [...state.emailTemplates, { ...template, tenantId }] }
      }),
      updateEmailTemplate: (id, updatedTemplate) => set((state) => ({
        emailTemplates: state.emailTemplates.map(template =>
          template.id === id ? { ...template, ...updatedTemplate } : template
        )
      })),
      deleteEmailTemplate: (id) => set((state) => ({
        emailTemplates: state.emailTemplates.filter(template => template.id !== id)
      })),
      addEmailLog: (log) => set((state) => {
        const tenantId = state.currentTenant?.id || ''
        return { emailLogs: [...state.emailLogs, { ...log, tenantId }] }
      }),
      deleteEmailLog: (id) => set((state) => ({
        emailLogs: state.emailLogs.filter(log => log.id !== id)
      })),
      addGlobalEmail: (email) => set((state) => ({
        globalEmails: [...state.globalEmails, email]
      })),
      updateGlobalEmail: (id, updatedEmail) => set((state) => ({
        globalEmails: state.globalEmails.map(email =>
          email.id === id ? { ...email, ...updatedEmail } : email
        )
      })),
      deleteGlobalEmail: (id) => set((state) => ({
        globalEmails: state.globalEmails.filter(email => email.id !== id)
      })),
    }),
    {
      name: 'admin-storage',
      getStorage: () => {
        const state = get()
        return state.currentTenant ? createTenantStorage(state.currentTenant.id) : globalStorage
      },
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
    language: 'en',
  })
  const { getShopSettings, currentTenant } = useAdminStore()
  const shopSettings = getShopSettings(currentTenant?.id || '')
  const lang = shopSettings.language

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
        language: formData.language,
      },
    }
    addTenantRegistration(newRegistration)
    toast.success(_t('tenantRegistrationSubmitted', lang))
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
      language: 'en',
    })
    setStep(1)
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>{_t('signUpAsNewTenant', lang)}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {step === 1 && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="tenantName">{_t('tenantName', lang)}</Label>
                  <Input
                    id="tenantName"
                    name="tenantName"
                    value={formData.tenantName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ownerName">{_t('ownerName', lang)}</Label>
                  <Input
                    id="ownerName"
                    name="ownerName"
                    value={formData.ownerName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">{_t('email', lang)}</Label>
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
                  <Label htmlFor="phoneNumber">{_t('phoneNumber', lang)}</Label>
                  <Input
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="businessType">{_t('businessType', lang)}</Label>
                  <Input
                    id="businessType"
                    name="businessType"
                    value={formData.businessType}
                    onChange={handleChange}
                    required
                  />
                </div>
                <Button type="button" onClick={() => setStep(2)}>{_t('next', lang)}</Button>
              </>
            )}
            {step === 2 && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="shopName">{_t('shopName', lang)}</Label>
                  <Input
                    id="shopName"
                    name="shopName"
                    value={formData.shopName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="shopDescription">{_t('shopDescription', lang)}</Label>
                  <Textarea
                    id="shopDescription"
                    name="shopDescription"
                    value={formData.shopDescription}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">{_t('currency', lang)}</Label>
                  <Select
                    value={formData.currency}
                    onValueChange={(value) => handleSelectChange('currency', value)}
                  >
                    <SelectTrigger id="currency">
                      <SelectValue placeholder={_t('selectCurrency', lang)} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="EUR">Euro (€)</SelectItem>
                      <SelectItem value="USD">US Dollar ($)</SelectItem>
                      <SelectItem value="GBP">British Pound (£)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="taxRate">{_t('taxRate', lang)}</Label>
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
                  <Label htmlFor="shippingFee">{_t('defaultShippingFee', lang)}</Label>
                  <Input
                    id="shippingFee"
                    name="shippingFee"
                    type="number"
                    value={formData.shippingFee}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language">{_t('language', lang)}</Label>
                  <Select
                    value={formData.language}
                    onValueChange={(value) => handleSelectChange('language', value)}
                  >
                    <SelectTrigger id="language">
                      <SelectValue placeholder={_t('selectLanguage', lang)} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="fr">Français</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button type="button" onClick={() => setStep(1)}>{_t('back', lang)}</Button>
                <Button type="submit" className="ml-2">{_t('submit', lang)}</Button>
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
  const { currentTenant, getShopSettings } = useAdminStore()
  const lang = getShopSettings(currentTenant?.id).language

  const filteredTenants = tenants.filter(tenant =>
    tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (statusFilter === 'all' || tenant.status === statusFilter)
  )

  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-bold text-gray-800">{_t('tenantsAdministration', lang)}</h2>
      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
        <div className="flex-1">
          <Input
            placeholder={_t('searchByTenantName', lang)}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-full md:w-48">
          <Select value={statusFilter} onValueChange={(value: Tenant['status'] | 'all') => setStatusFilter(value)}>
            <SelectTrigger>
              <SelectValue placeholder={_t('filterByStatus', lang)} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{_t('all', lang)}</SelectItem>
              <SelectItem value="active">{_t('active', lang)}</SelectItem>
              <SelectItem value="pending">{_t('pending', lang)}</SelectItem>
              <SelectItem value="suspended">{_t('suspended', lang)}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{_t('tenantName', lang)}</TableHead>
                <TableHead>{_t('domain', lang)}</TableHead>
                <TableHead>{_t('status', lang)}</TableHead>
                <TableHead>{_t('language', lang)}</TableHead>
                <TableHead>{_t('actions', lang)}</TableHead>
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
                      {_t(tenant.status, lang)}
                    </Badge>
                  </TableCell>
                  <TableCell>{tenant.language === 'en' ? 'English' : 'Français'}</TableCell>
                  <TableCell>
                    <Select
                      value={tenant.status}
                      onValueChange={(value: Tenant['status']) => {
                        updateTenant(tenant.id, { status: value })
                        toast.success(_t('tenantStatusUpdated', lang).replace('{{status}}', _t(value, lang)))
                      }}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder={_t('changeStatus', lang)} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">{_t('active', lang)}</SelectItem>
                        <SelectItem value="pending">{_t('pending', lang)}</SelectItem>
                        <SelectItem value="suspended">{_t('suspended', lang)}</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select
                      value={tenant.language}
                      onValueChange={(value: string) => {
                        updateTenant(tenant.id, { language: value })
                        toast.success(_t('tenantLanguageUpdated', lang).replace('{{language}}', value === 'en' ? 'English' : 'Français'))
                      }}
                    >
                      <SelectTrigger className="w-[180px] mt-2">
                        <SelectValue placeholder={_t('changeLanguage', lang)} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="fr">Français</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        deleteTenant(tenant.id)
                        toast.success(_t('tenantDeleted', lang))
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
  const { getShopSettings, users, currentUser, setCurrentUser, tenants, currentTenant, setCurrentTenant, isSuperAdminMode, toggleSuperAdminMode, setLanguage, setUserPreferredLanguage } = useAdminStore()
  const [isSignInOpen, setIsSignInOpen] = useState(false)
  const [isRegisterOpen, setIsRegisterOpen] = useState(false)
  // const { shopSettings } = useAdminStore()
  const shopSettings = getShopSettings(currentTenant?.id)
  const lang = shopSettings.language

  const handleRoleChange = (role: 'Admin' | 'Shop manager' | 'Client' | 'Super Admin') => {
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
    console.log("Tenant change", tenant)
    if (tenant) {
      setCurrentTenant(tenant)
      setLanguage(tenant.language)
    }
  }

  const handleLanguageChange = (language: string) => {
    if (currentUser) {
      setUserPreferredLanguage(currentUser.id, language)
    }
    setLanguage(language)
  }

  return (
    <div className="bg-gray-800 text-white p-4 flex flex-col md:flex-row justify-between items-center">
      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mb-4 md:mb-0">
        <Select onValueChange={handleRoleChange} value={currentUser?.role || ''}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={_t('selectRole', lang)} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Admin">{_t('admin', lang)}</SelectItem>
            <SelectItem value="Shop manager">{_t('shopManager', lang)}</SelectItem>
            <SelectItem value="Client">{_t('client', lang)}</SelectItem>
            <SelectItem value="Super Admin">{_t('superAdmin', lang)}</SelectItem>
          </SelectContent>
        </Select>
        <Select onValueChange={handleUserChange} value={currentUser?.id || ''}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={_t('selectUser', lang)} />
          </SelectTrigger>
          <SelectContent>
            {users.map((user) => (
              <SelectItem key={user.id} value={user.id}>{user.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select onValueChange={handleTenantChange} value={currentTenant?.id || ''}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={_t('selectTenant', lang)} />
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
          <Label htmlFor="super-admin-mode">{_t('superAdminMode', lang)}</Label>
        </div>
        <Select onValueChange={handleLanguageChange} value={lang}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={_t('selectLanguage', lang)} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="en">English</SelectItem>
            <SelectItem value="fr">Français</SelectItem>
          </SelectContent>
        </Select>
        {currentUser ? (
          <div className="flex items-center space-x-2">
            <span>{currentUser.name}</span>
            <Button variant="outline" onClick={() => setCurrentUser(null)}>
              {_t('signOut', lang)}
            </Button>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={() => setIsSignInOpen(true)}>
              {_t('signIn', lang)}
            </Button>
            <Button variant="outline" onClick={() => setIsRegisterOpen(true)}>
              {_t('register', lang)}
            </Button>
          </div>
        )}
      </div>
      <SignInDialog open={isSignInOpen} onOpenChange={() => setIsSignInOpen(false)} />
      <RegisterDialog open={isRegisterOpen} onOpenChange={() => setIsRegisterOpen(false)} />
    </div>
  )
}

function SignInDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const { users, setCurrentUser, getShopSettings, currentTenant } = useAdminStore()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("test")
  const shopSettings = getShopSettings(currentTenant?.id)
  const lang = shopSettings.language

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const user = users.find(u => u.email === email)
    if (user && password === "test") {
      setCurrentUser(user)
      onOpenChange(false)
      toast.success(_t('signedInSuccessfully', lang))
    } else {
      toast.error(_t('invalidCredentials', lang))
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{_t('signIn', lang)}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">{_t('email', lang)}</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">{_t('password', lang)}</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full">{_t('signIn', lang)}</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function RegisterDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const { users, setCurrentUser, addUser, getShopSettings, currentTenant } = useAdminStore()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("test")
  const shopSettings = getShopSettings(currentTenant?.id)
  const lang = shopSettings.language

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newUser: User = {
      id: (users.length + 1).toString(),
      name,
      email,
      role: 'Client',
      tenantId: '',
      preferredLanguage: lang
    }
    addUser(newUser)
    setCurrentUser(newUser)
    onOpenChange(false)
    toast.success(_t('registeredSuccessfully', lang))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{_t('register', lang)}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">{_t('name', lang)}</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">{_t('email', lang)}</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">{_t('password', lang)}</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full">{_t('register', lang)}</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}


function EmailTemplates() {
  const { emailTemplates, addEmailTemplate, updateEmailTemplate, deleteEmailTemplate, currentTenant } = useAdminStore()
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null)
  const { shopSettings } = useAdminStore()
  const lang = shopSettings.language

  const handleAddTemplate = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const newTemplate: EmailTemplate = {
      id: Date.now().toString(),
      tenantId: currentTenant?.id || '',
      name: formData.get('name') as string,
      subject: formData.get('subject') as string,
      body: formData.get('body') as string,
    }
    addEmailTemplate(newTemplate)
    event.currentTarget.reset()
    toast.success(_t('emailTemplateAdded', lang))
  }

  const handleUpdateTemplate = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (editingTemplate) {
      const formData = new FormData(event.currentTarget)
      const updatedTemplate: Partial<EmailTemplate> = {
        name: formData.get('name') as string,
        subject: formData.get('subject') as string,
        body: formData.get('body') as string,
      }
      updateEmailTemplate(editingTemplate.id, updatedTemplate)
      setEditingTemplate(null)
      toast.success(_t('emailTemplateUpdated', lang))
    }
  }

  const filteredTemplates = emailTemplates.filter(template => template.tenantId === currentTenant?.id)

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-gray-800">{_t('emailTemplates', lang)}</h2>

      <Card>
        <CardHeader>
          <CardTitle>{_t('addNewTemplate', lang)}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddTemplate} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">{_t('templateName', lang)}</Label>
              <Input id="name" name="name" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subject">{_t('subject', lang)}</Label>
              <Input id="subject" name="subject" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="body">{_t('body', lang)}</Label>
              <Textarea id="body" name="body" required />
            </div>
            <Button type="submit">{_t('addTemplate', lang)}</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{_t('existingTemplates', lang)}</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredTemplates.map((template) => (
            <div key={template.id} className="mb-4 p-4 border rounded">
              <h3 className="font-semibold">{template.name}</h3>
              <p><strong>{_t('subject', lang)}:</strong> {template.subject}</p>
              <p><strong>{_t('body', lang)}:</strong> {template.body}</p>
              <div className="mt-2">
                <Button variant="outline" size="sm" onClick={() => setEditingTemplate(template)}>
                  {_t('edit', lang)}
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  className="ml-2"
                  onClick={() => {
                    deleteEmailTemplate(template.id)
                    toast.success(_t('emailTemplateDeleted', lang))
                  }}
                >
                  {_t('delete', lang)}
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {editingTemplate && (
        <Dialog open={true} onOpenChange={() => setEditingTemplate(null)}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{_t('editEmailTemplate', lang)}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleUpdateTemplate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">{_t('templateName', lang)}</Label>
                <Input id="edit-name" name="name" defaultValue={editingTemplate.name} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-subject">{_t('subject', lang)}</Label>
                <Input id="edit-subject" name="subject" defaultValue={editingTemplate.subject} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-body">{_t('body', lang)}</Label>
                <Textarea id="edit-body" name="body" defaultValue={editingTemplate.body} required />
              </div>
              <Button type="submit">{_t('updateTemplate', lang)}</Button>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

function EmailLogs() {
  const { emailLogs, deleteEmailLog, currentTenant } = useAdminStore()
  const [searchTerm, setSearchTerm] = useState("")
  const { shopSettings } = useAdminStore()
  const lang = shopSettings.language

  const filteredLogs = emailLogs.filter(log =>
    log.tenantId === currentTenant?.id &&
    (log.recipient.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.subject.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-bold text-gray-800">{_t('emailLogs', lang)}</h2>
      <div className="flex">
        <Input
          placeholder={_t('searchByRecipientOrSubject', lang)}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>
      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{_t('recipient', lang)}</TableHead>
                <TableHead>{_t('subject', lang)}</TableHead>
                <TableHead>{_t('sentAt', lang)}</TableHead>
                <TableHead>{_t('actions', lang)}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>{log.recipient}</TableCell>
                  <TableCell>{log.subject}</TableCell>
                  <TableCell>{new Date(log.sentAt).toLocaleString()}</TableCell>
                  <TableCell>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        deleteEmailLog(log.id)
                        toast.success(_t('emailLogDeleted', lang))
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

function GlobalEmails() {
  const { globalEmails, addGlobalEmail, updateGlobalEmail, deleteGlobalEmail } = useAdminStore()
  const [editingEmail, setEditingEmail] = useState<GlobalEmail | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const { shopSettings } = useAdminStore()
  const lang = shopSettings.language

  const handleAddEmail = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const newEmail: GlobalEmail = {
      id: Date.now().toString(),
      sender: formData.get('sender') as string,
      recipient: formData.get('recipient') as string,
      subject: formData.get('subject') as string,
      body: formData.get('body') as string,
      sentAt: new Date(),
    }
    addGlobalEmail(newEmail)
    event.currentTarget.reset()
    toast.success(_t('globalEmailAdded', lang))
  }

  const handleUpdateEmail = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (editingEmail) {
      const formData = new FormData(event.currentTarget)
      const updatedEmail: Partial<GlobalEmail> = {
        sender: formData.get('sender') as string,
        recipient: formData.get('recipient') as string,
        subject: formData.get('subject') as string,
        body: formData.get('body') as string,
      }
      updateGlobalEmail(editingEmail.id, updatedEmail)
      setEditingEmail(null)
      toast.success(_t('globalEmailUpdated', lang))
    }
  }

  const filteredEmails = globalEmails.filter(email =>
    email.sender.toLowerCase().includes(searchTerm.toLowerCase()) ||
    email.recipient.toLowerCase().includes(searchTerm.toLowerCase()) ||
    email.subject.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-gray-800">{_t('globalEmails', lang)}</h2>

      <Card>
        <CardHeader>
          <CardTitle>{_t('addNewEmail', lang)}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddEmail} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="sender">{_t('sender', lang)}</Label>
              <Input id="sender" name="sender" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="recipient">{_t('recipient', lang)}</Label>
              <Input id="recipient" name="recipient" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subject">{_t('subject', lang)}</Label>
              <Input id="subject" name="subject" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="body">{_t('body', lang)}</Label>
              <Textarea id="body" name="body" required />
            </div>
            <Button type="submit">{_t('addEmail', lang)}</Button>
          </form>
        </CardContent>
      </Card>

      <div className="flex mb-4">
        <Input
          placeholder={_t('searchEmails', lang)}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{_t('globalEmails', lang)}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{_t('sender', lang)}</TableHead>
                <TableHead>{_t('recipient', lang)}</TableHead>
                <TableHead>{_t('subject', lang)}</TableHead>
                <TableHead>{_t('sentAt', lang)}</TableHead>
                <TableHead>{_t('actions', lang)}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEmails.map((email) => (
                <TableRow key={email.id}>
                  <TableCell>{email.sender}</TableCell>
                  <TableCell>{email.recipient}</TableCell>
                  <TableCell>{email.subject}</TableCell>
                  <TableCell>{new Date(email.sentAt).toLocaleString()}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm" onClick={() => setEditingEmail(email)}>
                      {_t('edit', lang)}
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="ml-2"
                      onClick={() => {
                        deleteGlobalEmail(email.id)
                        toast.success(_t('globalEmailDeleted', lang))
                      }}
                    >
                      {_t('delete', lang)}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {editingEmail && (
        <Dialog open={true} onOpenChange={() => setEditingEmail(null)}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{_t('editGlobalEmail', lang)}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleUpdateEmail} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-sender">{_t('sender', lang)}</Label>
                <Input id="edit-sender" name="sender" defaultValue={editingEmail.sender} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-recipient">{_t('recipient', lang)}</Label>
                <Input id="edit-recipient" name="recipient" defaultValue={editingEmail.recipient} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-subject">{_t('subject', lang)}</Label>
                <Input id="edit-subject" name="subject" defaultValue={editingEmail.subject} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-body">{_t('body', lang)}</Label>
                <Textarea id="edit-body" name="body" defaultValue={editingEmail.body} required />
              </div>
              <Button type="submit">{_t('updateEmail', lang)}</Button>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
export default function AdminDashboard() {
  const { currentUser, isSuperAdminMode, getShopSettings } = useAdminStore()
  const [activeTab, setActiveTab] = useState("meal-planner")
  const shopSettings = getShopSettings(currentUser?.tenantId || '1')
  const lang = shopSettings.language

  const getMenuItems = () => {
    const commonItems = [
      { label: _t('mealOrdering', lang), icon: ShoppingCart, tab: "meal-ordering" },
      { label: _t('myOrders', lang), icon: FileText, tab: "my-orders" },
    ]

    const adminItems = [
      { label: _t('mealPlanner', lang), icon: CalendarIcon, tab: "meal-planner" },
      { label: _t('items', lang), icon: List, tab: "items" },
      { label: _t('mediaGallery', lang), icon: ImageIcon, tab: "media-gallery" },
      { label: _t('orders', lang), icon: FileText, tab: "orders" },
      { label: _t('stockMovements', lang), icon: ArrowUp, tab: "stock-movements" },
      { label: _t('shippingMethods', lang), icon: Truck, tab: "shipping-methods" },
      { label: _t('paymentMethods', lang), icon: CreditCard, tab: "payment-methods" },
      { label: _t('settings', lang), icon: Settings, tab: "settings" },
      { label: _t('clients', lang), icon: Users, tab: "clients" },
      { label: _t('emailTemplates', lang), icon: Mail, tab: "email-templates" },
      { label: _t('emailLogs', lang), icon: Mail, tab: "email-logs" },
    ]

    const shopManagerItems = [
      { label: _t('mealPlanner', lang), icon: CalendarIcon, tab: "meal-planner" },
      { label: _t('items', lang), icon: List, tab: "items" },
      { label: _t('mediaGallery', lang), icon: ImageIcon, tab: "media-gallery" },
      { label: _t('orders', lang), icon: FileText, tab: "orders" },
      { label: _t('stockMovements', lang), icon: ArrowUp, tab: "stock-movements" },
    ]

    const superAdminItems = [
      { label: _t('tenantRegistrations', lang), icon: Building, tab: "tenant-registrations" },
      { label: _t('tenantsAdministration', lang), icon: Building, tab: "tenants-administration" },
      { label: _t('usersAdministration', lang), icon: Users, tab: "users-administration" },
      { label: _t('globalEmails', lang), icon: Mail, tab: "global-emails" },
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
      items.push({ label: _t('tenantSignup', lang), icon: User, tab: "tenant-signup" })
    }

    return items
  }

  const menuItems = getMenuItems()

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <AdminBar />
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-md hidden md:block">
          <div className="p-4">
            <h1 className="text-2xl font-bold text-gray-800">{_t('adminDashboard', lang)}</h1>
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

        {/* Mobile menu */}
        <div className="md:hidden">
          <Select onValueChange={(value) => setActiveTab(value)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={_t('selectMenuItem', lang)} />
            </SelectTrigger>
            <SelectContent>
              {menuItems.map((item) => (
                <SelectItem key={item.tab} value={item.tab}>
                  <div className="flex items-center">
                    <item.icon className="w-5 h-5 mr-2" />
                    {item.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

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
            {activeTab === "users-administration" && isSuperAdminMode && <UsersAdministration />}
            {activeTab === "tenant-signup" && <TenantSignup />}
            {activeTab === "clients" && <ClientsDashboard />}
            {activeTab === "email-templates" && <EmailTemplates />}
            {activeTab === "email-logs" && <EmailLogs />}
            {activeTab === "global-emails" && isSuperAdminMode && <GlobalEmails />}
          </div>
        </main>
        <Toaster />
      </div>
    </div>
  )
}

function MealPlanner() {
  const { mealOfferings, getShopSettings, items, addMealOffering, editMealOffering, deleteMealOffering, duplicateMealOffering, assignItem, removeItem, toggleMealOfferingStatus, sortMealItems, currentTenant } = useAdminStore()
  const [openPopovers, setOpenPopovers] = useState<{ [key: string]: boolean }>({})
  const [editingOffering, setEditingOffering] = useState<MealOffering | null>(null)
  const [expandedOfferings, setExpandedOfferings] = useState<number[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [dateFilter, setDateFilter] = useState("")
  const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'published'>('all')
  const [locationFilter, setLocationFilter] = useState<string>('all')
  const shopSettings = getShopSettings(currentTenant?.id)
  const lang = shopSettings.language

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
        tenantId: currentTenant?.id || '',
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
      toast.success(_t('mealOfferingAdded', lang))
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
    offering.tenantId === currentTenant?.id &&
    offering.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (dateFilter ? new Date(offering.startDate) >= new Date(dateFilter) : true) &&
    (statusFilter === 'all' || offering.status === statusFilter) &&
    (locationFilter === 'all' || offering.locationId === locationFilter)
  )

  return (
    <>
      <h2 className="text-3xl font-bold text-gray-800 mb-8">{_t('mealPlanner', lang)}</h2>

      {/* Meal Offering Form */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>{_t('createMealOffering', lang)}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddMealOffering} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="meal-name">{_t('mealName', lang)}</Label>
                <Input id="meal-name" name="meal-name" placeholder={_t('enterMealName', lang)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="start-date">{_t('startDateAndTime', lang)}</Label>
                <Input id="start-date" name="start-date" type="datetime-local" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end-date">{_t('endDateAndTime', lang)}</Label>
                <Input id="end-date" name="end-date" type="datetime-local" required />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">{_t('status', lang)}</Label>
                <Select name="status" defaultValue="draft">
                  <SelectTrigger id="status">
                    <SelectValue placeholder={_t('selectStatus', lang)} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">{_t('draft', lang)}</SelectItem>
                    <SelectItem value="published">{_t('published', lang)}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">{_t('location', lang)}</Label>
                <Select name="location"
                  defaultValue={shopSettings?.primaryLocationId}
                >
                  <SelectTrigger id="location">
                    <SelectValue placeholder={_t('selectLocation', lang)} />
                  </SelectTrigger>
                  <SelectContent>
                    {shopSettings?.locations?.map((location) => (
                      <SelectItem key={location.id} value={location.id}>{location.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button type="submit" className="w-full">
              <Plus className="w-4 h-4 mr-2" /> {_t('addMealOffering', lang)}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Meal Offerings List */}
      <Card>
        <CardHeader>
          <CardTitle>{_t('scheduledMealOfferings', lang)}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex-1">
              <Label htmlFor="search-meals">{_t('searchMeals', lang)}</Label>
              <Input
                id="search-meals"
                placeholder={_t('searchByName', lang)}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex-1">
              <Label htmlFor="date-filter">{_t('filterByDate', lang)}</Label>
              <Input
                id="date-filter"
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              />
            </div>
            <div className="flex-1">
              <Label htmlFor="status-filter">{_t('filterByStatus', lang)}</Label>
              <Select value={statusFilter} onValueChange={(value: 'all' | 'draft' | 'published') => setStatusFilter(value)}>
                <SelectTrigger id="status-filter">
                  <SelectValue placeholder={_t('selectStatus', lang)} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{_t('all', lang)}</SelectItem>
                  <SelectItem value="draft">{_t('draft', lang)}</SelectItem>
                  <SelectItem value="published">{_t('published', lang)}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <Label htmlFor="location-filter">{_t('filterByLocation', lang)}</Label>
              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger id="location-filter">
                  <SelectValue placeholder={_t('selectLocation', lang)} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{_t('allLocations', lang)}</SelectItem>
                  {shopSettings?.locations?.map((location) => (
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
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2">
                      <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-2">
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
                            {expandedOfferings.includes(offering.id) ? _t('collapse', lang) : _t('expand', lang)}
                          </span>
                        </Button>
                        <h3 className="font-bold text-lg">
                          {offering.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {new Date(offering.startDate).toLocaleString()} to {new Date(offering.endDate).toLocaleString()}
                        </p>
                        <Badge variant={offering.status === 'published' ? "default" : "secondary"}>
                          {_t(offering.status, lang)}
                        </Badge>
                        <Badge variant="outline">
                          {shopSettings?.locations?.find(l => l.id === offering.locationId)?.name || _t('unknownLocation', lang)}
                        </Badge>
                      </div>
                      <div className="space-x-2 mt-2 md:mt-0">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            toggleMealOfferingStatus(offering.id)
                            toast.success(_t('mealOfferingStatusChanged', lang).replace('{{status}}', offering.status === 'published' ? _t('draft', lang) : _t('published', lang)))
                          }}
                        >
                          {offering.status === 'published' ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                          {offering.status === 'published' ? _t('unpublish', lang) : _t('publish', lang)}
                        </Button>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Edit className="w-4 h-4 mr-2" /> {_t('edit', lang)}
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>{_t('editMealOffering', lang)}</DialogTitle>
                            </DialogHeader>
                            <EditMealOfferingForm
                              offering={offering}
                              onSave={(updatedOffering) => {
                                editMealOffering(offering.id, updatedOffering)
                                setEditingOffering(null)
                                toast.success(_t('mealOfferingUpdated', lang))
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
                            toast.success(_t('mealOfferingDuplicated', lang))
                          }}
                        >
                          <Copy className="w-4 h-4 mr-2" /> {_t('duplicate', lang)}
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            deleteMealOffering(offering.id)
                            toast.success(_t('mealOfferingDeleted', lang))
                          }}
                        >
                          <Trash2 className="w-4 h-4 mr-2" /> {_t('delete', lang)}
                        </Button>
                      </div>
                    </div>
                    {expandedOfferings.includes(offering.id) && (
                      <div className="mt-4 space-y-4">
                        {categories.map((category) => (
                          <div key={category} className="bg-white p-4 rounded-lg">
                            <h4 className="font-semibold mb-2">{_t(category, lang)}</h4>
                            <ul className="space-y-2 mb-4">
                              {offering.items[category].map((item, index) => (
                                <li key={item.id} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                                  <span>{item.name} - €{item.price?.toFixed(2) ?? 'N/A'} - {_t('tax', lang)}: {item.taxRate}% - {_t('stock', lang)}: {item.stock[offering.locationId] ?? 'N/A'}</span>
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
                                        toast.success(_t('itemRemovedFromCategory', lang).replace('{{item}}', item.name).replace('{{category}}', _t(category, lang)))
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
                                  <Plus className="mr-2 h-4 w-4" /> {_t('addItem', lang).replace('{{category}}', _t(category, lang))}
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-[800px]">
                                <DialogHeader>
                                  <DialogTitle>{_t('addItem', lang).replace('{{category}}', _t(category, lang))}</DialogTitle>
                                </DialogHeader>
                                <DataTable
                                  columns={columns}
                                  data={items.filter(item =>
                                    item.tenantId === currentTenant?.id &&
                                    item.category === category &&
                                    item.stock[offering.locationId] > 0 &&
                                    item.availableLocations.includes(offering.locationId)
                                  )}
                                  onItemSelect={(item) => {
                                    assignItem(offering.id, category, item)
                                    togglePopover(`${offering.id}-${category}`, false)
                                    toast.success(_t('itemAddedToCategory', lang).replace('{{item}}', item.name).replace('{{category}}', _t(category, lang)))
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
              <p className="text-center text-gray-500">{_t('noMealOfferingsFound', lang)}</p>
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
  const { getShopSettings, currentTenant } = useAdminStore()
  const shopSettings = getShopSettings(currentTenant?.id)
  const lang = shopSettings.language

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      name,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      status,
      locationId
    })
    toast.success(_t('mealOfferingUpdated', lang))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="edit-meal-name">{_t('mealName', lang)}</Label>
        <Input
          id="edit-meal-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="edit-start-date">{_t('startDateAndTime', lang)}</Label>
        <Input
          id="edit-start-date"
          type="datetime-local"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="edit-end-date">{_t('endDateAndTime', lang)}</Label>
        <Input
          id="edit-end-date"
          type="datetime-local"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="edit-status">{_t('status', lang)}</Label>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger id="edit-status">
            <SelectValue placeholder={_t('selectStatus', lang)} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="draft">{_t('draft', lang)}</SelectItem>
            <SelectItem value="published">{_t('published', lang)}</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="edit-location">{_t('location', lang)}</Label>
        <Select value={locationId} onValueChange={setLocationId}>
          <SelectTrigger id="edit-location">
            <SelectValue placeholder={_t('selectLocation', lang)} />
          </SelectTrigger>
          <SelectContent>
            {shopSettings?.locations?.map((location) => (
              <SelectItem key={location.id} value={location.id}>{location.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          {_t('cancel', lang)}
        </Button>
        <Button type="submit">{_t('saveChanges', lang)}</Button>
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
  const { getShopSettings, currentTenant } = useAdminStore()
  const shopSettings = getShopSettings(currentTenant?.id)
  const lang = shopSettings.language

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
          placeholder={_t('filterNames', lang)}
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
                          {_t('add', lang)}
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
                  {_t('noResults', lang)}
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
          {_t('previous', lang)}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          {_t('next', lang)}
        </Button>
      </div>
    </div>
  )
}

function ItemManagement() {
  const { items, addItem, updateItem, deleteItem, setItemFeaturedImage, getShopSettings, currentTenant } = useAdminStore()
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
  const shopSettings = getShopSettings(currentTenant)
  const lang = shopSettings.language

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault()
    if (newItemName && newItemCategory && newItemPrice) {
      const newItem: Item = {
        id: Date.now(),
        tenantId: currentTenant?.id || '',
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
      toast.success(_t('itemAdded', lang))
    }
  }

  const handleUpdateItem = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingItem) {
      updateItem(editingItem.id, editingItem)
      setEditingItem(null)
      toast.success(_t('itemUpdated', lang))
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
      toast.success(_t('featuredImageUpdated', lang))
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

  const filteredItems = items.filter(item => item.tenantId === currentTenant?.id)

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-8">{_t('itemManagement', lang)}</h2>
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>{editingItem ? _t('editItem', lang) : _t('addNewItem', lang)}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={editingItem ? handleUpdateItem : handleAddItem} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="item-name">{_t('itemName', lang)}</Label>
                <Input
                  id="item-name"
                  value={editingItem ? editingItem.name : newItemName}
                  onChange={(e) => editingItem ? setEditingItem({ ...editingItem, name: e.target.value }) : setNewItemName(e.target.value)}
                  placeholder={_t('enterItemName', lang)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="item-category">{_t('category', lang)}</Label>
                <Select
                  value={editingItem ? editingItem.category : newItemCategory}
                  onValueChange={(value) => editingItem ? setEditingItem({ ...editingItem, category: value }) : setNewItemCategory(value)}
                  required
                >
                  <SelectTrigger id="item-category">
                    <SelectValue placeholder={_t('selectCategory', lang)} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Entrées">{_t('Entrées', lang)}</SelectItem>
                    <SelectItem value="Plats">{_t('Plats', lang)}</SelectItem>
                    <SelectItem value="Accompagnements">{_t('Accompagnements', lang)}</SelectItem>
                    <SelectItem value="Desserts">{_t('Desserts', lang)}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="item-price">{_t('price', lang)} (€)</Label>
                <Input
                  id="item-price"
                  type="number"
                  step="0.01"
                  value={editingItem ? editingItem.price : newItemPrice}
                  onChange={(e) => editingItem ? setEditingItem({ ...editingItem, price: parseFloat(e.target.value) }) : setNewItemPrice(e.target.value)}
                  placeholder={_t('enterPriceInEuros', lang)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="item-tax-rate">{_t('taxRate', lang)}</Label>
                <Select
                  value={editingItem ? editingItem.taxRate.toString() : newItemTaxRate}
                  onValueChange={(value) => editingItem ? setEditingItem({ ...editingItem, taxRate: parseFloat(value) }) : setNewItemTaxRate(value)}
                  required
                >
                  <SelectTrigger id="item-tax-rate">
                    <SelectValue placeholder={_t('selectTaxRate', lang)} />
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
              <Label>{_t('stockByLocation', lang)}</Label>
              {shopSettings?.locations?.map((location) => (
                <div key={location.id} className="flex items-center space-x-2">
                  <Label htmlFor={`stock-${location.id}`}>{location.name}</Label>
                  <Input
                    id={`stock-${location.id}`}
                    type="number"
                    value={editingItem ? editingItem.stock[location.id] || 0 : newItemStock[location.id] || 0}
                    onChange={(e) => handleStockChange(location.id, e.target.value)}
                    placeholder={_t('enterStockQuantity', lang)}
                  />
                </div>
              ))}
            </div>
            <div className="space-y-2">
              <Label>{_t('availableLocations', lang)}</Label>
              {shopSettings?.locations?.map((location) => (
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
              <Label htmlFor="item-description">{_t('description', lang)}</Label>
              <Textarea
                id="item-description"
                value={editingItem ? editingItem.description : newItemDescription}
                onChange={(e) => editingItem ? setEditingItem({ ...editingItem, description: e.target.value }) : setNewItemDescription(e.target.value)}
                placeholder={_t('enterItemDescription', lang)}
              />
            </div>
            <div className="space-y-2">
              <Label>{_t('attributes', lang)}</Label>
              {(editingItem ? editingItem.attributes : newItemAttributes).map((attr, index) => (
                <div key={index} className="flex space-x-2">
                  <Input
                    placeholder={_t('key', lang)}
                    value={attr.key}
                    onChange={(e) => handleAttributeChange(index, 'key', e.target.value)}
                  />
                  <Input
                    placeholder={_t('value', lang)}
                    value={attr.value}
                    onChange={(e) => handleAttributeChange(index, 'value', e.target.value)}
                  />
                  <Button type="button" variant="outline" onClick={() => removeAttribute(index)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              <Button type="button" variant="outline" onClick={addAttribute}>
                <Plus className="w-4 h-4 mr-2" /> {_t('addAttribute', lang)}
              </Button>
            </div>
            <Button type="submit" className="w-full">
              {editingItem ? _t('updateItem', lang) : _t('addItem', lang)}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{_t('itemList', lang)}</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px]">
            <div className="space-y-4">
              {[_t('Entrées', lang), _t('Plats', lang), _t('Accompagnements', lang), _t('Desserts', lang)].map((category) => (
                <div key={category}>
                  <h3 className="font-semibold mb-2">{category}</h3>
                  <ul className="space-y-2">
                    {filteredItems
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
                              <span className="ml-2 text-sm text-gray-600">{_t('price', lang)}: €{item.price?.toFixed(2) ?? 'N/A'}</span>
                              <span className="ml-2 text-sm text-gray-600">{_t('tax', lang)}: {item.taxRate}%</span>
                              {Object.entries(item.stock).map(([locationId, stockValue]) => (
                                <span key={locationId} className="ml-2 text-sm text-gray-600">
                                  {shopSettings?.locations?.find(l => l.id === locationId)?.name}: {stockValue}
                                </span>
                              ))}
                              <div className="text-sm text-gray-600">
                                {_t('availableAt', lang)}: {item.availableLocations.map(id => shopSettings?.locations?.find(l => l.id === id)?.name).join(', ')}
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
                                toast.success(_t('itemDeleted', lang))
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
  const { mediaItems, addMediaItem, deleteMediaItem, getShopSettings, currentTenant } = useAdminStore()
  const [searchTerm, setSearchTerm] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const shopSettings = getShopSettings(currentTenant?.id)
  const lang = shopSettings.language

  const filteredMediaItems = mediaItems.filter(item =>
    item.tenantId === currentTenant?.id &&
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const newMediaItem: MediaItem = {
          id: Date.now(),
          tenantId: currentTenant?.id || '',
          name: file.name,
          url: reader.result as string,
          type: file.type.startsWith('image/') ? 'image' : 'video',
        }
        addMediaItem(newMediaItem)
        toast.success(_t('mediaItemAdded', lang))
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-800">{_t('mediaGallery', lang)}</h2>
        <Button onClick={() => fileInputRef.current?.click()}>
          <Plus className="w-4 h-4 mr-2" /> {_t('uploadNewFile', lang)}
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
          placeholder={_t('searchMedia', lang)}
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
                  toast.success(_t('mediaItemDeleted', lang))
                }}
              >
                <Trash2 className="w-4 h-4 mr-2" /> {_t('delete', lang)}
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
  const { mediaItems, getShopSettings, currentTenant } = useAdminStore()
  const [searchTerm, setSearchTerm] = useState("")
  const shopSettings = getShopSettings(currentTenant?.id)
  const lang = shopSettings.language

  const filteredMediaItems = mediaItems.filter(item =>
    item.tenantId === currentTenant?.id &&
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    item.type === 'image'
  )

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>{_t('selectImage', lang)}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Search className="w-5 h-5 text-gray-500" />
            <Input
              placeholder={_t('searchImages', lang)}
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
                  <Button variant="secondary" size="sm">{_t('select', lang)}</Button>
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
  const { mealOfferings, addToCart, getCart, removeFromCart, updateCartItemQuantity, getShopSettings, currentUser, addUser, setCurrentUser, currentTenant } = useAdminStore()
  const [selectedOffering, setSelectedOffering] = useState<MealOffering | null>(null)
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
  const shopSettings = getShopSettings(currentTenant?.id)
  // const [selectedLocationId, setSelectedLocationId] = useState(shopSettings.primaryLocationId)
  const [selectedLocationId, setSelectedLocationId] = useState("")
  useEffect(() => {
    setSelectedLocationId(shopSettings.primaryLocationId)
  }, [shopSettings.primaryLocationId])
  const [viewMode, setViewMode] = useState<'card' | 'list'>('card')
  const [searchTerm, setSearchTerm] = useState("")
  const lang = shopSettings.language

  const cart = currentTenant && selectedLocationId ? getCart(currentTenant.id, selectedLocationId) : undefined;

  useEffect(() => {
    const currentDate = new Date()
    const activeOffering = mealOfferings.find(offering =>
      offering.tenantId === currentTenant?.id &&
      offering.status === 'published' &&
      new Date(offering.startDate) <= currentDate &&
      new Date(offering.endDate) >= currentDate &&
      offering.locationId === selectedLocationId
    )
    setSelectedOffering(activeOffering || null)
  }, [mealOfferings, selectedLocationId, currentTenant])

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

  // const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0)

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
        <h2 className="text-3xl font-bold text-gray-800 mb-4">{_t('mealOrdering', lang)}</h2>
        <div className="mb-6">
          <Label htmlFor="location">{_t('selectLocation', lang)}</Label>
          <Select value={selectedLocationId} onValueChange={handleLocationChange}>
            <SelectTrigger id="location">
              <SelectValue placeholder={_t('selectLocation', lang)} />
            </SelectTrigger>
            <SelectContent>
              {shopSettings?.locations?.map((location) => (
                <SelectItem key={location.id} value={location.id}>{location.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="mb-6">
          <Label htmlFor="meal-offering">{_t('selectMealOffering', lang)}</Label>
          <Select
            value={selectedOffering?.id.toString()}
            onValueChange={handleOfferingChange}
          >
            <SelectTrigger id="meal-offering">
              <SelectValue placeholder={_t('selectMealOffering', lang)} />
            </SelectTrigger>
            <SelectContent>
              {mealOfferings
                .filter(offering =>
                  offering.tenantId === currentTenant?.id &&
                  offering.status === 'published' &&
                  offering.locationId === selectedLocationId
                )
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
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
              <div className="flex items-center space-x-2">
                <Button
                  variant={viewMode === 'card' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('card')}
                >
                  <Grid className="w-4 h-4 mr-2" />
                  {_t('cardView', lang)}
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="w-4 h-4 mr-2" />
                  {_t('listView', lang)}
                </Button>
              </div>
              <div className="relative w-full md:w-64">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  type="text"
                  placeholder={_t('searchItems', lang)}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {categories.map((category) => (
              <div key={category}>
                <h3 className="text-xl font-semibold mb-4">{_t(category, lang)}</h3>
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
                              <p className="font-semibold">{_t('price', lang)}: €{item.price.toFixed(2)}</p>
                              <p className="text-sm text-gray-600">{_t('tax', lang)}: {item.taxRate}%</p>
                              <p className="font-semibold">
                                {_t('priceTTC', lang)}: €{(item.price * (1 + item.taxRate / 100)).toFixed(2)}
                              </p>
                              <p className="text-sm text-gray-600">{_t('stock', lang)}: {item.stock[selectedLocationId] || 0}</p>
                            </div>
                          </CardContent>
                          <CardContent className="pt-0">
                            <Button
                              onClick={() => {
                                addToCart(currentTenant, selectedLocationId, item)
                                toast.success(_t('itemAddedToCart', lang).replace('{{item}}', item.name))
                              }}
                              disabled={!item.availableLocations.includes(selectedLocationId) || !item.stock[selectedLocationId] || item.stock[selectedLocationId] <= 0}
                              className="w-full"
                            >
                              {!item.availableLocations.includes(selectedLocationId) ? _t('notAvailable', lang) :
                                item.stock[selectedLocationId] > 0 ? _t('addToCart', lang) : _t('outOfStock', lang)}
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{_t('image', lang)}</TableHead>
                        <TableHead>{_t('name', lang)}</TableHead>
                        <TableHead>{_t('description', lang)}</TableHead>
                        <TableHead>{_t('price', lang)}</TableHead>
                        <TableHead>{_t('stock', lang)}</TableHead>
                        <TableHead>{_t('actions', lang)}</TableHead>
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
                                  addToCart(currentTenant, selectedLocationId, item)
                                  toast.success(_t('itemAddedToCart', lang).replace('{{item}}', item.name))
                                }}
                                disabled={!item.availableLocations.includes(selectedLocationId) || !item.stock[selectedLocationId] || item.stock[selectedLocationId] <= 0}
                                size="sm"
                              >
                                {!item.availableLocations.includes(selectedLocationId) ? _t('notAvailable', lang) :
                                  item.stock[selectedLocationId] > 0 ? _t('addToCart', lang) : _t('outOfStock', lang)}
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
            <CardTitle>{_t('yourCart', lang)}</CardTitle>
          </CardHeader>
          <CardContent>
            {cart?.items.length === 0 ? (
              <p>{_t('cartEmpty', lang)}</p>
            ) : (
              <div className="space-y-4">
                {cart?.items.map(item => (
                  <div key={item.id} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-500">€{item.price.toFixed(2)} x {item.quantity}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        // onClick={() => updateCartItemQuantity(item.id, Math.max(1, item.quantity - 1))}
                        onClick={() => updateCartItemQuantity(currentTenant, selectedLocationId, item.id, Math.max(1, item.quantity - 1))}
                      >
                        -
                      </Button>
                      <span>{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateCartItemQuantity(currentTenant, selectedLocationId, item.id, item.quantity + 1)}
                        disabled={item.quantity >= (item.stock[selectedLocationId] || 0)}
                      >
                        +
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          removeFromCart(currentTenant, selectedLocationId, item.id)
                          toast.success(_t('itemRemovedFromCart', lang).replace('{{item}}', item.name))
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                <div className="border-t pt-4">
                  <p className="font-bold text-lg">{_t('total', lang)}: €{cart?.items.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)}
                  </p>
                </div>
                <Button className="w-full" onClick={() => setIsCheckoutOpen(true)}>
                  {_t('proceedToCheckout', lang)}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      {isCheckoutOpen && (
        <OrderCheckout
          onClose={() => setIsCheckoutOpen(false)}
          selectedLocationId={selectedLocationId}
          currentUser={currentUser}
          addUser={addUser}
          setCurrentUser={setCurrentUser}
        />
      )}
    </div>
  )
}


function OrderCheckout({
  onClose,
  selectedLocationId,
  currentUser,
  addUser,
  setCurrentUser
}: {
  onClose: () => void;
  selectedLocationId: string;
  currentUser: User | null;
  addUser: (user: User) => void;
  setCurrentUser: (user: User | null) => void;
}) {
  const { carts, addOrder, clearCart, getShopSettings, currentTenant } = useAdminStore()
  const [customerName, setCustomerName] = useState(currentUser?.name || "")
  const [customerEmail, setCustomerEmail] = useState(currentUser?.email || "")
  const [customerPhone, setCustomerPhone] = useState("")
  const [deliveryAddress, setDeliveryAddress] = useState("")
  const [showConfetti, setShowConfetti] = useState(false)
  const [orderConfirmed, setOrderConfirmed] = useState(false)
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null)
  const [selectedShippingMethod, setSelectedShippingMethod] = useState<string>("")
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("")
  const [isSignInOpen, setIsSignInOpen] = useState(false)
  const [isRegisterOpen, setIsRegisterOpen] = useState(false)
  const [pickupDate, setPickupDate] = useState<Date | undefined>(undefined)
  const [pickupTime, setPickupTime] = useState<string>("")
  const shopSettings = getShopSettings(currentTenant?.id)
  const lang = shopSettings.language

  // const totalAmount = cart.reduce((total, item) => total + item.price * item.quantity, 0)
  const totalAmount = carts.find(c => c.tenantId === currentTenant?.id && c.locationId === selectedLocationId)?.items.reduce((total, item) => total + item.price * item.quantity, 0) || 0
  const selectedShipping = shopSettings.shippingMethods.find(method => method.id === selectedShippingMethod)
  const totalWithShipping = totalAmount + (selectedShipping?.price || 0)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedShippingMethod || !selectedPaymentMethod) {
      toast.error(_t('selectShippingAndPaymentMethods', lang))
      return
    }
    if (!currentUser) {
      setIsSignInOpen(true)
      return
    }
    const newOrder: Order = {
      id: Date.now(),
      tenantId: currentTenant?.id || '',
      customerName,
      customerEmail,
      customerPhone,
      deliveryAddress,
      // items: cart,
      items: carts.find(c => c.tenantId === currentTenant?.id && c.locationId === selectedLocationId)?.items || [],
      totalAmount: totalWithShipping,
      status: 'pending',
      createdAt: new Date(),
      locationId: selectedLocationId,
      shippingMethodId: selectedShippingMethod,
      paymentMethodId: selectedPaymentMethod,
      orderType: selectedShipping?.type || 'delivery',
      collectTime: selectedShipping?.type === 'click-and-collect' && pickupDate && pickupTime
        ? new Date(`${pickupDate.toDateString()} ${pickupTime}`)
        : undefined,
    }
    addOrder(newOrder)
    // clearCart()
    clearCart(currentTenant?.id || '', selectedLocationId)
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
            <DialogTitle>{_t('orderConfirmation', lang)}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>{_t('thankYouForYourOrder', lang).replace('{{name}}', confirmedOrder.customerName)}</p>
            <p>{_t('orderId', lang)}: {confirmedOrder.id}</p>
            <p>{_t('totalAmount', lang)}: €{confirmedOrder.totalAmount.toFixed(2)}</p>
            <h3 className="font-semibold">{_t('orderDetails', lang)}:</h3>
            <ul className="list-disc pl-5">
              {confirmedOrder.items.map((item) => (
                <li key={item.id}>
                  {item.name} x {item.quantity} - €{(item.price * item.quantity).toFixed(2)}
                </li>
              ))}
            </ul>
            <p>{_t('shippingMethod', lang)}: {shopSettings.shippingMethods.find(m => m.id === confirmedOrder.shippingMethodId)?.name}</p>
            <p>{_t('paymentMethod', lang)}: {shopSettings.paymentMethods.find(m => m.id === confirmedOrder.paymentMethodId)?.name}</p>
            {confirmedOrder.orderType === 'click-and-collect' && confirmedOrder.collectTime && (
              <p>{_t('pickupDateAndTime', lang)}: {confirmedOrder.collectTime.toLocaleString()}</p>
            )}
            <p>{_t('confirmationEmailSent', lang).replace('{{email}}', confirmedOrder.customerEmail)}</p>
            <Button onClick={onClose} className="w-full">{_t('close', lang)}</Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  const format = (date: Date, pattern: string) => {
    return date.toLocaleDateString(lang, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{_t('checkout', lang)}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="customer-name">{_t('name', lang)}</Label>
            <Input
              id="customer-name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="customer-email">{_t('email', lang)}</Label>
            <Input
              id="customer-email"
              type="email"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="customer-phone">{_t('phone', lang)}</Label>
            <Input
              id="customer-phone"
              type="tel"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="delivery-address">{_t('deliveryAddress', lang)}</Label>
            <Textarea
              id="delivery-address"
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">{_t('location', lang)}</Label>
            <Input
              id="location"
              value={shopSettings?.locations?.find(l => l.id === selectedLocationId)?.name || ''}
              disabled
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="shipping-method">{_t('shippingMethod', lang)}</Label>
            <Select value={selectedShippingMethod} onValueChange={setSelectedShippingMethod}>
              <SelectTrigger id="shipping-method">
                <SelectValue placeholder={_t('selectShippingMethod', lang)} />
              </SelectTrigger>
              <SelectContent>
                {shopSettings.shippingMethods
                  .filter(method => method.enabled && method.availableLocations.includes(selectedLocationId))
                  .map((method) => (
                    <SelectItem key={method.id} value={method.id}>
                      {method.name} - €{method.price.toFixed(2)} - {method.type === 'delivery' ? _t('delivery', lang) : _t('clickAndCollect', lang)}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
          {selectedShipping?.type === 'click-and-collect' && (
            <div className="space-y-2">
              <Label htmlFor="pickup-date">{_t('pickupDateAndTime', lang)}</Label>
              <div className="flex space-x-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] justify-start text-left font-normal",
                        !pickupDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {pickupDate ? format(pickupDate, "PPP") : <span>{_t('selectPickupDateAndTime', lang)}</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={pickupDate}
                      onSelect={setPickupDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <Select value={pickupTime} onValueChange={setPickupTime}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder={_t('selectTime', lang)} />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 24 }, (_, i) => i).map((hour) => (
                      <SelectItem key={hour} value={`${hour.toString().padStart(2, '0')}:00`}>
                        {`${hour.toString().padStart(2, '0')}:00`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="payment-method">{_t('paymentMethod', lang)}</Label>
            <Select value={selectedPaymentMethod} onValueChange={setSelectedPaymentMethod}>
              <SelectTrigger id="payment-method">
                <SelectValue placeholder={_t('selectPaymentMethod', lang)} />
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
            <h3 className="font-semibold mb-2">{_t('orderSummary', lang)}</h3>
            {/* {cart.map((item) => ( */}
            {carts.find(c => c.tenantId === currentTenant?.id && c.locationId === selectedLocationId)?.items.map((item) => (
              <div key={item.id} className="flex justify-between items-center mb-2">
                <span>{item.name} x {item.quantity}</span>
                <span>€{(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            {selectedShipping && (
              <div className="flex justify-between items-center mb-2">
                <span>{_t('shipping', lang)}: {selectedShipping.name}</span>
                <span>€{selectedShipping.price.toFixed(2)}</span>
              </div>
            )}
            <div className="font-bold text-lg mt-4">
              {_t('total', lang)}: €{totalWithShipping.toFixed(2)}
            </div>
          </div>
          <Button type="submit" className="w-full">
            {_t('placeOrder', lang)}
          </Button>
        </form>
      </DialogContent>
      {showConfetti && <Confetti />}
      {isSignInOpen && (
        <SignInDialog
          open={isSignInOpen}
          onOpenChange={setIsSignInOpen}
        />
      )}
      {isRegisterOpen && (
        <RegisterDialog
          open={isRegisterOpen}
          onOpenChange={setIsRegisterOpen}
        />
      )}
    </Dialog>
  )
}

function Orders() {
  const { orders, updateOrderStatus, getShopSettings, currentTenant } = useAdminStore()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<Order['status'] | 'all'>('all')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [locationFilter, setLocationFilter] = useState<string>('all')
  const [orderTypeFilter, setOrderTypeFilter] = useState<'all' | 'delivery' | 'click-and-collect'>('all')
  const shopSettings = getShopSettings(currentTenant?.id)
  const lang = shopSettings.language

  const filteredOrders = orders.filter(order =>
    order.tenantId === currentTenant?.id &&
    (order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (statusFilter === 'all' || order.status === statusFilter) &&
    (locationFilter === 'all' || order.locationId === locationFilter) &&
    (orderTypeFilter === 'all' || order.orderType === orderTypeFilter)
  )

  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-bold text-gray-800">{_t('orders', lang)}</h2>
      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
        <div className="flex-1">
          <Input
            placeholder={_t('searchByCustomerNameOrEmail', lang)}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-full md:w-48">
          <Select value={statusFilter} onValueChange={(value: Order['status'] | 'all') => setStatusFilter(value)}>
            <SelectTrigger>
              <SelectValue placeholder={_t('filterByStatus', lang)} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{_t('all', lang)}</SelectItem>
              <SelectItem value="pending">{_t('pending', lang)}</SelectItem>
              <SelectItem value="processing">{_t('processing', lang)}</SelectItem>
              <SelectItem value="completed">{_t('completed', lang)}</SelectItem>
              <SelectItem value="cancelled">{_t('cancelled', lang)}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="w-full md:w-48">
          <Select value={locationFilter} onValueChange={setLocationFilter}>
            <SelectTrigger>
              <SelectValue placeholder={_t('filterByLocation', lang)} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{_t('allLocations', lang)}</SelectItem>
              {shopSettings?.locations?.map((location) => (
                <SelectItem key={location.id} value={location.id}>{location.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="w-full md:w-48">
          <Select value={orderTypeFilter} onValueChange={(value: 'all' | 'delivery' | 'click-and-collect') => setOrderTypeFilter(value)}>
            <SelectTrigger>
              <SelectValue placeholder={_t('filterByOrderType', lang)} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{_t('all', lang)}</SelectItem>
              <SelectItem value="delivery">{_t('delivery', lang)}</SelectItem>
              <SelectItem value="click-and-collect">{_t('clickAndCollect', lang)}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{_t('orderId', lang)}</TableHead>
                <TableHead>{_t('customer', lang)}</TableHead>
                <TableHead>{_t('totalAmount', lang)}</TableHead>
                <TableHead>{_t('status', lang)}</TableHead>
                <TableHead>{_t('date', lang)}</TableHead>
                <TableHead>{_t('location', lang)}</TableHead>
                <TableHead>{_t('type', lang)}</TableHead>
                <TableHead>{_t('collectTime', lang)}</TableHead>
                <TableHead>{_t('actions', lang)}</TableHead>
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
                      {_t(order.status, lang)}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(order.createdAt).toLocaleString()}</TableCell>
                  <TableCell>{shopSettings?.locations?.find(l => l.id === order.locationId)?.name || _t('unknown', lang)}</TableCell>
                  <TableCell>{order.orderType === 'delivery' ? _t('delivery', lang) : _t('clickAndCollect', lang)}</TableCell>
                  <TableCell>{order.collectTime ? new Date(order.collectTime).toLocaleString() : '-'}</TableCell>
                  <TableCell>
                    <Select
                      value={order.status}
                      onValueChange={(value: Order['status']) => {
                        updateOrderStatus(order.id, value)
                        toast.success(_t('orderStatusUpdated', lang).replace('{{status}}', _t(value, lang)))
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={_t('updateStatus', lang)} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">{_t('pending', lang)}</SelectItem>
                        <SelectItem value="processing">{_t('processing', lang)}</SelectItem>
                        <SelectItem value="completed">{_t('completed', lang)}</SelectItem>
                        <SelectItem value="cancelled">{_t('cancelled', lang)}</SelectItem>
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
  const { editOrder, getShopSettings, currentTenant } = useAdminStore()
  const [editMode, setEditMode] = useState(false)
  const [editedOrder, setEditedOrder] = useState(order)
  const shopSettings = getShopSettings(currentTenant?.id || '')
  const lang = shopSettings.language

  const handleSave = () => {
    editOrder(order.id, editedOrder)
    setEditMode(false)
    toast.success(_t('orderUpdated', lang))
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{_t('orderDetails', lang)}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {editMode ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="edit-customer-name">{_t('customerName', lang)}</Label>
                <Input
                  id="edit-customer-name"
                  value={editedOrder.customerName}
                  onChange={(e) => setEditedOrder({ ...editedOrder, customerName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-customer-email">{_t('customerEmail', lang)}</Label>
                <Input
                  id="edit-customer-email"
                  value={editedOrder.customerEmail}
                  onChange={(e) => setEditedOrder({ ...editedOrder, customerEmail: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-customer-phone">{_t('customerPhone', lang)}</Label>
                <Input
                  id="edit-customer-phone"
                  value={editedOrder.customerPhone}
                  onChange={(e) => setEditedOrder({ ...editedOrder, customerPhone: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-delivery-address">{_t('deliveryAddress', lang)}</Label>
                <Textarea
                  id="edit-delivery-address"
                  value={editedOrder.deliveryAddress}
                  onChange={(e) => setEditedOrder({ ...editedOrder, deliveryAddress: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-location">{_t('location', lang)}</Label>
                <Select
                  value={editedOrder.locationId}
                  onValueChange={(value) => setEditedOrder({ ...editedOrder, locationId: value })}
                >
                  <SelectTrigger id="edit-location">
                    <SelectValue placeholder={_t('selectLocation', lang)} />
                  </SelectTrigger>
                  <SelectContent>
                    {shopSettings?.locations?.map((location) => (
                      <SelectItem key={location.id} value={location.id}>{location.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {editedOrder.orderType === 'click-and-collect' && (
                <div className="space-y-2">
                  <Label htmlFor="edit-collect-time">{_t('collectTime', lang)}</Label>
                  <Input
                    id="edit-collect-time"
                    type="datetime-local"
                    value={editedOrder.collectTime ? new Date(editedOrder.collectTime).toISOString().slice(0, 16) : ''}
                    onChange={(e) => setEditedOrder({ ...editedOrder, collectTime: new Date(e.target.value) })}
                  />
                </div>
              )}
            </>
          ) : (
            <>
              <p><strong>{_t('customerName', lang)}:</strong> {order.customerName}</p>
              <p><strong>{_t('customerEmail', lang)}:</strong> {order.customerEmail}</p>
              <p><strong>{_t('customerPhone', lang)}:</strong> {order.customerPhone}</p>
              <p><strong>{_t('deliveryAddress', lang)}:</strong> {order.deliveryAddress}</p>
              <p><strong>{_t('location', lang)}:</strong> {shopSettings?.locations?.find(l => l.id === order.locationId)?.name || _t('unknown', lang)}</p>
              <p><strong>{_t('shippingMethod', lang)}:</strong> {shopSettings.shippingMethods.find(m => m.id === order.shippingMethodId)?.name || _t('unknown', lang)}</p>
              <p><strong>{_t('paymentMethod', lang)}:</strong> {shopSettings.paymentMethods.find(m => m.id === order.paymentMethodId)?.name || _t('unknown', lang)}</p>
              <p><strong>{_t('orderType', lang)}:</strong> {order.orderType === 'delivery' ? _t('delivery', lang) : _t('clickAndCollect', lang)}</p>
              {order.orderType === 'click-and-collect' && order.collectTime && (
                <p><strong>{_t('collectTime', lang)}:</strong> {new Date(order.collectTime).toLocaleString()}</p>
              )}
            </>
          )}
          <div className="border-t pt-4">
            <h3 className="font-semibold mb-2">{_t('orderItems', lang)}</h3>
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between items-center mb-2">
                <span>{item.name} x {item.quantity}</span>
                <span>€{(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="font-bold text-lg mt-4">
              {_t('total', lang)}: €{order.totalAmount.toFixed(2)}
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            {editMode ? (
              <>
                <Button onClick={handleSave}>{_t('saveChanges', lang)}</Button>
                <Button variant="outline" onClick={() => setEditMode(false)}>{_t('cancel', lang)}</Button>
              </>
            ) : (
              <>
                <Button onClick={() => setEditMode(true)}>{_t('editOrder', lang)}</Button>
                <Button onClick={handlePrint}>
                  <Printer className="w-4 h-4 mr-2" /> {_t('printReceipt', lang)}
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
  const { orders, getShopSettings, currentUser, currentTenant } = useAdminStore()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<Order['status'] | 'all'>('all')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const shopSettings = getShopSettings(currentTenant?.id)
  const lang = shopSettings.language

  const filteredOrders = orders.filter(order =>
    order.tenantId === currentTenant?.id &&
    order.customerEmail === currentUser?.email &&
    (order.id.toString().includes(searchTerm) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (statusFilter === 'all' || order.status === statusFilter)
  )

  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-bold text-gray-800">{_t('myOrders', lang)}</h2>
      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
        <div className="flex-1">
          <Input
            placeholder={_t('searchByOrderIdOrName', lang)}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-full md:w-48">
          <Select value={statusFilter} onValueChange={(value: Order['status'] | 'all') => setStatusFilter(value)}>
            <SelectTrigger>
              <SelectValue placeholder={_t('filterByStatus', lang)} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{_t('all', lang)}</SelectItem>
              <SelectItem value="pending">{_t('pending', lang)}</SelectItem>
              <SelectItem value="processing">{_t('processing', lang)}</SelectItem>
              <SelectItem value="completed">{_t('completed', lang)}</SelectItem>
              <SelectItem value="cancelled">{_t('cancelled', lang)}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{_t('orderId', lang)}</TableHead>
                <TableHead>{_t('totalAmount', lang)}</TableHead>
                <TableHead>{_t('status', lang)}</TableHead>
                <TableHead>{_t('date', lang)}</TableHead>
                <TableHead>{_t('location', lang)}</TableHead>
                <TableHead>{_t('actions', lang)}</TableHead>
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
                      {_t(order.status, lang)}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(order.createdAt).toLocaleString()}</TableCell>
                  <TableCell>{shopSettings?.locations?.find(l => l.id === order.locationId)?.name || _t('unknown', lang)}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm" onClick={() => setSelectedOrder(order)}>
                      {_t('viewDetails', lang)}
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
              <DialogTitle>{_t('orderDetails', lang)}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p><strong>{_t('orderId', lang)}:</strong> {selectedOrder.id}</p>
              <p><strong>{_t('date', lang)}:</strong> {new Date(selectedOrder.createdAt).toLocaleString()}</p>
              <p><strong>{_t('status', lang)}:</strong> {_t(selectedOrder.status, lang)}</p>
              <p><strong>{_t('deliveryAddress', lang)}:</strong> {selectedOrder.deliveryAddress}</p>
              <p><strong>{_t('location', lang)}:</strong> {shopSettings?.locations?.find(l => l.id === selectedOrder.locationId)?.name || _t('unknown', lang)}</p>
              <p><strong>{_t('shippingMethod', lang)}:</strong> {shopSettings.shippingMethods.find(m => m.id === selectedOrder.shippingMethodId)?.name || _t('unknown', lang)}</p>
              <p><strong>{_t('paymentMethod', lang)}:</strong> {shopSettings.paymentMethods.find(m => m.id === selectedOrder.paymentMethodId)?.name || _t('unknown', lang)}</p>
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-2">{_t('orderItems', lang)}</h3>
                {selectedOrder.items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center mb-2">
                    <span>{item.name} x {item.quantity}</span>
                    <span>€{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                <div className="font-bold text-lg mt-4">
                  {_t('total', lang)}: €{selectedOrder.totalAmount.toFixed(2)}
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
  const { stockMovements, items, cancelStockMovement, getShopSettings, currentTenant } = useAdminStore()
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState<'all' | 'increase' | 'decrease'>('all')
  const [locationFilter, setLocationFilter] = useState<string>('all')
  const shopSettings = getShopSettings(currentTenant?.id);
  const lang = shopSettings.language

  const filteredMovements = stockMovements.filter(movement =>
    movement.tenantId === currentTenant?.id &&
    (items.find(item => item.id === movement.itemId)?.name.toLowerCase().includes(searchTerm.toLowerCase()) || '') &&
    (typeFilter === 'all' || movement.type === typeFilter) &&
    (locationFilter === 'all' || movement.locationId === locationFilter)
  )

  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-bold text-gray-800">{_t('stockMovements', lang)}</h2>
      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
        <div className="flex-1">
          <Input
            placeholder={_t('searchByItemName', lang)}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-full md:w-48">
          <Select value={typeFilter} onValueChange={(value: 'all' | 'increase' | 'decrease') => setTypeFilter(value)}>
            <SelectTrigger>
              <SelectValue placeholder={_t('filterByType', lang)} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{_t('all', lang)}</SelectItem>
              <SelectItem value="increase">{_t('increase', lang)}</SelectItem>
              <SelectItem value="decrease">{_t('decrease', lang)}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="w-full md:w-48">
          <Select value={locationFilter} onValueChange={setLocationFilter}>
            <SelectTrigger>
              <SelectValue placeholder={_t('filterByLocation', lang)} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{_t('allLocations', lang)}</SelectItem>
              {shopSettings?.locations?.map((location) => (
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
                <TableHead>{_t('date', lang)}</TableHead>
                <TableHead>{_t('item', lang)}</TableHead>
                <TableHead>{_t('quantity', lang)}</TableHead>
                <TableHead>{_t('type', lang)}</TableHead>
                <TableHead>{_t('reason', lang)}</TableHead>
                <TableHead>{_t('location', lang)}</TableHead>
                <TableHead>{_t('actions', lang)}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMovements.map((movement) => {
                const item = items.find(item => item.id === movement.itemId)
                return (
                  <TableRow key={movement.id}>
                    <TableCell>{new Date(movement.date).toLocaleString()}</TableCell>
                    <TableCell>{item?.name || _t('unknownItem', lang)}</TableCell>
                    <TableCell>{movement.quantity}</TableCell>
                    <TableCell>
                      <Badge variant={movement.type === 'increase' ? 'default' : 'destructive'}>
                        {_t(movement.type, lang)}
                      </Badge>
                    </TableCell>
                    <TableCell>{movement.reason}</TableCell>
                    <TableCell>{shopSettings?.locations?.find(l => l.id === movement.locationId)?.name || _t('unknown', lang)}</TableCell>
                    <TableCell>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          cancelStockMovement(movement.id)
                          toast.success(_t('stockMovementCancelled', lang))
                        }}
                      >
                        {_t('cancel', lang)}
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
  const { getShopSettings, addShippingMethod, updateShippingMethod, deleteShippingMethod, currentTenant } = useAdminStore()
  const [editingMethod, setEditingMethod] = useState<ShippingMethod | null>(null)
  const shopSettings = getShopSettings(currentTenant?.id);
  const lang = shopSettings.language

  const handleAddShippingMethod = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const newShippingMethod: ShippingMethod = {
      id: Date.now().toString(),
      type: "click-and-collect",
      tenantId: currentTenant?.id || '',
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      price: parseFloat(formData.get('price') as string),
      estimatedDeliveryDays: parseInt(formData.get('estimatedDeliveryDays') as string),
      enabled: true,
      availableLocations: shopSettings?.locations?.map(location => location.id),
    }
    addShippingMethod(newShippingMethod)
    event.currentTarget.reset()
    toast.success(_t('shippingMethodAdded', lang))
  }

  // Filter shipping methods by tenant
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
      toast.success(_t('shippingMethodUpdated', lang))
    }
  }

  const filteredShippingMethods = shopSettings.shippingMethods.filter(method => method.tenantId === currentTenant?.id)

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-gray-800">{_t('shippingMethodSettings', lang)}</h2>

      <Card>
        <CardHeader>
          <CardTitle>{_t('addNewShippingMethod', lang)}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddShippingMethod} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">{_t('methodName', lang)}</Label>
              <Input id="name" name="name" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">{_t('description', lang)}</Label>
              <Textarea id="description" name="description" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">{_t('price', lang)}</Label>
              <Input id="price" name="price" type="number" step="0.01" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="estimatedDeliveryDays">{_t('estimatedDeliveryDays', lang)}</Label>
              <Input id="estimatedDeliveryDays" name="estimatedDeliveryDays" type="number" required />
            </div>
            <Button type="submit">{_t('addShippingMethod', lang)}</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{_t('existingShippingMethods', lang)}</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredShippingMethods.map((method) => (
            <div key={method.id} className="mb-4 p-4 border rounded">
              <h3 className="font-semibold">{method.name}</h3>
              <p>{method.description}</p>
              <p>{_t('price', lang)}: €{method.price.toFixed(2)}</p>
              <p>{_t('estimatedDelivery', lang)}: {method.estimatedDeliveryDays} {_t('days', lang)}</p>
              <p>{_t('status', lang)}: {method.enabled ? _t('enabled', lang) : _t('disabled', lang)}</p>
              <div className="mt-2">
                <Button variant="outline" size="sm" onClick={() => setEditingMethod(method)}>
                  {_t('edit', lang)}
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  className="ml-2"
                  onClick={() => {
                    deleteShippingMethod(method.id)
                    toast.success(_t('shippingMethodDeleted', lang))
                  }}
                >
                  {_t('delete', lang)}
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
              <DialogTitle>{_t('editShippingMethod', lang)}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleUpdateShippingMethod} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">{_t('methodName', lang)}</Label>
                <Input id="edit-name" name="name" defaultValue={editingMethod.name} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">{_t('description', lang)}</Label>
                <Textarea id="edit-description" name="description" defaultValue={editingMethod.description} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-price">{_t('price', lang)}</Label>
                <Input id="edit-price" name="price" type="number" step="0.01" defaultValue={editingMethod.price} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-estimatedDeliveryDays">{_t('estimatedDeliveryDays', lang)}</Label>
                <Input id="edit-estimatedDeliveryDays" name="estimatedDeliveryDays" type="number" defaultValue={editingMethod.estimatedDeliveryDays} required />
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="edit-enabled" name="enabled" defaultChecked={editingMethod.enabled} />
                <Label htmlFor="edit-enabled">{_t('enabled', lang)}</Label>
              </div>
              <div className="space-y-2">
                <Label>{_t('availableLocations', lang)}</Label>
                {shopSettings?.locations?.map((location) => (
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
              <Button type="submit">{_t('updateShippingMethod', lang)}</Button>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

function PaymentMethodSettings() {
  const { addPaymentMethod, updatePaymentMethod, deletePaymentMethod, getShopSettings, currentTenant } = useAdminStore()
  const [editingMethod, setEditingMethod] = useState<PaymentMethod | null>(null)
  const shopSettings = getShopSettings(currentTenant?.id)
  const lang = shopSettings.language

  const handleAddPaymentMethod = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const newPaymentMethod: PaymentMethod = {
      id: Date.now().toString(),
      tenantId: currentTenant?.id || '',
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      enabled: true,
      availableLocations: shopSettings?.locations?.map(location => location.id),
    }
    addPaymentMethod(newPaymentMethod)
    event.currentTarget.reset()
    toast.success(_t('paymentMethodAdded', lang))
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
      toast.success(_t('paymentMethodUpdated', lang))
    }
  }

  const filteredPaymentMethods = shopSettings.paymentMethods.filter(method => method.tenantId === currentTenant?.id)

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-gray-800">{_t('paymentMethodSettings', lang)}</h2>

      <Card>
        <CardHeader>
          <CardTitle>{_t('addNewPaymentMethod', lang)}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddPaymentMethod} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">{_t('methodName', lang)}</Label>
              <Input id="name" name="name" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">{_t('description', lang)}</Label>
              <Textarea id="description" name="description" required />
            </div>
            <Button type="submit">{_t('addPaymentMethod', lang)}</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{_t('existingPaymentMethods', lang)}</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredPaymentMethods.map((method) => (
            <div key={method.id} className="mb-4 p-4 border rounded">
              <h3 className="font-semibold">{method.name}</h3>
              <p>{method.description}</p>
              <p>{_t('status', lang)}: {method.enabled ? _t('enabled', lang) : _t('disabled', lang)}</p>
              <div className="mt-2">
                <Button variant="outline" size="sm" onClick={() => setEditingMethod(method)}>
                  {_t('edit', lang)}
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  className="ml-2"
                  onClick={() => {
                    deletePaymentMethod(method.id)
                    toast.success(_t('paymentMethodDeleted', lang))
                  }}
                >
                  {_t('delete', lang)}
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
              <DialogTitle>{_t('editPaymentMethod', lang)}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleUpdatePaymentMethod} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">{_t('methodName', lang)}</Label>
                <Input id="edit-name" name="name" defaultValue={editingMethod.name} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">{_t('description', lang)}</Label>
                <Textarea id="edit-description" name="description" defaultValue={editingMethod.description} required />
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="edit-enabled" name="enabled" defaultChecked={editingMethod.enabled} />
                <Label htmlFor="edit-enabled">{_t('enabled', lang)}</Label>
              </div>
              <div className="space-y-2">
                <Label>{_t('availableLocations', lang)}</Label>
                {shopSettings?.locations?.map((location) => (
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
              <Button type="submit">{_t('updatePaymentMethod', lang)}</Button>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

function ShopSettings() {
  const { getShopSettings, updateShopSettings, addLocation, updateLocation, deleteLocation, setPrimaryLocation, currentTenant } = useAdminStore()
  const [editingLocation, setEditingLocation] = useState<Location | null>(null)
  const shopSettings = getShopSettings(currentTenant?.id)
  const lang = shopSettings.language

  const handleShopSettingsChange = (field: keyof ShopSettings, value: string | number) => {
    // updateShopSettings({ [field]: value })
    updateShopSettings(currentTenant?.id, { [field]: value })
  }

  const handleAddLocation = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const newLocation: Location = {
      id: Date.now().toString(),
      tenantId: currentTenant?.id || '',
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
    toast.success(_t('locationAdded', lang))
  }

  // Filter locations by tenant
  const tenantLocations = shopSettings?.locations?.filter(location => location.tenantId === currentTenant?.id) || []

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
      toast.success(_t('locationUpdated', lang))
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
      <h2 className="text-3xl font-bold text-gray-800">{_t('shopSettings', lang)}</h2>

      <Card>
        <CardHeader>
          <CardTitle>{_t('generalSettings', lang)}</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="shopName">{_t('shopName', lang)}</Label>
              <Input
                id="shopName"
                value={shopSettings.shopName}
                onChange={(e) => handleShopSettingsChange('shopName', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="shopDescription">{_t('shopDescription', lang)}</Label>
              <Textarea
                id="shopDescription"
                value={shopSettings.shopDescription}
                onChange={(e) => handleShopSettingsChange('shopDescription', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency">{_t('currency', lang)}</Label>
              <Select
                value={shopSettings.currency}
                onValueChange={(value) => handleShopSettingsChange('currency', value)}
              >
                <SelectTrigger id="currency">
                  <SelectValue placeholder={_t('selectCurrency', lang)} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EUR">Euro (€)</SelectItem>
                  <SelectItem value="USD">US Dollar ($)</SelectItem>
                  <SelectItem value="GBP">British Pound (£)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="taxRate">{_t('taxRate', lang)} (%)</Label>
              <Input
                id="taxRate"
                type="number"
                value={shopSettings.taxRate}
                onChange={(e) => handleShopSettingsChange('taxRate', parseFloat(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="shippingFee">{_t('shippingFee', lang)}</Label>
              <Input
                id="shippingFee"
                type="number"
                value={shopSettings.shippingFee}
                onChange={(e) => handleShopSettingsChange('shippingFee', parseFloat(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="emailAddress">{_t('emailAddress', lang)}</Label>
              <Input
                id="emailAddress"
                type="email"
                value={shopSettings.emailAddress}
                onChange={(e) => handleShopSettingsChange('emailAddress', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">{_t('phoneNumber', lang)}</Label>
              <Input
                id="phoneNumber"
                value={shopSettings.phoneNumber}
                onChange={(e) => handleShopSettingsChange('phoneNumber', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">{_t('address', lang)}</Label>
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
          <CardTitle>{_t('locations', lang)}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {tenantLocations.filter(location => location.id === currentTenant?.id).map((location) => (
              <div key={location.id} className="flex items-center justify-between p-4 bg-gray-100 rounded-lg">
                <div>
                  <h3 className="font-semibold">{location.name}</h3>
                  <p className="text-sm text-gray-600">{location.address}</p>
                </div>
                <div className="space-x-2">
                  {location.id === shopSettings.primaryLocationId ? (
                    <Badge>{_t('primary', lang)}</Badge>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setPrimaryLocation(location.id)
                        toast.success(_t('primaryLocationSet', lang).replace('{{name}}', location.name))
                      }}
                    >
                      {_t('setAsPrimary', lang)}
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingLocation(location)}
                  >
                    {_t('edit', lang)}
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      deleteLocation(location.id)
                      toast.success(_t('locationDeleted', lang).replace('{{name}}', location.name))
                    }}
                  >
                    {_t('delete', lang)}
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <h3 className="font-semibold mb-2">{_t('addNewLocation', lang)}</h3>
            <form onSubmit={handleAddLocation} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="locationName">{_t('locationName', lang)}</Label>
                <Input id="locationName" name="locationName" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="locationAddress">{_t('address', lang)}</Label>
                <Textarea id="locationAddress" name="locationAddress" required />
              </div>
              <Button type="submit">{_t('addLocation', lang)}</Button>
            </form>
          </div>

          {editingLocation && (
            <Dialog open={true} onOpenChange={() => setEditingLocation(null)}>
              <DialogContent className="max-w-4xl">
                <DialogHeader>
                  <DialogTitle>{_t('editLocation', lang)}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleUpdateLocation} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="editLocationName">{_t('locationName', lang)}</Label>
                    <Input
                      id="editLocationName"
                      name="locationName"
                      defaultValue={editingLocation.name}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="editLocationAddress">{_t('address', lang)}</Label>
                    <Textarea
                      id="editLocationAddress"
                      name="locationAddress"
                      defaultValue={editingLocation.address}
                      required
                    />
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-semibold">{_t('openingHours', lang)}</h4>
                    {Object.entries(editingLocation.openingHours).map(([day, { periods }]) => (
                      <div key={day} className="space-y-2">
                        <Label>{_t(day, lang)}</Label>
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
                                {_t('addPeriod', lang)}
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                  <DialogFooter>
                    <Button type="submit">{_t('saveChanges', lang)}</Button>
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
  const { shopSettings } = useAdminStore()
  const lang = shopSettings.language

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
      status: 'active',
      language: registration.shopConfig.language
    })
    toast.success(_t('tenantApprovedAndAdded', lang).replace('{{tenant}}', registration.tenantName))
  }

  const handleReject = (registration: TenantRegistration) => {
    updateTenantRegistration(registration.id, { status: 'rejected' })
    toast.success(_t('tenantRegistrationRejected', lang).replace('{{tenant}}', registration.tenantName))
  }

  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-bold text-gray-800">{_t('tenantRegistrations', lang)}</h2>
      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
        <div className="flex-1">
          <Input
            placeholder={_t('searchByTenantNameOwnerNameOrEmail', lang)}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-full md:w-48">
          <Select value={statusFilter} onValueChange={(value: TenantRegistration['status'] | 'all') => setStatusFilter(value)}>
            <SelectTrigger>
              <SelectValue placeholder={_t('filterByStatus', lang)} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{_t('all', lang)}</SelectItem>
              <SelectItem value="pending">{_t('pending', lang)}</SelectItem>
              <SelectItem value="approved">{_t('approved', lang)}</SelectItem>
              <SelectItem value="rejected">{_t('rejected', lang)}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{_t('tenantName', lang)}</TableHead>
                <TableHead>{_t('ownerName', lang)}</TableHead>
                <TableHead>{_t('email', lang)}</TableHead>
                <TableHead>{_t('phoneNumber', lang)}</TableHead>
                <TableHead>{_t('businessType', lang)}</TableHead>
                <TableHead>{_t('status', lang)}</TableHead>
                <TableHead>{_t('submittedAt', lang)}</TableHead>
                <TableHead>{_t('actions', lang)}</TableHead>
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
                      {_t(registration.status, lang)}
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
                          {_t('approve', lang)}
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleReject(registration)}
                        >
                          {_t('reject', lang)}
                        </Button>
                      </>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        deleteTenantRegistration(registration.id)
                        toast.success(_t('registrationDeleted', lang))
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

function UsersAdministration() {
  const { users, addUser, updateUser, deleteUser, shopSettings, currentTenant } = useAdminStore()
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState<User['role'] | 'all'>('all')
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const lang = shopSettings.language

  const filteredUsers = users.filter(user =>
    user.tenantId === currentTenant?.id &&
    (user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (roleFilter === 'all' || user.role === roleFilter)
  )

  const handleAddUser = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const newUser: User = {
      id: Date.now().toString(),
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      role: formData.get('role') as User['role'],
      tenantId: currentTenant?.id || '',
      preferredLanguage: lang,
    }
    addUser(newUser)
    event.currentTarget.reset()
    toast.success(_t('userAdded', lang))
  }

  const handleUpdateUser = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (editingUser) {
      const formData = new FormData(event.currentTarget)
      const updatedUser: Partial<User> = {
        name: formData.get('name') as string,
        email: formData.get('email') as string,
        role: formData.get('role') as User['role'],
      }
      updateUser(editingUser.id, updatedUser)
      setEditingUser(null)
      toast.success(_t('userUpdated', lang))
    }
  }

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-gray-800">{_t('usersAdministration', lang)}</h2>

      <Card>
        <CardHeader>
          <CardTitle>{_t('addNewUser', lang)}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddUser} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">{_t('name', lang)}</Label>
              <Input id="name" name="name" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">{_t('email', lang)}</Label>
              <Input id="email" name="email" type="email" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">{_t('role', lang)}</Label>
              <Select name="role" defaultValue="Client">
                <SelectTrigger id="role">
                  <SelectValue placeholder={_t('selectRole', lang)} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Admin">{_t('admin', lang)}</SelectItem>
                  <SelectItem value="Shop manager">{_t('shopManager', lang)}</SelectItem>
                  <SelectItem value="Client">{_t('client', lang)}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit">{_t('addUser', lang)}</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{_t('existingUsers', lang)}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mb-4">
            <div className="flex-1">
              <Input
                placeholder={_t('searchByNameOrEmail', lang)}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="w-full md:w-48">
              <Select value={roleFilter} onValueChange={(value: User['role'] | 'all') => setRoleFilter(value)}>
                <SelectTrigger>
                  <SelectValue placeholder={_t('filterByRole', lang)} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{_t('all', lang)}</SelectItem>
                  <SelectItem value="Admin">{_t('admin', lang)}</SelectItem>
                  <SelectItem value="Shop manager">{_t('shopManager', lang)}</SelectItem>
                  <SelectItem value="Client">{_t('client', lang)}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{_t('name', lang)}</TableHead>
                <TableHead>{_t('email', lang)}</TableHead>
                <TableHead>{_t('role', lang)}</TableHead>
                <TableHead>{_t('actions', lang)}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{_t(user.role, lang)}</TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingUser(user)}
                      className="mr-2"
                    >
                      {_t('edit', lang)}
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        deleteUser(user.id)
                        toast.success(_t('userDeleted', lang))
                      }}
                    >
                      {_t('delete', lang)}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {editingUser && (
        <Dialog open={true} onOpenChange={() => setEditingUser(null)}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{_t('editUser', lang)}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleUpdateUser} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">{_t('name', lang)}</Label>
                <Input id="edit-name" name="name" defaultValue={editingUser.name} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-email">{_t('email', lang)}</Label>
                <Input id="edit-email" name="email" type="email" defaultValue={editingUser.email} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-role">{_t('role', lang)}</Label>
                <Select name="role" defaultValue={editingUser.role}>
                  <SelectTrigger id="edit-role">
                    <SelectValue placeholder={_t('selectRole', lang)} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Admin">{_t('admin', lang)}</SelectItem>
                    <SelectItem value="Shop manager">{_t('shopManager', lang)}</SelectItem>
                    <SelectItem value="Client">{_t('client', lang)}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit">{_t('updateUser', lang)}</Button>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

function ClientsDashboard() {
  const { users, shopSettings, currentTenant } = useAdminStore()
  const [searchTerm, setSearchTerm] = useState("")
  const lang = shopSettings.language

  const clients = users.filter(user => user.role === 'Client' && user.tenantId === currentTenant?.id)
  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-gray-800">{_t('clientsDashboard', lang)}</h2>

      <Card>
        <CardHeader>
          <CardTitle>{_t('clientList', lang)}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Input
              placeholder={_t('searchByNameOrEmail', lang)}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{_t('name', lang)}</TableHead>
                <TableHead>{_t('email', lang)}</TableHead>
                <TableHead>{_t('actions', lang)}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClients.map((client) => (
                <TableRow key={client.id}>
                  <TableCell>{client.name}</TableCell>
                  <TableCell>{client.email}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">
                      {_t('viewDetails', lang)}
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