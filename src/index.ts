import {Command, flags} from '@oclif/command'
import fetch from 'node-fetch'

class ItinerisltdTwoohoh extends Command {
  static description = 'HTTP status code checker'

  static flags = {
    // add --version flag to show CLI version
    version: flags.version({char: 'v'}),
    help: flags.help({char: 'h'}),
  }

  static strict = false;

  static args = [
    {name: 'url', required: true},
    {name: '...urls'},
  ]

  async run() {
    await Promise.all(
      this.argv.map(url => this.is200(url))
    )

    const count = this.argv.length
    if (count > 1) {
      this.log(`Success: All (${this.argv.length}) URLs return 200 okay`)
    }
  }

  is200(url: string) {
    return fetch(url)
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
