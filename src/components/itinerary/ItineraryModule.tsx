'use client'

import { ItineraryItem } from './ItineraryItem'
import { AddItineraryNodeForm } from './AddItineraryNodeForm'
import type { ItineraryNode } from '@/types/database'

interface ItineraryModuleProps {
  tripId: string
  nodes: ItineraryNode[]
}

export function ItineraryModule({ tripId, nodes }: ItineraryModuleProps) {
  // Group by day_number
  const groupedNodes = nodes.reduce((acc, node) => {
    const day = node.day_number || 1
    if (!acc[day]) acc[day] = []
    acc[day].push(node)
    return acc
  }, {} as Record<number, ItineraryNode[]>)

  const days = Object.keys(groupedNodes)
    .map(Number)
    .sort((a, b) => a - b)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
          行程时间轴
        </h3>
        <AddItineraryNodeForm tripId={tripId} />
      </div>

      <div className="space-y-12">
        {days.length === 0 ? (
          <div className="py-12 text-center rounded-2xl border-2 border-dashed border-muted bg-muted/10">
            <p className="text-sm text-muted-foreground">还没有行程节点，点击右上方按钮添加。</p>
          </div>
        ) : (
          days.map(day => (
            <div key={day} className="space-y-6">
              <div className="sticky top-[156px] z-10 -mx-4 px-4 bg-background/95 backdrop-blur py-1 flex items-center gap-3">
                <div className="bg-primary text-primary-foreground text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase shadow-sm shadow-primary/20">
                  Day {day}
                </div>
                <div className="h-px flex-1 bg-gradient-to-r from-muted to-transparent" />
              </div>
              
              <div className="pt-2">
                {groupedNodes[day]
                  .sort((a, b) => ((a.time_text || (a as any).time || '')).localeCompare(b.time_text || (b as any).time || ''))
                  .map(node => (
                    <ItineraryItem key={node.id} node={node} />
                  ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
