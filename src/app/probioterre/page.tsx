'use client'

import React, { useState, useEffect } from 'react'
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Toaster, toast } from 'sonner'
import { Textarea } from "@/components/ui/textarea"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import {
  StarIcon,
  HomeIcon,
  ShoppingCartIcon,
  MessageSquareIcon,
  UserIcon,
  LeafIcon,
  BookOpenIcon,
  PackageIcon,
  NewspaperIcon,
  HelpCircleIcon,
  PhoneIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  SearchIcon,
  PrinterIcon,
  PlusIcon,
  MinusIcon,
  MapPinIcon,
  CreditCardIcon,
  CopyIcon,
  ThumbsUpIcon,
  ThumbsDownIcon,
  FlagIcon,
  HistoryIcon,
  MessageCircleIcon,
  ChevronRightIcon,
  LogOutIcon,
  MenuIcon,
  XIcon,
  CalendarIcon,
  GridIcon,
  ListIcon,
  FilterIcon,
} from "lucide-react"
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import he from 'he'

interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
  image: string
}

interface CartStore {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (id: number) => void
  updateQuantity: (id: number, quantity: number) => void
  clearCart: () => void
}

const useCartStore = create(
  persist<CartStore>(
    (set) => ({
      items: [],
      addItem: (item) =>
        set((state) => {
          const existingItem = state.items.find((i) => i.id === item.id)
          if (existingItem) {
            return {
              items: state.items.map((i) =>
                i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
              ),
            }
          }
          return { items: [...state.items, item] }
        }),
      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
        })),
      updateQuantity: (id, quantity) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.id === id ? { ...i, quantity } : i
          ),
        })),
      clearCart: () => set({ items: [] }),
    }),
    {
      name: 'cart-storage',
      getStorage: () => localStorage,
    }
  )
)

const categoriesData = [
  { id: 32, name: "Nos Amendements", slug: "nos-amendements-calcaires-naturels", description: "Découvrez ici tous nos amendements calcaires 100% naturels, afin de structurer votre sol et ainsi obtenir une meilleure assimilation des éléments nutritifs !" },
  { id: 31, name: "Nos Engrais", slug: "nos-engrais-naturels", description: "Découvrez ici tous nos engrais 100% Bio et naturels fabriqués en France à partir de matières organiques." },
  { id: 24, name: "ProBioMer", slug: "probiomer-amendement-calcaire-naturel", description: "Grâce à sa formule pH Océan, Probiomer stabilise le pH du sol et anticipe l'apparition de mousse sur le gazon." },
  { id: 30, name: "Probiomus", slug: "probiomus-engrais-fumier-bovin-volaille", description: "Fabriqué à partir de fumier de bovin, de volaille et de cheval, Probiomus est idéal pour le renforcement des sols, les plantations en pleine terre, la préparation des terres de potager et pour la création des gazons." },
  { id: 23, name: "ProBioTerre", slug: "probioterre-engrais-naturel-polyvalent", description: "L'engrais naturel polyvalent ProBioTerre est fabriqué en France à partir de matières organiques." }
]

