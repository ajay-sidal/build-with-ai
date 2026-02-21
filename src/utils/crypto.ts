import * as forge from 'node-forge'

type GeneratedSslCredentials = {
  privateKeyPem: string
  csrPem: string
  downloadPrivateKey: (fileName?: string) => void
}

type GenerateSslCredentialsParams = {
  commonName: string
  organization?: string
  organizationalUnit?: string
  locality?: string
  state?: string
  country?: string
}

function downloadTextFile(fileName: string, contents: string) {
  if (typeof window === 'undefined') {
    throw new Error('downloadTextFile is browser-only')
  }

  const blob = new Blob([contents], { type: 'application/x-pem-file' })
  const url = URL.createObjectURL(blob)

  const a = document.createElement('a')
  a.href = url
  a.download = fileName
  a.rel = 'noopener'
  document.body.appendChild(a)
  a.click()
  a.remove()

  URL.revokeObjectURL(url)
}

/**
 * Browser-only.
 * Generates a 2048-bit RSA key pair and a PEM CSR.
 */
export async function generateSslCredentials(
  params: GenerateSslCredentialsParams,
): Promise<GeneratedSslCredentials> {
  if (typeof window === 'undefined') {
    throw new Error('generateSslCredentials must be called in the browser')
  }

  // node-forge key generation is CPU heavy; keep it async-friendly
  const keypair = await new Promise<forge.pki.rsa.KeyPair>((resolve, reject) => {
    forge.pki.rsa.generateKeyPair(
      { bits: 2048, workers: -1 },
      (err: unknown, keys: forge.pki.rsa.KeyPair | null) => {
        if (err || !keys) reject(err || new Error('Failed to generate RSA key pair'))
        else resolve(keys)
      },
    )
  })

  const csr = forge.pki.createCertificationRequest()
  csr.publicKey = keypair.publicKey

  const subjectAttrs: forge.pki.CertificateField[] = [
    { name: 'commonName', value: params.commonName },
  ]

  if (params.organization) subjectAttrs.push({ name: 'organizationName', value: params.organization })
  if (params.organizationalUnit) subjectAttrs.push({ name: 'organizationalUnitName', value: params.organizationalUnit })
  if (params.locality) subjectAttrs.push({ name: 'localityName', value: params.locality })
  if (params.state) subjectAttrs.push({ name: 'stateOrProvinceName', value: params.state })
  if (params.country) subjectAttrs.push({ name: 'countryName', value: params.country })

  csr.setSubject(subjectAttrs)
  csr.sign(keypair.privateKey, forge.md.sha256.create())

  if (!csr.verify()) {
    throw new Error('CSR verification failed')
  }

  const privateKeyPem = forge.pki.privateKeyToPem(keypair.privateKey)
  const csrPem = forge.pki.certificationRequestToPem(csr)

  return {
    privateKeyPem,
    csrPem,
    downloadPrivateKey: (fileName = `${params.commonName}.key`) => {
      downloadTextFile(fileName, privateKeyPem)
    },
  }
}
