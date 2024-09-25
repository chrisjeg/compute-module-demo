# compute-module-demo (Pipelines)

This is an example of a Pipelines Compute Module using Typescript that can be built locally and pushed to Foundry, if Compute Modules are enabled for your Foundry installation. You can start by downloading this repository as a zip!

## Prerequisites

To build this repository locally, you will need:
  - Node.JS (v20 or higher)
  - Docker Desktop

I recommend installing [Node.JS using NVM](https://github.com/nvm-sh/nvm)

## Navigating this repository

The files in this repository show the minimum set up needed for a Pipelines Compute Module written in TypeScript, we leverage Palantir's NPM library [@palantir/compute-module](https://github.com/palantir/typescript-compute-module) to manage interfacing with the Compute Module API. The code is open-source, feel free to check out how the interface is implemented.

TypeScript files (Used for writing our logic)
- `src/index.ts` - Any logic you want to author will be found in here, in this example we hit the UK Department For Transport API and stream the 
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

Follow the steps on this page, giving your container a unique name that you want it to be identified as in Foundry. A good starting tag is `0.0.1` to start tracking your tags with [semantic versioning](https://semver.org/).

Once your code is in an Artifacts repository, you can create a new Compute Module and add that container to the module, give that container a unique name so we can find it later. You will need to add a streaming dataset as an output, you can create a streaming dataset by selecting New > Stream in the same project as your code. You can generate the schema by pasting in this JSON sample:

```json
{"LineRef":"106","DirectionRef":"outbound","FramedVehicleJourneyRef":{"DataFrameRef":"2024-09-25","DatedVehicleJourneyRef":"1000"},"PublishedLineName":"106","OperatorRef":"A2BV","OriginRef":"2800S24007B","OriginName":"Monk_Road","DestinationRef":"2800S24003E","DestinationName":"Dominick_House","OriginAimedDepartureTime":"2024-09-25T09:00:00+00:00","DestinationAimedArrivalTime":"2024-09-25T09:42:00+00:00","VehicleLocation":{"Longitude":"-3.032225","Latitude":"53.424053"},"Bearing":"309","BlockRef":"8","VehicleRef":"REF","RecordedAtTime":"2024-09-25T09:03:28+00:00","ConsumedTime":1727255039640}
```

You will also need to add a source with api key "DftApi" and secret name "ApiKey" which provides egress to "https://data.bus-data.dft.gov.uk" added to the Compute Module.

## 🔁 Continuously deploy using GitHub Actions

You may choose to upload this repository to GitHub for version control, this repo includes a template for setting up continuous deployment using GitHub actions. You will need to set up a Third Party Application in Foundry's Control Panel to act on your behalf when shipping containers and upgrading the compute module. You will need to share the artifacts repository and the compute module with this

The following parameters need to be added to your GitHub repository:

- Secrets
  - FOUNDRY_INSTANCE: The URL of your Foundry instance (e.g. `my-foundry.com`)
  - FOUNDRY_CLIENT_ID: The ID of your Third Party Application (3PA)
  - FOUNDRY_CLIENT_SECRET: The secret from your 3PA
- Variables
  - artifacts_rid: The resource identifier of the Artifacts repository you created.
  - compute_module_rid: The resource identifier of the Compute Module you created.
  - container_name: The name you defined in the Compute Module when shipping your code

To ship, just create a GitHub release and the workflow will be triggered.

