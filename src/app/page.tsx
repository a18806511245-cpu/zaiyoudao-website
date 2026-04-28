'use client'

import { useState, useCallback, useRef } from 'react'
import { Star, BookOpen, Sparkles, Zap, Home, Shield, Brain, TrendingUp, Check, X, Upload, ChevronLeft, FileText } from 'lucide-react'
import AnalysisReport from '@/components/AnalysisReport'

// Logo 组件
function Logo() {
  return (
    <div className="logo">
      <div className="logo-icon">
        <svg viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="6" y="18" width="30" height="20" rx="2" stroke="#1A1A1A" strokeWidth="2"/>
          <path d="M21 6 L36 18 L6 18 Z" stroke="#C41E3A" strokeWidth="2" fill="none"/>
          <circle cx="21" cy="28" r="6" stroke="#D4AF37" strokeWidth="1.5"/>
          <path d="M21 22 L21 34 M15 28 L27 28" stroke="#D4AF37" strokeWidth="1.5"/>
        </svg>
      </div>
      <div className="logo-text">
        <span className="cn">宅有道</span>
        <span className="en">AI FENG SHUI</span>
      </div>
    </div>
  )
}

// 报告预览组件
function ReportPreview() {
  return (
    <div>
      <div className="report-header">
        <h3>空间能量报告</h3>
        <div className="report-score">87分</div>
      </div>
      <div className="report-content">
        <div className="report-item">
          <span className="report-item-label">门的位置</span>
          <span className="report-item-value good">良好</span>
        </div>
        <div className="report-item">
          <span className="report-item-label">采光通风</span>
          <span className="report-item-value good">优秀</span>
        </div>
        <div className="report-item">
          <span className="report-item-label">动线设计</span>
          <span className="report-item-value warning">待优化</span>
        </div>
        <div className="report-item">
          <span className="report-item-label">空间布局</span>
          <span className="report-item-value good">良好</span>
        </div>
      </div>
    </div>
  )
}

