'use client'

import React from 'react'
import { ChevronLeft, Home, Star } from 'lucide-react'

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
  ancientWisdom?: string[]
}

interface AnalysisReportProps {
  result: AnalysisResult
  imageUrl: string
  onReset: () => void
}

// 获取分数颜色
function getScoreColor(score: number): string {
  if (score >= 80) return 'text-green-600'
  if (score >= 60) return 'text-amber-600'
  return 'text-red-600'
}

function getScoreBgColor(score: number): string {
  if (score >= 80) return 'bg-green-100'
  if (score >= 60) return 'bg-amber-100'
  return 'bg-red-100'
}

function getScoreBarColor(score: number): string {
  if (score >= 80) return 'bg-green-500'
  if (score >= 60) return 'bg-amber-500'
  return 'bg-red-500'
}

function getGradeText(grade: string): string {
  const map: Record<string, string> = {
    'excellent': '卓越',
    'good': '良好',
    'moderate': '中等',
    'poor': '欠佳'
  }
  return map[grade] || grade
}

function getGradeEmoji(grade: string): string {
  const map: Record<string, string> = {
    'excellent': '🏆',
    'good': '✨',
    'moderate': '📊',
    'poor': '💡'
  }
  return map[grade] || '📋'
}

export default function AnalysisReport({ result, imageUrl, onReset }: AnalysisReportProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
      {/* 顶部导航 */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <button 
            onClick={onReset}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ChevronLeft size={20} />
            <span className="text-sm">返回首页</span>
          </button>
          <h1 className="text-base font-semibold text-gray-900">分析报告</h1>
          <div className="w-16"></div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* 报告标题 */}
        <div className="text-center py-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full text-sm font-medium mb-4">
            <Star size={16} />
            AI 智能分析报告
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">家居空间能量分析</h2>
          <p className="text-sm text-gray-500">基于古籍智慧与现代空间科学的综合评估</p>
        </div>

        {/* 用户上传的图片 */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="text-sm font-medium text-gray-700">您上传的图片</h3>
          </div>
          <div className="p-6">
            <img 
              src={imageUrl} 
              alt="用户上传" 
              className="w-full max-h-80 object-contain rounded-xl bg-gray-50"
            />
          </div>
        </div>

        {/* 总体评分 */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* 圆形分数 */}
            <div className="relative">
              <svg className="w-40 h-40 -rotate-90">
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  stroke="#e5e7eb"
                  strokeWidth="12"
                  fill="none"
                />
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  stroke={result.gradeColor}
                  strokeWidth="12"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={`${(result.score / 100) * 440} 440`}
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-bold text-gray-900">{result.score}</span>
                <span className="text-sm text-gray-500">综合评分</span>
              </div>
            </div>

            {/* 等级信息 */}
            <div className="flex-1 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-50 to-orange-50 rounded-full mb-4">
                <span className="text-2xl">{getGradeEmoji(result.grade)}</span>
                <span className="text-lg font-semibold text-amber-800">{getGradeText(result.grade)}</span>
                <span className="text-sm text-amber-600">({result.gradeText})</span>
              </div>
              <p className="text-gray-600 leading-relaxed">{result.overallComment}</p>
            </div>
          </div>
        </div>

        {/* 分项评分 */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-base font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <span className="w-1 h-5 bg-gradient-to-b from-amber-500 to-orange-500 rounded-full"></span>
            分项评分
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <ScoreItem label="整体布局" score={result.scores.overall} />
            <ScoreItem label="空间布局" score={result.scores.layout} />
            <ScoreItem label="采光通风" score={result.scores.light} />
            <ScoreItem label="通风情况" score={result.scores.ventilation} />
            <ScoreItem label="整洁程度" score={result.scores.tidy} />
            <ScoreItem label="能量气场" score={result.scores.energy} />
          </div>
        </div>

        {/* 优点 */}
        {result.advantages && result.advantages.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 text-sm">✓</span>
              </span>
              空间优点
            </h3>
            <div className="space-y-3">
              {result.advantages.map((item, index) => (
                <div key={index} className="flex items-start gap-3 p-4 bg-green-50/50 rounded-xl">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-xs font-bold flex-shrink-0">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 mb-1">{item.title}</p>
                    <p className="text-sm text-gray-600">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 问题 */}
        {result.disadvantages && result.disadvantages.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-red-600 text-sm">!</span>
              </span>
              潜在问题
            </h3>
            <div className="space-y-3">
              {result.disadvantages.map((item, index) => (
                <div key={index} className="flex items-start gap-3 p-4 bg-red-50/50 rounded-xl">
                  <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center text-red-600 text-xs font-bold flex-shrink-0">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 mb-1">{item.title}</p>
                    <p className="text-sm text-gray-600">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 区域分析 */}
        {result.areaAnalysis && result.areaAnalysis.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-1 h-5 bg-gradient-to-b from-amber-500 to-orange-500 rounded-full"></span>
              区域详细分析
            </h3>
            <div className="space-y-4">
              {result.areaAnalysis.map((area, index) => (
                <AreaCard key={index} area={area} />
              ))}
            </div>
          </div>
        )}

        {/* 改进建议 */}
        {result.improvementSuggestions && result.improvementSuggestions.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 text-sm">💡</span>
              </span>
              优化建议
            </h3>
            <div className="space-y-3">
              {result.improvementSuggestions.map((item, index) => (
                <div key={index} className="flex items-start gap-3 p-4 bg-blue-50/50 rounded-xl">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xs font-bold flex-shrink-0">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 mb-1">{item.title}</p>
                    <p className="text-sm text-gray-600">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 古籍智慧 */}
        {result.ancientWisdom && result.ancientWisdom.length > 0 && (
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-200 p-6">
            <h3 className="text-base font-semibold text-amber-900 mb-4 flex items-center gap-2">
              <span className="text-2xl">📜</span>
              古籍智慧
            </h3>
            <div className="space-y-4">
              {result.ancientWisdom.map((wisdom, index) => (
                <p key={index} className="text-sm text-amber-800 leading-relaxed italic">
                  「{wisdom}」
                </p>
              ))}
            </div>
          </div>
        )}

        {/* 返回按钮 */}
        <div className="py-8 text-center">
          <button
            onClick={onReset}
            className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Home size={18} />
            返回首页，再次分析
          </button>
        </div>
      </div>
    </div>
  )
}

// 分数项组件
function ScoreItem({ label, score }: { label: string; score: number }) {
  return (
    <div className="bg-gray-50 rounded-xl p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-600">{label}</span>
        <span className={`text-lg font-semibold ${getScoreColor(score)}`}>{score}</span>
      </div>
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className={`h-full rounded-full transition-all duration-1000 ease-out ${getScoreBarColor(score)}`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  )
}

// 区域分析卡片
function AreaCard({ area }: { area: AnalysisResult['areaAnalysis'][0] }) {
  const statusConfig = {
    good: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', icon: '✓' },
    moderate: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', icon: '~' },
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
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreBgColor(area.score)} ${getScoreColor(area.score)}`}>
          {area.score}分
        </div>
      </div>
      
      {area.findings.length > 0 && (
        <div className="mb-3">
          <span className="text-xs text-gray-500 uppercase tracking-wide">观察</span>
          <ul className="mt-1 space-y-1">
            {area.findings.map((finding, i) => (
              <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                <span className="text-green-500">•</span>
                {finding}
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {area.problems.length > 0 && (
        <div className="mb-3">
          <span className="text-xs text-red-400 uppercase tracking-wide">问题</span>
          <ul className="mt-1 space-y-1">
            {area.problems.map((problem, i) => (
              <li key={i} className="text-sm text-red-600 flex items-start gap-2">
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
              <li key={i} className="text-sm text-blue-600 flex items-start gap-2">
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
