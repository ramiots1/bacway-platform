declare module 'resend' {
  export class Resend {
    constructor(apiKey: string)
    emails: {
      send(params: {
        from: string
        to: string | string[]
        subject: string
        react?: any
        html?: string
        text?: string
      }): Promise<{ data?: { id?: string }; error?: any }>
    }
  }
}
