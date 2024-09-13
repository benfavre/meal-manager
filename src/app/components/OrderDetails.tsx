import React, { useState } from 'react'
import { useAdminStore } from '../store/adminStore'
import { toast } from 'react-hot-toast'
import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, Input, Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Textarea } from '../components/ui'
import { Printer } from 'lucide-react'

export function OrderDetails({ order, onClose }: { order: Order; onClose: () => void }) {
  // ... (copy the entire OrderDetails component here)
}