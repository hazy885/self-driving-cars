class StopEditor {
    constructor(viewport, world) {
      this.viewport = viewport;
      this.world = world;

      this.canvas = viewport.canvas;
      this.ctx = this.canvas.getContext("2d");

      this.mouse = null;
      this.intent = null;
    }

    enable() {
        this.#addEventListeners();
      }
    
      disable() {
        this.#removeEventListeners();
      }
    
      #addEventListeners() {
        this.boundMouseDown = this.#handleMouseDown.bind(this);
        this.boundMouseMove = this.#handleMouseMove.bind(this);
        this.boundContextMenu = (evt) => evt.preventDefault();
        this.canvas.addEventListener("mousedown", this.boundMouseDown);
        this.canvas.addEventListener("mousemove", this.boundMouseMove); 
        this.canvas.addEventListener("mouseup", this.boundMouseUp);
        this.canvas.addEventListener("contextmenu", this.boundContextMenu);
      }
    
      
      #removeEventListeners() {
        this.canvas.removeEventListener("mousedown", this.boundMouseDown);
        this.canvas.removeEventListener("mousemove", this.boundMouseMove); 
        this.canvas.removeEventListener("contextmenu", this.boundContextMenu);
       
      }

      #handleMouseMove(evt) {
        this.mouse = this.viewport.getMouse(evt, true);
          const seg = getNearestSegment(
            this.mouse, 
            this.world.lineGuides,
            10 * this.viewport.zoom
        );
        if (seg) {
            const proj = seg.projectPoint(this.mouse);
            if (proj.offset >= 0 && proj.offset <= 1) {
                this.intent = new Stop(
                    proj.point,
                    seg.directionVector(),
                    world.roadWidth,
                    world.roadWidth / 2
                )
            } else {
                this.intent = null;
            }
        } else {
            this.intent = null;
        }
      }

      #handleMouseDown(evt) {

      }

      display() {
        if (this.intent) {
            this.intent.draw(this.ctx);
        }
      }
}