'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createTrip(formData: FormData) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: '未登录' }
  }

  const title = formData.get('title') as string
  const destination = formData.get('destination') as string
  const start_date = formData.get('start_date') as string
  const end_date = formData.get('end_date') as string

  // 1. 创建行程
  const { data: trip, error: tripError } = await supabase
    .from('trips')
    .insert([
      {
        title,
        destination,
        start_date,
        end_date,
        created_by: user.id,
      },
    ])
    .select()
    .single()

  if (tripError) {
    return { error: tripError.message }
  }

  // 2. 将创建者添加为管理员
  const { error: memberError } = await supabase
    .from('trip_members')
    .insert([
      {
        trip_id: trip.id,
        user_id: user.id,
        role: 'admin',
      },
    ])

  if (memberError) {
    return { error: memberError.message }
  }

  revalidatePath('/trips')
  return { data: trip }
}

export async function updateTrip(id: string, formData: FormData) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: '未登录' }
  }

  const title = formData.get('title') as string
  const destination = formData.get('destination') as string
  const start_date = formData.get('start_date') as string
  const end_date = formData.get('end_date') as string

  const { data, error } = await supabase
    .from('trips')
    .update({
      title,
      destination,
      start_date,
      end_date,
    })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/trips')
  revalidatePath(`/trips/${id}`)
  return { data }
}

export async function deleteTrip(id: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: '未登录' }
  }

  const { error } = await supabase
    .from('trips')
    .delete()
    .eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/trips')
  return { success: true }
}
