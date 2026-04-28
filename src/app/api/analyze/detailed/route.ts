import { NextRequest, NextResponse } from 'next/server'

// 古籍知识库 - 用于分析引用
const ANCIENT_WISDOM = [
  "《宅经》云：'阴阳之枢纽'，住宅为人之根本，须得天地之和气。",
  "《青囊经》曰：'风水之法，得水为上，藏风次之'，纳气聚财之要诀。",
  "《博山篇》论：'识得真龙，方得真穴'，住宅当寻山水环抱之地。",
  "《撼龙经》云：'龙者山脉也，蜿蜒起伏为吉'，住宅背后宜有靠山。",
  "《催官篇》曰：'方位理气，随形应验'，八卦五行配合为要。",
  "《雪心赋》云：'水为财之源'，住宅前宜有水流环抱。",
  "《发微论》曰：'形止气蓄，生气流行'，空间布局贵在藏风聚气。",
  "《地理正宗》云：'气乘风则散，界水则止'，住宅需避风迎水。",
  "《金锁玉关经》论：'二十四山有吉凶'，方位布局需合五行。",
  "《玉尺经》曰：'来龙去脉，关乎盛衰'，住宅龙脉不可断绝。",
  "《葬经翼》云：'风水之道，通因制宜'，因山势水形而变。",
  "《阴阳二宅全书》曰：'宅吉人荣，宅凶人困'，气场与运势息息相关。"
]

// 基于图片特征生成分析结果
interface ImageAnalysisFeatures {
  hasMultipleRooms: boolean
  hasBalcony: boolean
  hasOpenKitchen: boolean
  hasSeparateBathroom: boolean
  isCompactLayout: boolean
  hasCorridor: boolean
  roomCount: number
  naturalLightEstimate: 'good' | 'moderate' | 'poor'
  ventilationEstimate: 'good' | 'moderate' | 'poor'
}

// 从图片特征推断分析结果
function analyzeImageFeatures(imageDataUrl: string): ImageAnalysisFeatures {
  // 实际使用时，这里应该调用视觉 AI 模型分析图片
  // 现在基于图片 URL 的 hash 生成伪随机但一致的特征
  const hash = imageDataUrl.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0)
    return a & a
  }, 0)
  
  const random = Math.abs(hash)
  
  return {
    hasMultipleRooms: random % 3 !== 0,
    hasBalcony: random % 2 === 0,
    hasOpenKitchen: random % 4 !== 0,
    hasSeparateBathroom: true,
    isCompactLayout: random % 5 < 2,
    hasCorridor: random % 3 !== 0,
    roomCount: (random % 5) + 2,
    naturalLightEstimate: ['good', 'moderate', 'poor'][random % 3] as 'good' | 'moderate' | 'poor',
    ventilationEstimate: ['good', 'moderate', 'poor'][(random >> 4) % 3] as 'good' | 'moderate' | 'poor'
  }
}

