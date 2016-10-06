﻿module BABYLON {
    export class LinesMesh extends Mesh {
        public color = new Color3(1, 1, 1);
        public alpha = 1;

        private _positionBuffer: { [key: string]: VertexBuffer } = {};

        /**
         * The intersection Threshold is the margin applied when intersection a segment of the LinesMesh with a Ray.
         * This margin is expressed in world space coordinates, so its value may vary.
         * Default value is 0.1
         * @returns the intersection Threshold value.
         */
        public get intersectionThreshold(): number {
            return this._intersectionThreshold;
        }

        /**
         * The intersection Threshold is the margin applied when intersection a segment of the LinesMesh with a Ray.
         * This margin is expressed in world space coordinates, so its value may vary.
         * @param value the new threshold to apply
         */
        public set intersectionThreshold(value: number) {
            if (this._intersectionThreshold === value) {
                return;
            }

            this._intersectionThreshold = value;
            if (this.geometry) {
                this.geometry.boundingBias = new Vector2(0, value);
            }
        }

        private _intersectionThreshold: number;
        private _colorShader: ShaderMaterial;

        constructor(name: string, scene: Scene, parent: Node = null, source?: LinesMesh, doNotCloneChildren?: boolean) {
            super(name, scene, parent, source, doNotCloneChildren);

            if (source) {
                this.color = source.color.clone();
                this.alpha = source.alpha;
            }

            this._intersectionThreshold = 0.1;
            this._colorShader = new ShaderMaterial("colorShader", scene, "color",
                {
                    attributes: [VertexBuffer.PositionKind],
                    uniforms: ["worldViewProjection", "color"],
                    needAlphaBlending: true
                });

            this._positionBuffer[VertexBuffer.PositionKind] = null;
        }

        public get material(): Material {
            return this._colorShader;
        }

        public get checkCollisions(): boolean {
            return false;
        }

        public createInstance(name: string): InstancedMesh {
            Tools.Log("LinesMeshes do not support createInstance.");
            return null;
        }

        public _bind(subMesh: SubMesh, effect: Effect, fillMode: number): void {
            var engine = this.getScene().getEngine();

            this._positionBuffer[VertexBuffer.PositionKind] = this._geometry.getVertexBuffer(VertexBuffer.PositionKind);

            // VBOs
            engine.bindBuffers(this._positionBuffer, this._geometry.getIndexBuffer(), this._colorShader.getEffect());

            // Color
            this._colorShader.setColor4("color", this.color.toColor4(this.alpha));
        }

        public _draw(subMesh: SubMesh, fillMode: number, instancesCount?: number): void {
            if (!this._geometry || !this._geometry.getVertexBuffers() || !this._geometry.getIndexBuffer()) {
                return;
            }

            var engine = this.getScene().getEngine();

            // Draw order
            engine.draw(false, subMesh.indexStart, subMesh.indexCount);
        }

        public dispose(doNotRecurse?: boolean): void {
            this._colorShader.dispose();

            super.dispose(doNotRecurse);
        }

        public clone(name: string, newParent?: Node, doNotCloneChildren?: boolean): LinesMesh {
            return new LinesMesh(name, this.getScene(), newParent, this, doNotCloneChildren);
        }
    }
} 
