import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// 详细的户型分析结果生成
function generateDetailedAnalysis(imageUrl: string) {
  // 模拟详细分析结果
  const baseScore = Math.floor(Math.random() * 20) + 65; // 65-85分
  
  // 计算各项评分
  const layoutScore = baseScore + Math.floor(Math.random() * 10) - 5;
  const lightScore = baseScore + Math.floor(Math.random() * 10) - 5;
  const ventilationScore = baseScore + Math.floor(Math.random() * 10) - 5;
  const tidyScore = baseScore + Math.floor(Math.random() * 15) - 7;
  const energyScore = baseScore + Math.floor(Math.random() * 10) - 5;
  const overallScore = Math.floor((layoutScore + lightScore + ventilationScore + tidyScore + energyScore) / 5);
  
  // 确定等级
  let grade = 'C', gradeText = '中等', gradeColor = '#f59e0b';
  if (overallScore >= 85) { grade = 'A'; gradeText = '优秀'; gradeColor = '#22c55e'; }
  else if (overallScore >= 75) { grade = 'B'; gradeText = '良好'; gradeColor = '#3b82f6'; }
  else if (overallScore >= 65) { grade = 'C'; gradeText = '中等'; gradeColor = '#f59e0b'; }
  else { grade = 'D'; gradeText = '较差'; gradeColor = '#ef4444'; }
  
  // 户型问题诊断
  const layoutIssues = [];
  if (layoutScore < 75) layoutIssues.push('空间布局不够合理');
  if (lightScore < 75) layoutIssues.push('采光分布不均匀');
  if (ventilationScore < 75) layoutIssues.push('通风路径受阻');
  if (tidyScore < 70) layoutIssues.push('收纳空间不足');
  if (layoutIssues.length === 0) layoutIssues.push('整体布局良好，无明显问题');
  
  // 优点分析
  const advantages = [];
  if (lightScore >= 75) advantages.push({ title: '采光充足', desc: '自然光线分布均匀，室内明亮舒适' });
  if (ventilationScore >= 75) advantages.push({ title: '通风良好', desc: '空气流通顺畅，有利于室内空气质量' });
  if (layoutScore >= 75) advantages.push({ title: '动线流畅', desc: '空间动线设计合理，活动便利' });
  if (tidyScore >= 75) advantages.push({ title: '整洁有序', desc: '空间整洁，物品摆放合理' });
  if (advantages.length < 2) {
    advantages.push({ title: '空间开阔', desc: '房间面积适中，视野开阔' });
    advantages.push({ title: '格局方正', desc: '户型整体方正，空间利用率高' });
  }
  
  // 缺点分析
  const disadvantages = [];
  if (layoutScore < 75) disadvantages.push({ title: '布局待优化', desc: '部分区域功能划分不够明确' });
  if (lightScore < 75) disadvantages.push({ title: '采光不足', desc: '部分角落光线偏暗，建议增加照明' });
  if (ventilationScore < 75) disadvantages.push({ title: '通风欠佳', desc: '建议调整窗户位置或添加通风设备' });
  if (tidyScore < 70) disadvantages.push({ title: '略显杂乱', desc: '建议增加收纳空间，定期整理' });
  if (disadvantages.length < 2) {
    disadvantages.push({ title: '装饰单调', desc: '建议适当添加软装装饰提升氛围' });
    disadvantages.push({ title: '绿植较少', desc: '建议增加绿植改善空间能量' });
  }
  
  // 区域分析
  const areaAnalysis = [
    {
      area: '客厅',
      icon: '🏠',
      status: overallScore >= 75 ? 'good' : overallScore >= 65 ? 'moderate' : 'poor',
      score: Math.floor((lightScore + layoutScore) / 2),
      findings: ['沙发摆放位置合理', '电视视角适中'],
      problems: overallScore < 70 ? ['茶几略显拥挤'] : [],
      suggestions: ['增加装饰画提升格调', '适当添置绿植']
    },
    {
      area: '卧室',
      icon: '🛏️',
      status: overallScore >= 70 ? 'good' : overallScore >= 60 ? 'moderate' : 'poor',
      score: Math.floor((lightScore + tidyScore) / 2),
      findings: ['床铺整洁舒适', '睡眠区域私密性良好'],
      problems: overallScore < 65 ? ['衣物堆放较多'] : [],
      suggestions: ['保持床品整洁', '减少电子设备']
    },
    {
      area: '厨房',
      icon: '🍳',
      status: overallScore >= 72 ? 'good' : overallScore >= 62 ? 'moderate' : 'poor',
      score: Math.floor((ventilationScore + tidyScore) / 2),
      findings: ['厨具摆放整齐', '操作台面清洁'],
      problems: overallScore < 68 ? ['通风需要改善'] : [],
      suggestions: ['保持通风', '定期清洁油烟机']
    },
    {
      area: '卫生间',
      icon: '🚿',
      status: overallScore >= 68 ? 'good' : overallScore >= 58 ? 'moderate' : 'poor',
      score: Math.floor((ventilationScore + tidyScore) / 2),
      findings: ['设施完好', '干湿分离合理'],
      problems: overallScore < 63 ? ['部分角落潮湿'] : [],
      suggestions: ['加强通风除湿', '定期消毒清洁']
    }
  ];
  
  // 综合评语
  const overallComment = `您的家居空间能量评分为 ${overallScore} 分（${grade}级${gradeText}）。整体来看，` +
    (overallScore >= 75 ? '您的家居环境能量良好，空间布局合理，建议继续保持。' :
     overallScore >= 65 ? '您的家居环境能量中等，存在一些可以优化的地方，建议从通风和整洁两方面入手改善。' :
     '您的家居环境能量需要提升，建议重点改善空间布局和增加采光通风。');
  
  // 改进建议
  const improvementSuggestions = [
    { priority: '高', title: '优化采光', desc: '使用明亮的灯具补充自然光不足的区域' },
    { priority: '高', title: '加强通风', desc: '每天定时开窗通风，保持空气流通' },
    { priority: '中', title: '整理收纳', desc: '增加收纳空间，保持空间整洁有序' },
    { priority: '中', title: '绿植点缀', desc: '摆放适量绿植，提升空间生机与能量' },
    { priority: '低', title: '软装升级', desc: '适当添加装饰画、抱枕等软装元素' }
  ];
  
  return {
    code: 200,
    msg: '分析完成',
    data: {
      id: `analysis_${Date.now()}`,
      userId: 'website_user',
      source: 'website',
      imageUrl,
      score: overallScore,
      grade,
      gradeText,
      gradeColor,
      overallComment,
      
      // 评分详情
      scores: {
        overall: overallScore,
        layout: Math.min(100, Math.max(0, layoutScore)),
        light: Math.min(100, Math.max(0, lightScore)),
        ventilation: Math.min(100, Math.max(0, ventilationScore)),
        tidy: Math.min(100, Math.max(0, tidyScore)),
        energy: Math.min(100, Math.max(0, energyScore))
      },
      
      // 问题诊断
      layoutIssues,
      
      // 优点缺点
      advantages,
      disadvantages,
      
      // 区域分析
      areaAnalysis,
      
      // 改进建议
      improvementSuggestions,
      
      // 标签
      positiveTags: advantages.slice(0, 3).map(a => a.title),
      negativeTags: disadvantages.slice(0, 3).map(d => d.title)
    }
  };
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ code: 400, msg: '请上传图片', data: null }, { status: 400 });
    }
    
    // 检查文件类型
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ code: 400, msg: '请上传图片文件', data: null }, { status: 400 });
    }
    
    // 生成预览 URL
    const imageUrl = URL.createObjectURL(file);
    
    // 生成详细分析结果
    const result = generateDetailedAnalysis(imageUrl);
    
    return NextResponse.json(result);
    
  } catch (error) {
    console.error('分析失败:', error);
    return NextResponse.json({ 
      code: 500, 
      msg: '分析失败，请重试', 
      data: null 
    }, { status: 500 });
  }
}
