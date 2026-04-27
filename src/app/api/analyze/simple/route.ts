import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Supabase 配置
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// 创建 Supabase 客户端
const supabase = createClient(supabaseUrl, supabaseKey)

// 简化的分析结果生成
function generateMockAnalysis(imageUrl: string) {
  const scores = [72, 75, 68, 80, 78, 73, 77, 81]
  const score = scores[Math.floor(Math.random() * scores.length)]
  
  let grade = 'C'
  let gradeDesc = '能量中等'
  if (score >= 85) { grade = 'A'; gradeDesc = '能量充沛' }
  else if (score >= 75) { grade = 'B'; gradeDesc = '能量良好' }
  else if (score >= 65) { grade = 'C'; gradeDesc = '能量中等' }
  else { grade = 'D'; gradeDesc = '能量较弱' }

  return {
    code: 200,
    msg: '分析完成',
    data: {
      id: `analysis_${Date.now()}`,
      userId: 'website_user',
      source: 'website',
      imageUrl,
      score,
      grade,
      gradeDesc,
      overallComment: `您的家居空间整体能量评分为 ${score} 分，等级为 ${grade}。${gradeDesc}，建议适当调整空间布局以提升整体能量场。`,
      positiveTags: ['采光良好', '通风顺畅', '空间开阔'],
      negativeTags: ['色彩偏暗', '杂物较多', '动线不畅'],
      dimensions: [
        { name: '光线', icon: '☀️', score: 82, color: '#22c55e' },
        { name: '通风', icon: '💨', score: 75, color: '#3b82f6' },
        { name: '整洁', icon: '✨', score: 68, color: '#f59e0b' },
        { name: '布局', icon: '🪑', score: 78, color: '#8b5cf6' },
      ],
      areaAnalysis: [
        {
          area: '客厅',
          icon: '🏠',
          description: '客厅是家庭活动的核心区域',
          status: 'good' as const,
          details: [
            { icon: '👍', title: '优点', content: '空间开阔，采光充足' },
            { icon: '💡', title: '建议', content: '保持整洁，适当添置绿植' },
          ],
        },
        {
          area: '卧室',
          icon: '🛏️',
          description: '卧室是休息放松的重要空间',
          status: 'moderate' as const,
          details: [
            { icon: '👍', title: '优点', content: '位置安静' },
            { icon: '💡', title: '建议', content: '减少电子产品，优化床品' },
          ],
        },
      ],
      issues: [
        {
          icon: '📦',
          title: '杂物堆积',
          area: '客厅',
          severity: 'mid' as const,
          description: '部分区域存在杂物堆积',
          solution: '定期整理，保持空间通透',
        },
      ],
      actions: [
        { priority: 'high' as const, text: '整理客厅杂物', time: '今日' },
        { priority: 'mid' as const, text: '添置绿植', time: '本周' },
        { priority: 'low' as const, text: '调整灯光', time: '本月' },
      ],
      highlights: [],
      analysisSteps: [
        { step: 1, title: '上传图片', description: '正在上传图片...', status: 'completed' as const },
        { step: 2, title: 'AI 分析', description: '正在分析空间能量...', status: 'completed' as const },
        { step: 3, title: '生成报告', description: '正在生成报告...', status: 'completed' as const },
      ],
      generatedAt: new Date().toISOString(),
    },
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const userId = formData.get('userId') as string | null

    if (!file) {
      return NextResponse.json(
        { code: 400, msg: '请上传图片文件' },
        { status: 400 }
      )
    }

    // 验证文件类型
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { code: 400, msg: '只支持图片文件' },
        { status: 400 }
      )
    }

    // 验证文件大小 (10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { code: 400, msg: '图片大小不能超过 10MB' },
        { status: 400 }
      )
    }

    // 上传图片到 Supabase Storage
    const fileName = `analyze_${Date.now()}_${Math.random().toString(36).substring(7)}.jpg`
    const fileBuffer = await file.arrayBuffer()
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('zaiyoudao-images')
      .upload(fileName, fileBuffer, {
        contentType: file.type,
        upsert: false,
      })

    if (uploadError) {
      console.error('上传图片失败:', uploadError)
      return NextResponse.json(
        { code: 500, msg: '图片上传失败' },
        { status: 500 }
      )
    }

    // 获取公开 URL
    const { data: urlData } = supabase.storage
      .from('zaiyoudao-images')
      .getPublicUrl(fileName)

    const imageUrl = urlData.publicUrl

    // 生成分析结果（模拟）
    const result = generateMockAnalysis(imageUrl)

    // 保存分析记录到数据库
    if (userId) {
      await supabase.from('analysis_records').insert({
        user_id: userId,
        source: 'website',
        image_url: imageUrl,
        score: result.data.score,
        grade: result.data.grade,
        result_json: result.data,
        created_at: new Date().toISOString(),
      })
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('分析请求失败:', error)
    return NextResponse.json(
      { code: 500, msg: '服务暂不可用，请稍后重试' },
      { status: 500 }
    )
  }
}
