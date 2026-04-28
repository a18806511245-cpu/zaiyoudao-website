'use client'

import { useState, useCallback, useRef } from 'react'
import {
  Home,
  Zap,
  Shield,
  TrendingUp,
  Check,
  X,
  Upload,
  Star,
  BookOpen,
  Brain,
  Sparkles,
  Layers,
  FileText,
  Mail,
  MapPin,
  ChevronLeft
} from 'lucide-react'
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
    <div className="report-preview">
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
              <div style={{ margin: '0 24px 16px', padding: '12px', background: '#FEE', borderRadius: '8px', color: '#C41E3A', fontSize: '14px' }}>
                {error}
              </div>
            )}
            
            {previewUrl ? (
              <div className="preview-container">
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
                  style={{ display: 'none' }}
                />
                <div className="upload-icon">
                  <Upload size={28} color="white" />
                </div>
                <p style={{ fontSize: '16px', fontWeight: 500, color: 'var(--ink-black)', marginBottom: '8px' }}>
                  点击上传图片
                </p>
                <p style={{ fontSize: '14px', color: 'var(--text-gray)' }}>
                  支持 JPG、PNG 户型图或室内照片，文件小于 10MB
                </p>
              </div>
            )}
            
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
      <section id="pain-points" className="section">
        <div className="section-header">
          <div className="section-tag">
            <Zap size={16} />
            痛点解析
          </div>
          <h2>您的家是否面临这些问题？</h2>
          <p>传统装修缺乏整体规划，入住后才发现问题重重</p>
        </div>
        
        <div className="pain-points-grid">
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
            <div className="pain-icon">💔</div>
            <h3>家庭关系日渐紧张</h3>
            <p>夫妻争执增加，孩子叛逆不爱回家。空间气场影响家庭成员情绪状态</p>
          </div>
          <div className="pain-card">
            <div className="pain-icon">😴</div>
            <h3>睡眠质量持续下降</h3>
            <p>躺在床上辗转反侧难以入眠，卧室的能量布局可能正在消耗你的精气神</p>
          </div>
          <div className="pain-card">
            <div className="pain-icon">🎯</div>
            <h3>想要改变却无从下手</h3>
            <p>网上信息繁杂难辨真伪，缺乏专业人士指导，优化方案无从实施</p>
          </div>
        </div>
      </section>

      {/* 产品功能 */}
      <section id="features" className="section alt">
        <div className="section-header">
          <div className="section-tag">
            <Brain size={16} />
            产品功能
          </div>
          <h2>AI 智能分析，让改变有据可依</h2>
          <p>基于海量案例训练的专业模型，精准识别空间问题</p>
        </div>
        
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <Layers size={32} />
            </div>
            <h3>智能户型识别</h3>
            <p>AI 自动识别户型结构、门窗位置、家具布局，精准定位问题区域</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <TrendingUp size={32} />
            </div>
            <h3>能量场分析</h3>
            <p>基于传统智慧与现代空间科学的能量流动模型，评估各区域能量状态</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <Shield size={32} />
            </div>
            <h3>问题诊断</h3>
            <p>深度解读空间布局隐患，量化呈现问题严重程度及对生活的影响</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <Sparkles size={32} />
            </div>
            <h3>优化方案</h3>
            <p>因地制宜的调整建议，从简单摆放到布局改造循序渐进的解决方案</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <FileText size={32} />
            </div>
            <h3>完整报告</h3>
            <p>可视化评分系统、专业分析报告、逐项优化建议，一键生成分析文档</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <Home size={32} />
            </div>
            <h3>案例参考</h3>
            <p>海量真实案例库，相似户型参考借鉴，避免重复踩坑</p>
          </div>
        </div>
      </section>

      {/* 理论基石 */}
      <section id="methodology" className="section">
        <div className="section-header">
          <div className="section-tag">
            <BookOpen size={16} />
            理论基石
          </div>
          <h2>传承千年的空间智慧</h2>
          <p>精选 18 部经典典籍，构建专业知识体系</p>
        </div>
        
        <div className="methodology-content">
          <div className="methodology-text">
            <h3>经典典籍体系</h3>
            <p>整合《青囊经》《葬经》《撼龙经》《雪心赋》《发微论》等18部传统经典，提取核心空间能量理论，结合现代建筑学、人体工程学、环境心理学，形成系统化的分析框架。</p>
            
            <h3>AI 技术赋能</h3>
            <p>基于深度学习模型对海量户型案例进行学习训练，结合专家标注数据，不断优化分析准确率。让传统智慧在数字时代焕发新生。</p>
            
            <h3>科学评估体系</h3>
            <p>建立涵盖空间布局、采光通风、动线设计、色彩能量等维度的量化评估模型，让分析结果客观可衡量。</p>
          </div>
          
          <div className="books-grid">
            <div className="book-tag">青囊经</div>
            <div className="book-tag">葬经</div>
            <div className="book-tag">撼龙经</div>
            <div className="book-tag">雪心赋</div>
            <div className="book-tag">发微论</div>
            <div className="book-tag">博山篇</div>
            <div className="book-tag">催官篇</div>
            <div className="book-tag">地理正宗</div>
            <div className="book-tag">金锁玉关</div>
            <div className="book-tag">玉尺经</div>
            <div className="book-tag">住宅风水图解</div>
            <div className="book-tag">更多...</div>
          </div>
        </div>
      </section>

      {/* 关于我们 */}
      <section id="team" className="section alt">
        <div className="section-header">
          <div className="section-tag">
            <Home size={16} />
            关于我们
          </div>
          <h2>专注、专业、专心</h2>
          <p>致力于用科技传承智慧，让每个家庭都能受益于空间能量</p>
        </div>
        
        <div className="team-content">
          <div className="team-card">
            <div className="team-avatar">AI</div>
            <h3>智能分析系统</h3>
            <p>融合传统智慧与现代 AI 技术，精准识别空间问题</p>
          </div>
          <div className="team-card">
            <div className="team-avatar">📚</div>
            <h3>专业知识库</h3>
            <p>18 部经典典籍系统化整理，深度学习训练优化</p>
          </div>
          <div className="team-card">
            <div className="team-avatar">🔬</div>
            <h3>科学方法论</h3>
            <p>量化评估模型，客观分析有据可依</p>
          </div>
        </div>
        
        <div className="contact-section">
          <h3>联系我们</h3>
          <p>有任何问题或建议，欢迎随时联系</p>
          <div className="contact-info">
            <div className="contact-item">
              <Mail size={18} />
              <span>contact@zaiyoudao.com</span>
            </div>
            <div className="contact-item">
              <MapPin size={18} />
              <span>线上服务，全国可用</span>
            </div>
          </div>
        </div>
      </section>

      {/* 底部 */}
      <footer className="footer">
        <div className="footer-content">
          <Logo />
          <p className="footer-desc">
            传承千年智慧，用科技连接美好生活<br/>
            让每个家都成为安心之所
          </p>
          <div className="footer-links">
            <a href="#">隐私政策</a>
            <a href="#">用户协议</a>
            <a href="#">关于我们</a>
          </div>
          <p className="footer-copy">© 2025 宅有道. All rights reserved.</p>
        </div>
      </footer>

      {/* 分析弹窗 */}
      <AnalyzeModal 
        isOpen={showAnalyzeModal}
        onClose={() => setShowAnalyzeModal(false)}
        onAnalysisComplete={handleAnalysisComplete}
      />
    </>
  )
}
