import { parseStringPromise } from "xml2js";
import { ComputeModule, FoundryService } from "@palantir/compute-module";

const BOUNDING_BOX = process.env.BOUNDING_BOX || "-2.93,53.374,-3.085,53.453";
const RELOAD_MS = 10_000;

(async () => {
    const computeModule = new ComputeModule({
        logger: console
    });    
    if (computeModule.environment.type !== "pipelines") {
        throw new Error("Should be pipelines mode")
    }
    const token = computeModule.environment.buildToken;
    const apiKey = computeModule.getCredential("DftApi", "ApiKey");
    if (apiKey == null) {
        throw new Error("API Key missing")
    }
    executeNowAndOnInterval(async ()=>{
        const vehicleActivity = await fetchVehicleActivityForBoundingBox(apiKey, BOUNDING_BOX);
        pushRowsToFoundryStream(computeModule.getServiceApi[FoundryService.STREAM_PROXY],vehicleActivity, token);
    }, RELOAD_MS)
})();

async function fetchVehicleActivityForBoundingBox(
    dftApiKey: string,
    boundingBox: string
) {
    const response = await fetch(`https://data.bus-data.dft.gov.uk/api/v1/datafeed?boundingBox=${boundingBox}&api_key=${dftApiKey}`)
    const rawData = await response.text();
    const jsonData = await parseStringPromise(rawData, {
        explicitArray: false
    })
    const vehicleActivity = jsonData.Siri.ServiceDelivery.VehicleMonitoringDelivery.VehicleActivity.map((d: any) => ({ ...d.MonitoredVehicleJourney, RecordedAtTime: d.RecordedAtTime, ConsumedTime: Date.now() }));
    return vehicleActivity;
}

async function pushRowsToFoundryStream(
    streamProxyApi: string,
    rows: any[],
    foundryToken: string
) {
    // TODO(chrisjeg): Use computeModule.getResource to add dataset and view here, instead of hardcoding
    const postUri = `${streamProxyApi}/streams/ri.foundry.main.dataset.591559f6-b80d-4ebb-b5ca-8610872237c0/views/ri.foundry-streaming.main.view.28b34eb7-352e-4461-8554-8f1db3fec12f/jsonRecords`;
    
    return fetch(
        postUri, {
        method: "POST",
        body: JSON.stringify(rows.map((value: any) => ({ value }))),
        headers: {
            Authorization: "Bearer " + foundryToken,
            ["Content-Type"]: "application/json",
        },
    });
}

function executeNowAndOnInterval(callback: () => void, ms?: number): NodeJS.Timeout {
    callback();
    return setInterval(callback, ms);
}

