import { Component, ViewChild, Renderer } from '@angular/core';
import { Platform } from 'ionic-angular';
import * as Hammer from 'hammerjs';

@Component({
  selector: 'canvas-draw',
  templateUrl: 'canvas-draw.html'
})
export class CanvasDraw {
 
    @ViewChild('myCanvas') canvas: any;
 
    canvasElement: any;
    lastX: number;
    lastY: number;
    penEnabled: boolean;
    currentColour: string = '#000';
 
    brushSize: number = 4;

    points: Array<{x: number, y: number}>;
    isDrawing: boolean;
    fontSize: number = 25;

    textMoveStartX: number;
    textMoveStartY: number;

    selectedText:number =-1;
    texts: Array<{text: string, x: number, y: number, width: number, height: number}>
 
    constructor(public platform: Platform, public renderer: Renderer) {
        console.log('Hello CanvasDraw Component');
        this.points = [];
        this.isDrawing = false;
        this.penEnabled = true;
        this.texts = [];
    }
 
    ngAfterViewInit(){
 
        this.canvasElement = this.canvas.nativeElement;
 
        this.renderer.setElementAttribute(this.canvasElement, 'width', this.platform.width()-4 + '');
        let ctx = this.canvasElement.getContext('2d');
        ctx.lineWidth = 4;
        ctx.lineJoin = ctx.lineCap = 'round';

        var mc = new Hammer(this.canvasElement);
        mc.get('pan').set({ direction: Hammer.DIRECTION_ALL });
        mc.on("panmove", (ev) => {
            if(this.penEnabled)
                this.handleMove(ev);
            else
                this.textHandleMove(ev);
        });

        mc.on("panstart", (ev) => {
            if(this.penEnabled)
                this.handleStart(ev);
            else {
                this.textStartMove(ev);
            }
        });

        mc.on("panend", (ev) => {
            if(this.penEnabled) {
                this.handleStop();
            } else {
                this.textStopMove();
            }
        });

        mc.on("tap", (ev) => {
            if(this.penEnabled) {
                this.handleStart(ev);
                this.handleMove(ev);
                this.handleStop();
            } else {

            }
        });
    }


    textHittest(x, y, textIndex) {
        var text=this.texts[textIndex];
        return(x >= text.x && 
        x<=text.x + text.width &&
        y>=text.y - text.height && 
        y<=text.y);
    }

    // clears all old texts off the canvas by drawing over them
    clearTexts() {
        let ctx = this.canvasElement.getContext('2d');
        this.texts.forEach((text) => {
            ctx.fillStyle = "#fff";
            ctx.fillRect(text.x-1, text.y-text.height, text.width, text.height);
        });
    }

    redrawTexts() {
        let ctx = this.canvasElement.getContext('2d');
        ctx.fillStyle = "#000";
        for(var i=0;i<this.texts.length;i++){
            var text=this.texts[i];
            ctx.fillText(text.text,text.x,text.y);
        }
    }

    textStartMove(ev) {
         this.textMoveStartX = this.getMousePos(this.canvasElement, ev).x;
        this.textMoveStartY = this.getMousePos(this.canvasElement, ev).y;

        // Put your mousedown stuff here
        for(var i=0;i<this.texts.length;i++){
            if(this.textHittest(this.textMoveStartX,this.textMoveStartY,i)){
                this.selectedText=i;
            }
        }
    }

    textHandleMove(ev) {
        if(this.selectedText<0){return;}

        var mouseX = this.getMousePos(this.canvasElement, ev).x;
        var mouseY = this.getMousePos(this.canvasElement, ev).y;

        var dx = mouseX - this.textMoveStartX;
        var dy = mouseY - this.textMoveStartY;
        this.textMoveStartX = mouseX;
        this.textMoveStartY = mouseY;
        this.clearTexts();
        var text = this.texts[this.selectedText];
        text.x+=dx;
        text.y+=dy;
        this.redrawTexts();

    }

    textStopMove() {
        this.selectedText = -1;
    }
 
    changeColour(colour: string){
        this.penEnabled = true;
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

    addText(text: string) {
        this.penEnabled = false;
        let ctx = this.canvasElement.getContext('2d');

        var textObj = {
            text: text,
            x: this.canvasElement.width/2, 
            y: this.canvasElement.height/2,
            width: 0,
            height: 0
        }

        ctx.font = this.fontSize+"px Pictochat";
        textObj.width = ctx.measureText(textObj.text).width;
        textObj.height = this.fontSize;

        this.texts.push(textObj);

        this.redrawTexts();
    }
 
}