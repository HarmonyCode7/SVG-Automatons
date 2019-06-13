var console_style = "background: #001A0D; padding: .5rem; font-size: 12px; width: 100%; color: #00FFFF; margin: 0;";
function autorun() 
{
    var svg = new SVG();
    var svgCanvasContainer = document.querySelector(".main-display");
    var svgCanvas = new svg.Canvas(null, {width: "100%", height: "300", 
        style: "background: black; border: 1rem solid 	#4b5e6b;", class: "svg-canvas"
    });
    svgCanvas.AppendTo(svgCanvasContainer);
    console.log(svgCanvas.Size)
    var simpleGrid = new svg.SimpleGrid(svgCanvas.Size.width, 300, 20,{class: "grid-lines", "stroke": "green",
        "stroke-width": .5,
        "style": "cusor: pointer;"
    });
    svgCanvas.AddObject(simpleGrid);
    let sx = svgCanvas.Size.width / 2;
    let sy = svgCanvas.Size.height / 2;
    let circle = new svg.Circle(new Circle(new Point(sx,sy), 50), {stroke: "blue","stroke-width": 2,
     "fill": "rgba(0,0,0,0)", "class": "circle-blue"});
    svgCanvas.AddObject([circle]);
    //var nodeSVGCanvas = document.querySelector(".svg-canvas");
    HighLightSVG(simpleGrid);
    let domCircle = document.querySelector(".circle-blue");
    let circleObj = {
        element: domCircle,
        position: {X: domCircle.cx.baseVal.value, Y: domCircle.cy.baseVal.value},
        r: domCircle.r.baseVal.value
    }

    let rectRed = new svg.Rect({x: 60, y: 140, width: 40, height: 20,
        stroke: "#09f018", "stroke-width": 2, fill:"#09f018"});
    let rectBlue = new svg.Rect({x: 140, y: 160, width: 40, height: 20,
        stroke: "#39a78e", "stroke-width": 2, fill:"#39a78e"});
    let rectPurple = new svg.Rect({x: 220, y: 140, width: 40, height: 20,
        stroke: "#68007f", "stroke-width": 2, fill:"#68007f"});
    svgCanvas.AddObject([rectRed,rectBlue, rectPurple]);

    let svgGenerator = new svg.Generator();
    let manyRects = new svgGenerator.GenerateRect({width: svgCanvas.Size.width,
         height: svgCanvas.Size.height},{width: 40, height: 20}, 10 );
    svgCanvas.AddObject(manyRects);
    let x = circleObj.position.X;
    let y = circleObj.position.Y;
    let dx = .599;
    let dy = 0.05;
    console.log(circleObj.position);
    setInterval(function () {
        

        SetAttributes(circleObj.element, {cx: x, cy: y});
        if(x - circleObj.r + 150 > svgCanvas.Size.width || x < circleObj.r)
        {
            dx = -dx;
        }
        if(y - circleObj.r + 150 > svgCanvas.Size.height || y < circleObj.r)
        {
            dy = -dy;
        }

        
        x+=dx;
        y+= dy;


    }, 1)
}

let moveableObj = {ELEMENT: SVGElement, VERTICES: {X: [50], Y: [50]}, SHAPE_SIZE: 20}

function RandInt(min,max)
{
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}
function RandomColor(min,max)
{
    let R = RandInt(min,max).toString();
    let G = RandInt(min,max).toString();
    let B = RandInt(min,max).toString();
    return "rgb("+R+","+G+","+B+")";
}



function Mover(world,moveableObj, velocity)
{
    let x = moveableObj.VERTICES.X;
    let y = moveableObj.VERTICES.Y;
    
    let 
    if(x - moveableObj.SHAPE_SIZE > world.width || x < moveableObj.SHAPE_SIZE)
    {
        velocity.DY = -velocity.DX;
    }
    if(y - moveableObj.SHAPE_SIZE > world.height || y < moveableObj.SHAPE_SIZE)
    {
        velocity.DY = - velocity.DY
    }


}

function Point(x,y)
{
    this.X = x;
    this.Y = y;
}

function Circle(centre,radius)
{
    this.centre = centre;
    this.r = radius;
}

function Collections()
{
    this.SVG_Collections = function ()
    {
        this.Collections = [];
        this.AddToCollection = function (svg_collectible)
        {

        }
    }
}

function SetAttributes(element, attributes)
{
    Object.keys(attributes).forEach( function (property) {
        element.setAttribute(property, attributes[property]);
    });
}

