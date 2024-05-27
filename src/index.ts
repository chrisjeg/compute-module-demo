import { ComputeModule } from "@chrisjeg/compute-module";
import { Type } from "@sinclair/typebox";

const computeModule = new ComputeModule({
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

computeModule.register("currentDate", async (input) => {
  return {
    foo: input.foo,
    currentDate: new Date().toISOString(),
  };
});
