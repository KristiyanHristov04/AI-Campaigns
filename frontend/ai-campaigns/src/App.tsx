import { useState } from 'react'
import './App.css'

type Language = 0 | 1
type ImageType = 0 | 1
type AspectRatio = 0 | 1 | 2 | 3

interface CampaignResult {
  description: string
  image: string
}

function App() {
  const [url, setUrl] = useState('')
  const [language, setLanguage] = useState<Language>(0)
  const [imageType, setImageType] = useState<ImageType>(0)
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>(0)
  const [referenceImages, setReferenceImages] = useState<File[]>([])
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<CampaignResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [descExpanded, setDescExpanded] = useState(false)

  const handleGenerate = async () => {
    if (!url.trim()) return
    setLoading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('url', url.trim())
      formData.append('countryAdLanguage', String(language))
      formData.append('imageType', String(imageType))
      formData.append('imageAspectRatio', String(aspectRatio))
      referenceImages.forEach(file => formData.append('referenceImages', file))

      const response = await fetch(
        'https://localhost:7048/api/Gemini/generate-campaign',
        { method: 'POST', body: formData }
      )
      if (!response.ok) throw new Error(`Request failed: ${response.status}`)
      const data: CampaignResult = await response.json()
      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = () => {
    if (!result) return
    const link = document.createElement('a')
    link.href = `${result.image}`
    link.download = 'campaign.png'
    link.click()
  }

  const handleReset = () => {
    setResult(null)
    setError(null)
    setUrl('')
    setDescExpanded(false)
    setReferenceImages([])
  }

  const handleImageFiles = (files: FileList | null) => {
    if (!files) return
    const images = Array.from(files).filter(f => f.type.startsWith('image/'))
    setReferenceImages(prev => [...prev, ...images])
  }

  const removeReferenceImage = (index: number) => {
    setReferenceImages(prev => prev.filter((_, i) => i !== index))
  }

  return (
    <div className="app">
      <div className="bg-orbs">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
      </div>

      <div className="content">
        {!result ? (
          <div className="input-stage">
            <div className="brand">
              <div className="brand-icon">✦</div>
              <h1>AI Campaigns</h1>
              <p className="subtitle">Paste a URL and let AI craft your campaign</p>
            </div>

            <div className="card input-card">
              <div className="input-group">
                <label htmlFor="url-input">Website URL</label>
                <div className="input-wrapper">
                  <span className="input-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="2" y1="12" x2="22" y2="12" />
                      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                    </svg>
                  </span>
                  <input
                    id="url-input"
                    type="url"
                    value={url}
                    onChange={e => setUrl(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleGenerate()}
                    placeholder="https://example.com"
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="language-group">
                <label>Language</label>
                <div className="toggle-pills">
                  <button
                    className={`pill ${language === 0 ? 'active' : ''}`}
                    onClick={() => setLanguage(0)}
                    disabled={loading}
                  >
                    🇬🇧 English
                  </button>
                  <button
                    className={`pill ${language === 1 ? 'active' : ''}`}
                    onClick={() => setLanguage(1)}
                    disabled={loading}
                  >
                    🇧🇬 Bulgarian
                  </button>
                </div>
              </div>

              <div className="language-group">
                <label>Aspect Ratio</label>
                <div className="toggle-pills ratio-pills">
                  {([
                    [0, '1:1'],
                    [1, '4:5'],
                    [2, '9:16'],
                    [3, '16:9'],
                  ] as const).map(([val, ratio]) => (
                    <button
                      key={val}
                      className={`pill ratio-pill ${aspectRatio === val ? 'active' : ''}`}
                      onClick={() => setAspectRatio(val)}
                      disabled={loading}
                    >
                      {ratio}
                    </button>
                  ))}
                </div>
              </div>

              <div className="checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={imageType === 1}
                    onChange={e => setImageType(e.target.checked ? 1 : 0)}
                    disabled={loading}
                  />
                  <span>Hyperrealistic image</span>
                </label>
              </div>

              <div className="reference-group">
                <label>Reference Images <span className="optional-tag">optional</span></label>
                <div
                  className="drop-zone"
                  onDragOver={e => e.preventDefault()}
                  onDrop={e => { e.preventDefault(); handleImageFiles(e.dataTransfer.files) }}
                  onClick={() => document.getElementById('ref-images-input')?.click()}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                  <span>Click or drag images here</span>
                  <input
                    id="ref-images-input"
                    type="file"
                    accept="image/*"
                    multiple
                    disabled={loading}
                    onChange={e => handleImageFiles(e.target.files)}
                    style={{ display: 'none' }}
                  />
                </div>
                {referenceImages.length > 0 && (
                  <div className="ref-thumbs">
                    {referenceImages.map((file, i) => (
                      <div key={i} className="ref-thumb">
                        <img src={URL.createObjectURL(file)} alt={file.name} />
                        <button
                          className="ref-thumb-remove"
                          onClick={() => removeReferenceImage(i)}
                          disabled={loading}
                          type="button"
                        >
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {error && (
                <div className="error-banner">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  {error}
                </div>
              )}

              <button
                className="generate-btn"
                onClick={handleGenerate}
                disabled={loading || !url.trim()}
              >
                {loading ? (
                  <>
                    <span className="spinner" />
                    Generating campaign…
                  </>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                    </svg>
                    Generate Campaign
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="result-stage">
            <div className="result-header">
              <div className="brand-small">✦ AI Campaigns</div>
              <button className="reset-btn" onClick={handleReset}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="1 4 1 10 7 10" />
                  <path d="M3.51 15a9 9 0 1 0 .49-3.52" />
                </svg>
                New campaign
              </button>
            </div>

            <div className="result-content">
              <div className="image-card">
                <img
                  src={`${result.image}`}
                  alt="Generated campaign"
                  className="campaign-image"
                />
                <div className="image-overlay">
                  <button className="download-btn" onClick={handleDownload}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                    Download Image
                  </button>
                </div>
              </div>

              <div
                className={`description-card ${descExpanded ? 'expanded' : ''}`}
                onClick={() => setDescExpanded(prev => !prev)}
              >
                <div className="description-label">
                  Campaign Description
                  <span className="desc-chevron">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ transform: descExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease' }}>
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </span>
                </div>
                <p className="description-text">{result.description}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
