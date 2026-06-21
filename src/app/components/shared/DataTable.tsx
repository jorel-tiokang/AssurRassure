import React from "react"
import { Search } from "lucide-react"
import { Input } from "../ui/Input"

interface Column<T> {
  header: string
  accessor: keyof T | ((item: T) => React.ReactNode)
  className?: string
}

interface DataTableProps<T> {
  data: T[]
  columns: Column<T>[]
  keyExtractor: (item: T) => string
  searchPlaceholder?: string
  searchable?: boolean
  searchFilter?: (item: T, search: string) => boolean
  emptyMessage?: string
}

export function DataTable<T>({
  data,
  columns,
  keyExtractor,
  searchPlaceholder = "Rechercher...",
  searchable = true,
  searchFilter,
  emptyMessage = "Aucune donnée trouvée."
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = React.useState("")

  const filteredData = searchable && searchFilter
    ? data.filter(item => searchFilter(item, searchTerm))
    : data

  return (
    <div className="bg-white border border-ink/10 shadow-sm">
      {searchable && (
        <div className="p-4 border-b border-ink/10 flex justify-between items-center bg-zinc-50">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-muted" />
            <Input 
              placeholder={searchPlaceholder} 
              className="pl-10 h-10 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-ink-muted uppercase bg-zinc-50 border-b border-ink/10">
            <tr>
              {columns.map((col, index) => (
                <th key={index} className={`px-6 py-4 font-medium ${col.className || ""}`}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/5">
            {filteredData.map((item) => (
              <tr key={keyExtractor(item)} className="hover:bg-zinc-50/50 transition-colors group">
                {columns.map((col, index) => (
                  <td key={index} className={`px-6 py-4 ${col.className || ""}`}>
                    {typeof col.accessor === "function" 
                      ? col.accessor(item) 
                      : (item[col.accessor] as React.ReactNode)}
                  </td>
                ))}
              </tr>
            ))}
            {filteredData.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center text-ink-muted">
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {filteredData.length > 0 && (
        <div className="p-4 border-t border-ink/10 bg-zinc-50 flex items-center justify-between text-sm text-ink-muted">
          <span>Affichage de {filteredData.length} élément(s)</span>
        </div>
      )}
    </div>
  )
}
