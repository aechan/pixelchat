import { Component, ViewChild, Renderer } from '@angular/core';
import { Platform } from 'ionic-angular';
 
@Component({
  selector: 'canvas-draw',
  templateUrl: 'canvas-draw.html'
})
export class CanvasDraw {
 
    @ViewChild('myCanvas') canvas: any;
 
    canvasElement: any;
    lastX: number;
    lastY: number;
 
    currentColour: string = '#000';
 
    brushSize: number = 4;

    points: Array<{x: number, y: number}>;
    isDrawing: boolean;
 
    constructor(public platform: Platform, public renderer: Renderer) {
        console.log('Hello CanvasDraw Component');
        this.points = [];
        this.isDrawing = false;
    }
 
    ngAfterViewInit(){
 
        this.canvasElement = this.canvas.nativeElement;
 
        this.renderer.setElementAttribute(this.canvasElement, 'width', this.platform.width()-4 + '');
        let ctx = this.canvasElement.getContext('2d');
        ctx.lineWidth = 4;
        ctx.lineJoin = ctx.lineCap = 'round';
    }
 
    changeColour(colour: string){
        this.currentColour = colour;
        let ctx = this.canvasElement.getContext('2d');
        ctx.strokeStyle = this.currentColour;
    }

    logEvent(ev) {
        console.log(ev);
    }

    handleStart(ev) {
        console.log("start panning");
        this.isDrawing = true;
        var x = this.getMousePos(this.canvasElement, ev).x;
        var y = this.getMousePos(this.canvasElement, ev).y;
        this.points.push({ x: x, y: y });
    }
 
    handleMove(ev){
        if (!this.isDrawing) return;
        console.log("start moving");
        let ctx = this.canvasElement.getContext('2d');
        let currentX = this.getMousePos(this.canvasElement, ev).x;
        let currentY = this.getMousePos(this.canvasElement, ev).y;

        //ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        this.points.push({ x: currentX, y: currentY });

        ctx.beginPath();
        ctx.moveTo(this.points[0].x, this.points[0].y);
        for(var i = 1; i < this.points.length; i++) {
            ctx.lineTo(this.points[i].x, this.points[i].y);
        }
        ctx.stroke();
    }

    handleStop() {
        this.isDrawing = false;
        this.points.length = 0;
    }
 
    clearCanvas(){
        let ctx = this.canvasElement.getContext('2d');
        ctx.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);  
    }

    getCanvasData(): string {
        return this.canvasElement.toDataURL();
    }

    getMousePos(canvas, evt) {
        var rect = canvas.getBoundingClientRect();
        return {
          x: evt.center.x - rect.left,
          y: evt.center.y - rect.top
        };
    }
 
}