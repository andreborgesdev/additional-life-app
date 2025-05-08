"use client"

import { useState, useEffect, useRef } from "react"
import { Command } from "cmdk"
import { Search, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

interface SearchResult {
  id: string
  title: string
  category: string
}

export function SearchDropdown() {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState("")
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<SearchResult[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const handleSearch = async (search: string) => {
    setValue(search)
    if (search.length === 0) {
      setResults([])
      return
    }

    setLoading(true)
    // In a real application, this would be an API call
    // For this example, we'll simulate a delay and return mock results
    await new Promise((resolve) => setTimeout(resolve, 500))
    setLoading(false)

    const mockResults: SearchResult[] = [
      { id: "1", title: "Vintage Bicycle", category: "Transportation" },
      { id: "2", title: "Wooden Bookshelf", category: "Furniture" },
      { id: "3", title: "Potted Plants", category: "Home & Garden" },
      { id: "4", title: "Upcycled Coffee Table", category: "Furniture" },
      { id: "5", title: "Eco-Friendly Water Bottle", category: "Kitchen & Dining" },
    ].filter(
      (item) =>
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.category.toLowerCase().includes(search.toLowerCase()),
    )

    setResults(mockResults)
  }

  const handleSelectItem = (item: SearchResult) => {
    setValue("")
    setOpen(false)
    router.push(`/product/${item.id}`)
  }

  return (
    <div className="relative">
      <button
        className="inline-flex items-center rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 text-green-800 dark:text-green-100"
        onClick={() => {
          setOpen(true)
          inputRef.current?.focus()
        }}
      >
        <Search className="mr-2 h-4 w-4" />
        <span>Search items...</span>
        <kbd className="pointer-events-none ml-2 inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>
      <Command.Dialog
        open={open}
        onOpenChange={setOpen}
        label="Search items"
        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 max-w-[90vw] w-[500px] max-h-[80vh] overflow-y-auto rounded-xl border bg-popover text-popover-foreground shadow-md"
      >
        <div className="flex items-center border-b px-3">
          <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
          <Command.Input
            ref={inputRef}
            value={value}
            onValueChange={handleSearch}
            placeholder="Search items..."
            className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
        <Command.List className="max-h-[300px] overflow-y-auto">
          <Command.Empty className="py-6 text-center text-sm">No results found.</Command.Empty>
          {loading && (
            <div className="py-6 text-center">
              <Loader2 className="h-6 w-6 animate-spin mx-auto" />
            </div>
          )}
          {results.map((item) => (
            <Command.Item
              key={item.id}
              value={item.title}
              onSelect={() => handleSelectItem(item)}
              className="px-4 py-2 text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground"
            >
              <div className="flex flex-col">
                <span>{item.title}</span>
                <span className="text-xs text-muted-foreground">{item.category}</span>
              </div>
            </Command.Item>
          ))}
        </Command.List>
      </Command.Dialog>
    </div>
  )
}

