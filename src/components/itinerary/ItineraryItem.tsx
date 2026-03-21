'use client'

import { MapPin, Clock, ExternalLink, MoreVertical, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { deleteItineraryNode } from '@/app/trips/actions/itinerary-actions'
import { toast } from 'sonner'
import type { ItineraryNode } from '@/types/database'

interface ItineraryItemProps {
  node: ItineraryNode
}

export function ItineraryItem({ node }: ItineraryItemProps) {
  async function handleDelete() {
    if (!confirm('确定要删除这个节点吗？')) return
    
    const result = await deleteItineraryNode(node.id, node.trip_id)
    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success('已删除节点')
    }
  }

  return (
    <div className="relative pl-8 pb-8 last:pb-0">
      {/* Timeline line */}
      <div className="absolute left-[11px] top-2 h-full w-[1px] bg-muted last:hidden" />
      
      {/* Timeline dot */}
      <div className="absolute left-0 top-1.5 h-6 w-6 rounded-full border-2 border-background bg-primary shadow-sm ring-4 ring-primary/10" />

      <Card className="p-4 space-y-3 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1 flex-1">
            <div className="flex items-center gap-2 text-[10px] font-bold text-primary uppercase tracking-wider">
              <Clock className="h-3 w-3" />
              {node.time_text || '未定时间'}
            </div>
            <h4 className="font-semibold text-sm leading-tight flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
              {node.location_name}
            </h4>
          </div>
          
          <div className="flex items-center gap-1 shrink-0">
            {node.external_link && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full text-muted-foreground hover:text-primary"
                asChild
              >
                <a href={node.external_link} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            )}
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-muted-foreground">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-32">
                <DropdownMenuItem className="text-destructive gap-2" onClick={handleDelete}>
                  <Trash2 className="h-4 w-4" />
                  删除节点
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {node.note && (
          <p className="text-xs text-muted-foreground leading-relaxed bg-muted/30 p-2 rounded-lg border border-muted/50">
            {node.note}
          </p>
        )}
      </Card>
    </div>
  )
}
