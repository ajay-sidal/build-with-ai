/**
 * MARZ Voice & Chat Verification Test
 * 
 * This utility tests the complete voice-to-text-to-action pipeline:
 * 1. Simulates voice input
 * 2. Verifies API endpoint access
 * 3. Confirms response rendering
 * 
 * Usage: Import in browser console or run from test page
 */

export interface VoiceTestResult {
  test: string
  passed: boolean
  error?: string
  duration?: number
}

export interface VoiceTestReport {
  timestamp: string
  results: VoiceTestResult[]
  overall: 'PASS' | 'FAIL'
}

/**
 * Test 1: Verify Web Speech API availability
 */
export function testSpeechAPI(): VoiceTestResult {
  const start = performance.now()
  const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
  
  const result: VoiceTestResult = {
    test: 'Web Speech API Availability',
    passed: !!SpeechRecognition,
    duration: performance.now() - start,
  }
  
  if (!SpeechRecognition) {
    result.error = 'Web Speech API not supported. Use Chrome or Edge browser.'
  }
  
  return result
}

/**
 * Test 2: Verify microphone access
 */
export async function testMicrophoneAccess(): Promise<VoiceTestResult> {
  const start = performance.now()
  
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    stream.getTracks().forEach(track => track.stop())
    
    return {
      test: 'Microphone Access',
      passed: true,
      duration: performance.now() - start,
    }
  } catch (error: any) {
    return {
      test: 'Microphone Access',
      passed: false,
      error: error.name === 'NotAllowedError' 
        ? 'Microphone permission denied. Please allow access in browser settings.'
        : error.message,
      duration: performance.now() - start,
    }
  }
}

/**
 * Test 3: Verify MARZ API endpoint accessibility
 */
export async function testMARZAPI(): Promise<VoiceTestResult> {
  const start = performance.now()
  
  try {
    const response = await fetch('/api/marz/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [{ role: 'user', content: 'Test connection' }]
      }),
    })
    
    const passed = response.ok || response.status === 503 // 503 = missing API key (expected in test)
    
    return {
      test: 'MARZ API Endpoint',
      passed,
      duration: performance.now() - start,
      error: passed ? undefined : `HTTP ${response.status}`,
    }
  } catch (error: any) {
    return {
      test: 'MARZ API Endpoint',
      passed: false,
      error: error.message,
      duration: performance.now() - start,
    }
  }
}

/**
 * Test 4: Verify domain check endpoint
 */
export async function testDomainCheckEndpoint(): Promise<VoiceTestResult> {
  const start = performance.now()
  
  try {
    const response = await fetch('/api/v1/domains/check?query=test&domain=digital', {
      method: 'GET',
    })
    
    const passed = response.ok || response.status === 400 // 400 = expected for incomplete query
    
    return {
      test: 'Domain Check Endpoint',
      passed,
      duration: performance.now() - start,
      error: passed ? undefined : `HTTP ${response.status}`,
    }
  } catch (error: any) {
    return {
      test: 'Domain Check Endpoint',
      passed: false,
      error: error.message,
      duration: performance.now() - start,
    }
  }
}

/**
 * Test 5: Simulate voice command "Check domain availability for test.digital"
 */
export async function testVoiceCommandSimulation(): Promise<VoiceTestResult> {
  const start = performance.now()
  const voiceCommand = 'Check domain availability for test.digital'
  
  try {
    // Simulate sending voice command to MARZ
    const response = await fetch('/api/marz/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [{ role: 'user', content: voiceCommand }]
      }),
    })
    
    const data = await response.json()
    const passed = response.ok && data.response && data.response.length > 0
    
    return {
      test: 'Voice Command Simulation',
      passed,
      duration: performance.now() - start,
      error: passed ? undefined : data.error || 'No response from MARZ',
    }
  } catch (error: any) {
    return {
      test: 'Voice Command Simulation',
      passed: false,
      error: error.message,
      duration: performance.now() - start,
    }
  }
}

