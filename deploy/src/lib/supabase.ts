import { createClient } from '@supabase/supabase-js'

// 环境变量 - 请在 .env.local 中配置
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// 创建 Supabase 客户端
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// 类型定义
export interface User {
  id: string
  nickname?: string
  avatar_url?: string
  source: 'website' | 'miniprogram'
  created_at: string
}

export interface AnalysisRecord {
  id: number
  user_id: string
  image_url: string
  score: number
  summary: string
  source: 'website' | 'miniprogram'
  created_at: string
}

// API 函数
export async function getOrCreateWebsiteUser(): Promise<string> {
  // 官网用户：使用 localStorage 存储的匿名 ID
  if (typeof window === 'undefined') return ''
  
  let userId = localStorage.getItem('website_user_id')
  
  if (!userId) {
    // 生成新的匿名用户 ID
    userId = `website_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    localStorage.setItem('website_user_id', userId)
    
    // 在 Supabase 中创建用户记录
    if (supabaseUrl && supabaseAnonKey) {
      try {
        await supabase.from('users').insert({
          id: userId,
          source: 'website',
        })
      } catch (error) {
        console.error('创建用户失败:', error)
      }
    }
  }
  
  return userId
}

export async function saveAnalysisRecord(
  userId: string,
  imageUrl: string,
  score: number,
  summary: string
): Promise<void> {
  if (!supabaseUrl || !supabaseAnonKey) return
  
  try {
    await supabase.from('analysis_records').insert({
      user_id: userId,
      image_url: imageUrl,
      score,
      summary,
      source: 'website',
    })
  } catch (error) {
    console.error('保存分析记录失败:', error)
  }
}

export async function getAnalysisHistory(userId: string): Promise<AnalysisRecord[]> {
  if (!supabaseUrl || !supabaseAnonKey) return []
  
  try {
    const { data, error } = await supabase
      .from('analysis_records')
      .select('*')
      .eq('user_id', userId)
      .eq('source', 'website')
      .order('created_at', { ascending: false })
      .limit(20)
    
    if (error) throw error
    return data || []
  } catch (error) {
    console.error('获取分析历史失败:', error)
    return []
  }
}
