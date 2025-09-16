"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type SavedTemplate = {
  id: string
  title: string
  template_slug: string
  created_at: string
  updated_at: string
}

export default function TemplatesPage() {
  const [items, setItems] = useState<SavedTemplate[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState("")

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        const res = await fetch("/api/templates", {
          headers: {
            ...(typeof window !== "undefined" && localStorage.getItem("authToken")
              ? { Authorization: `Bearer ${localStorage.getItem("authToken")}` }
              : {}),
          },
        })
        if (!res.ok) throw new Error("Failed to load templates")
        const data = await res.json()
        setItems(data.userTemplates || [])
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const filtered = items.filter(i => i.title.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-bold boss-text-gradient">My Template Saves</h1>
        <div className="w-64"><Input placeholder="Search saves" value={search} onChange={e=>setSearch(e.target.value)} /></div>
      </div>

      {loading ? (
        <p className="text-sm text-gray-500">Loading…</p>
      ) : error ? (
        <p className="text-sm text-red-600">{error}</p>
      ) : filtered.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center">
            <p className="text-gray-600 mb-4">No saved templates yet.</p>
            <Button asChild><Link href="/templates">Browse Templates</Link></Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(t => (
            <Card key={t.id} className="hover:shadow-lg transition">
              <CardHeader>
                <CardTitle className="text-base truncate">{t.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-between">
                <div className="text-xs text-gray-500">Updated {new Date(t.updated_at).toLocaleDateString()}</div>
                <Button asChild size="sm" variant="outline">
                  <Link href={`/templates/${t.template_slug}`}>Open</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}