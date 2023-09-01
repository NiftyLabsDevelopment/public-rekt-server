import { Metadata } from "../Types";
import VehicleMetadataJson from "../VehicleFixes/VehicleMetadata.json";

const VehicleMetadata = VehicleMetadataJson as Metadata[];

export function fixVehicleMetadata(metadata: Metadata) {
    for(const m of VehicleMetadata) {

        if(m.image == metadata.image) {
            let trait = m.attributes.find(a => a.trait_type == "While commuting in a");

            if(trait) {
                metadata.attributes.push(trait);
            }

            break;
        }
    }
}
