import { NextRequest, NextResponse } from 'next/server'

// 小程序后端 API 地址
const BACKEND_URL = process.env.BACKEND_API_URL || 'http://localhost:3000'

// 模拟的 userId（官网用户）
const WEBSITE_USER_ID = 'website_user_' + Math.random().toString(36).substring(7)

export async function POST(request: NextRequest) {
  try {
    // 解析 multipart/form-data
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const spaceType = formData.get('spaceType') as string || 'whole'

    if (!file) {
      return NextResponse.json({
        code: 1,
        msg: '请上传图片文件',
        data: null
      }, { status: 400 })
    }

    // 构建转发到小程序后端的请求
    const backendFormData = new FormData()
    backendFormData.append('image', file)
    backendFormData.append('spaceType', spaceType)
    backendFormData.append('userId', WEBSITE_USER_ID)

    console.log('[官网分析] 正在调用小程序后端 API...')
    console.log('[官网分析] 文件大小:', file.size, 'bytes')
    console.log('[官网分析] 文件类型:', file.type)
    console.log('[官网分析] Backend URL:', `${BACKEND_URL}/api/analyze/upload`)

    // 调用小程序后端 API
    const backendResponse = await fetch(`${BACKEND_URL}/api/analyze/upload`, {
      method: 'POST',
      body: backendFormData,
      headers: {
        // 不设置 Content-Type，让 fetch 自动处理 multipart boundary
      },
      // 超时控制
      signal: AbortSignal.timeout(120000), // 120秒超时
    })

    console.log('[官网分析] 后端响应状态:', backendResponse.status)

    const result = await backendResponse.json()
    console.log('[官网分析] 后端返回结果:', JSON.stringify(result).substring(0, 200) + '...')

    // 转换后端返回格式以适配官网展示
    if (result.code === 0 && result.data) {
      return NextResponse.json({
        code: 200,
        msg: '分析成功',
        data: transformToWebsiteFormat(result.data)
      })
    } else {
      // 如果小程序后端返回错误，返回友好的错误信息
      return NextResponse.json({
        code: result.code || 1,
        msg: result.msg || '分析服务暂时不可用，请稍后重试',
        data: null
      }, { status: 200 })
    }
  } catch (error: any) {
    console.error('[官网分析] 分析失败:', error)

    // 判断错误类型
    let errorMessage = '分析失败，请稍后重试'
    if (error.name === 'TimeoutError') {
      errorMessage = '分析超时，请尝试上传更小的图片或稍后重试'
    } else if (error.message?.includes('fetch')) {
      errorMessage = '无法连接到分析服务，请确保后端服务正在运行'
    }

    return NextResponse.json({
      code: 500,
      msg: errorMessage,
      data: null
    }, { status: 500 })
  }
}

// 将小程序后端返回的格式转换为官网展示格式
function transformToWebsiteFormat(backendData: any) {
  return {
    id: backendData.id || `analysis_${Date.now()}`,
    userId: WEBSITE_USER_ID,
    source: 'website',
    imageUrl: backendData.imageUrl || '',
    score: backendData.score || 70,
    grade: backendData.grade || 'good',
    gradeText: backendData.gradeDesc || '良好格局',
    gradeColor: getGradeColor(backendData.score || 70),
    overallComment: backendData.overallComment || '此宅整体格局良好，气场流通自然。',
    scores: backendData.dimensions ? {
      overall: backendData.dimensions.find((d: any) => d.name === '综合评分')?.score || backendData.score || 70,
      layout: backendData.dimensions.find((d: any) => d.name === '格局')?.score || 75,
      light: backendData.dimensions.find((d: any) => d.name === '采光')?.score || 78,
      ventilation: backendData.dimensions.find((d: any) => d.name === '通风')?.score || 72,
      tidy: backendData.dimensions.find((d: any) => d.name === '整洁')?.score || 80,
      energy: backendData.dimensions.find((d: any) => d.name === '能量')?.score || 70,
    } : {
      overall: backendData.score || 70,
      layout: 75,
      light: 78,
      ventilation: 72,
      tidy: 80,
      energy: 70,
    },
    advantages: (backendData.issues || [])
      .filter((issue: any) => issue.severity === 'low')
      .map((issue: any) => ({
        title: issue.title,
        desc: issue.description
      })),
    disadvantages: (backendData.issues || [])
      .filter((issue: any) => ['high', 'mid'].includes(issue.severity))
      .map((issue: any) => ({
        title: issue.title,
        desc: issue.description,
        solution: issue.solution
      })),
    improvementSuggestions: (backendData.actions || []).map((action: any) => ({
      priority: action.priority,
      title: action.text,
      desc: `建议在 ${action.time || '近期'} 完成`
    })),
    areaAnalysis: (backendData.areaAnalysis || []).map((area: any) => ({
      area: area.area,
      icon: area.icon,
      status: area.status,
      score: area.score || 70,
      findings: area.details?.map((d: any) => d.content) || [],
      problems: area.status === 'poor' ? ['需要改善'] : [],
      suggestions: area.details?.filter((d: any) => d.fengshuiMeaning)?.map((d: any) => d.fengshuiMeaning) || []
    })),
    dimensions: backendData.dimensions || [],
    issues: backendData.issues || [],
    actions: backendData.actions || [],
    positiveTags: backendData.positiveTags || [],
    negativeTags: backendData.negativeTags || [],
    ancientWisdom: backendData.ancientWisdom || [],
    infoImageUrl: backendData.infoImageUrl,
    generatedAt: backendData.generatedAt || new Date().toISOString()
  }
}

// 根据分数获取颜色
function getGradeColor(score: number): string {
  if (score >= 85) return '#22c55e' // green
  if (score >= 70) return '#84cc16' // lime
  if (score >= 55) return '#eab308' // yellow
  if (score >= 40) return '#f97316' // orange
  return '#ef4444' // red
}