// 图片分析模态框
function AnalyzeModal({ isOpen, onClose, onAnalysisComplete }: { 
  isOpen: boolean; 
  onClose: () => void;
  onAnalysisComplete: (result: any, imageUrl: string) => void;
}) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('请选择图片文件')
        return
      }
      if (file.size > 10 * 1024 * 1024) {
        setError('图片大小不能超过 10MB')
        return
      }
      setSelectedFile(file)
      setPreviewUrl(URL.createObjectURL(file))
      setError('')
    }
  }, [])

  const handleAnalyze = useCallback(async () => {
    if (!selectedFile) return
    
    setIsAnalyzing(true)
    setError('')
    
    try {
      const formData = new FormData()
      formData.append('file', selectedFile)
      
      const response = await fetch('/api/analyze/detailed', {
        method: 'POST',
        body: formData,
      })
      
      const data = await response.json()
      
      if (data.code === 200) {
        onAnalysisComplete(data.data, previewUrl)
        onClose()
      } else {
        setError(data.msg || '分析失败，请重试')
      }
    } catch (err) {
      setError('网络错误，请检查网络连接后重试')
    } finally {
      setIsAnalyzing(false)
    }
  }, [selectedFile, onClose, onAnalysisComplete, previewUrl])

  const handleRemove = useCallback(() => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
    }
    setSelectedFile(null)
    setPreviewUrl('')
    setError('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }, [previewUrl])

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>上传图片分析</h3>
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        
        {isAnalyzing ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <div className="loading-text">正在分析中...</div>
            <div className="loading-hint">预计需要 20-60 秒</div>
            <div className="loading-sub-hint">AI 正在识别户型、分析布局、评估能量...</div>
          </div>
        ) : (
          <>
            {error && (
              <div className="mx-6 my-4 p-3 bg-red-50 rounded-lg text-sm text-red-600">
                {error}
              </div>
            )}
            
            <div className="modal-body">
              {previewUrl ? (
                <div className="preview-container mb-6">
                  <img src={previewUrl} alt="预览" className="preview-image" />
                  <button className="remove-btn" onClick={handleRemove}>
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div 
                  className="upload-area"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <div className="upload-icon">
                    <Upload size={28} />
                  </div>
                  <p className="text-base font-medium text-ink-black mb-2">点击上传图片</p>
                  <p className="text-sm text-text-gray">支持 JPG、PNG 户型图或室内照片，文件小于 10MB</p>
                </div>
              )}
            </div>
            
            <div className="modal-footer">
              <button 
                className="analyze-btn"
                onClick={handleAnalyze}
                disabled={!selectedFile}
              >
                开始详细分析
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default function HomePage() {
  const [showAnalyzeModal, setShowAnalyzeModal] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<any>(null)
  const [resultImageUrl, setResultImageUrl] = useState<string>('')

  const handleAnalysisComplete = useCallback((result: any, imageUrl: string) => {
    setAnalysisResult(result)
    setResultImageUrl(imageUrl)
    setShowAnalyzeModal(false)
  }, [])

  const handleReset = useCallback(() => {
    setAnalysisResult(null)
    setResultImageUrl('')
  }, [])

  // 显示分析报告
  if (analysisResult && resultImageUrl) {
    return (
      <AnalysisReport 
        result={analysisResult} 
        imageUrl={resultImageUrl}
        onReset={handleReset}
      />
    )
  }

  return (
    <>
      {/* 导航栏 */}
      <nav className="navbar">
        <Logo />
        <div className="nav-menu">
          <a href="#">首页</a>
          <a href="#pain-points">痛点解析</a>
          <a href="#features">产品功能</a>
          <a href="#methodology">理论基石</a>
          <a href="#team">关于我们</a>
          <a 
            href="#"
            className="nav-cta"
            onClick={(e) => { e.preventDefault(); setShowAnalyzeModal(true); }}
          >
            立即体验
          </a>
        </div>
      </nav>

      {/* Hero 首屏 */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-badge">
            <Star size={16} />
            AI 驱动的空间分析顾问
          </div>
          
          <h1>
            让居住回归居住<br/>
            <span>让心安处即是家</span>
          </h1>
          
          <p className="hero-subtitle">
            融合千年东方智慧与现代空间科学<br/>
            深度解析家居能量，量身定制优化方案
          </p>
          
          <div className="hero-actions">
            <button 
              className="hero-cta primary"
              onClick={() => setShowAnalyzeModal(true)}
            >
              <Sparkles size={20} />
              立即体验
            </button>
            <button className="hero-cta secondary">
              <BookOpen size={20} />
              了解更多
            </button>
          </div>
          
          <div className="hero-stats">
            <div className="stat">
              <span className="stat-value">10,000+</span>
              <span className="stat-label">用户信赖之选</span>
            </div>
            <div className="stat">
              <span className="stat-value">98.6%</span>
              <span className="stat-label">分析准确率</span>
            </div>
            <div className="stat">
              <span className="stat-value">15min</span>
              <span className="stat-label">快速出具报告</span>
            </div>
          </div>
        </div>
        
        <div className="hero-visual">
          <div className="hero-report">
            <ReportPreview />
          </div>
        </div>
      </section>

      {/* 痛点解析 */}
      <section id="pain-points" className="section pain-points">
        <div className="section-header">
          <div className="section-tag">
            <Zap size={16} />
            痛点解析
          </div>
          <h2>您的家是否面临这些问题？</h2>
          <p>传统装修缺乏整体规划，入住后才发现问题重重</p>
        </div>
        
        <div className="pain-cards">
          <div className="pain-card">
            <div className="pain-icon">💰</div>
            <h3>花费巨大，居住体验不佳</h3>
            <p>投入数十万装修，却总觉得哪里不对劲，说不清道不明的压抑感挥之不去</p>
          </div>
          <div className="pain-card">
            <div className="pain-icon">😔</div>
            <h3>家人健康问题频发</h3>
            <p>身体莫名不适，检查无果。换个房间睡眠改善，问题根源却在空间能量</p>
          </div>
          <div className="pain-card">
            <div className="pain-icon">📉</div>
            <h3>事业财运持续低迷</h3>
            <p>努力付出却收获甚微，机会总是擦肩而过。财富能量需要空间布局引导</p>
          </div>
          <div className="pain-card">
            <div className="pain-icon">😴</div>
            <h3>睡眠质量难以改善</h3>
            <p>失眠多梦、辗转难眠，除了心理因素，卧室方位与床头朝向也有影响</p>
          </div>
          <div className="pain-card">
            <div className="pain-icon">👥</div>
            <h3>家庭关系时有紧张</h3>
            <p>沟通不畅、矛盾频发，空间气场与家人情绪相互影响</p>
          </div>
          <div className="pain-card">
            <div className="pain-icon">🎯</div>
            <h3>难以找到靠谱指导</h3>
            <p>网上信息良莠不齐，缺乏专业人士指导，无法判断哪些建议可信</p>
          </div>
        </div>
      </section>

      {/* 产品功能 */}
      <section id="features" className="section features">
        <div className="section-header">
          <div className="section-tag">
            <Home size={16} />
            产品功能
          </div>
          <h2>智能分析，科学解读</h2>
          <p>基于 AI 技术与传统智慧的完美融合</p>
        </div>
        
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <Brain size={24} />
            </div>
            <h3>AI 户型分析</h3>
            <p>上传户型图，AI 智能识别空间结构，精准分析各功能区优劣</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <Shield size={24} />
            </div>
            <h3>古籍智慧解读</h3>
            <p>融合《宅经》《青囊经》等十余部经典，传承千年文化精髓</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <TrendingUp size={24} />
            </div>
            <h3>个性化建议</h3>
            <p>针对您的具体情况，提供切实可行的空间优化方案</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <Check size={24} />
            </div>
            <h3>持续追踪优化</h3>
            <p>记录分析历史，持续跟踪空间变化，见证改善效果</p>
          </div>
        </div>
      </section>

      {/* 理论基石 */}
      <section id="methodology" className="section methodology">
        <div className="section-header">
          <div className="section-tag">
            <BookOpen size={16} />
            理论基石
          </div>
          <h2>千年智慧，经典传承</h2>
          <p>精选古籍理论支撑，科学解读传统智慧</p>
        </div>
        
        <div className="methodology-grid">
          <div className="method-card">
            <h3>《宅经》</h3>
            <p>最古老的住宅风水专著，系统阐述阴阳、五行与住宅的关系</p>
          </div>
          <div className="method-card">
            <h3>《青囊经》</h3>
            <p>风水理论核心经典，提出"得水为上，藏风次之"的核心原则</p>
          </div>
          <div className="method-card">
            <h3>《博山篇》</h3>
            <p>明代风水权威之作，详细论述龙脉、穴位的识别与选择</p>
          </div>
          <div className="method-card">
            <h3>《撼龙经》</h3>
            <p>杨筠松所著，专门讲述山脉走势与风水格局的关系</p>
          </div>
          <div className="method-card">
            <h3>《发微论》</h3>
            <p>阐述气在空间中的流动规律与聚散原理</p>
          </div>
          <div className="method-card">
            <h3>《雪心赋》</h3>
            <p>清代经典，融合形法与理气，强调因地制宜</p>
          </div>
        </div>
      </section>

      {/* 关于我们 */}
      <section id="team" className="section team">
        <div className="section-header">
          <div className="section-tag">
            <FileText size={16} />
            关于我们
          </div>
          <h2>专业团队，匠心服务</h2>
        </div>
        
        <div className="team-content">
          <p>
            我们是一支由传统文化研究者、空间规划师与 AI 工程师组成的跨界团队。
            致力于将千年智慧与现代科技相结合，为现代家庭提供科学、实用的空间优化建议。
          </p>
          <div className="team-tags">
            <span className="team-tag">传统文化</span>
            <span className="team-tag">空间科学</span>
            <span className="team-tag">人工智能</span>
            <span className="team-tag">用户体验</span>
          </div>
        </div>
      </section>

      {/* 底部 */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-logo">
            <Logo />
          </div>
          <div className="footer-info">
            <a href="#">使用条款</a>
            <a href="#">隐私政策</a>
            <a href="#">联系我们</a>
          </div>
        </div>
        <div className="footer-copyright">
          © 2024 宅有道 AI. 保留所有权利.
        </div>
      </footer>

      {/* 分析模态框 */}
      <AnalyzeModal 
        isOpen={showAnalyzeModal}
        onClose={() => setShowAnalyzeModal(false)}
        onAnalysisComplete={handleAnalysisComplete}
      />
    </>
  )
}
