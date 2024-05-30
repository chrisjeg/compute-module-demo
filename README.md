# compute-module-demo

This is an example of a Compute Module using Typescript that can be built locally and pushed to Foundry, if Compute Modules are enabled for your Foundry installation. You can start by downloading this repository as a zip!

## Prerequisites

To build this repository locally, you will need:
  - Node.JS (v20 or higher)
  - Docker Desktop

I recommend installing [Node.JS using NVM](https://github.com/nvm-sh/nvm)

## Navigating this repository

The files in this repository show the minimum set up needed for a Compute Module written in TypeScript, we leverage my NPM library [@chrisjeg/compute-module](https://github.com/chrisjeg/typescript-compute-module) to manage interfacing with the Compute Module API. The code is open-source, feel free to check out how the interface is implemented.

TypeScript files (Used for writing our logic)
- `src/index.ts` - Any logic you want to author will be found in here, we currently have a simple query that takes a string and returns it alongside the current date.
- `package.json` - The dependencies of our TypeScript code. `package-lock.json` ensures we get the same dependencies every time we build.
- `tsconfig.json` - Compiler options for TypeScript to compile our code, this lets the compiler know we are going to be writing code to execute in Node.JS.

Docker files (Used to build our container)
- `.dockerignore` - Files excluded from being included in the Docker build context, this allows the build to run faster and exclude
- `Dockerfile` - The build instructions for Docker to create a container with Node.JS to execute our code and our code inside.

GitHub files (Used to set up CI/CD)
- `.github/workflows/build-and-release-to-foundry.yml` - This is an example of how you can set up a GitHub repository to auto release to Foundry

## 🔨 Developing and building your code locally

To start working locally, go to your terminal and run `npm install` in the compute-module-demo directory to install the dependencies described in `package.json`.

After iterating on the code, running `npm run build` will create the JavaScript files that Node.JS will execute in `/dist`.

To run the code you can run `node dist/index.js`. This will throw as you are not running in a Compute Module environment.

## 🚢 Shipping your code to Foundry

Our Dockerfile describes the steps above to Docker, so that we can ship the code to run inside Foundry. To start, create an Artifacts repository and navigate to Push > Docker.

Follow the steps on this page, giving your container a unique name that you want it to be identified as in Foundry. You can keep the tag as `latest` or choose some meaningful version.

Once your code is in an Artifacts repository, you can create a new Compute Module and add that container to the module, give that container a unique name so we can find it later. Hit start and you should be able to try the function. The query that ships with this example would be called:

Query name: `currentDate`

Query JSON:
```json
{
  "foo": "bar"
}
```

## 🔁 Continuously deploy using GitHub Actions

You may choose to upload this repository to GitHub for version control, this repo includes a template for setting up continuous deployment using GitHub actions. You will need to set up a Third Party Application in Foundry's Control Panel to act on your behalf when shipping containers and upgrading the compute module. You will need to share the artifacts repository and the compute module with this

The following parameters need to be added to your GitHub repository:

- Secrets
  - FOUNDRY_INSTANCE: The URL of your Foundry instance (e.g. `my-foundry.com`)
  - FOUNDRY_CLIENT_ID: The ID of your Third Party Application
  - FOUNDRY_CLIENT_SECRET: The secret from your 3PA
- Variables
  - artifacts_rid: The resource identifier of the Artifacts repository you created.
  - compute_module_rid: The resource identifier of the Compute Module you created.
  - container_name: The name you defined in the Compute Module when shipping your code

To ship, just create a GitHub release and the workflow will be triggered.

