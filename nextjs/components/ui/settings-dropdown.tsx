'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Settings, Minus, Plus } from "lucide-react"

export default function Component() {
  const [sensitivities, setSensitivities] = useState({
    analogies: 1,
    examples: 1,
    theory: 1,
  })

  const adjustSensitivity = (setting: keyof typeof sensitivities, amount: number) => {
    setSensitivities(prev => ({
      ...prev,
      [setting]: Math.max(-5, Math.min(5, prev[setting] + amount))
    }))
  }

  const renderSetting = (name: string, key: keyof typeof sensitivities) => (
    <DropdownMenuItem className="flex items-center justify-between text-black" onSelect={(e) => e.preventDefault()}>
      <span>{name}</span>
      <div className="flex items-center space-x-2">
        <Button 
          variant="outline" 
          size="icon" 
          className="h-8 w-8 text-black border-black" 
          onClick={() => adjustSensitivity(key, -.5)}
        >
          <Minus className="h-4 w-4" />
        </Button>
        <span className="w-8 text-center">{sensitivities[key]}</span>
        <Button 
          variant="outline" 
          size="icon" 
          className="h-8 w-8 text-black border-black" 
          onClick={() => adjustSensitivity(key, .5)}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </DropdownMenuItem>
  )

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="text-black border-black">
          <Settings className="h-4 w-4" />
          <span className="sr-only">Open settings</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-white text-black border border-gray-300">
        <DropdownMenuLabel className="text-black">Settings</DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-gray-300" />
        {renderSetting('Analogies', 'analogies')}
        {renderSetting('Examples', 'examples')}
        {renderSetting('Theory', 'theory')}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}