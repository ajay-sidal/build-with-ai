'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import {
  LayoutDashboard,
  Shield,
  Zap,
  Activity,
  BarChart3,
  Search,
  Palette,
  Users,
  Code,
  Eye,
  Sparkles,
  TrendingUp,
  CheckCircle,
  AlertTriangle,
  Clock,
  RefreshCw,
  Globe,
  Lock,
  Download,
  Upload,
  Copy,
  Settings,
  Play,
  Cpu,
  Database,
  FileText,
  ExternalLink,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react'

// Mock data for demonstration
const mockSiteData = {
  domain: 'example.com',
  status: 'active',
  uptime: 99.99,
  performance: 94,
  security: 98,
  seo: 87,
  lastBackup: '2 hours ago',
  visitors: {
    today: 1247,
    yesterday: 1189,
    change: 4.9,
  },
  speed: {
    load: 1.2,
    firstByte: 0.3,
    interactive: 2.1,
  },
}

const mockAlerts = [
  { id: 1, type: 'success', message: 'SSL certificate renewed successfully', time: '5 min ago' },
  { id: 2, type: 'warning', message: 'Performance score dropped by 3%', time: '1 hour ago' },
  { id: 3, type: 'info', message: 'New visitor milestone: 10K this month', time: '3 hours ago' },
]

const mockQuickActions = [
  { icon: Download, label: 'Backup Now', color: 'blue' },
  { icon: Shield, label: 'Security Scan', color: 'green' },
  { icon: Zap, label: 'Optimize', color: 'yellow' },
  { icon: Copy, label: 'Clone Site', color: 'purple' },
]