// 根据特征生成个性化分析结果
function generatePersonalizedAnalysis(features: ImageAnalysisFeatures) {
  const {
    hasMultipleRooms, hasBalcony, hasOpenKitchen, hasSeparateBathroom,
    isCompactLayout, hasCorridor, roomCount, naturalLightEstimate, ventilationEstimate
  } = features
  
  // 计算各项评分
  let layoutScore = 60 + (hasMultipleRooms ? 10 : 0) + (hasSeparateBathroom ? 5 : 0) + (hasCorridor ? 5 : 0) - (isCompactLayout ? 5 : 0)
  let lightScore = naturalLightEstimate === 'good' ? 85 : naturalLightEstimate === 'moderate' ? 70 : 55
  lightScore += hasBalcony ? 5 : 0
  let ventScore = ventilationEstimate === 'good' ? 80 : ventilationEstimate === 'moderate' ? 65 : 50
  ventScore += hasBalcony ? 10 : 0
  let tidyScore = 70 + (roomCount > 3 ? -5 : 5)
  let energyScore = (layoutScore + lightScore + ventScore) / 3
  
  const overallScore = Math.floor((layoutScore + lightScore + ventScore + tidyScore + energyScore) / 5)
  
  // 生成布局分析
  let layoutAnalysis = ''
  if (isCompactLayout) {
    layoutAnalysis = '户型较为紧凑，空间利用率较高，适合小家庭居住。'
  } else {
    layoutAnalysis = '户型空间宽敞，动静分区合理，居住舒适度高。'
  }
  if (hasCorridor) {
    layoutAnalysis += '走廊设计过渡自然，但需注意走廊长度不宜过长。'
  }
  if (hasOpenKitchen) {
    layoutAnalysis += '开放式厨房设计现代时尚，需注意油烟控制。'
  }
  
  // 生成采光分析
  let lightAnalysis = ''
  if (naturalLightEstimate === 'good') {
    lightAnalysis = '主要功能区采光充足，自然光线分布均匀，室内明亮舒适。'
  } else if (naturalLightEstimate === 'moderate') {
    lightAnalysis = '采光条件一般，部分区域可能需要辅助照明补充。'
  } else {
    lightAnalysis = '整体采光受限，建议增加人工照明，避免阴暗角落影响气场。'
  }
  if (hasBalcony) {
    lightAnalysis += '阳台设计有助于引入自然光与正能量。'
  }
  
  // 生成通风分析
  let ventAnalysis = ''
  if (ventilationEstimate === 'good') {
    ventAnalysis = '通风条件优良，空气流通顺畅，有利于气场流动与健康。'
  } else if (ventilationEstimate === 'moderate') {
    ventAnalysis = '通风基本顺畅，建议定期开窗通风，保持空气新鲜。'
  } else {
    ventAnalysis = '通风条件受限，建议安装换气设备，避免气流停滞影响运势。'
  }
  if (hasBalcony) {
    ventAnalysis += '阳台位置有利于增强室内通风效果。'
  }
  
  // 生成整体评价
  let overallComment = ''
  if (overallScore >= 80) {
    overallComment = '整体风水格局优良，气场平衡和谐，是难得的吉宅。'
  } else if (overallScore >= 70) {
    overallComment = '风水格局良好，稍加调整即可达到最佳状态。'
  } else if (overallScore >= 60) {
    overallComment = '风水格局尚可，建议针对性优化以提升整体运势。'
  } else {
    overallComment = '存在明显风水问题，需要认真对待并积极改善。'
  }
  
  // 生成建议
  const suggestions: string[] = []
  if (naturalLightEstimate !== 'good') {
    suggestions.push('使用明亮的灯具补充自然光不足的区域')
  }
  if (ventilationEstimate !== 'good') {
    suggestions.push('每天定时开窗通风，保持空气流通')
  }
  if (isCompactLayout) {
    suggestions.push('利用镜面和玻璃材质扩展视觉空间感')
  }
  suggestions.push('保持室内整洁有序，气场清净则运势顺畅')
  suggestions.push('适当添置绿植，提升空间生机与正能量')
  
  // 随机选择古籍智慧
  const shuffled = [...ANCIENT_WISDOM].sort(() => Math.random() - 0.5)
  const ancientWisdom = shuffled.slice(0, 2)
  
  return {
    layout: layoutAnalysis,
    light: lightAnalysis,
    ventilation: ventAnalysis,
    overall: overallComment,
    suggestions,
    scores: {
      layout: Math.min(100, Math.max(50, Math.floor(layoutScore))),
      light: Math.min(100, Math.max(50, Math.floor(lightScore))),
      ventilation: Math.min(100, Math.max(50, Math.floor(ventScore))),
      tidy: Math.min(100, Math.max(50, Math.floor(tidyScore))),
      energy: Math.min(100, Math.max(50, Math.floor(energyScore)))
    },
    overallScore: Math.min(100, Math.max(50, Math.floor(overallScore))),
    ancientWisdom
  }
}

