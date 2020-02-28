import {Command, flags} from '@oclif/command'
import fetch, {Headers, RequestInit} from 'node-fetch'

class ItinerisltdTwoohoh extends Command {
  static description = 'HTTP status code checker'

  static flags = {
    // add --version flag to show CLI version
    version: flags.version(),
    help: flags.help(),
    username: flags.string({
      char: 'u',
      description: 'basic auth username',
      env: 'TWOOHOH_USERNAME',
      required: false,
    }),
    password: flags.string({
      char: 'p',
      description: 'basic auth password',
      env: 'TWOOHOH_PASSWORD',
      required: false,
    }),
  }

  static strict = false

  // Wait for https://github.com/oclif/parser/pull/63
  static args = [
    {name: 'url', required: true},
    {name: '...urls'},
  ]

  async run() {
    const count = this.argv.length

    if (count < 1) {
      return this._help()
    }

    if (this.argv[0] === '--version') {
      return this._version()
    }

    const {flags} = this.parse(ItinerisltdTwoohoh)
    const {username, password} = flags

    let options: RequestInit = {}
    if (username && password) {
      options = {
        headers: new Headers({
          Authorization: `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`,
        }),
      }
    }

    await Promise.all(
      this.argv.map(url => this.is200(url, options))
    )

    if (count > 1) {
      this.log(`Success: All (${this.argv.length}) URLs return 200 okay`)
    }
  }

  is200(url: string, options: RequestInit) {
    return fetch(url, options)
    .catch((err: Error) => {
      this.error(`Fail to retrieve ${url}\n${err.name}: ${err.message}`)
    })
    .then(({status, statusText}) => {
      if (status === 200) {
        this.log(`${url} returns 200 okay`)
      } else {
        this.error(`${url} returns ${status} ${statusText}`)
      }
    })
  }
}

export = ItinerisltdTwoohoh
