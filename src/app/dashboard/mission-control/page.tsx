'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Activity,
  Shield,
  Zap,
  TrendingUp,
  CheckCircle,
  AlertTriangle,
  AlertCircle,
  Play,
  Pause,
  RefreshCw,
  Cpu,
  Globe,
  Lock,
  Users,
  Code,
  Eye,
  Settings,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Database,
  FileText,
  Palette,
  Mail,
  Copy,
  Download,
  Upload,
  Search,
  BarChart3,
  Target,
  Lightbulb,
  Rocket,
  ChevronRight,
  X,
} from 'lucide-react'
import { Textarea } from '../../../components/ui/textarea'
import { Button } from '../../../components/ui/button'

// Mock data for AI Mission Control
const mockAIHealthScore = {
  overall: 94,
  security: 98,
  performance: 92,
  seo: 89,
  uptime: 99.99,
  trend: '+3.2%',
  lastScan: '2 minutes ago',
}

const mockAutonomousActions = [
  {
    id: 1,
    type: 'security',
    priority: 'high',
    title: 'Vulnerabilities Detected',
    description: 'I found 2 potential security vulnerabilities in your plugins.',
    action: 'I\'ve prepared automated patches. Review and approve to deploy.',
    buttons: ['Approve Patch', 'Review Details', 'Ignore'],
    status: 'pending',
  },
  {
    id: 2,
    type: 'performance',
    priority: 'medium',
    title: 'Performance Optimization',
    description: 'Your Services page is loading 1.5s slower than last week.',
    action: 'I\'ve identified 3 images to optimize and 2 scripts to defer.',
    buttons: ['Optimize Now', 'View Details', 'Later'],
    status: 'pending',
  },
  {
    id: 3,
    type: 'seo',
    priority: 'low',
    title: 'SEO Opportunity',
    description: 'Your "About Us" page has a high bounce rate (78%).',
    action: 'I can rewrite the copy to be more engaging and improve retention.',
    buttons: ['Start Rewrite', 'View Analytics', 'Dismiss'],
    status: 'pending',
  },
  {
    id: 4,
    type: 'security',
    priority: 'medium',
    title: 'Inactive User Account',
    description: 'User "admin_test" hasn\'t logged in for 90 days.',
    action: 'I recommend deactivating this account to reduce attack surface.',
    buttons: ['Deactivate', 'Keep Active', 'Remind User'],
    status: 'pending',
  },
]

const mockPredictiveInsights = [
  {
    id: 1,
    type: 'traffic',
    insight: 'Traffic from Germany increased 234% this week',
    recommendation: 'Consider registering the .de version of your domain to protect your brand',
    impact: 'high',
    action: 'Search .de Domain',
  },
  {
    id: 2,
    type: 'conversion',
    insight: 'Cart abandonment rate increased by 12%',
    recommendation: 'Add trust badges and simplify checkout process',
    impact: 'critical',
    action: 'Optimize Checkout',
  },
  {
    id: 3,
    type: 'performance',
    insight: 'Mobile load time exceeds 3s threshold',
    recommendation: 'Enable image compression and lazy loading',
    impact: 'high',
    action: 'Fix Mobile Speed',
  },
]

const mockQuickStats = {
  visitors: { today: 1247, change: 4.9 },
  conversions: { today: 89, change: 12.3 },
  revenue: { today: 4521, change: 8.7 },
  uptime: { current: 99.99, days: 365 },
}