// 确定等级
function getGrade(score: number): { grade: string; gradeText: string; gradeColor: string } {
  if (score >= 85) return { grade: 'excellent', gradeText: '卓越', gradeColor: '#22c55e' }
  if (score >= 75) return { grade: 'good', gradeText: '良好', gradeColor: '#3b82f6' }
  if (score >= 65) return { grade: 'moderate', gradeText: '中等', gradeColor: '#f59e0b' }
  return { grade: 'poor', gradeText: '欠佳', gradeColor: '#ef4444' }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json({ code: 400, msg: '请上传图片', data: null }, { status: 400 })
    }
    
    // 检查文件类型
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ code: 400, msg: '请上传图片文件', data: null }, { status: 400 })
    }
    
    // 生成预览 URL
    const imageUrl = URL.createObjectURL(file)
    
    // 转换为 base64 用于分析
    const arrayBuffer = await file.arrayBuffer()
    const base64 = Buffer.from(arrayBuffer).toString('base64')
    const imageDataUrl = `data:${file.type};base64,${base64}`
    
    // 分析图片特征
    const features = analyzeImageFeatures(imageDataUrl)
    
    // 生成个性化分析结果
    const analysis = generatePersonalizedAnalysis(features)
    
    const gradeInfo = getGrade(analysis.overallScore)
    
    // 构建完整报告
    const result = {
      id: `analysis_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      userId: 'website_user',
      source: 'website',
      imageUrl,
      score: analysis.overallScore,
      grade: gradeInfo.grade,
      gradeText: gradeInfo.gradeText,
      gradeColor: gradeInfo.gradeColor,
      overallComment: `${analysis.overall} ${analysis.ancientWisdom[0]}`,
      
      scores: {
        overall: analysis.overallScore,
        layout: analysis.scores.layout,
        light: analysis.scores.light,
        ventilation: analysis.scores.ventilation,
        tidy: analysis.scores.tidy,
        energy: analysis.scores.energy
      },
      
      layoutIssues: analysis.scores.layout < 70 ? ['空间布局存在优化空间'] : [],
      
      advantages: [
        { title: '采光通风', desc: analysis.light },
        { title: '整体格局', desc: analysis.layout },
        { title: '气场能量', desc: analysis.overall }
      ].filter(a => analysis.scores.layout >= 65 || analysis.scores.light >= 70),
      
      disadvantages: analysis.overallScore < 75 ? [
        { title: '待优化项', desc: analysis.suggestions[0] || '建议针对性改善' }
      ] : [],
      
      areaAnalysis: [
        {
          area: '客厅',
          icon: '🏠',
          status: analysis.overallScore >= 75 ? 'good' : analysis.overallScore >= 65 ? 'moderate' : 'poor',
          score: Math.floor((analysis.scores.light + analysis.scores.layout) / 2),
          findings: analysis.scores.light >= 70 ? ['自然光线充足'] : ['采光一般，需辅助照明'],
          problems: analysis.scores.layout < 70 ? ['布局可进一步优化'] : [],
          suggestions: analysis.suggestions.slice(0, 2)
        },
        {
          area: '卧室',
          icon: '🛏️',
          status: analysis.scores.energy >= 72 ? 'good' : analysis.scores.energy >= 62 ? 'moderate' : 'poor',
          score: analysis.scores.energy,
          findings: ['空间私密性良好', '适合休息'],
          problems: analysis.scores.energy < 65 ? ['能量场可以增强'] : [],
          suggestions: ['保持床品整洁', '减少电子设备']
        },
        {
          area: '厨房',
          icon: '🍳',
          status: analysis.scores.ventilation >= 70 ? 'good' : analysis.scores.ventilation >= 60 ? 'moderate' : 'poor',
          score: Math.floor((analysis.scores.ventilation + analysis.scores.tidy) / 2),
          findings: analysis.scores.ventilation >= 70 ? ['通风良好'] : ['通风需改善'],
          problems: analysis.scores.ventilation < 65 ? ['注意通风换气'] : [],
          suggestions: ['保持清洁', '定期通风']
        },
        {
          area: '卫生间',
          icon: '🚿',
          status: analysis.scores.tidy >= 68 ? 'good' : analysis.scores.tidy >= 58 ? 'moderate' : 'poor',
          score: analysis.scores.tidy,
          findings: ['设施完好'],
          problems: analysis.scores.tidy < 60 ? ['需加强通风除湿'] : [],
          suggestions: ['保持干燥', '定期清洁']
        }
      ],
      
      improvementSuggestions: analysis.suggestions.slice(0, 5).map((s, i) => ({
        priority: i < 2 ? '高' : i < 4 ? '中' : '低',
        title: s.split('，')[0].replace(/[。！？]/g, ''),
        desc: s
      })),
      
      positiveTags: ['采光良好', '布局合理'].slice(0, analysis.overallScore >= 75 ? 2 : 1),
      negativeTags: analysis.overallScore < 70 ? ['待优化'] : [],
      
      ancientWisdom: analysis.ancientWisdom
    }
    
    console.log('分析完成，评分:', result.score)
    
    return NextResponse.json({
      code: 200,
      msg: '分析完成',
      data: result
    })
    
  } catch (error) {
    console.error('分析失败:', error)
    return NextResponse.json({ 
      code: 500, 
      msg: '分析失败，请重试', 
      data: null 
    }, { status: 500 })
  }
}
