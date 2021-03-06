"use strict";

const cliRunner = require("@lerna-test/cli-runner");
const initFixture = require("@lerna-test/init-fixture")(__dirname);

// normalize temp directory paths in snapshots
expect.addSnapshotSerializer(require("@lerna-test/serialize-windows-paths"));
expect.addSnapshotSerializer(require("@lerna-test/serialize-tempdir"));

// ls never makes changes to repo, so we only need one fixture + runner
let lerna;

beforeAll(async () => {
  const cwd = await initFixture("lerna-ls");

  lerna = cliRunner(cwd);
});

test("lerna list", async () => {
  const { stdout } = await lerna("list");
  expect(stdout).toMatchInlineSnapshot(`
package-1
@test/package-2
package-3
`);
});

test("lerna ls", async () => {
  const { stdout } = await lerna("ls");
  expect(stdout).toMatchInlineSnapshot(`
package-1
@test/package-2
package-3
`);
});

test("lerna ls --all", async () => {
  const { stdout } = await lerna("ls", "--all");
  expect(stdout).toMatchInlineSnapshot(`
package-1
@test/package-2
package-3
package-4       (PRIVATE)
`);
});

test("lerna ls --long", async () => {
  const { stdout } = await lerna("ls", "--long");
  expect(stdout).toMatchInlineSnapshot(`
package-1        v1.0.0 packages/pkg-1
@test/package-2  v2.0.0 packages/pkg-2
package-3       MISSING packages/pkg-3
`);
});

test("lerna ls --parseable", async () => {
  const { stdout } = await lerna("ls", "--parseable");
  expect(stdout).toMatchInlineSnapshot(`
<PROJECT_ROOT>/packages/pkg-1
<PROJECT_ROOT>/packages/pkg-2
<PROJECT_ROOT>/packages/pkg-3
`);
});

test("lerna ls --all --long --parseable", async () => {
  const { stdout } = await lerna("ls", "-alp");
  expect(stdout).toMatchInlineSnapshot(`
<PROJECT_ROOT>/packages/pkg-1:package-1:1.0.0
<PROJECT_ROOT>/packages/pkg-2:@test/package-2:2.0.0
<PROJECT_ROOT>/packages/pkg-3:package-3:MISSING
<PROJECT_ROOT>/packages/pkg-4:package-4:4.0.0:PRIVATE
`);
});

test("lerna la", async () => {
  const { stdout } = await lerna("la");
  expect(stdout).toMatchInlineSnapshot(`
package-1        v1.0.0 packages/pkg-1
@test/package-2  v2.0.0 packages/pkg-2
package-3       MISSING packages/pkg-3
package-4        v4.0.0 packages/pkg-4 (PRIVATE)
`);
});

test("lerna ll", async () => {
  const { stdout } = await lerna("ll");
  expect(stdout).toMatchInlineSnapshot(`
package-1        v1.0.0 packages/pkg-1
@test/package-2  v2.0.0 packages/pkg-2
package-3       MISSING packages/pkg-3
`);
});
