declare module "fps-meter" {
    function start(): void;
    function stop(): void;
    function running(): boolean;

    function addCallback(callback: (fps: number, minFps?: number) => void): number;
    function removeCallback(id: number);
}