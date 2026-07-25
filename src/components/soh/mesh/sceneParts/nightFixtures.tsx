import React from "react";
import { NightGlowInstances } from "../nightGlow";
import { SailFloodlight } from "../sailFloodlight";
import { DockLight } from "../dockLight";
import type { DockLightingConfig, SailFloodlightConfig } from "../types";
import {
  DOCK_LED_COLOR,
  DOCK_LIGHT_DROP,
  DOCK_LIGHT_HEIGHT_OFFSET,
  DOCK_LIGHT_THROW,
  DOCK_WATERLINE_Y,
  THINNED_DOCK_SPOTLIGHT_POSITIONS,
} from "../waterline/dockWaterline";
import {
  LANDSCAPE_LIGHT_COLOR,
  PARKING_LOT_MARKER_POSITIONS,
} from "../parkingLot";

// Root-level, night-only fixtures: the sail floodlights, the sparse
// hand-placed dock spotlights, the dense dock LED marker line (purely
// visual - see NightGlow), and the parking-lot/plaza perimeter markers.
// Rendered as siblings to the main model group rather than nested inside
// it, since none of these need the model's own transform chain.
export const NightFixtures = ({
  isNight,
  sailFloodlights,
  dockLighting,
  dockLedMarkerPositions,
}: {
  isNight: boolean;
  sailFloodlights: SailFloodlightConfig[];
  dockLighting: DockLightingConfig;
  dockLedMarkerPositions: [number, number, number][];
}) => {
  if (!isNight) return null;

  return (
    <>
      {sailFloodlights.map((floodlight, i) => (
        <SailFloodlight
          key={`sail-floodlight-${i}`}
          position={floodlight.position}
          target={floodlight.target}
          angle={floodlight.angle}
          intensity={floodlight.intensity}
        />
      ))}
      {THINNED_DOCK_SPOTLIGHT_POSITIONS.map(([x, z, outX, outZ], i) => {
        // Deliberately underwater, not raised to the waterline: the water
        // surface is a raw ShaderMaterial with no `lights: true`, so it
        // never receives light from this fixture at all - what it's
        // actually illuminating is the stone promenade wall behind it,
        // which has a hard geometric edge nearby. Underwater, that edge is
        // seen through the translucent water surface, which blends over it
        // and softens it into a clean-looking pool. Raised above the
        // waterline, the same edge renders with nothing softening it and
        // shows up as a harsh, flat-cut clip instead. DOCK_LIGHT_HEIGHT_OFFSET
        // is a shallower depth than dockLighting.depth (used below for the
        // target/LED markers) - still enough to stay under that softening
        // water surface, but higher than the original depth read as
        // sitting too deep.
        const position: [number, number, number] = [
          x,
          DOCK_WATERLINE_Y - DOCK_LIGHT_HEIGHT_OFFSET,
          z,
        ];
        const target: [number, number, number] = [
          x + outX * DOCK_LIGHT_THROW,
          DOCK_WATERLINE_Y - dockLighting.depth - DOCK_LIGHT_DROP,
          z + outZ * DOCK_LIGHT_THROW,
        ];
        return (
          <DockLight
            key={`dock-spotlight-${i}`}
            position={position}
            target={target}
            intensity={dockLighting.intensity}
            angle={dockLighting.angle}
          />
        );
      })}
      <NightGlowInstances
        positions={dockLedMarkerPositions}
        color={DOCK_LED_COLOR}
        radius={0.01}
        brightness={0.8}
      />
      {/* Stair/tree/parking-lot real spotlights removed entirely - the
          parking-lot markers just below (NightGlowInstances, not a
          THREE.Light) are the only thing left tracing that area, and cost
          nothing in the fragment-shader light loop. */}
      <NightGlowInstances
        positions={PARKING_LOT_MARKER_POSITIONS}
        color={LANDSCAPE_LIGHT_COLOR}
        radius={0.01}
        brightness={0.7}
      />
    </>
  );
};
