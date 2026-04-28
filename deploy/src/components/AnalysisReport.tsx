'use client'

import React from 'react'

interface AnalysisResult {
  id: string
  userId: string
  source: string
  imageUrl: string
  score: number
  grade: string
  gradeText: string
  gradeColor: string
  overallComment: string
  scores: {
    overall: number
    layout: number
    light: number
    ventilation: number
    tidy: number
    energy: number
  }
  layoutIssues: string[]
  advantages: { title: string; desc: string }[]
  disadvantages: { title: string; desc: string }[]
  areaAnalysis: {
    area: string
    icon: string
    status: string
    score: number
    findings: string[]
    problems: string[]
    suggestions: string[]
  }[]
  improvementSuggestions: {
    priority: string
    title: string
    desc: string
  }[]
  positiveTags: string[]
  negativeTags: string[]
}

interface AnalysisReportProps {
  result: AnalysisResult
  imageUrl: string
  onReset: () => void
}

// 圆形进度条组件
const CircleProgress = ({ score, size = 120, strokeWidth = 10, color = '#22c55e' }: {
  score: number
  size?: number
  strokeWidth?: number
  color?: string
}) => {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const progress = circumference - (score / 100) * circumference

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={progress}
          style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold text-gray-800">{score}</span>
        <span className="text-xs text-gray-500">分</span>
      </div>
    </div>
  )
}

// 分数条组件
const ScoreBar = ({ label, score, color = '#3b82f6' }: { label: string; score: number; color?: string }) => (
  <div className="flex items-center gap-3">
    <span className="w-20 text-sm text-gray-600">{label}</span>
    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-1000 ease-out"
        style={{ width: `${score}%`, backgroundColor: color }}
      />
    </div>
    <span className="w-10 text-sm font-medium text-gray-700 text-right">{score}</span>
  </div>
)

