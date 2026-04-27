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
  MapPin
} from 'lucide-react'

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
function AnalyzeModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
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
      
      const response = await fetch('/api/analyze/simple', {
        method: 'POST',
        body: formData,
      })
      
      const data = await response.json()
      
      if (data.code === 200) {
        alert(`分析完成！得分: ${data.data.score}分\n\n${data.data.summary || '请查看详细报告'}`)
        onClose()
      } else {
        setError(data.msg || '分析失败，请重试')
      }
    } catch (err) {
      setError('网络错误，请检查网络连接后重试')
    } finally {
      setIsAnalyzing(false)
    }
  }, [selectedFile, onClose])

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
            <div className="loading-hint">预计需要 10-30 秒</div>
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
                  支持 JPG、PNG 格式，文件小于 10MB
                </p>
              </div>
            )}
            
            <div className="modal-footer">
              <button 
                className="analyze-btn"
                onClick={handleAnalyze}
                disabled={!selectedFile}
              >
                开始分析
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
            专注东方居住美学的 AI 空间分析顾问。通过多模态大模型解读户型，为您提供科学、有据可循的改善建议。
          </p>
          
          <div className="hero-actions">
            <button 
              className="btn-primary"
              onClick={() => setShowAnalyzeModal(true)}
            >
              <Sparkles size={20} />
              立即体验
            </button>
            <a href="#features" className="btn-secondary">
              了解更多
            </a>
          </div>
        </div>
        
        <div className="hero-visual">
          <div className="hero-image">
            <div className="hero-image-header">
              <span></span>
              <span></span>
              <span></span>
            </div>
            <div className="hero-image-body">
              <ReportPreview />
            </div>
          </div>
        </div>
      </section>

      {/* 痛点解析 */}
      <section className="pain-points" id="pain-points">
        <div className="section-header">
          <div className="section-tag">痛点解析</div>
          <h2>买房租房，您是否也面临这些困扰？</h2>
          <p>传统方式缺乏客观参考，我们用 AI 技术帮您量化分析</p>
        </div>
        
        <div className="pain-cards">
          <div className="pain-card">
            <div className="pain-icon">
              <Home size={28} />
            </div>
            <h3>选房缺乏客观标准</h3>
            <p>面对多个备选房源，不知道如何对比评估。户型图看起来都差不多，难以判断优劣。</p>
          </div>
          
          <div className="pain-card">
            <div className="pain-icon">
              <Zap size={28} />
            </div>
            <h3>装修后才发现问题</h3>
            <p>入住后发现采光不足、动线混乱，此时改造成本高，只能将就居住多年。</p>
          </div>
          
          <div className="pain-card">
            <div className="pain-icon">
              <Shield size={28} />
            </div>
            <h3>缺乏专业可信的指导</h3>
            <p>网上信息良莠不齐，缺乏系统性、可量化的分析方法和专业参考。</p>
          </div>
        </div>
      </section>

      {/* 核心功能 */}
      <section className="features" id="features">
        <div className="section-header">
          <div className="section-tag">核心功能</div>
          <h2>AI 赋能的空间分析</h2>
          <p>上传户型图，AI 立即为您生成详细的空间能量分析报告</p>
        </div>
        
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-number">01</div>
            <h3>一键上传智能识别</h3>
            <p>支持多种图片格式上传，AI 自动识别户型结构、门窗位置等关键信息。</p>
            <span className="feature-tag">多格式兼容</span>
          </div>
          
          <div className="feature-card">
            <div className="feature-number">02</div>
            <h3>多维度量化评估</h3>
            <p>从门的位置、采光通风、动线设计等维度打分，用数据说话。</p>
            <span className="feature-tag">科学量化</span>
          </div>
          
          <div className="feature-card">
            <div className="feature-number">03</div>
            <h3>个性化改善建议</h3>
            <p>根据分析结果，提供针对性的改善建议和优化方案。</p>
            <span className="feature-tag">因地制宜</span>
          </div>
        </div>
      </section>

      {/* 理论基石 */}
      <section className="methodology" id="methodology">
        <div className="methodology-content">
          <div className="section-tag">理论基石</div>
          <h2>千年智慧 + 现代科技</h2>
          <div className="methodology-highlight">
            "形峦为骨，理气为魂"
          </div>
          <p>
            我们以传统空间智慧为理论基础，结合现代建筑学、心理学研究成果，<br/>
            构建了一套可量化、可复现的空间分析体系。
          </p>
          
          <div className="tech-stack">
            <div className="tech-badge">
              <Brain size={20} />
              多模态大模型
            </div>
            <div className="tech-badge">
              <BookOpen size={20} />
              传统空间智慧
            </div>
            <div className="tech-badge">
              <Layers size={20} />
              现代建筑学
            </div>
            <div className="tech-badge">
              <Sparkles size={20} />
              AI 智能分析
            </div>
          </div>
        </div>
      </section>

      {/* 报告预览 */}
      <section className="report-showcase">
        <div className="showcase-container">
          <div className="showcase-content">
            <h2>全方位空间分析报告</h2>
            <p>
              报告涵盖空间布局的多个核心维度，通过可视化图表展示分析结果，
              让您对居住环境有更清晰的认知。
            </p>
            <ul className="showcase-list">
              <li>
                <Check size={20} />
                <span>四象限分析：门外、室内、角落、整体</span>
              </li>
              <li>
                <Check size={20} />
                <span>多维度评分：门、采光、通风、动线、布局</span>
              </li>
              <li>
                <Check size={20} />
                <span>个性化改善建议与优先级排序</span>
              </li>
              <li>
                <Check size={20} />
                <span>历史记录追踪，持续优化居住体验</span>
              </li>
            </ul>
            <button 
              className="btn-primary"
              onClick={() => setShowAnalyzeModal(true)}
            >
              <FileText size={20} />
              免费体验
            </button>
          </div>
          
          <div className="showcase-visual">
            <div className="chart-container">
              <div className="section-header" style={{ marginBottom: '20px' }}>
                <h2 style={{ fontSize: '20px' }}>能量雷达图</h2>
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                <svg width="280" height="280" viewBox="0 0 280 280">
                  {/* 背景五边形 */}
                  <polygon points="140,30 243,98 209,226 71,226 37,98" fill="none" stroke="#E8E8E8" strokeWidth="1"/>
                  <polygon points="140,58 218,110 191,210 89,210 62,110" fill="none" stroke="#E8E8E8" strokeWidth="1"/>
                  <polygon points="140,86 193,122 173,194 107,194 87,122" fill="none" stroke="#E8E8E8" strokeWidth="1"/>
                  <polygon points="140,114 168,134 155,178 125,178 112,134" fill="none" stroke="#E8E8E8" strokeWidth="1"/>
                  {/* 中心点 */}
                  <circle cx="140" cy="140" r="3" fill="#E8E8E8"/>
                  
                  {/* 评分数据 */}
                  <polygon 
                    points="140,45 235,105 195,215 100,210 55,105" 
                    fill="rgba(196, 30, 58, 0.2)" 
                    stroke="#C41E3A" 
                    strokeWidth="2"
                  />
                  
                  {/* 标签 */}
                  <text x="140" y="20" textAnchor="middle" fontSize="12" fill="#666">门(90)</text>
                  <text x="255" y="105" textAnchor="start" fontSize="12" fill="#666">采(85)</text>
                  <text x="215" y="240" textAnchor="middle" fontSize="12" fill="#666">通(88)</text>
                  <text x="65" y="240" textAnchor="middle" fontSize="12" fill="#666">动(82)</text>
                  <text x="25" y="105" textAnchor="end" fontSize="12" fill="#666">布(87)</text>
                </svg>
              </div>
              <div className="chart-legend">
                <div className="legend-item">
                  <div className="legend-dot score"></div>
                  <span>您的评分</span>
                </div>
                <div className="legend-item">
                  <div className="legend-dot average"></div>
                  <span>平均水平</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 团队与品牌 */}
      <section className="team" id="team">
        <div className="team-content">
          <div className="team-quote">
            我们相信，好的居住环境不应该只属于少数人的特权。
            通过 AI 技术，我们希望让更多人能够科学地改善自己的居住空间，
            让每一个家都能成为真正的避风港。
          </div>
          
          <div className="team-founder">
            <div className="founder-avatar">创</div>
            <div className="founder-info">
              <div className="founder-name">宅有道团队</div>
              <div className="founder-title">专注东方居住美学</div>
            </div>
          </div>
          
          <div className="team-stats">
            <div className="stat-item">
              <div className="stat-value">50+</div>
              <div className="stat-label">经典文献深度解析</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">10+</div>
              <div className="stat-label">核心维度评估体系</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">1000+</div>
              <div className="stat-label">用户体验与反馈</div>
            </div>
          </div>
        </div>
      </section>

      {/* 底部 CTA */}
      <section className="footer-cta">
        <h2>开启您的空间优化之旅</h2>
        <p>扫码体验 AI 空间分析，让家更宜居</p>
        
        <div className="qr-section">
          <div style={{ textAlign: 'center' }}>
            <div className="qr-code">
              <div className="qr-placeholder">
                小程序码
              </div>
            </div>
            <div className="qr-label">微信小程序</div>
          </div>
          
          <div className="contact-info">
            <div className="contact-item">
              <Mail size={18} />
              <span>contact@zhaiyoudao.com</span>
            </div>
            <div className="contact-item">
              <MapPin size={18} />
              <span>专注东方居住美学</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <p>© 2024 宅有道 AI FENG SHUI. All rights reserved.</p>
      </footer>

      {/* 图片分析模态框 */}
      <AnalyzeModal 
        isOpen={showAnalyzeModal} 
        onClose={() => setShowAnalyzeModal(false)} 
      />
    </>
  )
}