export default function AIMissionControlPage() {
  const [activeTab, setActiveTab] = React.useState('overview')
  const [healthScore, setHealthScore] = React.useState(0)
  const [isScanning, setIsScanning] = React.useState(false)
  const [actions, setActions] = React.useState(mockAutonomousActions)
  const [showBrandSynthesizer, setShowBrandSynthesizer] = React.useState(false)

  // Animate health score on mount
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setHealthScore(mockAIHealthScore.overall)
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  const handleQuickScan = () => {
    setIsScanning(true)
    setTimeout(() => setIsScanning(false), 3000)
  }

  const handleApproveAction = (id: number) => {
    setActions(actions.map(a => 
      a.id === id ? { ...a, status: 'completed' } : a
    ))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950">
      {/* Top Navigation */}
      <header className="sticky top-0 z-40 border-b border-zinc-800/50 bg-zinc-950/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <img src="/icon.png" alt="BUILD WITH AI" className="h-8 w-8 rounded-lg" />
            <div>
              <h1 className="text-lg font-semibold text-zinc-100">AI Mission Control</h1>
              <p className="text-xs text-zinc-500">Autonomous Website Management</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs text-emerald-400">
              <CheckCircle size={14} />
              <span className="font-medium">All Systems Operational</span>
            </div>
            
            <Button
              onClick={() => setShowBrandSynthesizer(true)}
              className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-600 px-4 py-2 text-sm font-medium text-white transition-all hover:shadow-lg hover:shadow-purple-500/30"
            >
              <Sparkles size={16} />
              AI Brand Synthesizer
            </Button>

            <button className="rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2 text-sm font-medium text-white transition-all hover:shadow-lg hover:shadow-cyan-500/30">
              Upgrade to Pro
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-[1600px] gap-6 px-6 py-6">
        {/* Sidebar Navigation */}
        <aside className="sticky top-24 h-[calc(100vh-8rem)] w-64 shrink-0">
          <nav className="space-y-1">
            <NavItem icon={Activity} label="Overview" active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} />
            <NavItem icon={Shield} label="Security Guardian" active={activeTab === 'security'} onClick={() => setActiveTab('security')} badge={mockAIHealthScore.security} />
            <NavItem icon={Zap} label="Performance" active={activeTab === 'performance'} onClick={() => setActiveTab('performance')} badge={mockAIHealthScore.performance} />
            <NavItem icon={TrendingUp} label="Predictive Analytics" active={activeTab === 'analytics'} onClick={() => setActiveTab('analytics')} />
            <NavItem icon={Target} label="SEO Optimizer" active={activeTab === 'seo'} onClick={() => setActiveTab('seo')} badge={mockAIHealthScore.seo} />
            
            <div className="my-4 border-t border-zinc-800" />
            
            <NavItem icon={Users} label="User Management" active={activeTab === 'users'} onClick={() => setActiveTab('users')} />
            <NavItem icon={Code} label="Code Generator" active={activeTab === 'code'} onClick={() => setActiveTab('code')} />
            <NavItem icon={Eye} label="Maintenance Mode" active={activeTab === 'maintenance'} onClick={() => setActiveTab('maintenance')} />
            <NavItem icon={Settings} label="Settings" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
          </nav>

          {/* MARZ Proactive Tips */}
          <div className="mt-6 rounded-xl border border-zinc-800 bg-gradient-to-br from-zinc-900 to-zinc-950 p-4">
            <div className="mb-3 flex items-center gap-2">
              <Lightbulb size={16} className="text-yellow-400" />
              <span className="text-sm font-semibold text-zinc-100">MARZ Insights</span>
            </div>
            <p className="mb-3 text-xs text-zinc-400">
              "I noticed your conversion rate drops 40% on mobile. I can optimize your checkout flow. Want me to?"
            </p>
            <button className="w-full rounded-lg bg-gradient-to-r from-yellow-500 to-orange-600 py-2 text-xs font-medium text-white transition-all hover:shadow-lg hover:shadow-yellow-500/30">
              Optimize Checkout
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          {/* AI Health Score - The Command Center */}
          <div className="mb-6 rounded-2xl border border-zinc-800 bg-gradient-to-br from-zinc-900/80 to-zinc-950/80 p-8 backdrop-blur-xl">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-zinc-100">AI Health Score</h2>
                <p className="text-sm text-zinc-400">Real-time analysis of your website's overall health</p>
              </div>
              <button
                onClick={handleQuickScan}
                disabled={isScanning}
                className="flex items-center gap-2 rounded-lg bg-zinc-800 px-4 py-2 text-sm text-zinc-300 transition-all hover:bg-zinc-700 disabled:opacity-50"
              >
                <RefreshCw size={14} className={isScanning ? 'animate-spin' : ''} />
                {isScanning ? 'Scanning...' : 'Full Scan'}
              </button>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              {/* Main Score */}
              <div className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-6 text-center">
                <div className="relative mx-auto mb-4 h-40 w-40">
                  <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="#27272a"
                      strokeWidth="8"
                    />
                    <motion.circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="url(#gradient)"
                      strokeWidth="8"
                      strokeLinecap="round"
                      initial={{ strokeDasharray: '283', strokeDashoffset: '283' }}
                      animate={{ strokeDashoffset: 283 - (283 * healthScore) / 100 }}
                      transition={{ duration: 2, delay: 0.5 }}
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#06b6d4" />
                        <stop offset="50%" stopColor="#3b82f6" />
                        <stop offset="100%" stopColor="#8b5cf6" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <motion.span
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-5xl font-bold text-zinc-100"
                    >
                      {healthScore}
                    </motion.span>
                    <span className="mt-1 text-xs text-zinc-500">out of 100</span>
                  </div>
                </div>
                <div className="flex items-center justify-center gap-2 text-sm text-emerald-400">
                  <ArrowUpRight size={14} />
                  <span className="font-medium">{mockAIHealthScore.trend} this week</span>
                </div>
              </div>

              {/* Component Scores */}
              <div className="lg:col-span-2">
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                  <ScoreCard icon={Shield} label="Security" value={mockAIHealthScore.security} color="emerald" />
                  <ScoreCard icon={Zap} label="Performance" value={mockAIHealthScore.performance} color="yellow" />
                  <ScoreCard icon={Target} label="SEO" value={mockAIHealthScore.seo} color="blue" />
                  <ScoreCard icon={Activity} label="Uptime" value={mockAIHealthScore.uptime} color="purple" isPercentage />
                </div>

                {/* AI Explanation */}
                <div className="mt-4 rounded-xl border border-zinc-800 bg-zinc-950/50 p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <Sparkles size={14} className="text-cyan-400" />
                    <span className="text-sm font-semibold text-zinc-100">AI Analysis</span>
                  </div>
                  <p className="text-sm text-zinc-400">
                    Your site health is <span className="text-emerald-400 font-medium">excellent</span>. 
                    Security is optimal, but I've identified 3 performance optimizations that could boost your score to 97. 
                    Would you like me to implement them automatically?
                  </p>
                </div>

                {/* Quick Stats */}
                <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
                  <QuickStat label="Visitors Today" value={mockQuickStats.visitors.today} change={mockQuickStats.visitors.change} />
                  <QuickStat label="Conversions" value={mockQuickStats.conversions.today} change={mockQuickStats.conversions.change} />
                  <QuickStat label="Revenue Today" value={`$${mockQuickStats.revenue.today}`} change={mockQuickStats.revenue.change} isCurrency />
                  <QuickStat label="Uptime (365d)" value={`${mockQuickStats.uptime.current}%`} change={`${mockQuickStats.uptime.days} days`} isUptime />
                </div>
              </div>
            </div>
          </div>

          {/* Autonomous Actions - AI Takes Initiative */}
          <div className="mb-6 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-zinc-100">Autonomous Actions</h2>
                <p className="text-sm text-zinc-400">AI-detected issues requiring your approval</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-red-500/10 px-3 py-1 text-xs text-red-400">
                  {actions.filter(a => a.status === 'pending').length} Pending
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <AnimatePresence>
                {actions.filter(a => a.status === 'pending').map((action) => (
                  <ActionCard
                    key={action.id}
                    action={action}
                    onApprove={() => handleApproveAction(action.id)}
                  />
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Predictive Insights - AI Business Consultant */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-zinc-100">Predictive Insights</h2>
                <p className="text-sm text-zinc-400">AI-powered business opportunities</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
              {mockPredictiveInsights.map((insight) => (
                <InsightCard key={insight.id} insight={insight} />
              ))}
            </div>
          </div>
        </main>
      </div>

      {/* AI Brand Synthesizer Modal */}
      <AnimatePresence>
        {showBrandSynthesizer && (
          <BrandSynthesizerModal onClose={() => setShowBrandSynthesizer(false)} />
        )}
      </AnimatePresence>
    </div>
  )
}

// Sub-components

function NavItem({ icon: Icon, label, active, onClick, badge }: any) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-all ${
        active
          ? 'bg-gradient-to-r from-cyan-500/10 to-blue-500/10 text-cyan-400'
          : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'
      }`}
    >
      <div className="flex items-center gap-3">
        <Icon size={16} />
        <span>{label}</span>
      </div>
      {badge && (
        <span className={`rounded-full px-2 py-0.5 text-[10px] ${
          typeof badge === 'number' && badge >= 90 ? 'bg-emerald-500/20 text-emerald-400' :
          typeof badge === 'number' && badge >= 70 ? 'bg-yellow-500/20 text-yellow-400' :
          'bg-zinc-800 text-zinc-400'
        }`}>
          {typeof badge === 'number' ? badge : badge}
        </span>
      )}
    </button>
  )
}

function ScoreCard({ icon: Icon, label, value, color, isPercentage }: any) {
  const colorClasses = {
    emerald: 'from-emerald-500/10 to-emerald-500/5 border-emerald-500/20 text-emerald-400',
    yellow: 'from-yellow-500/10 to-yellow-500/5 border-yellow-500/20 text-yellow-400',
    blue: 'from-blue-500/10 to-blue-500/5 border-blue-500/20 text-blue-400',
    purple: 'from-purple-500/10 to-purple-500/5 border-purple-500/20 text-purple-400',
  }

  return (
    <div className={`rounded-xl border bg-gradient-to-br ${colorClasses[color as keyof typeof colorClasses]} p-4`}>
      <div className="mb-2 flex items-center justify-between">
        <Icon size={18} />
        <span className="text-xs text-zinc-500">{label}</span>
      </div>
      <p className="text-2xl font-bold">
        {value}
        {isPercentage && '%'}
      </p>
    </div>
  )
}

function QuickStat({ label, value, change, isCurrency, isUptime }: any) {
  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-950/50 p-3">
      <p className="text-xs text-zinc-500">{label}</p>
      <p className="mt-1 text-lg font-bold text-zinc-100">
        {isCurrency ? value : typeof value === 'number' ? value.toLocaleString() : value}
      </p>
      <div className={`flex items-center gap-1 text-xs ${
        typeof change === 'number' && change > 0 ? 'text-emerald-400' :
        typeof change === 'number' && change < 0 ? 'text-red-400' :
        'text-zinc-500'
      }`}>
        {typeof change === 'number' && change > 0 && <ArrowUpRight size={10} />}
        {typeof change === 'number' && change > 0 ? '+' : ''}
        {isUptime ? change : `${change}%`}
      </div>
    </div>
  )
}

function ActionCard({ action, onApprove }: any) {
  const typeColors = {
    security: 'border-red-500/30 bg-red-500/5',
    performance: 'border-yellow-500/30 bg-yellow-500/5',
    seo: 'border-blue-500/30 bg-blue-500/5',
    user: 'border-purple-500/30 bg-purple-500/5',
  }

  const priorityColors = {
    high: 'text-red-400',
    medium: 'text-yellow-400',
    low: 'text-blue-400',
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className={`rounded-xl border ${typeColors[action.type as keyof typeof typeColors]} p-4`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          {action.type === 'security' && <Shield size={20} className="mt-0.5 text-red-400" />}
          {action.type === 'performance' && <Zap size={20} className="mt-0.5 text-yellow-400" />}
          {action.type === 'seo' && <Target size={20} className="mt-0.5 text-blue-400" />}
          {action.type === 'user' && <Users size={20} className="mt-0.5 text-purple-400" />}
          
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-zinc-100">{action.title}</h3>
              <span className={`text-[10px] uppercase ${priorityColors[action.priority as keyof typeof priorityColors]}`}>
                {action.priority}
              </span>
            </div>
            <p className="mt-1 text-sm text-zinc-400">{action.description}</p>
            <p className="mt-2 text-xs text-zinc-500">{action.action}</p>
            
            <div className="mt-3 flex gap-2">
              {action.buttons.map((btn: string, index: number) => (
                <Button
                  key={btn}
                  onClick={() => index === 0 && onApprove()}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                    index === 0
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:shadow-lg hover:shadow-cyan-500/30'
                      : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                  }`}
                  variant={index === 0 ? 'primary' : 'secondary'}
                >
                  {btn}
                </Button>
              ))}
            </div>
        </div>
      </div>
      </div>
    </motion.div>
  )
}