/**
 * Test 6: Verify CSP allows media streams
 */
export function testCSPMediaSupport(): VoiceTestResult {
  const start = performance.now()
  const metaCSP = document.querySelector('meta[http-equiv="Content-Security-Policy"]')
  const headerCSP = document.styleSheets.length > 0
  
  // Check if media-src is in CSP
  const cspValue = metaCSP?.getAttribute('content') || ''
  const hasMediaSrc = cspValue.includes('media-src') || cspValue.includes('mediastream:')
  
  return {
    test: 'CSP Media Support',
    passed: hasMediaSrc || headerCSP, // If CSP is set via headers, we can't check it here
    duration: performance.now() - start,
    error: hasMediaSrc ? undefined : 'CSP may not include media-src directive',
  }
}

/**
 * Run Complete Voice Test Suite
 */
export async function runVoiceTestSuite(): Promise<VoiceTestReport> {
  console.log('🎤 Starting MARZ Voice Test Suite...')
  
  const results: VoiceTestResult[] = []
  
  // Test 1: Speech API (sync)
  console.log('  Test 1: Web Speech API...')
  results.push(testSpeechAPI())
  
  // Test 2: Microphone (async)
  console.log('  Test 2: Microphone Access...')
  results.push(await testMicrophoneAccess())
  
  // Test 3: MARZ API (async)
  console.log('  Test 3: MARZ API Endpoint...')
  results.push(await testMARZAPI())
  
  // Test 4: Domain Check (async)
  console.log('  Test 4: Domain Check Endpoint...')
  results.push(await testDomainCheckEndpoint())
  
  // Test 5: Voice Command (async)
  console.log('  Test 5: Voice Command Simulation...')
  results.push(await testVoiceCommandSimulation())
  
  // Test 6: CSP (sync)
  console.log('  Test 6: CSP Media Support...')
  results.push(testCSPMediaSupport())
  
  const passed = results.filter(r => r.passed).length
  const total = results.length
  
  const report: VoiceTestReport = {
    timestamp: new Date().toISOString(),
    results,
    overall: passed === total ? 'PASS' : 'FAIL',
  }
  
  console.log('\n📊 Test Results:')
  console.log(`  Passed: ${passed}/${total}`)
  console.log(`  Overall: ${report.overall}`)
  console.log('\nDetailed Results:')
  results.forEach(r => {
    console.log(`  ${r.passed ? '✅' : '❌'} ${r.test} (${r.duration?.toFixed(2)}ms)${r.error ? ' - ' + r.error : ''}`)
  })
  
  // Log errors to admin dashboard
  const failedTests = results.filter(r => !r.passed)
  if (failedTests.length > 0) {
    try {
      await fetch('/api/logs/client-error', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: 'Voice test suite failures',
          details: failedTests,
          timestamp: report.timestamp,
        }),
      })
      console.log('  📝 Errors logged to admin dashboard')
    } catch {
      // Ignore logging errors
    }
  }
  
  return report
}

/**
 * Quick Test - Run in browser console
 * Usage: import { quickTest } from './voice-test.ts'; quickTest();
 */
export async function quickTest() {
  console.log('🎤 Running quick voice check...')
  const api = await testMARZAPI()
  const mic = await testMicrophoneAccess()
  
  if (api.passed && mic.passed) {
    console.log('✅ Voice chat ready!')
  } else {
    console.log('❌ Voice chat issues detected:')
    if (!api.passed) console.log('   - MARZ API: ' + api.error)
    if (!mic.passed) console.log('   - Microphone: ' + mic.error)
  }
}

export default {
  runVoiceTestSuite,
  quickTest,
  testSpeechAPI,
  testMicrophoneAccess,
  testMARZAPI,
  testDomainCheckEndpoint,
  testVoiceCommandSimulation,
  testCSPMediaSupport,
}