// 区域分析卡片
const AreaCard = ({ area }: { area: AnalysisResult['areaAnalysis'][0] }) => {
  const statusConfig = {
    good: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', icon: '✓' },
    moderate: { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-700', icon: '~' },
    poor: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', icon: '!' }
  }
  const config = statusConfig[area.status as keyof typeof statusConfig] || statusConfig.moderate

  return (
    <div className={`${config.bg} border ${config.border} rounded-xl p-4`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">{area.icon}</span>
          <span className="font-semibold text-gray-800">{area.area}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`${config.text} text-sm font-medium`}>得分 {area.score}</span>
        </div>
      </div>
      
      {area.findings.length > 0 && (
        <div className="mb-2">
          <span className="text-xs text-gray-500 uppercase tracking-wide">观察</span>
          <ul className="mt-1 space-y-1">
            {area.findings.map((finding, i) => (
              <li key={i} className="text-sm text-gray-600 flex items-start gap-1">
                <span className="text-green-500">•</span>
                {finding}
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {area.problems.length > 0 && (
        <div className="mb-2">
          <span className="text-xs text-red-400 uppercase tracking-wide">问题</span>
          <ul className="mt-1 space-y-1">
            {area.problems.map((problem, i) => (
              <li key={i} className="text-sm text-red-600 flex items-start gap-1">
                <span className="text-red-400">!</span>
                {problem}
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {area.suggestions.length > 0 && (
        <div>
          <span className="text-xs text-blue-400 uppercase tracking-wide">建议</span>
          <ul className="mt-1 space-y-1">
            {area.suggestions.map((suggestion, i) => (
              <li key={i} className="text-sm text-blue-600 flex items-start gap-1">
                <span className="text-blue-400">→</span>
                {suggestion}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default function AnalysisReport({ result, imageUrl, onReset }: AnalysisReportProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      {/* 头部报告标题 */}
      <div className="bg-gradient-to-r from-amber-600 to-amber-700 text-white p-6 rounded-b-3xl shadow-lg">
        <div className="text-center">
          <h2 className="text-xl font-medium mb-2">家居能量分析报告</h2>
          <p className="text-amber-100 text-sm">专业的空间能量评估与优化建议</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* 总体评分 */}
        <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
          <CircleProgress score={result.score} size={140} strokeWidth={12} color={result.gradeColor} />
          <div className="mt-4">
            <span 
              className="inline-block px-4 py-1 rounded-full text-white text-lg font-bold"
              style={{ backgroundColor: result.gradeColor }}
            >
              {result.grade}级 {result.gradeText}
            </span>
          </div>
          <p className="mt-4 text-gray-600 text-sm leading-relaxed">{result.overallComment}</p>
        </div>

        {/* 上传的图片 */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <img 
            src={imageUrl} 
            alt="分析图片" 
            className="w-full h-64 object-cover"
          />
        </div>

        {/* 各项评分 */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <span className="text-xl">📊</span> 详细评分
          </h3>
          <div className="space-y-4">
            <ScoreBar label="空间布局" score={result.scores.layout} color="#8b5cf6" />
            <ScoreBar label="采光分析" score={result.scores.light} color="#f59e0b" />
            <ScoreBar label="通风状况" score={result.scores.ventilation} color="#06b6d4" />
            <ScoreBar label="整洁程度" score={result.scores.tidy} color="#10b981" />
            <ScoreBar label="能量状态" score={result.scores.energy} color="#ec4899" />
          </div>
        </div>

        {/* 优点 */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <span className="text-xl">✨</span> 优点分析
          </h3>
          <div className="space-y-3">
            {result.advantages.map((adv, i) => (
              <div key={i} className="flex items-start gap-3 p-3 bg-green-50 rounded-xl">
                <span className="text-green-500 text-lg">✓</span>
                <div>
                  <span className="font-medium text-green-800">{adv.title}</span>
                  <p className="text-sm text-green-600 mt-1">{adv.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 缺点 */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <span className="text-xl">📝</span> 不足之处
          </h3>
          <div className="space-y-3">
            {result.disadvantages.map((dis, i) => (
              <div key={i} className="flex items-start gap-3 p-3 bg-amber-50 rounded-xl">
                <span className="text-amber-500 text-lg">!</span>
                <div>
                  <span className="font-medium text-amber-800">{dis.title}</span>
                  <p className="text-sm text-amber-600 mt-1">{dis.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 区域分析 */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <span className="text-xl">🏠</span> 区域分析
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {result.areaAnalysis.map((area, i) => (
              <AreaCard key={i} area={area} />
            ))}
          </div>
        </div>

        {/* 改进建议 */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <span className="text-xl">💡</span> 改进建议
          </h3>
          <div className="space-y-3">
            {result.improvementSuggestions.map((suggestion, i) => (
              <div 
                key={i} 
                className={`flex items-start gap-3 p-3 rounded-xl ${
                  suggestion.priority === '高' ? 'bg-red-50' : 
                  suggestion.priority === '中' ? 'bg-yellow-50' : 'bg-blue-50'
                }`}
              >
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                  suggestion.priority === '高' ? 'bg-red-500 text-white' : 
                  suggestion.priority === '中' ? 'bg-yellow-500 text-white' : 'bg-blue-500 text-white'
                }`}>
                  {suggestion.priority}
                </span>
                <div>
                  <span className="font-medium text-gray-800">{suggestion.title}</span>
                  <p className="text-sm text-gray-600 mt-1">{suggestion.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 问题诊断 */}
        {result.layoutIssues.length > 0 && result.layoutIssues[0] !== '整体布局良好，无明显问题' && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <span className="text-xl">⚠️</span> 问题诊断
            </h3>
            <ul className="space-y-2">
              {result.layoutIssues.map((issue, i) => (
                <li key={i} className="flex items-center gap-2 text-gray-700">
                  <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                  {issue}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* 标签 */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex flex-wrap gap-2 justify-center">
            {result.positiveTags.map((tag, i) => (
              <span key={i} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                #{tag}
              </span>
            ))}
            {result.negativeTags.map((tag, i) => (
              <span key={i} className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm">
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* 重新分析按钮 */}
        <div className="text-center pb-8">
          <button
            onClick={onReset}
            className="px-8 py-3 bg-amber-600 text-white rounded-full font-medium shadow-lg hover:bg-amber-700 transition-colors"
          >
            重新分析
          </button>
        </div>

        {/* 底部信息 */}
        <div className="text-center text-xs text-gray-400 pb-8">
          <p>本报告由 AI 分析生成，仅供参考</p>
          <p className="mt-1">宅有道 · 家居能量分析</p>
        </div>
      </div>
    </div>
  )
}