function Header({ setCurrentPage, setIsLoggedIn }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <header className="bg-[#007A53] text-white shadow">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Button
              variant="ghost"
              className="text-white hover:bg-[#006644] p-2 flex items-center mr-2"
              onClick={() => setCurrentPage('home')}
              aria-label="Accueil Pro Top Terre"
            >
              <Image src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/fleur-pro-bio-terre-0xWPf3ZkYGilZfLPDyssvv6y3WE8qt.png" alt="Pro Top Terre Logo" width={40} height={40} />
              <span className="text-sm font-medium ml-2">Pro Top Terre</span>
            </Button>
            <nav className="hidden md:flex space-x-1">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="text-white hover:bg-[#006644] text-sm px-2">
                    <HistoryIcon className="w-4 h-4 mr-1" />
                    Histoire
                    <ChevronDownIcon className="w-4 h-4 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-[#007A53]">
                  <DropdownMenuItem onSelect={() => setCurrentPage('qui-sommes-nous')} className="text-white hover:bg-[#006644]">
                    Qui sommes nous ?
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setCurrentPage('nos-solutions-de-conditionnements')} className="text-white hover:bg-[#006644]">
                    Nos solutions de conditionnements
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setCurrentPage('nos-valeurs')} className="text-white hover:bg-[#006644]">
                    Nos valeurs
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setCurrentPage('nos-clients')} className="text-white hover:bg-[#006644]">
                    Nos clients
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="text-white hover:bg-[#006644] text-sm px-2">
                    <PackageIcon className="w-4 h-4 mr-1" />
                    Nos produits
                    <ChevronDownIcon className="w-4 h-4 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-[#007A53]">
                  {categoriesData.map((category) => (
                    <DropdownMenuItem key={category.id} onSelect={() => setCurrentPage(`products-${category.slug}`)} className="text-white hover:bg-[#006644]">
                      {category.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <Button variant="ghost" className="text-white hover:bg-[#006644] text-sm px-2" onClick={() => setCurrentPage('actualites')}>
                <NewspaperIcon className="w-4 h-4 mr-1" />
                Actualités
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="text-white hover:bg-[#006644] text-sm px-2">
                    <BookOpenIcon className="w-4 h-4 mr-1" />
                    Conseils
                    <ChevronDownIcon className="w-4 h-4 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-[#007A53]">
                  <DropdownMenuItem onSelect={() => setCurrentPage('conseils-espaces-verts')} className="text-white hover:bg-[#006644]">
                    Espaces verts
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setCurrentPage('conseils-agriculture')} className="text-white hover:bg-[#006644]">
                    Agriculture
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button variant="ghost" className="text-white hover:bg-[#006644] text-sm px-2" onClick={() => setCurrentPage('contact')}>
                <PhoneIcon className="w-4 h-4 mr-1" />
                Contact
              </Button>
              <Button variant="ghost" className="text-white hover:bg-[#006644] text-sm px-2" onClick={() => setCurrentPage('faq')}>
                <HelpCircleIcon className="w-4 h-4 mr-1" />
                FAQ
              </Button>
            </nav>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="ghost" className="text-white hover:bg-[#006644] text-sm px-2" onClick={() => setCurrentPage('passer-commande')}>
              <ShoppingCartIcon className="w-4 h-4 mr-1" />
              Passer commande
            </Button>
            <Button variant="ghost" className="text-white hover:bg-[#006644] text-sm px-2" onClick={() => setCurrentPage('mon-compte')}>
              Mon compte
            </Button>
            <Button variant="ghost" className="text-white hover:bg-[#006644] p-2" onClick={() => setIsLoggedIn(false)} aria-label="Déconnexion">
              <LogOutIcon className="w-5 h-5" />
            </Button>
            <Button variant="ghost" className="md:hidden text-white hover:bg-[#006644] p-2" onClick={toggleMenu} aria-label="Menu">
              <MenuIcon className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden bg-[#007A53] py-2">
          <nav className="flex flex-col space-y-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-white hover:bg-[#006644] text-sm px-2 w-full text-left">
                  <HistoryIcon className="w-4 h-4 mr-1" />
                  Histoire
                  <ChevronDownIcon className="w-4 h-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-[#007A53]">
                <DropdownMenuItem onSelect={() => { setCurrentPage('qui-sommes-nous'); setIsMenuOpen(false); }} className="text-white hover:bg-[#006644]">
                  Qui sommes nous ?
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => { setCurrentPage('nos-solutions-de-conditionnements'); setIsMenuOpen(false); }} className="text-white hover:bg-[#006644]">
                  Nos solutions de conditionnements
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => { setCurrentPage('nos-valeurs'); setIsMenuOpen(false); }} className="text-white hover:bg-[#006644]">
                  Nos valeurs
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => { setCurrentPage('nos-clients'); setIsMenuOpen(false); }} className="text-white hover:bg-[#006644]">
                  Nos clients
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-white hover:bg-[#006644] text-sm px-2 w-full text-left">
                  <PackageIcon className="w-4 h-4 mr-1" />
                  Nos produits
                  <ChevronDownIcon className="w-4 h-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-[#007A53]">
                {categoriesData.map((category) => (
                  <DropdownMenuItem key={category.id} onSelect={() => { setCurrentPage(`products-${category.slug}`); setIsMenuOpen(false); }} className="text-white hover:bg-[#006644]">
                    {category.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="ghost" className="text-white hover:bg-[#006644] text-sm px-2 w-full text-left" onClick={() => { setCurrentPage('actualites'); setIsMenuOpen(false); }}>
              <NewspaperIcon className="w-4 h-4 mr-1" />
              Actualités
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-white hover:bg-[#006644] text-sm px-2 w-full text-left">
                  <BookOpenIcon className="w-4 h-4 mr-1" />
                  Conseils
                  <ChevronDownIcon className="w-4 h-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-[#007A53]">
                <DropdownMenuItem onSelect={() => { setCurrentPage('conseils-espaces-verts'); setIsMenuOpen(false); }} className="text-white hover:bg-[#006644]">
                  Espaces verts
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => { setCurrentPage('conseils-agriculture'); setIsMenuOpen(false); }} className="text-white hover:bg-[#006644]">
                  Agriculture
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="ghost" className="text-white hover:bg-[#006644] text-sm px-2 w-full text-left" onClick={() => { setCurrentPage('contact'); setIsMenuOpen(false); }}>
              <PhoneIcon className="w-4 h-4 mr-1" />
              Contact
            </Button>
            <Button variant="ghost" className="text-white hover:bg-[#006644] text-sm px-2 w-full text-left" onClick={() => { setCurrentPage('faq'); setIsMenuOpen(false); }}>
              <HelpCircleIcon className="w-4 h-4 mr-1" />
              FAQ
            </Button>
          </nav>
        </div>
      )}
    </header>
  )
}

const useRotatingImage = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const images = [
    "https://images.unsplash.com/photo-1486754735734-325b5831c3ad?q=80&w=1920&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1529313780224-1a12b68bed16?q=80&w=2048&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=4032&auto=format&fit=crop"
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return images[currentImageIndex]
}

function LoginPage({ onLogin }) {
  const [isSignupOpen, setIsSignupOpen] = useState(false)
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false)
  const [email, setEmail] = useState('test@example.com')
  const [password, setPassword] = useState('1234')
  const backgroundImage = useRotatingImage()

  const handleSignupSubmit = (e) => {
    e.preventDefault()
    setIsSignupOpen(false)
    setIsConfirmationOpen(true)
  }

  const handleLogin = (e) => {
    e.preventDefault()
    if (email && password) {
      onLogin()
    } else {
      toast.error('Veuillez remplir tous les champs.')
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-cover bg-center transition-all duration-1000 ease-in-out" style={{backgroundImage: `url('${backgroundImage}')`}}>
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <Image src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/fleur-pro-bio-terre-0xWPf3ZkYGilZfLPDyssvv6y3WE8qt.png" alt="Pro Top Terre Logo" width={40} height={40} />
        <span className="text-xl font-bold text-white ml-2">Pro Top Terre</span>
      </header>
      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-sm space-y-4 p-6 bg-white bg-opacity-90">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold text-[#007A53]">Connexion</h1>
            <p className="text-gray-600">Entrez vos identifiants pour accéder au portail</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                placeholder="Email" 
                required 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input 
                id="password" 
                placeholder="Mot de passe" 
                required 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full bg-[#007A53] hover:bg-[#006644]">Se connecter</Button>
          </form>
          <div className="text-center">
            <Dialog open={isSignupOpen} onOpenChange={setIsSignupOpen}>
              <DialogTrigger asChild>
                <Button variant="link" className="text-[#007A53] hover:text-[#006644]">
                  Demander l'accès
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Demande d'accès</DialogTitle>
                  <DialogDescription>
                    Remplissez ce formulaire pour demander l'accès à Pro Top Terre.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSignupSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Nom</Label>
                    <Input id="signup-name" placeholder="Votre nom" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input id="signup-email" placeholder="Votre email" required type="email" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-company">Entreprise</Label>
                    <Input id="signup-company" placeholder="Nom de votre entreprise" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-type">Type de compte</Label>
                    <Select required>
                      <SelectTrigger id="signup-type">
                        <SelectValue placeholder="Sélectionnez un type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="company">Entreprise</SelectItem>
                        <SelectItem value="consumer">Particulier</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button type="submit" className="w-full bg-[#007A53] hover:bg-[#006644]">
                    Envoyer la demande
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
            <Dialog open={isConfirmationOpen} onOpenChange={setIsConfirmationOpen}>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Demande envoyée</DialogTitle>
                  <DialogDescription>
                    Merci pour votre demande d'accès. Nous vous contacterons bientôt. Veuillez vérifier votre email dans les prochains jours.
                  </DialogDescription>
                </DialogHeader>
                <Button onClick={() => setIsConfirmationOpen(false)} className="w-full bg-[#007A53] hover:bg-[#006644]">
                  Fermer
                </Button>
              </DialogContent>
            </Dialog>
          </div>
        </Card>
      </main>
    </div>
  )
}

function WelcomePage({ setCurrentPage }) {
  return (
    <div className="space-y-6">
      <div className="relative h-[400px] bg-cover bg-center" style={{backgroundImage: "url('https://source.unsplash.com/random/1600x900?agriculture,farm')"}}>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/fleur-pro-bio-terre-0xWPf3ZkYGilZfLPDyssvv6y3WE8qt.png"
            alt="Pro Top Terre Logo"
            width={300}
            height={100}
            className="z-10"
          />
        </div>
      </div>
      <h1 className="text-3xl font-bold text-[#007A53] text-center">Découvrez nos produits pour chacun de vos besoins :</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Button
          className="h-32 bg-[#8CC63F] hover:bg-[#7AB62F] text-white flex flex-col items-center justify-center"
          onClick={() => setCurrentPage('maraicher')}
        >
          <Image src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/poivron-pro-bio-terre-JxptJpAPhkFABKnyfGA19g94WNAS4L.png" alt="Maraîcher" width={50} height={50} />
          <span className="mt-2">Maraîcher</span>
        </Button>
        <Button
          className="h-32 bg-[#8CC63F] hover:bg-[#7AB62F] text-white flex flex-col items-center justify-center"
          onClick={() => setCurrentPage('arboriculteur')}
        >
          <Image src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/branche-pro-bio-terre-Ce6CRXNpQy0HnqnsLL2BmUUZFmFhie.png" alt="Arboriculteur" width={50} height={50} />
          <span className="mt-2">Arboriculteur</span>
        </Button>
        <Button
          className="h-32 bg-[#8CC63F] hover:bg-[#7AB62F] text-white flex flex-col items-center justify-center"
          onClick={() => setCurrentPage('viticulteur')}
        >
          <Image src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/branche-pro-bio-terre-Ce6CRXNpQy0HnqnsLL2BmUUZFmFhie.png" alt="Viticulteur" width={50} height={50} />
          <span className="mt-2">Viticulteur</span>
        </Button>
        <Button
          className="h-32 bg-[#8CC63F] hover:bg-[#7AB62F] text-white flex flex-col items-center justify-center"
          onClick={() => setCurrentPage('paysagiste')}
        >
          <Image src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/fleur-pro-bio-terre-0xWPf3ZkYGilZfLPDyssvv6y3WE8qt.png" alt="Paysagiste" width={50} height={50} />
          <span className="mt-2">Paysagiste</span>
        </Button>
      </div>
      <SaisonnaliteDesCultures />
    </div>
  )
}

function SaisonnaliteDesCultures() {
  const [crops, setCrops] = useState<Crop[]>(cropsData)
  const [filter, setFilter] = useState({ type: '', season: '', region: '' })
  const [searchTerm, setSearchTerm] = useState('')
  const [view, setView] = useState<'card' | 'list'>('card')
  const [selectedCrop, setSelectedCrop] = useState<Crop | null>(null)

  useEffect(() => {
    const filteredCrops = cropsData.filter(crop => 
      crop.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filter.type === '' || crop.type === filter.type) &&
      (filter.season === '' || crop.season === filter.season) &&
      (filter.region === '' || crop.region === filter.region)
    )
    setCrops(filteredCrops)
  }, [searchTerm, filter])

  const uniqueTypes = Array.from(new Set(cropsData.map(crop => crop.type)))
  const uniqueSeasons = Array.from(new Set(cropsData.map(crop => crop.season)))
  const uniqueRegions = Array.from(new Set(cropsData.map(crop => crop.region)))

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-[#007A53]">Saisonnalité des cultures</h2>
      
      <div className="flex flex-wrap gap-4 items-center">
        <Input
          placeholder="Rechercher une culture..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-xs"
        />
        <Select onValueChange={(value) => setFilter({ ...filter, type: value })}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Type de culture" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Tous les types</SelectItem>
            {uniqueTypes.map(type => (
              <SelectItem key={type} value={type}>{type}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select onValueChange={(value) => setFilter({ ...filter, season: value })}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Saison" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Toutes les saisons</SelectItem>
            {uniqueSeasons.map(season => (
              <SelectItem key={season} value={season}>{season}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select onValueChange={(value) => setFilter({ ...filter, region: value })}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Région" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Toutes les régions</SelectItem>
            {uniqueRegions.map(region => (
              <SelectItem key={region} value={region}>{region}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button variant="outline" onClick={() => setView('card')} className={view === 'card' ? 'bg-[#007A53] text-white' : ''}>
          <GridIcon className="w-4 h-4 mr-2" />
          Cartes
        </Button>
        <Button variant="outline" onClick={() => setView('list')} className={view === 'list' ? 'bg-[#007A53] text-white' : ''}>
          <ListIcon className="w-4 h-4 mr-2" />
          Liste
        </Button>
      </div>

      {view === 'card' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {crops.map((crop) => (
            <Card key={crop.id} className="overflow-hidden">
              <CardHeader className="p-0">
                <Image src={crop.image} alt={crop.name} width={400} height={300} className="w-full h-48 object-cover" />
              </CardHeader>
              <CardContent className="p-4">
                <CardTitle>{crop.name}</CardTitle>
                <p className="text-sm text-gray-500">{crop.type} - {crop.season}</p>
                <p className="text-sm text-gray-500">{crop.region}</p>
              </CardContent>
              <CardFooter>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full" onClick={() => setSelectedCrop(crop)}>Voir détails</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{selectedCrop?.name}</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4">
                      <Image src={selectedCrop?.image || ''} alt={selectedCrop?.name || ''} width={400} height={300} className="w-full h-48 object-cover rounded-lg" />
                      <p><strong>Type:</strong> {selectedCrop?.type}</p>
                      <p><strong>Saison:</strong> {selectedCrop?.season}</p>
                      <p><strong>Région:</strong> {selectedCrop?.region}</p>
                      <p>{selectedCrop?.description}</p>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Saison</TableHead>
              <TableHead>Région</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {crops.map((crop) => (
              <TableRow key={crop.id}>
                <TableCell>{crop.name}</TableCell>
                <TableCell>{crop.type}</TableCell>
                <TableCell>{crop.season}</TableCell>
                <TableCell>{crop.region}</TableCell>
                <TableCell>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" onClick={() => setSelectedCrop(crop)}>Voir détails</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{selectedCrop?.name}</DialogTitle>
                      </DialogHeader>
                      <div className="grid gap-4">
                        <Image src={selectedCrop?.image || ''} alt={selectedCrop?.name || ''} width={400} height={300} className="w-full h-48 object-cover rounded-lg" />
                        <p><strong>Type:</strong> {selectedCrop?.type}</p>
                        <p><strong>Saison:</strong> {selectedCrop?.season}</p>
                        <p><strong>Région:</strong> {selectedCrop?.region}</p>
                        <p>{selectedCrop?.description}</p>
                      </div>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  )
}

type Crop = {
  id: number
  name: string
  type: string
  season: string
  region: string
  image: string
  description: string
}

const cropsData: Crop[] = [
  { id: 1, name: "Blé", type: "Céréales", season: "Été", region: "Beauce", image: "https://source.unsplash.com/random/400x300?wheat", description: "Le blé est une céréale majeure cultivée en France, principalement dans la région de la Beauce." },
  { id: 2, name: "Melon", type: "Fruits", season: "Été", region: "Provence", image: "https://source.unsplash.com/random/400x300?melon", description: "Le melon est un fruit d'été populaire, cultivé principalement dans le sud de la France." },
  { id: 3, name: "Citron", type: "Fruits", season: "Hiver", region: "Côte d'Azur", image: "https://source.unsplash.com/random/400x300?lemon", description: "Le citron est un agrume cultivé principalement sur la Côte d'Azur, disponible en hiver." },
  { id: 4, name: "Fraises", type: "Fruits", season: "Printemps", region: "Val de Loire", image: "https://source.unsplash.com/random/400x300?strawberry", description: "Les fraises sont des fruits de printemps, cultivés notamment dans la région du Val de Loire." },
  { id: 5, name: "Tomates", type: "Légumes", season: "Été", region: "Provence", image: "https://source.unsplash.com/random/400x300?tomato", description: "Les tomates sont des légumes d'été très populaires, cultivés dans diverses régions, notamment en Provence." },
  { id: 6, name: "Pommes", type: "Fruits", season: "Automne", region: "Normandie", image: "https://source.unsplash.com/random/400x300?apple", description: "Les pommes sont des fruits d'automne, avec une production importante en Normandie." },
  { id: 7, name: "Carottes", type: "Légumes", season: "Toute l'année", region: "Bretagne", image: "https://source.unsplash.com/random/400x300?carrot", description: "Les carottes sont cultivées toute l'année, avec une production notable en Bretagne." },
  { id: 8, name: "Lavande", type: "Plantes", season: "Été", region: "Provence", image: "https://source.unsplash.com/random/400x300?lavender", description: "La lavande est une plante emblématique de la Provence, fleurissant en été." }
]

function OrderConfirmationDialog({ isOpen, onClose, onConfirm, userInfo, cart }) {
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Confirmer la demande</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Nom
            </Label>
            <Input id="name" value={userInfo.name} className="col-span-3" readOnly />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input id="email" value={userInfo.email} className="col-span-3" readOnly />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="address" className="text-right">
              Adresse
            </Label>
            <Textarea id="address" value={userInfo.address} className="col-span-3" readOnly />
          </div>
          <div className="border-t pt-4">
            <h3 className="font-semibold mb-2">Récapitulatif de la commande</h3>
            {cart.map((item) => (
              <div key={item.id} className="flex justify-between items-center mb-2">
                <span>{item.name}</span>
                <span>{item.quantity} x {item.price}€</span>
              </div>
            ))}
            <div className="border-t pt-2 mt-2">
              <div className="flex justify-between items-center font-semibold">
                <span>Total</span>
                <span>{totalPrice.toFixed(2)}€</span>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Annuler</Button>
          <Button onClick={onConfirm} className="bg-[#007A53] hover:bg-[#006644]">Confirmer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function PasserCommande() {
  const [productsData, setProductsData] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false)
  const [userInfo, setUserInfo] = useState({ name: 'John Doe', email: 'john@example.com', address: '123 Main St, City, Country' })
  const [isLoading, setIsLoading] = useState(true)

  const { items: cart, addItem, removeItem, updateQuantity, clearCart } = useCartStore()

  useEffect(() => {
    setIsLoading(true)
    fetch('https://www.regalterre.com/wp-json/wc/store/products')
      .then(response => response.json())
      .then(data => {
        setProductsData(data)
        setIsLoading(false)
      })
      .catch(error => {
        console.error('Error fetching products:', error)
        setIsLoading(false)
      })
  }, [])

  const addToCart = (product) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.prices.price,
      quantity: 1,
      image: product.images[0].src
    })
  }

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const filteredProducts = productsData.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.short_description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleConfirmOrder = () => {
    setIsConfirmationOpen(false)
    toast.success('Votre demande a été confirmée. Nous vous contacterons bientôt.')
    clearCart()
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="w-full lg:w-3/4">
        <h1 className="text-3xl font-bold text-[#007A53] mb-6">Passer commande / Nouveau devis</h1>
        <div className="mb-4">
          <div className="relative">
            <Input
              type="text"
              placeholder="Rechercher des produits..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#007A53]"></div>
          </div>
        ) : (
          categoriesData.map((category) => {
            const categoryProducts = filteredProducts.filter(product =>
              product.categories.some(cat => cat.id === category.id)
            )

            if (categoryProducts.length === 0) return null

            return (
              <div key={category.id} className="mb-8">
                <h2 className="text-2xl font-semibold text-[#007A53] mb-4">{category.name}</h2>
                <Card className="overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[100px]">Image</TableHead>
                        <TableHead>Produit</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead className="text-right">Prix</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {categoryProducts.map((product) => (
                        <TableRow key={product.id}>
                          <TableCell>
                            <Image
                              src={product.images[0].src}
                              alt={product.name}
                              width={64}
                              height={64}
                              className="object-cover rounded"
                            />
                          </TableCell>
                          <TableCell className="font-medium">{he.decode(product.name)}</TableCell>
                          <TableCell>
                            <div dangerouslySetInnerHTML={{ __html: product.short_description }} className="line-clamp-2" />
                          </TableCell>
                          <TableCell className="text-right">
                            {product.prices.price}€
                          </TableCell>
                          <TableCell className="text-right">
                            <Button onClick={() => addToCart(product)} size="sm" className="bg-[#8CC63F] hover:bg-[#7AB62F]">
                              <PlusIcon className="w-4 h-4 mr-2" />
                              Ajouter
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Card>
              </div>
            )
          })
        )}
      </div>
      <div className="w-full lg:w-1/4">
        <Card className="p-4">
          <CardHeader>
            <CardTitle>Panier</CardTitle>
          </CardHeader>
          <CardContent className="max-h-96 overflow-y-auto">
            {cart.length === 0 ? (
              <p>Votre panier est vide</p>
            ) : (
              <>
                {cart.map(item => (
                  <div key={item.id} className="flex justify-between items-center mb-4">
                    <div className="flex items-center">
                      <Image src={item.image} alt={item.name} width={50} height={50} className="mr-2 rounded" />
                      <div>
                        <p className="font-medium">{he.decode(item.name)}</p>
                        <p className="text-sm text-gray-500">{item.price}€</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="flex items-center">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <MinusIcon className="w-4 h-4" />
                        </Button>
                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                          className="w-16 mx-2 text-center"
                          min="1"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <PlusIcon className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}
          </CardContent>
          {cart.length > 0 && (
            <CardFooter className="flex flex-col items-stretch">
              <div className="flex justify-between items-center mb-4">
                <span className="font-bold">Total:</span>
                <span className="font-bold">{totalPrice.toFixed(2)}€</span>
              </div>
              <Button className="w-full bg-[#007A53] hover:bg-[#006644]" onClick={() => setIsConfirmationOpen(true)}>
                Valider la demande
              </Button>
            </CardFooter>
          )}
        </Card>
      </div>
      <OrderConfirmationDialog
        isOpen={isConfirmationOpen}
        onClose={() => setIsConfirmationOpen(false)}
        onConfirm={handleConfirmOrder}
        userInfo={userInfo}
        cart={cart}
      />
    </div>
  )
}

function NosProduits({ category }) {
  const categoryData = categoriesData.find(cat => cat.slug === category)
  const [products, setProducts] = useState([])
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(true)
    fetch(`https://www.regalterre.com/wp-json/wc/store/products?category=${categoryData.id}`)
      .then(response => response.json())
      .then(data => {
        setProducts(data)
        setIsLoading(false)
      })
      .catch(error => {
        console.error('Error fetching products:', error)
        setIsLoading(false)
      })
  }, [category, categoryData.id])

  const handleProductClick = (product) => {
    setSelectedProduct(product)
  }

  const handleCloseProductDetail = () => {
    setSelectedProduct(null)
  }

  const { addItem } = useCartStore()

  const addToCart = (product) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.prices.price,
      quantity: 1,
      image: product.images[0].src
    })
    toast.success(`${he.decode(product.name)} ajouté au panier`)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 text-sm text-gray-500">
        <Button variant="link" className="p-0" onClick={handleCloseProductDetail}>
          Accueil
        </Button>
        <ChevronRightIcon className="w-4 h-4" />
        <span>{categoryData.name}</span>
        {selectedProduct && (
          <>
            <ChevronRightIcon className="w-4 h-4" />
            <span>{he.decode(selectedProduct.name)}</span>
          </>
        )}
      </div>
      <h1 className="text-3xl font-bold text-[#007A53]">{categoryData.name}</h1>
      <p className="text-lg text-gray-600 mb-6">{categoryData.description}</p>
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#007A53]"></div>
        </div>
      ) : selectedProduct ? (
        <ProductDetail product={selectedProduct} onClose={handleCloseProductDetail} onAddToCart={addToCart} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="flex flex-col h-full cursor-pointer" onClick={() => handleProductClick(product)}>
              <CardHeader>
                <Image
                  src={product.images[0].src}
                  alt={product.name}
                  width={300}
                  height={200}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
              </CardHeader>
              <CardContent className="flex-grow">
                <h2 className="text-xl font-semibold mb-2 text-[#007A53]">{he.decode(product.name)}</h2>
                <div className="text-gray-600 mb-4" dangerouslySetInnerHTML={{ __html: product.short_description }} />
              </CardContent>
              <CardFooter className="flex justify-between items-center mt-auto">
                <span className="text-lg font-bold text-[#007A53]">{product.prices.price}€</span>
                <Button className="bg-[#8CC63F] hover:bg-[#7AB62F]">Voir détails</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

function ProductDetail({ product, onClose, onAddToCart }) {
  const [selectedImage, setSelectedImage] = useState(product.images[0])
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)

  const handleImageClick = (image) => {
    setSelectedImage(image)
    setIsLightboxOpen(true)
  }

  return (
    <div className="space-y-6">
      <Button variant="outline" onClick={onClose} className="mb-4">
        <ChevronLeftIcon className="w-4 h-4 mr-2" />
        Retour aux produits
      </Button>
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <Image
            src={selectedImage.src}
            alt={product.name}
            width={600}
            height={400}
            className="w-full h-auto object-cover rounded-lg cursor-pointer"
            onClick={() => setIsLightboxOpen(true)}
          />
          <div className="grid grid-cols-4 gap-2 mt-4">
            {product.images.map((image) => (
              <Image
                key={image.id}
                src={image.src}
                alt={product.name}
                width={150}
                height={150}
                className={`w-full h-auto object-cover rounded-lg cursor-pointer ${
                  selectedImage.id === image.id ? 'border-2 border-[#007A53]' : ''
                }`}
                onClick={() => handleImageClick(image)}
              />
            ))}
          </div>
        </div>
        <div>
          <h1 className="text-3xl font-bold text-[#007A53] mb-4">{he.decode(product.name)}</h1>
          <div className="text-xl font-semibold text-[#007A53] mb-4">{product.prices.price}€</div>
          <div className="prose max-w-none mb-6" dangerouslySetInnerHTML={{ __html: product.description }} />
          <Button className="w-full bg-[#8CC63F] hover:bg-[#7AB62F]" onClick={() => onAddToCart(product)}>Ajouter au panier</Button>
        </div>
      </div>
      {isLightboxOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={() => setIsLightboxOpen(false)}>
          <div className="max-w-4xl max-h-full p-4">
            <Image
              src={selectedImage.src}
              alt={product.name}
              width={1200}
              height={800}
              className="w-full h-auto object-contain"
            />
          </div>
        </div>
      )}
    </div>
  )
}

function ConseilsUtilisation({ category }) {
  const conseils = {
    'espaces-verts': [
      "Effectuez une analyse de sol avant d'appliquer des engrais pour déterminer les besoins spécifiques de votre terrain.",
      "Arrosez abondamment après l'application d'engrais pour favoriser l'absorption par les plantes.",
      "Pour les gazons, utilisez un épandeur pour assurer une distribution uniforme des produits.",
      "Évitez d'appliquer des engrais par temps très chaud ou en plein soleil pour prévenir les brûlures.",
    ],
    'agriculture': [
      "Respectez les doses recommandées pour chaque culture afin d'optimiser les rendements et minimiser l'impact environnemental.",
      "Pratiquez la rotation des cultures pour maintenir la santé du sol et réduire la dépendance aux engrais.",
      "Utilisez des techniques de précision pour appliquer les produits, comme la pulvérisation guidée par GPS.",
      "Intégrez des cultures de couverture dans votre rotation pour améliorer naturellement la fertilité du sol.",
    ],
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-[#007A53]">
        Conseils d'utilisation - {category === 'espaces-verts' ? "Espaces verts" : "Agriculture"}
      </h1>
      <Card className="p-6 border-[#8CC63F]">
        <ul className="list-disc list-inside space-y-2">
          {conseils[category].map((conseil, index) => (
            <li key={index} className="text-gray-600">{conseil}</li>
          ))}
        </ul>
      </Card>
    </div>
  )
}

function Actualites({ subpage }) {
  const actualites = {
    'calendrier-cultures': [
      { id: 1, title: "Semis de printemps", date: "Mars -  Avril", content: "Préparez vos sols et commencez les semis de cultures printanières." },
      { id: 2, title: "Fertilisation estivale", date: "Juin - Juillet", content: "Appliquez nos engrais pour booster la croissance pendant la période chaude." },
      { id: 3, title: "Récolte d'automne", date: "Septembre - Octobre", content: "Préparez-vous pour les récoltes et planifiez la fertilisation post-récolte." },
    ],
    'evenements': [
      { id: 1, title: "Salon de l'Agriculture", date: "25-28 Février", content: "Retrouvez-nous au Salon de l'Agriculture pour découvrir nos dernières innovations." },
      { id: 2, title: "Journée portes ouvertes", date: "15 Mai", content: "Visitez nos installations et participez à des ateliers sur l'agriculture durable." },
      { id: 3, title: "Webinaire : Optimisation des cultures", date: "10 Juillet", content: "Participez à notre webinaire en ligne sur les techniques d'optimisation des cultures." },
    ],
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-[#007A53]">
        {subpage === 'calendrier-cultures' ? "Calendrier des cultures" : "Événements à venir"}
      </h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {actualites[subpage].map((item) => (
          <Card key={item.id} className="p-6 border-[#8CC63F]">
            <h2 className="text-xl font-semibold mb-2 text-[#007A53]">{item.title}</h2>
            <p className="text-sm text-gray-500 mb-2">{item.date}</p>
            <p className="text-gray-600">{item.content}</p>
          </Card>
        ))}
      </div>
    </div>
  )
}

function MonCompte() {
  const [orders, setOrders] = useState([
    { id: 'CMD-001', date: '01/05/2023', amount: 250.00, status: 'Livrée' },
    { id: 'CMD-002', date: '15/05/2023', amount: 180.00, status: 'En cours' },
  ])

  const handleRenewOrder = (orderId) => {
    toast.success(`Commande ${orderId} renouvelée avec succès.`)
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-[#007A53]">Mon compte</h1>
      <Tabs defaultValue="informations">
        <TabsList>
          <TabsTrigger value="informations">Informations personnelles</TabsTrigger>
          <TabsTrigger value="commandes">Historique des commandes</TabsTrigger>
          <TabsTrigger value="preferences">Préférences</TabsTrigger>
          <TabsTrigger value="paiement">Information de paiement</TabsTrigger>
        </TabsList>
        <TabsContent value="informations">
          <Card>
            <CardHeader>
              <CardTitle>Informations personnelles</CardTitle>
              <CardDescription>Gérez vos informations personnelles et de contact.</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="prenom">Prénom</Label>
                    <Input id="prenom" placeholder="Votre prénom" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nom">Nom</Label>
                    <Input id="nom" placeholder="Votre nom" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="Votre email" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telephone">Téléphone</Label>
                  <Input id="telephone" type="tel" placeholder="Votre numéro de téléphone" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="adresse">Adresse</Label>
                  <Textarea id="adresse" placeholder="Votre adresse complète" />
                </div>
                <Button type="submit" className="bg-[#007A53] hover:bg-[#006644]">Enregistrer les modifications</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="commandes">
          <Card>
            <CardHeader>
              <CardTitle>Historique des commandes</CardTitle>
              <CardDescription>Consultez vos commandes passées et leur statut.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Numéro de commande</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Montant</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>{order.id}</TableCell>
                      <TableCell>{order.date}</TableCell>
                      <TableCell>{order.amount.toFixed(2)} €</TableCell>
                      <TableCell>{order.status}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <PrinterIcon className="w-4 h-4 mr-2" />
                            Facture
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleRenewOrder(order.id)}>
                            <CopyIcon className="w-4 h-4 mr-2" />
                            Renouveler
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="preferences">
          <Card>
            <CardHeader>
              <CardTitle>Préférences</CardTitle>
              <CardDescription>Personnalisez vos préférences de compte et de communication.</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="langue">Langue préférée</Label>
                  <Select>
                    <SelectTrigger id="langue">
                      <SelectValue placeholder="Sélectionnez une langue" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Préférences de communication</Label>
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="newsletter" className="rounded border-gray-300 text-[#007A53] shadow-sm focus:border-[#007A53] focus:ring focus:ring-[#007A53] focus:ring-opacity-50" />
                      <Label htmlFor="newsletter">Recevoir la newsletter</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="offres" className="rounded border-gray-300 text-[#007A53] shadow-sm focus:border-[#007A53] focus:ring focus:ring-[#007A53] focus:ring-opacity-50" />
                      <Label htmlFor="offres">Recevoir les offres promotionnelles</Label>
                    </div>
                  </div>
                </div>
                <Button type="submit" className="bg-[#007A53] hover:bg-[#006644]">Enregistrer les préférences</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="paiement">
          <Card>
            <CardHeader>
              <CardTitle>Information de paiement</CardTitle>
              <CardDescription>Gérez vos méthodes de paiement et vos conditions de paiement.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Méthode de paiement actuelle</h3>
                  <div className="flex items-center space-x-2">
                    <CreditCardIcon className="w-6 h-6 text-[#007A53]" />
                    <span>Carte de crédit se terminant par 1234</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Conditions de paiement</h3>
                  <p>Paiement à 30 jours</p>
                </div>
                <Button className="bg-[#007A53] hover:bg-[#006644]">
                  Modifier les informations de paiement
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function Contact() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-[#007A53]">Contactez-nous</h1>
      <Card className="p-6 border-[#8CC63F]">
        <form className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nom</Label>
            <Input id="name" placeholder="Votre nom" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="Votre email" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="subject">Sujet</Label>
            <Input id="subject" placeholder="Sujet de votre message" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea id="message" placeholder="Votre message" required />
          </div>
          <Button type="submit" className="bg-[#007A53] hover:bg-[#006644]">Envoyer</Button>
        </form>
      </Card>
      <Card className="p-6 border-[#8CC63F]">
        <h2 className="text-xl font-semibold mb-4 text-[#007A53]">Nos coordonnées</h2>
        <div className="space-y-2">
          <p><strong>Adresse :</strong> 123 Rue de la Terre, 75000 Paris</p>
          <p><strong>Téléphone :</strong> +33 1 23 45 67 89</p>
          <p><strong>Email :</strong> contact@protopterre.com</p>
        </div>
      </Card>
    </div>
  )
}

function FoireAuxQuestions() {
  const [faqData, setFaqData] = useState([
    {
      id: 1,
      question: "Quels sont les avantages des engrais naturels ?",
      answers: [
        {
          id: 1,
          content: "Les engrais naturels offrent plusieurs avantages : ils améliorent la structure du sol, favorisent la vie microbienne, libèrent les nutriments progressivement, et sont plus respectueux de l'environnement.",
          author: "Expert ProTopTerre",
          votes: 15,
          responses: []
        },
        {
          id: 2,
          content: "En plus de ce qui a été mentionné, les engrais naturels contribuent également à la rétention d'eau dans le sol et réduisent le risque de brûlure des plantes.",
          author: "AgricoExpert",
          votes: 8,
          responses: []
        }
      ]
    },
    {
      id: 2,
      question: "Comment appliquer correctement les engrais Pro Top Terre ?",
      answers: [
        {
          id: 1,
          content: "Pour une application optimale, suivez les instructions sur l'emballage. En général, il est recommandé d'épandre l'engrais uniformément sur le sol, puis de l'incorporer légèrement et d'arroser abondamment.",
          author: "Expert ProTopTerre",
          votes: 12,
          responses: [
            {
              id: 1,
              content: "Est-ce que cela s'applique aussi aux plantes en pot ?",
              author: "JardinierDébutant",
              votes: 3
            },
            {
              id: 2,
              content: "Pour les plantes en pot, vous pouvez mélanger l'engrais au terr eau lors du rempotage ou l'appliquer en surface et arroser ensuite.",
              author: "Expert ProTopTerre",
              votes: 5
            }
          ]
        }
      ]
    },
    {
      id: 3,
      question: "Quelle est la fréquence d'application recommandée ?",
      answers: [
        {
          id: 1,
          content: "La fréquence d'application dépend du type de plante et de la saison. En général, pour les pelouses, on recommande 3-4 applications par an. Pour les plantes en pot, une application tous les 2-3 mois pendant la saison de croissance est suffisante.",
          author: "Expert ProTopTerre",
          votes: 10,
          responses: []
        }
      ]
    },
    {
      id: 4,
      question: "Les produits Pro Top Terre sont-ils utilisables en agriculture biologique ?",
      answers: [
        {
          id: 1,
          content: "Oui, nos produits sont utilisables en Agriculture Biologique, conformément au règlement UE N°2018/848 du 1er Janvier 2022.",
          author: "Expert ProTopTerre",
          votes: 18,
          responses: []
        }
      ]
    },
    {
      id: 5,
      question: "Comment choisir le bon produit pour mon jardin ?",
      answers: [
        {
          id: 1,
          content: "Le choix du produit dépend de vos besoins spécifiques. Nos amendements calcaires sont idéaux pour corriger le pH du sol, tandis que nos engrais apportent les nutriments nécessaires à la croissance des plantes. N'hésitez pas à nous contacter pour des conseils personnalisés.",
          author: "Expert ProTopTerre",
          votes: 14,
          responses: []
        }
      ]
    }
  ])

  const [newQuestion, setNewQuestion] = useState('')
  const [expandedQuestions, setExpandedQuestions] = useState({})

  const handleVote = (questionId, answerId, increment) => {
    setFaqData(faqData.map(question => 
      question.id === questionId
        ? {
            ...question,
            answers: question.answers.map(answer =>
              answer.id === answerId
                ? { ...answer, votes: answer.votes + (increment ? 1 : -1) }
                : answer
            )
          }
        : question
    ))
  }

  const handleResponseVote = (questionId, answerId, responseId, increment) => {
    setFaqData(faqData.map(question => 
      question.id === questionId
        ? {
            ...question,
            answers: question.answers.map(answer =>
              answer.id === answerId
                ? {
                    ...answer,
                    responses: answer.responses.map(response =>
                      response.id === responseId
                        ? { ...response, votes: response.votes + (increment ? 1 : -1) }
                        : response
                    )
                  }
                : answer
            )
          }
        : question
    ))
  }

  const handleReport = (id) => {
    toast.success(`La question a été signalée. Merci pour votre contribution.`)
  }

  const handleSubmitQuestion = (e) => {
    e.preventDefault()
    if (newQuestion.trim()) {
      const newId = Math.max(...faqData.map(item => item.id)) + 1
      setFaqData([...faqData, { id: newId, question: newQuestion, answers: [] }])
      setNewQuestion('')
      toast.success('Votre question a été soumise avec succès.')
    }
  }

  const handleSubmitResponse = (questionId, answerId, response) => {
    setFaqData(faqData.map(question => 
      question.id === questionId
        ? {
            ...question,
            answers: question.answers.map(answer =>
              answer.id === answerId
                ? {
                    ...answer,
                    responses: [
                      ...answer.responses,
                      {
                        id: answer.responses.length + 1,
                        content: response,
                        author: "Utilisateur",
                        votes: 0
                      }
                    ]
                  }
                : answer
            )
          }
        : question
    ))
  }

  const toggleExpand = (questionId) => {
    setExpandedQuestions(prev => ({
      ...prev,
      [questionId]: !prev[questionId]
    }))
  }

  return (
    <div className="w-full max-w-3xl mx-auto space-y-8">
      <h2 className="text-2xl font-bold mb-6 text-[#007A53]">Foire aux Questions</h2>
      
      <Card className="p-6 border-[#8CC63F]">
        <h3 className="text-xl font-semibold mb-4 text-[#007A53]">Poser une nouvelle question</h3>
        <form onSubmit={handleSubmitQuestion} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="new-question">Votre question</Label>
            <Textarea 
              id="new-question" 
              placeholder="Entrez votre question ici" 
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              required 
            />
          </div>
          <Button type="submit" className="bg-[#007A53] hover:bg-[#006644]">Soumettre la question</Button>
        </form>
      </Card>

      <div className="space-y-6">
        {faqData.map((faq) => (
          <Card key={faq.id} className="p-6 border-[#8CC63F]">
            <h3 className="text-xl font-semibold mb-4 text-[#007A53]">{faq.question}</h3>
            {faq.answers.length > 0 && (
              <div className="mb-4">
                <div className="bg-gray-100 p-4 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="mb-2">{faq.answers[0].content}</p>
                      <p className="text-sm text-gray-600">Par {faq.answers[0].author}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleVote(faq.id, faq.answers[0].id, true)}>
                        <ThumbsUpIcon className="w-4 h-4 mr-1" />
                        {faq.answers[0].votes}
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleVote(faq.id, faq.answers[0].id, false)}>
                        <ThumbsDownIcon className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  {faq.answers[0].responses.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {faq.answers[0].responses.map((response) => (
                        <div key={response.id} className="bg-white p-2 rounded-lg">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="text-sm">{response.content}</p>
                              <p className="text-xs text-gray-600">Par {response.author}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button variant="ghost" size="sm" onClick={() => handleResponseVote(faq.id, faq.answers[0].id, response.id, true)}>
                                <ThumbsUpIcon className="w-3 h-3 mr-1" />
                                {response.votes}
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => handleResponseVote(faq.id, faq.answers[0].id, response.id, false)}>
                                <ThumbsDownIcon className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
            {faq.answers.length > 1 && (
              <div>
                <Button variant="link" onClick={() => toggleExpand(faq.id)} className="text-[#007A53]">
                  {expandedQuestions[faq.id] ? "Masquer les autres réponses" : "Voir plus de réponses"}
                  <ChevronRightIcon className="w-4 h-4 ml-1" />
                </Button>
                {expandedQuestions[faq.id] && (
                  <div className="mt-4 space-y-4">
                    {faq.answers.slice(1).map((answer) => (
                      <div key={answer.id} className="bg-gray-100 p-4 rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="mb-2">{answer.content}</p>
                            <p className="text-sm text-gray-600">Par {answer.author}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button variant="outline" size="sm" onClick={() => handleVote(faq.id, answer.id, true)}>
                              <ThumbsUpIcon className="w-4 h-4 mr-1" />
                              {answer.votes}
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleVote(faq.id, answer.id, false)}>
                              <ThumbsDownIcon className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        {answer.responses.length > 0 && (
                          <div className="mt-4 space-y-2">
                            {answer.responses.map((response) => (
                              <div key={response.id} className="bg-white p-2 rounded-lg">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <p className="text-sm">{response.content}</p>
                                    <p className="text-xs text-gray-600">Par {response.author}</p>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Button variant="ghost" size="sm" onClick={() => handleResponseVote(faq.id, answer.id, response.id, true)}>
                                      <ThumbsUpIcon className="w-3 h-3 mr-1" />
                                      {response.votes}
                                    </Button>
                                    <Button variant="ghost" size="sm" onClick={() => handleResponseVote(faq.id, answer.id, response.id, false)}>
                                      <ThumbsDownIcon className="w-3 h-3" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            <div className="mt-4">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <MessageCircleIcon className="w-4 h-4 mr-2" />
                    Répondre
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Répondre à la question</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={(e) => {
                    e.preventDefault()
                    const response = e.target.response.value
                    if (response.trim()) {
                      handleSubmitResponse(faq.id, faq.answers[0].id, response)
                      e.target.reset()
                    }
                  }} className="space-y-4">
                    <Textarea id="response" placeholder="Votre réponse" required />
                    <Button type="submit">Envoyer la réponse</Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

function QuiSommesNous() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-[#007A53]">Qui sommes-nous ?</h1>
      <Card className="p-6 border-[#8CC63F]">
        <CardContent>
          <p className="mb-4">Pro Top Terre est une entreprise leader dans le domaine des engrais et amendements naturels pour l'agriculture et les espaces verts. Fondée en 1990, notre mission est de fournir des solutions durables et respectueuses de l'environnement pour améliorer la qualité des sols et la croissance des plantes.</p>
          <p className="mb-4">Avec plus de 30 ans d'expérience, nous avons développé une gamme de produits innovants qui répondent aux besoins spécifiques des agriculteurs, des paysagistes et des jardiniers amateurs. Notre engagement envers la qualité et la durabilité nous a permis de devenir un acteur majeur sur le marché français et européen.</p>
          <p>Chez Pro Top Terre, nous croyons en l'importance de l'agriculture biologique et nous travaillons constamment à l'amélioration de nos produits pour répondre aux normes les plus strictes en matière d'agriculture durable.</p>
        </CardContent>
      </Card>
    </div>
  )
}

function NosSolutionsDeConditionnements() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-[#007A53]">Nos solutions de conditionnements</h1>
      <Card className="p-6 border-[#8CC63F]">
        <CardContent>
          <p className="mb-4">Chez Pro Top Terre, nous comprenons que chaque client a des besoins différents en termes de quantité et de stockage. C'est pourquoi nous proposons une variété de solutions de conditionnement pour nos produits :</p>
          <ul className="list-disc list-inside space-y-2 mb-4">
            <li>Sacs de 25 kg : Idéal pour les petites surfaces et les jardiniers amateurs</li>
            <li>Big bags de 500 kg et 1000 kg : Parfait pour les grandes exploitations agricoles</li>
            <li>Vrac : Pour les livraisons en grande quantité, directement sur votre exploitation</li>
            <li>Conditionnements spéciaux : Sur demande, pour répondre à vos besoins spécifiques</li>
          </ul>
          <p>Tous nos emballages sont conçus pour préserver la qualité de nos produits et faciliter leur utilisation. Nous utilisons des matériaux recyclables dans la mesure du possible, dans le cadre de notre engagement pour l'environnement.</p>
        </CardContent>
      </Card>
    </div>
  )
}

function NosValeurs() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-[#007A53]">Nos valeurs</h1>
      <Card className="p-6 border-[#8CC63F]">
        <CardContent>
          <p className="mb-4">Chez Pro Top Terre, nos valeurs sont au cœur de tout ce que nous faisons. Elles guident nos décisions, nos actions et nos relations avec nos clients, nos partenaires et notre environnement :</p>
          <ul className="list-disc list-inside space-y-2 mb-4">
            <li><strong>Durabilité :</strong> Nous nous engageons à développer des produits qui respectent l'environnement et contribuent à une agriculture durable.</li>
            <li><strong>Innovation :</strong> Nous investissons continuellement dans la recherche et le développement pour offrir des solutions toujours plus performantes et écologiques.</li>
            <li><strong>Qualité :</strong> Nous maintenons les plus hauts standards de qualité dans tous nos produits et services.</li>
            <li><strong>Intégrité :</strong> Nous agissons avec honnêteté et transparence dans toutes nos relations d'affaires.</li>
            <li><strong>Service client :</strong> Nous nous efforçons de fournir un service exceptionnel et un support personnalisé à tous nos clients.</li>
          </ul>
          <p>Ces valeurs ne sont pas seulement des mots pour nous. Elles sont intégrées dans chaque aspect de notre entreprise, de la production à la livraison, en passant par le service client.</p>
        </CardContent>
      </Card>
    </div>
  )
}

function NosClients() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-[#007A53]">Nos clients</h1>
      <Card className="p-6 border-[#8CC63F]">
        <CardContent>
          <p className="mb-4">Chez Pro Top Terre, nous sommes fiers de servir une clientèle diversifiée, allant des petits jardiniers amateurs aux grandes exploitations agricoles. Nos clients incluent :</p>
          <ul className="list-disc list-inside space-y-2 mb-4">
            <li><strong>Agriculteurs :</strong> Des exploitations de toutes tailles, spécialisées dans diverses cultures.</li>
            <li><strong>Paysagistes :</strong> Des professionnels qui créent et entretiennent des espaces verts publics et privés.</li>
            <li><strong>Collectivités locales :</strong> Pour l'entretien des espaces verts municipaux, parcs et jardins publics.</li>
            <li><strong>Jardineries :</strong> Qui distribuent nos produits aux jardiniers amateurs.</li>
            <li><strong>Particuliers :</strong> Des passionnés de jardinage qui cherchent des solutions naturelles pour leurs plantes.</li>
          </ul>
          <p className="mb-4">Nous sommes reconnaissants de la confiance que nos clients nous accordent et nous nous efforçons constamment d'améliorer nos produits et services pour répondre à leurs besoins changeants.</p>
          <p>Découvrez ci-dessous quelques témoignages de nos clients satisfaits :</p>
          <div className="mt-4 space-y-4">
            <Card className="p-4 bg-green-50">
              <p className="italic">"Les produits Pro Top Terre ont considérablement amélioré la qualité de nos sols. Nos rendements n'ont jamais été aussi bons !"</p>
              <p className="text-right">- Jean D., agriculteur biologique</p>
            </Card>
            <Card className="p-4 bg-green-50">
              <p className="italic">"En tant que paysagiste, je ne jure que par Pro Top Terre. Leurs engrais naturels donnent des résultats exceptionnels sur tous types de plantes."</p>
              <p className="text-right">- Marie L., paysagiste</p>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function FloatingCart() {
  const [isOpen, setIsOpen] = useState(false)
  const { items, removeItem, updateQuantity, clearCart } = useCartStore()

  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const handleConfirmOrder = () => {
    toast.success('Votre commande a été confirmée. Nous vous contacterons bientôt.')
    clearCart()
    setIsOpen(false)
  }

  if (items.length === 0) {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Button
        className="bg-[#8CC63F] hover:bg-[#7AB62F] text-white p-2 rounded-full shadow-lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        <ShoppingCartIcon className="w-6 h-6" />
        <span className="ml-2">{items.length}</span>
      </Button>
      {isOpen && (
        <Card className="absolute bottom-16 right-0 w-80 max-h-96 overflow-hidden">
          <CardHeader>
            <CardTitle>Votre panier</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)} className="absolute top-2 right-2">
              <XIcon className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent className="max-h-64 overflow-y-auto">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                  <Image src={item.image} alt={item.name} width={50} height={50} className="mr-2 rounded" />
                  <div>
                    <p className="font-medium">{he.decode(item.name)}</p>
                    <p className="text-sm text-gray-500">{item.price}€</p>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <div className="flex items-center">
                    <Button 
                      variant="outline"
                      size="sm"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      <MinusIcon className="w-4 h-4" />
                    </Button>
                    <Input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                      className="w-12 mx-1 text-center"
                      min="1"
                    />
                    <Button 
                      variant="outline"
                      size="sm"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      <PlusIcon className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
          <CardFooter className="flex flex-col items-stretch">
            <div className="flex justify-between items-center mb-4">
              <span className="font-bold">Total:</span>
              <span className="font-bold">{totalPrice.toFixed(2)}€</span>
            </div>
            <Button className="w-full bg-[#007A53] hover:bg-[#006644]" onClick={handleConfirmOrder}>
              Confirmer la commande
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}

function Maraicher({ setCurrentPage }) {
  const [products, setProducts] = useState([])
  const [blogEntries, setBlogEntries] = useState([])

  useEffect(() => {
    // Fetch products (this is a mock, replace with actual API call)
    setProducts([
      { id: 1, name: "Engrais Bio Maraîcher", price: 29.99, image: "https://source.unsplash.com/random/200x200?vegetable,fertilizer" },
      { id: 2, name: "Compost Spécial Légumes", price: 19.99, image: "https://source.unsplash.com/random/200x200?compost" },
      { id: 3, name: "Paillage Naturel", price: 14.99, image: "https://source.unsplash.com/random/200x200?mulch" },
    ])

    // Fetch blog entries (this is a mock, replace with actual API call)
    setBlogEntries([
      { id: 1, title: "Optimiser la rotation des cultures maraîchères", date: "2023-05-15" },
      { id: 2, title: "Les bienfaits de l'agriculture biologique pour le maraîchage", date: "2023-06-02" },
      { id: 3, title: "Gestion de l'eau en maraîchage : techniques innovantes", date: "2023-06-20" },
    ])
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 text-sm text-gray-500">
        <Button variant="link" className="p-0" onClick={() => setCurrentPage('home')}>
          Accueil
        </Button>
        <ChevronRightIcon className="w-4 h-4" />
        <span>Maraîcher</span>
      </div>

      <Button variant="outline" onClick={() => setCurrentPage('home')} className="mb-4">
        <ChevronLeftIcon className="w-4 h-4 mr-2" />
        Retour à l'accueil
      </Button>

      <div className="relative h-[300px] bg-cover bg-center" style={{backgroundImage: "url('https://source.unsplash.com/random/1600x900?vegetable,farm')"}}>
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <h1 className="text-4xl font-bold text-white text-center">Solutions pour Maraîchers</h1>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-[#007A53] mt-8">Nos produits pour maraîchers</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <Card key={product.id}>
            <CardHeader>
              <Image src={product.image} alt={product.name} width={200} height={200} className="w-full h-48 object-cover" />
            </CardHeader>
            <CardContent>
              <h3 className="text-lg font-semibold">{product.name}</h3>
              <p className="text-[#007A53] font-bold">{product.price} €</p>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-[#8CC63F] hover:bg-[#7AB62F]">Ajouter au panier</Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <h2 className="text-2xl font-bold text-[#007A53] mt-8">Articles de blog pour maraîchers</h2>
      <ul className="space-y-2">
        {blogEntries.map((entry) => (
          <li key={entry.id}>
            <a href="#" className="text-[#007A53] hover:underline">
              {entry.title} - {new Date(entry.date).toLocaleDateString()}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

function Arboriculteur({ setCurrentPage }) {
  const [products, setProducts] = useState([])
  const [blogEntries, setBlogEntries] = useState([])

  useEffect(() => {
    // Fetch products (this is a mock, replace with actual API call)
    setProducts([
      { id: 1, name: "Engrais Bio Arbres Fruitiers", price: 34.99, image: "https://source.unsplash.com/random/200x200?fruit,tree,fertilizer" },
      { id: 2, name: "Traitement Naturel Anti-Parasites", price: 24.99, image: "https://source.unsplash.com/random/200x200?organic,pesticide" },
      { id: 3, name: "Paillage pour Vergers", price: 19.99, image: "https://source.unsplash.com/random/200x200?orchard,mulch" },
    ])

    // Fetch blog entries (this is a mock, replace with actual API call)
    setBlogEntries([
      { id: 1, title: "La taille des arbres fruitiers : guide complet", date: "2023-05-10" },
      { id: 2, title: "Lutte biologique contre les ravageurs en arboriculture", date: "2023-06-05" },
      { id: 3, title: "Optimiser la pollinisation dans les vergers", date: "2023-06-25" },
    ])
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 text-sm text-gray-500">
        <Button variant="link" className="p-0" onClick={() => setCurrentPage('home')}>
          Accueil
        </Button>
        <ChevronRightIcon className="w-4 h-4" />
        <span>Arboriculteur</span>
      </div>

      <Button variant="outline" onClick={() => setCurrentPage('home')} className="mb-4">
        <ChevronLeftIcon className="w-4 h-4 mr-2" />
        Retour à l'accueil
      </Button>

      <div className="relative h-[300px] bg-cover bg-center" style={{backgroundImage: "url('https://source.unsplash.com/random/1600x900?orchard,fruit,trees')"}}>
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <h1 className="text-4xl font-bold text-white text-center">Solutions pour Arboriculteurs</h1>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-[#007A53] mt-8">Nos produits pour arboriculteurs</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <Card key={product.id}>
            <CardHeader>
              <Image src={product.image} alt={product.name} width={200} height={200} className="w-full h-48 object-cover" />
            </CardHeader>
            <CardContent>
              <h3 className="text-lg font-semibold">{product.name}</h3>
              <p className="text-[#007A53] font-bold">{product.price} €</p>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-[#8CC63F] hover:bg-[#7AB62F]">Ajo uter au panier</Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <h2 className="text-2xl font-bold text-[#007A53] mt-8">Articles de blog pour arboriculteurs</h2>
      <ul className="space-y-2">
        {blogEntries.map((entry) => (
          <li key={entry.id}>
            <a href="#" className="text-[#007A53] hover:underline">
              {entry.title} - {new Date(entry.date).toLocaleDateString()}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

function Viticulteur({ setCurrentPage }) {
  const [products, setProducts] = useState([])
  const [blogEntries, setBlogEntries] = useState([])

  useEffect(() => {
    // Fetch products (this is a mock, replace with actual API call)
    setProducts([
      { id: 1, name: "Engrais Bio Vignes", price: 39.99, image: "https://source.unsplash.com/random/200x200?vineyard,fertilizer" },
      { id: 2, name: "Traitement Naturel Anti-Mildiou", price: 29.99, image: "https://source.unsplash.com/random/200x200?grape,disease" },
      { id: 3, name: "Paillage pour Vignobles", price: 24.99, image: "https://source.unsplash.com/random/200x200?vineyard,mulch" },
    ])

    // Fetch blog entries (this is a mock, replace with actual API call)
    setBlogEntries([
      { id: 1, title: "La viticulture biodynamique : principes et pratiques", date: "2023-05-20" },
      { id: 2, title: "Gestion durable de l'eau dans les vignobles", date: "2023-06-10" },
      { id: 3, title: "L'impact du changement climatique sur la viticulture", date: "2023-06-30" },
    ])
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 text-sm text-gray-500">
        <Button variant="link" className="p-0" onClick={() => setCurrentPage('home')}>
          Accueil
        </Button>
        <ChevronRightIcon className="w-4 h-4" />
        <span>Viticulteur</span>
      </div>

      <Button variant="outline" onClick={() => setCurrentPage('home')} className="mb-4">
        <ChevronLeftIcon className="w-4 h-4 mr-2" />
        Retour à l'accueil
      </Button>

      <div className="relative h-[300px] bg-cover bg-center" style={{backgroundImage: "url('https://source.unsplash.com/random/1600x900?vineyard,grapes')"}}>
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <h1 className="text-4xl font-bold text-white text-center">Solutions pour Viticulteurs</h1>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-[#007A53] mt-8">Nos produits pour viticulteurs</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <Card key={product.id}>
            <CardHeader>
              <Image src={product.image} alt={product.name} width={200} height={200} className="w-full h-48 object-cover" />
            </CardHeader>
            <CardContent>
              <h3 className="text-lg font-semibold">{product.name}</h3>
              <p className="text-[#007A53] font-bold">{product.price} €</p>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-[#8CC63F] hover:bg-[#7AB62F]">Ajouter au panier</Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <h2 className="text-2xl font-bold text-[#007A53] mt-8">Articles de blog pour viticulteurs</h2>
      <ul className="space-y-2">
        {blogEntries.map((entry) => (
          <li key={entry.id}>
            <a href="#" className="text-[#007A53] hover:underline">
              {entry.title} - {new Date(entry.date).toLocaleDateString()}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

function Paysagiste({ setCurrentPage }) {
  const [products, setProducts] = useState([])
  const [blogEntries, setBlogEntries] = useState([])

  useEffect(() => {
    // Fetch products (this is a mock, replace with actual API call)
    setProducts([
      { id: 1, name: "Engrais Bio Gazon", price: 27.99, image: "https://source.unsplash.com/random/200x200?lawn,fertilizer" },
      { id: 2, name: "Terreau Universel", price: 19.99, image: "https://source.unsplash.com/random/200x200?soil,potting" },
      { id: 3, name: "Paillage Décoratif", price: 22.99, image: "https://source.unsplash.com/random/200x200?decorative,mulch" },
    ])

    // Fetch blog entries (this is a mock, replace with actual API call)
    setBlogEntries([
      { id: 1, title: "Création de jardins écologiques : tendances et techniques", date: "2023-05-25" },
      { id: 2, title: "La gestion durable des espaces verts urbains", date: "2023-06-15" },
      { id: 3, title: "Plantes résistantes à la sécheresse pour l'aménagement paysager", date: "2023-07-05" },
    ])
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 text-sm text-gray-500">
        <Button variant="link" className="p-0" onClick={() => setCurrentPage('home')}>
          Accueil
        </Button>
        <ChevronRightIcon className="w-4 h-4" />
        <span>Paysagiste</span>
      </div>

      <Button variant="outline" onClick={() => setCurrentPage('home')} className="mb-4">
        <ChevronLeftIcon className="w-4 h-4 mr-2" />
        Retour à l'accueil
      </Button>

      <div className="relative h-[300px] bg-cover bg-center" style={{backgroundImage: "url('https://source.unsplash.com/random/1600x900?landscape,garden')"}}>
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <h1 className="text-4xl font-bold text-white text-center">Solutions pour Paysagistes</h1>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-[#007A53] mt-8">Nos produits pour paysagistes</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <Card key={product.id}>
            <CardHeader>
              <Image src={product.image} alt={product.name} width={200} height={200} className="w-full h-48 object-cover" />
            </CardHeader>
            <CardContent>
              <h3 className="text-lg font-semibold">{product.name}</h3>
              <p className="text-[#007A53] font-bold">{product.price} €</p>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-[#8CC63F] hover:bg-[#7AB62F]">Ajouter au panier</Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <h2 className="text-2xl font-bold text-[#007A53] mt-8">Articles de blog pour paysagistes</h2>
      <ul className="space-y-2">
        {blogEntries.map((entry) => (
          <li key={entry.id}>
            <a href="#" className="text-[#007A53] hover:underline">
              {entry.title} - {new Date(entry.date).toLocaleDateString()}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function Component() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [currentPage, setCurrentPage] = useState('home')

  const handleLogin = () => {
    setIsLoggedIn(true)
    toast.success('Connexion réussie. Bienvenue sur Pro Top Terre!')
  }

  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />
  }

  return (
    <div className="min-h-screen bg-white">
      <Toaster />
      <Header setCurrentPage={setCurrentPage} setIsLoggedIn={setIsLoggedIn} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {currentPage === 'home' && <WelcomePage setCurrentPage={setCurrentPage} />}
        {currentPage === 'passer-commande' && <PasserCommande />}
        {currentPage.startsWith('products-') && <NosProduits category={currentPage.replace('products-', '')} />}
        {currentPage === 'conseils-espaces-verts' && <ConseilsUtilisation category="espaces-verts" />}
        {currentPage === 'conseils-agriculture' && <ConseilsUtilisation category="agriculture" />}
        {currentPage === 'actualites' && <Actualites subpage="calendrier-cultures" />}
        {currentPage === 'mon-compte' && <MonCompte />}
        {currentPage === 'contact' && <Contact />}
        {currentPage === 'faq' && <FoireAuxQuestions />}
        {currentPage === 'qui-sommes-nous' && <QuiSommesNous />}
        {currentPage === 'nos-solutions-de-conditionnements' && <NosSolutionsDeConditionnements />}
        {currentPage === 'nos-valeurs' && <NosValeurs />}
        {currentPage === 'nos-clients' && <NosClients />}
        {currentPage === 'maraicher' && <Maraicher setCurrentPage={setCurrentPage} />}
        {currentPage === 'arboriculteur' && <Arboriculteur setCurrentPage={setCurrentPage} />}
        {currentPage === 'viticulteur' && <Viticulteur setCurrentPage={setCurrentPage} />}
        {currentPage === 'paysagiste' && <Paysagiste setCurrentPage={setCurrentPage} />}
      </main>

      <FloatingCart />
    </div>
  )
}'use client'

import React, { useState, useEffect } from 'react'
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Toaster, toast } from 'sonner'
import { Textarea } from "@/components/ui/textarea"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import {
  StarIcon,
  HomeIcon,
  ShoppingCartIcon,
  MessageSquareIcon,
  UserIcon,
  LeafIcon,
  BookOpenIcon,
  PackageIcon,
  NewspaperIcon,
  HelpCircleIcon,
  PhoneIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  SearchIcon,
  PrinterIcon,
  PlusIcon,
  MinusIcon,
  MapPinIcon,
  CreditCardIcon,
  CopyIcon,
  ThumbsUpIcon,
  ThumbsDownIcon,
  FlagIcon,
  HistoryIcon,
  MessageCircleIcon,
  ChevronRightIcon,
  LogOutIcon,
  MenuIcon,
  XIcon,
  CalendarIcon,
  GridIcon,
  ListIcon,
  FilterIcon,
} from "lucide-react"
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import he from 'he'

interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
  image: string
}

interface CartStore {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (id: number) => void
  updateQuantity: (id: number, quantity: number) => void
  clearCart: () => void
}

const useCartStore = create(
  persist<CartStore>(
    (set) => ({
      items: [],
      addItem: (item) =>
        set((state) => {
          const existingItem = state.items.find((i) => i.id === item.id)
          if (existingItem) {
            return {
              items: state.items.map((i) =>
                i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
              ),
            }
          }
          return { items: [...state.items, item] }
        }),
      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
        })),
      updateQuantity: (id, quantity) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.id === id ? { ...i, quantity } : i
          ),
        })),
      clearCart: () => set({ items: [] }),
    }),
    {
      name: 'cart-storage',
      getStorage: () => localStorage,
    }
  )
)

const categoriesData = [
  { id: 32, name: "Nos Amendements", slug: "nos-amendements-calcaires-naturels", description: "Découvrez ici tous nos amendements calcaires 100% naturels, afin de structurer votre sol et ainsi obtenir une meilleure assimilation des éléments nutritifs !" },
  { id: 31, name: "Nos Engrais", slug: "nos-engrais-naturels", description: "Découvrez ici tous nos engrais 100% Bio et naturels fabriqués en France à partir de matières organiques." },
  { id: 24, name: "ProBioMer", slug: "probiomer-amendement-calcaire-naturel", description: "Grâce à sa formule pH Océan, Probiomer stabilise le pH du sol et anticipe l'apparition de mousse sur le gazon." },
  { id: 30, name: "Probiomus", slug: "probiomus-engrais-fumier-bovin-volaille", description: "Fabriqué à partir de fumier de bovin, de volaille et de cheval, Probiomus est idéal pour le renforcement des sols, les plantations en pleine terre, la préparation des terres de potager et pour la création des gazons." },
  { id: 23, name: "ProBioTerre", slug: "probioterre-engrais-naturel-polyvalent", description: "L'engrais naturel polyvalent ProBioTerre est fabriqué en France à partir de matières organiques." }
]

function Header({ setCurrentPage, setIsLoggedIn }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <header className="bg-[#007A53] text-white shadow">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Button
              variant="ghost"
              className="text-white hover:bg-[#006644] p-2 flex items-center mr-2"
              onClick={() => setCurrentPage('home')}
              aria-label="Accueil Pro Top Terre"
            >
              <Image src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/fleur-pro-bio-terre-0xWPf3ZkYGilZfLPDyssvv6y3WE8qt.png" alt="Pro Top Terre Logo" width={40} height={40} />
              <span className="text-sm font-medium ml-2">Pro Top Terre</span>
            </Button>
            <nav className="hidden md:flex space-x-1">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="text-white hover:bg-[#006644] text-sm px-2">
                    <HistoryIcon className="w-4 h-4 mr-1" />
                    Histoire
                    <ChevronDownIcon className="w-4 h-4 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-[#007A53]">
                  <DropdownMenuItem onSelect={() => setCurrentPage('qui-sommes-nous')} className="text-white hover:bg-[#006644]">
                    Qui sommes nous ?
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setCurrentPage('nos-solutions-de-conditionnements')} className="text-white hover:bg-[#006644]">
                    Nos solutions de conditionnements
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setCurrentPage('nos-valeurs')} className="text-white hover:bg-[#006644]">
                    Nos valeurs
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setCurrentPage('nos-clients')} className="text-white hover:bg-[#006644]">
                    Nos clients
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="text-white hover:bg-[#006644] text-sm px-2">
                    <PackageIcon className="w-4 h-4 mr-1" />
                    Nos produits
                    <ChevronDownIcon className="w-4 h-4 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-[#007A53]">
                  {categoriesData.map((category) => (
                    <DropdownMenuItem key={category.id} onSelect={() => setCurrentPage(`products-${category.slug}`)} className="text-white hover:bg-[#006644]">
                      {category.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <Button variant="ghost" className="text-white hover:bg-[#006644] text-sm px-2" onClick={() => setCurrentPage('actualites')}>
                <NewspaperIcon className="w-4 h-4 mr-1" />
                Actualités
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="text-white hover:bg-[#006644] text-sm px-2">
                    <BookOpenIcon className="w-4 h-4 mr-1" />
                    Conseils
                    <ChevronDownIcon className="w-4 h-4 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-[#007A53]">
                  <DropdownMenuItem onSelect={() => setCurrentPage('conseils-espaces-verts')} className="text-white hover:bg-[#006644]">
                    Espaces verts
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setCurrentPage('conseils-agriculture')} className="text-white hover:bg-[#006644]">
                    Agriculture
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button variant="ghost" className="text-white hover:bg-[#006644] text-sm px-2" onClick={() => setCurrentPage('contact')}>
                <PhoneIcon className="w-4 h-4 mr-1" />
                Contact
              </Button>
              <Button variant="ghost" className="text-white hover:bg-[#006644] text-sm px-2" onClick={() => setCurrentPage('faq')}>
                <HelpCircleIcon className="w-4 h-4 mr-1" />
                FAQ
              </Button>
            </nav>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="ghost" className="text-white hover:bg-[#006644] text-sm px-2" onClick={() => setCurrentPage('passer-commande')}>
              <ShoppingCartIcon className="w-4 h-4 mr-1" />
              Passer commande
            </Button>
            <Button variant="ghost" className="text-white hover:bg-[#006644] text-sm px-2" onClick={() => setCurrentPage('mon-compte')}>
              Mon compte
            </Button>
            <Button variant="ghost" className="text-white hover:bg-[#006644] p-2" onClick={() => setIsLoggedIn(false)} aria-label="Déconnexion">
              <LogOutIcon className="w-5 h-5" />
            </Button>
            <Button variant="ghost" className="md:hidden text-white hover:bg-[#006644] p-2" onClick={toggleMenu} aria-label="Menu">
              <MenuIcon className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden bg-[#007A53] py-2">
          <nav className="flex flex-col space-y-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-white hover:bg-[#006644] text-sm px-2 w-full text-left">
                  <HistoryIcon className="w-4 h-4 mr-1" />
                  Histoire
                  <ChevronDownIcon className="w-4 h-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-[#007A53]">
                <DropdownMenuItem onSelect={() => { setCurrentPage('qui-sommes-nous'); setIsMenuOpen(false); }} className="text-white hover:bg-[#006644]">
                  Qui sommes nous ?
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => { setCurrentPage('nos-solutions-de-conditionnements'); setIsMenuOpen(false); }} className="text-white hover:bg-[#006644]">
                  Nos solutions de conditionnements
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => { setCurrentPage('nos-valeurs'); setIsMenuOpen(false); }} className="text-white hover:bg-[#006644]">
                  Nos valeurs
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => { setCurrentPage('nos-clients'); setIsMenuOpen(false); }} className="text-white hover:bg-[#006644]">
                  Nos clients
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-white hover:bg-[#006644] text-sm px-2 w-full text-left">
                  <PackageIcon className="w-4 h-4 mr-1" />
                  Nos produits
                  <ChevronDownIcon className="w-4 h-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-[#007A53]">
                {categoriesData.map((category) => (
                  <DropdownMenuItem key={category.id} onSelect={() => { setCurrentPage(`products-${category.slug}`); setIsMenuOpen(false); }} className="text-white hover:bg-[#006644]">
                    {category.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="ghost" className="text-white hover:bg-[#006644] text-sm px-2 w-full text-left" onClick={() => { setCurrentPage('actualites'); setIsMenuOpen(false); }}>
              <NewspaperIcon className="w-4 h-4 mr-1" />
              Actualités
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-white hover:bg-[#006644] text-sm px-2 w-full text-left">
                  <BookOpenIcon className="w-4 h-4 mr-1" />
                  Conseils
                  <ChevronDownIcon className="w-4 h-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-[#007A53]">
                <DropdownMenuItem onSelect={() => { setCurrentPage('conseils-espaces-verts'); setIsMenuOpen(false); }} className="text-white hover:bg-[#006644]">
                  Espaces verts
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => { setCurrentPage('conseils-agriculture'); setIsMenuOpen(false); }} className="text-white hover:bg-[#006644]">
                  Agriculture
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="ghost" className="text-white hover:bg-[#006644] text-sm px-2 w-full text-left" onClick={() => { setCurrentPage('contact'); setIsMenuOpen(false); }}>
              <PhoneIcon className="w-4 h-4 mr-1" />
              Contact
            </Button>
            <Button variant="ghost" className="text-white hover:bg-[#006644] text-sm px-2 w-full text-left" onClick={() => { setCurrentPage('faq'); setIsMenuOpen(false); }}>
              <HelpCircleIcon className="w-4 h-4 mr-1" />
              FAQ
            </Button>
          </nav>
        </div>
      )}
    </header>
  )
}

const useRotatingImage = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const images = [
    "https://images.unsplash.com/photo-1486754735734-325b5831c3ad?q=80&w=1920&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1529313780224-1a12b68bed16?q=80&w=2048&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=4032&auto=format&fit=crop"
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return images[currentImageIndex]
}

function LoginPage({ onLogin }) {
  const [isSignupOpen, setIsSignupOpen] = useState(false)
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false)
  const [email, setEmail] = useState('test@example.com')
  const [password, setPassword] = useState('1234')
  const backgroundImage = useRotatingImage()

  const handleSignupSubmit = (e) => {
    e.preventDefault()
    setIsSignupOpen(false)
    setIsConfirmationOpen(true)
  }

  const handleLogin = (e) => {
    e.preventDefault()
    if (email && password) {
      onLogin()
    } else {
      toast.error('Veuillez remplir tous les champs.')
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-cover bg-center transition-all duration-1000 ease-in-out" style={{backgroundImage: `url('${backgroundImage}')`}}>
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <Image src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/fleur-pro-bio-terre-0xWPf3ZkYGilZfLPDyssvv6y3WE8qt.png" alt="Pro Top Terre Logo" width={40} height={40} />
        <span className="text-xl font-bold text-white ml-2">Pro Top Terre</span>
      </header>
      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-sm space-y-4 p-6 bg-white bg-opacity-90">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold text-[#007A53]">Connexion</h1>
            <p className="text-gray-600">Entrez vos identifiants pour accéder au portail</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                placeholder="Email" 
                required 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input 
                id="password" 
                placeholder="Mot de passe" 
                required 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full bg-[#007A53] hover:bg-[#006644]">Se connecter</Button>
          </form>
          <div className="text-center">
            <Dialog open={isSignupOpen} onOpenChange={setIsSignupOpen}>
              <DialogTrigger asChild>
                <Button variant="link" className="text-[#007A53] hover:text-[#006644]">
                  Demander l'accès
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Demande d'accès</DialogTitle>
                  <DialogDescription>
                    Remplissez ce formulaire pour demander l'accès à Pro Top Terre.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSignupSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Nom</Label>
                    <Input id="signup-name" placeholder="Votre nom" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input id="signup-email" placeholder="Votre email" required type="email" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-company">Entreprise</Label>
                    <Input id="signup-company" placeholder="Nom de votre entreprise" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-type">Type de compte</Label>
                    <Select required>
                      <SelectTrigger id="signup-type">
                        <SelectValue placeholder="Sélectionnez un type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="company">Entreprise</SelectItem>
                        <SelectItem value="consumer">Particulier</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button type="submit" className="w-full bg-[#007A53] hover:bg-[#006644]">
                    Envoyer la demande
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
            <Dialog open={isConfirmationOpen} onOpenChange={setIsConfirmationOpen}>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Demande envoyée</DialogTitle>
                  <DialogDescription>
                    Merci pour votre demande d'accès. Nous vous contacterons bientôt. Veuillez vérifier votre email dans les prochains jours.
                  </DialogDescription>
                </DialogHeader>
                <Button onClick={() => setIsConfirmationOpen(false)} className="w-full bg-[#007A53] hover:bg-[#006644]">
                  Fermer
                </Button>
              </DialogContent>
            </Dialog>
          </div>
        </Card>
      </main>
    </div>
  )
}

function WelcomePage({ setCurrentPage }) {
  return (
    <div className="space-y-6">
      <div className="relative h-[400px] bg-cover bg-center" style={{backgroundImage: "url('https://source.unsplash.com/random/1600x900?agriculture,farm')"}}>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/fleur-pro-bio-terre-0xWPf3ZkYGilZfLPDyssvv6y3WE8qt.png"
            alt="Pro Top Terre Logo"
            width={300}
            height={100}
            className="z-10"
          />
        </div>
      </div>
      <h1 className="text-3xl font-bold text-[#007A53] text-center">Découvrez nos produits pour chacun de vos besoins :</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Button
          className="h-32 bg-[#8CC63F] hover:bg-[#7AB62F] text-white flex flex-col items-center justify-center"
          onClick={() => setCurrentPage('maraicher')}
        >
          <Image src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/poivron-pro-bio-terre-JxptJpAPhkFABKnyfGA19g94WNAS4L.png" alt="Maraîcher" width={50} height={50} />
          <span className="mt-2">Maraîcher</span>
        </Button>
        <Button
          className="h-32 bg-[#8CC63F] hover:bg-[#7AB62F] text-white flex flex-col items-center justify-center"
          onClick={() => setCurrentPage('arboriculteur')}
        >
          <Image src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/branche-pro-bio-terre-Ce6CRXNpQy0HnqnsLL2BmUUZFmFhie.png" alt="Arboriculteur" width={50} height={50} />
          <span className="mt-2">Arboriculteur</span>
        </Button>
        <Button
          className="h-32 bg-[#8CC63F] hover:bg-[#7AB62F] text-white flex flex-col items-center justify-center"
          onClick={() => setCurrentPage('viticulteur')}
        >
          <Image src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/branche-pro-bio-terre-Ce6CRXNpQy0HnqnsLL2BmUUZFmFhie.png" alt="Viticulteur" width={50} height={50} />
          <span className="mt-2">Viticulteur</span>
        </Button>
        <Button
          className="h-32 bg-[#8CC63F] hover:bg-[#7AB62F] text-white flex flex-col items-center justify-center"
          onClick={() => setCurrentPage('paysagiste')}
        >
          <Image src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/fleur-pro-bio-terre-0xWPf3ZkYGilZfLPDyssvv6y3WE8qt.png" alt="Paysagiste" width={50} height={50} />
          <span className="mt-2">Paysagiste</span>
        </Button>
      </div>
      <SaisonnaliteDesCultures />
    </div>
  )
}

function SaisonnaliteDesCultures() {
  const [crops, setCrops] = useState<Crop[]>(cropsData)
  const [filter, setFilter] = useState({ type: '', season: '', region: '' })
  const [searchTerm, setSearchTerm] = useState('')
  const [view, setView] = useState<'card' | 'list'>('card')
  const [selectedCrop, setSelectedCrop] = useState<Crop | null>(null)

  useEffect(() => {
    const filteredCrops = cropsData.filter(crop => 
      crop.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filter.type === '' || crop.type === filter.type) &&
      (filter.season === '' || crop.season === filter.season) &&
      (filter.region === '' || crop.region === filter.region)
    )
    setCrops(filteredCrops)
  }, [searchTerm, filter])

  const uniqueTypes = Array.from(new Set(cropsData.map(crop => crop.type)))
  const uniqueSeasons = Array.from(new Set(cropsData.map(crop => crop.season)))
  const uniqueRegions = Array.from(new Set(cropsData.map(crop => crop.region)))

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-[#007A53]">Saisonnalité des cultures</h2>
      
      <div className="flex flex-wrap gap-4 items-center">
        <Input
          placeholder="Rechercher une culture..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-xs"
        />
        <Select onValueChange={(value) => setFilter({ ...filter, type: value })}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Type de culture" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Tous les types</SelectItem>
            {uniqueTypes.map(type => (
              <SelectItem key={type} value={type}>{type}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select onValueChange={(value) => setFilter({ ...filter, season: value })}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Saison" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Toutes les saisons</SelectItem>
            {uniqueSeasons.map(season => (
              <SelectItem key={season} value={season}>{season}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select onValueChange={(value) => setFilter({ ...filter, region: value })}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Région" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Toutes les régions</SelectItem>
            {uniqueRegions.map(region => (
              <SelectItem key={region} value={region}>{region}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button variant="outline" onClick={() => setView('card')} className={view === 'card' ? 'bg-[#007A53] text-white' : ''}>
          <GridIcon className="w-4 h-4 mr-2" />
          Cartes
        </Button>
        <Button variant="outline" onClick={() => setView('list')} className={view === 'list' ? 'bg-[#007A53] text-white' : ''}>
          <ListIcon className="w-4 h-4 mr-2" />
          Liste
        </Button>
      </div>

      {view === 'card' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {crops.map((crop) => (
            <Card key={crop.id} className="overflow-hidden">
              <CardHeader className="p-0">
                <Image src={crop.image} alt={crop.name} width={400} height={300} className="w-full h-48 object-cover" />
              </CardHeader>
              <CardContent className="p-4">
                <CardTitle>{crop.name}</CardTitle>
                <p className="text-sm text-gray-500">{crop.type} - {crop.season}</p>
                <p className="text-sm text-gray-500">{crop.region}</p>
              </CardContent>
              <CardFooter>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full" onClick={() => setSelectedCrop(crop)}>Voir détails</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{selectedCrop?.name}</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4">
                      <Image src={selectedCrop?.image || ''} alt={selectedCrop?.name || ''} width={400} height={300} className="w-full h-48 object-cover rounded-lg" />
                      <p><strong>Type:</strong> {selectedCrop?.type}</p>
                      <p><strong>Saison:</strong> {selectedCrop?.season}</p>
                      <p><strong>Région:</strong> {selectedCrop?.region}</p>
                      <p>{selectedCrop?.description}</p>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Saison</TableHead>
              <TableHead>Région</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {crops.map((crop) => (
              <TableRow key={crop.id}>
                <TableCell>{crop.name}</TableCell>
                <TableCell>{crop.type}</TableCell>
                <TableCell>{crop.season}</TableCell>
                <TableCell>{crop.region}</TableCell>
                <TableCell>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" onClick={() => setSelectedCrop(crop)}>Voir détails</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{selectedCrop?.name}</DialogTitle>
                      </DialogHeader>
                      <div className="grid gap-4">
                        <Image src={selectedCrop?.image || ''} alt={selectedCrop?.name || ''} width={400} height={300} className="w-full h-48 object-cover rounded-lg" />
                        <p><strong>Type:</strong> {selectedCrop?.type}</p>
                        <p><strong>Saison:</strong> {selectedCrop?.season}</p>
                        <p><strong>Région:</strong> {selectedCrop?.region}</p>
                        <p>{selectedCrop?.description}</p>
                      </div>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  )
}

type Crop = {
  id: number
  name: string
  type: string
  season: string
  region: string
  image: string
  description: string
}

const cropsData: Crop[] = [
  { id: 1, name: "Blé", type: "Céréales", season: "Été", region: "Beauce", image: "https://source.unsplash.com/random/400x300?wheat", description: "Le blé est une céréale majeure cultivée en France, principalement dans la région de la Beauce." },
  { id: 2, name: "Melon", type: "Fruits", season: "Été", region: "Provence", image: "https://source.unsplash.com/random/400x300?melon", description: "Le melon est un fruit d'été populaire, cultivé principalement dans le sud de la France." },
  { id: 3, name: "Citron", type: "Fruits", season: "Hiver", region: "Côte d'Azur", image: "https://source.unsplash.com/random/400x300?lemon", description: "Le citron est un agrume cultivé principalement sur la Côte d'Azur, disponible en hiver." },
  { id: 4, name: "Fraises", type: "Fruits", season: "Printemps", region: "Val de Loire", image: "https://source.unsplash.com/random/400x300?strawberry", description: "Les fraises sont des fruits de printemps, cultivés notamment dans la région du Val de Loire." },
  { id: 5, name: "Tomates", type: "Légumes", season: "Été", region: "Provence", image: "https://source.unsplash.com/random/400x300?tomato", description: "Les tomates sont des légumes d'été très populaires, cultivés dans diverses régions, notamment en Provence." },
  { id: 6, name: "Pommes", type: "Fruits", season: "Automne", region: "Normandie", image: "https://source.unsplash.com/random/400x300?apple", description: "Les pommes sont des fruits d'automne, avec une production importante en Normandie." },
  { id: 7, name: "Carottes", type: "Légumes", season: "Toute l'année", region: "Bretagne", image: "https://source.unsplash.com/random/400x300?carrot", description: "Les carottes sont cultivées toute l'année, avec une production notable en Bretagne." },
  { id: 8, name: "Lavande", type: "Plantes", season: "Été", region: "Provence", image: "https://source.unsplash.com/random/400x300?lavender", description: "La lavande est une plante emblématique de la Provence, fleurissant en été." }
]

function OrderConfirmationDialog({ isOpen, onClose, onConfirm, userInfo, cart }) {
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Confirmer la demande</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Nom
            </Label>
            <Input id="name" value={userInfo.name} className="col-span-3" readOnly />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input id="email" value={userInfo.email} className="col-span-3" readOnly />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="address" className="text-right">
              Adresse
            </Label>
            <Textarea id="address" value={userInfo.address} className="col-span-3" readOnly />
          </div>
          <div className="border-t pt-4">
            <h3 className="font-semibold mb-2">Récapitulatif de la commande</h3>
            {cart.map((item) => (
              <div key={item.id} className="flex justify-between items-center mb-2">
                <span>{item.name}</span>
                <span>{item.quantity} x {item.price}€</span>
              </div>
            ))}
            <div className="border-t pt-2 mt-2">
              <div className="flex justify-between items-center font-semibold">
                <span>Total</span>
                <span>{totalPrice.toFixed(2)}€</span>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Annuler</Button>
          <Button onClick={onConfirm} className="bg-[#007A53] hover:bg-[#006644]">Confirmer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function PasserCommande() {
  const [productsData, setProductsData] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false)
  const [userInfo, setUserInfo] = useState({ name: 'John Doe', email: 'john@example.com', address: '123 Main St, City, Country' })
  const [isLoading, setIsLoading] = useState(true)

  const { items: cart, addItem, removeItem, updateQuantity, clearCart } = useCartStore()

  useEffect(() => {
    setIsLoading(true)
    fetch('https://www.regalterre.com/wp-json/wc/store/products')
      .then(response => response.json())
      .then(data => {
        setProductsData(data)
        setIsLoading(false)
      })
      .catch(error => {
        console.error('Error fetching products:', error)
        setIsLoading(false)
      })
  }, [])

  const addToCart = (product) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.prices.price,
      quantity: 1,
      image: product.images[0].src
    })
  }

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const filteredProducts = productsData.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.short_description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleConfirmOrder = () => {
    setIsConfirmationOpen(false)
    toast.success('Votre demande a été confirmée. Nous vous contacterons bientôt.')
    clearCart()
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="w-full lg:w-3/4">
        <h1 className="text-3xl font-bold text-[#007A53] mb-6">Passer commande / Nouveau devis</h1>
        <div className="mb-4">
          <div className="relative">
            <Input
              type="text"
              placeholder="Rechercher des produits..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#007A53]"></div>
          </div>
        ) : (
          categoriesData.map((category) => {
            const categoryProducts = filteredProducts.filter(product =>
              product.categories.some(cat => cat.id === category.id)
            )

            if (categoryProducts.length === 0) return null

            return (
              <div key={category.id} className="mb-8">
                <h2 className="text-2xl font-semibold text-[#007A53] mb-4">{category.name}</h2>
                <Card className="overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[100px]">Image</TableHead>
                        <TableHead>Produit</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead className="text-right">Prix</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {categoryProducts.map((product) => (
                        <TableRow key={product.id}>
                          <TableCell>
                            <Image
                              src={product.images[0].src}
                              alt={product.name}
                              width={64}
                              height={64}
                              className="object-cover rounded"
                            />
                          </TableCell>
                          <TableCell className="font-medium">{he.decode(product.name)}</TableCell>
                          <TableCell>
                            <div dangerouslySetInnerHTML={{ __html: product.short_description }} className="line-clamp-2" />
                          </TableCell>
                          <TableCell className="text-right">
                            {product.prices.price}€
                          </TableCell>
                          <TableCell className="text-right">
                            <Button onClick={() => addToCart(product)} size="sm" className="bg-[#8CC63F] hover:bg-[#7AB62F]">
                              <PlusIcon className="w-4 h-4 mr-2" />
                              Ajouter
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Card>
              </div>
            )
          })
        )}
      </div>
      <div className="w-full lg:w-1/4">
        <Card className="p-4">
          <CardHeader>
            <CardTitle>Panier</CardTitle>
          </CardHeader>
          <CardContent className="max-h-96 overflow-y-auto">
            {cart.length === 0 ? (
              <p>Votre panier est vide</p>
            ) : (
              <>
                {cart.map(item => (
                  <div key={item.id} className="flex justify-between items-center mb-4">
                    <div className="flex items-center">
                      <Image src={item.image} alt={item.name} width={50} height={50} className="mr-2 rounded" />
                      <div>
                        <p className="font-medium">{he.decode(item.name)}</p>
                        <p className="text-sm text-gray-500">{item.price}€</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="flex items-center">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <MinusIcon className="w-4 h-4" />
                        </Button>
                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                          className="w-16 mx-2 text-center"
                          min="1"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <PlusIcon className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}
          </CardContent>
          {cart.length > 0 && (
            <CardFooter className="flex flex-col items-stretch">
              <div className="flex justify-between items-center mb-4">
                <span className="font-bold">Total:</span>
                <span className="font-bold">{totalPrice.toFixed(2)}€</span>
              </div>
              <Button className="w-full bg-[#007A53] hover:bg-[#006644]" onClick={() => setIsConfirmationOpen(true)}>
                Valider la demande
              </Button>
            </CardFooter>
          )}
        </Card>
      </div>
      <OrderConfirmationDialog
        isOpen={isConfirmationOpen}
        onClose={() => setIsConfirmationOpen(false)}
        onConfirm={handleConfirmOrder}
        userInfo={userInfo}
        cart={cart}
      />
    </div>
  )
}

function NosProduits({ category }) {
  const categoryData = categoriesData.find(cat => cat.slug === category)
  const [products, setProducts] = useState([])
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(true)
    fetch(`https://www.regalterre.com/wp-json/wc/store/products?category=${categoryData.id}`)
      .then(response => response.json())
      .then(data => {
        setProducts(data)
        setIsLoading(false)
      })
      .catch(error => {
        console.error('Error fetching products:', error)
        setIsLoading(false)
      })
  }, [category, categoryData.id])

  const handleProductClick = (product) => {
    setSelectedProduct(product)
  }

  const handleCloseProductDetail = () => {
    setSelectedProduct(null)
  }

  const { addItem } = useCartStore()

  const addToCart = (product) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.prices.price,
      quantity: 1,
      image: product.images[0].src
    })
    toast.success(`${he.decode(product.name)} ajouté au panier`)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 text-sm text-gray-500">
        <Button variant="link" className="p-0" onClick={handleCloseProductDetail}>
          Accueil
        </Button>
        <ChevronRightIcon className="w-4 h-4" />
        <span>{categoryData.name}</span>
        {selectedProduct && (
          <>
            <ChevronRightIcon className="w-4 h-4" />
            <span>{he.decode(selectedProduct.name)}</span>
          </>
        )}
      </div>
      <h1 className="text-3xl font-bold text-[#007A53]">{categoryData.name}</h1>
      <p className="text-lg text-gray-600 mb-6">{categoryData.description}</p>
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#007A53]"></div>
        </div>
      ) : selectedProduct ? (
        <ProductDetail product={selectedProduct} onClose={handleCloseProductDetail} onAddToCart={addToCart} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="flex flex-col h-full cursor-pointer" onClick={() => handleProductClick(product)}>
              <CardHeader>
                <Image
                  src={product.images[0].src}
                  alt={product.name}
                  width={300}
                  height={200}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
              </CardHeader>
              <CardContent className="flex-grow">
                <h2 className="text-xl font-semibold mb-2 text-[#007A53]">{he.decode(product.name)}</h2>
                <div className="text-gray-600 mb-4" dangerouslySetInnerHTML={{ __html: product.short_description }} />
              </CardContent>
              <CardFooter className="flex justify-between items-center mt-auto">
                <span className="text-lg font-bold text-[#007A53]">{product.prices.price}€</span>
                <Button className="bg-[#8CC63F] hover:bg-[#7AB62F]">Voir détails</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

function ProductDetail({ product, onClose, onAddToCart }) {
  const [selectedImage, setSelectedImage] = useState(product.images[0])
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)

  const handleImageClick = (image) => {
    setSelectedImage(image)
    setIsLightboxOpen(true)
  }

  return (
    <div className="space-y-6">
      <Button variant="outline" onClick={onClose} className="mb-4">
        <ChevronLeftIcon className="w-4 h-4 mr-2" />
        Retour aux produits
      </Button>
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <Image
            src={selectedImage.src}
            alt={product.name}
            width={600}
            height={400}
            className="w-full h-auto object-cover rounded-lg cursor-pointer"
            onClick={() => setIsLightboxOpen(true)}
          />
          <div className="grid grid-cols-4 gap-2 mt-4">
            {product.images.map((image) => (
              <Image
                key={image.id}
                src={image.src}
                alt={product.name}
                width={150}
                height={150}
                className={`w-full h-auto object-cover rounded-lg cursor-pointer ${
                  selectedImage.id === image.id ? 'border-2 border-[#007A53]' : ''
                }`}
                onClick={() => handleImageClick(image)}
              />
            ))}
          </div>
        </div>
        <div>
          <h1 className="text-3xl font-bold text-[#007A53] mb-4">{he.decode(product.name)}</h1>
          <div className="text-xl font-semibold text-[#007A53] mb-4">{product.prices.price}€</div>
          <div className="prose max-w-none mb-6" dangerouslySetInnerHTML={{ __html: product.description }} />
          <Button className="w-full bg-[#8CC63F] hover:bg-[#7AB62F]" onClick={() => onAddToCart(product)}>Ajouter au panier</Button>
        </div>
      </div>
      {isLightboxOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={() => setIsLightboxOpen(false)}>
          <div className="max-w-4xl max-h-full p-4">
            <Image
              src={selectedImage.src}
              alt={product.name}
              width={1200}
              height={800}
              className="w-full h-auto object-contain"
            />
          </div>
        </div>
      )}
    </div>
  )
}

function ConseilsUtilisation({ category }) {
  const conseils = {
    'espaces-verts': [
      "Effectuez une analyse de sol avant d'appliquer des engrais pour déterminer les besoins spécifiques de votre terrain.",
      "Arrosez abondamment après l'application d'engrais pour favoriser l'absorption par les plantes.",
      "Pour les gazons, utilisez un épandeur pour assurer une distribution uniforme des produits.",
      "Évitez d'appliquer des engrais par temps très chaud ou en plein soleil pour prévenir les brûlures.",
    ],
    'agriculture': [
      "Respectez les doses recommandées pour chaque culture afin d'optimiser les rendements et minimiser l'impact environnemental.",
      "Pratiquez la rotation des cultures pour maintenir la santé du sol et réduire la dépendance aux engrais.",
      "Utilisez des techniques de précision pour appliquer les produits, comme la pulvérisation guidée par GPS.",
      "Intégrez des cultures de couverture dans votre rotation pour améliorer naturellement la fertilité du sol.",
    ],
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-[#007A53]">
        Conseils d'utilisation - {category === 'espaces-verts' ? "Espaces verts" : "Agriculture"}
      </h1>
      <Card className="p-6 border-[#8CC63F]">
        <ul className="list-disc list-inside space-y-2">
          {conseils[category].map((conseil, index) => (
            <li key={index} className="text-gray-600">{conseil}</li>
          ))}
        </ul>
      </Card>
    </div>
  )
}

function Actualites({ subpage }) {
  const actualites = {
    'calendrier-cultures': [
      { id: 1, title: "Semis de printemps", date: "Mars -  Avril", content: "Préparez vos sols et commencez les semis de cultures printanières." },
      { id: 2, title: "Fertilisation estivale", date: "Juin - Juillet", content: "Appliquez nos engrais pour booster la croissance pendant la période chaude." },
      { id: 3, title: "Récolte d'automne", date: "Septembre - Octobre", content: "Préparez-vous pour les récoltes et planifiez la fertilisation post-récolte." },
    ],
    'evenements': [
      { id: 1, title: "Salon de l'Agriculture", date: "25-28 Février", content: "Retrouvez-nous au Salon de l'Agriculture pour découvrir nos dernières innovations." },
      { id: 2, title: "Journée portes ouvertes", date: "15 Mai", content: "Visitez nos installations et participez à des ateliers sur l'agriculture durable." },
      { id: 3, title: "Webinaire : Optimisation des cultures", date: "10 Juillet", content: "Participez à notre webinaire en ligne sur les techniques d'optimisation des cultures." },
    ],
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-[#007A53]">
        {subpage === 'calendrier-cultures' ? "Calendrier des cultures" : "Événements à venir"}
      </h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {actualites[subpage].map((item) => (
          <Card key={item.id} className="p-6 border-[#8CC63F]">
            <h2 className="text-xl font-semibold mb-2 text-[#007A53]">{item.title}</h2>
            <p className="text-sm text-gray-500 mb-2">{item.date}</p>
            <p className="text-gray-600">{item.content}</p>
          </Card>
        ))}
      </div>
    </div>
  )
}

function MonCompte() {
  const [orders, setOrders] = useState([
    { id: 'CMD-001', date: '01/05/2023', amount: 250.00, status: 'Livrée' },
    { id: 'CMD-002', date: '15/05/2023', amount: 180.00, status: 'En cours' },
  ])

  const handleRenewOrder = (orderId) => {
    toast.success(`Commande ${orderId} renouvelée avec succès.`)
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-[#007A53]">Mon compte</h1>
      <Tabs defaultValue="informations">
        <TabsList>
          <TabsTrigger value="informations">Informations personnelles</TabsTrigger>
          <TabsTrigger value="commandes">Historique des commandes</TabsTrigger>
          <TabsTrigger value="preferences">Préférences</TabsTrigger>
          <TabsTrigger value="paiement">Information de paiement</TabsTrigger>
        </TabsList>
        <TabsContent value="informations">
          <Card>
            <CardHeader>
              <CardTitle>Informations personnelles</CardTitle>
              <CardDescription>Gérez vos informations personnelles et de contact.</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="prenom">Prénom</Label>
                    <Input id="prenom" placeholder="Votre prénom" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nom">Nom</Label>
                    <Input id="nom" placeholder="Votre nom" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="Votre email" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telephone">Téléphone</Label>
                  <Input id="telephone" type="tel" placeholder="Votre numéro de téléphone" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="adresse">Adresse</Label>
                  <Textarea id="adresse" placeholder="Votre adresse complète" />
                </div>
                <Button type="submit" className="bg-[#007A53] hover:bg-[#006644]">Enregistrer les modifications</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="commandes">
          <Card>
            <CardHeader>
              <CardTitle>Historique des commandes</CardTitle>
              <CardDescription>Consultez vos commandes passées et leur statut.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Numéro de commande</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Montant</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>{order.id}</TableCell>
                      <TableCell>{order.date}</TableCell>
                      <TableCell>{order.amount.toFixed(2)} €</TableCell>
                      <TableCell>{order.status}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <PrinterIcon className="w-4 h-4 mr-2" />
                            Facture
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleRenewOrder(order.id)}>
                            <CopyIcon className="w-4 h-4 mr-2" />
                            Renouveler
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="preferences">
          <Card>
            <CardHeader>
              <CardTitle>Préférences</CardTitle>
              <CardDescription>Personnalisez vos préférences de compte et de communication.</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="langue">Langue préférée</Label>
                  <Select>
                    <SelectTrigger id="langue">
                      <SelectValue placeholder="Sélectionnez une langue" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Préférences de communication</Label>
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="newsletter" className="rounded border-gray-300 text-[#007A53] shadow-sm focus:border-[#007A53] focus:ring focus:ring-[#007A53] focus:ring-opacity-50" />
                      <Label htmlFor="newsletter">Recevoir la newsletter</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="offres" className="rounded border-gray-300 text-[#007A53] shadow-sm focus:border-[#007A53] focus:ring focus:ring-[#007A53] focus:ring-opacity-50" />
                      <Label htmlFor="offres">Recevoir les offres promotionnelles</Label>
                    </div>
                  </div>
                </div>
                <Button type="submit" className="bg-[#007A53] hover:bg-[#006644]">Enregistrer les préférences</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="paiement">
          <Card>
            <CardHeader>
              <CardTitle>Information de paiement</CardTitle>
              <CardDescription>Gérez vos méthodes de paiement et vos conditions de paiement.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Méthode de paiement actuelle</h3>
                  <div className="flex items-center space-x-2">
                    <CreditCardIcon className="w-6 h-6 text-[#007A53]" />
                    <span>Carte de crédit se terminant par 1234</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Conditions de paiement</h3>
                  <p>Paiement à 30 jours</p>
                </div>
                <Button className="bg-[#007A53] hover:bg-[#006644]">
                  Modifier les informations de paiement
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function Contact() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-[#007A53]">Contactez-nous</h1>
      <Card className="p-6 border-[#8CC63F]">
        <form className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nom</Label>
            <Input id="name" placeholder="Votre nom" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="Votre email" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="subject">Sujet</Label>
            <Input id="subject" placeholder="Sujet de votre message" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea id="message" placeholder="Votre message" required />
          </div>
          <Button type="submit" className="bg-[#007A53] hover:bg-[#006644]">Envoyer</Button>
        </form>
      </Card>
      <Card className="p-6 border-[#8CC63F]">
        <h2 className="text-xl font-semibold mb-4 text-[#007A53]">Nos coordonnées</h2>
        <div className="space-y-2">
          <p><strong>Adresse :</strong> 123 Rue de la Terre, 75000 Paris</p>
          <p><strong>Téléphone :</strong> +33 1 23 45 67 89</p>
          <p><strong>Email :</strong> contact@protopterre.com</p>
        </div>
      </Card>
    </div>
  )
}

function FoireAuxQuestions() {
  const [faqData, setFaqData] = useState([
    {
      id: 1,
      question: "Quels sont les avantages des engrais naturels ?",
      answers: [
        {
          id: 1,
          content: "Les engrais naturels offrent plusieurs avantages : ils améliorent la structure du sol, favorisent la vie microbienne, libèrent les nutriments progressivement, et sont plus respectueux de l'environnement.",
          author: "Expert ProTopTerre",
          votes: 15,
          responses: []
        },
        {
          id: 2,
          content: "En plus de ce qui a été mentionné, les engrais naturels contribuent également à la rétention d'eau dans le sol et réduisent le risque de brûlure des plantes.",
          author: "AgricoExpert",
          votes: 8,
          responses: []
        }
      ]
    },
    {
      id: 2,
      question: "Comment appliquer correctement les engrais Pro Top Terre ?",
      answers: [
        {
          id: 1,
          content: "Pour une application optimale, suivez les instructions sur l'emballage. En général, il est recommandé d'épandre l'engrais uniformément sur le sol, puis de l'incorporer légèrement et d'arroser abondamment.",
          author: "Expert ProTopTerre",
          votes: 12,
          responses: [
            {
              id: 1,
              content: "Est-ce que cela s'applique aussi aux plantes en pot ?",
              author: "JardinierDébutant",
              votes: 3
            },
            {
              id: 2,
              content: "Pour les plantes en pot, vous pouvez mélanger l'engrais au terr eau lors du rempotage ou l'appliquer en surface et arroser ensuite.",
              author: "Expert ProTopTerre",
              votes: 5
            }
          ]
        }
      ]
    },
    {
      id: 3,
      question: "Quelle est la fréquence d'application recommandée ?",
      answers: [
        {
          id: 1,
          content: "La fréquence d'application dépend du type de plante et de la saison. En général, pour les pelouses, on recommande 3-4 applications par an. Pour les plantes en pot, une application tous les 2-3 mois pendant la saison de croissance est suffisante.",
          author: "Expert ProTopTerre",
          votes: 10,
          responses: []
        }
      ]
    },
    {
      id: 4,
      question: "Les produits Pro Top Terre sont-ils utilisables en agriculture biologique ?",
      answers: [
        {
          id: 1,
          content: "Oui, nos produits sont utilisables en Agriculture Biologique, conformément au règlement UE N°2018/848 du 1er Janvier 2022.",
          author: "Expert ProTopTerre",
          votes: 18,
          responses: []
        }
      ]
    },
    {
      id: 5,
      question: "Comment choisir le bon produit pour mon jardin ?",
      answers: [
        {
          id: 1,
          content: "Le choix du produit dépend de vos besoins spécifiques. Nos amendements calcaires sont idéaux pour corriger le pH du sol, tandis que nos engrais apportent les nutriments nécessaires à la croissance des plantes. N'hésitez pas à nous contacter pour des conseils personnalisés.",
          author: "Expert ProTopTerre",
          votes: 14,
          responses: []
        }
      ]
    }
  ])

  const [newQuestion, setNewQuestion] = useState('')
  const [expandedQuestions, setExpandedQuestions] = useState({})

  const handleVote = (questionId, answerId, increment) => {
    setFaqData(faqData.map(question => 
      question.id === questionId
        ? {
            ...question,
            answers: question.answers.map(answer =>
              answer.id === answerId
                ? { ...answer, votes: answer.votes + (increment ? 1 : -1) }
                : answer
            )
          }
        : question
    ))
  }

  const handleResponseVote = (questionId, answerId, responseId, increment) => {
    setFaqData(faqData.map(question => 
      question.id === questionId
        ? {
            ...question,
            answers: question.answers.map(answer =>
              answer.id === answerId
                ? {
                    ...answer,
                    responses: answer.responses.map(response =>
                      response.id === responseId
                        ? { ...response, votes: response.votes + (increment ? 1 : -1) }
                        : response
                    )
                  }
                : answer
            )
          }
        : question
    ))
  }

  const handleReport = (id) => {
    toast.success(`La question a été signalée. Merci pour votre contribution.`)
  }

  const handleSubmitQuestion = (e) => {
    e.preventDefault()
    if (newQuestion.trim()) {
      const newId = Math.max(...faqData.map(item => item.id)) + 1
      setFaqData([...faqData, { id: newId, question: newQuestion, answers: [] }])
      setNewQuestion('')
      toast.success('Votre question a été soumise avec succès.')
    }
  }

  const handleSubmitResponse = (questionId, answerId, response) => {
    setFaqData(faqData.map(question => 
      question.id === questionId
        ? {
            ...question,
            answers: question.answers.map(answer =>
              answer.id === answerId
                ? {
                    ...answer,
                    responses: [
                      ...answer.responses,
                      {
                        id: answer.responses.length + 1,
                        content: response,
                        author: "Utilisateur",
                        votes: 0
                      }
                    ]
                  }
                : answer
            )
          }
        : question
    ))
  }

  const toggleExpand = (questionId) => {
    setExpandedQuestions(prev => ({
      ...prev,
      [questionId]: !prev[questionId]
    }))
  }

  return (
    <div className="w-full max-w-3xl mx-auto space-y-8">
      <h2 className="text-2xl font-bold mb-6 text-[#007A53]">Foire aux Questions</h2>
      
      <Card className="p-6 border-[#8CC63F]">
        <h3 className="text-xl font-semibold mb-4 text-[#007A53]">Poser une nouvelle question</h3>
        <form onSubmit={handleSubmitQuestion} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="new-question">Votre question</Label>
            <Textarea 
              id="new-question" 
              placeholder="Entrez votre question ici" 
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              required 
            />
          </div>
          <Button type="submit" className="bg-[#007A53] hover:bg-[#006644]">Soumettre la question</Button>
        </form>
      </Card>

      <div className="space-y-6">
        {faqData.map((faq) => (
          <Card key={faq.id} className="p-6 border-[#8CC63F]">
            <h3 className="text-xl font-semibold mb-4 text-[#007A53]">{faq.question}</h3>
            {faq.answers.length > 0 && (
              <div className="mb-4">
                <div className="bg-gray-100 p-4 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="mb-2">{faq.answers[0].content}</p>
                      <p className="text-sm text-gray-600">Par {faq.answers[0].author}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleVote(faq.id, faq.answers[0].id, true)}>
                        <ThumbsUpIcon className="w-4 h-4 mr-1" />
                        {faq.answers[0].votes}
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleVote(faq.id, faq.answers[0].id, false)}>
                        <ThumbsDownIcon className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  {faq.answers[0].responses.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {faq.answers[0].responses.map((response) => (
                        <div key={response.id} className="bg-white p-2 rounded-lg">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="text-sm">{response.content}</p>
                              <p className="text-xs text-gray-600">Par {response.author}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button variant="ghost" size="sm" onClick={() => handleResponseVote(faq.id, faq.answers[0].id, response.id, true)}>
                                <ThumbsUpIcon className="w-3 h-3 mr-1" />
                                {response.votes}
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => handleResponseVote(faq.id, faq.answers[0].id, response.id, false)}>
                                <ThumbsDownIcon className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
            {faq.answers.length > 1 && (
              <div>
                <Button variant="link" onClick={() => toggleExpand(faq.id)} className="text-[#007A53]">
                  {expandedQuestions[faq.id] ? "Masquer les autres réponses" : "Voir plus de réponses"}
                  <ChevronRightIcon className="w-4 h-4 ml-1" />
                </Button>
                {expandedQuestions[faq.id] && (
                  <div className="mt-4 space-y-4">
                    {faq.answers.slice(1).map((answer) => (
                      <div key={answer.id} className="bg-gray-100 p-4 rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="mb-2">{answer.content}</p>
                            <p className="text-sm text-gray-600">Par {answer.author}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button variant="outline" size="sm" onClick={() => handleVote(faq.id, answer.id, true)}>
                              <ThumbsUpIcon className="w-4 h-4 mr-1" />
                              {answer.votes}
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleVote(faq.id, answer.id, false)}>
                              <ThumbsDownIcon className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        {answer.responses.length > 0 && (
                          <div className="mt-4 space-y-2">
                            {answer.responses.map((response) => (
                              <div key={response.id} className="bg-white p-2 rounded-lg">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <p className="text-sm">{response.content}</p>
                                    <p className="text-xs text-gray-600">Par {response.author}</p>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Button variant="ghost" size="sm" onClick={() => handleResponseVote(faq.id, answer.id, response.id, true)}>
                                      <ThumbsUpIcon className="w-3 h-3 mr-1" />
                                      {response.votes}
                                    </Button>
                                    <Button variant="ghost" size="sm" onClick={() => handleResponseVote(faq.id, answer.id, response.id, false)}>
                                      <ThumbsDownIcon className="w-3 h-3" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            <div className="mt-4">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <MessageCircleIcon className="w-4 h-4 mr-2" />
                    Répondre
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Répondre à la question</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={(e) => {
                    e.preventDefault()
                    const response = e.target.response.value
                    if (response.trim()) {
                      handleSubmitResponse(faq.id, faq.answers[0].id, response)
                      e.target.reset()
                    }
                  }} className="space-y-4">
                    <Textarea id="response" placeholder="Votre réponse" required />
                    <Button type="submit">Envoyer la réponse</Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

function QuiSommesNous() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-[#007A53]">Qui sommes-nous ?</h1>
      <Card className="p-6 border-[#8CC63F]">
        <CardContent>
          <p className="mb-4">Pro Top Terre est une entreprise leader dans le domaine des engrais et amendements naturels pour l'agriculture et les espaces verts. Fondée en 1990, notre mission est de fournir des solutions durables et respectueuses de l'environnement pour améliorer la qualité des sols et la croissance des plantes.</p>
          <p className="mb-4">Avec plus de 30 ans d'expérience, nous avons développé une gamme de produits innovants qui répondent aux besoins spécifiques des agriculteurs, des paysagistes et des jardiniers amateurs. Notre engagement envers la qualité et la durabilité nous a permis de devenir un acteur majeur sur le marché français et européen.</p>
          <p>Chez Pro Top Terre, nous croyons en l'importance de l'agriculture biologique et nous travaillons constamment à l'amélioration de nos produits pour répondre aux normes les plus strictes en matière d'agriculture durable.</p>
        </CardContent>
      </Card>
    </div>
  )
}

function NosSolutionsDeConditionnements() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-[#007A53]">Nos solutions de conditionnements</h1>
      <Card className="p-6 border-[#8CC63F]">
        <CardContent>
          <p className="mb-4">Chez Pro Top Terre, nous comprenons que chaque client a des besoins différents en termes de quantité et de stockage. C'est pourquoi nous proposons une variété de solutions de conditionnement pour nos produits :</p>
          <ul className="list-disc list-inside space-y-2 mb-4">
            <li>Sacs de 25 kg : Idéal pour les petites surfaces et les jardiniers amateurs</li>
            <li>Big bags de 500 kg et 1000 kg : Parfait pour les grandes exploitations agricoles</li>
            <li>Vrac : Pour les livraisons en grande quantité, directement sur votre exploitation</li>
            <li>Conditionnements spéciaux : Sur demande, pour répondre à vos besoins spécifiques</li>
          </ul>
          <p>Tous nos emballages sont conçus pour préserver la qualité de nos produits et faciliter leur utilisation. Nous utilisons des matériaux recyclables dans la mesure du possible, dans le cadre de notre engagement pour l'environnement.</p>
        </CardContent>
      </Card>
    </div>
  )
}

function NosValeurs() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-[#007A53]">Nos valeurs</h1>
      <Card className="p-6 border-[#8CC63F]">
        <CardContent>
          <p className="mb-4">Chez Pro Top Terre, nos valeurs sont au cœur de tout ce que nous faisons. Elles guident nos décisions, nos actions et nos relations avec nos clients, nos partenaires et notre environnement :</p>
          <ul className="list-disc list-inside space-y-2 mb-4">
            <li><strong>Durabilité :</strong> Nous nous engageons à développer des produits qui respectent l'environnement et contribuent à une agriculture durable.</li>
            <li><strong>Innovation :</strong> Nous investissons continuellement dans la recherche et le développement pour offrir des solutions toujours plus performantes et écologiques.</li>
            <li><strong>Qualité :</strong> Nous maintenons les plus hauts standards de qualité dans tous nos produits et services.</li>
            <li><strong>Intégrité :</strong> Nous agissons avec honnêteté et transparence dans toutes nos relations d'affaires.</li>
            <li><strong>Service client :</strong> Nous nous efforçons de fournir un service exceptionnel et un support personnalisé à tous nos clients.</li>
          </ul>
          <p>Ces valeurs ne sont pas seulement des mots pour nous. Elles sont intégrées dans chaque aspect de notre entreprise, de la production à la livraison, en passant par le service client.</p>
        </CardContent>
      </Card>
    </div>
  )
}

function NosClients() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-[#007A53]">Nos clients</h1>
      <Card className="p-6 border-[#8CC63F]">
        <CardContent>
          <p className="mb-4">Chez Pro Top Terre, nous sommes fiers de servir une clientèle diversifiée, allant des petits jardiniers amateurs aux grandes exploitations agricoles. Nos clients incluent :</p>
          <ul className="list-disc list-inside space-y-2 mb-4">
            <li><strong>Agriculteurs :</strong> Des exploitations de toutes tailles, spécialisées dans diverses cultures.</li>
            <li><strong>Paysagistes :</strong> Des professionnels qui créent et entretiennent des espaces verts publics et privés.</li>
            <li><strong>Collectivités locales :</strong> Pour l'entretien des espaces verts municipaux, parcs et jardins publics.</li>
            <li><strong>Jardineries :</strong> Qui distribuent nos produits aux jardiniers amateurs.</li>
            <li><strong>Particuliers :</strong> Des passionnés de jardinage qui cherchent des solutions naturelles pour leurs plantes.</li>
          </ul>
          <p className="mb-4">Nous sommes reconnaissants de la confiance que nos clients nous accordent et nous nous efforçons constamment d'améliorer nos produits et services pour répondre à leurs besoins changeants.</p>
          <p>Découvrez ci-dessous quelques témoignages de nos clients satisfaits :</p>
          <div className="mt-4 space-y-4">
            <Card className="p-4 bg-green-50">
              <p className="italic">"Les produits Pro Top Terre ont considérablement amélioré la qualité de nos sols. Nos rendements n'ont jamais été aussi bons !"</p>
              <p className="text-right">- Jean D., agriculteur biologique</p>
            </Card>
            <Card className="p-4 bg-green-50">
              <p className="italic">"En tant que paysagiste, je ne jure que par Pro Top Terre. Leurs engrais naturels donnent des résultats exceptionnels sur tous types de plantes."</p>
              <p className="text-right">- Marie L., paysagiste</p>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function FloatingCart() {
  const [isOpen, setIsOpen] = useState(false)
  const { items, removeItem, updateQuantity, clearCart } = useCartStore()

  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const handleConfirmOrder = () => {
    toast.success('Votre commande a été confirmée. Nous vous contacterons bientôt.')
    clearCart()
    setIsOpen(false)
  }

  if (items.length === 0) {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Button
        className="bg-[#8CC63F] hover:bg-[#7AB62F] text-white p-2 rounded-full shadow-lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        <ShoppingCartIcon className="w-6 h-6" />
        <span className="ml-2">{items.length}</span>
      </Button>
      {isOpen && (
        <Card className="absolute bottom-16 right-0 w-80 max-h-96 overflow-hidden">
          <CardHeader>
            <CardTitle>Votre panier</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)} className="absolute top-2 right-2">
              <XIcon className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent className="max-h-64 overflow-y-auto">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                  <Image src={item.image} alt={item.name} width={50} height={50} className="mr-2 rounded" />
                  <div>
                    <p className="font-medium">{he.decode(item.name)}</p>
                    <p className="text-sm text-gray-500">{item.price}€</p>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <div className="flex items-center">
                    <Button 
                      variant="outline"
                      size="sm"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      <MinusIcon className="w-4 h-4" />
                    </Button>
                    <Input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                      className="w-12 mx-1 text-center"
                      min="1"
                    />
                    <Button 
                      variant="outline"
                      size="sm"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      <PlusIcon className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
          <CardFooter className="flex flex-col items-stretch">
            <div className="flex justify-between items-center mb-4">
              <span className="font-bold">Total:</span>
              <span className="font-bold">{totalPrice.toFixed(2)}€</span>
            </div>
            <Button className="w-full bg-[#007A53] hover:bg-[#006644]" onClick={handleConfirmOrder}>
              Confirmer la commande
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}

function Maraicher({ setCurrentPage }) {
  const [products, setProducts] = useState([])
  const [blogEntries, setBlogEntries] = useState([])

  useEffect(() => {
    // Fetch products (this is a mock, replace with actual API call)
    setProducts([
      { id: 1, name: "Engrais Bio Maraîcher", price: 29.99, image: "https://source.unsplash.com/random/200x200?vegetable,fertilizer" },
      { id: 2, name: "Compost Spécial Légumes", price: 19.99, image: "https://source.unsplash.com/random/200x200?compost" },
      { id: 3, name: "Paillage Naturel", price: 14.99, image: "https://source.unsplash.com/random/200x200?mulch" },
    ])

    // Fetch blog entries (this is a mock, replace with actual API call)
    setBlogEntries([
      { id: 1, title: "Optimiser la rotation des cultures maraîchères", date: "2023-05-15" },
      { id: 2, title: "Les bienfaits de l'agriculture biologique pour le maraîchage", date: "2023-06-02" },
      { id: 3, title: "Gestion de l'eau en maraîchage : techniques innovantes", date: "2023-06-20" },
    ])
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 text-sm text-gray-500">
        <Button variant="link" className="p-0" onClick={() => setCurrentPage('home')}>
          Accueil
        </Button>
        <ChevronRightIcon className="w-4 h-4" />
        <span>Maraîcher</span>
      </div>

      <Button variant="outline" onClick={() => setCurrentPage('home')} className="mb-4">
        <ChevronLeftIcon className="w-4 h-4 mr-2" />
        Retour à l'accueil
      </Button>

      <div className="relative h-[300px] bg-cover bg-center" style={{backgroundImage: "url('https://source.unsplash.com/random/1600x900?vegetable,farm')"}}>
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <h1 className="text-4xl font-bold text-white text-center">Solutions pour Maraîchers</h1>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-[#007A53] mt-8">Nos produits pour maraîchers</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <Card key={product.id}>
            <CardHeader>
              <Image src={product.image} alt={product.name} width={200} height={200} className="w-full h-48 object-cover" />
            </CardHeader>
            <CardContent>
              <h3 className="text-lg font-semibold">{product.name}</h3>
              <p className="text-[#007A53] font-bold">{product.price} €</p>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-[#8CC63F] hover:bg-[#7AB62F]">Ajouter au panier</Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <h2 className="text-2xl font-bold text-[#007A53] mt-8">Articles de blog pour maraîchers</h2>
      <ul className="space-y-2">
        {blogEntries.map((entry) => (
          <li key={entry.id}>
            <a href="#" className="text-[#007A53] hover:underline">
              {entry.title} - {new Date(entry.date).toLocaleDateString()}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

function Arboriculteur({ setCurrentPage }) {
  const [products, setProducts] = useState([])
  const [blogEntries, setBlogEntries] = useState([])

  useEffect(() => {
    // Fetch products (this is a mock, replace with actual API call)
    setProducts([
      { id: 1, name: "Engrais Bio Arbres Fruitiers", price: 34.99, image: "https://source.unsplash.com/random/200x200?fruit,tree,fertilizer" },
      { id: 2, name: "Traitement Naturel Anti-Parasites", price: 24.99, image: "https://source.unsplash.com/random/200x200?organic,pesticide" },
      { id: 3, name: "Paillage pour Vergers", price: 19.99, image: "https://source.unsplash.com/random/200x200?orchard,mulch" },
    ])

    // Fetch blog entries (this is a mock, replace with actual API call)
    setBlogEntries([
      { id: 1, title: "La taille des arbres fruitiers : guide complet", date: "2023-05-10" },
      { id: 2, title: "Lutte biologique contre les ravageurs en arboriculture", date: "2023-06-05" },
      { id: 3, title: "Optimiser la pollinisation dans les vergers", date: "2023-06-25" },
    ])
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 text-sm text-gray-500">
        <Button variant="link" className="p-0" onClick={() => setCurrentPage('home')}>
          Accueil
        </Button>
        <ChevronRightIcon className="w-4 h-4" />
        <span>Arboriculteur</span>
      </div>

      <Button variant="outline" onClick={() => setCurrentPage('home')} className="mb-4">
        <ChevronLeftIcon className="w-4 h-4 mr-2" />
        Retour à l'accueil
      </Button>

      <div className="relative h-[300px] bg-cover bg-center" style={{backgroundImage: "url('https://source.unsplash.com/random/1600x900?orchard,fruit,trees')"}}>
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <h1 className="text-4xl font-bold text-white text-center">Solutions pour Arboriculteurs</h1>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-[#007A53] mt-8">Nos produits pour arboriculteurs</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <Card key={product.id}>
            <CardHeader>
              <Image src={product.image} alt={product.name} width={200} height={200} className="w-full h-48 object-cover" />
            </CardHeader>
            <CardContent>
              <h3 className="text-lg font-semibold">{product.name}</h3>
              <p className="text-[#007A53] font-bold">{product.price} €</p>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-[#8CC63F] hover:bg-[#7AB62F]">Ajo uter au panier</Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <h2 className="text-2xl font-bold text-[#007A53] mt-8">Articles de blog pour arboriculteurs</h2>
      <ul className="space-y-2">
        {blogEntries.map((entry) => (
          <li key={entry.id}>
            <a href="#" className="text-[#007A53] hover:underline">
              {entry.title} - {new Date(entry.date).toLocaleDateString()}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

function Viticulteur({ setCurrentPage }) {
  const [products, setProducts] = useState([])
  const [blogEntries, setBlogEntries] = useState([])

  useEffect(() => {
    // Fetch products (this is a mock, replace with actual API call)
    setProducts([
      { id: 1, name: "Engrais Bio Vignes", price: 39.99, image: "https://source.unsplash.com/random/200x200?vineyard,fertilizer" },
      { id: 2, name: "Traitement Naturel Anti-Mildiou", price: 29.99, image: "https://source.unsplash.com/random/200x200?grape,disease" },
      { id: 3, name: "Paillage pour Vignobles", price: 24.99, image: "https://source.unsplash.com/random/200x200?vineyard,mulch" },
    ])

    // Fetch blog entries (this is a mock, replace with actual API call)
    setBlogEntries([
      { id: 1, title: "La viticulture biodynamique : principes et pratiques", date: "2023-05-20" },
      { id: 2, title: "Gestion durable de l'eau dans les vignobles", date: "2023-06-10" },
      { id: 3, title: "L'impact du changement climatique sur la viticulture", date: "2023-06-30" },
    ])
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 text-sm text-gray-500">
        <Button variant="link" className="p-0" onClick={() => setCurrentPage('home')}>
          Accueil
        </Button>
        <ChevronRightIcon className="w-4 h-4" />
        <span>Viticulteur</span>
      </div>

      <Button variant="outline" onClick={() => setCurrentPage('home')} className="mb-4">
        <ChevronLeftIcon className="w-4 h-4 mr-2" />
        Retour à l'accueil
      </Button>

      <div className="relative h-[300px] bg-cover bg-center" style={{backgroundImage: "url('https://source.unsplash.com/random/1600x900?vineyard,grapes')"}}>
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <h1 className="text-4xl font-bold text-white text-center">Solutions pour Viticulteurs</h1>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-[#007A53] mt-8">Nos produits pour viticulteurs</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <Card key={product.id}>
            <CardHeader>
              <Image src={product.image} alt={product.name} width={200} height={200} className="w-full h-48 object-cover" />
            </CardHeader>
            <CardContent>
              <h3 className="text-lg font-semibold">{product.name}</h3>
              <p className="text-[#007A53] font-bold">{product.price} €</p>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-[#8CC63F] hover:bg-[#7AB62F]">Ajouter au panier</Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <h2 className="text-2xl font-bold text-[#007A53] mt-8">Articles de blog pour viticulteurs</h2>
      <ul className="space-y-2">
        {blogEntries.map((entry) => (
          <li key={entry.id}>
            <a href="#" className="text-[#007A53] hover:underline">
              {entry.title} - {new Date(entry.date).toLocaleDateString()}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

function Paysagiste({ setCurrentPage }) {
  const [products, setProducts] = useState([])
  const [blogEntries, setBlogEntries] = useState([])

  useEffect(() => {
    // Fetch products (this is a mock, replace with actual API call)
    setProducts([
      { id: 1, name: "Engrais Bio Gazon", price: 27.99, image: "https://source.unsplash.com/random/200x200?lawn,fertilizer" },
      { id: 2, name: "Terreau Universel", price: 19.99, image: "https://source.unsplash.com/random/200x200?soil,potting" },
      { id: 3, name: "Paillage Décoratif", price: 22.99, image: "https://source.unsplash.com/random/200x200?decorative,mulch" },
    ])

    // Fetch blog entries (this is a mock, replace with actual API call)
    setBlogEntries([
      { id: 1, title: "Création de jardins écologiques : tendances et techniques", date: "2023-05-25" },
      { id: 2, title: "La gestion durable des espaces verts urbains", date: "2023-06-15" },
      { id: 3, title: "Plantes résistantes à la sécheresse pour l'aménagement paysager", date: "2023-07-05" },
    ])
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 text-sm text-gray-500">
        <Button variant="link" className="p-0" onClick={() => setCurrentPage('home')}>
          Accueil
        </Button>
        <ChevronRightIcon className="w-4 h-4" />
        <span>Paysagiste</span>
      </div>

      <Button variant="outline" onClick={() => setCurrentPage('home')} className="mb-4">
        <ChevronLeftIcon className="w-4 h-4 mr-2" />
        Retour à l'accueil
      </Button>

      <div className="relative h-[300px] bg-cover bg-center" style={{backgroundImage: "url('https://source.unsplash.com/random/1600x900?landscape,garden')"}}>
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <h1 className="text-4xl font-bold text-white text-center">Solutions pour Paysagistes</h1>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-[#007A53] mt-8">Nos produits pour paysagistes</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <Card key={product.id}>
            <CardHeader>
              <Image src={product.image} alt={product.name} width={200} height={200} className="w-full h-48 object-cover" />
            </CardHeader>
            <CardContent>
              <h3 className="text-lg font-semibold">{product.name}</h3>
              <p className="text-[#007A53] font-bold">{product.price} €</p>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-[#8CC63F] hover:bg-[#7AB62F]">Ajouter au panier</Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <h2 className="text-2xl font-bold text-[#007A53] mt-8">Articles de blog pour paysagistes</h2>
      <ul className="space-y-2">
        {blogEntries.map((entry) => (
          <li key={entry.id}>
            <a href="#" className="text-[#007A53] hover:underline">
              {entry.title} - {new Date(entry.date).toLocaleDateString()}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function Component() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [currentPage, setCurrentPage] = useState('home')

  const handleLogin = () => {
    setIsLoggedIn(true)
    toast.success('Connexion réussie. Bienvenue sur Pro Top Terre!')
  }

  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />
  }

  return (
    <div className="min-h-screen bg-white">
      <Toaster />
      <Header setCurrentPage={setCurrentPage} setIsLoggedIn={setIsLoggedIn} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {currentPage === 'home' && <WelcomePage setCurrentPage={setCurrentPage} />}
        {currentPage === 'passer-commande' && <PasserCommande />}
        {currentPage.startsWith('products-') && <NosProduits category={currentPage.replace('products-', '')} />}
        {currentPage === 'conseils-espaces-verts' && <ConseilsUtilisation category="espaces-verts" />}
        {currentPage === 'conseils-agriculture' && <ConseilsUtilisation category="agriculture" />}
        {currentPage === 'actualites' && <Actualites subpage="calendrier-cultures" />}
        {currentPage === 'mon-compte' && <MonCompte />}
        {currentPage === 'contact' && <Contact />}
        {currentPage === 'faq' && <FoireAuxQuestions />}
        {currentPage === 'qui-sommes-nous' && <QuiSommesNous />}
        {currentPage === 'nos-solutions-de-conditionnements' && <NosSolutionsDeConditionnements />}
        {currentPage === 'nos-valeurs' && <NosValeurs />}
        {currentPage === 'nos-clients' && <NosClients />}
        {currentPage === 'maraicher' && <Maraicher setCurrentPage={setCurrentPage} />}
        {currentPage === 'arboriculteur' && <Arboriculteur setCurrentPage={setCurrentPage} />}
        {currentPage === 'viticulteur' && <Viticulteur setCurrentPage={setCurrentPage} />}
        {currentPage === 'paysagiste' && <Paysagiste setCurrentPage={setCurrentPage} />}
      </main>

      <FloatingCart />
    </div>
  )
}'use client'

import React, { useState, useEffect } from 'react'
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Toaster, toast } from 'sonner'
import { Textarea } from "@/components/ui/textarea"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import {
  StarIcon,
  HomeIcon,
  ShoppingCartIcon,
  MessageSquareIcon,
  UserIcon,
  LeafIcon,
  BookOpenIcon,
  PackageIcon,
  NewspaperIcon,
  HelpCircleIcon,
  PhoneIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  SearchIcon,
  PrinterIcon,
  PlusIcon,
  MinusIcon,
  MapPinIcon,
  CreditCardIcon,
  CopyIcon,
  ThumbsUpIcon,
  ThumbsDownIcon,
  FlagIcon,
  HistoryIcon,
  MessageCircleIcon,
  ChevronRightIcon,
  LogOutIcon,
  MenuIcon,
  XIcon,
  CalendarIcon,
  GridIcon,
  ListIcon,
  FilterIcon,
} from "lucide-react"
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import he from 'he'

interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
  image: string
}

interface CartStore {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (id: number) => void
  updateQuantity: (id: number, quantity: number) => void
  clearCart: () => void
}

const useCartStore = create(
  persist<CartStore>(
    (set) => ({
      items: [],
      addItem: (item) =>
        set((state) => {
          const existingItem = state.items.find((i) => i.id === item.id)
          if (existingItem) {
            return {
              items: state.items.map((i) =>
                i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
              ),
            }
          }
          return { items: [...state.items, item] }
        }),
      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
        })),
      updateQuantity: (id, quantity) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.id === id ? { ...i, quantity } : i
          ),
        })),
      clearCart: () => set({ items: [] }),
    }),
    {
      name: 'cart-storage',
      getStorage: () => localStorage,
    }
  )
)

const categoriesData = [
  { id: 32, name: "Nos Amendements", slug: "nos-amendements-calcaires-naturels", description: "Découvrez ici tous nos amendements calcaires 100% naturels, afin de structurer votre sol et ainsi obtenir une meilleure assimilation des éléments nutritifs !" },
  { id: 31, name: "Nos Engrais", slug: "nos-engrais-naturels", description: "Découvrez ici tous nos engrais 100% Bio et naturels fabriqués en France à partir de matières organiques." },
  { id: 24, name: "ProBioMer", slug: "probiomer-amendement-calcaire-naturel", description: "Grâce à sa formule pH Océan, Probiomer stabilise le pH du sol et anticipe l'apparition de mousse sur le gazon." },
  { id: 30, name: "Probiomus", slug: "probiomus-engrais-fumier-bovin-volaille", description: "Fabriqué à partir de fumier de bovin, de volaille et de cheval, Probiomus est idéal pour le renforcement des sols, les plantations en pleine terre, la préparation des terres de potager et pour la création des gazons." },
  { id: 23, name: "ProBioTerre", slug: "probioterre-engrais-naturel-polyvalent", description: "L'engrais naturel polyvalent ProBioTerre est fabriqué en France à partir de matières organiques." }
]

function Header({ setCurrentPage, setIsLoggedIn }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <header className="bg-[#007A53] text-white shadow">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Button
              variant="ghost"
              className="text-white hover:bg-[#006644] p-2 flex items-center mr-2"
              onClick={() => setCurrentPage('home')}
              aria-label="Accueil Pro Top Terre"
            >
              <Image src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/fleur-pro-bio-terre-0xWPf3ZkYGilZfLPDyssvv6y3WE8qt.png" alt="Pro Top Terre Logo" width={40} height={40} />
              <span className="text-sm font-medium ml-2">Pro Top Terre</span>
            </Button>
            <nav className="hidden md:flex space-x-1">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="text-white hover:bg-[#006644] text-sm px-2">
                    <HistoryIcon className="w-4 h-4 mr-1" />
                    Histoire
                    <ChevronDownIcon className="w-4 h-4 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-[#007A53]">
                  <DropdownMenuItem onSelect={() => setCurrentPage('qui-sommes-nous')} className="text-white hover:bg-[#006644]">
                    Qui sommes nous ?
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setCurrentPage('nos-solutions-de-conditionnements')} className="text-white hover:bg-[#006644]">
                    Nos solutions de conditionnements
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setCurrentPage('nos-valeurs')} className="text-white hover:bg-[#006644]">
                    Nos valeurs
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setCurrentPage('nos-clients')} className="text-white hover:bg-[#006644]">
                    Nos clients
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="text-white hover:bg-[#006644] text-sm px-2">
                    <PackageIcon className="w-4 h-4 mr-1" />
                    Nos produits
                    <ChevronDownIcon className="w-4 h-4 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-[#007A53]">
                  {categoriesData.map((category) => (
                    <DropdownMenuItem key={category.id} onSelect={() => setCurrentPage(`products-${category.slug}`)} className="text-white hover:bg-[#006644]">
                      {category.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <Button variant="ghost" className="text-white hover:bg-[#006644] text-sm px-2" onClick={() => setCurrentPage('actualites')}>
                <NewspaperIcon className="w-4 h-4 mr-1" />
                Actualités
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="text-white hover:bg-[#006644] text-sm px-2">
                    <BookOpenIcon className="w-4 h-4 mr-1" />
                    Conseils
                    <ChevronDownIcon className="w-4 h-4 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-[#007A53]">
                  <DropdownMenuItem onSelect={() => setCurrentPage('conseils-espaces-verts')} className="text-white hover:bg-[#006644]">
                    Espaces verts
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setCurrentPage('conseils-agriculture')} className="text-white hover:bg-[#006644]">
                    Agriculture
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button variant="ghost" className="text-white hover:bg-[#006644] text-sm px-2" onClick={() => setCurrentPage('contact')}>
                <PhoneIcon className="w-4 h-4 mr-1" />
                Contact
              </Button>
              <Button variant="ghost" className="text-white hover:bg-[#006644] text-sm px-2" onClick={() => setCurrentPage('faq')}>
                <HelpCircleIcon className="w-4 h-4 mr-1" />
                FAQ
              </Button>
            </nav>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="ghost" className="text-white hover:bg-[#006644] text-sm px-2" onClick={() => setCurrentPage('passer-commande')}>
              <ShoppingCartIcon className="w-4 h-4 mr-1" />
              Passer commande
            </Button>
            <Button variant="ghost" className="text-white hover:bg-[#006644] text-sm px-2" onClick={() => setCurrentPage('mon-compte')}>
              Mon compte
            </Button>
            <Button variant="ghost" className="text-white hover:bg-[#006644] p-2" onClick={() => setIsLoggedIn(false)} aria-label="Déconnexion">
              <LogOutIcon className="w-5 h-5" />
            </Button>
            <Button variant="ghost" className="md:hidden text-white hover:bg-[#006644] p-2" onClick={toggleMenu} aria-label="Menu">
              <MenuIcon className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden bg-[#007A53] py-2">
          <nav className="flex flex-col space-y-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-white hover:bg-[#006644] text-sm px-2 w-full text-left">
                  <HistoryIcon className="w-4 h-4 mr-1" />
                  Histoire
                  <ChevronDownIcon className="w-4 h-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-[#007A53]">
                <DropdownMenuItem onSelect={() => { setCurrentPage('qui-sommes-nous'); setIsMenuOpen(false); }} className="text-white hover:bg-[#006644]">
                  Qui sommes nous ?
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => { setCurrentPage('nos-solutions-de-conditionnements'); setIsMenuOpen(false); }} className="text-white hover:bg-[#006644]">
                  Nos solutions de conditionnements
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => { setCurrentPage('nos-valeurs'); setIsMenuOpen(false); }} className="text-white hover:bg-[#006644]">
                  Nos valeurs
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => { setCurrentPage('nos-clients'); setIsMenuOpen(false); }} className="text-white hover:bg-[#006644]">
                  Nos clients
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-white hover:bg-[#006644] text-sm px-2 w-full text-left">
                  <PackageIcon className="w-4 h-4 mr-1" />
                  Nos produits
                  <ChevronDownIcon className="w-4 h-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-[#007A53]">
                {categoriesData.map((category) => (
                  <DropdownMenuItem key={category.id} onSelect={() => { setCurrentPage(`products-${category.slug}`); setIsMenuOpen(false); }} className="text-white hover:bg-[#006644]">
                    {category.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="ghost" className="text-white hover:bg-[#006644] text-sm px-2 w-full text-left" onClick={() => { setCurrentPage('actualites'); setIsMenuOpen(false); }}>
              <NewspaperIcon className="w-4 h-4 mr-1" />
              Actualités
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-white hover:bg-[#006644] text-sm px-2 w-full text-left">
                  <BookOpenIcon className="w-4 h-4 mr-1" />
                  Conseils
                  <ChevronDownIcon className="w-4 h-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-[#007A53]">
                <DropdownMenuItem onSelect={() => { setCurrentPage('conseils-espaces-verts'); setIsMenuOpen(false); }} className="text-white hover:bg-[#006644]">
                  Espaces verts
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => { setCurrentPage('conseils-agriculture'); setIsMenuOpen(false); }} className="text-white hover:bg-[#006644]">
                  Agriculture
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="ghost" className="text-white hover:bg-[#006644] text-sm px-2 w-full text-left" onClick={() => { setCurrentPage('contact'); setIsMenuOpen(false); }}>
              <PhoneIcon className="w-4 h-4 mr-1" />
              Contact
            </Button>
            <Button variant="ghost" className="text-white hover:bg-[#006644] text-sm px-2 w-full text-left" onClick={() => { setCurrentPage('faq'); setIsMenuOpen(false); }}>
              <HelpCircleIcon className="w-4 h-4 mr-1" />
              FAQ
            </Button>
          </nav>
        </div>
      )}
    </header>
  )
}

const useRotatingImage = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const images = [
    "https://images.unsplash.com/photo-1486754735734-325b5831c3ad?q=80&w=1920&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1529313780224-1a12b68bed16?q=80&w=2048&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=4032&auto=format&fit=crop"
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return images[currentImageIndex]
}

function LoginPage({ onLogin }) {
  const [isSignupOpen, setIsSignupOpen] = useState(false)
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false)
  const [email, setEmail] = useState('test@example.com')
  const [password, setPassword] = useState('1234')
  const backgroundImage = useRotatingImage()

  const handleSignupSubmit = (e) => {
    e.preventDefault()
    setIsSignupOpen(false)
    setIsConfirmationOpen(true)
  }

  const handleLogin = (e) => {
    e.preventDefault()
    if (email && password) {
      onLogin()
    } else {
      toast.error('Veuillez remplir tous les champs.')
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-cover bg-center transition-all duration-1000 ease-in-out" style={{backgroundImage: `url('${backgroundImage}')`}}>
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <Image src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/fleur-pro-bio-terre-0xWPf3ZkYGilZfLPDyssvv6y3WE8qt.png" alt="Pro Top Terre Logo" width={40} height={40} />
        <span className="text-xl font-bold text-white ml-2">Pro Top Terre</span>
      </header>
      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-sm space-y-4 p-6 bg-white bg-opacity-90">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold text-[#007A53]">Connexion</h1>
            <p className="text-gray-600">Entrez vos identifiants pour accéder au portail</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                placeholder="Email" 
                required 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input 
                id="password" 
                placeholder="Mot de passe" 
                required 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full bg-[#007A53] hover:bg-[#006644]">Se connecter</Button>
          </form>
          <div className="text-center">
            <Dialog open={isSignupOpen} onOpenChange={setIsSignupOpen}>
              <DialogTrigger asChild>
                <Button variant="link" className="text-[#007A53] hover:text-[#006644]">
                  Demander l'accès
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Demande d'accès</DialogTitle>
                  <DialogDescription>
                    Remplissez ce formulaire pour demander l'accès à Pro Top Terre.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSignupSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Nom</Label>
                    <Input id="signup-name" placeholder="Votre nom" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input id="signup-email" placeholder="Votre email" required type="email" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-company">Entreprise</Label>
                    <Input id="signup-company" placeholder="Nom de votre entreprise" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-type">Type de compte</Label>
                    <Select required>
                      <SelectTrigger id="signup-type">
                        <SelectValue placeholder="Sélectionnez un type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="company">Entreprise</SelectItem>
                        <SelectItem value="consumer">Particulier</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button type="submit" className="w-full bg-[#007A53] hover:bg-[#006644]">
                    Envoyer la demande
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
            <Dialog open={isConfirmationOpen} onOpenChange={setIsConfirmationOpen}>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Demande envoyée</DialogTitle>
                  <DialogDescription>
                    Merci pour votre demande d'accès. Nous vous contacterons bientôt. Veuillez vérifier votre email dans les prochains jours.
                  </DialogDescription>
                </DialogHeader>
                <Button onClick={() => setIsConfirmationOpen(false)} className="w-full bg-[#007A53] hover:bg-[#006644]">
                  Fermer
                </Button>
              </DialogContent>
            </Dialog>
          </div>
        </Card>
      </main>
    </div>
  )
}

function WelcomePage({ setCurrentPage }) {
  return (
    <div className="space-y-6">
      <div className="relative h-[400px] bg-cover bg-center" style={{backgroundImage: "url('https://source.unsplash.com/random/1600x900?agriculture,farm')"}}>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/fleur-pro-bio-terre-0xWPf3ZkYGilZfLPDyssvv6y3WE8qt.png"
            alt="Pro Top Terre Logo"
            width={300}
            height={100}
            className="z-10"
          />
        </div>
      </div>
      <h1 className="text-3xl font-bold text-[#007A53] text-center">Découvrez nos produits pour chacun de vos besoins :</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Button
          className="h-32 bg-[#8CC63F] hover:bg-[#7AB62F] text-white flex flex-col items-center justify-center"
          onClick={() => setCurrentPage('maraicher')}
        >
          <Image src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/poivron-pro-bio-terre-JxptJpAPhkFABKnyfGA19g94WNAS4L.png" alt="Maraîcher" width={50} height={50} />
          <span className="mt-2">Maraîcher</span>
        </Button>
        <Button
          className="h-32 bg-[#8CC63F] hover:bg-[#7AB62F] text-white flex flex-col items-center justify-center"
          onClick={() => setCurrentPage('arboriculteur')}
        >
          <Image src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/branche-pro-bio-terre-Ce6CRXNpQy0HnqnsLL2BmUUZFmFhie.png" alt="Arboriculteur" width={50} height={50} />
          <span className="mt-2">Arboriculteur</span>
        </Button>
        <Button
          className="h-32 bg-[#8CC63F] hover:bg-[#7AB62F] text-white flex flex-col items-center justify-center"
          onClick={() => setCurrentPage('viticulteur')}
        >
          <Image src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/branche-pro-bio-terre-Ce6CRXNpQy0HnqnsLL2BmUUZFmFhie.png" alt="Viticulteur" width={50} height={50} />
          <span className="mt-2">Viticulteur</span>
        </Button>
        <Button
          className="h-32 bg-[#8CC63F] hover:bg-[#7AB62F] text-white flex flex-col items-center justify-center"
          onClick={() => setCurrentPage('paysagiste')}
        >
          <Image src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/fleur-pro-bio-terre-0xWPf3ZkYGilZfLPDyssvv6y3WE8qt.png" alt="Paysagiste" width={50} height={50} />
          <span className="mt-2">Paysagiste</span>
        </Button>
      </div>
      <SaisonnaliteDesCultures />
    </div>
  )
}

function SaisonnaliteDesCultures() {
  const [crops, setCrops] = useState<Crop[]>(cropsData)
  const [filter, setFilter] = useState({ type: '', season: '', region: '' })
  const [searchTerm, setSearchTerm] = useState('')
  const [view, setView] = useState<'card' | 'list'>('card')
  const [selectedCrop, setSelectedCrop] = useState<Crop | null>(null)

  useEffect(() => {
    const filteredCrops = cropsData.filter(crop => 
      crop.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filter.type === '' || crop.type === filter.type) &&
      (filter.season === '' || crop.season === filter.season) &&
      (filter.region === '' || crop.region === filter.region)
    )
    setCrops(filteredCrops)
  }, [searchTerm, filter])

  const uniqueTypes = Array.from(new Set(cropsData.map(crop => crop.type)))
  const uniqueSeasons = Array.from(new Set(cropsData.map(crop => crop.season)))
  const uniqueRegions = Array.from(new Set(cropsData.map(crop => crop.region)))

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-[#007A53]">Saisonnalité des cultures</h2>
      
      <div className="flex flex-wrap gap-4 items-center">
        <Input
          placeholder="Rechercher une culture..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-xs"
        />
        <Select onValueChange={(value) => setFilter({ ...filter, type: value })}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Type de culture" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Tous les types</SelectItem>
            {uniqueTypes.map(type => (
              <SelectItem key={type} value={type}>{type}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select onValueChange={(value) => setFilter({ ...filter, season: value })}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Saison" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Toutes les saisons</SelectItem>
            {uniqueSeasons.map(season => (
              <SelectItem key={season} value={season}>{season}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select onValueChange={(value) => setFilter({ ...filter, region: value })}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Région" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Toutes les régions</SelectItem>
            {uniqueRegions.map(region => (
              <SelectItem key={region} value={region}>{region}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button variant="outline" onClick={() => setView('card')} className={view === 'card' ? 'bg-[#007A53] text-white' : ''}>
          <GridIcon className="w-4 h-4 mr-2" />
          Cartes
        </Button>
        <Button variant="outline" onClick={() => setView('list')} className={view === 'list' ? 'bg-[#007A53] text-white' : ''}>
          <ListIcon className="w-4 h-4 mr-2" />
          Liste
        </Button>
      </div>

      {view === 'card' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {crops.map((crop) => (
            <Card key={crop.id} className="overflow-hidden">
              <CardHeader className="p-0">
                <Image src={crop.image} alt={crop.name} width={400} height={300} className="w-full h-48 object-cover" />
              </CardHeader>
              <CardContent className="p-4">
                <CardTitle>{crop.name}</CardTitle>
                <p className="text-sm text-gray-500">{crop.type} - {crop.season}</p>
                <p className="text-sm text-gray-500">{crop.region}</p>
              </CardContent>
              <CardFooter>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full" onClick={() => setSelectedCrop(crop)}>Voir détails</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{selectedCrop?.name}</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4">
                      <Image src={selectedCrop?.image || ''} alt={selectedCrop?.name || ''} width={400} height={300} className="w-full h-48 object-cover rounded-lg" />
                      <p><strong>Type:</strong> {selectedCrop?.type}</p>
                      <p><strong>Saison:</strong> {selectedCrop?.season}</p>
                      <p><strong>Région:</strong> {selectedCrop?.region}</p>
                      <p>{selectedCrop?.description}</p>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Saison</TableHead>
              <TableHead>Région</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {crops.map((crop) => (
              <TableRow key={crop.id}>
                <TableCell>{crop.name}</TableCell>
                <TableCell>{crop.type}</TableCell>
                <TableCell>{crop.season}</TableCell>
                <TableCell>{crop.region}</TableCell>
                <TableCell>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" onClick={() => setSelectedCrop(crop)}>Voir détails</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{selectedCrop?.name}</DialogTitle>
                      </DialogHeader>
                      <div className="grid gap-4">
                        <Image src={selectedCrop?.image || ''} alt={selectedCrop?.name || ''} width={400} height={300} className="w-full h-48 object-cover rounded-lg" />
                        <p><strong>Type:</strong> {selectedCrop?.type}</p>
                        <p><strong>Saison:</strong> {selectedCrop?.season}</p>
                        <p><strong>Région:</strong> {selectedCrop?.region}</p>
                        <p>{selectedCrop?.description}</p>
                      </div>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  )
}

type Crop = {
  id: number
  name: string
  type: string
  season: string
  region: string
  image: string
  description: string
}

const cropsData: Crop[] = [
  { id: 1, name: "Blé", type: "Céréales", season: "Été", region: "Beauce", image: "https://source.unsplash.com/random/400x300?wheat", description: "Le blé est une céréale majeure cultivée en France, principalement dans la région de la Beauce." },
  { id: 2, name: "Melon", type: "Fruits", season: "Été", region: "Provence", image: "https://source.unsplash.com/random/400x300?melon", description: "Le melon est un fruit d'été populaire, cultivé principalement dans le sud de la France." },
  { id: 3, name: "Citron", type: "Fruits", season: "Hiver", region: "Côte d'Azur", image: "https://source.unsplash.com/random/400x300?lemon", description: "Le citron est un agrume cultivé principalement sur la Côte d'Azur, disponible en hiver." },
  { id: 4, name: "Fraises", type: "Fruits", season: "Printemps", region: "Val de Loire", image: "https://source.unsplash.com/random/400x300?strawberry", description: "Les fraises sont des fruits de printemps, cultivés notamment dans la région du Val de Loire." },
  { id: 5, name: "Tomates", type: "Légumes", season: "Été", region: "Provence", image: "https://source.unsplash.com/random/400x300?tomato", description: "Les tomates sont des légumes d'été très populaires, cultivés dans diverses régions, notamment en Provence." },
  { id: 6, name: "Pommes", type: "Fruits", season: "Automne", region: "Normandie", image: "https://source.unsplash.com/random/400x300?apple", description: "Les pommes sont des fruits d'automne, avec une production importante en Normandie." },
  { id: 7, name: "Carottes", type: "Légumes", season: "Toute l'année", region: "Bretagne", image: "https://source.unsplash.com/random/400x300?carrot", description: "Les carottes sont cultivées toute l'année, avec une production notable en Bretagne." },
  { id: 8, name: "Lavande", type: "Plantes", season: "Été", region: "Provence", image: "https://source.unsplash.com/random/400x300?lavender", description: "La lavande est une plante emblématique de la Provence, fleurissant en été." }
]

function OrderConfirmationDialog({ isOpen, onClose, onConfirm, userInfo, cart }) {
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Confirmer la demande</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Nom
            </Label>
            <Input id="name" value={userInfo.name} className="col-span-3" readOnly />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input id="email" value={userInfo.email} className="col-span-3" readOnly />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="address" className="text-right">
              Adresse
            </Label>
            <Textarea id="address" value={userInfo.address} className="col-span-3" readOnly />
          </div>
          <div className="border-t pt-4">
            <h3 className="font-semibold mb-2">Récapitulatif de la commande</h3>
            {cart.map((item) => (
              <div key={item.id} className="flex justify-between items-center mb-2">
                <span>{item.name}</span>
                <span>{item.quantity} x {item.price}€</span>
              </div>
            ))}
            <div className="border-t pt-2 mt-2">
              <div className="flex justify-between items-center font-semibold">
                <span>Total</span>
                <span>{totalPrice.toFixed(2)}€</span>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Annuler</Button>
          <Button onClick={onConfirm} className="bg-[#007A53] hover:bg-[#006644]">Confirmer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function PasserCommande() {
  const [productsData, setProductsData] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false)
  const [userInfo, setUserInfo] = useState({ name: 'John Doe', email: 'john@example.com', address: '123 Main St, City, Country' })
  const [isLoading, setIsLoading] = useState(true)

  const { items: cart, addItem, removeItem, updateQuantity, clearCart } = useCartStore()

  useEffect(() => {
    setIsLoading(true)
    fetch('https://www.regalterre.com/wp-json/wc/store/products')
      .then(response => response.json())
      .then(data => {
        setProductsData(data)
        setIsLoading(false)
      })
      .catch(error => {
        console.error('Error fetching products:', error)
        setIsLoading(false)
      })
  }, [])

  const addToCart = (product) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.prices.price,
      quantity: 1,
      image: product.images[0].src
    })
  }

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const filteredProducts = productsData.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.short_description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleConfirmOrder = () => {
    setIsConfirmationOpen(false)
    toast.success('Votre demande a été confirmée. Nous vous contacterons bientôt.')
    clearCart()
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="w-full lg:w-3/4">
        <h1 className="text-3xl font-bold text-[#007A53] mb-6">Passer commande / Nouveau devis</h1>
        <div className="mb-4">
          <div className="relative">
            <Input
              type="text"
              placeholder="Rechercher des produits..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#007A53]"></div>
          </div>
        ) : (
          categoriesData.map((category) => {
            const categoryProducts = filteredProducts.filter(product =>
              product.categories.some(cat => cat.id === category.id)
            )

            if (categoryProducts.length === 0) return null

            return (
              <div key={category.id} className="mb-8">
                <h2 className="text-2xl font-semibold text-[#007A53] mb-4">{category.name}</h2>
                <Card className="overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[100px]">Image</TableHead>
                        <TableHead>Produit</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead className="text-right">Prix</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {categoryProducts.map((product) => (
                        <TableRow key={product.id}>
                          <TableCell>
                            <Image
                              src={product.images[0].src}
                              alt={product.name}
                              width={64}
                              height={64}
                              className="object-cover rounded"
                            />
                          </TableCell>
                          <TableCell className="font-medium">{he.decode(product.name)}</TableCell>
                          <TableCell>
                            <div dangerouslySetInnerHTML={{ __html: product.short_description }} className="line-clamp-2" />
                          </TableCell>
                          <TableCell className="text-right">
                            {product.prices.price}€
                          </TableCell>
                          <TableCell className="text-right">
                            <Button onClick={() => addToCart(product)} size="sm" className="bg-[#8CC63F] hover:bg-[#7AB62F]">
                              <PlusIcon className="w-4 h-4 mr-2" />
                              Ajouter
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Card>
              </div>
            )
          })
        )}
      </div>
      <div className="w-full lg:w-1/4">
        <Card className="p-4">
          <CardHeader>
            <CardTitle>Panier</CardTitle>
          </CardHeader>
          <CardContent className="max-h-96 overflow-y-auto">
            {cart.length === 0 ? (
              <p>Votre panier est vide</p>
            ) : (
              <>
                {cart.map(item => (
                  <div key={item.id} className="flex justify-between items-center mb-4">
                    <div className="flex items-center">
                      <Image src={item.image} alt={item.name} width={50} height={50} className="mr-2 rounded" />
                      <div>
                        <p className="font-medium">{he.decode(item.name)}</p>
                        <p className="text-sm text-gray-500">{item.price}€</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="flex items-center">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <MinusIcon className="w-4 h-4" />
                        </Button>
                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                          className="w-16 mx-2 text-center"
                          min="1"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <PlusIcon className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}
          </CardContent>
          {cart.length > 0 && (
            <CardFooter className="flex flex-col items-stretch">
              <div className="flex justify-between items-center mb-4">
                <span className="font-bold">Total:</span>
                <span className="font-bold">{totalPrice.toFixed(2)}€</span>
              </div>
              <Button className="w-full bg-[#007A53] hover:bg-[#006644]" onClick={() => setIsConfirmationOpen(true)}>
                Valider la demande
              </Button>
            </CardFooter>
          )}
        </Card>
      </div>
      <OrderConfirmationDialog
        isOpen={isConfirmationOpen}
        onClose={() => setIsConfirmationOpen(false)}
        onConfirm={handleConfirmOrder}
        userInfo={userInfo}
        cart={cart}
      />
    </div>
  )
}

function NosProduits({ category }) {
  const categoryData = categoriesData.find(cat => cat.slug === category)
  const [products, setProducts] = useState([])
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(true)
    fetch(`https://www.regalterre.com/wp-json/wc/store/products?category=${categoryData.id}`)
      .then(response => response.json())
      .then(data => {
        setProducts(data)
        setIsLoading(false)
      })
      .catch(error => {
        console.error('Error fetching products:', error)
        setIsLoading(false)
      })
  }, [category, categoryData.id])

  const handleProductClick = (product) => {
    setSelectedProduct(product)
  }

  const handleCloseProductDetail = () => {
    setSelectedProduct(null)
  }

  const { addItem } = useCartStore()

  const addToCart = (product) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.prices.price,
      quantity: 1,
      image: product.images[0].src
    })
    toast.success(`${he.decode(product.name)} ajouté au panier`)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 text-sm text-gray-500">
        <Button variant="link" className="p-0" onClick={handleCloseProductDetail}>
          Accueil
        </Button>
        <ChevronRightIcon className="w-4 h-4" />
        <span>{categoryData.name}</span>
        {selectedProduct && (
          <>
            <ChevronRightIcon className="w-4 h-4" />
            <span>{he.decode(selectedProduct.name)}</span>
          </>
        )}
      </div>
      <h1 className="text-3xl font-bold text-[#007A53]">{categoryData.name}</h1>
      <p className="text-lg text-gray-600 mb-6">{categoryData.description}</p>
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#007A53]"></div>
        </div>
      ) : selectedProduct ? (
        <ProductDetail product={selectedProduct} onClose={handleCloseProductDetail} onAddToCart={addToCart} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="flex flex-col h-full cursor-pointer" onClick={() => handleProductClick(product)}>
              <CardHeader>
                <Image
                  src={product.images[0].src}
                  alt={product.name}
                  width={300}
                  height={200}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
              </CardHeader>
              <CardContent className="flex-grow">
                <h2 className="text-xl font-semibold mb-2 text-[#007A53]">{he.decode(product.name)}</h2>
                <div className="text-gray-600 mb-4" dangerouslySetInnerHTML={{ __html: product.short_description }} />
              </CardContent>
              <CardFooter className="flex justify-between items-center mt-auto">
                <span className="text-lg font-bold text-[#007A53]">{product.prices.price}€</span>
                <Button className="bg-[#8CC63F] hover:bg-[#7AB62F]">Voir détails</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

function ProductDetail({ product, onClose, onAddToCart }) {
  const [selectedImage, setSelectedImage] = useState(product.images[0])
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)

  const handleImageClick = (image) => {
    setSelectedImage(image)
    setIsLightboxOpen(true)
  }

  return (
    <div className="space-y-6">
      <Button variant="outline" onClick={onClose} className="mb-4">
        <ChevronLeftIcon className="w-4 h-4 mr-2" />
        Retour aux produits
      </Button>
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <Image
            src={selectedImage.src}
            alt={product.name}
            width={600}
            height={400}
            className="w-full h-auto object-cover rounded-lg cursor-pointer"
            onClick={() => setIsLightboxOpen(true)}
          />
          <div className="grid grid-cols-4 gap-2 mt-4">
            {product.images.map((image) => (
              <Image
                key={image.id}
                src={image.src}
                alt={product.name}
                width={150}
                height={150}
                className={`w-full h-auto object-cover rounded-lg cursor-pointer ${
                  selectedImage.id === image.id ? 'border-2 border-[#007A53]' : ''
                }`}
                onClick={() => handleImageClick(image)}
              />
            ))}
          </div>
        </div>
        <div>
          <h1 className="text-3xl font-bold text-[#007A53] mb-4">{he.decode(product.name)}</h1>
          <div className="text-xl font-semibold text-[#007A53] mb-4">{product.prices.price}€</div>
          <div className="prose max-w-none mb-6" dangerouslySetInnerHTML={{ __html: product.description }} />
          <Button className="w-full bg-[#8CC63F] hover:bg-[#7AB62F]" onClick={() => onAddToCart(product)}>Ajouter au panier</Button>
        </div>
      </div>
      {isLightboxOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={() => setIsLightboxOpen(false)}>
          <div className="max-w-4xl max-h-full p-4">
            <Image
              src={selectedImage.src}
              alt={product.name}
              width={1200}
              height={800}
              className="w-full h-auto object-contain"
            />
          </div>
        </div>
      )}
    </div>
  )
}

function ConseilsUtilisation({ category }) {
  const conseils = {
    'espaces-verts': [
      "Effectuez une analyse de sol avant d'appliquer des engrais pour déterminer les besoins spécifiques de votre terrain.",
      "Arrosez abondamment après l'application d'engrais pour favoriser l'absorption par les plantes.",
      "Pour les gazons, utilisez un épandeur pour assurer une distribution uniforme des produits.",
      "Évitez d'appliquer des engrais par temps très chaud ou en plein soleil pour prévenir les brûlures.",
    ],
    'agriculture': [
      "Respectez les doses recommandées pour chaque culture afin d'optimiser les rendements et minimiser l'impact environnemental.",
      "Pratiquez la rotation des cultures pour maintenir la santé du sol et réduire la dépendance aux engrais.",
      "Utilisez des techniques de précision pour appliquer les produits, comme la pulvérisation guidée par GPS.",
      "Intégrez des cultures de couverture dans votre rotation pour améliorer naturellement la fertilité du sol.",
    ],
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-[#007A53]">
        Conseils d'utilisation - {category === 'espaces-verts' ? "Espaces verts" : "Agriculture"}
      </h1>
      <Card className="p-6 border-[#8CC63F]">
        <ul className="list-disc list-inside space-y-2">
          {conseils[category].map((conseil, index) => (
            <li key={index} className="text-gray-600">{conseil}</li>
          ))}
        </ul>
      </Card>
    </div>
  )
}

function Actualites({ subpage }) {
  const actualites = {
    'calendrier-cultures': [
      { id: 1, title: "Semis de printemps", date: "Mars -  Avril", content: "Préparez vos sols et commencez les semis de cultures printanières." },
      { id: 2, title: "Fertilisation estivale", date: "Juin - Juillet", content: "Appliquez nos engrais pour booster la croissance pendant la période chaude." },
      { id: 3, title: "Récolte d'automne", date: "Septembre - Octobre", content: "Préparez-vous pour les récoltes et planifiez la fertilisation post-récolte." },
    ],
    'evenements': [
      { id: 1, title: "Salon de l'Agriculture", date: "25-28 Février", content: "Retrouvez-nous au Salon de l'Agriculture pour découvrir nos dernières innovations." },
      { id: 2, title: "Journée portes ouvertes", date: "15 Mai", content: "Visitez nos installations et participez à des ateliers sur l'agriculture durable." },
      { id: 3, title: "Webinaire : Optimisation des cultures", date: "10 Juillet", content: "Participez à notre webinaire en ligne sur les techniques d'optimisation des cultures." },
    ],
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-[#007A53]">
        {subpage === 'calendrier-cultures' ? "Calendrier des cultures" : "Événements à venir"}
      </h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {actualites[subpage].map((item) => (
          <Card key={item.id} className="p-6 border-[#8CC63F]">
            <h2 className="text-xl font-semibold mb-2 text-[#007A53]">{item.title}</h2>
            <p className="text-sm text-gray-500 mb-2">{item.date}</p>
            <p className="text-gray-600">{item.content}</p>
          </Card>
        ))}
      </div>
    </div>
  )
}

function MonCompte() {
  const [orders, setOrders] = useState([
    { id: 'CMD-001', date: '01/05/2023', amount: 250.00, status: 'Livrée' },
    { id: 'CMD-002', date: '15/05/2023', amount: 180.00, status: 'En cours' },
  ])

  const handleRenewOrder = (orderId) => {
    toast.success(`Commande ${orderId} renouvelée avec succès.`)
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-[#007A53]">Mon compte</h1>
      <Tabs defaultValue="informations">
        <TabsList>
          <TabsTrigger value="informations">Informations personnelles</TabsTrigger>
          <TabsTrigger value="commandes">Historique des commandes</TabsTrigger>
          <TabsTrigger value="preferences">Préférences</TabsTrigger>
          <TabsTrigger value="paiement">Information de paiement</TabsTrigger>
        </TabsList>
        <TabsContent value="informations">
          <Card>
            <CardHeader>
              <CardTitle>Informations personnelles</CardTitle>
              <CardDescription>Gérez vos informations personnelles et de contact.</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="prenom">Prénom</Label>
                    <Input id="prenom" placeholder="Votre prénom" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nom">Nom</Label>
                    <Input id="nom" placeholder="Votre nom" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="Votre email" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telephone">Téléphone</Label>
                  <Input id="telephone" type="tel" placeholder="Votre numéro de téléphone" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="adresse">Adresse</Label>
                  <Textarea id="adresse" placeholder="Votre adresse complète" />
                </div>
                <Button type="submit" className="bg-[#007A53] hover:bg-[#006644]">Enregistrer les modifications</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="commandes">
          <Card>
            <CardHeader>
              <CardTitle>Historique des commandes</CardTitle>
              <CardDescription>Consultez vos commandes passées et leur statut.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Numéro de commande</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Montant</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>{order.id}</TableCell>
                      <TableCell>{order.date}</TableCell>
                      <TableCell>{order.amount.toFixed(2)} €</TableCell>
                      <TableCell>{order.status}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <PrinterIcon className="w-4 h-4 mr-2" />
                            Facture
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleRenewOrder(order.id)}>
                            <CopyIcon className="w-4 h-4 mr-2" />
                            Renouveler
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="preferences">
          <Card>
            <CardHeader>
              <CardTitle>Préférences</CardTitle>
              <CardDescription>Personnalisez vos préférences de compte et de communication.</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="langue">Langue préférée</Label>
                  <Select>
                    <SelectTrigger id="langue">
                      <SelectValue placeholder="Sélectionnez une langue" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Préférences de communication</Label>
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="newsletter" className="rounded border-gray-300 text-[#007A53] shadow-sm focus:border-[#007A53] focus:ring focus:ring-[#007A53] focus:ring-opacity-50" />
                      <Label htmlFor="newsletter">Recevoir la newsletter</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="offres" className="rounded border-gray-300 text-[#007A53] shadow-sm focus:border-[#007A53] focus:ring focus:ring-[#007A53] focus:ring-opacity-50" />
                      <Label htmlFor="offres">Recevoir les offres promotionnelles</Label>
                    </div>
                  </div>
                </div>
                <Button type="submit" className="bg-[#007A53] hover:bg-[#006644]">Enregistrer les préférences</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="paiement">
          <Card>
            <CardHeader>
              <CardTitle>Information de paiement</CardTitle>
              <CardDescription>Gérez vos méthodes de paiement et vos conditions de paiement.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Méthode de paiement actuelle</h3>
                  <div className="flex items-center space-x-2">
                    <CreditCardIcon className="w-6 h-6 text-[#007A53]" />
                    <span>Carte de crédit se terminant par 1234</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Conditions de paiement</h3>
                  <p>Paiement à 30 jours</p>
                </div>
                <Button className="bg-[#007A53] hover:bg-[#006644]">
                  Modifier les informations de paiement
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function Contact() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-[#007A53]">Contactez-nous</h1>
      <Card className="p-6 border-[#8CC63F]">
        <form className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nom</Label>
            <Input id="name" placeholder="Votre nom" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="Votre email" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="subject">Sujet</Label>
            <Input id="subject" placeholder="Sujet de votre message" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea id="message" placeholder="Votre message" required />
          </div>
          <Button type="submit" className="bg-[#007A53] hover:bg-[#006644]">Envoyer</Button>
        </form>
      </Card>
      <Card className="p-6 border-[#8CC63F]">
        <h2 className="text-xl font-semibold mb-4 text-[#007A53]">Nos coordonnées</h2>
        <div className="space-y-2">
          <p><strong>Adresse :</strong> 123 Rue de la Terre, 75000 Paris</p>
          <p><strong>Téléphone :</strong> +33 1 23 45 67 89</p>
          <p><strong>Email :</strong> contact@protopterre.com</p>
        </div>
      </Card>
    </div>
  )
}

function FoireAuxQuestions() {
  const [faqData, setFaqData] = useState([
    {
      id: 1,
      question: "Quels sont les avantages des engrais naturels ?",
      answers: [
        {
          id: 1,
          content: "Les engrais naturels offrent plusieurs avantages : ils améliorent la structure du sol, favorisent la vie microbienne, libèrent les nutriments progressivement, et sont plus respectueux de l'environnement.",
          author: "Expert ProTopTerre",
          votes: 15,
          responses: []
        },
        {
          id: 2,
          content: "En plus de ce qui a été mentionné, les engrais naturels contribuent également à la rétention d'eau dans le sol et réduisent le risque de brûlure des plantes.",
          author: "AgricoExpert",
          votes: 8,
          responses: []
        }
      ]
    },
    {
      id: 2,
      question: "Comment appliquer correctement les engrais Pro Top Terre ?",
      answers: [
        {
          id: 1,
          content: "Pour une application optimale, suivez les instructions sur l'emballage. En général, il est recommandé d'épandre l'engrais uniformément sur le sol, puis de l'incorporer légèrement et d'arroser abondamment.",
          author: "Expert ProTopTerre",
          votes: 12,
          responses: [
            {
              id: 1,
              content: "Est-ce que cela s'applique aussi aux plantes en pot ?",
              author: "JardinierDébutant",
              votes: 3
            },
            {
              id: 2,
              content: "Pour les plantes en pot, vous pouvez mélanger l'engrais au terr eau lors du rempotage ou l'appliquer en surface et arroser ensuite.",
              author: "Expert ProTopTerre",
              votes: 5
            }
          ]
        }
      ]
    },
    {
      id: 3,
      question: "Quelle est la fréquence d'application recommandée ?",
      answers: [
        {
          id: 1,
          content: "La fréquence d'application dépend du type de plante et de la saison. En général, pour les pelouses, on recommande 3-4 applications par an. Pour les plantes en pot, une application tous les 2-3 mois pendant la saison de croissance est suffisante.",
          author: "Expert ProTopTerre",
          votes: 10,
          responses: []
        }
      ]
    },
    {
      id: 4,
      question: "Les produits Pro Top Terre sont-ils utilisables en agriculture biologique ?",
      answers: [
        {
          id: 1,
          content: "Oui, nos produits sont utilisables en Agriculture Biologique, conformément au règlement UE N°2018/848 du 1er Janvier 2022.",
          author: "Expert ProTopTerre",
          votes: 18,
          responses: []
        }
      ]
    },
    {
      id: 5,
      question: "Comment choisir le bon produit pour mon jardin ?",
      answers: [
        {
          id: 1,
          content: "Le choix du produit dépend de vos besoins spécifiques. Nos amendements calcaires sont idéaux pour corriger le pH du sol, tandis que nos engrais apportent les nutriments nécessaires à la croissance des plantes. N'hésitez pas à nous contacter pour des conseils personnalisés.",
          author: "Expert ProTopTerre",
          votes: 14,
          responses: []
        }
      ]
    }
  ])

  const [newQuestion, setNewQuestion] = useState('')
  const [expandedQuestions, setExpandedQuestions] = useState({})

  const handleVote = (questionId, answerId, increment) => {
    setFaqData(faqData.map(question => 
      question.id === questionId
        ? {
            ...question,
            answers: question.answers.map(answer =>
              answer.id === answerId
                ? { ...answer, votes: answer.votes + (increment ? 1 : -1) }
                : answer
            )
          }
        : question
    ))
  }

  const handleResponseVote = (questionId, answerId, responseId, increment) => {
    setFaqData(faqData.map(question => 
      question.id === questionId
        ? {
            ...question,
            answers: question.answers.map(answer =>
              answer.id === answerId
                ? {
                    ...answer,
                    responses: answer.responses.map(response =>
                      response.id === responseId
                        ? { ...response, votes: response.votes + (increment ? 1 : -1) }
                        : response
                    )
                  }
                : answer
            )
          }
        : question
    ))
  }

  const handleReport = (id) => {
    toast.success(`La question a été signalée. Merci pour votre contribution.`)
  }

  const handleSubmitQuestion = (e) => {
    e.preventDefault()
    if (newQuestion.trim()) {
      const newId = Math.max(...faqData.map(item => item.id)) + 1
      setFaqData([...faqData, { id: newId, question: newQuestion, answers: [] }])
      setNewQuestion('')
      toast.success('Votre question a été soumise avec succès.')
    }
  }

  const handleSubmitResponse = (questionId, answerId, response) => {
    setFaqData(faqData.map(question => 
      question.id === questionId
        ? {
            ...question,
            answers: question.answers.map(answer =>
              answer.id === answerId
                ? {
                    ...answer,
                    responses: [
                      ...answer.responses,
                      {
                        id: answer.responses.length + 1,
                        content: response,
                        author: "Utilisateur",
                        votes: 0
                      }
                    ]
                  }
                : answer
            )
          }
        : question
    ))
  }

  const toggleExpand = (questionId) => {
    setExpandedQuestions(prev => ({
      ...prev,
      [questionId]: !prev[questionId]
    }))
  }

  return (
    <div className="w-full max-w-3xl mx-auto space-y-8">
      <h2 className="text-2xl font-bold mb-6 text-[#007A53]">Foire aux Questions</h2>
      
      <Card className="p-6 border-[#8CC63F]">
        <h3 className="text-xl font-semibold mb-4 text-[#007A53]">Poser une nouvelle question</h3>
        <form onSubmit={handleSubmitQuestion} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="new-question">Votre question</Label>
            <Textarea 
              id="new-question" 
              placeholder="Entrez votre question ici" 
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              required 
            />
          </div>
          <Button type="submit" className="bg-[#007A53] hover:bg-[#006644]">Soumettre la question</Button>
        </form>
      </Card>

      <div className="space-y-6">
        {faqData.map((faq) => (
          <Card key={faq.id} className="p-6 border-[#8CC63F]">
            <h3 className="text-xl font-semibold mb-4 text-[#007A53]">{faq.question}</h3>
            {faq.answers.length > 0 && (
              <div className="mb-4">
                <div className="bg-gray-100 p-4 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="mb-2">{faq.answers[0].content}</p>
                      <p className="text-sm text-gray-600">Par {faq.answers[0].author}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleVote(faq.id, faq.answers[0].id, true)}>
                        <ThumbsUpIcon className="w-4 h-4 mr-1" />
                        {faq.answers[0].votes}
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleVote(faq.id, faq.answers[0].id, false)}>
                        <ThumbsDownIcon className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  {faq.answers[0].responses.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {faq.answers[0].responses.map((response) => (
                        <div key={response.id} className="bg-white p-2 rounded-lg">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="text-sm">{response.content}</p>
                              <p className="text-xs text-gray-600">Par {response.author}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button variant="ghost" size="sm" onClick={() => handleResponseVote(faq.id, faq.answers[0].id, response.id, true)}>
                                <ThumbsUpIcon className="w-3 h-3 mr-1" />
                                {response.votes}
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => handleResponseVote(faq.id, faq.answers[0].id, response.id, false)}>
                                <ThumbsDownIcon className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
            {faq.answers.length > 1 && (
              <div>
                <Button variant="link" onClick={() => toggleExpand(faq.id)} className="text-[#007A53]">
                  {expandedQuestions[faq.id] ? "Masquer les autres réponses" : "Voir plus de réponses"}
                  <ChevronRightIcon className="w-4 h-4 ml-1" />
                </Button>
                {expandedQuestions[faq.id] && (
                  <div className="mt-4 space-y-4">
                    {faq.answers.slice(1).map((answer) => (
                      <div key={answer.id} className="bg-gray-100 p-4 rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="mb-2">{answer.content}</p>
                            <p className="text-sm text-gray-600">Par {answer.author}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button variant="outline" size="sm" onClick={() => handleVote(faq.id, answer.id, true)}>
                              <ThumbsUpIcon className="w-4 h-4 mr-1" />
                              {answer.votes}
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleVote(faq.id, answer.id, false)}>
                              <ThumbsDownIcon className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        {answer.responses.length > 0 && (
                          <div className="mt-4 space-y-2">
                            {answer.responses.map((response) => (
                              <div key={response.id} className="bg-white p-2 rounded-lg">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <p className="text-sm">{response.content}</p>
                                    <p className="text-xs text-gray-600">Par {response.author}</p>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Button variant="ghost" size="sm" onClick={() => handleResponseVote(faq.id, answer.id, response.id, true)}>
                                      <ThumbsUpIcon className="w-3 h-3 mr-1" />
                                      {response.votes}
                                    </Button>
                                    <Button variant="ghost" size="sm" onClick={() => handleResponseVote(faq.id, answer.id, response.id, false)}>
                                      <ThumbsDownIcon className="w-3 h-3" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            <div className="mt-4">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <MessageCircleIcon className="w-4 h-4 mr-2" />
                    Répondre
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Répondre à la question</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={(e) => {
                    e.preventDefault()
                    const response = e.target.response.value
                    if (response.trim()) {
                      handleSubmitResponse(faq.id, faq.answers[0].id, response)
                      e.target.reset()
                    }
                  }} className="space-y-4">
                    <Textarea id="response" placeholder="Votre réponse" required />
                    <Button type="submit">Envoyer la réponse</Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

function QuiSommesNous() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-[#007A53]">Qui sommes-nous ?</h1>
      <Card className="p-6 border-[#8CC63F]">
        <CardContent>
          <p className="mb-4">Pro Top Terre est une entreprise leader dans le domaine des engrais et amendements naturels pour l'agriculture et les espaces verts. Fondée en 1990, notre mission est de fournir des solutions durables et respectueuses de l'environnement pour améliorer la qualité des sols et la croissance des plantes.</p>
          <p className="mb-4">Avec plus de 30 ans d'expérience, nous avons développé une gamme de produits innovants qui répondent aux besoins spécifiques des agriculteurs, des paysagistes et des jardiniers amateurs. Notre engagement envers la qualité et la durabilité nous a permis de devenir un acteur majeur sur le marché français et européen.</p>
          <p>Chez Pro Top Terre, nous croyons en l'importance de l'agriculture biologique et nous travaillons constamment à l'amélioration de nos produits pour répondre aux normes les plus strictes en matière d'agriculture durable.</p>
        </CardContent>
      </Card>
    </div>
  )
}

function NosSolutionsDeConditionnements() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-[#007A53]">Nos solutions de conditionnements</h1>
      <Card className="p-6 border-[#8CC63F]">
        <CardContent>
          <p className="mb-4">Chez Pro Top Terre, nous comprenons que chaque client a des besoins différents en termes de quantité et de stockage. C'est pourquoi nous proposons une variété de solutions de conditionnement pour nos produits :</p>
          <ul className="list-disc list-inside space-y-2 mb-4">
            <li>Sacs de 25 kg : Idéal pour les petites surfaces et les jardiniers amateurs</li>
            <li>Big bags de 500 kg et 1000 kg : Parfait pour les grandes exploitations agricoles</li>
            <li>Vrac : Pour les livraisons en grande quantité, directement sur votre exploitation</li>
            <li>Conditionnements spéciaux : Sur demande, pour répondre à vos besoins spécifiques</li>
          </ul>
          <p>Tous nos emballages sont conçus pour préserver la qualité de nos produits et faciliter leur utilisation. Nous utilisons des matériaux recyclables dans la mesure du possible, dans le cadre de notre engagement pour l'environnement.</p>
        </CardContent>
      </Card>
    </div>
  )
}

function NosValeurs() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-[#007A53]">Nos valeurs</h1>
      <Card className="p-6 border-[#8CC63F]">
        <CardContent>
          <p className="mb-4">Chez Pro Top Terre, nos valeurs sont au cœur de tout ce que nous faisons. Elles guident nos décisions, nos actions et nos relations avec nos clients, nos partenaires et notre environnement :</p>
          <ul className="list-disc list-inside space-y-2 mb-4">
            <li><strong>Durabilité :</strong> Nous nous engageons à développer des produits qui respectent l'environnement et contribuent à une agriculture durable.</li>
            <li><strong>Innovation :</strong> Nous investissons continuellement dans la recherche et le développement pour offrir des solutions toujours plus performantes et écologiques.</li>
            <li><strong>Qualité :</strong> Nous maintenons les plus hauts standards de qualité dans tous nos produits et services.</li>
            <li><strong>Intégrité :</strong> Nous agissons avec honnêteté et transparence dans toutes nos relations d'affaires.</li>
            <li><strong>Service client :</strong> Nous nous efforçons de fournir un service exceptionnel et un support personnalisé à tous nos clients.</li>
          </ul>
          <p>Ces valeurs ne sont pas seulement des mots pour nous. Elles sont intégrées dans chaque aspect de notre entreprise, de la production à la livraison, en passant par le service client.</p>
        </CardContent>
      </Card>
    </div>
  )
}

function NosClients() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-[#007A53]">Nos clients</h1>
      <Card className="p-6 border-[#8CC63F]">
        <CardContent>
          <p className="mb-4">Chez Pro Top Terre, nous sommes fiers de servir une clientèle diversifiée, allant des petits jardiniers amateurs aux grandes exploitations agricoles. Nos clients incluent :</p>
          <ul className="list-disc list-inside space-y-2 mb-4">
            <li><strong>Agriculteurs :</strong> Des exploitations de toutes tailles, spécialisées dans diverses cultures.</li>
            <li><strong>Paysagistes :</strong> Des professionnels qui créent et entretiennent des espaces verts publics et privés.</li>
            <li><strong>Collectivités locales :</strong> Pour l'entretien des espaces verts municipaux, parcs et jardins publics.</li>
            <li><strong>Jardineries :</strong> Qui distribuent nos produits aux jardiniers amateurs.</li>
            <li><strong>Particuliers :</strong> Des passionnés de jardinage qui cherchent des solutions naturelles pour leurs plantes.</li>
          </ul>
          <p className="mb-4">Nous sommes reconnaissants de la confiance que nos clients nous accordent et nous nous efforçons constamment d'améliorer nos produits et services pour répondre à leurs besoins changeants.</p>
          <p>Découvrez ci-dessous quelques témoignages de nos clients satisfaits :</p>
          <div className="mt-4 space-y-4">
            <Card className="p-4 bg-green-50">
              <p className="italic">"Les produits Pro Top Terre ont considérablement amélioré la qualité de nos sols. Nos rendements n'ont jamais été aussi bons !"</p>
              <p className="text-right">- Jean D., agriculteur biologique</p>
            </Card>
            <Card className="p-4 bg-green-50">
              <p className="italic">"En tant que paysagiste, je ne jure que par Pro Top Terre. Leurs engrais naturels donnent des résultats exceptionnels sur tous types de plantes."</p>
              <p className="text-right">- Marie L., paysagiste</p>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function FloatingCart() {
  const [isOpen, setIsOpen] = useState(false)
  const { items, removeItem, updateQuantity, clearCart } = useCartStore()

  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const handleConfirmOrder = () => {
    toast.success('Votre commande a été confirmée. Nous vous contacterons bientôt.')
    clearCart()
    setIsOpen(false)
  }

  if (items.length === 0) {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Button
        className="bg-[#8CC63F] hover:bg-[#7AB62F] text-white p-2 rounded-full shadow-lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        <ShoppingCartIcon className="w-6 h-6" />
        <span className="ml-2">{items.length}</span>
      </Button>
      {isOpen && (
        <Card className="absolute bottom-16 right-0 w-80 max-h-96 overflow-hidden">
          <CardHeader>
            <CardTitle>Votre panier</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)} className="absolute top-2 right-2">
              <XIcon className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent className="max-h-64 overflow-y-auto">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                  <Image src={item.image} alt={item.name} width={50} height={50} className="mr-2 rounded" />
                  <div>
                    <p className="font-medium">{he.decode(item.name)}</p>
                    <p className="text-sm text-gray-500">{item.price}€</p>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <div className="flex items-center">
                    <Button 
                      variant="outline"
                      size="sm"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      <MinusIcon className="w-4 h-4" />
                    </Button>
                    <Input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                      className="w-12 mx-1 text-center"
                      min="1"
                    />
                    <Button 
                      variant="outline"
                      size="sm"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      <PlusIcon className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
          <CardFooter className="flex flex-col items-stretch">
            <div className="flex justify-between items-center mb-4">
              <span className="font-bold">Total:</span>
              <span className="font-bold">{totalPrice.toFixed(2)}€</span>
            </div>
            <Button className="w-full bg-[#007A53] hover:bg-[#006644]" onClick={handleConfirmOrder}>
              Confirmer la commande
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}

function Maraicher({ setCurrentPage }) {
  const [products, setProducts] = useState([])
  const [blogEntries, setBlogEntries] = useState([])

  useEffect(() => {
    // Fetch products (this is a mock, replace with actual API call)
    setProducts([
      { id: 1, name: "Engrais Bio Maraîcher", price: 29.99, image: "https://source.unsplash.com/random/200x200?vegetable,fertilizer" },
      { id: 2, name: "Compost Spécial Légumes", price: 19.99, image: "https://source.unsplash.com/random/200x200?compost" },
      { id: 3, name: "Paillage Naturel", price: 14.99, image: "https://source.unsplash.com/random/200x200?mulch" },
    ])

    // Fetch blog entries (this is a mock, replace with actual API call)
    setBlogEntries([
      { id: 1, title: "Optimiser la rotation des cultures maraîchères", date: "2023-05-15" },
      { id: 2, title: "Les bienfaits de l'agriculture biologique pour le maraîchage", date: "2023-06-02" },
      { id: 3, title: "Gestion de l'eau en maraîchage : techniques innovantes", date: "2023-06-20" },
    ])
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 text-sm text-gray-500">
        <Button variant="link" className="p-0" onClick={() => setCurrentPage('home')}>
          Accueil
        </Button>
        <ChevronRightIcon className="w-4 h-4" />
        <span>Maraîcher</span>
      </div>

      <Button variant="outline" onClick={() => setCurrentPage('home')} className="mb-4">
        <ChevronLeftIcon className="w-4 h-4 mr-2" />
        Retour à l'accueil
      </Button>

      <div className="relative h-[300px] bg-cover bg-center" style={{backgroundImage: "url('https://source.unsplash.com/random/1600x900?vegetable,farm')"}}>
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <h1 className="text-4xl font-bold text-white text-center">Solutions pour Maraîchers</h1>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-[#007A53] mt-8">Nos produits pour maraîchers</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <Card key={product.id}>
            <CardHeader>
              <Image src={product.image} alt={product.name} width={200} height={200} className="w-full h-48 object-cover" />
            </CardHeader>
            <CardContent>
              <h3 className="text-lg font-semibold">{product.name}</h3>
              <p className="text-[#007A53] font-bold">{product.price} €</p>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-[#8CC63F] hover:bg-[#7AB62F]">Ajouter au panier</Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <h2 className="text-2xl font-bold text-[#007A53] mt-8">Articles de blog pour maraîchers</h2>
      <ul className="space-y-2">
        {blogEntries.map((entry) => (
          <li key={entry.id}>
            <a href="#" className="text-[#007A53] hover:underline">
              {entry.title} - {new Date(entry.date).toLocaleDateString()}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

function Arboriculteur({ setCurrentPage }) {
  const [products, setProducts] = useState([])
  const [blogEntries, setBlogEntries] = useState([])

  useEffect(() => {
    // Fetch products (this is a mock, replace with actual API call)
    setProducts([
      { id: 1, name: "Engrais Bio Arbres Fruitiers", price: 34.99, image: "https://source.unsplash.com/random/200x200?fruit,tree,fertilizer" },
      { id: 2, name: "Traitement Naturel Anti-Parasites", price: 24.99, image: "https://source.unsplash.com/random/200x200?organic,pesticide" },
      { id: 3, name: "Paillage pour Vergers", price: 19.99, image: "https://source.unsplash.com/random/200x200?orchard,mulch" },
    ])

    // Fetch blog entries (this is a mock, replace with actual API call)
    setBlogEntries([
      { id: 1, title: "La taille des arbres fruitiers : guide complet", date: "2023-05-10" },
      { id: 2, title: "Lutte biologique contre les ravageurs en arboriculture", date: "2023-06-05" },
      { id: 3, title: "Optimiser la pollinisation dans les vergers", date: "2023-06-25" },
    ])
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 text-sm text-gray-500">
        <Button variant="link" className="p-0" onClick={() => setCurrentPage('home')}>
          Accueil
        </Button>
        <ChevronRightIcon className="w-4 h-4" />
        <span>Arboriculteur</span>
      </div>

      <Button variant="outline" onClick={() => setCurrentPage('home')} className="mb-4">
        <ChevronLeftIcon className="w-4 h-4 mr-2" />
        Retour à l'accueil
      </Button>

      <div className="relative h-[300px] bg-cover bg-center" style={{backgroundImage: "url('https://source.unsplash.com/random/1600x900?orchard,fruit,trees')"}}>
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <h1 className="text-4xl font-bold text-white text-center">Solutions pour Arboriculteurs</h1>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-[#007A53] mt-8">Nos produits pour arboriculteurs</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <Card key={product.id}>
            <CardHeader>
              <Image src={product.image} alt={product.name} width={200} height={200} className="w-full h-48 object-cover" />
            </CardHeader>
            <CardContent>
              <h3 className="text-lg font-semibold">{product.name}</h3>
              <p className="text-[#007A53] font-bold">{product.price} €</p>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-[#8CC63F] hover:bg-[#7AB62F]">Ajo uter au panier</Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <h2 className="text-2xl font-bold text-[#007A53] mt-8">Articles de blog pour arboriculteurs</h2>
      <ul className="space-y-2">
        {blogEntries.map((entry) => (
          <li key={entry.id}>
            <a href="#" className="text-[#007A53] hover:underline">
              {entry.title} - {new Date(entry.date).toLocaleDateString()}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

function Viticulteur({ setCurrentPage }) {
  const [products, setProducts] = useState([])
  const [blogEntries, setBlogEntries] = useState([])

  useEffect(() => {
    // Fetch products (this is a mock, replace with actual API call)
    setProducts([
      { id: 1, name: "Engrais Bio Vignes", price: 39.99, image: "https://source.unsplash.com/random/200x200?vineyard,fertilizer" },
      { id: 2, name: "Traitement Naturel Anti-Mildiou", price: 29.99, image: "https://source.unsplash.com/random/200x200?grape,disease" },
      { id: 3, name: "Paillage pour Vignobles", price: 24.99, image: "https://source.unsplash.com/random/200x200?vineyard,mulch" },
    ])

    // Fetch blog entries (this is a mock, replace with actual API call)
    setBlogEntries([
      { id: 1, title: "La viticulture biodynamique : principes et pratiques", date: "2023-05-20" },
      { id: 2, title: "Gestion durable de l'eau dans les vignobles", date: "2023-06-10" },
      { id: 3, title: "L'impact du changement climatique sur la viticulture", date: "2023-06-30" },
    ])
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 text-sm text-gray-500">
        <Button variant="link" className="p-0" onClick={() => setCurrentPage('home')}>
          Accueil
        </Button>
        <ChevronRightIcon className="w-4 h-4" />
        <span>Viticulteur</span>
      </div>

      <Button variant="outline" onClick={() => setCurrentPage('home')} className="mb-4">
        <ChevronLeftIcon className="w-4 h-4 mr-2" />
        Retour à l'accueil
      </Button>

      <div className="relative h-[300px] bg-cover bg-center" style={{backgroundImage: "url('https://source.unsplash.com/random/1600x900?vineyard,grapes')"}}>
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <h1 className="text-4xl font-bold text-white text-center">Solutions pour Viticulteurs</h1>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-[#007A53] mt-8">Nos produits pour viticulteurs</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <Card key={product.id}>
            <CardHeader>
              <Image src={product.image} alt={product.name} width={200} height={200} className="w-full h-48 object-cover" />
            </CardHeader>
            <CardContent>
              <h3 className="text-lg font-semibold">{product.name}</h3>
              <p className="text-[#007A53] font-bold">{product.price} €</p>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-[#8CC63F] hover:bg-[#7AB62F]">Ajouter au panier</Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <h2 className="text-2xl font-bold text-[#007A53] mt-8">Articles de blog pour viticulteurs</h2>
      <ul className="space-y-2">
        {blogEntries.map((entry) => (
          <li key={entry.id}>
            <a href="#" className="text-[#007A53] hover:underline">
              {entry.title} - {new Date(entry.date).toLocaleDateString()}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

function Paysagiste({ setCurrentPage }) {
  const [products, setProducts] = useState([])
  const [blogEntries, setBlogEntries] = useState([])

  useEffect(() => {
    // Fetch products (this is a mock, replace with actual API call)
    setProducts([
      { id: 1, name: "Engrais Bio Gazon", price: 27.99, image: "https://source.unsplash.com/random/200x200?lawn,fertilizer" },
      { id: 2, name: "Terreau Universel", price: 19.99, image: "https://source.unsplash.com/random/200x200?soil,potting" },
      { id: 3, name: "Paillage Décoratif", price: 22.99, image: "https://source.unsplash.com/random/200x200?decorative,mulch" },
    ])

    // Fetch blog entries (this is a mock, replace with actual API call)
    setBlogEntries([
      { id: 1, title: "Création de jardins écologiques : tendances et techniques", date: "2023-05-25" },
      { id: 2, title: "La gestion durable des espaces verts urbains", date: "2023-06-15" },
      { id: 3, title: "Plantes résistantes à la sécheresse pour l'aménagement paysager", date: "2023-07-05" },
    ])
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 text-sm text-gray-500">
        <Button variant="link" className="p-0" onClick={() => setCurrentPage('home')}>
          Accueil
        </Button>
        <ChevronRightIcon className="w-4 h-4" />
        <span>Paysagiste</span>
      </div>

      <Button variant="outline" onClick={() => setCurrentPage('home')} className="mb-4">
        <ChevronLeftIcon className="w-4 h-4 mr-2" />
        Retour à l'accueil
      </Button>

      <div className="relative h-[300px] bg-cover bg-center" style={{backgroundImage: "url('https://source.unsplash.com/random/1600x900?landscape,garden')"}}>
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <h1 className="text-4xl font-bold text-white text-center">Solutions pour Paysagistes</h1>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-[#007A53] mt-8">Nos produits pour paysagistes</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <Card key={product.id}>
            <CardHeader>
              <Image src={product.image} alt={product.name} width={200} height={200} className="w-full h-48 object-cover" />
            </CardHeader>
            <CardContent>
              <h3 className="text-lg font-semibold">{product.name}</h3>
              <p className="text-[#007A53] font-bold">{product.price} €</p>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-[#8CC63F] hover:bg-[#7AB62F]">Ajouter au panier</Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <h2 className="text-2xl font-bold text-[#007A53] mt-8">Articles de blog pour paysagistes</h2>
      <ul className="space-y-2">
        {blogEntries.map((entry) => (
          <li key={entry.id}>
            <a href="#" className="text-[#007A53] hover:underline">
              {entry.title} - {new Date(entry.date).toLocaleDateString()}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function Component() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [currentPage, setCurrentPage] = useState('home')

  const handleLogin = () => {
    setIsLoggedIn(true)
    toast.success('Connexion réussie. Bienvenue sur Pro Top Terre!')
  }

  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />
  }

  return (
    <div className="min-h-screen bg-white">
      <Toaster />
      <Header setCurrentPage={setCurrentPage} setIsLoggedIn={setIsLoggedIn} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {currentPage === 'home' && <WelcomePage setCurrentPage={setCurrentPage} />}
        {currentPage === 'passer-commande' && <PasserCommande />}
        {currentPage.startsWith('products-') && <NosProduits category={currentPage.replace('products-', '')} />}
        {currentPage === 'conseils-espaces-verts' && <ConseilsUtilisation category="espaces-verts" />}
        {currentPage === 'conseils-agriculture' && <ConseilsUtilisation category="agriculture" />}
        {currentPage === 'actualites' && <Actualites subpage="calendrier-cultures" />}
        {currentPage === 'mon-compte' && <MonCompte />}
        {currentPage === 'contact' && <Contact />}
        {currentPage === 'faq' && <FoireAuxQuestions />}
        {currentPage === 'qui-sommes-nous' && <QuiSommesNous />}
        {currentPage === 'nos-solutions-de-conditionnements' && <NosSolutionsDeConditionnements />}
        {currentPage === 'nos-valeurs' && <NosValeurs />}
        {currentPage === 'nos-clients' && <NosClients />}
        {currentPage === 'maraicher' && <Maraicher setCurrentPage={setCurrentPage} />}
        {currentPage === 'arboriculteur' && <Arboriculteur setCurrentPage={setCurrentPage} />}
        {currentPage === 'viticulteur' && <Viticulteur setCurrentPage={setCurrentPage} />}
        {currentPage === 'paysagiste' && <Paysagiste setCurrentPage={setCurrentPage} />}
      </main>

      <FloatingCart />
    </div>
  )
}