function InsightCard({ insight }: any) {
  const impactColors = {
    critical: 'border-red-500/30 bg-red-500/5',
    high: 'border-yellow-500/30 bg-yellow-500/5',
    medium: 'border-blue-500/30 bg-blue-500/5',
  }

  return (
    <div className={`rounded-xl border ${impactColors[insight.impact as keyof typeof impactColors]} p-4`}>
      <div className="mb-2 flex items-center gap-2">
        <Lightbulb size={16} className="text-yellow-400" />
        <span className={`text-xs font-medium uppercase ${
          insight.impact === 'high' ? 'text-yellow-400' : 'text-blue-400'
        }`}>
          {insight.impact} Impact
        </span>
      </div>
      <p className="text-sm font-semibold text-zinc-100">{insight.insight}</p>
      <p className="mt-2 text-xs text-zinc-400">{insight.recommendation}</p>
      <Button className="mt-3 flex items-center gap-2 text-xs font-medium text-cyan-400 hover:text-cyan-300" variant="secondary">
        {insight.action}
        <ChevronRight size={12} />
      </Button>
    </div>
  )
}

function BrandSynthesizerModal({ onClose }: any) {
  const [step, setStep] = React.useState(1)
  const [businessIdea, setBusinessIdea] = React.useState('')
  const [isGenerating, setIsGenerating] = React.useState(false)

  const handleGenerate = () => {
    setIsGenerating(true)
    setTimeout(() => {
      setIsGenerating(false)
      setStep(2)
    }, 3000)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-2xl rounded-2xl border border-zinc-800 bg-zinc-900 p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-zinc-100">AI Brand Synthesizer</h2>
            <p className="text-sm text-zinc-400">From idea to fully branded business in 60 seconds</p>
          </div>
          <button onClick={onClose} className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-800">
            <X size={20} />
          </button>
        </div>

        {step === 1 ? (
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-300">
                Describe your business idea
              </label>
              <Textarea
                value={businessIdea}
                onChange={(e) => setBusinessIdea(e.target.value)}
                placeholder="e.g., I want to start an online store selling sustainable fashion accessories made from recycled materials..."
                className="h-32 w-full resize-none rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 placeholder-zinc-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
              />
            </div>

            <button
              onClick={handleGenerate}
              disabled={!businessIdea.trim() || isGenerating}
              className="w-full rounded-lg bg-gradient-to-r from-purple-500 to-pink-600 py-3 text-sm font-medium text-white transition-all hover:shadow-lg hover:shadow-purple-500/30 disabled:opacity-50"
            >
              {isGenerating ? (
                <span className="flex items-center justify-center gap-2">
                  <RefreshCw size={16} className="animate-spin" />
                  Generating Your Brand...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Sparkles size={16} />
                  Generate Complete Brand
                </span>
              )}
            </button>

            <div className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-4">
              <p className="text-xs text-zinc-400">
                <span className="font-semibold text-cyan-400">What you'll get:</span>
                <br />• 10 brandable domain names (.com, .ai, .io)
                <br />• Professional logo & color palette
                <br />• One-page launchpad website
                <br />• AI-generated marketing copy
                <br />• Matching professional email
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-center">
              <CheckCircle size={48} className="mx-auto mb-2 text-emerald-400" />
              <h3 className="text-lg font-semibold text-emerald-400">Your Brand is Ready!</h3>
              <p className="text-sm text-zinc-400">Generated in 2.3 seconds</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-4">
                <Globe size={20} className="mb-2 text-cyan-400" />
                <p className="text-sm font-semibold text-zinc-100">10 Domains</p>
                <p className="text-xs text-zinc-500">Available & brandable</p>
              </div>
              <div className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-4">
                <Palette size={20} className="mb-2 text-pink-400" />
                <p className="text-sm font-semibold text-zinc-100">Logo + Colors</p>
                <p className="text-xs text-zinc-500">Professional design</p>
              </div>
              <div className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-4">
                <Rocket size={20} className="mb-2 text-purple-400" />
                <p className="text-sm font-semibold text-zinc-100">Launchpad Site</p>
                <p className="text-xs text-zinc-500">Ready to publish</p>
              </div>
              <div className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-4">
                <Mail size={20} className="mb-2 text-yellow-400" />
                <p className="text-sm font-semibold text-zinc-100">Professional Email</p>
                <p className="text-xs text-zinc-500">hello@yourbrand.com</p>
              </div>
            </div>

            <div className="flex gap-3">
              <button className="flex-1 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 py-3 text-sm font-medium text-white transition-all hover:shadow-lg hover:shadow-cyan-500/30">
                Review & Customize
              </button>
              <button className="flex-1 rounded-lg border border-zinc-800 bg-zinc-900 py-3 text-sm font-medium text-zinc-300 transition-all hover:bg-zinc-800">
                Start Over
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}
