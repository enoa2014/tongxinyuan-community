"use client"

import { useState, useEffect } from "react"
import { pb } from "@/lib/pocketbase"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, User, Loader2 } from "lucide-react"
import { ResidentsRecord } from "@/types/pocketbase-types"

// Simple debounce hook implementation if not exists
function useDebounceValue<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);
    return debouncedValue;
}

interface ResidentPickerProps {
    onSelect: (resident: ResidentsRecord) => void
    selectedId?: string
}

export function ResidentPicker({ onSelect, selectedId }: ResidentPickerProps) {
    const [search, setSearch] = useState("")
    const debouncedSearch = useDebounceValue(search, 500)
    const [residents, setResidents] = useState<ResidentsRecord[]>([])
    const [loading, setLoading] = useState(false)
    const [selectedResident, setSelectedResident] = useState<ResidentsRecord | null>(null)

    // Initial fetch or fetch on search
    useEffect(() => {
        async function fetchResidents() {
            setLoading(true)
            try {
                let filter = 'status = "active"'
                if (debouncedSearch) {
                    filter += ` && (name ~ "${debouncedSearch}" || phone ~ "${debouncedSearch}")`
                }

                const result = await pb.collection('residents').getList<ResidentsRecord>(1, 10, {
                    filter: filter,
                    sort: '-created',
                })
                setResidents(result.items)
            } catch (e) {
                console.error("Failed to fetch residents", e)
            } finally {
                setLoading(false)
            }
        }

        fetchResidents()
    }, [debouncedSearch])

    // Load selected resident detail if ID provided
    useEffect(() => {
        if (selectedId && !selectedResident) {
            pb.collection('residents').getOne<ResidentsRecord>(selectedId)
                .then(setSelectedResident)
                .catch(console.error)
        }
    }, [selectedId, selectedResident])

    const handleSelect = (r: ResidentsRecord) => {
        setSelectedResident(r)
        onSelect(r)
        // Clear search? Maybe not.
    }

    if (selectedResident && !search) {
        return (
            <div className="flex items-center justify-between p-3 border rounded-lg bg-green-50 border-green-200">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-700">
                        <User size={20} />
                    </div>
                    <div>
                        <p className="font-medium text-green-900">{selectedResident.name}</p>
                        <p className="text-xs text-green-700">{selectedResident.phone || '无电话'}</p>
                    </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => {
                    setSelectedResident(null)
                    onSelect(null as any) // Type hack or allow null in prop
                }}>
                    更换
                </Button>
            </div>
        )
    }

    return (
        <div className="space-y-2">
            <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="搜索姓名或电话..."
                    className="pl-9"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <div className="max-h-[200px] overflow-y-auto border rounded-md divide-y">
                {loading ? (
                    <div className="p-4 flex justify-center text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin mr-2" /> 加载中...
                    </div>
                ) : residents.length === 0 ? (
                    <div className="p-4 text-center text-sm text-muted-foreground">
                        未找到居民
                    </div>
                ) : (
                    residents.map(r => (
                        <div
                            key={r.id}
                            className="p-3 flex items-center gap-3 active:bg-slate-50 cursor-pointer"
                            onClick={() => handleSelect(r)}
                        >
                            <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                                <User size={16} />
                            </div>
                            <div>
                                <p className="font-medium text-sm">{r.name}</p>
                                <p className="text-xs text-muted-foreground">{r.address || r.phone || '信息不全'}</p>
                            </div>
                            {r.tags && r.tags.length > 0 && (
                                <div className="ml-auto flex gap-1">
                                    {r.tags.slice(0, 1).map(tag => (
                                        <span key={tag} className="text-[10px] px-1.5 py-0.5 bg-yellow-100 text-yellow-800 rounded-full">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
