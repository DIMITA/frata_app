interface KkiapayOptions {
  amount: number
  api_key: string
  sandbox?: boolean
  email?: string
  name?: string
  data?: string
  theme?: string
}

interface KkiapaySuccessResponse {
  transactionId: string
}

declare global {
  function openKkiapayWidget(options: KkiapayOptions): void
  function addKkiapayListener(event: 'success', callback: (response: KkiapaySuccessResponse) => void): void
  function addKkiapayListener(event: 'failed' | 'close', callback: () => void): void
  function removeKkiapayListener(event: string, callback: (...args: unknown[]) => void): void
}

export {}
