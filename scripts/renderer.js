class Renderer {
    // canvas:              object ({id: __, width: __, height: __})
    // num_curve_sections:  int
    constructor(canvas, num_curve_sections, show_points_flag) {
        this.canvas = document.getElementById(canvas.id);
        this.canvas.width = canvas.width;
        this.canvas.height = canvas.height;
        this.ctx = this.canvas.getContext('2d', {willReadFrequently: true});
        this.slide_idx = 0;
        this.num_curve_sections = num_curve_sections;
        this.show_points = show_points_flag;
    }

    // n:  int
    setNumCurveSections(n) {
        this.num_curve_sections = n;
        this.drawSlide(this.slide_idx);
    }

    // flag:  bool
    showPoints(flag) {
        this.show_points = flag;
        this.drawSlide(this.slide_idx);
    }
    
    // slide_idx:  int
    drawSlide(slide_idx) {
        this.slide_idx = slide_idx;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        let framebuffer = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);

        switch (this.slide_idx) {
            case 0:
                this.drawSlide0(framebuffer);
                break;
            case 1:
                this.drawSlide1(framebuffer);
                break;
            case 2:
                this.drawSlide2(framebuffer);
                break;
            case 3:
                this.drawSlide3(framebuffer);
                break;
        }

        this.ctx.putImageData(framebuffer, 0, 0);
    }

    // framebuffer:  canvas ctx image data
    drawSlide0(framebuffer) {
        // TODO: draw at least 2 Bezier curves
        //   - variable `this.num_curve_sections` should be used for `num_edges`
        //   - variable `this.show_points` should be used to determine whether or not to render vertices
        
        let num_curves = 10;

        // Draw multiple curves with a gradient of blue
        for(let i=0; i<num_curves; i++) {
            let v0 = {x: 0, y: 50 + i * 2};
            let v1 = {x: 50, y: 50 + i * 6 * (i+1)};
            let v2 = {x: 600, y: 50 + i * 8 * (i+1)};
            let v3 = {x: 800, y: 50 + i * 4 * (i+1)};
            let col = [Math.round(255 / num_curves + i), Math.round((255 / num_curves) * (num_curves-i)), 255, 255];

            this.drawBezierCurve(v0, v1, v2, v3, this.num_curve_sections, col, framebuffer);

            let points = [v0, v1, v2, v3];
            if(this.show_points) {
                for(let i=0; i<points.length; i++) {
                    this.drawVertex(points[i], col, framebuffer);
                }
            }
        }
        
    }

    // framebuffer:  canvas ctx image data
    drawSlide1(framebuffer) {
        // TODO: draw at least 2 circles
        //   - variable `this.num_curve_sections` should be used for `num_edges`
        //   - variable `this.show_points` should be used to determine whether or not to render vertices
        let num = 20;
        let scale = 4;
        let radius = 100;
        for(let i=0; i<num; i++) {
            let color = [Math.round((255 / num) * (num-i)), 255, Math.round(255 / num + i), 255];
            this.drawCircle({x: 400 + i*scale, y: 300 + i*scale}, radius, this.num_curve_sections, color, framebuffer);
            this.drawCircle({x: 400 - i*scale, y: 300 + i*scale}, radius, this.num_curve_sections, color, framebuffer);
            this.drawCircle({x: 400 + i*scale, y: 300 - i*scale}, radius, this.num_curve_sections, color, framebuffer);
            this.drawCircle({x: 400 - i*scale, y: 300 - i*scale}, radius, this.num_curve_sections, color, framebuffer);

            this.drawCircle({x: 500 + i*scale, y: 300}, radius, this.num_curve_sections, color, framebuffer);
            this.drawCircle({x: 300 - i*scale, y: 300}, radius, this.num_curve_sections, color, framebuffer);
            this.drawCircle({x: 400, y: 350 + i*scale}, radius, this.num_curve_sections, color, framebuffer);
            this.drawCircle({x: 400, y: 250 - i*scale}, radius, this.num_curve_sections, color, framebuffer);
        }
    }

    // framebuffer:  canvas ctx image data
    drawSlide2(framebuffer) {
        // TODO: draw at least 2 convex polygons (each with a different number of vertices >= 5)
        //   - variable `this.show_points` should be used to determine whether or not to render vertices
        
        
        // Following lines are example of drawing a single triangle
        // (this should be removed after you implement the polygon)
        let point_a = {x:  80, y:  40};
        let point_b = {x: 320, y: 160};
        let point_c = {x: 240, y: 360};
        this.drawTriangle(point_a, point_c, point_b, [0, 128, 128, 255], framebuffer);
    }

    // framebuffer:  canvas ctx image data
    drawSlide3(framebuffer) {
        // TODO: draw your name!
        //   - variable `this.num_curve_sections` should be used for `num_edges`
        //   - variable `this.show_points` should be used to determine whether or not to render vertices
        
        
    }

    // p0:           object {x: __, y: __}
    // p1:           object {x: __, y: __}
    // p2:           object {x: __, y: __}
    // p3:           object {x: __, y: __}
    // num_edges:    int
    // color:        array of int [R, G, B, A]
    // framebuffer:  canvas ctx image data
    drawBezierCurve(p0, p1, p2, p3, num_edges, color, framebuffer) {
        // Calculate step size
        let step = 1.0 / num_edges;

        // Initialize prev x and y
        let prevX = undefined;
        let prevY = undefined;
        
        // Iterate through t values from 0 to 1 by the step amount
        for (let t = 0; t < 1; t += step) {
            // Maths to get x and y along the curve based on t
            let t1 = 1 - t;

            let x = Math.round(t1**3 * p0.x + 3 * t1**2 * t * p1.x + 3 * t1 * t**2 * p2.x + t**3 * p3.x)
            let y = Math.round(t1**3 * p0.y + 3 * t1**2 * t * p1.y + 3 * t1 * t**2 * p2.y + t**3 * p3.y)
            
            // Draw a line segment from the previous point to the current point
            if (prevX == undefined && prevY == undefined) {
                this.drawLine(p0, {x: x, y: y}, color, framebuffer);
            } else {
                this.drawLine({x: prevX, y: prevY}, {x: x, y: y}, color, framebuffer);
            }
            
            // Draw vertices if requested
            if(this.show_points) {
                this.drawVertex({x: x, y: y}, color, framebuffer);
                this.drawVertex({x: prevX, y: prevY}, color, framebuffer);
            }

            // Save current point as previous point for the next loop
            prevX = x;
            prevY = y;
        }
        this.drawLine({x: prevX, y: prevY}, p3, color, framebuffer);
    }
    
    // center:       object {x: __, y: __}
    // radius:       int
    // num_edges:    int
    // color:        array of int [R, G, B, A]
    // framebuffer:  canvas ctx image data
    drawCircle(center, radius, num_edges, color, framebuffer) {
        // TODO: draw a sequence of straight lines to approximate a circle

        // Initialize prev x, y
        let prevX = center.x + radius;
        let prevY = center.y;
        
        for (let i=1; i<=num_edges; i++) {
            // Maths to get x and y from polar coordinates
            let angle = (360 / num_edges) * i * (Math.PI / 180); // Convert angle to radians
            let x = Math.round(center.x + radius * Math.cos(angle));
            let y = Math.round(center.y + radius * Math.sin(angle));
            console.log("x: " + x + ", y: " + y);

            // Draw a line segment from the previous point to the current point
            this.drawLine({x: prevX, y: prevY}, {x: x, y: y}, color, framebuffer);

            // Draw vertices if requested
            if(this.show_points) {
                this.drawVertex({x: x, y: y}, color, framebuffer);
                this.drawVertex({x: prevX, y: prevY}, color, framebuffer);
            }

            // Save current point as previous point for the next loop
            prevX = x;
            prevY = y;
        }        
    }
    
    // vertex_list:  array of object [{x: __, y: __}, {x: __, y: __}, ..., {x: __, y: __}]
    // color:        array of int [R, G, B, A]
    // framebuffer:  canvas ctx image data
    drawConvexPolygon(vertex_list, color, framebuffer) {
        // TODO: draw a sequence of triangles to form a convex polygon
        
        
    }
    
    // v:            object {x: __, y: __}
    // color:        array of int [R, G, B, A]
    // framebuffer:  canvas ctx image data
    drawVertex(v, color, framebuffer) {
        // TODO: draw some symbol (e.g. small rectangle, two lines forming an X, ...) centered at position `v`
        let v1 = {x: v.x-4, y: v.y+4};
        let v2 = {x: v.x+4, y: v.y+4};
        let v3 = {x: v.x-4, y: v.y-4};
        let v4 = {x: v.x+4, y: v.y-4};
        this.drawTriangle(v1, v3, v2, color, framebuffer);
        this.drawTriangle(v2, v4, v3, color, framebuffer);
    }
    
    /***************************************************************
     ***       Basic Line and Triangle Drawing Routines          ***
     ***       (code provided from in-class activities)          ***
     ***************************************************************/
    pixelIndex(x, y, framebuffer) {
	    return 4 * y * framebuffer.width + 4 * x;
    }
    
    setFramebufferColor(color, x, y, framebuffer) {
	    let p_idx = this.pixelIndex(x, y, framebuffer);
        for (let i = 0; i < 4; i++) {
            framebuffer.data[p_idx + i] = color[i];
        }
    }
    
    swapPoints(a, b) {
        let tmp = {x: a.x, y: a.y};
        a.x = b.x;
        a.y = b.y;
        b.x = tmp.x;
        b.y = tmp.y;
    }

    drawLine(p0, p1, color, framebuffer) {
        if (Math.abs(p1.y - p0.y) <= Math.abs(p1.x - p0.x)) { // |m| <= 1
            if (p0.x < p1.x) {
                this.drawLineLow(p0.x, p0.y, p1.x, p1.y, color, framebuffer);
            }
            else {
                this.drawLineLow(p1.x, p1.y, p0.x, p0.y, color, framebuffer);
            }
        }
        else {                                                // |m| > 1
            if (p0.y < p1.y) {
                this.drawLineHigh(p0.x, p0.y, p1.x, p1.y, color, framebuffer);
            }
            else {
                this.drawLineHigh(p1.x, p1.y, p0.x, p0.y, color, framebuffer);
            }
        }
    }
    
    drawLineLow(x0, y0, x1, y1, color, framebuffer) {
        let A = y1 - y0;
        let B = x0 - x1;
        let iy = 1; // y increment (+1 for positive slope, -1 for negative slop)
        if (A < 0) {
            iy = -1;
            A *= -1;
        }
        let D = 2 * A + B;
        let D0 = 2 * A;
        let D1 = 2 * A + 2 * B;
    
        let y = y0;
        for (let x = x0; x <= x1; x++) {
            this.setFramebufferColor(color, x, y, framebuffer);
            if (D <= 0) {
                D += D0;
            }
            else {
                D += D1;
                y += iy;
            }
        }
    }
    
    drawLineHigh(x0, y0, x1, y1, color, framebuffer) {
        let A = x1 - x0;
        let B = y0 - y1;
        let ix = 1; // x increment (+1 for positive slope, -1 for negative slop)
        if (A < 0) {
            ix = -1;
            A *= -1;
        }
        let D = 2 * A + B;
        let D0 = 2 * A;
        let D1 = 2 * A + 2 * B;
    
        let x = x0;
        for (let y = y0; y <= y1; y++) {
            this.setFramebufferColor(color, x, y, framebuffer);
            if (D <= 0) {
                D += D0;
            }
            else {
                D += D1;
                x += ix;
            }
        }
    }
    
    drawTriangle(p0, p1, p2, color, framebuffer) {
        // Deep copy, then sort points in ascending y order
        p0 = {x: p0.x, y: p0.y};
        p1 = {x: p1.x, y: p1.y};
        p2 = {x: p2.x, y: p2.y};
        if (p1.y < p0.y) this.swapPoints(p0, p1);
        if (p2.y < p0.y) this.swapPoints(p0, p2);
        if (p2.y < p1.y) this.swapPoints(p1, p2);
        
        // Edge coherence triangle algorithm
        // Create initial edge table
        let edge_table = [
            {x: p0.x, inv_slope: (p1.x - p0.x) / (p1.y - p0.y)}, // edge01
            {x: p0.x, inv_slope: (p2.x - p0.x) / (p2.y - p0.y)}, // edge02
            {x: p1.x, inv_slope: (p2.x - p1.x) / (p2.y - p1.y)}  // edge12
        ];
        
        // Do cross product to determine if pt1 is to the right/left of edge02
        let v01 = {x: p1.x - p0.x, y: p1.y - p0.y};
        let v02 = {x: p2.x - p0.x, y: p2.y - p0.y};
        let p1_right = ((v01.x * v02.y) - (v01.y * v02.x)) >= 0;
        
        // Get the left and right edges from the edge table (lower half of triangle)
        let left_edge, right_edge;
        if (p1_right) {
            left_edge = edge_table[1];
            right_edge = edge_table[0];
        }
        else {
            left_edge = edge_table[0];
            right_edge = edge_table[1];
        }
        // Draw horizontal lines (lower half of triangle)
        for (let y = p0.y; y < p1.y; y++) {
            let left_x = parseInt(left_edge.x) + 1;
            let right_x = parseInt(right_edge.x);
            if (left_x <= right_x) { 
                this.drawLine({x: left_x, y: y}, {x: right_x, y: y}, color, framebuffer);
            }
            left_edge.x += left_edge.inv_slope;
            right_edge.x += right_edge.inv_slope;
        }
        
        // Get the left and right edges from the edge table (upper half of triangle) - note only one edge changes
        if (p1_right) {
            right_edge = edge_table[2];
        }
        else {
            left_edge = edge_table[2];
        }
        // Draw horizontal lines (upper half of triangle)
        for (let y = p1.y; y < p2.y; y++) {
            let left_x = parseInt(left_edge.x) + 1;
            let right_x = parseInt(right_edge.x);
            if (left_x <= right_x) {
                this.drawLine({x: left_x, y: y}, {x: right_x, y: y}, color, framebuffer);
            }
            left_edge.x += left_edge.inv_slope;
            right_edge.x += right_edge.inv_slope;
        }
    }
};

export { Renderer };
