import { ComputeModule } from "@chrisjeg/compute-module";
import { Type } from "@sinclair/typebox";

const module = new ComputeModule({
  logger: console,
  definitions: {
    currentDate: {
      input: Type.Object({
        foo: Type.String(),
      }),
      output: Type.Object({
        foo: Type.String(),
        currentDate: Type.String(),
      }),
    },
  },
});

module.register("currentDate", async (input) => {
  return {
    foo: input.foo,
    currentDate: new Date().toISOString(),
  };
});
