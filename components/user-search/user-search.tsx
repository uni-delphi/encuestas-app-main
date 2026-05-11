// components/user-search/user-search.tsx
"use client"

import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { useTransition } from "react"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Search, Loader2 } from "lucide-react"
import { useDebouncedCallback } from "use-debounce"

export function UserSearch() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const updateParams = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("page", "0")

    if (value && value !== "ALL") {
      params.set(key, value)
    } else {
      params.delete(key)
    }

    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`)
    })
  }

  const handleSearch = useDebouncedCallback((term: string) => {
    updateParams("q", term)
  }, 300)

  return (
    <div className="flex gap-3 items-center">
      <div className="relative w-72">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Search className="h-4 w-4" />
          )}
        </div>
        <Input
          className="pl-9"
          placeholder="Buscar por nombre o email..."
          defaultValue={searchParams.get("q") ?? ""}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>

      <Select
        defaultValue={searchParams.get("role") ?? "ALL"}
        onValueChange={(value) => updateParams("role", value)}
      >
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Rol..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">Todos</SelectItem>
          <SelectItem value="RESEARCHER">Investigador</SelectItem>
          <SelectItem value="USER">Usuario</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}