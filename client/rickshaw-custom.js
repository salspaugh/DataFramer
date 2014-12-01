customHover = Rickshaw.Class.create(Rickshaw.Graph.HoverDetail, {
    render: function(args){
        var graph = this.graph;
        var points = args.points;
        var point = points.filter( function(p) { return p.active } ).shift();

        if (point.value.y === null) return;

        var formattedXValue = point.formattedXValue;
        var formattedYValue = point.formattedYValue;

        if (formattedXValue == "bin") {
            var binrange = d3.extent(point.value);
            if (binrange[0] != binrange[1]) {
                var binlabel = "[" + binrange[0] + " – " + binrange[1] + "]";
                formattedXValue = binlabel;
            } else {
                formattedXValue = binrange[0];
            }

        }

        this.element.innerHTML = '';
        // align with middle of bar
        this.element.style.left = graph.x(point.value.x + (point.value.dx / 2)) + 'px';

        var xLabel = document.createElement('div');

        xLabel.className = 'x_label';
        xLabel.innerHTML = formattedXValue;
        // track to mouse position
        xLabel.style.top = args.mouseY + 20 + 'px';
        this.element.appendChild(xLabel);

        var item = document.createElement('div');

        item.className = 'item';

        // invert the scale if this series displays using a scale
        var series = point.series;
        var actualY = series.scale ? series.scale.invert(point.value.y) : point.value.y;

        item.innerHTML = this.formatter(series, point.value.x, actualY, formattedXValue, formattedYValue, point);
        item.style.top = this.graph.y(point.value.y0 + point.value.y) + 'px';

        this.element.appendChild(item);

        var dot = document.createElement('div');

        dot.className = 'dot';
        dot.style.top = item.style.top;
        dot.style.borderColor = series.color;

        this.element.appendChild(dot);

        if (point.active) {
            item.classList.add('active');
            dot.classList.add('active');
        }

        // Assume left alignment until the element has been displayed and
        // bounding box calculations are possible.
        var alignables = [xLabel, item];
        alignables.forEach(function(el) {
            el.classList.add('left');
        });

        this.show();

        if (typeof this.onRender == 'function') {
            this.onRender(args);
        }
    }

});