export default function DashboardPage() {
  const [activeTab, setActiveTab] = React.useState('overview')
  const [isScanning, setIsScanning] = React.useState(false)

  const handleQuickScan = () => {
    setIsScanning(true)
    setTimeout(() => setIsScanning(false), 3000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 border-b border-zinc-800/50 bg-zinc-950/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <img src="/icon.png" alt="BUILD WITH AI" className="h-8 w-8 rounded-lg" />
            <div>
              <h1 className="text-lg font-semibold text-zinc-100">Website Dashboard</h1>
              <p className="text-xs text-zinc-500">{mockSiteData.domain}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-400">
              <CheckCircle size={12} />
              <span>All Systems Operational</span>
            </div>
            <button className="rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2 text-sm font-medium text-white transition-all hover:shadow-lg hover:shadow-cyan-500/30">
              Upgrade to Pro
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl gap-6 px-6 py-6">
        {/* Sidebar Navigation */}
        <aside className="sticky top-24 h-[calc(100vh-8rem)] w-64 shrink-0 overflow-y-auto">
          <nav className="space-y-1">
            <NavItem icon={LayoutDashboard} label="Overview" active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} />
            <NavItem icon={Shield} label="Security" active={activeTab === 'security'} onClick={() => setActiveTab('security')} badge="98%" />
            <NavItem icon={Zap} label="Performance" active={activeTab === 'performance'} onClick={() => setActiveTab('performance')} badge="94" />
            <NavItem icon={BarChart3} label="Analytics" active={activeTab === 'analytics'} onClick={() => setActiveTab('analytics')} />
            <NavItem icon={Search} label="SEO" active={activeTab === 'seo'} onClick={() => setActiveTab('seo')} badge="87" />
            
            <div className="my-4 border-t border-zinc-800" />
            
            <NavItem icon={Database} label="Backups" active={activeTab === 'backups'} onClick={() => setActiveTab('backups')} />
            <NavItem icon={Globe} label="Domains" active={activeTab === 'domains'} onClick={() => setActiveTab('domains')} />
            <NavItem icon={Users} label="Users" active={activeTab === 'users'} onClick={() => setActiveTab('users')} />
            <NavItem icon={Code} label="Code Snippets" active={activeTab === 'code'} onClick={() => setActiveTab('code')} />
            <NavItem icon={Settings} label="Settings" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
          </nav>

          {/* AI Assistant Card */}
          <div className="mt-6 rounded-xl border border-zinc-800 bg-gradient-to-br from-zinc-900 to-zinc-950 p-4">
            <div className="mb-3 flex items-center gap-2">
              <Sparkles size={16} className="text-cyan-400" />
              <span className="text-sm font-semibold text-zinc-100">AI Assistant</span>
            </div>
            <p className="mb-3 text-xs text-zinc-400">
              Need help optimizing your site? MARZ can help!
            </p>
            <button className="w-full rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 py-2 text-xs font-medium text-white transition-all hover:shadow-lg hover:shadow-cyan-500/30">
              Ask MARZ
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          {/* Quick Stats Grid */}
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              icon={Activity}
              label="Uptime"
              value={`${mockSiteData.uptime}%`}
              trend="+0.01%"
              trendUp
              color="emerald"
            />
            <StatCard
              icon={Zap}
              label="Performance"
              value={mockSiteData.performance.toString()}
              trend="+3"
              trendUp
              color="yellow"
            />
            <StatCard
              icon={Lock}
              label="Security Score"
              value={`${mockSiteData.security}%`}
              trend="Excellent"
              trendUp
              color="blue"
            />
            <StatCard
              icon={Users}
              label="Visitors Today"
              value={mockSiteData.visitors.today.toLocaleString()}
              trend={`+${mockSiteData.visitors.change}%`}
              trendUp
              color="purple"
            />
          </div>

          {/* Quick Actions */}
          <div className="mb-6 rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-zinc-100">Quick Actions</h2>
              <button
                onClick={handleQuickScan}
                className="flex items-center gap-2 rounded-lg bg-zinc-800 px-3 py-1.5 text-xs text-zinc-300 transition-all hover:bg-zinc-700"
              >
                <RefreshCw size={12} className={isScanning ? 'animate-spin' : ''} />
                {isScanning ? 'Scanning...' : 'Full Scan'}
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {mockQuickActions.map((action) => (
                <motion.button
                  key={action.label}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex flex-col items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-950 p-4 transition-all hover:border-zinc-700 hover:bg-zinc-900"
                >
                  <action.icon size={20} className={`text-${action.color}-400`} />
                  <span className="text-xs text-zinc-300">{action.label}</span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Main Dashboard Grid */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Performance Overview */}
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 lg:col-span-2">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-zinc-100">Performance Overview</h2>
                <button className="text-xs text-cyan-400 hover:text-cyan-300">View Details</button>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <MetricCard label="Load Time" value={`${mockSiteData.speed.load}s`} icon={Clock} />
                <MetricCard label="First Byte" value={`${mockSiteData.speed.firstByte}s`} icon={Zap} />
                <MetricCard label="Interactive" value={`${mockSiteData.speed.interactive}s`} icon={Activity} />
              </div>
              <div className="mt-4 rounded-lg bg-zinc-950 p-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs text-zinc-400">Overall Score</span>
                  <span className="text-sm font-semibold text-emerald-400">94/100</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-zinc-800">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '94%' }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500"
                  />
                </div>
              </div>
            </div>

            {/* Recent Alerts */}
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-zinc-100">Recent Alerts</h2>
                <button className="text-xs text-cyan-400 hover:text-cyan-300">View All</button>
              </div>
              <div className="space-y-3">
                {mockAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="flex items-start gap-3 rounded-lg border border-zinc-800/50 bg-zinc-950/50 p-3"
                  >
                    {alert.type === 'success' && <CheckCircle size={16} className="mt-0.5 text-emerald-400" />}
                    {alert.type === 'warning' && <AlertTriangle size={16} className="mt-0.5 text-yellow-400" />}
                    {alert.type === 'info' && <Activity size={16} className="mt-0.5 text-blue-400" />}
                    <div className="flex-1">
                      <p className="text-xs text-zinc-300">{alert.message}</p>
                      <p className="mt-1 text-[10px] text-zinc-500">{alert.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SEO Overview */}
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-zinc-100">SEO Health</h2>
                <button className="text-xs text-cyan-400 hover:text-cyan-300">Optimize</button>
              </div>
              <div className="space-y-4">
                <SEOMetric label="Meta Tags" value={95} />
                <SEOMetric label="Content Quality" value={88} />
                <SEOMetric label="Backlinks" value={76} />
                <SEOMetric label="Mobile Friendly" value={100} />
              </div>
            </div>

            {/* Security Status */}
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 lg:col-span-2">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-zinc-100">Security Status</h2>
                <button className="flex items-center gap-2 rounded-lg bg-emerald-500/10 px-3 py-1.5 text-xs text-emerald-400 transition-all hover:bg-emerald-500/20">
                  <Shield size={12} />
                  Protected
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <SecurityFeature icon={Lock} label="SSL Certificate" status="Active" />
                <SecurityFeature icon={Shield} label="Firewall" status="Active" />
                <SecurityFeature icon={Activity} label="Malware Scan" status="Clean" />
                <SecurityFeature icon={Database} label="Daily Backup" status="Enabled" />
              </div>
            </div>
          </div>
        </main>
      </div>
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
        <span className="rounded-full bg-zinc-800 px-2 py-0.5 text-[10px] text-zinc-400">
          {badge}
        </span>
      )}
    </button>
  )
}

function StatCard({ icon: Icon, label, value, trend, trendUp, color }: any) {
  const colorClasses = {
    emerald: 'from-emerald-500/10 to-emerald-500/5 border-emerald-500/20',
    yellow: 'from-yellow-500/10 to-yellow-500/5 border-yellow-500/20',
    blue: 'from-blue-500/10 to-blue-500/5 border-blue-500/20',
    purple: 'from-purple-500/10 to-purple-500/5 border-purple-500/20',
  }

  const iconColorClasses = {
    emerald: 'text-emerald-400',
    yellow: 'text-yellow-400',
    blue: 'text-blue-400',
    purple: 'text-purple-400',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-xl border bg-gradient-to-br ${colorClasses[color as keyof typeof colorClasses]} p-4`}
    >
      <div className="mb-2 flex items-center justify-between">
        <Icon size={20} className={iconColorClasses[color as keyof typeof iconColorClasses]} />
        {trend && (
          <span className={`flex items-center gap-1 text-xs ${trendUp ? 'text-emerald-400' : 'text-red-400'}`}>
            {trendUp ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
            {trend}
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-zinc-100">{value}</p>
      <p className="text-xs text-zinc-500">{label}</p>
    </motion.div>
  )
}

function MetricCard({ label, value, icon: Icon }: any) {
  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-3 text-center">
      <Icon size={16} className="mx-auto mb-2 text-zinc-500" />
      <p className="text-lg font-semibold text-zinc-100">{value}</p>
      <p className="text-[10px] text-zinc-500">{label}</p>
    </div>
  )
}

function SEOMetric({ label, value }: any) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <span className="text-xs text-zinc-400">{label}</span>
        <span className="text-xs text-zinc-300">{value}%</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-zinc-800">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.8 }}
          className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
        />
      </div>
    </div>
  )
}

function SecurityFeature({ icon: Icon, label, status }: any) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-zinc-800/50 bg-zinc-950/50 p-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-900">
        <Icon size={18} className="text-emerald-400" />
      </div>
      <div>
        <p className="text-xs font-medium text-zinc-200">{label}</p>
        <p className="text-[10px] text-emerald-400">{status}</p>
      </div>
    </div>
  )
}
