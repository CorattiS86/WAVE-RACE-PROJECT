﻿module BABYLON {
    export class BlurPostProcess extends PostProcess {
        constructor(name: string, public direction: Vector2, public blurWidth: number, options: number | PostProcessOptions, camera: Camera, samplingMode: number = Texture.BILINEAR_SAMPLINGMODE, engine?: Engine, reusable?: boolean) {
            super(name, "blur", ["screenSize", "direction", "blurWidth"], null, options, camera, samplingMode, engine, reusable);
            this.onApplyObservable.add((effect: Effect) => {
                effect.setFloat2("screenSize", this.width, this.height);
                effect.setVector2("direction", this.direction);
                effect.setFloat("blurWidth", this.blurWidth);
            });
        }
    
    }
} 