function SVG()
{
    var svg = {
        ns: "http://www.w3.org/2000/svg",
        create: function (name, attributes) { 
            var element =  document.createElementNS(this.ns, name);
            SetAttributes(element, attributes);
            console.log(element);
            return element;
        }
    }

    
    this.Canvas = function (element, atts)
    {
        
        let timestamp = "TIMESTAMP-09";
        var canvas = element == null ? svg.create("svg", atts) : element;
        this.Size = {width: canvas.parentElement,
            height: canvas.height.baseVal.value};
        this.Element = canvas;
        this.Objects  = [];
        
        let Exists = function (name) 
        {
            return name !== undefined || name !== null || name !== "";
        }
        this.AppendTo = function (parent)
        {
            parent.appendChild(this.Element);
            let selector  = "";
            selector = Exists(atts.class) ? "." + atts.class : 
            Exists(atts.id) ? "#"+atts.id : "."+timestamp;
            let nodeElement = document.querySelector(selector);
            this.Size.width = nodeElement.parentElement.clientWidth;
        }
        this.AddObject = function (obj) {
            this.Objects = [...this.Objects, ...obj];
            this.RenderObjects();
        }
        this.RenderObjects = function ()
        {
            this.Objects.forEach(function (obj) {
                canvas.appendChild(obj);
            })
        }
    }

    this.Circle = function (dimensions, attributes) 
    {
        return svg.create("circle", {cx: dimensions.centre.X, cy: dimensions.centre.Y, 
            r: dimensions.r, ...attributes});
    }
    this.Rect = function (attributes)
    {
        return svg.create("rect", attributes);
    }
    this.FreePath = function (path, attributes)
    {
        return svg.create("path", {d: path, ...attributes});
    };

    this.SimpleGrid = function (width, height, ratio, attributes)
    {
        var x = 0;
        var y = 0;
        var freePath = function (path)
        {
            return svg.create("path", {d: path, ...attributes});
        };
        
        var grid_mesh = [];
        var lineV = freePath("M"+x +" 0l0 "+height, attributes);
        var lineH = freePath("M0 "+ y+"l"+width+ " 0", attributes);
        for(; x < width; x += ratio)
        { 
            lineV = freePath("M"+x +" 0l0 "+height, attributes);
            grid_mesh.push(lineV);
        }

        for(; y < height; y += ratio)
        {
            lineH = freePath("M0 "+ y+"l"+width+ " 0", attributes);
            grid_mesh.push(lineH); 
        }
        return grid_mesh;
    }

    this.Generator = function () 
    {
        this.GenerateRect = function(canvas, rectDimensions, count)
        {
            //rectDimensions contains the width and height of the rects
            let rect = function (attributes)
            {
                return svg.create("rect", attributes);
            }
            let posX = RandInt(1, canvas.width - rectDimensions.width);
            let posY = RandInt(1, canvas.height - rectDimensions.height);
            let atts = {x: posX, y: posY, width: rectDimensions.width, height: rectDimensions.height};
            let color = RandomColor(0,255);
            let styles = {stroke: color, "stroke-width": 2, fill: color };
            let rects = [];
            for(let i = 0; i < count; ++i)
            {
                atts = {x: posX, y: posY, width: rectDimensions.width, height: rectDimensions.height};
                posX = RandInt(1, canvas.width - rectDimensions.width + 150);
                posY = RandInt(1, canvas.height - rectDimensions.height + 150);
                color = RandomColor(0,255);
                styles = {stroke: color, "stroke-width": 2, fill: color };
                rects.push(rect({...atts, ...styles}));
            }
            return rects;
        }
    }
}



let log = 
{
    errorCSS: "background: red; font-size: 16px; padding: 1rem; color: white",
    warningCSS: "background: 		#e9d66b; font-size: 16px; padding: 1rem; color: #031c35",
    successCSS: "background: #39a78e; font-size: 16px; padding: 1rem; color: white;",
    error: function (errorMsg)
    {
        console.log("%c"+errorMsg, this.errorCSS);
    },
    success: function (sucessMsg)
    {
        console.log("%c"+sucessMsg, this.successCSS);
    },
    warning:  function (warningMsg)
    {
        console.log("%c"+warningMsg, this.warningCSS);
    }
}
function HighLightSVG(objects) 
{
    objects.forEach(function (obj) {
        obj.addEventListener("click", function () {
            obj.classList.toggle("highlight");
        });
    })
}

function NSVG()
{
    this.BasicObjects = ["SVG", "CIRCLE", "RECT", "PATH"];
}

console.log("Are we in IE");
if (document.addEventListener) document.addEventListener("DOMContentLoaded", autorun, false);
else if (document.attachEvent) document.attachEvent("onreadystatechange", autorun);
else window.onload = autorun;