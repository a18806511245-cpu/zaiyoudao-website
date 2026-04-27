import { NextRequest, NextResponse } from 'next/server'

// 后端 API 地址 - 请根据实际部署环境配置
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null

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

    // 构建 FormData 转发到后端
    const backendFormData = new FormData()
    backendFormData.append('file', file)

    // 调用后端 API
    const response = await fetch(`${API_BASE_URL}/api/analyze/upload`, {
      method: 'POST',
      body: backendFormData,
      headers: {
        // 不设置 Content-Type，让 fetch 自动处理 boundary
      },
    })

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error('分析请求失败:', error)
    return NextResponse.json(
      { code: 500, msg: '服务暂不可用，请稍后重试' },
      { status: 500 }
    )
  }
}
