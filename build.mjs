import { connect } from "@dagger.io/dagger"

// initialize Dagger client
connect(
  async (client) => {
    // get reference to the local project
    const source = client.host().directory(".", { exclude: ["node_modules/"] })

    // get Node image
    const node = client.container().from("node:20").withExposedPort(8086)

    // mount cloned repository into Node image
    const runner = node
      .withDirectory("/src", source)
      .withWorkdir("/src")
      .withExec(["npm", "install"])
    // build application
    // write the build output to the host
    await runner
      .withExec(["npm", "run", "start"])
      .directory("/src")
      
  },
  { LogOutput: process.stderr },
)