import { dag, Container, Directory, object, func } from "@dagger.io/dagger"

@object()
class NodeApiDemo {
  @func()
  async publish(source: Directory): Promise<string> {
    return await this.build(source).publish(
      "ttl.sh/myapp-" + Math.floor(Math.random() * 10000000)
    );
  }

  @func()
  build(source: Directory): Container {
    const nodeCache = dag.cacheVolume("node")
    return (
      dag
        .container()
        // start from a base Node.js container
        .from("node:21-slim")
        // add the source code at /src
        .withDirectory("/src", source)
        // mount the cache volume at /root/.npm
        .withMountedCache("/root/.npm", nodeCache)
        // change the working directory to /src
        .withWorkdir("/src")
        // run npm install to install dependencies
        .withExec(["npm", "install"])
        .withEntrypoint(["npm", "run", "start"])
        .withExposedPort(8080)
    )
  }
}