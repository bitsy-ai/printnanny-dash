import type { Camera } from "@bitsy-ai/printnanny-asyncapi-models";
import { defineStore } from "pinia";

export const useCameraSettingsStore = defineStore({
    "id": "cameraSettings",
    state: () => ({
        cameras: [] as Array<Camera>,
        selectedCamera: null as null | Camera
    })
})