// Mapuje klíč ikony kategorie na konkrétní lucide ikonu.
import {
  Home, Receipt, Landmark, Zap, Flame, Droplet, Shield, Utensils,
  ShoppingCart, Coffee, Car, Bus, Gamepad2, Tv, Ticket, HeartPulse,
  Shirt, GraduationCap, Wifi, PiggyBank, Wallet, Briefcase, Laptop,
  Coins, Tag,
} from 'lucide-react'

const MAP = {
  home: Home,
  receipt: Receipt,
  landmark: Landmark,
  zap: Zap,
  flame: Flame,
  droplet: Droplet,
  shield: Shield,
  utensils: Utensils,
  'shopping-cart': ShoppingCart,
  coffee: Coffee,
  car: Car,
  bus: Bus,
  'gamepad-2': Gamepad2,
  tv: Tv,
  ticket: Ticket,
  'heart-pulse': HeartPulse,
  shirt: Shirt,
  'graduation-cap': GraduationCap,
  wifi: Wifi,
  'piggy-bank': PiggyBank,
  wallet: Wallet,
  briefcase: Briefcase,
  laptop: Laptop,
  coins: Coins,
}

export default function CategoryIcon({ icon, size = 20, className = '' }) {
  const Cmp = MAP[icon] || Tag
  return <Cmp size={size} className={className} strokeWidth={2} />
}
