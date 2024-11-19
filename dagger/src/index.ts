import { dag, Container, Directory, object, func } from "@dagger.io/dagger"

@object()
class HelloDagger {
  @func()
  build(source: Directory): Container {
    return dag
      .container()
      .from("node:20")
      .withDirectory("/src", source)
      .withWorkdir("/src")
      .withExec(["npm", "install"])
      .withExec(["npm", "run", "start"])
      .withExposedPort(8088)
  }
}